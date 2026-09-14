// ============================================
// FILE: controllers/webhookController.js
// ============================================
import Donation from '../models/Donation.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { verifyWebhookSignature, verifyPayment } from '../services/paystackService.js';
import { sendEmail } from '../services/emailService.js';
import campaignRepository from '../repositories/CampaignRepository.js';
import logger from '../config/logger.js';
import crypto from 'crypto';
import {
  claimWebhookEvent,
  completeWebhookEvent,
  releaseWebhookEvent,
} from '../models/IdempotencyKey.js';

/**
 * Handle Paystack webhook events
 * @route   POST /api/v1/donations/webhook
 * @access  Public (Paystack webhook)
 */
export const handlePaystackWebhook = async (req, res) => {
  // Paystack sends webhook signature in header
  const signature = req.headers['x-paystack-signature'];
  
  if (!signature) {
    logger.warn('Webhook request missing signature');
    return res.status(400).json({
      success: false,
      message: 'Missing webhook signature'
    });
  }

  // HMAC must use the exact bytes Paystack signed. JSON.stringify of a
  // parsed object can change key order and fail verification, or worse,
  // appear to succeed against a re-serialized body. Fail closed.
  if (!Buffer.isBuffer(req.body)) {
    logger.error('Webhook body is not a raw Buffer; JSON parser likely ran first');
    return res.status(400).json({
      success: false,
      message: 'Invalid webhook payload'
    });
  }

  let event;
  let rawBody;
  try {
    rawBody = req.body.toString('utf8');
    const isValid = verifyWebhookSignature(signature, rawBody);
    
    if (!isValid) {
      logger.error('Invalid webhook signature', {
        signature: signature.substring(0, 20) + '...',
        ip: req.ip
      });
      return res.status(401).json({
        success: false,
        message: 'Invalid webhook signature'
      });
    }

    // Parse JSON body
    event = JSON.parse(rawBody);
  } catch (error) {
    logger.error('Error parsing webhook body:', {
      error: error.message,
      body: req.body
    });
    return res.status(400).json({
      success: false,
      message: 'Invalid webhook payload'
    });
  }
  
  logger.info('Paystack webhook received', {
    event: event.event,
    reference: event.data?.reference
  });

  // Strict Idempotency Check using atomic insert
  const eventId = event.data?.id || crypto.createHash('sha256').update(rawBody).digest('hex');
  const idempotencyKey = `paystack-${event.event}-${eventId}`;

  try {
    const claim = await claimWebhookEvent(idempotencyKey);
    if (claim.action === 'skip') {
      logger.info('Duplicate webhook event received, ignoring idempotently', {
        event: event.event,
        idempotencyKey,
        reason: claim.reason,
      });
      return res.status(200).json({
        success: true,
        message: 'Duplicate webhook ignored'
      });
    }
  } catch (error) {
    logger.error('Webhook idempotency claim failed', { error: error.message, idempotencyKey });
    return res.status(500).json({
      success: false,
      message: 'Webhook claim failed'
    });
  }

  try {
    switch (event.event) {
      case 'charge.success':
        await handleSuccessfulCharge(event.data);
        break;
      
      case 'charge.failed':
        await handleFailedCharge(event.data);
        break;
      
      case 'transfer.success':
        await handleSuccessfulTransfer(event.data);
        break;
      
      case 'transfer.failed':
        await handleFailedTransfer(event.data);
        break;
      
      case 'refund.processed':
        await handleRefundProcessed(event.data);
        break;
      
      default:
        logger.info('Unhandled webhook event', { event: event.event });
    }

    await completeWebhookEvent(idempotencyKey);

    res.status(200).json({
      success: true,
      message: 'Webhook processed'
    });

  } catch (error) {
    logger.error('Webhook processing error:', {
      error: error.message,
      stack: error.stack,
      event: event.event,
      reference: event.data?.reference
    });

    // Release the claim so Paystack retries can complete the work.
    await releaseWebhookEvent(idempotencyKey).catch((releaseError) => {
      logger.error('Failed to release webhook idempotency key', {
        error: releaseError.message,
        idempotencyKey,
      });
    });

    return res.status(500).json({
      success: false,
      message: 'Webhook processing failed'
    });
  }
};

