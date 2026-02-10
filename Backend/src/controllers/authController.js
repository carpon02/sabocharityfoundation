import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { sendEmail } from "../services/emailService.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../services/uploadService.js";
import generateToken from "../utils/generateToken.js";
import logger from "../config/logger.js";

// ============================================
// Utility: Send JWT token in cookie + response
// ============================================
const sendTokenResponse = (user, statusCode, res, message) => {
  const token = generateToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };

  user.password = undefined;

  // Set cookie
  res.cookie("token", token, cookieOptions);

  // Return standard success response
  return ApiResponse.success(
    res,
    message,
    {
      user: sanitizeUser(user),
      token: token,
    },
    statusCode,
  );
};

function sanitizeUser(user) {
  return {
    _id: user._id,
    fullName: user.fullName || "",
    email: user.email || "",
    phone: user.phone || "",
    bio: user.bio || "",
    avatar: user.avatar || "",
    avatarPublicId: user.avatarPublicId || "",
    location: user.location || { country: "Nigeria" },
    role: user.role,
    isEmailVerified: user.isEmailVerified,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

// ============================================
// @desc Register new user (donor/admin)
// @route POST /api/v1/auth/register
// @access Public
// ============================================
export const register = asyncHandler(async (req, res, next) => {
  const { fullName, email, phone, password, role } = req.body;

  if (!fullName || !email || !password) {
    return next(new ApiError("Please provide all required fields", 400));
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ApiError("User with this email already exists", 400));
  }

  let userRole = "donor";
  let userEmailVerified = false;
  if (
    role === "admin" &&
    process.env.ADMIN_EMAIL &&
    email === process.env.ADMIN_EMAIL
  ) {
    userRole = "admin";
    userEmailVerified = true;
  }

  const user = await User.create({
    fullName,
    email,
    phone,
    password,
    role: userRole,
    isActive: true,
    isEmailVerified: userEmailVerified,
  });

  // Email verification for non-admin
  if (userRole !== "admin") {
    const verificationToken = crypto.randomBytes(32).toString("hex");
    user.emailVerificationToken = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");
    user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    const verificationUrl = `${clientUrl}/verify/${verificationToken}`;

    try {
      await sendEmail({
        to: user.email,
        subject: "Verify Your Email",
        template: "emailVerification",
        data: { name: user.fullName, verificationUrl },
      });

      return sendTokenResponse(
        user,
        201,
        res,
        "Registration successful. Please check your email to verify your account.",
      );
    } catch (error) {
      logger.error("Email sending error during registration:", {
        error: error.message,
        stack: error.stack,
        userId: user._id,
        email: user.email,
      });
      await User.deleteOne({ _id: user._id });
      return next(
        new ApiError(
          "Failed to send verification email. Please try again later.",
          500,
        ),
      );
    }
  }

  // For admin, respond once
  return sendTokenResponse(user, 201, res, "Admin registration successful.");
});

// ============================================
// @desc Login user (any role)
// @route POST /api/v1/auth/login
// @access Public
// ============================================
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ApiError("Please provide email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    return next(new ApiError("Invalid credentials", 401));
  }

  if (!user.isActive) {
    return next(new ApiError("Your account has been deactivated", 401));
  }

  user.lastLogin = Date.now();
  await user.save({ validateBeforeSave: false });

  return sendTokenResponse(user, 200, res, "Login successful");
});

// ============================================
// @desc Get logged-in user
// @route GET /api/v1/auth/me
// @access Private
// ============================================
// ============================================
// @desc Get logged-in user
// @route GET /api/v1/auth/me
// @access Private
// ============================================
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  return ApiResponse.success(res, "User profile fetched successfully", {
    user: sanitizeUser(user),
  });
});

// ============================================
// @desc Logout user
// @route POST /api/v1/auth/logout
// @access Private
// ============================================
export const logout = asyncHandler(async (req, res) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  return ApiResponse.success(res, "Logged out successfully");
});

