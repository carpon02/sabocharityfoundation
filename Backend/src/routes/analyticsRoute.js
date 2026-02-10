// routes/analytics.js
import express from "express";
import { protect, authorize } from "../middleware/auth.middleware.js"; // Using your exact middleware imports
import {
  getPlatformAnalytics,
  getCampaignAnalytics,
  getDonationTrends,
  getEventAnalytics,
  getUserAnalytics,
  getOverviewAnalytics,
} from "../controllers/analyticsController.js";

const router = express.Router();

// Public analytics
router.get("/overview", getOverviewAnalytics);
router.get("/user", protect, getUserAnalytics);

// Admin-only analytics (Private - Restricted to admin role for platform oversight)
router.get("/", protect, authorize("admin"), getPlatformAnalytics);
router.get("/campaigns", protect, authorize("admin"), getCampaignAnalytics);
router.get("/donations", protect, authorize("admin"), getDonationTrends);
router.get("/events", protect, authorize("admin"), getEventAnalytics);

export default router;
