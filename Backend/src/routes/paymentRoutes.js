// ============================================
// FILE: routes/paymentRoutes.js
// ============================================
import express from 'express';
import {
  getPaymentStats,
  getAllPayments,
  getPaymentDetails,
  approvePayment,
  rejectPayment,
  bulkApprovePayments,
  exportPayments
} from '../controllers/paymentController.js';
import { protect, authorize, authorizeAdminRole } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { adminActionValidation, rejectionValidation } from '../validators/donation.validator.js';

const router = express.Router();

// All routes require admin authentication
router.use(protect);
router.use(authorize('admin'), authorizeAdminRole('finance_admin'));

// Statistics and analytics
router.get('/admin/stats', getPaymentStats);

// Payment listing and export
router.get('/admin/all', getAllPayments);
router.get('/admin/export', exportPayments);

// Individual payment management
router.get('/admin/:id', getPaymentDetails);
router.put('/admin/:id/approve', validate(adminActionValidation), approvePayment);
router.put('/admin/:id/reject', validate(rejectionValidation), rejectPayment);

// Bulk operations
router.post('/admin/bulk-approve', bulkApprovePayments);

export default router;