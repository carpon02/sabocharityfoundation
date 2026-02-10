// ============================================
// FILE: services/paymentAnalyticsService.js
// ============================================
import Donation from '../models/Donation.js';
import Campaign from '../models/Campaign.js';
import User from '../models/User.js';

/**
 * Get payment trends over time
 */
export const getPaymentTrends = async (startDate, endDate, groupBy = 'day') => {
  const groupFormat = {
    day: '%Y-%m-%d',
    week: '%Y-W%U',
    month: '%Y-%m',
    year: '%Y'
  };

  const trends = await Donation.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: groupFormat[groupBy] || groupFormat.day,
            date: '$createdAt'
          }
        },
        totalAmount: { $sum: '$amount' },
        count: { $sum: 1 },
        successfulCount: {
          $sum: {
            $cond: [
              { $in: ['$status', ['completed', 'approved']] },
              1,
              0
            ]
          }
        },
        pendingCount: {
          $sum: {
            $cond: [{ $eq: ['$approvalStatus', 'pending'] }, 1, 0]
          }
        },
        failedCount: {
          $sum: {
            $cond: [{ $eq: ['$status', 'failed'] }, 1, 0]
          }
        }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);

  return trends.map(trend => ({
    period: trend._id,
    totalAmount: trend.totalAmount,
    totalCount: trend.count,
    successful: trend.successfulCount,
    pending: trend.pendingCount,
    failed: trend.failedCount,
    successRate: trend.count > 0 
      ? Math.round((trend.successfulCount / trend.count) * 100) 
      : 0
  }));
};

/**
 * Get top donors
 */
export const getTopDonors = async (limit = 10, startDate = null, endDate = null) => {
  const matchStage = {
    status: { $in: ['completed', 'approved'] },
    anonymous: false
  };

  if (startDate && endDate) {
    matchStage.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }

  const topDonors = await Donation.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$donor',
        totalDonated: { $sum: '$amount' },
        donationCount: { $sum: 1 },
        lastDonation: { $max: '$createdAt' }
      }
    },
    {
      $sort: { totalDonated: -1 }
    },
    {
      $limit: limit
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'donor'
      }
    },
    {
      $unwind: '$donor'
    },
    {
      $project: {
        _id: 1,
        totalDonated: 1,
        donationCount: 1,
        lastDonation: 1,
        donorName: '$donor.fullName',
        donorEmail: '$donor.email',
        donorAvatar: '$donor.avatar'
      }
    }
  ]);

  return topDonors;
};

/**
 * Get top performing campaigns by donations
 */
export const getTopCampaigns = async (limit = 10, startDate = null, endDate = null) => {
  const matchStage = {
    status: { $in: ['completed', 'approved'] }
  };

  if (startDate && endDate) {
    matchStage.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }

  const topCampaigns = await Donation.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$campaign',
        totalRaised: { $sum: '$amount' },
        donationCount: { $sum: 1 },
        uniqueDonors: { $addToSet: '$donor' }
      }
    },
    {
      $project: {
        _id: 1,
        totalRaised: 1,
        donationCount: 1,
        donorCount: { $size: '$uniqueDonors' }
      }
    },
    {
      $sort: { totalRaised: -1 }
    },
    {
      $limit: limit
    },
    {
      $lookup: {
        from: 'campaigns',
        localField: '_id',
        foreignField: '_id',
        as: 'campaign'
      }
    },
    {
      $unwind: '$campaign'
    },
    {
      $project: {
        _id: 1,
        totalRaised: 1,
        donationCount: 1,
        donorCount: 1,
        campaignTitle: '$campaign.title',
        campaignSlug: '$campaign.slug',
        campaignGoal: '$campaign.goalAmount',
        percentageReached: {
          $multiply: [
            { $divide: ['$totalRaised', '$campaign.goalAmount'] },
            100
          ]
        }
      }
    }
  ]);

  return topCampaigns;
};

/**
 * Get payment method performance
 */
export const getPaymentMethodPerformance = async (startDate = null, endDate = null) => {
  const matchStage = {};

  if (startDate && endDate) {
    matchStage.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }

  const performance = await Donation.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$paymentMethod',
        totalAmount: { $sum: '$amount' },
        totalCount: { $sum: 1 },
        successfulCount: {
          $sum: {
            $cond: [
              { $in: ['$status', ['completed', 'approved']] },
              1,
              0
            ]
          }
        },
        successfulAmount: {
          $sum: {
            $cond: [
              { $in: ['$status', ['completed', 'approved']] },
              '$amount',
              0
            ]
          }
        },
        failedCount: {
          $sum: {
            $cond: [{ $eq: ['$status', 'failed'] }, 1, 0]
          }
        },
        averageAmount: { $avg: '$amount' }
      }
    },
    {
      $project: {
        _id: 0,
        method: '$_id',
        totalAmount: 1,
        totalCount: 1,
        successfulCount: 1,
        successfulAmount: 1,
        failedCount: 1,
        averageAmount: { $round: ['$averageAmount', 2] },
        successRate: {
          $round: [
            {
              $multiply: [
                { $divide: ['$successfulCount', '$totalCount'] },
                100
              ]
            },
            2
          ]
        }
      }
    },
    {
      $sort: { totalAmount: -1 }
    }
  ]);

  return performance;
};

