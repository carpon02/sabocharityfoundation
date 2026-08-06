import authService from "../services/domain/AuthService.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import generateToken from "../utils/generateToken.js";
import logger from "../config/logger.js";
import User from "../models/User.js";

const sendTokenResponse = (user, statusCode, res, message) => {
  const token = generateToken(user._id);

  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };

  user.password = undefined;

  res.cookie("token", token, cookieOptions);

  return ApiResponse.success(res, message, { user: sanitizeUser(user), token }, statusCode);
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
    adminRole: user.adminRole,
    isEmailVerified: user.isEmailVerified,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export const register = asyncHandler(async (req, res, next) => {
  try {
    const { user, message } = await authService.register(req.body);
    return sendTokenResponse(user, 201, res, message);
  } catch (error) {
    return next(new ApiError(error.message, 400));
  }
});

export const login = asyncHandler(async (req, res, next) => {
  try {
    const user = await authService.login(req.body.email, req.body.password);
    return sendTokenResponse(user, 200, res, "Login successful");
  } catch (error) {
    return next(new ApiError(error.message, 401));
  }
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  return ApiResponse.success(res, "User profile fetched successfully", { user: sanitizeUser(user) });
});

export const logout = asyncHandler(async (req, res) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  return ApiResponse.success(res, "Logged out successfully");
});

export const updateDetails = asyncHandler(async (req, res, next) => {
  try {
    const updatedUser = await authService.updateDetails(req.user.id, req.body, req.file);
    return ApiResponse.success(res, "Profile updated successfully", { user: sanitizeUser(updatedUser) });
  } catch (error) {
    return next(new ApiError(error.message, 400));
  }
});

export const changePassword = asyncHandler(async (req, res, next) => {
  try {
    const user = await authService.changePassword(req.user.id, req.body.currentPassword, req.body.newPassword);
    return sendTokenResponse(user, 200, res, "Password changed successfully");
  } catch (error) {
    return next(new ApiError(error.message, 400));
  }
});

export const forgotPassword = asyncHandler(async (req, res, next) => {
  try {
    await authService.forgotPassword(req.body.email);
    return ApiResponse.success(res, "Password reset link sent to your email", null);
  } catch (error) {
    const status = error.message.includes("No user") ? 404 : 500;
    return next(new ApiError(error.message, status));
  }
});

export const resetPassword = asyncHandler(async (req, res, next) => {
  try {
    const user = await authService.resetPassword(req.params.resetToken, req.body.password);
    return sendTokenResponse(user, 200, res, "Password reset successful");
  } catch (error) {
    return next(new ApiError(error.message, 400));
  }
});

export const verifyEmail = asyncHandler(async (req, res, next) => {
  try {
    const user = await authService.verifyEmail(req.params.token);
    logger.info("Email verified successfully", { userId: user._id, email: user.email });
    return sendTokenResponse(user, 200, res, "Email verified successfully");
  } catch (error) {
    return next(new ApiError(error.message, 400));
  }
});

export const resendVerification = asyncHandler(async (req, res, next) => {
  try {
    await authService.resendVerification(req.user.id);
    return ApiResponse.success(res, "Verification email sent successfully");
  } catch (error) {
    const status = error.message.includes("User not found") ? 404 : 400;
    return next(new ApiError(error.message, status));
  }
});

export const googleLogin = asyncHandler(async (req, res, next) => {
  try {
    const user = await authService.googleLogin(req.body.credential);
    return sendTokenResponse(user, 200, res, "Google login successful");
  } catch (error) {
    return next(new ApiError(error.message, 401));
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
  googleLogin,
};
