/**
 * Donation Service
 * Business logic layer for donation operations
 */
import donationRepository from "../../repositories/DonationRepository.js";
import campaignRepository from "../../repositories/CampaignRepository.js";
import userRepository from "../../repositories/UserRepository.js";
import {
  initializePayment,
  verifyPayment,
} from "../external/PaystackService.js";
import { sendEmail } from "../../services/emailService.js";
import { generateReceipt } from "../../services/receiptService.js";
import { uploadDocument } from "../../services/uploadService.js";
import {
  PAYMENT,
  DONATION_STATUS,
  APPROVAL_STATUS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} from "../../constants/index.js";
import {
  ValidationError,
  NotFoundError,
  PaymentError,
} from "../../utils/customErrors.js";
import fs from "fs";
import logger from "../../config/logger.js";

class DonationService {
  /**
   * Initialize a donation
   * @param {Object} donationData - Donation data
   * @param {string} donationData.campaignId - Campaign ID
   * @param {number} donationData.amount - Donation amount
   * @param {string} donationData.paymentMethod - Payment method
   * @param {Object} donorInfo - Donor information
   * @returns {Promise<Object>} Initialized donation with payment data
   */
  async initializeDonation(donationData, donorInfo = {}) {
    const {
      campaignId,
      amount,
      paymentMethod,
      anonymous,
      isRecurring,
      recurringFrequency,
      donorNote,
    } = donationData;
    const { user, ipAddress, userAgent } = donorInfo;

    // Validate amount
    if (!amount || amount < PAYMENT.MIN_AMOUNT) {
      throw new ValidationError(ERROR_MESSAGES.INVALID_AMOUNT);
    }

    // Get campaign
    const campaign = await campaignRepository.findById(campaignId);
    if (!campaign) {
      throw new NotFoundError("Campaign");
    }

    // Validate campaign is accepting donations
    if (campaign.status !== "active" || !campaign.isActive) {
      throw new ValidationError(ERROR_MESSAGES.CAMPAIGN_NOT_ACTIVE);
    }

    if (new Date() > new Date(campaign.endDate)) {
      throw new ValidationError(ERROR_MESSAGES.CAMPAIGN_ENDED);
    }

    // Generate payment reference
    const paymentReference = this._generatePaymentReference();

    // Determine donor identity
    const donorId = user?._id || null;
    const donorEmail = user?.email || donorInfo.email || "";
    const donorName = anonymous
      ? "Anonymous"
      : user?.fullName ||
        `${donorInfo.firstName || ""} ${donorInfo.lastName || ""}`.trim();

    // Create donation record
    const donation = await donationRepository.create({
      donor: donorId,
      campaign: campaignId,
      amount,
      paymentMethod,
      paymentReference,
      anonymous: anonymous || false,
      isRecurring: isRecurring || false,
      recurringFrequency: isRecurring ? recurringFrequency : undefined,
      donorNote: donorNote || "",
      status: DONATION_STATUS.PENDING,
      approvalStatus: APPROVAL_STATUS.PENDING,
      guestInfo: !user
        ? {
            firstName: donorInfo.firstName,
            lastName: donorInfo.lastName,
            email: donorInfo.email,
          }
        : undefined,
      metadata: {
        ipAddress,
        userAgent,
        platform: "web",
      },
    });

    let paymentData = null;

    // Initialize payment for online methods
    if (["card", "bank_transfer", "ussd"].includes(paymentMethod)) {
      try {
        const paystackResponse = await initializePayment({
          email: donorEmail,
          amount: amount * PAYMENT.KOBO_MULTIPLIER,
          reference: paymentReference,
          callback_url: `${process.env.FRONTEND_URL}/payment/callback?reference=${paymentReference}`,
          metadata: {
            donationId: donation._id.toString(),
            campaignId: campaignId,
            donorName,
            campaignTitle: campaign.title,
            custom_fields: [
              {
                display_name: "Donation ID",
                variable_name: "donation_id",
                value: donation.donationId,
              },
            ],
          },
          channels: [
            "card",
            "bank",
            "ussd",
            "qr",
            "mobile_money",
            "bank_transfer",
          ],
        });

        if (paystackResponse.status) {
          await donationRepository.updateById(donation._id, {
            paystackReference: paystackResponse.data.reference,
            status: DONATION_STATUS.PROCESSING,
          });

          paymentData = {
            authorizationUrl: paystackResponse.data.authorization_url,
            accessCode: paystackResponse.data.access_code,
            reference: paystackResponse.data.reference,
          };
        } else {
          await donationRepository.updateStatus(
            donation._id,
            DONATION_STATUS.FAILED,
            { failureReason: "Payment initialization failed" },
          );
          throw new PaymentError(ERROR_MESSAGES.PAYMENT_INIT_FAILED);
        }
      } catch (error) {
        logger.error("Paystack initialization error:", {
          error: error.message,
          donationId: donation._id,
          campaignId: campaignId,
        });

        await donationRepository.updateStatus(
          donation._id,
          DONATION_STATUS.FAILED,
          { failureReason: error.message },
        );

        throw new PaymentError(
          error.message || ERROR_MESSAGES.PAYMENT_INIT_FAILED,
        );
      }
    }

    // Send confirmation email
    if (donorEmail && !anonymous) {
      try {
        await sendEmail({
          to: donorEmail,
          subject: "Donation Protocol Initialized",
          template: "paymentPending",
          data: {
            donorName,
            amount: donation.amount,
            campaignTitle: campaign.title,
            donationId: donation.donationId,
          },
        });
      } catch (error) {
        logger.error("Failed to send donation initiated email:", error);
        // Don't fail the request if email fails
      }
    }

    return {
      donation: {
        id: donation._id,
        donationId: donation.donationId,
        amount: donation.amount,
        paymentReference: donation.paymentReference,
        status: donation.status,
        campaignTitle: campaign.title,
      },
      payment: paymentData,
    };
  }

