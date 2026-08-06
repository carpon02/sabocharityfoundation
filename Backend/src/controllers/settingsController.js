// ============================================
// FILE: controllers/settingsController.js
// ============================================
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { sendEmail } from "../services/emailService.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../services/uploadService.js";
import logger from "../config/logger.js";

// @desc    Get user settings
// @route   GET /api/settings
// @access  Private
export const getSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Structure the response to match the required format
    const settings = {
      id: user._id,
      name: user.fullName,
      email: user.email,
      phone: user.phone || "",
      avatar: user.avatar || "",
      location: {
        address: user.location?.address || "",
        city: user.location?.city || "",
        state: user.location?.state || "",
        country: user.location?.country || "Nigeria",
      },
      bio: user.bio || "",
      dateJoined: user.createdAt,
      verified: user.isEmailVerified || false,
      preferences: {
        emailNotifications: {
          campaignUpdates: user.notifications?.campaignUpdates ?? true,
          donationReceipts: user.notifications?.donationReceipts ?? true,
          eventReminders: user.notifications?.eventReminders ?? true,
          weeklyDigest: user.notifications?.weeklyDigest ?? true,
          marketingEmails: user.notifications?.marketingEmails ?? false,
        },
        smsNotifications: {
          urgentAlerts: user.notifications?.urgentAlerts ?? true,
          eventReminders: user.notifications?.smsEventReminders ?? false,
          campaignMilestones: user.notifications?.campaignMilestones ?? true,
        },
        privacy: {
          profileVisibility: user.privacy?.profileVisibility || "public",
          showDonations: user.privacy?.showDonations ?? true,
          showLocation: user.privacy?.showLocation ?? true,
          allowContact: user.privacy?.allowContact ?? true,
        },
        language: user.preferences?.language || "en",
        currency: user.preferences?.currency || "NGN",
        timezone: user.preferences?.timezone || "Africa/Lagos",
        theme: user.preferences?.theme || "system",
      },
      twoFactorEnabled: user.twoFactorEnabled || false,
      lastLogin: user.lastLogin || null,
      authMethod: user.authMethod || "local",
    };

    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    logger.error("Get settings error:", {
      error: error.message,
      stack: error.stack,
      userId: req.user?._id,
    });
    res.status(500).json({
      success: false,
      message: "Error fetching settings",
      error: error.message,
    });
  }
};

// @desc    Update profile settings
// @route   PUT /api/settings/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const { fullName, phone, bio, location } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update profile fields
    if (fullName) user.fullName = fullName;
    if (phone) user.phone = phone;
    if (bio !== undefined) user.bio = bio;

    // Update location object
    if (location) {
      if (!user.location) user.location = {};
      if (location.address !== undefined)
        user.location.address = location.address;
      if (location.city !== undefined) user.location.city = location.city;
      if (location.state !== undefined) user.location.state = location.state;
      if (location.country !== undefined)
        user.location.country = location.country;
    }

    user.updatedAt = Date.now();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        id: user._id,
        name: user.fullName,
        email: user.email,
        phone: user.phone,
        bio: user.bio,
        location: user.location,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    logger.error("Update profile error:", {
      error: error.message,
      stack: error.stack,
      userId: req.user?._id,
    });
    res.status(500).json({
      success: false,
      message: "Error updating profile",
      error: error.message,
    });
  }
};

// @desc    Upload/Update profile avatar
// @route   POST /api/settings/avatar
// @access  Private
export const updateAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload an image file",
      });
    }

    // Validate file type and size (2MB max, images only)
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({
        success: false,
        message: "Invalid file type. Please upload JPG, PNG, or GIF.",
      });
    }
    if (req.file.size > 2 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        message: "File size must be less than 2MB",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Delete old avatar if exists
    if (user.avatar && user.avatarPublicId) {
      try {
        await deleteFromCloudinary(user.avatarPublicId);
      } catch (deleteError) {
        logger.warn("Error deleting old avatar:", {
          error: deleteError.message,
          userId: req.user?._id,
          avatarPublicId: user.avatarPublicId,
        });
        // Don't fail upload on delete error—log and continue
      }
    }

    // Upload new avatar (pass full req.file; service handles path/buffer)
    const result = await uploadToCloudinary(req.file, "avatars");

    user.avatar = result.secure_url;
    user.avatarPublicId = result.public_id;
    user.updatedAt = Date.now();

    await user.save();

    res.status(200).json({
      success: true,
      message:
        "Avatar updated successfully—your profile now shines brighter for our shared cause!",
      data: {
        avatar: user.avatar,
      },
    });
  } catch (error) {
    logger.error("Update avatar error:", {
      error: error.message,
      stack: error.stack,
      userId: req.user?._id,
    });
    res.status(500).json({
      success: false,
      message: "Error uploading avatar. Please try again or contact support.",
      error: error.message, // Include for debugging; remove in prod if sensitive
    });
  }
};

