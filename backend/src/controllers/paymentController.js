// ============================================
// FILE: controllers/paymentController.js
// ============================================
import paymentService from "../services/domain/PaymentService.js";
import logger from "../config/logger.js";
import { Parser } from "json2csv";

export const getPaymentStats = async (req, res) => {
  try {
    const stats = await paymentService.getPaymentStats(req.query);
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    logger.error("Get payment stats error:", { error: error.message, stack: error.stack, query: req.query, adminId: req.user?._id });
    res.status(500).json({ success: false, message: "Error fetching payment statistics", error: error.message });
  }
};

export const getAllPayments = async (req, res) => {
  try {
    const result = await paymentService.getAllPayments(req.query);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    logger.error("Get all payments error:", { error: error.message, stack: error.stack, query: req.query, adminId: req.user?._id });
    res.status(500).json({ success: false, message: "Error fetching payments", error: error.message });
  }
};

export const getPaymentDetails = async (req, res) => {
  try {
    const details = await paymentService.getPaymentDetails(req.params.id);
    if (!details) {
      return res.status(404).json({ success: false, message: "Payment not found" });
    }
    res.status(200).json({ success: true, data: details });
  } catch (error) {
    logger.error("Get payment details error:", { error: error.message, stack: error.stack, paymentId: req.params.id, adminId: req.user?._id });
    res.status(500).json({ success: false, message: "Error fetching payment details", error: error.message });
  }
};

export const approvePayment = async (req, res) => {
  try {
    const { adminNotes, impactMessage } = req.body;
    const payment = await paymentService.approvePayment(req.params.id, req.user._id, adminNotes, impactMessage);
    res.status(200).json({ success: true, message: "Payment approved successfully", data: { payment } });
  } catch (error) {
    logger.error("Approve payment error:", { error: error.message, stack: error.stack, paymentId: req.params.id, adminId: req.user?._id });
    const isClientError = ["Payment not found", "Payment must be verified before approval", "Payment is already"].some(msg => error.message.includes(msg));
    res.status(isClientError ? 400 : 500).json({ success: false, message: error.message || "Error approving payment" });
  }
};

export const rejectPayment = async (req, res) => {
  try {
    const { rejectionReason, initiateRefund } = req.body;
    if (!rejectionReason) {
      return res.status(400).json({ success: false, message: "Rejection reason is required" });
    }
    const payment = await paymentService.rejectPayment(req.params.id, req.user._id, rejectionReason, initiateRefund);
    res.status(200).json({ success: true, message: "Payment rejected", data: { payment } });
  } catch (error) {
    logger.error("Reject payment error:", { error: error.message, stack: error.stack, paymentId: req.params.id, adminId: req.user?._id });
    const isClientError = error.message.includes("not found") || error.message.includes("Cannot reject");
    res.status(isClientError ? 400 : 500).json({ success: false, message: error.message || "Error rejecting payment" });
  }
};

export const bulkApprovePayments = async (req, res) => {
  try {
    const { paymentIds, adminNotes } = req.body;
    if (!paymentIds || !Array.isArray(paymentIds) || paymentIds.length === 0) {
      return res.status(400).json({ success: false, message: "Payment IDs array is required" });
    }
    const results = await paymentService.bulkApprovePayments(paymentIds, req.user._id, adminNotes);
    res.status(200).json({ success: true, message: `Approved ${results.approved.length} of ${paymentIds.length} payments`, data: results });
  } catch (error) {
    logger.error("Bulk approve error:", { error: error.message, stack: error.stack, adminId: req.user?._id });
    res.status(500).json({ success: false, message: "Error in bulk approval", error: error.message });
  }
};

export const exportPayments = async (req, res) => {
  try {
    const result = await paymentService.getAllPayments({ ...req.query, limit: 10000 });
    const payments = result.payments;
    
    if (!payments.length) {
      return res.status(404).json({ success: false, message: "No payments found to export" });
    }

    const fields = [
      { label: 'Donation ID', value: 'donationId' },
      { label: 'Donor Name', value: 'donor.fullName' },
      { label: 'Donor Email', value: 'donor.email' },
      { label: 'Amount', value: 'amount' },
      { label: 'Status', value: 'status' },
      { label: 'Approval Status', value: 'approvalStatus' },
      { label: 'Campaign', value: 'campaign.title' },
      { label: 'Payment Method', value: 'paymentMethod' },
      { label: 'Date', value: 'createdAt' }
    ];

    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(payments);

    res.header('Content-Type', 'text/csv');
    res.attachment(`payments_export_${new Date().toISOString().split('T')[0]}.csv`);
    return res.send(csv);
  } catch (error) {
    logger.error("Export payments error:", { error: error.message, adminId: req.user?._id });
    res.status(500).json({ success: false, message: "Error exporting payments" });
  }
};