  /**
   * Submit manual donation (Bank Transfer)
   * @param {Object} donationData - Donation data
   * @param {Object} file - Receipt file
   * @param {Object} donorInfo - Donor info
   */
  async submitManualDonation(donationData, file, donorInfo = {}) {
    const { campaignId, amount, paymentMethod, anonymous, donorNote } =
      donationData;
    const { user, ipAddress, userAgent } = donorInfo;

    // Validate amount
    if (!amount || amount < PAYMENT.MIN_AMOUNT) {
      throw new ValidationError(ERROR_MESSAGES.INVALID_AMOUNT);
    }

    if (!file) {
      throw new ValidationError("Payment receipt is required");
    }

    // Get campaign
    const campaign = await campaignRepository.findById(campaignId);
    if (!campaign) {
      throw new NotFoundError("Campaign");
    }

    // Verify campaign status
    if (campaign.status !== "active" || !campaign.isActive) {
      throw new ValidationError(ERROR_MESSAGES.CAMPAIGN_NOT_ACTIVE);
    }

    // Upload receipt
    const uploadResult = await uploadDocument(file, "receipts");

    // Generate reference
    const paymentReference = this._generatePaymentReference();

    // Determine donor identity
    const donorId = user?._id || null;
    const donorEmail = user?.email || donorInfo.email || "";
    const donorName = anonymous
      ? "Anonymous"
      : user?.fullName ||
        `${donorInfo.firstName || ""} ${donorInfo.lastName || ""}`.trim();

    // Create donation
    const donation = await donationRepository.create({
      donor: donorId,
      campaign: campaignId,
      amount,
      paymentMethod: "bank_transfer", // Enforce enum value
      paymentReference,
      anonymous: anonymous || false,
      donorNote: donorNote || "",
      status: DONATION_STATUS.PENDING, // Manual donations start as pending verification
      approvalStatus: APPROVAL_STATUS.PENDING,
      paymentVerified: false,
      receiptUrl: uploadResult.secure_url,
      guestInfo: !user
        ? {
            firstName: donorInfo.firstName,
            lastName: donorInfo.lastName,
            email: donorInfo.email,
          }
        : undefined,
      metadata: {
        ipAddress,
        userAgent,
        platform: "web",
        receiptPublicId: uploadResult.public_id,
      },
    });

    // Send confirmation email
    if (donorEmail) {
      try {
        await sendEmail({
          to: donorEmail,
          subject: "Donation Protocol Initialized - Pending Verification",
          template: "paymentPending",
          data: {
            donorName,
            amount: donation.amount,
            campaignTitle: campaign.title,
            donationId: donation.donationId,
          },
        });
      } catch (error) {
        logger.error("Failed to send donation pending email:", error);
      }
    }

    return {
      donation: {
        id: donation._id,
        donationId: donation.donationId,
        amount: donation.amount,
        status: donation.status,
        message:
          "Donation submitted successfully. Please wait for admin verification.",
      },
    };
  }

