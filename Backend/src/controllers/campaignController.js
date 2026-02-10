// campaignController.js - FIXED VERSION
import Campaign from "../models/Campaign.js";
import Donation from "../models/Donation.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Pagination from "../utils/pagination.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../services/uploadService.js";
import { sendEmail } from "../services/emailService.js";
import mongoose from "mongoose";

// ================ GET ALL CAMPAIGNS ================
export const getAllCampaigns = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const skip = (page - 1) * limit;

  const queryObj = { ...req.query };
  const excludedFields = ["page", "sort", "limit", "fields", "search"];
  excludedFields.forEach((el) => delete queryObj[el]);

  // FIXED: Build query based on user role
  let finalQuery = {};

  if (!req.user || req.user.role === "guest") {
    // Public users: only see active + approved campaigns
    finalQuery = {
      ...queryObj,
      status: "active",
      approved: true,
    };
  } else if (req.user.role === "donor") {
    // FIXED: Donors see ALL their own campaigns OR active approved campaigns from others
    const userId = new mongoose.Types.ObjectId(req.user.id);
    finalQuery = {
      ...queryObj,
      $or: [
        { createdBy: userId }, // All their campaigns (any status)
        { status: "active", approved: true }, // Only active approved from others
      ],
    };
  } else if (req.user.role === "admin") {
    // Admin sees all campaigns
    finalQuery = { ...queryObj };
  }

  // Search functionality
  if (req.query.search) {
    const searchConditions = [
      { title: { $regex: req.query.search, $options: "i" } },
      { description: { $regex: req.query.search, $options: "i" } },
      { tags: { $in: [req.query.search] } },
    ];

    // Merge search with existing query
    if (finalQuery.$or) {
      // If we already have $or (for donor), wrap it
      finalQuery = {
        $and: [{ $or: finalQuery.$or }, { $or: searchConditions }],
      };
      delete finalQuery.$or;
    } else {
      finalQuery.$or = searchConditions;
    }
  }

  // Category filter
  if (req.query.category) finalQuery.category = req.query.category;
  if (req.query.featured) finalQuery.featured = req.query.featured === "true";
  if (req.query.urgent) finalQuery.urgent = req.query.urgent === "true";

  let query = Campaign.find(finalQuery);
  query = req.query.sort
    ? query.sort(req.query.sort.split(",").join(" "))
    : query.sort("-featured -createdAt");

  if (req.query.fields) {
    query = query.select(req.query.fields.split(",").join(" "));
  }

  query = query.skip(skip).limit(limit).populate("createdBy", "name email");

  const campaigns = await query;
  const total = await Campaign.countDocuments(finalQuery);
  const pagination = new Pagination(page, limit, total);

  ApiResponse.success(res, "Campaigns fetched successfully", {
    campaigns,
    pagination: pagination.toJSON(),
  });
});

// ================ GET CAMPAIGN BY ID ================
export const getCampaign = asyncHandler(async (req, res, next) => {
  const campaign = await Campaign.findById(req.params.id)
    .populate("createdBy", "name email avatar fullName")
    .populate({
      path: "donations",
      options: { limit: 10, sort: "-createdAt" },
      populate: { path: "donor", select: "fullName name email avatar" },
    });

  if (!campaign) return next(new ApiError("Campaign not found", 404));

  // FIXED: Check if campaign is accessible
  const isAuthenticated = !!req.user;
  const isAdmin = isAuthenticated && req.user.role === "admin";
  const creatorId = campaign.createdBy._id
    ? campaign.createdBy._id.toString()
    : campaign.createdBy.toString();
  const isCreator =
    isAuthenticated && req.user.role === "donor" && creatorId === req.user.id;

  // Allow access if: admin, creator, OR (active + approved)
  if (
    !isAdmin &&
    !isCreator &&
    (campaign.status !== "active" || !campaign.approved)
  ) {
    return next(new ApiError("Campaign not accessible", 403));
  }

  ApiResponse.success(res, "Campaign fetched successfully", { campaign });
});

