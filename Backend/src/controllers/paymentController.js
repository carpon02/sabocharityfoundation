// ============================================
// FILE: controllers/paymentController.js
// ============================================
import Donation from "../models/Donation.js";
import Campaign from "../models/Campaign.js";
import User from "../models/User.js";
import fs from "fs";
import { sendEmail } from "../services/emailService.js";
import { generateReceipt } from "../services/receiptService.js";
import logger from "../config/logger.js";

// @desc    Get payment dashboard statistics
// @route   GET /api/payments/admin/stats
// @access  Private (Admin)
export const getPaymentStats = async (req, res) => {
  try {
    const { startDate, endDate, period = "30days" } = req.query;

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

    res.status(200).json({
      success: true,
      data: {
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
      },
    });
  } catch (error) {
    logger.error("Get payment stats error:", {
      error: error.message,
      stack: error.stack,
      query: req.query,
      adminId: req.user?._id,
    });
    res.status(500).json({
      success: false,
      message: "Error fetching payment statistics",
      error: error.message,
    });
  }
};

// @desc    Get all payments with filtering
// @route   GET /api/payments/admin/all
// @access  Private (Admin)
export const getAllPayments = async (req, res) => {
  try {
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
    } = req.query;

    const query = {};

    // Status filters
    if (status) query.status = status;
    if (approvalStatus) query.approvalStatus = approvalStatus;
    if (paymentMethod) query.paymentMethod = paymentMethod;

    // Date range filter
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    // Search functionality
    if (search) {
      const searchRegex = new RegExp(search, "i");

      // Find users matching search
      const users = await User.find({
        $or: [{ fullName: searchRegex }, { email: searchRegex }],
      }).select("_id");

      const userIds = users.map((u) => u._id);

      // Find campaigns matching search
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
      .skip(skip)
      .lean();

    const total = await Donation.countDocuments(query);

    // Calculate page statistics
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

    res.status(200).json({
      success: true,
      data: {
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
      },
    });
  } catch (error) {
    logger.error("Get all payments error:", {
      error: error.message,
      stack: error.stack,
      query: req.query,
      adminId: req.user?._id,
    });
    res.status(500).json({
      success: false,
      message: "Error fetching payments",
      error: error.message,
    });
  }
};

// @desc    Get payment details
// @route   GET /api/payments/admin/:id
// @access  Private (Admin)
export const getPaymentDetails = async (req, res) => {
  try {
    const payment = await Donation.findById(req.params.id)
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

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    // Get donor's payment history for this campaign
    const donorHistory = await Donation.find({
      donor: payment.donor._id,
      campaign: payment.campaign._id,
      _id: { $ne: payment._id },
    })
      .select("amount status createdAt")
      .sort({ createdAt: -1 })
      .limit(5);

    // Get donor's total contributions
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

    res.status(200).json({
      success: true,
      data: {
        payment,
        donorHistory,
        donorStats: donorStats[0] || { totalDonated: 0, totalDonations: 0 },
      },
    });
  } catch (error) {
    logger.error("Get payment details error:", {
      error: error.message,
      stack: error.stack,
      paymentId: req.params.id,
      adminId: req.user?._id,
    });
    res.status(500).json({
      success: false,
      message: "Error fetching payment details",
      error: error.message,
    });
  }
};

