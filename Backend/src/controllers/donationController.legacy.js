// ============================================
// FILE: controllers/donationController.js
// ============================================
import mongoose from "mongoose";
import Donation from "../models/Donation.js";
import Campaign from "../models/Campaign.js";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
  initializePayment,
  verifyPayment,
} from "../services/paystackService.js";
import { generateReceipt } from "../services/receiptService.js";
import { sendEmail } from "../services/emailService.js";
import logger from "../config/logger.js";

// @desc    Initialize donation payment
// @route   POST /api/donations/initialize
// @access  Private (Donor)
export const initializeDonation = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      campaignId,
      amount,
      paymentMethod,
      anonymous,
      isRecurring,
      recurringFrequency,
      donorNote,
      donorInfo,
    } = req.body;

    // Validate campaign
    const campaign = await Campaign.findById(campaignId).session(session);
    if (!campaign) {
      await session.abortTransaction();
      session.endSession();
      return next(new ApiError("Campaign not found", 404));
    }
    if (campaign.status !== "active" || !campaign.isActive) {
      await session.abortTransaction();
      session.endSession();
      return next(
        new ApiError("Campaign is not currently accepting donations", 400)
      );
    }
    if (new Date() > new Date(campaign.endDate)) {
      await session.abortTransaction();
      session.endSession();
      return next(new ApiError("Campaign has ended", 400));
    }
    if (!amount || amount < 100) {
      await session.abortTransaction();
      session.endSession();
      return next(new ApiError("Minimum donation amount is ₦100", 400));
    }

    // Generate payment reference
    const paymentReference = `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Determine donor identity
    let donorId = req.user?._id || null; // Authenticated user or null
    let donorEmail = req.user?.email || (donorInfo && donorInfo.email) || "";
    let donorName = anonymous
      ? "Anonymous"
      : req.user
        ? req.user.fullName
        : (
            (donorInfo?.firstName || "") +
            " " +
            (donorInfo?.lastName || "")
          ).trim();

    // Create donation record
    const donation = new Donation({
      donor: donorId,
      campaign: campaignId,
      amount,
      paymentMethod,
      paymentReference,
      anonymous: anonymous || false,
      isRecurring: isRecurring || false,
      recurringFrequency: isRecurring ? recurringFrequency : undefined,
      donorNote: donorNote || "",
      status: "pending",
      approvalStatus: "pending",
      metadata: {
        ipAddress: req.ip,
        userAgent: req.get("user-agent"),
        platform: "web",
        guestDonor: donorInfo ? donorInfo : undefined,
      },
    });

    await donation.save({ session });

    let paymentData = null;

    // Initialize payment for online methods
    if (["card", "bank_transfer", "ussd"].includes(paymentMethod)) {
      try {
        const paystackResponse = await initializePayment({
          email: donorEmail,
          amount: amount * 100,
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
          donation.paystackReference = paystackResponse.data.reference;
          donation.status = "processing";
          await donation.save({ session });

          paymentData = {
            authorizationUrl: paystackResponse.data.authorization_url,
            accessCode: paystackResponse.data.access_code,
            reference: paystackResponse.data.reference,
          };
        } else {
          // If Paystack init fails, we abort transaction
          await session.abortTransaction();
          session.endSession();
          return next(
            new ApiError("Failed to initialize payment. Please try again.", 400)
          );
        }
      } catch (error) {
        // Abort on service error
        await session.abortTransaction();
        session.endSession();
        logger.error("Paystack initialization error:", {
          error: error.message,
          stack: error.stack,
          donationId: donation._id,
          campaignId: campaignId,
        });
        return next(
          new ApiError("Payment service error. Please try again later.", 500)
        );
      }
    }

    await session.commitTransaction();
    session.endSession();

    // Send confirmation email (Side effect outside transaction)
    if (donorEmail && !anonymous) {
      // Use try-catch for email to not crash request (request already succeeded)
      try {
        await sendEmail({
          to: donorEmail,
          subject: "Donation Initiated",
          template: "donation-initiated",
          data: {
            donorName,
            amount: donation.amount,
            campaignTitle: campaign.title,
            donationId: donation.donationId,
            paymentReference: donation.paymentReference,
          },
        });
      } catch (emailErr) {
        logger.error("Email send failed", emailErr);
      }
    }

    return ApiResponse.created(res, "Donation initialized successfully", {
      donation: {
        id: donation._id,
        donationId: donation.donationId,
        amount: donation.amount,
        paymentReference: donation.paymentReference,
        status: donation.status,
        campaignTitle: campaign.title,
      },
      payment: paymentData,
    });
  } catch (error) {
    // Catch-all abort
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    session.endSession();

    logger.error("Initialize donation error:", {
      error: error.message,
      stack: error.stack,
      userId: req.user?._id,
      campaignId: req.body.campaignId,
    });
    return next(new ApiError("Error initializing donation", 500));
  }
};

// @desc    Verify payment (Paystack callback/webhook)
// @route   POST /api/donations/verify/:reference
// @access  Public (for webhooks) / Private
// @desc    Verify payment (Paystack callback/webhook)
// @route   POST /api/donations/verify/:reference
// @access  Public (for webhooks) / Private
export const verifyDonationPayment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { reference } = req.params;

    // Find donation
    const donation = await Donation.findOne({
      $or: [{ paymentReference: reference }, { paystackReference: reference }],
    })
      .session(session)
      .populate("campaign donor");

    if (!donation) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: "Donation not found",
      });
    }

    // Prevent duplicate verification
    if (donation.paymentVerified) {
      await session.abortTransaction();
      session.endSession();
      return res.status(200).json({
        success: true,
        message: "Payment already verified",
        data: { donation },
      });
    }

    // Verify payment with Paystack
    const verificationResponse = await verifyPayment(reference);

    if (
      verificationResponse.status &&
      verificationResponse.data.status === "success"
    ) {
      // Update donation
      donation.status = "verified";
      donation.paymentVerified = true;
      donation.verifiedAt = new Date();
      donation.transactionId = verificationResponse.data.id.toString();
      donation.verificationDetails = {
        method: "paystack",
        notes: "Payment verified via Paystack",
      };

      await donation.save({ session });
      await session.commitTransaction();
      session.endSession();

      // Send notification to donor (Side effect)
      try {
        await sendEmail({
          to: donation.donor.email,
          subject: "Payment Received - Pending Approval",
          template: "donation-verified",
          data: {
            donorName: donation.donor.fullName,
            amount: donation.amount,
            campaignTitle: donation.campaign.title,
            donationId: donation.donationId,
            message:
              "Your payment has been received and is now pending admin approval.",
          },
        });

        // Notify admin
        const admins = await User.find({ role: "admin", isActive: true });
        for (const admin of admins) {
          await sendEmail({
            to: admin.email,
            subject: "New Donation Pending Approval",
            template: "admin-donation-notification",
            data: {
              adminName: admin.fullName,
              donorName: donation.anonymous
                ? "Anonymous"
                : donation.donor.fullName,
              amount: donation.amount,
              campaignTitle: donation.campaign.title,
              donationId: donation.donationId,
              approvalUrl: `${process.env.FRONTEND_URL}/admin/payments`,
            },
          });
        }
      } catch (err) {
        logger.error("Notification error", err);
      }

      return res.status(200).json({
        success: true,
        message: "Payment verified successfully. Pending admin approval.",
        data: { donation },
      });
    } else {
      // Payment failed
      donation.status = "failed";
      donation.failureReason =
        verificationResponse.data?.gateway_response ||
        "Payment verification failed";

      await donation.save({ session });
      await session.commitTransaction();
      session.endSession();

      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
        data: { donation },
      });
    }
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    session.endSession();

    logger.error("Verify payment error:", {
      error: error.message,
      stack: error.stack,
      reference: req.params.reference,
    });
    res.status(500).json({
      success: false,
      message: "Error verifying payment",
      error: error.message,
    });
  }
};

// @desc    Get donor's donations
// @route   GET /api/donations/my-donations
// @access  Private (Donor)
export const getMyDonations = async (req, res) => {
  try {
    const {
      status,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    const query = { donor: req.user._id };

    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;
    const sortOrder = order === "desc" ? -1 : 1;

    const donations = await Donation.find(query)
      .populate({
        path: "campaign",
        select: "title slug images category location status",
      })
      .sort({ [sortBy]: sortOrder })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Donation.countDocuments(query);

    // Calculate stats
    const stats = await Donation.aggregate([
      { $match: { donor: req.user._id } },
      {
        $group: {
          _id: null,
          totalDonated: {
            $sum: {
              $cond: [
                { $in: ["$status", ["completed", "approved"]] },
                "$amount",
                0,
              ],
            },
          },
          totalCount: { $sum: 1 },
          completedCount: {
            $sum: {
              $cond: [{ $eq: ["$status", "completed"] }, 1, 0],
            },
          },
          pendingCount: {
            $sum: {
              $cond: [{ $in: ["$approvalStatus", ["pending"]] }, 1, 0],
            },
          },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        donations,
        stats: stats[0] || {
          totalDonated: 0,
          totalCount: 0,
          completedCount: 0,
          pendingCount: 0,
        },
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    logger.error("Get donations error:", {
      error: error.message,
      stack: error.stack,
      userId: req.user?._id,
    });
    res.status(500).json({
      success: false,
      message: "Error fetching donations",
      error: error.message,
    });
  }
};

// @desc    Get single donation details
// @route   GET /api/donations/:id
// @access  Private
export const getDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id)
      .populate({
        path: "campaign",
        select: "title slug images category location createdBy",
      })
      .populate({
        path: "donor",
        select: "fullName email avatar",
      })
      .populate({
        path: "approvedBy",
        select: "fullName email",
      });

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: "Donation not found",
      });
    }

    // Check authorization
    const isOwner = donation.donor._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";
    const isCampaignOwner =
      donation.campaign.createdBy.toString() === req.user._id.toString();

    if (!isOwner && !isAdmin && !isCampaignOwner) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this donation",
      });
    }

    res.status(200).json({
      success: true,
      data: { donation },
    });
  } catch (error) {
    logger.error("Get donation error:", {
      error: error.message,
      stack: error.stack,
      donationId: req.params.id,
      userId: req.user?._id,
    });
    res.status(500).json({
      success: false,
      message: "Error fetching donation",
      error: error.message,
    });
  }
};

// ============================================
// ADMIN CONTROLLERS
// ============================================

// @desc    Get all donations (Admin)
// @route   GET /api/donations/admin/all
// @access  Private (Admin)
export const getAllDonations = async (req, res) => {
  try {
    const {
      status,
      approvalStatus,
      paymentMethod,
      page = 1,
      limit = 20,
      search,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    const query = {};

    if (status) query.status = status;
    if (approvalStatus) query.approvalStatus = approvalStatus;
    if (paymentMethod) query.paymentMethod = paymentMethod;

    // Search functionality
    if (search) {
      const searchRegex = new RegExp(search, "i");
      const users = await User.find({
        $or: [{ fullName: searchRegex }, { email: searchRegex }],
      }).select("_id");

      const userIds = users.map((u) => u._id);

      query.$or = [
        { donationId: searchRegex },
        { paymentReference: searchRegex },
        { transactionId: searchRegex },
        { donor: { $in: userIds } },
      ];
    }

    const skip = (page - 1) * limit;
    const sortOrder = order === "desc" ? -1 : 1;

    const donations = await Donation.find(query)
      .populate({
        path: "campaign",
        select: "title slug images category",
      })
      .populate({
        path: "donor",
        select: "fullName email avatar",
      })
      .populate({
        path: "approvedBy rejectedBy",
        select: "fullName email",
      })
      .sort({ [sortBy]: sortOrder })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Donation.countDocuments(query);

    // Calculate stats
    const stats = await Donation.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
          pendingApproval: {
            $sum: {
              $cond: [{ $eq: ["$approvalStatus", "pending"] }, 1, 0],
            },
          },
          approved: {
            $sum: {
              $cond: [{ $eq: ["$approvalStatus", "approved"] }, 1, 0],
            },
          },
          completed: {
            $sum: {
              $cond: [{ $eq: ["$status", "completed"] }, 1, 0],
            },
          },
          failed: {
            $sum: {
              $cond: [{ $eq: ["$status", "failed"] }, 1, 0],
            },
          },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        donations,
        stats: stats[0] || {},
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    logger.error("Get all donations error:", {
      error: error.message,
      stack: error.stack,
      query: req.query,
    });
    res.status(500).json({
      success: false,
      message: "Error fetching donations",
      error: error.message,
    });
  }
};

// @desc    Approve donation (Admin)
// @route   PUT /api/donations/:id/approve
// @access  Private (Admin)
export const approveDonation = async (req, res) => {
  try {
    const { adminNotes } = req.body;

    const donation = await Donation.findById(req.params.id).populate(
      "campaign donor"
    );

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: "Donation not found",
      });
    }

    // Check if donation can be approved
    if (!donation.paymentVerified) {
      return res.status(400).json({
        success: false,
        message: "Payment must be verified before approval",
      });
    }

    if (donation.approvalStatus !== "pending") {
      return res.status(400).json({
        success: false,
        message: `Donation is already ${donation.approvalStatus}`,
      });
    }

    // Update donation
    donation.approvalStatus = "approved";
    donation.status = "completed";
    donation.approvedBy = req.user._id;
    donation.approvedAt = new Date();
    donation.completedAt = new Date();
    donation.adminNotes = adminNotes || "";

    await donation.save();

    // Update campaign statistics
    const campaign = donation.campaign;
    // CORRECTED: Check if updateDonationStats method exists before calling
    if (typeof campaign.updateDonationStats === "function") {
      await campaign.updateDonationStats();
    } else {
      // Manual update if method doesn't exist
      campaign.raisedAmount = (campaign.raisedAmount || 0) + donation.amount;
      campaign.donorCount = (campaign.donorCount || 0) + 1;
      await campaign.save();
    }

    // CORRECTED: Fixed donor count logic
    if (!donation.anonymous) {
      // Check if this donor has donated to this campaign before
      const previousDonations = await Donation.countDocuments({
        campaign: campaign._id,
        donor: donation.donor._id,
        status: "completed",
        _id: { $ne: donation._id },
      });

      // Only increment if this is their first donation to this campaign
      if (previousDonations === 0) {
        campaign.donorCount = (campaign.donorCount || 0) + 1;
        await campaign.save();
      }
    }

    // Generate receipt
    const receipt = await generateReceipt(donation);
    donation.receiptUrl = receipt.url;
    donation.receiptNumber = receipt.number;
    donation.receiptGenerated = true;
    await donation.save();

    // Send notification to donor
    await sendEmail({
      to: donation.donor.email,
      subject: "Donation Approved - Thank You!",
      template: "donation-approved",
      data: {
        donorName: donation.donor.fullName,
        amount: donation.amount,
        campaignTitle: campaign.title,
        donationId: donation.donationId,
        receiptUrl: receipt.url,
        impactMessage:
          donation.impactMessage ||
          `Your donation is making a real difference in ${campaign.location?.city || "the community"}!`,
      },
    });

    res.status(200).json({
      success: true,
      message: "Donation approved successfully",
      data: { donation },
    });
  } catch (error) {
    logger.error("Approve donation error:", {
      error: error.message,
      stack: error.stack,
      donationId: req.params.id,
      adminId: req.user?._id,
    });
    res.status(500).json({
      success: false,
      message: "Error approving donation",
      error: error.message,
    });
  }
};

// @desc    Reject donation (Admin)
// @route   PUT /api/donations/:id/reject
// @access  Private (Admin)
export const rejectDonation = async (req, res) => {
  try {
    const { rejectionReason, initiateRefund } = req.body;

    if (!rejectionReason) {
      return res.status(400).json({
        success: false,
        message: "Rejection reason is required",
      });
    }

    const donation = await Donation.findById(req.params.id).populate(
      "campaign donor"
    );

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: "Donation not found",
      });
    }

    if (donation.approvalStatus !== "pending") {
      return res.status(400).json({
        success: false,
        message: `Cannot reject donation that is ${donation.approvalStatus}`,
      });
    }

    // Update donation
    donation.approvalStatus = "rejected";
    donation.status = initiateRefund ? "refunded" : "rejected";
    donation.rejectedBy = req.user._id;
    donation.rejectedAt = new Date();
    donation.rejectionReason = rejectionReason;

    if (initiateRefund && donation.transactionId) {
      donation.refundedAt = new Date();
      donation.refundReason = rejectionReason;

      // CORRECTED: Added actual refund implementation with error handling
      try {
        const { refundTransaction } = await import(
          "../services/paystackService.js"
        );
        const refundResponse = await refundTransaction(
          donation.paymentReference
        );

        if (refundResponse.status) {
          donation.refundStatus = "processed";
          donation.refundDetails = {
            refundedAt: new Date(),
            refundReference: refundResponse.data.transaction?.reference,
            amount: donation.amount,
          };
        } else {
          donation.refundStatus = "failed";
          donation.refundFailureReason = "Refund processing failed";
        }
      } catch (refundError) {
        logger.error("Refund error:", {
          error: refundError.message,
          stack: refundError.stack,
          donationId: donation._id,
          reference: donation.paymentReference,
        });
        donation.refundStatus = "failed";
        donation.refundFailureReason = refundError.message;
      }
    }

    await donation.save();

    // Send notification to donor
    await sendEmail({
      to: donation.donor.email,
      subject: "Donation Status Update",
      template: "donation-rejected",
      data: {
        donorName: donation.donor.fullName,
        amount: donation.amount,
        campaignTitle: donation.campaign.title,
        donationId: donation.donationId,
        reason: rejectionReason,
        refundInitiated: initiateRefund,
        refundStatus: donation.refundStatus || "pending",
      },
    });

    res.status(200).json({
      success: true,
      message: "Donation rejected",
      data: { donation },
    });
  } catch (error) {
    logger.error("Reject donation error:", {
      error: error.message,
      stack: error.stack,
      donationId: req.params.id,
      adminId: req.user?._id,
    });
    res.status(500).json({
      success: false,
      message: "Error rejecting donation",
      error: error.message,
    });
  }
};

// ADDED: Download receipt endpoint
// @desc    Download donation receipt
// @route   GET /api/donations/:id/receipt
// @access  Private
export const downloadReceipt = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id).populate(
      "campaign donor"
    );

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: "Donation not found",
      });
    }

    // Check authorization
    const isOwner = donation.donor._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to download this receipt",
      });
    }

    // Check if receipt exists
    if (!donation.receiptUrl) {
      return res.status(404).json({
        success: false,
        message: "Receipt not available for this donation",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        receiptUrl: donation.receiptUrl,
        receiptNumber: donation.receiptNumber,
        donationId: donation.donationId,
      },
    });
  } catch (error) {
    logger.error("Download receipt error:", {
      error: error.message,
      stack: error.stack,
      donationId: req.params.id,
    });
    res.status(500).json({
      success: false,
      message: "Error downloading receipt",
      error: error.message,
    });
  }
};

// ADDED: Regenerate receipt endpoint (Admin only)
// @desc    Regenerate donation receipt
// @route   POST /api/donations/:id/regenerate-receipt
// @access  Private (Admin)
export const regenerateReceiptController = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id).populate(
      "campaign donor"
    );

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: "Donation not found",
      });
    }

    if (
      donation.status !== "completed" ||
      donation.approvalStatus !== "approved"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Can only regenerate receipts for approved/completed donations",
      });
    }

    const { regenerateReceipt } = await import("../services/receiptService.js");
    const receipt = await regenerateReceipt(donation._id);

    res.status(200).json({
      success: true,
      message: "Receipt regenerated successfully",
      data: { receipt },
    });
  } catch (error) {
    logger.error("Regenerate receipt error:", {
      error: error.message,
      stack: error.stack,
      donationId: req.params.id,
      adminId: req.user?._id,
    });
    res.status(500).json({
      success: false,
      message: "Error regenerating receipt",
      error: error.message,
    });
  }
};
