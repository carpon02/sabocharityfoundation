import express from "express";
import multer from "multer";
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  deleteUser,
  updateUserStatus,
  verifyUser,
} from "../controllers/userController.js";
import { protect, restrictTo } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validation.middleware.js";
import { sanitizeInputs } from "../middleware/sanitize.middleware.js";
import {
  registerValidation,
  loginValidation,
  updateDetailsValidation,
} from "../validators/auth.validator.js";

const router = express.Router();

// Multer config for memory storage (Cloudinary)
const upload = multer({ storage: multer.memoryStorage() });

// ✅ Public Routes with validation and sanitization
router.post(
  "/register",
  sanitizeInputs,
  validate(registerValidation), // registration schema
  registerUser
);

router.post(
  "/login",
  sanitizeInputs,
  validate(loginValidation), // login schema
  loginUser
);

// ✅ Authenticated User Routes (profile)
router.route("/profile").get(protect, getUserProfile).put(
  protect,
  upload.single("avatar"), // handle avatar upload
  sanitizeInputs, // ensure all input is sanitized
  validate(updateDetailsValidation), // update profile schema
  updateUserProfile
);

// ✅ Admin Routes
router.get("/", protect, restrictTo("admin", "super_admin"), getAllUsers);

router.delete("/:id", protect, restrictTo("admin", "super_admin"), deleteUser);
router.patch(
  "/:id/status",
  protect,
  restrictTo("admin", "super_admin"),
  updateUserStatus
);
router.patch(
  "/:id/verify",
  protect,
  restrictTo("admin", "super_admin"),
  verifyUser
);

export default router;