  /**
   * Verify a donation payment
   * @param {string} reference - Payment reference
   * @returns {Promise<Object>} Verified donation
   */
  async verifyDonationPayment(reference) {
    // Find donation
    const donation = await donationRepository.findByPaymentReference(
      reference,
      {
        populate: ["campaign", "donor"],
      },
    );

    if (!donation) {
      throw new NotFoundError("Donation");
    }

    // If already verified, return existing
    if (
      donation.paymentVerified &&
      donation.status === DONATION_STATUS.VERIFIED
    ) {
      return donation;
    }

    // Verify with Paystack
    let verificationResult = null;
    if (donation.paystackReference) {
      try {
        verificationResult = await verifyPayment(donation.paystackReference);
      } catch (error) {
        logger.error("Paystack verification error:", {
          error: error.message,
          reference: donation.paystackReference,
        });
        throw new PaymentError(ERROR_MESSAGES.PAYMENT_VERIFY_FAILED);
      }
    }

    // Update donation status
    const updateData = {
      paymentVerified: true,
      verifiedAt: new Date(),
      status: DONATION_STATUS.VERIFIED,
      verificationDetails: {
        method: "paystack",
        verifiedBy: null,
        notes: verificationResult
          ? "Verified via Paystack"
          : "Manual verification",
      },
    };

    if (verificationResult?.data?.reference) {
      updateData.transactionId = verificationResult.data.id?.toString();
    }

    const updatedDonation = await donationRepository.updateStatus(
      donation._id,
      DONATION_STATUS.VERIFIED,
      updateData,
    );

    return updatedDonation;
  }

  /**
   * Approve a donation
   * CRITICAL: Uses atomic operations to prevent race conditions
   * @param {string} donationId - Donation ID
   * @param {string} approvedBy - Admin user ID
   * @returns {Promise<Object>} Approved donation
   */
  async approveDonation(donationId, approvedBy) {
    // Get donation with campaign
    const donation = await donationRepository.findById(donationId, {
      populate: ["campaign", "donor"],
    });

    if (!donation) {
      throw new NotFoundError("Donation");
    }

    if (donation.approvalStatus === APPROVAL_STATUS.APPROVED) {
      return donation; // Already approved
    }

    // Use transaction to ensure atomicity
    const result = await donationRepository.withTransaction(async (session) => {
      // Approve donation
      const approvedDonation = await donationRepository.approve(
        donationId,
        approvedBy,
        new Date(),
      );

      // Atomically update campaign statistics
      await campaignRepository.incrementRaisedAmount(
        donation.campaign._id,
        donation.amount,
      );

      await campaignRepository.incrementDonorCount(donation.campaign._id);

      return approvedDonation;
    });

    // Generate receipt
    const receipt = await generateReceipt(result);
    result.receiptUrl = receipt.url;
    result.receiptNumber = receipt.number;
    result.receiptGenerated = true;
    await result.save();

    // Send email notification
    if (result.donor?.email) {
      try {
        await sendEmail({
          to: result.donor.email,
          subject: "Payment Protocol Verified - Impact Manifested",
          template: "paymentApproved",
          data: {
            donorName: result.donor.fullName,
            amount: result.amount,
            campaignTitle: result.campaign.title,
            donationId: result.donationId,
            receiptUrl: receipt.url,
            impactMessage: result.impactMessage,
          },
          attachments: [
            {
              filename: `receipt-${result.donationId}.pdf`,
              path: receipt.path,
            },
          ],
        });

        // Cleanup local file
        if (receipt.path && fs.existsSync(receipt.path)) {
          try {
            fs.unlinkSync(receipt.path);
          } catch (err) {
            logger.warn(
              "Could not delete temporary receipt file:",
              receipt.path,
            );
          }
        }
      } catch (error) {
        logger.error("Failed to send approval email:", error);
      }
    }

    return result;
  }

  /**
   * Reject a donation
   * @param {string} donationId - Donation ID
   * @param {string} rejectedBy - Admin user ID
   * @param {string} rejectionReason - Reason for rejection
   * @returns {Promise<Object>} Rejected donation
   */
  async rejectDonation(donationId, rejectedBy, rejectionReason) {
    const donation = await donationRepository.findById(donationId, {
      populate: ["donor", "campaign"],
    });

    if (!donation) {
      throw new NotFoundError("Donation");
    }

    const rejectedDonation = await donationRepository.reject(
      donationId,
      rejectedBy,
      rejectionReason,
      new Date(),
    );

    // Send email notification
    if (rejectedDonation.donor?.email) {
      try {
        await sendEmail({
          to: rejectedDonation.donor.email,
          subject: "Payment Protocol Nullified",
          template: "paymentRejected",
          data: {
            donorName: rejectedDonation.donor.fullName,
            amount: rejectedDonation.amount,
            campaignTitle: rejectedDonation.campaign.title,
            donationId: rejectedDonation.donationId,
            rejectionReason: rejectionReason,
          },
        });
      } catch (error) {
        logger.error("Failed to send rejection email:", error);
      }
    }

    return rejectedDonation;
  }

  /**
   * Generate payment reference
   * @private
   */
  _generatePaymentReference() {
    return `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }
}

export default new DonationService();
