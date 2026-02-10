import Newsletter from "../models/Newsletter.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// @desc    Subscribe to newsletter
// @route   POST /api/v1/newsletters/subscribe
// @access  Public
export const subscribeNewsletter = asyncHandler(async (req, res, next) => {
  const { email, name, source } = req.body;

  if (!email) {
    return next(new ApiError("Email address is required", 400));
  }

  let existing = await Newsletter.findOne({ email });

  if (existing && existing.status === "subscribed") {
    return next(new ApiError("You are already subscribed", 400));
  }

  if (existing) {
    existing.status = "subscribed";
    existing.isActive = true;
    existing.unsubscribedAt = null;
    await existing.save();

    return ApiResponse.success(res, "Subscription reactivated successfully", {
      newsletter: existing,
    });
  }

  const newsletter = await Newsletter.create({ email, name, source });
  ApiResponse.created(res, "Subscribed to newsletter successfully", {
    newsletter,
  });
});

// @desc    Unsubscribe from newsletter
// @route   PATCH /api/v1/newsletters/unsubscribe
// @access  Public
export const unsubscribeNewsletter = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new ApiError("Email address is required", 400));
  }

  const newsletter = await Newsletter.findOne({ email });

  if (!newsletter) {
    return next(new ApiError("Subscriber not found", 404));
  }

  if (newsletter.status === "unsubscribed") {
    return next(new ApiError("You are already unsubscribed", 400));
  }

  newsletter.status = "unsubscribed";
  newsletter.isActive = false;
  newsletter.unsubscribedAt = new Date();
  await newsletter.save();

  ApiResponse.success(res, "Unsubscribed successfully", { newsletter });
});

// @desc    Get all newsletter subscribers
// @route   GET /api/v1/newsletters
// @access  Private/Admin
export const getAllSubscribers = asyncHandler(async (req, res, next) => {
  const subscribers = await Newsletter.find().sort("-createdAt");
  ApiResponse.success(res, "Subscribers fetched successfully", { subscribers });
});

// @desc    Get single subscriber
// @route   GET /api/v1/newsletters/:id
// @access  Private/Admin
export const getSubscriber = asyncHandler(async (req, res, next) => {
  const subscriber = await Newsletter.findById(req.params.id);

  if (!subscriber) {
    return next(new ApiError("Subscriber not found", 404));
  }

  ApiResponse.success(res, "Subscriber fetched successfully", { subscriber });
});

// @desc    Delete subscriber
// @route   DELETE /api/v1/newsletters/:id
// @access  Private/Admin
export const deleteSubscriber = asyncHandler(async (req, res, next) => {
  const subscriber = await Newsletter.findById(req.params.id);

  if (!subscriber) {
    return next(new ApiError("Subscriber not found", 404));
  }

  await subscriber.deleteOne();
  ApiResponse.success(res, "Subscriber deleted successfully");
});
