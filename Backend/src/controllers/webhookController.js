// ============================================
// FILE: controllers/webhookController.js
// ============================================
import Donation from '../models/Donation.js';
import Campaign from '../models/Campaign.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { verifyWebhookSignature, verifyPayment } from '../services/paystackService.js';
import { sendEmail } from '../services/emailService.js';
import { generateReceipt } from '../services/receiptService.js';
import logger from '../config/logger.js';
import crypto from 'crypto';
import IdempotencyKey from '../models/IdempotencyKey.js';

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

  // Parse raw body (if it's a Buffer, convert to string then JSON)
  let event;
  try {
    const rawBody = req.body instanceof Buffer 
      ? req.body.toString('utf8')
      : typeof req.body === 'string'
      ? req.body
      : JSON.stringify(req.body);
    
    // Verify webhook signature with raw body
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
    await IdempotencyKey.create({ key: idempotencyKey });
  } catch (error) {
    if (error.code === 11000) {
      logger.info('Duplicate webhook event received, ignoring idempotently', { event: event.event, idempotencyKey });
      return res.status(200).json({
        success: true,
        message: 'Duplicate webhook ignored'
      });
    }
    throw error;
  }

  try {
    // Handle different event types
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

    // Always return 200 to acknowledge receipt
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

    // Still return 200 to prevent Paystack from retrying
    // Log the error for manual investigation
    res.status(200).json({
      success: false,
      message: 'Webhook received but processing failed',
      error: error.message
    });
  }
};

/**
 * Handle successful charge (payment completed)
 */
const handleSuccessfulCharge = async (chargeData) => {
  try {
    const reference = chargeData.reference;
    
    // Find donation by payment reference
    const donation = await Donation.findOne({
      $or: [
        { paymentReference: reference },
        { paystackReference: reference }
      ]
    }).populate('campaign donor');

    if (!donation) {
      logger.warn('Donation not found for successful charge', { reference });
      return;
    }

    // Prevent duplicate processing
    if (donation.paymentVerified && donation.status === 'verified') {
      logger.info('Donation already verified', { 
        donationId: donation.donationId,
        reference 
      });
      return;
    }

    // Verify payment with Paystack (double-check)
    const verificationResponse = await verifyPayment(reference);
    
    if (!verificationResponse.status || verificationResponse.data.status !== 'success') {
      logger.error('Payment verification failed in webhook', {
        donationId: donation.donationId,
        reference,
        paystackStatus: verificationResponse.data?.status
      });
      return;
    }

    // Update donation status
    donation.status = 'verified';
    donation.paymentVerified = true;
    donation.verifiedAt = new Date();
    donation.transactionId = verificationResponse.data.id.toString();
    donation.verificationDetails = {
      method: 'paystack_webhook',
      notes: 'Payment verified via Paystack webhook',
      verifiedBy: null // System verification
    };

    // Save authorization code for recurring donations
    const authorization = verificationResponse.data.authorization;
    if (donation.isRecurring && authorization && authorization.reusable) {
      donation.authorizationCode = authorization.authorization_code;
      logger.info('Saved reusable authorization for recurring donation', {
        donationId: donation.donationId,
        authorizationType: authorization.card_type,
        last4: authorization.last4,
      });
    }

    await donation.save();

    logger.info('Donation verified via webhook', {
      donationId: donation.donationId,
      reference,
      amount: donation.amount
    });

    // Send notification to donor
    if (donation.donor && donation.donor.email) {
      await sendEmail({
        to: donation.donor.email,
        subject: 'Payment Received - Pending Approval',
        template: 'donation-verified',
        data: {
          donorName: donation.anonymous ? 'Anonymous' : donation.donor.fullName,
          amount: donation.amount,
          campaignTitle: donation.campaign.title,
          donationId: donation.donationId,
          message: 'Your payment has been received and is now pending admin approval.'
        }
      });
    }

    // Notify admins
    const admins = await User.find({ role: 'admin', isActive: true });

    // Create a specific, linked database notification for finance and super admins
    await Notification.create({
      title: "New Donation Pending Approval",
      message: `${donation.anonymous ? 'Anonymous' : donation.donor.fullName} donated ${donation.amount} to "${donation.campaign.title}".`,
      type: "donation",
      link: `/admin/payments`, // Link directly to payments
      recipientRole: "finance_admin"
    });

    for (const admin of admins) {
      await sendEmail({
        to: admin.email,
        subject: 'New Donation Pending Approval',
        template: 'admin-donation-notification',
        data: {
          adminName: admin.fullName,
          donorName: donation.anonymous ? 'Anonymous' : donation.donor.fullName,
          amount: donation.amount,
          campaignTitle: donation.campaign.title,
          donationId: donation.donationId,
          approvalUrl: `${process.env.FRONTEND_URL || process.env.ADMIN_URL}/admin/payments`
        }
      });
    }

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

