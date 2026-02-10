import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../services/uploadService.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Pagination from "../utils/pagination.js";
import logger from "../config/logger.js";

// ==========================
// @desc    Register User
// @route   POST /api/v1/users/register
// @access  Public
// ==========================
export const registerUser = asyncHandler(async (req, res, next) => {
  const { fullName, email, password, phone, role } = req.body;

  if (!fullName || !email || !password) {
    return next(new ApiError("Please provide all required fields", 400));
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ApiError("User with this email already exists", 400));
  }

  const allowedRoles = ["guest", "donor"];
  const cleanRole = allowedRoles.includes(role) ? role : "guest";

  // Log registration attempt (development only)
  if (process.env.NODE_ENV === "development") {
    logger.debug("User registration attempt:", {
      email: email.toLowerCase(),
      role: cleanRole,
    });
  }

  const user = await User.create({
    fullName,
    email: email.toLowerCase(),
    password,
    phone: phone || null,
    role: cleanRole,
  });

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    token: generateToken(user._id),
    user: sanitizeUser(user),
  });
});

// ==========================
// @desc    Login User
// @route   POST /api/v1/users/login
// @access  Public
// ==========================
export const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ApiError("Please provide email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    return next(new ApiError("Invalid email or password", 401));
  }

  res.status(200).json({
    success: true,
    message: "Login successful",
    token: generateToken(user._id),
    user: sanitizeUser(user),
  });
});

// ==========================
// @desc    Get User Profile
// @route   GET /api/v1/users/profile
// @access  Private
// ==========================
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (!user) return next(new ApiError("User not found", 404));

  res.status(200).json({ success: true, data: user });
});

// ==========================
// @desc    Update User Profile (Includes Avatar)
// @route   PUT /api/v1/users/profile
// @access  Private
// ==========================
export const updateUserProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) return next(new ApiError("User not found", 404));

  const { fullName, email, password, phone, bio, location } = req.body;

  if (fullName) user.fullName = fullName;
  if (email && email !== user.email) user.email = email.toLowerCase();
  if (password) user.password = password;
  if (phone) user.phone = phone;
  if (bio) user.bio = bio;
  if (location && typeof location === "object")
    user.location = { ...user.location, ...location };

  // Handle avatar update (as string URL and publicId)
  if (req.file) {
    if (user.avatarPublicId) await deleteFromCloudinary(user.avatarPublicId);
    const uploaded = await uploadToCloudinary(req.file, "avatars");
    user.avatar = uploaded.url;
    user.avatarPublicId = uploaded.publicId;
  }

  const updatedUser = await user.save();

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user: sanitizeUser(updatedUser),
  });
});

// ==========================
// @desc    Get All Users (Admin)
// @route   GET /api/v1/users
// @access  Private/Admin
// ==========================
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");
  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
});

// ==========================
// @desc    Delete User (Admin)
// @route   DELETE /api/v1/users/:id
// @access  Private/Admin
// ==========================
export const deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new ApiError("User not found", 404));

  if (user.avatarPublicId) await deleteFromCloudinary(user.avatarPublicId);
  await user.deleteOne();

  res.status(200).json({ success: true, message: "User deleted successfully" });
});

// ==========================
// @desc    Update User Status (Ban/Unban)
// @route   PATCH /api/v1/users/:id/status
// @access  Private/Admin
// ==========================
export const updateUserStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body; // 'active', 'inactive', 'banned'
  const user = await User.findById(req.params.id);
  if (!user) return next(new ApiError("User not found", 404));

  if (status) user.status = status; // Assuming User model has a status field, or use isActive
  // If User model uses isActive boolean:
  if (req.body.isActive !== undefined) user.isActive = req.body.isActive;

  await user.save();
  res
    .status(200)
    .json({
      success: true,
      message: "User status updated",
      user: sanitizeUser(user),
    });
});

// ==========================
// @desc    Verify User (Manual)
// @route   PATCH /api/v1/users/:id/verify
// @access  Private/Admin
// ==========================
export const verifyUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new ApiError("User not found", 404));

  user.isEmailVerified = true;
  await user.save();

  res
    .status(200)
    .json({
      success: true,
      message: "User verified manually",
      user: sanitizeUser(user),
    });
});

// ==========================
// Helper Function to Clean Output
// ==========================
function sanitizeUser(user) {
  return {
    _id: user._id,
    fullName: user.fullName || "",
    email: user.email || "",
    phone: user.phone || "",
    bio: user.bio || "",
    avatar: user.avatar || null,
    location: user.location || { country: "Nigeria" },
    role: user.role,
  };
}
