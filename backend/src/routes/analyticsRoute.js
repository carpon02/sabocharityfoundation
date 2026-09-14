// routes/analytics.js
import express from "express";
import { protect, authorize, authorizeAdminRole } from "../middleware/auth.middleware.js"; // Using your exact middleware imports
import {
  getPlatformAnalytics,
  getCampaignAnalytics,
  getDonationTrends,
  getEventAnalytics,
  getUserAnalytics,
  getOverviewAnalytics,
  exportDonationsCsv,
} from "../controllers/analyticsController.js";

const router = express.Router();

// Public analytics
router.get("/overview", getOverviewAnalytics);
router.get("/user", protect, getUserAnalytics);

// Admin-only analytics (Private - Restricted to admin role for platform oversight)
router.get("/", protect, authorize("admin"), authorizeAdminRole("finance_admin"), getPlatformAnalytics);
router.get("/campaigns", protect, authorize("admin"), authorizeAdminRole("content_editor"), getCampaignAnalytics);
router.get("/donations", protect, authorize("admin"), authorizeAdminRole("finance_admin"), getDonationTrends);
router.get("/events", protect, authorize("admin"), authorizeAdminRole("content_editor"), getEventAnalytics);
router.get("/export/donations", protect, authorize("admin"), authorizeAdminRole("finance_admin"), exportDonationsCsv);

export default router;