// @desc    Remove profile avatar
// @route   DELETE /api/settings/avatar
// @access  Private
export const removeAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Delete from cloudinary if exists
    if (user.avatar && user.avatarPublicId) {
      try {
        await deleteFromCloudinary(user.avatarPublicId);
      } catch (deleteError) {
        logger.warn("Error deleting avatar:", {
          error: deleteError.message,
          userId: req.user?._id,
          avatarPublicId: user.avatarPublicId,
        });
        // Log but don't fail—proceed to clear fields
      }
    }

    user.avatar = "";
    user.avatarPublicId = "";
    user.updatedAt = Date.now();

    await user.save();

    res.status(200).json({
      success: true,
      message: "Avatar removed successfully",
    });
  } catch (error) {
    logger.error("Remove avatar error:", {
      error: error.message,
      stack: error.stack,
      userId: req.user?._id,
    });
    res.status(500).json({
      success: false,
      message: "Error removing avatar",
      error: error.message,
    });
  }
};

// @desc    Change password
// @route   PUT /api/settings/password
// @access  Private
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide all password fields",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirmation do not match",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // Get user with password
    const user = await User.findById(req.user._id).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // DISALLOW password change for Google users
    if (user.authMethod === "google") {
      return res.status(400).json({
        success: false,
        message: "Password changes are managed by Google for your account.",
      });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.lastPasswordChange = Date.now();
    user.updatedAt = Date.now();

    await user.save();

    // Send email notification
    await sendEmail({
      to: user.email,
      subject: "Password Changed Successfully",
      template: "password-changed",
      data: {
        fullName: user.fullName,
        date: new Date().toLocaleString(),
        ipAddress: req.ip,
      },
    }).catch((err) => console.error("Email error:", err));

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    logger.error("Change password error:", {
      error: error.message,
      stack: error.stack,
      userId: req.user?._id,
    });
    res.status(500).json({
      success: false,
      message: "Error changing password",
      error: error.message,
    });
  }
};

// @desc    Update notification preferences
// @route   PUT /api/settings/notifications
// @access  Private
export const updateNotifications = async (req, res) => {
  try {
    const { emailNotifications, smsNotifications } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Initialize notifications object if it doesn't exist
    if (!user.notifications) {
      user.notifications = {};
    }

    // Update email notification preferences
    if (emailNotifications) {
      if (typeof emailNotifications.campaignUpdates === "boolean") {
        user.notifications.campaignUpdates = emailNotifications.campaignUpdates;
      }
      if (typeof emailNotifications.donationReceipts === "boolean") {
        user.notifications.donationReceipts =
          emailNotifications.donationReceipts;
      }
      if (typeof emailNotifications.eventReminders === "boolean") {
        user.notifications.eventReminders = emailNotifications.eventReminders;
      }
      if (typeof emailNotifications.weeklyDigest === "boolean") {
        user.notifications.weeklyDigest = emailNotifications.weeklyDigest;
      }
      if (typeof emailNotifications.marketingEmails === "boolean") {
        user.notifications.marketingEmails = emailNotifications.marketingEmails;
      }
    }

    // Update SMS notification preferences
    if (smsNotifications) {
      if (typeof smsNotifications.urgentAlerts === "boolean") {
        user.notifications.urgentAlerts = smsNotifications.urgentAlerts;
      }
      if (typeof smsNotifications.eventReminders === "boolean") {
        user.notifications.smsEventReminders = smsNotifications.eventReminders;
      }
      if (typeof smsNotifications.campaignMilestones === "boolean") {
        user.notifications.campaignMilestones =
          smsNotifications.campaignMilestones;
      }
    }

    user.updatedAt = Date.now();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Notification preferences updated successfully",
      data: {
        emailNotifications: {
          campaignUpdates: user.notifications.campaignUpdates,
          donationReceipts: user.notifications.donationReceipts,
          eventReminders: user.notifications.eventReminders,
          weeklyDigest: user.notifications.weeklyDigest,
          marketingEmails: user.notifications.marketingEmails,
        },
        smsNotifications: {
          urgentAlerts: user.notifications.urgentAlerts,
          eventReminders: user.notifications.smsEventReminders,
          campaignMilestones: user.notifications.campaignMilestones,
        },
      },
    });
  } catch (error) {
    logger.error("Update notifications error:", {
      error: error.message,
      stack: error.stack,
      userId: req.user?._id,
    });
    res.status(500).json({
      success: false,
      message: "Error updating notification preferences",
      error: error.message,
    });
  }
};

// @desc    Update privacy settings
// @route   PUT /api/settings/privacy
// @access  Private
export const updatePrivacy = async (req, res) => {
  try {
    const { profileVisibility, showDonations, showLocation, allowContact } =
      req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Initialize privacy object if it doesn't exist
    if (!user.privacy) {
      user.privacy = {};
    }

    // Update privacy settings
    if (profileVisibility) user.privacy.profileVisibility = profileVisibility;
    if (typeof showDonations === "boolean")
      user.privacy.showDonations = showDonations;
    if (typeof showLocation === "boolean")
      user.privacy.showLocation = showLocation;
    if (typeof allowContact === "boolean")
      user.privacy.allowContact = allowContact;

    user.updatedAt = Date.now();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Privacy settings updated successfully",
      data: user.privacy,
    });
  } catch (error) {
    logger.error("Update privacy error:", {
      error: error.message,
      stack: error.stack,
      userId: req.user?._id,
    });
    res.status(500).json({
      success: false,
      message: "Error updating privacy settings",
      error: error.message,
    });
  }
};

