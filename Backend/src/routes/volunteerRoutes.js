// src/routes/volunteer.routes.js
import express from "express";
import {
  createVolunteer,
  getAllVolunteers,
  getVolunteerById,
  updateVolunteer,
  deleteVolunteer,
  approveVolunteer,
  rejectVolunteer,
  logVolunteerActivity,
} from "../controllers/volunteerController.js";

import { protect, authorize } from "../middleware/auth.middleware.js";
import {
  uploadDocument,
  handleUploadError,
} from "../middleware/upload.middleware.js";
import { validate } from "../middleware/validation.middleware.js";
import { volunteerApplicationValidation } from "../validators/volunteer.validator.js";

const router = express.Router();

// ---------------------- PUBLIC ROUTES ----------------------
// Submit a volunteer application (with optional resume upload)
router.post(
  "/",
  uploadDocument("resume"), // handle resume upload
  handleUploadError, // catch multer errors
  validate(volunteerApplicationValidation), // validate request body
  createVolunteer
);

// ---------------------- ADMIN ROUTES ----------------------
// Protect all admin routes
router.use(protect, authorize("admin", "super_admin"));

// Get all volunteers
router.get("/", getAllVolunteers);

// Get single volunteer by ID
router.get("/:id", getVolunteerById);

// Update volunteer application
router.put("/:id", validate(volunteerApplicationValidation), updateVolunteer);

// Delete volunteer application
router.delete("/:id", deleteVolunteer);

// Approve volunteer
router.post("/:id/approve", approveVolunteer);

// Reject volunteer (requires reason)
router.post("/:id/reject", rejectVolunteer);

// Log volunteer activity
router.post("/:id/log-activity", logVolunteerActivity);

export default router;
