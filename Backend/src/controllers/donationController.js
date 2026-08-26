/**
 * Donation Controller (Refactored)
 * HTTP request/response handling only - business logic moved to DonationService
 */
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
  NotFoundError,
  ValidationError,
  ForbiddenError,
} from "../utils/customErrors.js";
import donationService from "../services/domain/DonationService.js";
import donationRepository from "../repositories/DonationRepository.js";
import { generateReceipt } from "../services/receiptService.js";
import { PAGINATION } from "../constants/index.js";
import Donation from "../models/Donation.js";

/**
 * @desc    Initialize donation payment
 * @route   POST /api/v1/donations/initialize
 * @access  Private (Donor) or Public (guest donation)
 */
export const initializeDonation = asyncHandler(async (req, res, next) => {
  const donationData = {
    campaignId: req.body.campaignId,
    amount: req.body.amount,
    paymentMethod: req.body.paymentMethod,
    anonymous: req.body.anonymous,
    isRecurring: req.body.isRecurring,
    recurringFrequency: req.body.recurringFrequency,
    donorNote: req.body.donorNote,
  };

  const donorInfo = {
    user: req.user,
    firstName:
      req.user?.fullName?.split(" ")[0] ||
      req.body.donorInfo?.firstName ||
      req.body["donorInfo[firstName]"],
    lastName:
      req.user?.fullName?.split(" ").slice(1).join(" ") ||
      req.body.donorInfo?.lastName ||
      req.body["donorInfo[lastName]"],
    email:
      req.user?.email ||
      req.body.email ||
      req.body.donorInfo?.email ||
      req.body["donorInfo[email]"],
    phone:
      req.user?.phone ||
      req.body.donorInfo?.phone ||
      req.body["donorInfo[phone]"],
    ipAddress: req.ip,
    userAgent: req.get("user-agent"),
  };

  const result = await donationService.initializeDonation(
    donationData,
    donorInfo,
  );

  return ApiResponse.created(res, "Donation initialized successfully", result);
});

/**
 * @desc    Submit manual donation (Bank Transfer)
 * @route   POST /api/v1/donations/submit-manual
 * @access  Public
 */
export const submitManualDonation = asyncHandler(async (req, res, next) => {
  const donationData = {
    campaignId: req.body.campaignId,
    amount: req.body.amount,
    paymentMethod: "bank_transfer",
    anonymous: req.body.anonymous === "true" || req.body.anonymous === true,
    donorNote: req.body.message || req.body.donorNote,
  };

  const donorInfo = {
    user: req.user,
    firstName:
      req.user?.fullName?.split(" ")[0] ||
      req.body.donorInfo?.firstName ||
      req.body["donorInfo[firstName]"],
    lastName:
      req.user?.fullName?.split(" ").slice(1).join(" ") ||
      req.body.donorInfo?.lastName ||
      req.body["donorInfo[lastName]"],
    email:
      req.user?.email ||
      req.body.email ||
      req.body.donorInfo?.email ||
      req.body["donorInfo[email]"],
    phone:
      req.user?.phone ||
      req.body.donorInfo?.phone ||
      req.body["donorInfo[phone]"],
    ipAddress: req.ip,
    userAgent: req.get("user-agent"),
  };

  const file = req.file; // Receipt file from multer

  if (!file) {
    return next(new ValidationError("Payment receipt is required"));
  }

  const result = await donationService.submitManualDonation(
    donationData,
    file,
    donorInfo,
  );

  return ApiResponse.created(
    res,
    "Donation submitted successfully. Awaiting verification.",
    result,
  );
});

/**
 * @desc    Get donation status by payment reference (read-only, for frontend polling)
 * @route   GET /api/v1/donations/status/:reference
 * @access  Public
 */
export const getDonationStatus = asyncHandler(async (req, res, next) => {
  const { reference } = req.params;

  // Read-only: find by either reference field — no Paystack API call, no side effects.
  // The webhook is the sole authority for marking a donation as verified.
  const donation = await Donation.findOne({
    $or: [
      { paymentReference: reference },
      { paystackReference: reference },
    ],
  }).select("status approvalStatus paymentVerified amount donationId campaign")
    .populate("campaign", "title");

  if (!donation) {
    return next(new NotFoundError("Donation"));
  }

  return ApiResponse.success(res, "Donation status retrieved", {
    status: donation.status,
    approvalStatus: donation.approvalStatus,
    paymentVerified: donation.paymentVerified,
    amount: donation.amount,
    donationId: donation.donationId,
    campaignTitle: donation.campaign?.title,
  });
});

/**
 * @desc    Get user's donations
 * @route   GET /api/v1/donations/my-donations
 * @access  Private
 */