// @desc    Update app preferences
// @route   PUT /api/settings/preferences
// @access  Private
export const updatePreferences = async (req, res) => {
  try {
    const { language, currency, timezone, theme } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Initialize preferences object if it doesn't exist
    if (!user.preferences) {
      user.preferences = {};
    }

    // Update app preferences
    if (language) user.preferences.language = language;
    if (currency) user.preferences.currency = currency;
    if (timezone) user.preferences.timezone = timezone;
    if (theme) user.preferences.theme = theme;

    user.updatedAt = Date.now();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Preferences updated successfully",
      data: {
        language: user.preferences.language,
        currency: user.preferences.currency,
        timezone: user.preferences.timezone,
        theme: user.preferences.theme,
      },
    });
  } catch (error) {
    logger.error("Update preferences error:", {
      error: error.message,
      stack: error.stack,
      userId: req.user?._id,
    });
    res.status(500).json({
      success: false,
      message: "Error updating preferences",
      error: error.message,
    });
  }
};

// @desc    Update security settings (2FA)
// @route   PUT /api/settings/security
// @access  Private
export const updateSecurity = async (req, res) => {
  try {
    const { twoFactorEnabled } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update security settings
    if (typeof twoFactorEnabled === "boolean") {
      user.twoFactorEnabled = twoFactorEnabled;
    }

    user.updatedAt = Date.now();
    await user.save();

    // Send notification if 2FA was enabled/disabled
    if (typeof twoFactorEnabled === "boolean") {
      await sendEmail({
        to: user.email,
        subject: `Two-Factor Authentication ${twoFactorEnabled ? "Enabled" : "Disabled"}`,
        template: "2fa-status-change",
        data: {
          fullName: user.fullName,
          enabled: twoFactorEnabled,
          date: new Date().toLocaleString(),
        },
      }).catch((err) =>
        logger.error("Email error during 2FA update:", {
          error: err.message,
          userId: req.user?._id,
        }),
      );
    }

    res.status(200).json({
      success: true,
      message: "Security settings updated successfully",
      data: {
        twoFactorEnabled: user.twoFactorEnabled,
      },
    });
  } catch (error) {
    logger.error("Update security error:", {
      error: error.message,
      stack: error.stack,
      userId: req.user?._id,
    });
    res.status(500).json({
      success: false,
      message: "Error updating security settings",
      error: error.message,
    });
  }
};

// @desc    Get account activity log
// @route   GET /api/settings/activity
// @access  Private
export const getActivityLog = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Get activity logs
    const activities = user.activityLog || [];

    const skip = (page - 1) * limit;
    const paginatedActivities = activities.slice(skip, skip + parseInt(limit));

    res.status(200).json({
      success: true,
      data: {
        activities: paginatedActivities,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: activities.length,
          pages: Math.ceil(activities.length / limit),
        },
      },
    });
  } catch (error) {
    logger.error("Get activity log error:", {
      error: error.message,
      stack: error.stack,
      userId: req.user?._id,
    });
    res.status(500).json({
      success: false,
      message: "Error fetching activity log",
      error: error.message,
    });
  }
};

// @desc    Delete account
// @route   DELETE /api/settings/account
// @access  Private
export const deleteAccount = async (req, res) => {
  try {
    const { password, confirmation } = req.body;

    if (!password || confirmation !== "DELETE") {
      return res.status(400).json({
        success: false,
        message: "Please provide password and type DELETE to confirm",
      });
    }

    // Get user with password
    const user = await User.findById(req.user._id).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
      });
    }

    // Delete avatar from cloudinary
    if (user.avatarPublicId) {
      try {
        await deleteFromCloudinary(user.avatarPublicId);
      } catch (deleteError) {
        logger.warn("Error deleting avatar during account deletion:", {
          error: deleteError.message,
          userId: req.user?._id,
          avatarPublicId: user.avatarPublicId,
        });
      }
    }

    // Send goodbye email
    await sendEmail({
      to: user.email,
      subject: "Account Deleted",
      template: "account-deleted",
      data: {
        fullName: user.fullName,
        date: new Date().toLocaleString(),
      },
    }).catch((err) => console.error("Email error:", err));

    // Soft delete - mark as inactive instead of deleting
    user.isActive = false;
    user.deletedAt = Date.now();
    await user.save();

    // Or hard delete
    // await User.findByIdAndDelete(req.user._id);

    res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    logger.error("Delete account error:", {
      error: error.message,
      stack: error.stack,
      userId: req.user?._id,
    });
    res.status(500).json({
      success: false,
      message: "Error deleting account",
      error: error.message,
    });
  }
};
