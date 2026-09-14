// ============================================
// FILE: controllers/settingsController.js
// Thin HTTP layer — delegates to SettingsService
// ============================================
import settingsService from "../services/domain/SettingsService.js";
import logger from "../config/logger.js";

const handle = (action) => async (req, res) => {
  try {
    const result = await action(req);
    const message = result?._message || "Success";
    const data = result?._message ? undefined : result;
    res.status(200).json({ success: true, message, ...(data !== undefined && { data }) });
  } catch (error) {
    const status = error.statusCode || 500;
    logger.error(`Settings error (${req.route?.path}):`, {
      error: error.message,
      stack: error.stack,
      userId: req.user?._id,
    });
    res.status(status).json({ success: false, message: error.message });
  }
};

export const getSettings = handle((req) =>
  settingsService.getSettings(req.user._id)
);

export const updateProfile = handle((req) =>
  settingsService.updateProfile(req.user._id, req.body)
);

export const updateAvatar = handle((req) =>
  settingsService.updateAvatar(req.user._id, req.file)
);

export const removeAvatar = async (req, res) => {
  try {
    await settingsService.removeAvatar(req.user._id);
    res.status(200).json({ success: true, message: "Avatar removed successfully" });
  } catch (error) {
    const status = error.statusCode || 500;
    logger.error("Remove avatar error:", { error: error.message, userId: req.user?._id });
    res.status(status).json({ success: false, message: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    await settingsService.changePassword(req.user._id, req.body, req.ip);
    res.status(200).json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    const status = error.statusCode || 500;
    logger.error("Change password error:", { error: error.message, userId: req.user?._id });
    res.status(status).json({ success: false, message: error.message });
  }
};

export const updateNotifications = handle((req) =>
  settingsService.updateNotifications(req.user._id, req.body)
);

export const updatePrivacy = handle((req) =>
  settingsService.updatePrivacy(req.user._id, req.body)
);

export const updatePreferences = handle((req) =>
  settingsService.updatePreferences(req.user._id, req.body)
);

export const updateSecurity = handle((req) =>
  settingsService.updateSecurity(req.user._id, req.body)
);

export const getActivityLog = handle((req) =>
  settingsService.getActivityLog(req.user._id, req.query)
);

export const deleteAccount = async (req, res) => {
  try {
    await settingsService.deleteAccount(req.user._id, req.body);
    res.status(200).json({ success: true, message: "Account deleted successfully" });
  } catch (error) {
    const status = error.statusCode || 500;
    logger.error("Delete account error:", { error: error.message, userId: req.user?._id });
    res.status(status).json({ success: false, message: error.message });
  }
};
