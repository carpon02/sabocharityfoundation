import express from "express";
import multer from "multer";
import {
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
} from "../controllers/authController.js";

import { protect } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validation.middleware.js";
import {
  registerValidation,
  loginValidation,
  passwordResetValidation,
  emailValidation,
  updateDetailsValidation,
  changePasswordValidation,
} from "../validators/auth.validator.js";
import { sanitizeInputs } from "../middleware/sanitize.middleware.js";

const router = express.Router();

// ========= Multer config for memory storage (used for avatar uploads) =========
const upload = multer({ storage: multer.memoryStorage() });

// ========= Public Auth Routes =========
router.post(
  "/register",
  sanitizeInputs,
  validate(registerValidation),
  register,
);
router.post("/login", sanitizeInputs, validate(loginValidation), login);
router.post("/google", googleLogin);
router.post(
  "/forgot-password",
  sanitizeInputs,
  validate(emailValidation),
  forgotPassword,
);
router.put(
  "/reset-password/:resetToken",
  sanitizeInputs,
  validate(passwordResetValidation),
  resetPassword,
);

// ✅ Email Verification Routes
router.get("/verify-email/:token", verifyEmail);
router.post("/resend-verification", protect, resendVerification);

// ========= Private Auth Routes (requires valid JWT) =========
router.use(protect);

// Get current logged-in user info
router.get("/me", getMe);

// Logout user
router.post("/logout", logout);

// Update user details (with avatar upload)
router.put(
  "/update-details",
  upload.single("avatar"),
  sanitizeInputs,
  validate(updateDetailsValidation),
  updateDetails,
);

// Change user password
router.put(
  "/change-password",
  sanitizeInputs,
  validate(changePasswordValidation),
  changePassword,
);

export default router;