export const getMyDonations = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || PAGINATION.DEFAULT_PAGE;
  const limit = parseInt(req.query.limit) || PAGINATION.DEFAULT_LIMIT;
  const skip = (page - 1) * limit;

  const donations = await donationRepository.findByDonor(req.user._id, {
    populate: ["campaign"],
    sort: { createdAt: -1 },
    skip,
    limit,
    lean: false,
  });

  const total = await donationRepository.count({ donor: req.user._id });

  // Get donor statistics
  const statsResult = await donationRepository.getStatistics({
    donorId: req.user._id,
  });
  const stats = statsResult[0] || {
    totalDonated: 0,
    totalCount: 0,
    completedCount: 0,
    pendingCount: 0,
  };

  return ApiResponse.success(res, "Donations retrieved successfully", {
    donations,
    stats: {
      totalDonated: stats.completedAmount || 0,
      totalCount: stats.totalCount || 0,
      completedCount: stats.completedCount || 0,
      pendingCount: stats.pendingCount || 0,
    },
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

/**
 * @desc    Get all donations (Admin)
 * @route   GET /api/v1/donations/admin/all
 * @access  Private (Admin)
 */
export const getAllDonations = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || PAGINATION.DEFAULT_PAGE;
  const limit = parseInt(req.query.limit) || PAGINATION.DEFAULT_LIMIT;
  const skip = (page - 1) * limit;

  const query = {};
  if (req.query.status) query.status = req.query.status;
  if (req.query.campaignId) query.campaign = req.query.campaignId;

  const donations = await donationRepository.find(query, {
    populate: ["campaign", "donor"],
    sort: { createdAt: -1 },
    skip,
    limit,
  });

  const total = await donationRepository.count(query);

  // Get admin statistics for the current query/filters
  const statsResult = await donationRepository.getStatistics(req.query);
  const stats = statsResult[0] || {
    totalAmount: 0,
    totalCount: 0,
    completedCount: 0,
    pendingCount: 0,
  };

  return ApiResponse.success(res, "Donations retrieved successfully", {
    donations,
    stats: {
      totalAmount: stats.totalAmount || 0,
      totalCount: stats.totalCount || 0,
      completedCount: stats.completedCount || 0,
      pendingCount: stats.pendingCount || 0,
    },
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

/**
 * @desc    Get single donation
 * @route   GET /api/v1/donations/:id
 * @access  Private
 */
export const getDonation = asyncHandler(async (req, res, next) => {
  const donation = await donationRepository.findById(req.params.id, {
    populate: ["campaign", "donor"],
  });

  if (!donation) {
    return next(new NotFoundError("Donation"));
  }

  // Check ownership or admin
  const isOwner =
    donation.donor && donation.donor._id.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== "admin") {
    return next(new ForbiddenError("Not authorized to view this donation"));
  }

  return ApiResponse.success(res, "Donation retrieved successfully", {
    donation,
  });
});

/**
 * @desc    Approve donation (Admin)
 * @route   PUT /api/v1/donations/:id/approve
 * @access  Private (Admin)
 */
export const approveDonation = asyncHandler(async (req, res, next) => {
  const donation = await donationService.approveDonation(
    req.params.id,
    req.user._id,
  );

  return ApiResponse.success(res, "Donation approved successfully", {
    donation,
  });
});

/**
 * @desc    Reject donation (Admin)
 * @route   PUT /api/v1/donations/:id/reject
 * @access  Private (Admin)
 */
export const rejectDonation = asyncHandler(async (req, res, next) => {
  const { rejectionReason } = req.body;

  if (!rejectionReason) {
    return next(new ValidationError("Rejection reason is required"));
  }

  const donation = await donationService.rejectDonation(
    req.params.id,
    req.user._id,
    rejectionReason,
  );

  return ApiResponse.success(res, "Donation rejected successfully", {
    donation,
  });
});

/**
 * @desc    Download receipt
 * @route   GET /api/v1/donations/:id/receipt
 * @access  Private
 */
export const downloadReceipt = asyncHandler(async (req, res, next) => {
  const donation = await donationRepository.findById(req.params.id, {
    populate: ["campaign", "donor"],
  });

  if (!donation) {
    return next(new NotFoundError("Donation"));
  }

  // Check ownership or admin
  const isOwner =
    donation.donor && donation.donor._id.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== "admin") {
    return next(new ForbiddenError("Not authorized to download this receipt"));
  }

  if (
    donation.status !== "completed" &&
    donation.approvalStatus !== "approved"
  ) {
    return next(
      new ValidationError(
        "Receipt can only be generated for approved donations",
      ),
    );
  }

  // Generate receipt if not exists
  if (!donation.receiptUrl) {
    const receipt = await generateReceipt(donation);
    donation.receiptUrl = receipt.url;
    donation.receiptNumber = receipt.number;
    await donation.save();
  }

  return ApiResponse.success(res, "Receipt retrieved successfully", {
    receiptUrl: donation.receiptUrl,
    receiptNumber: donation.receiptNumber,
  });
});

/**
 * @desc    Regenerate receipt (Admin)
 * @route   POST /api/v1/donations/:id/regenerate-receipt
 * @access  Private (Admin)
 */
export const regenerateReceiptController = asyncHandler(
  async (req, res, next) => {
    const { regenerateReceipt } = await import("../services/receiptService.js");

    const receipt = await regenerateReceipt(req.params.id);

    return ApiResponse.success(res, "Receipt regenerated successfully", {
      receipt,
    });
  },
);