// ================ GET CAMPAIGN BY SLUG ================
export const getCampaignBySlug = asyncHandler(async (req, res, next) => {
  const campaign = await Campaign.findOne({ slug: req.params.slug })
    .populate("createdBy", "name email avatar fullName")
    .populate({
      path: "donations",
      options: { limit: 10, sort: "-createdAt" },
      populate: { path: "donor", select: "fullName name email avatar" },
    });

  if (!campaign) return next(new ApiError("Campaign not found", 404));

  // FIXED: Same access control as getCampaign
  const isAuthenticated = !!req.user;
  const isAdmin = isAuthenticated && req.user.role === "admin";
  const creatorId = campaign.createdBy._id
    ? campaign.createdBy._id.toString()
    : campaign.createdBy.toString();
  const isCreator =
    isAuthenticated && req.user.role === "donor" && creatorId === req.user.id;

  if (
    !isAdmin &&
    !isCreator &&
    (campaign.status !== "active" || !campaign.approved)
  ) {
    return next(new ApiError("Campaign not accessible", 403));
  }

  ApiResponse.success(res, "Campaign fetched successfully", { campaign });
});

// ================ CREATE CAMPAIGN ================
export const createCampaign = asyncHandler(async (req, res, next) => {
  if (!req.user) return next(new ApiError("Not authorized", 401));
  req.body.createdBy = new mongoose.Types.ObjectId(req.user.id);

  // FIXED: Set status and approval based on user role
  if (req.user.role === "donor") {
    req.body.status = "pending";
    req.body.approved = false; // Requires admin approval
  }
  if (req.user.role === "admin") {
    req.body.status = req.body.status || "active";
    req.body.approved = true; // Auto-approved
  }

  // FIXED: Handle empty strings or missing dates
  if (req.body.startDate === "" || req.body.startDate === null) {
    delete req.body.startDate;
  }
  if (req.body.endDate === "" || req.body.endDate === null) {
    delete req.body.endDate;
  }

  if (!req.body.startDate) {
    return next(
      new ApiError("Start date is required. Please select a valid date.", 400),
    );
  }

  // Handle empty dates - set endDate to 30 days after startDate if not provided
  if (req.body.startDate && !req.body.endDate) {
    const start = new Date(req.body.startDate);
    if (!isNaN(start.getTime())) {
      req.body.endDate = new Date(start.getTime() + 30 * 24 * 60 * 60 * 1000);
    }
  }

  if (!req.body.endDate) {
    return next(
      new ApiError("End date is required. Please select a valid date.", 400),
    );
  }

  // Parse JSON-stringified fields from FormData
  if (typeof req.body.location === "string" && req.body.location.trim()) {
    try {
      req.body.location = JSON.parse(req.body.location);
    } catch {
      const parts = req.body.location.split(",").map((p) => p.trim());
      req.body.location = {
        city: parts[0] || "",
        state: parts[1] || "",
        country: "Nigeria",
      };
    }
  }
  if (typeof req.body.tags === "string" && req.body.tags.trim()) {
    try {
      req.body.tags = JSON.parse(req.body.tags);
    } catch {
      req.body.tags = req.body.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
    }
  }
  if (
    typeof req.body.beneficiaries === "string" &&
    req.body.beneficiaries.trim()
  ) {
    req.body.beneficiaries = JSON.parse(req.body.beneficiaries);
  }

  if (req.files && req.files.length > 0) {
    const imageUploads = await Promise.all(
      req.files.map((file) => uploadToCloudinary(file, "campaigns")),
    );
    req.body.images = imageUploads.map((upload, index) => ({
      url: upload.secure_url,
      publicId: upload.public_id,
      isPrimary: index === 0,
    }));
  }

  const campaign = await Campaign.create(req.body);
  await campaign.updateDonationStats();
  ApiResponse.created(res, "Campaign created successfully", { campaign });
});

// ================ UPDATE CAMPAIGN ================
export const updateCampaign = asyncHandler(async (req, res, next) => {
  let campaign = await Campaign.findById(req.params.id);
  if (!campaign) return next(new ApiError("Campaign not found", 404));

  if (
    campaign.createdBy.toString() !== req.user.id &&
    req.user.role !== "admin"
  ) {
    return next(new ApiError("Not authorized to update this campaign", 403));
  }

  // FIXED: Donors can't manually change status or approved flag
  if (req.user.role === "donor") {
    delete req.body.status;
    delete req.body.approved;
  }

  // Handle empty dates
  if (req.body.startDate && !req.body.endDate) {
    const start = new Date(req.body.startDate);
    if (!isNaN(start.getTime())) {
      req.body.endDate = new Date(start.getTime() + 30 * 24 * 60 * 60 * 1000);
    }
  }

  // Parse JSON-stringified fields
  if (typeof req.body.location === "string" && req.body.location.trim()) {
    try {
      req.body.location = JSON.parse(req.body.location);
    } catch {
      const parts = req.body.location.split(",").map((p) => p.trim());
      req.body.location = {
        city: parts[0] || "",
        state: parts[1] || "",
        country: "Nigeria",
      };
    }
  }
  if (typeof req.body.tags === "string" && req.body.tags.trim()) {
    try {
      req.body.tags = JSON.parse(req.body.tags);
    } catch {
      req.body.tags = req.body.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
    }
  }
  if (
    typeof req.body.beneficiaries === "string" &&
    req.body.beneficiaries.trim()
  ) {
    req.body.beneficiaries = JSON.parse(req.body.beneficiaries);
  }

  if (req.files && req.files.length > 0) {
    const imageUploads = await Promise.all(
      req.files.map((file) => uploadToCloudinary(file, "campaigns")),
    );
    const newImages = imageUploads.map((upload) => ({
      url: upload.secure_url,
      publicId: upload.public_id,
      isPrimary: false,
    }));
    req.body.images = [...(campaign.images || []), ...newImages];
  }

  campaign = await Campaign.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  await campaign.updateDonationStats();
  ApiResponse.success(res, "Campaign updated successfully", { campaign });
});