/**
 * Get pending approvals summary
 */
export const getPendingApprovalsSummary = async () => {
  const summary = await Donation.aggregate([
    {
      $match: {
        approvalStatus: 'pending',
        paymentVerified: true
      }
    },
    {
      $group: {
        _id: null,
        totalPending: { $sum: 1 },
        totalAmount: { $sum: '$amount' },
        oldestPending: { $min: '$createdAt' },
        newestPending: { $max: '$createdAt' }
      }
    }
  ]);

  // Get age distribution
  const ageDistribution = await Donation.aggregate([
    {
      $match: {
        approvalStatus: 'pending',
        paymentVerified: true
      }
    },
    {
      $project: {
        ageInHours: {
          $divide: [
            { $subtract: [new Date(), '$createdAt'] },
            1000 * 60 * 60
          ]
        },
        amount: 1
      }
    },
    {
      $bucket: {
        groupBy: '$ageInHours',
        boundaries: [0, 24, 48, 72, 168],
        default: 'older',
        output: {
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      }
    }
  ]);

  return {
    summary: summary[0] || {
      totalPending: 0,
      totalAmount: 0,
      oldestPending: null,
      newestPending: null
    },
    ageDistribution: ageDistribution.map(bucket => ({
      range: bucket._id,
      count: bucket.count,
      amount: bucket.totalAmount
    }))
  };
};

/**
 * Get refund statistics
 */
export const getRefundStatistics = async (startDate = null, endDate = null) => {
  const matchStage = {
    status: { $in: ['refunded', 'rejected'] }
  };

  if (startDate && endDate) {
    matchStage.refundedAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }

  const stats = await Donation.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalRefunds: { $sum: 1 },
        totalRefundedAmount: { $sum: '$amount' },
        successfulRefunds: {
          $sum: {
            $cond: [{ $eq: ['$refundStatus', 'processed'] }, 1, 0]
          }
        },
        failedRefunds: {
          $sum: {
            $cond: [{ $eq: ['$refundStatus', 'failed'] }, 1, 0]
          }
        }
      }
    }
  ]);

  // Get refund reasons
  const reasons = await Donation.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$refundReason',
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } },
    { $limit: 5 }
  ]);

  return {
    statistics: stats[0] || {
      totalRefunds: 0,
      totalRefundedAmount: 0,
      successfulRefunds: 0,
      failedRefunds: 0
    },
    topReasons: reasons.map(r => ({
      reason: r._id || 'No reason provided',
      count: r.count
    }))
  };
};

/**
 * Get payment processing time analytics
 */
export const getProcessingTimeAnalytics = async (startDate = null, endDate = null) => {
  const matchStage = {
    status: { $in: ['completed', 'approved'] },
    approvedAt: { $exists: true }
  };

  if (startDate && endDate) {
    matchStage.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }

  const analytics = await Donation.aggregate([
    { $match: matchStage },
    {
      $project: {
        processingTimeHours: {
          $divide: [
            { $subtract: ['$approvedAt', '$createdAt'] },
            1000 * 60 * 60
          ]
        }
      }
    },
    {
      $group: {
        _id: null,
        averageTime: { $avg: '$processingTimeHours' },
        medianTime: { $median: { input: '$processingTimeHours', method: 'approximate' } },
        minTime: { $min: '$processingTimeHours' },
        maxTime: { $max: '$processingTimeHours' }
      }
    }
  ]);

  return analytics[0] || {
    averageTime: 0,
    medianTime: 0,
    minTime: 0,
    maxTime: 0
  };
};

/**
 * Generate comprehensive payment report
 */
export const generatePaymentReport = async (startDate, endDate) => {
  const [
    trends,
    topDonors,
    topCampaigns,
    methodPerformance,
    pendingApprovals,
    refundStats,
    processingTime
  ] = await Promise.all([
    getPaymentTrends(startDate, endDate, 'day'),
    getTopDonors(10, startDate, endDate),
    getTopCampaigns(10, startDate, endDate),
    getPaymentMethodPerformance(startDate, endDate),
    getPendingApprovalsSummary(),
    getRefundStatistics(startDate, endDate),
    getProcessingTimeAnalytics(startDate, endDate)
  ]);

  return {
    reportPeriod: {
      startDate,
      endDate,
      generatedAt: new Date()
    },
    trends,
    topDonors,
    topCampaigns,
    methodPerformance,
    pendingApprovals,
    refundStats,
    processingTime
  };
};