// ============================================
// @desc Update user details + avatar
// @route PUT /api/v1/auth/update-details
// @access Private
// ============================================
export const updateDetails = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) return next(new ApiError("User not found", 404));

  if (req.body.fullName) user.fullName = req.body.fullName;
  if (req.body.phone) user.phone = req.body.phone;
  if (req.body.bio) user.bio = req.body.bio;
  if (req.body.location && typeof req.body.location === "object") {
    user.location = { ...user.location, ...req.body.location };
  }

  if (req.file) {
    if (user.avatarPublicId) {
      await deleteFromCloudinary(user.avatarPublicId);
    }
    const uploadResult = await uploadToCloudinary(req.file, "avatars");
    user.avatar = uploadResult.url;
    user.avatarPublicId = uploadResult.publicId;
  }

  const updatedUser = await user.save();

  return ApiResponse.success(res, "Profile updated successfully", {
    user: sanitizeUser(updatedUser),
  });
});

// ============================================
// @desc Change password
// @route PUT /api/v1/auth/change-password
// @access Private
// ============================================
export const changePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return next(new ApiError("Please provide current and new password", 400));
  }

  if (newPassword.length < 6) {
    return next(
      new ApiError("New password must be at least 6 characters", 400),
    );
  }

  const user = await User.findById(req.user.id).select("+password");

  if (!(await user.comparePassword(currentPassword))) {
    return next(new ApiError("Current password is incorrect", 401));
  }

  user.password = await bcrypt.hash(newPassword, 12);
  await user.save();

  return sendTokenResponse(user, 200, res, "Password changed successfully");
});

// ============================================
// @desc Forgot password
// @route POST /api/v1/auth/forgot-password
// @access Public
// ============================================
export const forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ApiError("No user found with that email", 404));
  }

  // Generate token
  const resetToken = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

  await user.save({ validateBeforeSave: false });

  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
  const resetUrl = `${clientUrl}/reset-password/${resetToken}`;

  try {
    await sendEmail({
      to: user.email,
      subject: "Password Reset Request",
      template: "passwordReset",
      data: { name: user.fullName, resetUrl },
    });

    // ✅ UPDATED: Consistent response structure
    return ApiResponse.success(
      res,
      "Password reset link sent to your email",
      null,
    );
  } catch (error) {
    console.error("Email sending error:", error);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ApiError("Email could not be sent. Please try again", 500));
  }
});

// ============================================
// @desc Reset password
// @route PUT /api/v1/auth/reset-password/:resetToken
// @access Public
// ============================================
export const resetPassword = asyncHandler(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: resetPasswordToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ApiError("Invalid or expired token", 400));
  }

  if (!req.body.password) {
    return next(new ApiError("Please provide a new password", 400));
  }

  if (req.body.password.length < 6) {
    return next(new ApiError("Password must be at least 6 characters", 400));
  }

  user.password = await bcrypt.hash(req.body.password, 12);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  return sendTokenResponse(user, 200, res, "Password reset successful");
});

// ============================================
// @desc Verify email
// @route GET /api/v1/auth/verify-email/:token
// @access Public
// ============================================
export const verifyEmail = asyncHandler(async (req, res, next) => {
  const tokenHash = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    emailVerificationToken: tokenHash,
    emailVerificationExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ApiError("Invalid or expired verification token", 400));
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save({ validateBeforeSave: false });

  logger.info("Email verified successfully", {
    userId: user._id,
    email: user.email,
  });

  return sendTokenResponse(user, 200, res, "Email verified successfully");
});

// ============================================
// @desc Resend verification email
// @route POST /api/v1/auth/resend-verification
// @access Private
// ============================================
export const resendVerification = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new ApiError("User not found", 404));
  }

  if (user.isEmailVerified) {
    return next(new ApiError("Email is already verified", 400));
  }

  const verificationToken = crypto.randomBytes(32).toString("hex");
  user.emailVerificationToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");
  user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;

  await user.save({ validateBeforeSave: false });

  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
  const verificationUrl = `${clientUrl}/verify/${verificationToken}`;

  try {
    await sendEmail({
      to: user.email,
      subject: "Verify Your Email",
      template: "emailVerification",
      data: { name: user.fullName, verificationUrl },
    });

    return ApiResponse.success(res, "Verification email sent successfully");
  } catch (error) {
    console.error("Email sending error:", error);
    return next(
      new ApiError("Failed to send verification email. Please try again", 500),
    );
  }
});

export default {
  register,
  login,
  getMe,
  logout,
  updateDetails,
  changePassword,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerification,
};
