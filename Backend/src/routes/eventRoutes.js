import express from "express";
import {
  getAllEvents,
  getEventById,
  getEventBySlug,
  createEvent,
  updateEvent,
  deleteEvent,
  getUpcomingEvents,
  getPastEvents,
  registerForEvent,
  cancelEventRegistration,
  addSpeaker,
  addAgendaItem,
  getEventStats,
} from "../controllers/eventController.js";
import {
  protect,
  restrictTo,
  optionalAuth,
} from "../middleware/auth.middleware.js";
import { uploadMultiple } from "../middleware/upload.middleware.js";
import { validate } from "../middleware/validation.middleware.js";
import { createEventValidation } from "../validators/event.validator.js";

const router = express.Router();
// ============ PUBLIC ROUTES ============
router.get("/", getAllEvents);
router.get("/upcoming", getUpcomingEvents);
router.get("/past", getPastEvents);

// --- Place static routes before parameterized ones ---
router.get("/stats", protect, restrictTo("admin"), getEventStats);
router.get("/slug/:slug", getEventBySlug);
router.get("/:id", getEventById);

// Event registration (authenticated or guest)
router.post("/:id/register", optionalAuth, registerForEvent);

// ============ PROTECTED ROUTES (Authenticated Users) ============
router.delete("/:id/register", protect, cancelEventRegistration);

// ============ ADMIN ROUTES ============
router.post(
  "/create-event",
  protect,
  restrictTo("admin"),
  uploadMultiple("images", 3),
  validate(createEventValidation),
  createEvent
);

router.put(
  "/:id",
  protect,
  restrictTo("admin"),
  uploadMultiple("images", 3),
  updateEvent
);

router.delete("/:id", protect, restrictTo("admin"), deleteEvent);

// Manage speakers
router.post("/:id/speakers", protect, restrictTo("admin"), addSpeaker);

// Manage agenda
router.post("/:id/agenda", protect, restrictTo("admin"), addAgendaItem);

export default router;
