// ============================================
// FILE: services/domain/SettingsService.js
// Business logic for user settings, extracted
// from settingsController.js for testability
// and separation of concerns.
// ============================================
import User from "../../models/User.js";
import bcrypt from "bcryptjs";
import { sendEmail } from "../emailService.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../uploadService.js";
import logger from "../../config/logger.js";

class SettingsService {
  // ── helpers ──────────────────────────────────────────────────
  async _findUserOrThrow(userId, selectPassword = false) {
    const query = User.findById(userId);
    if (selectPassword) query.select("+password");
    const user = await query;
    if (!user) {
      const err = new Error("User not found");
      err.statusCode = 404;
      throw err;
    }
    return user;
  }

  // ── getSettings ─────────────────────────────────────────────
  async getSettings(userId) {
    const user = await this._findUserOrThrow(userId);

    return {
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
  }

  // ── updateProfile ───────────────────────────────────────────
  async updateProfile(userId, { fullName, phone, bio, location }) {
    const user = await this._findUserOrThrow(userId);

    if (fullName) user.fullName = fullName;
    if (phone) user.phone = phone;
    if (bio !== undefined) user.bio = bio;

    if (location) {
      if (!user.location) user.location = {};
      if (location.address !== undefined) user.location.address = location.address;
      if (location.city !== undefined) user.location.city = location.city;
      if (location.state !== undefined) user.location.state = location.state;
      if (location.country !== undefined) user.location.country = location.country;
    }

    user.updatedAt = Date.now();
    await user.save();

    return {
      id: user._id,
      name: user.fullName,
      email: user.email,
      phone: user.phone,
      bio: user.bio,
      location: user.location,
      avatar: user.avatar,
    };
  }

  // ── updateAvatar ────────────────────────────────────────────
  async updateAvatar(userId, file) {
    if (!file) {
      const err = new Error("Please upload an image file");
      err.statusCode = 400;
      throw err;
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.mimetype)) {
      const err = new Error("Invalid file type. Please upload JPG, PNG, or GIF.");
      err.statusCode = 400;
      throw err;
    }
    if (file.size > 2 * 1024 * 1024) {
      const err = new Error("File size must be less than 2MB");
      err.statusCode = 400;
      throw err;
    }

    const user = await this._findUserOrThrow(userId);

    // Delete old avatar if exists
    if (user.avatar && user.avatarPublicId) {
      await deleteFromCloudinary(user.avatarPublicId).catch((e) =>
        logger.warn("Error deleting old avatar:", { error: e.message, userId })
      );
    }

    const result = await uploadToCloudinary(file, "avatars");
    user.avatar = result.secure_url;
    user.avatarPublicId = result.public_id;
    user.updatedAt = Date.now();
    await user.save();

    return { avatar: user.avatar };
  }

  // ── removeAvatar ────────────────────────────────────────────
  async removeAvatar(userId) {
    const user = await this._findUserOrThrow(userId);

    if (user.avatar && user.avatarPublicId) {
      await deleteFromCloudinary(user.avatarPublicId).catch((e) =>
        logger.warn("Error deleting avatar:", { error: e.message, userId })
      );
    }

    user.avatar = "";
    user.avatarPublicId = "";
    user.updatedAt = Date.now();
    await user.save();
  }

