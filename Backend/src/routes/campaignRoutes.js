import express from 'express';
import {
  getAllCampaigns,
  getCampaign,
  getCampaignBySlug,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  addCampaignUpdate,
  getCampaignStats,
  approveCampaign
} from '../controllers/campaignController.js';

import { protect, authorize, optionalAuth } from '../middleware/auth.middleware.js';
import { uploadMultiple, handleUploadError } from '../middleware/upload.middleware.js';


const router = express.Router();

/**
 * @route   GET /api/v1/campaigns
 * @desc    Get all campaigns (public)
 */
router.get('/', optionalAuth, getAllCampaigns);

/**
 * @route   GET /api/v1/campaigns/stats
 * @desc    Get campaign statistics (donor + admin)
 */
router.get('/stats', protect, authorize('donor', 'admin'), getCampaignStats);


/**
 * @route   GET /api/v1/campaigns/slug/:slug
 * @desc    Get campaign by slug (public)
 */
router.get('/slug/:slug',optionalAuth,  getCampaignBySlug);


/**
 * @route   GET /api/v1/campaigns/:id
 * @desc    Get campaign by ID (public)
 */
router.get('/:id',optionalAuth, getCampaign);

/**
 * @route   POST /api/v1/campaigns
 * @desc    Create new campaign (donor + admin)
 */
router.post(
  '/create-campaign',
  protect,
  authorize('donor', 'admin'),
  uploadMultiple('images', 3),
  handleUploadError,
  createCampaign
);

/**
 * @route   PUT /api/v1/campaigns/:id
 * @desc    Update campaign (donor + admin)
 */
router.put(
  '/:id',
  protect,
  authorize('donor', 'admin'),
  uploadMultiple('images', 3),
  handleUploadError,
  updateCampaign
);

/**
 * @route   DELETE /api/v1/campaigns/:id
 * @desc    Delete campaign (donor + admin)
 */
router.delete(
  '/:id',
  protect,
  authorize('donor', 'admin'),
  deleteCampaign
);

/**
 * @route   POST /api/v1/campaigns/:id/updates
 * @desc    Add update to campaign (donor + admin)
 */
router.post(
  '/:id/updates',
  protect,
  authorize('donor', 'admin'),
  uploadMultiple('images', 3),
  handleUploadError,
  addCampaignUpdate
);
router.patch('/:id/status', protect, authorize('admin'), approveCampaign);



export default router;