/**
 * Core verification + auto-approval + notification logic.
 * Called by BOTH the Paystack webhook AND the client-side verify endpoint.
 * @param {string} reference   - Paystack payment reference
 * @param {string} source      - 'webhook' | 'client_verify' (for logging only)
 * @returns {{ alreadyVerified: boolean }}
 */
export const confirmDonation = async (reference, source = 'webhook') => {
  // Find donation by payment reference
  const donation = await Donation.findOne({
    $or: [
      { paymentReference: reference },
      { paystackReference: reference }
    ]
  }).populate('campaign donor');

  if (!donation) {
    logger.warn('Donation not found for reference', { reference, source });
    return { alreadyVerified: false, notFound: true };
  }

  // Idempotency — already fully processed
  if (donation.paymentVerified && donation.status === 'verified') {
    logger.info('Donation already verified, skipping', {
      donationId: donation.donationId,
      reference,
      source,
    });
    return { alreadyVerified: true };
  }

  // ── Call Paystack verify API ────────────────────────────────────────────
  const verificationResponse = await verifyPayment(reference);

  if (!verificationResponse.status || verificationResponse.data.status !== 'success') {
    logger.error('Paystack verification returned non-success', {
      donationId: donation.donationId,
      reference,
      source,
      paystackStatus: verificationResponse.data?.status
    });
    donation.status = 'failed';
    donation.failureReason =
      verificationResponse.data?.gateway_response ||
      verificationResponse.data?.status ||
      'Paystack verification did not return success';
    await donation.save();
    return { alreadyVerified: false, failed: true };
  }

  const paystackData = verificationResponse.data;

  // ── Validate currency ──────────────────────────────────────────────────
  if (paystackData.currency !== 'NGN') {
    logger.error('Currency mismatch', {
      donationId: donation.donationId,
      expected: 'NGN',
      actual: paystackData.currency,
      reference,
      source
    });
    donation.status = 'failed';
    donation.failureReason = `Currency mismatch: expected NGN, received ${paystackData.currency}`;
    await donation.save();
    return { alreadyVerified: false, failed: true };
  }

  // ── Validate amount (Paystack sends kobo) ─────────────────────────────
  const expectedKobo = Math.round(donation.amount * 100);
  if (paystackData.amount !== expectedKobo) {
    logger.error('Amount mismatch', {
      donationId: donation.donationId,
      expectedKobo,
      actualKobo: paystackData.amount,
      reference,
      source
    });
    donation.status = 'failed';
    donation.failureReason = `Amount mismatch: expected ${expectedKobo} kobo, received ${paystackData.amount} kobo`;
    await donation.save();
    return { alreadyVerified: false, failed: true };
  }

  // ── All checks passed — confirm AND auto-approve ───────────────────────
  donation.status = 'verified';
  donation.paymentVerified = true;
  donation.verifiedAt = new Date();
  donation.transactionId = paystackData.id.toString();
  donation.verificationDetails = {
    method: source === 'client_verify' ? 'paystack_client_verify' : 'paystack_webhook',
    notes: source === 'client_verify'
      ? 'Payment verified via server-side API call (client-triggered)'
      : 'Payment verified via Paystack webhook',
    verifiedBy: null,
  };
  donation.approvalStatus = 'approved';
  donation.approvedAt = new Date();
  donation.approvedBy = null; // null = system-approved

  const authorization = paystackData.authorization;
  if (donation.isRecurring && authorization && authorization.reusable) {
    donation.authorizationCode = authorization.authorization_code;
  }

  await donation.save();

  // ── Update campaign raised amount ─────────────────────────────────────
  if (donation.campaign?._id) {
    await campaignRepository.incrementRaisedAmount(donation.campaign._id, donation.amount);
    logger.info('Campaign raisedAmount incremented', {
      campaignId: donation.campaign._id,
      incrementBy: donation.amount,
      source,
    });
  }

  logger.info('Donation confirmed and auto-approved', {
    donationId: donation.donationId,
    reference,
    amount: donation.amount,
    source,
  });

  // ── Resolve donor identity ─────────────────────────────────────────
  const donorEmail = donation.donor?.email || donation.guestInfo?.email;
  const donorName = donation.anonymous
    ? 'Anonymous'
    : donation.donor?.fullName ||
      `${donation.guestInfo?.firstName || ''} ${donation.guestInfo?.lastName || ''}`.trim() ||
      'Supporter';

  // ── Receipt email to donor ─────────────────────────────────────────
  if (donorEmail) {
    await sendEmail({
      to: donorEmail,
      subject: 'Donation Confirmed — Thank You!',
      template: 'donation-verified',
      data: {
        donorName,
        amount: donation.amount,
        campaignTitle: donation.campaign.title,
        donationId: donation.donationId,
        message: 'Your donation has been received and confirmed. Thank you for your generosity!'
      }
    }).catch((err) =>
      logger.warn('Donor receipt email failed', { donorEmail, error: err.message })
    );
  }

  // ── Admin notifications ─────────────────────────────────────────────
  const admins = await User.find({ role: 'admin', isActive: true });

  await Notification.create({
    title: 'New Donation Confirmed',
    message: `${donorName} donated ₦${donation.amount.toLocaleString()} to “${donation.campaign.title}”.`,
    type: 'donation',
    link: '/admin/payments',
    recipientRole: 'finance_admin',
  });

  const adminEmailResults = await Promise.allSettled(
    admins.map((admin) =>
      sendEmail({
        to: admin.email,
        subject: 'New Donation Confirmed',
        template: 'admin-donation-notification',
        data: {
          adminName: admin.fullName,
          donorName: donation.anonymous ? 'Anonymous' : (donation.donor?.fullName || donorName),
          amount: donation.amount,
          campaignTitle: donation.campaign.title,
          donationId: donation.donationId,
          approvalUrl: `${process.env.ADMIN_URL || process.env.FRONTEND_URL}/admin/payments`,
        },
      })
    )
  );

  adminEmailResults.forEach((result, i) => {
    if (result.status === 'rejected') {
      logger.warn('Admin notification email failed', {
        adminEmail: admins[i]?.email,
        error: result.reason?.message,
      });
    }
  });

  return { alreadyVerified: false, confirmed: true };
};