  // ── changePassword ──────────────────────────────────────────
  async changePassword(userId, { currentPassword, newPassword, confirmPassword }, reqIp) {
    if (!currentPassword || !newPassword || !confirmPassword) {
      const err = new Error("Please provide all password fields");
      err.statusCode = 400;
      throw err;
    }
    if (newPassword !== confirmPassword) {
      const err = new Error("New password and confirmation do not match");
      err.statusCode = 400;
      throw err;
    }
    if (newPassword.length < 6) {
      const err = new Error("Password must be at least 6 characters");
      err.statusCode = 400;
      throw err;
    }

    const user = await this._findUserOrThrow(userId, true);

    if (user.authMethod === "google") {
      const err = new Error("Password changes are managed by Google for your account.");
      err.statusCode = 400;
      throw err;
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      const err = new Error("Current password is incorrect");
      err.statusCode = 401;
      throw err;
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.lastPasswordChange = Date.now();
    user.updatedAt = Date.now();
    await user.save();

    // Fire-and-forget notification
    sendEmail({
      to: user.email,
      subject: "Password Changed Successfully",
      template: "password-changed",
      data: { fullName: user.fullName, date: new Date().toLocaleString(), ipAddress: reqIp },
    }).catch((err) => logger.error("Email error after password change:", { error: err.message }));
  }

  // ── updateNotifications ─────────────────────────────────────
  async updateNotifications(userId, { emailNotifications, smsNotifications }) {
    const user = await this._findUserOrThrow(userId);
    if (!user.notifications) user.notifications = {};

    if (emailNotifications) {
      for (const key of ["campaignUpdates", "donationReceipts", "eventReminders", "weeklyDigest", "marketingEmails"]) {
        if (typeof emailNotifications[key] === "boolean") {
          user.notifications[key] = emailNotifications[key];
        }
      }
    }

    if (smsNotifications) {
      if (typeof smsNotifications.urgentAlerts === "boolean") user.notifications.urgentAlerts = smsNotifications.urgentAlerts;
      if (typeof smsNotifications.eventReminders === "boolean") user.notifications.smsEventReminders = smsNotifications.eventReminders;
      if (typeof smsNotifications.campaignMilestones === "boolean") user.notifications.campaignMilestones = smsNotifications.campaignMilestones;
    }

    user.updatedAt = Date.now();
    await user.save();

    return {
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
    };
  }

  // ── updatePrivacy ───────────────────────────────────────────
  async updatePrivacy(userId, { profileVisibility, showDonations, showLocation, allowContact }) {
    const user = await this._findUserOrThrow(userId);
    if (!user.privacy) user.privacy = {};

    if (profileVisibility) user.privacy.profileVisibility = profileVisibility;
    if (typeof showDonations === "boolean") user.privacy.showDonations = showDonations;
    if (typeof showLocation === "boolean") user.privacy.showLocation = showLocation;
    if (typeof allowContact === "boolean") user.privacy.allowContact = allowContact;

    user.updatedAt = Date.now();
    await user.save();
    return user.privacy;
  }

  // ── updatePreferences ───────────────────────────────────────
  async updatePreferences(userId, { language, currency, timezone, theme }) {
    const user = await this._findUserOrThrow(userId);
    if (!user.preferences) user.preferences = {};

    if (language) user.preferences.language = language;
    if (currency) user.preferences.currency = currency;
    if (timezone) user.preferences.timezone = timezone;
    if (theme) user.preferences.theme = theme;

    user.updatedAt = Date.now();
    await user.save();

    return {
      language: user.preferences.language,
      currency: user.preferences.currency,
      timezone: user.preferences.timezone,
      theme: user.preferences.theme,
    };
  }

  // ── updateSecurity ──────────────────────────────────────────
  async updateSecurity(userId, { twoFactorEnabled }) {
    const user = await this._findUserOrThrow(userId);

    if (typeof twoFactorEnabled === "boolean") {
      user.twoFactorEnabled = twoFactorEnabled;
    }

    user.updatedAt = Date.now();
    await user.save();

    if (typeof twoFactorEnabled === "boolean") {
      sendEmail({
        to: user.email,
        subject: `Two-Factor Authentication ${twoFactorEnabled ? "Enabled" : "Disabled"}`,
        template: "2fa-status-change",
        data: { fullName: user.fullName, enabled: twoFactorEnabled, date: new Date().toLocaleString() },
      }).catch((err) => logger.error("Email error during 2FA update:", { error: err.message }));
    }

    return { twoFactorEnabled: user.twoFactorEnabled };
  }

  // ── getActivityLog ──────────────────────────────────────────
  async getActivityLog(userId, { page = 1, limit = 20 }) {
    const user = await this._findUserOrThrow(userId);
    const activities = user.activityLog || [];
    const skip = (page - 1) * limit;
    const paginatedActivities = activities.slice(skip, skip + parseInt(limit));

    return {
      activities: paginatedActivities,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: activities.length,
        pages: Math.ceil(activities.length / limit),
      },
    };
  }

  // ── deleteAccount ───────────────────────────────────────────
  async deleteAccount(userId, { password, confirmation }) {
    if (!password || confirmation !== "DELETE") {
      const err = new Error("Please provide password and type DELETE to confirm");
      err.statusCode = 400;
      throw err;
    }

    const user = await this._findUserOrThrow(userId, true);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const err = new Error("Incorrect password");
      err.statusCode = 401;
      throw err;
    }

    if (user.avatarPublicId) {
      await deleteFromCloudinary(user.avatarPublicId).catch((e) =>
        logger.warn("Error deleting avatar during account deletion:", { error: e.message, userId })
      );
    }

    sendEmail({
      to: user.email,
      subject: "Account Deleted",
      template: "account-deleted",
      data: { fullName: user.fullName, date: new Date().toLocaleString() },
    }).catch((err) => logger.error("Email error during account deletion:", { error: err.message }));

    // Soft delete
    user.isActive = false;
    user.deletedAt = Date.now();
    await user.save();
  }
}

export default new SettingsService();
