import Notification from "../models/Notification.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

/**
 * @desc Get all notifications for an admin (filtered by role)
 * @route GET /api/v1/notifications
 * @access Private/Admin
 */
export const getNotifications = asyncHandler(async (req, res, next) => {
  const { adminRole } = req.user;

  // Build query: super_admin sees all, others see 'all' or their specific role
  const query = adminRole === "super_admin" 
    ? {} 
    : { recipientRole: { $in: ["all", adminRole] } };

  const notifications = await Notification.find(query).sort({ createdAt: -1 }).limit(50);

  ApiResponse.success(res, "Notifications fetched successfully", notifications);
});

/**
 * @desc Mark a notification as read
 * @route PATCH /api/v1/notifications/:id/read
 * @access Private/Admin
 */
export const markAsRead = asyncHandler(async (req, res, next) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    return next(new ApiError("Notification not found", 404));
  }

  notification.isRead = true;
  await notification.save();

  ApiResponse.success(res, "Notification marked as read", notification);
});

/**
 * @desc Mark all notifications as read
 * @route PATCH /api/v1/notifications/read-all
 * @access Private/Admin
 */
export const markAllAsRead = asyncHandler(async (req, res, next) => {
  const { adminRole } = req.user;

  const query = adminRole === "super_admin" 
    ? { isRead: false } 
    : { isRead: false, recipientRole: { $in: ["all", adminRole] } };

  await Notification.updateMany(query, { isRead: true });

  ApiResponse.success(res, "All notifications marked as read");
});