// @desc    Approve payment
// @route   PUT /api/payments/admin/:id/approve
// @access  Private (Admin)
export const approvePayment = async (req, res) => {
  try {
    const { adminNotes, impactMessage } = req.body;

    const payment = await Donation.findById(req.params.id).populate(
      "campaign donor",
    );

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    // Validation - For manual payments, approval serves as verification
    if (!payment.paymentVerified && payment.paymentMethod !== "bank_transfer") {
      return res.status(400).json({
        success: false,
        message: "Payment must be verified before approval",
      });
    }

    if (payment.approvalStatus !== "pending") {
      return res.status(400).json({
        success: false,
        message: `Payment is already ${payment.approvalStatus}`,
      });
    }

    // Update payment
    payment.approvalStatus = "approved";
    payment.status = "completed";
    payment.paymentVerified = true;
    payment.verifiedAt = payment.verifiedAt || new Date();
    payment.approvedBy = req.user._id;
    payment.approvedAt = new Date();
    payment.completedAt = new Date();
    payment.adminNotes = adminNotes || "";
    payment.impactMessage = impactMessage || "";

    await payment.save();

    // Update campaign statistics
    const campaign = payment.campaign;
    campaign.raisedAmount = (campaign.raisedAmount || 0) + payment.amount;

    // Update donor count if not anonymous and first donation
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

    // Generate receipt
    const receipt = await generateReceipt(payment);
    payment.receiptUrl = receipt.url;
    payment.receiptNumber = receipt.number;
    payment.receiptGenerated = true;
    await payment.save();

    // Send notification to donor
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
        {
          filename: `receipt-${payment.donationId}.pdf`,
          path: receipt.path,
        },
      ],
    });

    // Cleanup local file
    if (receipt.path && fs.existsSync(receipt.path)) {
      try {
        fs.unlinkSync(receipt.path);
      } catch (err) {
        logger.warn("Could not delete temporary receipt file:", receipt.path);
      }
    }

    res.status(200).json({
      success: true,
      message: "Payment approved successfully",
      data: { payment },
    });
  } catch (error) {
    logger.error("Approve payment error:", {
      error: error.message,
      stack: error.stack,
      paymentId: req.params.id,
      adminId: req.user?._id,
    });
    res.status(500).json({
      success: false,
      message: "Error approving payment",
      error: error.message,
    });
  }
};

// @desc    Reject payment
// @route   PUT /api/payments/admin/:id/reject
// @access  Private (Admin)
export const rejectPayment = async (req, res) => {
  try {
    const { rejectionReason, initiateRefund } = req.body;

    if (!rejectionReason) {
      return res.status(400).json({
        success: false,
        message: "Rejection reason is required",
      });
    }

    const payment = await Donation.findById(req.params.id).populate(
      "campaign donor",
    );

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    if (payment.approvalStatus !== "pending") {
      return res.status(400).json({
        success: false,
        message: `Cannot reject payment that is ${payment.approvalStatus}`,
      });
    }

    // Update payment
    payment.approvalStatus = "rejected";
    payment.status = initiateRefund ? "refunded" : "rejected";
    payment.rejectedBy = req.user._id;
    payment.rejectedAt = new Date();
    payment.rejectionReason = rejectionReason;

    if (initiateRefund && payment.transactionId) {
      payment.refundedAt = new Date();
      payment.refundReason = rejectionReason;

      try {
        const refundResponse = await refundTransaction(
          payment.paymentReference,
        );

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
        logger.error("Refund error:", {
          error: refundError.message,
          stack: refundError.stack,
          paymentId: payment._id,
          reference: payment.paymentReference,
        });
        payment.refundStatus = "failed";
        payment.refundFailureReason = refundError.message;
      }
    }

    await payment.save();

    // Send notification
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
    });

    res.status(200).json({
      success: true,
      message: "Payment rejected",
      data: { payment },
    });
  } catch (error) {
    logger.error("Reject payment error:", {
      error: error.message,
      stack: error.stack,
      paymentId: req.params.id,
      adminId: req.user?._id,
    });
    res.status(500).json({
      success: false,
      message: "Error rejecting payment",
      error: error.message,
    });
  }
};

