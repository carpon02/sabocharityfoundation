import express from "express";
import { protect, authorize } from "../middleware/auth.middleware.js";
import { uploadDocument, handleUploadError } from "../middleware/upload.middleware.js";
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

const router = express.Router();

/**
 * When a resume file is uploaded, the client wraps all JSON fields into a
 * single "data" string so multer can transport them. Expand it back here
 * before the request reaches the controller.
 */
const parseMultipartBody = (req, _res, next) => {
  if (typeof req.body?.data === "string") {
    try { req.body = JSON.parse(req.body.data); } catch { /* leave as-is */ }
  }
  next();
};

// ── Public ────────────────────────────────────────────────────
router.post(
  "/",
  uploadDocument("resume"),
  handleUploadError,
  parseMultipartBody,
  createVolunteer
);

// ── Admin (protected) ─────────────────────────────────────────
router.use(protect, authorize("admin", "super_admin"));

router.get("/",          getAllVolunteers);
router.get("/:id",       getVolunteerById);
router.put("/:id",       updateVolunteer);
router.delete("/:id",    deleteVolunteer);
router.post("/:id/approve",      approveVolunteer);
router.post("/:id/reject",       rejectVolunteer);
router.post("/:id/log-activity", logVolunteerActivity);

export default router;
