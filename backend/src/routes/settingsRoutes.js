// ============================================
// FILE: routes/settingsRoutes.js
// ============================================
import express from 'express';
import {
  getSettings,
  updateProfile,
  updateAvatar,
  removeAvatar,
  changePassword,
  updateSecurity,
  updateNotifications,
  updatePreferences,
  updatePrivacy,
  getActivityLog,
  deleteAccount
} from '../controllers/settingsController.js';
import { protect } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';

const router = express.Router();

// All settings routes require authentication
router.use(protect);

// ============================================
// SETTINGS ROUTES
// ============================================

/**
 * @route   GET /api/settings
 * @desc    Get all user settings
 * @access  Private
 */
router.get('/', getSettings);

/**
 * @route   PUT /api/settings/profile
 * @desc    Update profile information
 * @access  Private
 * @body    { fullName, phone, bio, location }
 */
router.put('/profile', updateProfile);

/**
 * @route   POST /api/settings/avatar
 * @desc    Upload/Update profile avatar
 * @access  Private
 * @file    avatar - Image file (JPG, PNG, GIF - max 2MB)
 */
router.post('/avatar', upload.single('avatar'), updateAvatar);

/**`
 * @route   DELETE /api/settings/avatar
 * @desc    Remove profile avatar
 * @access  Private
 */
router.delete('/avatar', removeAvatar);

/**
 * @route   PUT /api/settings/password
 * @desc    Change password
 * @access  Private
 * @body    { currentPassword, newPassword, confirmPassword }
 */
router.put('/password', changePassword);

/**
 * @route   PUT /api/settings/security
 * @desc    Update security settings (2FA)
 * @access  Private
 * @body    { twoFactorEnabled }
 */
router.put('/security', updateSecurity);

/**
 * @route   PUT /api/settings/notifications
 * @desc    Update notification preferences
 * @access  Private
 * @body    { emailNotifications: {...}, smsNotifications: {...} }
 */
router.put('/notifications', updateNotifications);

/**
 * @route   PUT /api/settings/privacy
 * @desc    Update privacy settings
 * @access  Private
 * @body    { profileVisibility, showDonations, showLocation, allowContact }
 */
router.put('/privacy', updatePrivacy);

/**
 * @route   PUT /api/settings/preferences
 * @desc    Update app preferences
 * @access  Private
 * @body    { language, timezone, currency, theme }
 */
router.put('/preferences', updatePreferences);

/**
 * @route   GET /api/settings/activity
 * @desc    Get account activity log
 * @access  Private
 * @query   page, limit
 */
router.get('/activity', getActivityLog);

/**
 * @route   DELETE /api/settings/account
 * @desc    Delete user account (soft delete)
 * @access  Private
 * @body    { password, confirmation: "DELETE" }
 */
router.delete('/account', deleteAccount);

export default router;