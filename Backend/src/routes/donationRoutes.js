// ============================================
// FILE: routes/donationRoutes.js
// ============================================
import express from "express";
import {
  initializeDonation,
  submitManualDonation,
  getDonationStatus,
  getMyDonations,
  getDonation,
  getAllDonations,
  approveDonation,
  rejectDonation,
  downloadReceipt,
  regenerateReceiptController,
} from "../controllers/donationController.js";
import { handlePaystackWebhook } from "../controllers/webhookController.js";
import {
  protect,
  restrictTo,
  optionalAuth,
} from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validation.middleware.js";
import { uploadDocument } from "../middleware/upload.middleware.js";
import {
  initializeDonationValidation,
  adminActionValidation,
  rejectionValidation,
} from "../validators/donation.validator.js";

const router = express.Router();

// ============================================
// IMPORTANT: Routes are matched in ORDER!
// More specific routes MUST come BEFORE generic ones
// ============================================

// --------- PUBLIC ROUTES (FIRST) ---------

/**
 * @route   POST /api/v1/donations/webhook
 * @desc    Paystack webhook handler (must be before other routes)
 * @access  Public (Paystack only)
 */
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  handlePaystackWebhook,
);

/**
 * @route   POST /api/v1/donations/initialize
 * @desc    Initialize a new donation (authenticated or guest)
 * @access  Public
 */
router.post(
  "/initialize",
  optionalAuth,
  validate(initializeDonationValidation),
  initializeDonation,
);

/**
 * @route   POST /api/v1/donations/submit-manual
 * @desc    Submit manual donation with receipt
 * @access  Public
 */
router.post(
  "/submit-manual",
  optionalAuth,
  uploadDocument("receipt"),
  submitManualDonation,
);

/**
 * @route   GET /api/v1/donations/status/:reference
 * @desc    Get current donation status by payment reference (read-only, for frontend polling)
 *          The webhook is the sole authority for verifying payments — this endpoint never
 *          calls Paystack or mutates any data.
 * @access  Public
 */
router.get("/status/:reference", getDonationStatus);

// --------- ADMIN ROUTES (BEFORE GENERIC :id ROUTES) ---------

/**
 * @route   GET /api/v1/donations/admin/all
 * @desc    Get all donations with filters
 * @access  Private (Admin only)
 */
router.get("/admin/all", protect, restrictTo("admin"), getAllDonations);

// --------- MY DONATIONS (BEFORE GENERIC :id ROUTES) ---------

/**
 * @route   GET /api/v1/donations/my-donations
 * @desc    Get logged-in user's donations
 * @access  Private (Authenticated user)
 */
router.get("/my-donations", protect, getMyDonations);

// --------- SPECIFIC :id ROUTES (BEFORE GENERIC :id) ---------

/**
 * @route   GET /api/v1/donations/:id/receipt
 * @desc    Download donation receipt
 * @access  Private (Owner or Admin)
 */
router.get("/:id/receipt", protect, downloadReceipt);

/**
 * @route   POST /api/v1/donations/:id/regenerate-receipt
 * @desc    Regenerate receipt (Admin only)
 * @access  Private (Admin)
 */
router.post(
  "/:id/regenerate-receipt",
  protect,
  restrictTo("admin"),
  regenerateReceiptController,
);

/**
 * @route   PUT /api/v1/donations/:id/approve
 * @desc    Approve a donation
 * @access  Private (Admin only)
 */
router.put(
  "/:id/approve",
  protect,
  restrictTo("admin"),
  validate(adminActionValidation),
  approveDonation,
);

/**
 * @route   PUT /api/v1/donations/:id/reject
 * @desc    Reject a donation
 * @access  Private (Admin only)
 */
router.put(
  "/:id/reject",
  protect,
  restrictTo("admin"),
  validate(rejectionValidation),
  rejectDonation,
);

// --------- GENERIC :id ROUTE (LAST) ---------

/**
 * @route   GET /api/v1/donations/:id
 * @desc    Get single donation details
 * @access  Private (Owner, Admin, or Campaign creator)
 */
router.get("/:id", protect, getDonation);

export default router;

// ============================================
// ROUTE ORDER EXPLANATION
// ============================================
/*

CORRECT ORDER (What we have now):
1. /initialize                    ✅ Specific path
2. /status/:reference             ✅ Specific path (read-only polling)
3. /admin/all                     ✅ Specific path
4. /my-donations                  ✅ Specific path
5. /:id/receipt                   ✅ More specific than /:id
6. /:id/regenerate-receipt        ✅ More specific than /:id
7. /:id/approve                   ✅ More specific than /:id
8. /:id/reject                    ✅ More specific than /:id
9. /:id                           ✅ Generic (catches everything else)

WRONG ORDER (Would cause issues):
1. /:id                           ❌ Would match /initialize!
2. /initialize                    ❌ Never reached
3. /verify/:reference             ❌ Never reached
4. /admin/all                     ❌ Would match /:id
...

WHY THIS MATTERS:
- If /:id comes first, it matches EVERYTHING
- /initialize becomes :id="initialize"
- /admin/all becomes :id="admin"
- Your specific routes never get called!

*/