/**
 * Handle successful charge (payment completed) — called by Paystack webhook
 */
const handleSuccessfulCharge = async (chargeData) => {
  try {
    await confirmDonation(chargeData.reference, 'webhook');
  } catch (error) {
    logger.error('Error handling successful charge:', {
      error: error.message,
      stack: error.stack,
      reference: chargeData.reference
    });
    throw error;
  }
};

/**
 * Client-triggered server-side verification.
 * Called by the frontend after Paystack popup onSuccess fires.
 * This is the fallback for when the webhook URL is not configured (local dev)
 * or when the webhook is delayed.
 *
 * Security: this endpoint calls Paystack's API directly — it never trusts
 * what the client says about whether the payment succeeded.
 *
 * @route   POST /api/v1/donations/verify/:reference
 * @access  Public
 */
export const verifyDonationController = async (req, res) => {
  const { reference } = req.params;

  if (!reference) {
    return res.status(400).json({ success: false, message: 'Payment reference is required' });
  }

  try {
    const result = await confirmDonation(reference, 'client_verify');

    if (result.notFound) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found for this reference'
      });
    }

    if (result.failed) {
      return res.status(422).json({
        success: false,
        message: 'Payment verification failed. The payment may not have completed successfully.'
      });
    }

    return res.status(200).json({
      success: true,
      alreadyVerified: result.alreadyVerified,
      message: result.alreadyVerified
        ? 'Donation was already confirmed'
        : 'Donation confirmed successfully'
    });

  } catch (error) {
    logger.error('Client verify endpoint error', {
      reference,
      error: error.message,
      stack: error.stack
    });
    return res.status(500).json({
      success: false,
      message: 'Verification failed due to a server error. Please contact support.'
    });
  }
};