// @desc    Bulk approve payments
// @route   POST /api/payments/admin/bulk-approve
// @access  Private (Admin)
export const bulkApprovePayments = async (req, res) => {
  try {
    const { paymentIds, adminNotes } = req.body;

    if (!paymentIds || !Array.isArray(paymentIds) || paymentIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Payment IDs array is required",
      });
    }

    const results = {
      approved: [],
      failed: [],
    };

    for (const paymentId of paymentIds) {
      try {
        const payment =
          await Donation.findById(paymentId).populate("campaign donor");

        if (
          !payment ||
          (!payment.paymentVerified &&
            payment.paymentMethod !== "bank_transfer") ||
          payment.approvalStatus !== "pending"
        ) {
          results.failed.push({
            id: paymentId,
            reason: "Payment not eligible for approval",
          });
          continue;
        }

        payment.approvalStatus = "approved";
        payment.status = "completed";
        payment.paymentVerified = true;
        payment.verifiedAt = payment.verifiedAt || new Date();
        payment.approvedBy = req.user._id;
        payment.approvedAt = new Date();
        payment.completedAt = new Date();
        payment.adminNotes = adminNotes || "";

        await payment.save();

        // Update campaign
        const campaign = payment.campaign;
        campaign.raisedAmount = (campaign.raisedAmount || 0) + payment.amount;
        await campaign.save();

        // Generate receipt
        const receipt = await generateReceipt(payment);
        payment.receiptUrl = receipt.url;
        payment.receiptNumber = receipt.number;
        payment.receiptGenerated = true;
        await payment.save();

        results.approved.push(paymentId);

        // Send notification
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
          attachments: [
            {
              filename: `receipt-${payment.donationId}.pdf`,
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
              "Could not delete temporary bulk receipt file:",
              receipt.path,
            );
          }
        }
      } catch (error) {
        logger.error("Error approving payment in bulk:", {
          error: error.message,
          stack: error.stack,
          paymentId: paymentId,
          adminId: req.user?._id,
        });
        results.failed.push({
          id: paymentId,
          reason: error.message,
        });
      }
    }

    res.status(200).json({
      success: true,
      message: `Approved ${results.approved.length} of ${paymentIds.length} payments`,
      data: results,
    });
  } catch (error) {
    logger.error("Bulk approve error:", {
      error: error.message,
      stack: error.stack,
      adminId: req.user?._id,
      paymentIds: req.body.paymentIds,
    });
    res.status(500).json({
      success: false,
      message: "Error processing bulk approval",
      error: error.message,
    });
  }
};

// @desc    Export payments
// @route   GET /api/payments/admin/export
// @access  Private (Admin)
export const exportPayments = async (req, res) => {
  try {
    const { format = "csv", ...filters } = req.query;

    const query = {};
    if (filters.status) query.status = filters.status;
    if (filters.approvalStatus) query.approvalStatus = filters.approvalStatus;
    if (filters.startDate || filters.endDate) {
      query.createdAt = {};
      if (filters.startDate) query.createdAt.$gte = new Date(filters.startDate);
      if (filters.endDate) query.createdAt.$lte = new Date(filters.endDate);
    }

    const payments = await Donation.find(query)
      .populate("donor", "fullName email")
      .populate("campaign", "title")
      .sort({ createdAt: -1 })
      .lean();

    if (format === "csv") {
      const csv = [
        [
          "Payment ID",
          "Donor",
          "Email",
          "Amount",
          "Campaign",
          "Method",
          "Status",
          "Date",
        ].join(","),
        ...payments.map((p) =>
          [
            p.donationId,
            p.anonymous ? "Anonymous" : p.donor?.fullName || "N/A",
            p.anonymous ? "" : p.donor?.email || "",
            p.amount,
            p.campaign?.title || "N/A",
            p.paymentMethod,
            p.status,
            new Date(p.createdAt).toISOString(),
          ].join(","),
        ),
      ].join("\n");

      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=payments-${Date.now()}.csv`,
      );
      return res.send(csv);
    }

    res.status(200).json({
      success: true,
      data: payments,
    });
  } catch (error) {
    logger.error("Export payments error:", {
      error: error.message,
      stack: error.stack,
      format: req.query.format,
      filters: req.query,
      adminId: req.user?._id,
    });
    res.status(500).json({
      success: false,
      message: "Error exporting payments",
      error: error.message,
    });
  }
};
