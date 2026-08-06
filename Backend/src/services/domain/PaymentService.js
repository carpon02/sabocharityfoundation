import Donation from "../../models/Donation.js";
import Campaign from "../../models/Campaign.js";
import User from "../../models/User.js";
import fs from "fs";
import { sendEmail } from "../../services/emailService.js";
import { generateReceipt } from "../../services/receiptService.js";
import logger from "../../config/logger.js";
import { refundTransaction } from "../external/PaystackService.js";

class PaymentService {
  async getPaymentStats(query) {
    const { startDate, endDate, period = "30days" } = query;

    // Calculate date range
    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      };
    } else {
      const days = parseInt(period.replace("days", "")) || 30;
      dateFilter = {
        createdAt: {
          $gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
        },
      };
    }

    // Overall statistics
    const overallStats = await Donation.aggregate([
      {
        $group: {
          _id: null,
          totalPayments: { $sum: "$amount" },
          totalCount: { $sum: 1 },
          successfulCount: {
            $sum: {
              $cond: [{ $in: ["$status", ["completed", "approved"]] }, 1, 0],
            },
          },
          successfulAmount: {
            $sum: {
              $cond: [
                { $in: ["$status", ["completed", "approved"]] },
                "$amount",
                0,
              ],
            },
          },
          pendingCount: {
            $sum: {
              $cond: [{ $eq: ["$approvalStatus", "pending"] }, 1, 0],
            },
          },
          pendingAmount: {
            $sum: {
              $cond: [{ $eq: ["$approvalStatus", "pending"] }, "$amount", 0],
            },
          },
          failedCount: {
            $sum: {
              $cond: [{ $eq: ["$status", "failed"] }, 1, 0],
            },
          },
          failedAmount: {
            $sum: {
              $cond: [{ $eq: ["$status", "failed"] }, "$amount", 0],
            },
          },
        },
      },
    ]);

    // Period-specific statistics
    const periodStats = await Donation.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: null,
          periodTotal: { $sum: "$amount" },
          periodCount: { $sum: 1 },
          averagePayment: { $avg: "$amount" },
        },
      },
    ]);

    // Payment methods breakdown
    const paymentMethodsBreakdown = await Donation.aggregate([
      {
        $match: {
          status: { $in: ["completed", "approved"] },
        },
      },
      {
        $group: {
          _id: "$paymentMethod",
          count: { $sum: 1 },
          totalAmount: { $sum: "$amount" },
        },
      },
      {
        $project: {
          _id: 0,
          method: "$_id",
          count: 1,
          totalAmount: 1,
        },
      },
    ]);

    // Calculate total for percentages
    const totalPayments = paymentMethodsBreakdown.reduce(
      (sum, method) => sum + method.count,
      0,
    );

    const methodsWithPercentage = paymentMethodsBreakdown.map((method) => ({
      ...method,
      percentage: Math.round((method.count / totalPayments) * 100),
    }));

    // Daily trend for the period
    const dailyTrend = await Donation.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          amount: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 30 },
    ]);

    // Calculate growth/change percentages
    const previousPeriodStart = new Date(
      dateFilter.createdAt.$gte.getTime() -
        (dateFilter.createdAt.$lte?.getTime() ||
          Date.now() - dateFilter.createdAt.$gte.getTime()),
    );

    const previousPeriodStats = await Donation.aggregate([
      {
        $match: {
          createdAt: {
            $gte: previousPeriodStart,
            $lt: dateFilter.createdAt.$gte,
          },
        },
      },
      {
        $group: {
          _id: null,
          previousTotal: { $sum: "$amount" },
          previousCount: { $sum: 1 },
        },
      },
    ]);

    const currentPeriod = periodStats[0] || { periodTotal: 0, periodCount: 0 };
    const previousPeriod = previousPeriodStats[0] || {
      previousTotal: 0,
      previousCount: 0,
    };

    const calculateChange = (current, previous) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100);
    };

    return {
      overview: {
        totalPayments: overallStats[0]?.totalPayments || 0,
        totalCount: overallStats[0]?.totalCount || 0,
        successful: {
          count: overallStats[0]?.successfulCount || 0,
          amount: overallStats[0]?.successfulAmount || 0,
        },
        pending: {
          count: overallStats[0]?.pendingCount || 0,
          amount: overallStats[0]?.pendingAmount || 0,
        },
        failed: {
          count: overallStats[0]?.failedCount || 0,
          amount: overallStats[0]?.failedAmount || 0,
        },
      },
      period: {
        total: currentPeriod.periodTotal,
        count: currentPeriod.periodCount,
        average: currentPeriod.averagePayment || 0,
        change: {
          amount: calculateChange(
            currentPeriod.periodTotal,
            previousPeriod.previousTotal,
          ),
          count: calculateChange(
            currentPeriod.periodCount,
            previousPeriod.previousCount,
          ),
        },
      },
      paymentMethods: methodsWithPercentage,
      dailyTrend: dailyTrend.map((day) => ({
        date: day._id,
        amount: day.amount,
        count: day.count,
      })),
    };
  }

  async getAllPayments(queryObj) {
    const {
      status,
      approvalStatus,
      paymentMethod,
      startDate,
      endDate,
      search,
      page = 1,
      limit = 20,
      sortBy = "createdAt",
      order = "desc",
    } = queryObj;

    const query = {};

    if (status) query.status = status;
    if (approvalStatus) query.approvalStatus = approvalStatus;
    if (paymentMethod) query.paymentMethod = paymentMethod;

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    if (search) {
      const searchRegex = new RegExp(search, "i");
      const users = await User.find({
        $or: [{ fullName: searchRegex }, { email: searchRegex }],
      }).select("_id");
      const userIds = users.map((u) => u._id);

      const campaigns = await Campaign.find({
        title: searchRegex,
      }).select("_id");
      const campaignIds = campaigns.map((c) => c._id);

      query.$or = [
        { donationId: searchRegex },
        { paymentReference: searchRegex },
        { transactionId: searchRegex },
        { donor: { $in: userIds } },
        { campaign: { $in: campaignIds } },
      ];
    }

    const skip = (page - 1) * limit;
    const sortOrder = order === "desc" ? -1 : 1;

    const payments = await Donation.find(query)
      .populate({ path: "campaign", select: "title slug images category" })
      .populate({ path: "donor", select: "fullName email avatar" })
      .populate({ path: "approvedBy rejectedBy", select: "fullName email" })
      .sort({ [sortBy]: sortOrder })
      .limit(parseInt(limit))
      .skip(skip)
      .lean();

    const total = await Donation.countDocuments(query);

    const pageStats = await Donation.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
          successfulAmount: {
            $sum: {
              $cond: [
                { $in: ["$status", ["completed", "approved"]] },
                "$amount",
                0,
              ],
            },
          },
          pendingAmount: {
            $sum: {
              $cond: [{ $eq: ["$approvalStatus", "pending"] }, "$amount", 0],
            },
          },
        },
      },
    ]);

    return {
      payments,
      stats: pageStats[0] || {
        totalAmount: 0,
        successfulAmount: 0,
        pendingAmount: 0,
      },
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getPaymentDetails(id) {
    const payment = await Donation.findById(id)
      .populate({
        path: "campaign",
        select: "title slug images category location createdBy",
      })
      .populate({
        path: "donor",
        select: "fullName email avatar phone",
      })
      .populate({
        path: "approvedBy rejectedBy",
        select: "fullName email",
      });

    if (!payment) return null;

    const donorHistory = await Donation.find({
      donor: payment.donor._id,
      campaign: payment.campaign._id,
      _id: { $ne: payment._id },
    })
      .select("amount status createdAt")
      .sort({ createdAt: -1 })
      .limit(5);

    const donorStats = await Donation.aggregate([
      {
        $match: {
          donor: payment.donor._id,
          status: { $in: ["completed", "approved"] },
        },
      },
      {
        $group: {
          _id: null,
          totalDonated: { $sum: "$amount" },
          totalDonations: { $sum: 1 },
        },
      },
    ]);

    return {
      payment,
      donorHistory,
      donorStats: donorStats[0] || { totalDonated: 0, totalDonations: 0 },
    };
  }

  async approvePayment(id, adminId, adminNotes, impactMessage) {
    const payment = await Donation.findById(id).populate("campaign donor");
    if (!payment) throw new Error("Payment not found");

    if (!payment.paymentVerified && payment.paymentMethod !== "bank_transfer") {
      throw new Error("Payment must be verified before approval");
    }

    if (payment.approvalStatus !== "pending") {
      throw new Error(`Payment is already ${payment.approvalStatus}`);
    }

    payment.approvalStatus = "approved";
    payment.status = "completed";
    payment.paymentVerified = true;
    payment.verifiedAt = payment.verifiedAt || new Date();
    payment.approvedBy = adminId;
    payment.approvedAt = new Date();
    payment.completedAt = new Date();
    payment.adminNotes = adminNotes || "";
    payment.impactMessage = impactMessage || "";

    await payment.save();

    const campaign = payment.campaign;
    campaign.raisedAmount = (campaign.raisedAmount || 0) + payment.amount;

    if (!payment.anonymous) {
      const previousDonations = await Donation.countDocuments({
        campaign: campaign._id,
        donor: payment.donor._id,
        status: "completed",
        _id: { $ne: payment._id },
      });

      if (previousDonations === 0) {
        campaign.donorCount = (campaign.donorCount || 0) + 1;
      }
    }
    await campaign.save();

    const receipt = await generateReceipt(payment);
    payment.receiptUrl = receipt.url;
    payment.receiptNumber = receipt.number;
    payment.receiptGenerated = true;
    await payment.save();

    await sendEmail({
      to: payment.donor.email,
      subject: "Payment Protocol Verified - Impact Manifested",
      template: "paymentApproved",
      data: {
        donorName: payment.donor.fullName,
        amount: payment.amount,
        campaignTitle: campaign.title,
        donationId: payment.donationId,
        receiptUrl: receipt.url,
        impactMessage: payment.impactMessage,
      },
      attachments: [
        { filename: `receipt-${payment.donationId}.pdf`, path: receipt.path },
      ],
    }).catch(err => logger.error("Failed to send approval email:", err));

    if (receipt.path && fs.existsSync(receipt.path)) {
      try { fs.unlinkSync(receipt.path); } catch (err) {}
    }

    return payment;
  }

  async rejectPayment(id, adminId, rejectionReason, initiateRefund) {
    const payment = await Donation.findById(id).populate("campaign donor");
    if (!payment) throw new Error("Payment not found");

    if (payment.approvalStatus !== "pending") {
      throw new Error(`Cannot reject payment that is ${payment.approvalStatus}`);
    }

    payment.approvalStatus = "rejected";
    payment.status = initiateRefund ? "refunded" : "rejected";
    payment.rejectedBy = adminId;
    payment.rejectedAt = new Date();
    payment.rejectionReason = rejectionReason;

    if (initiateRefund && payment.transactionId) {
      payment.refundedAt = new Date();
      payment.refundReason = rejectionReason;

      try {
        const refundResponse = await refundTransaction(payment.paymentReference);
        if (refundResponse.status) {
          payment.refundStatus = "processed";
          payment.refundDetails = {
            refundedAt: new Date(),
            refundReference: refundResponse.data.transaction?.reference,
            amount: payment.amount,
          };
        } else {
          payment.refundStatus = "failed";
          payment.refundFailureReason = "Refund processing failed";
        }
      } catch (refundError) {
        payment.refundStatus = "failed";
        payment.refundFailureReason = refundError.message;
      }
    }

    await payment.save();

    await sendEmail({
      to: payment.donor.email,
      subject: "Payment Protocol Nullified",
      template: "paymentRejected",
      data: {
        donorName: payment.donor.fullName,
        amount: payment.amount,
        campaignTitle: payment.campaign.title,
        donationId: payment.donationId,
        reason: rejectionReason,
        refundInitiated: initiateRefund,
        refundStatus: payment.refundStatus || "pending",
      },
    }).catch(err => logger.error("Failed to send rejection email:", err));

    return payment;
  }

  async bulkApprovePayments(paymentIds, adminId, adminNotes) {
    const results = { approved: [], failed: [] };

    for (const paymentId of paymentIds) {
      try {
        const payment = await Donation.findById(paymentId).populate("campaign donor");

        if (!payment || (!payment.paymentVerified && payment.paymentMethod !== "bank_transfer") || payment.approvalStatus !== "pending") {
          results.failed.push({ id: paymentId, reason: "Payment not eligible for approval" });
          continue;
        }

        payment.approvalStatus = "approved";
        payment.status = "completed";
        payment.paymentVerified = true;
        payment.verifiedAt = payment.verifiedAt || new Date();
        payment.approvedBy = adminId;
        payment.approvedAt = new Date();
        payment.completedAt = new Date();
        payment.adminNotes = adminNotes || "";
        await payment.save();

        const campaign = payment.campaign;
        campaign.raisedAmount = (campaign.raisedAmount || 0) + payment.amount;
        await campaign.save();

        const receipt = await generateReceipt(payment);
        payment.receiptUrl = receipt.url;
        payment.receiptNumber = receipt.number;
        payment.receiptGenerated = true;
        await payment.save();

        results.approved.push(paymentId);

        await sendEmail({
          to: payment.donor.email,
          subject: "Payment Protocol Verified",
          template: "paymentApproved",
          data: {
            donorName: payment.donor.fullName,
            amount: payment.amount,
            campaignTitle: campaign.title,
            donationId: payment.donationId,
            receiptUrl: receipt.url,
          },
          attachments: [{ filename: `receipt-${payment.donationId}.pdf`, path: receipt.path }],
        }).catch(err => logger.error("Failed to send bulk approval email:", err));

        if (receipt.path && fs.existsSync(receipt.path)) {
          try { fs.unlinkSync(receipt.path); } catch (err) {}
        }
      } catch (error) {
        results.failed.push({ id: paymentId, reason: error.message });
      }
    }
    return results;
  }
}

export default new PaymentService();
