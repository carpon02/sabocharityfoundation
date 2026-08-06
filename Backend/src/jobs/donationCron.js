// ============================================
// FILE: jobs/donationCron.js
// Recurring Donation Processor
// Runs daily to charge saved Paystack authorization tokens
// ============================================
import cron from 'node-cron';
import crypto from 'crypto';
import Donation from '../models/Donation.js';
import { chargeAuthorization } from '../services/paystackService.js';
import logger from '../config/logger.js';

/**
 * Calculate the next recurring date based on frequency
 * @param {Date} currentDate - The current due date
 * @param {string} frequency - daily | weekly | monthly | yearly
 * @returns {Date} The next date to charge
 */
const getNextRecurringDate = (currentDate, frequency) => {
  const next = new Date(currentDate);
  switch (frequency) {
    case 'daily':
      next.setDate(next.getDate() + 1);
      break;
    case 'weekly':
      next.setDate(next.getDate() + 7);
      break;
    case 'monthly':
      next.setMonth(next.getMonth() + 1);
      break;
    case 'yearly':
      next.setFullYear(next.getFullYear() + 1);
      break;
    default:
      next.setMonth(next.getMonth() + 1); // Fallback to monthly
  }
  return next;
};

/**
 * Process a single recurring donation
 */
const processRecurringDonation = async (donation) => {
  const reference = `REC-${donation.donationId}-${crypto.randomBytes(6).toString('hex')}`;

  try {
    // Get the donor email — donation must have been populated with donor
    const email = donation.donor?.email || donation.guestInfo?.email;

    if (!email) {
      logger.warn('Recurring donation skipped: no email found', {
        donationId: donation.donationId,
      });
      return { success: false, reason: 'no_email' };
    }

    // Charge the saved card
    const result = await chargeAuthorization({
      authorization_code: donation.authorizationCode,
      email,
      amount: donation.amount * 100, // Convert Naira to kobo
      reference,
      metadata: {
        donationId: donation.donationId,
        campaignId: donation.campaign?.toString(),
        type: 'recurring_auto_charge',
      },
    });

    if (result.status && result.data?.status === 'success') {
      // Advance the nextRecurringDate
      donation.nextRecurringDate = getNextRecurringDate(
        donation.nextRecurringDate,
        donation.recurringFrequency
      );
      donation.lastRecurringChargeAt = new Date();
      await donation.save();

      logger.info('Recurring donation charged successfully', {
        donationId: donation.donationId,
        reference,
        nextDate: donation.nextRecurringDate,
      });

      return { success: true, reference };
    } else {
      logger.warn('Recurring charge returned non-success status', {
        donationId: donation.donationId,
        reference,
        paystackStatus: result.data?.status,
        gatewayResponse: result.data?.gateway_response,
      });
      return { success: false, reason: result.data?.gateway_response || 'unknown' };
    }
  } catch (error) {
    logger.error('Recurring donation charge failed', {
      donationId: donation.donationId,
      reference,
      error: error.message,
    });
    return { success: false, reason: error.message };
  }
};

/**
 * Main cron handler — finds all due recurring donations and processes them
 */
const runRecurringDonationProcessor = async () => {
  const startTime = Date.now();
  logger.info('🔄 Recurring Donation Processor started');

  try {
    // Find all recurring donations that:
    // 1. Are marked as recurring
    // 2. Have status "completed" or "verified" (payment was successful before)
    // 3. Have a stored authorization code
    // 4. Are due (nextRecurringDate <= now)
    const dueDonations = await Donation.find({
      isRecurring: true,
      status: { $in: ['completed', 'verified'] },
      authorizationCode: { $exists: true, $ne: null },
      nextRecurringDate: { $lte: new Date() },
    })
      .select('+authorizationCode') // Explicitly include the hidden field
      .populate('donor', 'email fullName')
      .populate('campaign', 'title')
      .limit(100); // Process max 100 per run to avoid Paystack rate limits

    if (dueDonations.length === 0) {
      logger.info('🔄 No recurring donations due. Processor finished.');
      return;
    }

    logger.info(`🔄 Found ${dueDonations.length} recurring donation(s) due for processing`);

    let successCount = 0;
    let failCount = 0;

    for (const donation of dueDonations) {
      const result = await processRecurringDonation(donation);
      if (result.success) {
        successCount++;
      } else {
        failCount++;
      }

      // Small delay between charges to respect Paystack rate limits
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    logger.info(`🔄 Recurring Donation Processor finished in ${elapsed}s`, {
      total: dueDonations.length,
      success: successCount,
      failed: failCount,
    });
  } catch (error) {
    logger.error('🔄 Recurring Donation Processor critical error:', {
      error: error.message,
      stack: error.stack,
    });
  }
};

/**
 * Initialize the recurring donation cron job
 * Schedule: Every day at 7:00 AM (WAT / server time)
 */
const initRecurringDonationCron = () => {
  // "0 7 * * *" = At 07:00 every day
  cron.schedule('0 7 * * *', runRecurringDonationProcessor, {
    timezone: 'Africa/Lagos',
  });

  logger.info('✅ Recurring Donation Cron Job initialized (daily at 07:00 WAT)');
};

export { initRecurringDonationCron, runRecurringDonationProcessor };
export default initRecurringDonationCron;