/**
 * Handle failed charge
 */
const handleFailedCharge = async (chargeData) => {
  try {
    const reference = chargeData.reference;
    
    const donation = await Donation.findOne({
      $or: [
        { paymentReference: reference },
        { paystackReference: reference }
      ]
    }).populate('campaign donor');

    if (!donation) {
      logger.warn('Donation not found for failed charge', { reference });
      return;
    }

    // Update donation status
    donation.status = 'failed';
    donation.failureReason = chargeData.gateway_response || 'Payment failed';
    await donation.save();

    logger.info('Donation marked as failed via webhook', {
      donationId: donation.donationId,
      reference,
      reason: donation.failureReason
    });

    // Notify donor if email exists
    if (donation.donor && donation.donor.email) {
      await sendEmail({
        to: donation.donor.email,
        subject: 'Payment Failed',
        template: 'donation-failed',
        data: {
          donorName: donation.anonymous ? 'Anonymous' : donation.donor.fullName,
          amount: donation.amount,
          campaignTitle: donation.campaign.title,
          donationId: donation.donationId,
          reason: donation.failureReason
        }
      });
    }

  } catch (error) {
    logger.error('Error handling failed charge:', {
      error: error.message,
      reference: chargeData.reference
    });
    throw error;
  }
};

/**
 * Handle successful transfer (refund)
 */
const handleSuccessfulTransfer = async (transferData) => {
  try {
    logger.info('Transfer successful', {
      reference: transferData.reference,
      amount: transferData.amount
    });
    // Handle transfer success if needed
  } catch (error) {
    logger.error('Error handling successful transfer:', error);
  }
};

/**
 * Handle failed transfer
 */
const handleFailedTransfer = async (transferData) => {
  try {
    logger.warn('Transfer failed', {
      reference: transferData.reference,
      reason: transferData.gateway_response
    });
    // Handle transfer failure if needed
  } catch (error) {
    logger.error('Error handling failed transfer:', error);
  }
};

/**
 * Handle refund processed
 */
const handleRefundProcessed = async (refundData) => {
  try {
    const reference = refundData.transaction?.reference || refundData.reference;
    
    const donation = await Donation.findOne({
      $or: [
        { paymentReference: reference },
        { paystackReference: reference }
      ]
    }).populate('campaign donor');

    if (!donation) {
      logger.warn('Donation not found for refund', { reference });
      return;
    }

    // Update donation status
    donation.status = 'refunded';
    donation.refundedAt = new Date();
    donation.refundReason = refundData.reason || 'Refund processed';
    donation.refundStatus = 'processed';
    
    await donation.save();

    logger.info('Donation refund processed via webhook', {
      donationId: donation.donationId,
      reference,
      amount: refundData.amount
    });

    // Notify donor
    if (donation.donor && donation.donor.email) {
      await sendEmail({
        to: donation.donor.email,
        subject: 'Refund Processed',
        template: 'donation-refunded',
        data: {
          donorName: donation.anonymous ? 'Anonymous' : donation.donor.fullName,
          amount: refundData.amount / 100, // Convert from kobo
          campaignTitle: donation.campaign.title,
          donationId: donation.donationId,
          reason: donation.refundReason
        }
      });
    }

  } catch (error) {
    logger.error('Error handling refund processed:', {
      error: error.message,
      reference: refundData.reference
    });
    throw error;
  }
};