// ================ DELETE CAMPAIGN ================
export const deleteCampaign = asyncHandler(async (req, res, next) => {
  const campaign = await Campaign.findById(req.params.id);
  if (!campaign) return next(new ApiError("Campaign not found", 404));

  if (
    campaign.createdBy.toString() !== req.user.id &&
    req.user.role !== "admin"
  ) {
    return next(new ApiError("Not authorized to delete this campaign", 403));
  }

  if (campaign.images && campaign.images.length > 0) {
    await Promise.all(
      campaign.images.map((img) => deleteFromCloudinary(img.publicId)),
    );
  }

  await campaign.deleteOne();
  ApiResponse.success(res, "Campaign deleted successfully");
});

// ================ ADD CAMPAIGN UPDATE ================
export const addCampaignUpdate = asyncHandler(async (req, res, next) => {
  const campaign = await Campaign.findById(req.params.id);
  if (!campaign) return next(new ApiError("Campaign not found", 404));

  if (
    campaign.createdBy.toString() !== req.user.id &&
    req.user.role !== "admin"
  ) {
    return next(
      new ApiError("Not authorized to add update to this campaign", 403),
    );
  }

  const update = {
    title: req.body.title,
    content: req.body.content,
    postedBy: req.user.id,
    createdAt: Date.now(),
  };

  if (req.files && req.files.length > 0) {
    const imageUploads = await Promise.all(
      req.files.map((file) => uploadToCloudinary(file, "campaign-updates")),
    );
    update.images = imageUploads.map((upload) => upload.url);
  }

  campaign.updates.push(update);
  await campaign.save();

  ApiResponse.success(res, "Campaign update added successfully", { campaign });
});

// ================ UPDATE STATUS (Admin only) ================
export const approveCampaign = asyncHandler(async (req, res, next) => {
  const { status } = req.body;
  const validStatuses = [
    "draft",
    "pending",
    "active",
    "paused",
    "completed",
    "cancelled",
    "rejected",
  ];

  if (!validStatuses.includes(status)) {
    return next(
      new ApiError(
        `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
        400,
      ),
    );
  }

  const campaign = await Campaign.findById(req.params.id);
  if (!campaign) return next(new ApiError("Campaign not found", 404));

  campaign.status = status;

  // FIXED: Synchronize approved flag with status
  if (status === "active") {
    campaign.approved = true;
  } else if (status === "rejected" || status === "cancelled") {
    campaign.approved = false;
  }
  // For pending/draft/paused, keep current approved state

  await campaign.save();

  ApiResponse.success(
    res,
    `Campaign status updated to "${status}" successfully`,
    { campaign },
  );
});

// ================ GET CAMPAIGN STATISTICS ================
export const getCampaignStats = asyncHandler(async (req, res, next) => {
  let match = {};
  if (req.user.role === "donor") {
    match = { createdBy: new mongoose.Types.ObjectId(req.user.id) };
  }

  const stats = await Campaign.aggregate([
    { $match: match },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
        totalTarget: { $sum: "$targetAmount" },
        totalRaised: { $sum: "$raisedAmount" },
      },
    },
  ]);

  const categoryStats = await Campaign.aggregate([
    { $match: match },
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
        totalRaised: { $sum: "$raisedAmount" },
      },
    },
  ]);

  ApiResponse.success(res, "Campaign statistics fetched successfully", {
    stats,
    categoryStats,
  });
});
