import React, { useState, useEffect, useCallback } from "react";
import { useTheme } from "../../context/ThemeContext";
import { AnimatePresence } from "framer-motion";
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Lock as LockIcon,
  Camera,
  RefreshCw,
  Zap,
  Activity,
  Globe,
  CreditCard,
  Clock,
  Eye,
  Mail,
  Smartphone,
  ChevronRight,
  Sparkles,
  Info,
} from "lucide-react";
import apiClient from "../../config/apiConfig";

// Mock User Data for fallback (in case API fails)
const MOCK_USER_DATA = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+234 801 234 5678",
  bio: "Passionate about supporting underprivileged communities in Ibadan through education and healthcare initiatives.",
  avatar:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  verified: true,
  twoFactorEnabled: false,
  dateJoined: "2024-01-15T10:00:00Z",
  lastLogin: "2025-10-25T08:30:00Z",
  location: {
    address: "123 Sabo Road",
    city: "Ibadan",
    state: "Oyo",
    country: "Nigeria",
  },
  preferences: {
    emailNotifications: {
      campaignUpdates: true,
      donationReceipts: true,
      eventReminders: true,
      weeklyDigest: false,
      marketingEmails: true,
    },
    smsNotifications: {
      urgentAlerts: true,
      eventReminders: true,
      campaignMilestones: true,
    },
    privacy: {
      profileVisibility: "public",
      showDonations: true,
      showLocation: true,
      allowContact: false,
    },
    language: "en",
    currency: "NGN",
    timezone: "Africa/Lagos",
    theme: "system",
  },
};

// Component: Profile Section - Personal Identity Module
const ProfileSection = ({ user, onUpdate, isLoading, onRefresh }) => {
  const { darkMode } = useTheme();
  const [editing, setEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user.name || "",
    phone: user.phone || "",
    bio: user.bio || "",
    location: {
      address: user.location?.address || "",
      city: user.location?.city || "",
      state: user.location?.state || "",
      country: user.location?.country || "Nigeria",
    },
  });
  const handleSave = useCallback(async () => {
    try {
      await onUpdate("profile", formData);
      setEditing(false);
    } catch (error) {
      console.error("Profile update failed:", error);
    }
  }, [formData, onUpdate]);

  const handleCancel = () => {
    setFormData({
      fullName: user.name,
      phone: user.phone,
      bio: user.bio,
      location: user.location,
    });
    setEditing(false);
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return alert("Please upload an image");
    if (file.size > 2 * 1024 * 1024) return alert("File size must be < 2MB");

    setUploading(true);
    try {
      const uploadData = new FormData();
      uploadData.append("avatar", file);
      await apiClient.post("/settings/avatar", uploadData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await onRefresh();
    } catch (error) {
      console.error("Avatar upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-[2.5rem] border overflow-hidden backdrop-blur-xl transition-all duration-500
        ${
          darkMode
            ? "bg-gray-950/40 border-gray-800 shadow-2xl shadow-indigo-500/5"
            : "bg-white border-gray-100 shadow-xl shadow-gray-200/50"
        }`}
    >
      <div className="p-6 sm:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h2
              className={`text-xl font-bold tracking-tight ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Profile Information
            </h2>
            <p
              className={`text-xs font-semibold uppercase tracking-widest mt-2 ${
                darkMode ? "text-emerald-500/60" : "text-emerald-600/60"
              }`}
            >
              Manage your personal impact records
            </p>
          </div>

          <div className="flex gap-4">
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className={`px-6 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all duration-300
                  ${
                    darkMode
                      ? "bg-gray-900 text-emerald-500/80 hover:bg-emerald-600 hover:text-white"
                      : "bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white"
                  }`}
              >
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={handleCancel}
                  className={`px-5 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all
                    ${
                      darkMode
                        ? "text-gray-400 hover:text-white"
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Avatar Forge */}
          <div className="relative group self-center lg:self-start">
            <div
              className={`w-24 h-24 sm:w-32 sm:h-32 rounded-2xl p-1 overflow-hidden border-2 transition-all duration-500 group-hover:p-0
              ${
                darkMode
                  ? "border-gray-800 group-hover:border-emerald-500"
                  : "border-gray-100 group-hover:border-emerald-600"
              }`}
            >
              <img
                src={
                  user.avatar ||
                  `https://ui-avatars.com/api/?name=${user.name}&background=059669&color=fff`
                }
                alt={user.name}
                className="w-full h-full object-cover rounded-2xl transition-transform duration-700 group-hover:scale-110"
              />
            </div>

            <label className="absolute -bottom-1 -right-1 bg-emerald-600 text-white rounded-xl p-3 hover:scale-110 active:scale-90 shadow-lg shadow-emerald-500/30 transition-all cursor-pointer">
              {uploading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Camera className="w-5 h-5" />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>

            {user.verified && (
              <div className="absolute -top-2 -right-2 bg-emerald-500 text-white rounded-xl p-2 shadow-lg shadow-emerald-500/20">
                <Shield size={16} />
              </div>
            )}
          </div>

          {/* Form Matrix */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label
                className={`text-[10px] font-bold uppercase tracking-widest ml-1 ${
                  darkMode ? "text-gray-500" : "text-gray-400"
                }`}
              >
                Full Name
              </label>
              {editing ? (
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      fullName: e.target.value,
                    }))
                  }
                  className={`w-full px-6 py-4 rounded-xl font-semibold bg-transparent border-2 outline-none transition-all
                    ${
                      darkMode
                        ? "border-gray-800 text-white focus:border-emerald-500/50"
                        : "border-gray-100 text-gray-900 focus:border-emerald-600/30"
                    }`}
                />
              ) : (
                <p
                  className={`px-5 py-3 rounded-xl font-bold text-base ${
                    darkMode
                      ? "bg-gray-900/50 text-white"
                      : "bg-gray-50 text-gray-900"
                  }`}
                >
                  {user.name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                className={`text-[10px] font-bold uppercase tracking-widest ml-1 ${
                  darkMode ? "text-gray-500" : "text-gray-400"
                }`}
              >
                Email Address
              </label>
              <div
                className={`flex items-center justify-between px-5 py-3 rounded-xl font-semibold text-sm ${
                  darkMode
                    ? "bg-gray-900/50 text-white"
                    : "bg-gray-50 text-gray-900"
                }`}
              >
                <span>{user.email}</span>
                {user.verified && (
                  <span className="text-[10px] font-bold uppercase text-emerald-500 tracking-tighter">
                    Verified Holder
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label
                className={`text-[10px] font-bold uppercase tracking-widest ml-1 ${
                  darkMode ? "text-gray-500" : "text-gray-400"
                }`}
              >
                Phone Number
              </label>
              {editing ? (
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  className={`w-full px-6 py-4 rounded-xl font-semibold bg-transparent border-2 outline-none transition-all
                    ${
                      darkMode
                        ? "border-gray-800 text-white focus:border-emerald-500/50"
                        : "border-gray-100 text-gray-900 focus:border-emerald-600/30"
                    }`}
                />
              ) : (
                <p
                  className={`px-5 py-3 rounded-xl font-bold text-sm sm:text-base ${
                    darkMode
                      ? "bg-gray-900/50 text-white"
                      : "bg-gray-50 text-gray-900"
                  }`}
                >
                  {user.phone}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                className={`text-[10px] font-bold uppercase tracking-widest ml-1 ${
                  darkMode ? "text-gray-500" : "text-gray-400"
                }`}
              >
                Region Location
              </label>
              {editing ? (
                <div className="flex gap-2">
                  <input
                    placeholder="City"
                    value={formData.location.city}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        location: { ...p.location, city: e.target.value },
                      }))
                    }
                    className={`flex-1 px-6 py-4 rounded-xl font-semibold bg-transparent border-2 outline-none transition-all
                      ${
                        darkMode
                          ? "border-gray-800 text-white focus:border-emerald-500/50"
                          : "border-gray-100 text-gray-900 focus:border-emerald-600/30"
                      }`}
                  />
                  <input
                    placeholder="State"
                    value={formData.location.state}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        location: { ...p.location, state: e.target.value },
                      }))
                    }
                    className={`w-24 px-4 py-4 rounded-xl font-semibold bg-transparent border-2 outline-none transition-all
                      ${
                        darkMode
                          ? "border-gray-800 text-white focus:border-emerald-500/50"
                          : "border-gray-100 text-gray-900 focus:border-emerald-600/30"
                      }`}
                  />
                </div>
              ) : (
                <p
                  className={`px-5 py-3 rounded-xl font-bold text-sm sm:text-base ${
                    darkMode
                      ? "bg-gray-900/50 text-white"
                      : "bg-gray-50 text-gray-900"
                  }`}
                >
                  {user.location.city}, {user.location.state}
                </p>
              )}
            </div>

            <div className="md:col-span-2 space-y-2">
              <label
                className={`text-[10px] font-bold uppercase tracking-widest ml-1 ${
                  darkMode ? "text-gray-500" : "text-gray-400"
                }`}
              >
                Personal Bio
              </label>
              {editing ? (
                <textarea
                  rows={4}
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, bio: e.target.value }))
                  }
                  className={`w-full px-6 py-4 rounded-2xl font-semibold bg-transparent border-2 outline-none transition-all resize-none
                    ${
                      darkMode
                        ? "border-gray-800 text-white focus:border-emerald-500/50"
                        : "border-gray-100 text-gray-900 focus:border-emerald-600/30"
                    }`}
                  placeholder="Tell us about your impact journey..."
                />
              ) : (
                <p
                  className={`px-6 py-4 rounded-[1.5rem] font-bold text-xs sm:text-sm leading-relaxed ${
                    darkMode
                      ? "bg-gray-900/50 text-gray-300"
                      : "bg-gray-50 text-gray-700"
                  }`}
                >
                  {user.bio || "Your strategic vision remains unarticulated."}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Component: Notification Preferences - Intelligence Toggles
const NotificationSection = ({ preferences, onUpdate, isLoading }) => {
  const { darkMode } = useTheme();
  const [settings, setSettings] = useState({
    emailNotifications: preferences.emailNotifications || {},
    smsNotifications: preferences.smsNotifications || {},
  });

  const handleToggle = useCallback(
    async (category, setting) => {
      const newSettings = {
        ...settings,
        [category]: {
          ...settings[category],
          [setting]: !settings[category][setting],
        },
      };
      setSettings(newSettings);
      await onUpdate("notifications", newSettings);
    },
    [settings, onUpdate],
  );

  const SectionHeader = ({ icon: Icon, title, subtitle }) => (
    <div className="flex items-center gap-4 mb-8">
      <div
        className={`p-4 rounded-xl ${
          darkMode
            ? "bg-emerald-500/10 text-emerald-500"
            : "bg-emerald-50 text-emerald-600"
        }`}
      >
        <Icon size={18} />
      </div>
      <div>
        <h3
          className={`text-lg font-bold tracking-tight ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          {title}
        </h3>
        <p
          className={`text-[10px] font-semibold uppercase tracking-widest ${
            darkMode ? "text-gray-500" : "text-gray-400"
          }`}
        >
          {subtitle}
        </p>
      </div>
    </div>
  );

  const ToggleItem = ({ category, id, label, description }) => (
    <div
      className={`group flex items-center justify-between p-4 sm:p-5 rounded-2xl border transition-all duration-500
      ${
        darkMode
          ? "bg-gray-950/20 border-gray-800/50 hover:bg-gray-900/40"
          : "bg-gray-50 border-transparent hover:bg-white hover:shadow-xl hover:shadow-gray-200/40"
      }`}
    >
      <div className="flex-1 pr-8">
        <h4
          className={`text-sm font-bold transition-colors ${
            darkMode
              ? "text-gray-200 group-hover:text-white"
              : "text-gray-700 group-hover:text-gray-950"
          }`}
        >
          {label}
        </h4>
        <p
          className={`text-[9px] font-semibold mt-1 leading-relaxed ${
            darkMode ? "text-gray-500" : "text-gray-400"
          }`}
        >
          {description}
        </p>
      </div>
      <button
        onClick={() => handleToggle(category, id)}
        disabled={isLoading}
        className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all duration-500 shadow-inner
          ${
            settings[category][id]
              ? "bg-emerald-600 shadow-emerald-500/20"
              : darkMode
                ? "bg-gray-800"
                : "bg-gray-200"
          }`}
      >
        <motion.span
          animate={{ x: settings[category][id] ? 28 : 4 }}
          className="inline-block h-6 w-6 rounded-full bg-white shadow-lg"
        />
      </button>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`rounded-[2.5rem] border overflow-hidden backdrop-blur-xl transition-all duration-500
        ${
          darkMode
            ? "bg-gray-950/40 border-gray-800 shadow-2xl"
            : "bg-white border-gray-100 shadow-xl shadow-gray-200/50"
        }`}
    >
      <div className="p-8 sm:p-12">
        <div className="space-y-16">
          <section>
            <SectionHeader
              icon={Mail}
              title="Email Alerts"
              subtitle="Email Notification Settings"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ToggleItem
                category="emailNotifications"
                id="campaignUpdates"
                label="Mission Updates"
                description="Live updates from your supported projects."
              />
              <ToggleItem
                category="emailNotifications"
                id="donationReceipts"
                label="Impact Receipts"
                description="Automated confirmation of your contributions."
              />
              <ToggleItem
                category="emailNotifications"
                id="eventReminders"
                label="Event Reminders"
                description="Timing details for upcoming community events."
              />
              <ToggleItem
                category="emailNotifications"
                id="weeklyDigest"
                label="Community Digest"
                description="Weekly summary of platform activity."
              />
            </div>
          </section>

          <section>
            <SectionHeader
              icon={Smartphone}
              title="Mobile Settings"
              subtitle="Direct SMS Notification Settings"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ToggleItem
                category="smsNotifications"
                id="urgentAlerts"
                label="Urgent Notifications"
                description="Immediate alerts for high-impact missions."
              />
              <ToggleItem
                category="smsNotifications"
                id="eventReminders"
                label="Mission Reminders"
                description="Timely updates for active participation."
              />
              <ToggleItem
                category="smsNotifications"
                id="campaignMilestones"
                label="Goal Success"
                description="Notifications for reaching critical milestones."
              />
            </div>
          </section>
        </div>
      </div>
    </motion.div>
  );
};

// Component: Privacy Settings - Visibility Matrix
const PrivacySection = ({ preferences, onUpdate, isLoading }) => {
  const { darkMode } = useTheme();
  const [settings, setSettings] = useState(preferences.privacy || {});

  const handleChange = useCallback(
    async (setting, value) => {
      const newSettings = { ...settings, [setting]: value };
      setSettings(newSettings);
      await onUpdate("privacy", newSettings);
    },
    [settings, onUpdate],
  );

  const ItemWrapper = ({ title, description, children }) => (
    <div
      className={`flex items-center justify-between p-5 rounded-[1.5rem] border transition-all duration-500
      ${
        darkMode
          ? "bg-gray-950/20 border-gray-800/50"
          : "bg-gray-50 border-transparent"
      }`}
    >
      <div className="flex-1 pr-8">
        <h4
          className={`text-sm font-bold transition-colors ${
            darkMode ? "text-gray-200" : "text-gray-900"
          }`}
        >
          {title}
        </h4>
        <p
          className={`text-[11px] font-bold mt-1 leading-relaxed ${
            darkMode ? "text-gray-500" : "text-gray-400"
          }`}
        >
          {description}
        </p>
      </div>
      {children}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`rounded-3xl border overflow-hidden backdrop-blur-xl transition-all duration-500
        ${
          darkMode
            ? "bg-gray-950/40 border-gray-800 shadow-2xl"
            : "bg-white border-gray-100 shadow-xl shadow-gray-200/50"
        }`}
    >
      <div className="p-8 sm:p-12">
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-2">
            <div
              className={`p-4 rounded-2xl ${
                darkMode
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "bg-emerald-50 text-emerald-600"
              }`}
            >
              <Eye size={20} />
            </div>
            <div>
              <h3
                className={`text-xl font-bold tracking-tight ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Privacy Matrix
              </h3>
              <p
                className={`text-[10px] font-semibold uppercase tracking-widest ${
                  darkMode ? "text-gray-500" : "text-gray-400"
                }`}
              >
                Control your profile visibility
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <ItemWrapper
            title="Profile Visibility"
            description="Choose who can view your mission accomplishments and profile details."
          >
            <select
              value={settings.profileVisibility || "public"}
              onChange={(e) =>
                handleChange("profileVisibility", e.target.value)
              }
              className={`px-6 py-4 rounded-xl font-bold text-xs uppercase tracking-widest outline-none border-2 transition-all cursor-pointer
                ${
                  darkMode
                    ? "bg-gray-950 border-gray-800 text-white focus:border-emerald-500/50"
                    : "bg-white border-gray-100 text-gray-900 focus:border-emerald-600/30 shadow-sm"
                }`}
            >
              <option value="public">Global Access</option>
              <option value="donors">Verified Donors</option>
              <option value="private">Restricted Access</option>
            </select>
          </ItemWrapper>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                key: "showDonations",
                label: "Donation History",
                desc: "Display supported campaigns.",
              },
              {
                key: "showLocation",
                label: "Location Sharing",
                desc: "Show your city/state to others.",
              },
              {
                key: "allowContact",
                label: "Messaging",
                desc: "Enable secure direct messaging.",
              },
            ].map((item) => (
              <div
                key={item.key}
                className={`p-6 rounded-2xl border transition-all duration-500 flex flex-col justify-between
                ${
                  darkMode
                    ? "bg-gray-950/20 border-gray-800/50"
                    : "bg-gray-50 border-transparent hover:bg-white hover:shadow-xl hover:shadow-gray-200/40"
                }`}
              >
                <div>
                  <h4
                    className={`text-xs font-bold uppercase tracking-widest mb-2 ${
                      darkMode ? "text-gray-200" : "text-gray-900"
                    }`}
                  >
                    {item.label}
                  </h4>
                  <p
                    className={`text-[10px] font-bold leading-relaxed mb-8 ${
                      darkMode ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    {item.desc}
                  </p>
                </div>
                <button
                  onClick={() => handleChange(item.key, !settings[item.key])}
                  disabled={isLoading}
                  className={`w-full py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all
                    ${
                      settings[item.key]
                        ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                        : darkMode
                          ? "bg-gray-800 text-gray-500 border border-transparent"
                          : "bg-gray-200 text-gray-600 border border-transparent"
                    }`}
                >
                  {settings[item.key] ? "Visible" : "Hidden"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Component: Security Settings - Armor Protocol
const SecuritySection = ({ user, onUpdate, isLoading }) => {
  const { darkMode } = useTheme();
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handlePasswordChange = useCallback(
    async (e) => {
      e.preventDefault();
      if (passwordForm.newPassword !== passwordForm.confirmPassword)
        return alert("Protocol Mismatch: Passwords do not match");
      try {
        await onUpdate("password", passwordForm);
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setShowChangePassword(false);
      } catch (error) {
        console.error("Password change failed:", error);
      }
    },
    [passwordForm, onUpdate],
  );
  const handleTwoFactorToggle = useCallback(async () => {
    try {
      await onUpdate("twoFactor", !user.twoFactorEnabled);
    } catch (error) {
      console.error("2FA toggle failed:", error);
    }
  }, [user.twoFactorEnabled, onUpdate]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-3xl border overflow-hidden backdrop-blur-xl transition-all duration-500
        ${
          darkMode
            ? "bg-gray-950/40 border-gray-800 shadow-2xl"
            : "bg-white border-gray-100 shadow-xl shadow-gray-200/50"
        }`}
    >
      <div className="p-8 sm:p-12">
        <div className="flex items-center gap-4 mb-12">
          <div
            className={`p-4 rounded-xl ${
              darkMode
                ? "bg-emerald-500/10 text-emerald-400"
                : "bg-emerald-50 text-emerald-600"
            }`}
          >
            <Shield size={20} />
          </div>
          <div>
            <h3
              className={`text-xl font-black tracking-tight ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Armor Protocol
            </h3>
            <p
              className={`text-[10px] font-black uppercase tracking-widest ${
                darkMode ? "text-gray-500" : "text-gray-400"
              }`}
            >
              Account Fortification & access control
            </p>
          </div>
        </div>

        <div className="space-y-8">
          {/* Password Vector */}
          <div
            className={`p-6 rounded-2xl border transition-all duration-500
            ${
              darkMode
                ? "bg-gray-950/20 border-gray-800/50"
                : "bg-gray-50 border-transparent"
            }`}
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h4
                  className={`text-sm font-bold uppercase tracking-widest ${
                    darkMode ? "text-gray-200" : "text-gray-900"
                  }`}
                >
                  Password Settings
                </h4>
                <p
                  className={`text-[9px] font-bold mt-1 ${
                    darkMode ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  {user.authMethod === "google"
                    ? "Your security is managed by Google"
                    : "Standard cryptographic authentication"}
                </p>
              </div>
              {user.authMethod !== "google" && (
                <button
                  onClick={() => setShowChangePassword(!showChangePassword)}
                  className={`px-6 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all
                    ${
                      darkMode
                        ? "bg-gray-800 text-emerald-400 hover:bg-emerald-600 hover:text-white"
                        : "bg-white text-emerald-600 hover:bg-emerald-600 hover:text-white shadow-sm"
                    }`}
                >
                  {showChangePassword ? "Close Settings" : "Change Password"}
                </button>
              )}
            </div>

            {user.authMethod === "google" && (
              <div
                className={`p-4 rounded-xl text-[10px] font-bold uppercase tracking-widest border ${
                  darkMode
                    ? "bg-emerald-500/5 border-emerald-500/10 text-emerald-400"
                    : "bg-emerald-50 border-emerald-100 text-emerald-700"
                }`}
              >
                You are signed in with Google. Password management is handled
                through your Google Account security settings.
              </div>
            )}

            <AnimatePresence>
              {showChangePassword && (
                <motion.form
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  onSubmit={handlePasswordChange}
                  className="space-y-4 overflow-hidden"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="password"
                      placeholder="Current Password"
                      value={passwordForm.currentPassword}
                      onChange={(e) =>
                        setPasswordForm((prev) => ({
                          ...prev,
                          currentPassword: e.target.value,
                        }))
                      }
                      className={`px-6 py-4 rounded-xl font-semibold bg-transparent border-2 outline-none transition-all
                        ${
                          darkMode
                            ? "border-gray-800 text-white focus:border-emerald-500/50"
                            : "border-gray-100 text-gray-900 focus:border-emerald-600/30"
                        }`}
                      required
                    />
                    <input
                      type="password"
                      placeholder="New Password"
                      value={passwordForm.newPassword}
                      onChange={(e) =>
                        setPasswordForm((prev) => ({
                          ...prev,
                          newPassword: e.target.value,
                        }))
                      }
                      className={`px-6 py-4 rounded-xl font-semibold bg-transparent border-2 outline-none transition-all
                        ${
                          darkMode
                            ? "border-gray-800 text-white focus:border-emerald-500/50"
                            : "border-gray-100 text-gray-900 focus:border-emerald-600/30"
                        }`}
                      required
                    />
                  </div>
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
                    >
                      {isLoading ? "Verifying..." : "Update Password"}
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* 2FA Node */}
          <div
            className={`p-6 rounded-2xl border transition-all duration-500 flex items-center justify-between
            ${
              darkMode
                ? "bg-gray-950/20 border-gray-800/50"
                : "bg-emerald-50/30 border-transparent"
            }`}
          >
            <div className="flex items-center gap-6">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  user.twoFactorEnabled
                    ? "bg-emerald-500 text-white"
                    : "bg-gray-200 text-gray-400"
                }`}
              >
                <Zap size={20} />
              </div>
              <div>
                <h4
                  className={`text-sm font-bold uppercase tracking-widest ${
                    darkMode ? "text-gray-200" : "text-gray-900"
                  }`}
                >
                  Two-Factor Auth
                </h4>
                <p
                  className={`text-[9px] font-semibold mt-1 ${
                    darkMode ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  Secondary device security verification
                </p>
              </div>
            </div>
            <button
              onClick={handleTwoFactorToggle}
              disabled={isLoading}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all duration-500
                ${
                  user.twoFactorEnabled
                    ? "bg-emerald-500 shadow-lg shadow-emerald-500/30"
                    : darkMode
                      ? "bg-gray-800"
                      : "bg-gray-200"
                }`}
            >
              <motion.span
                animate={{ x: user.twoFactorEnabled ? 28 : 4 }}
                className="inline-block h-6 w-6 rounded-full bg-white shadow-md"
              />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Component: App Preferences - Environment Tuning
const PreferencesSection = ({ preferences, onUpdate }) => {
  const { darkMode } = useTheme();
  const [settings, setSettings] = useState({
    language: preferences.language || "en",
    currency: preferences.currency || "NGN",
    timezone: preferences.timezone || "Africa/Lagos",
    theme: preferences.theme || "system",
  });

  const handleChange = useCallback(
    async (setting, value) => {
      const newSettings = { ...settings, [setting]: value };
      setSettings(newSettings);
      await onUpdate("preferences", newSettings);
    },
    [settings, onUpdate],
  );

  const SelectItem = ({ label, icon: Icon, id, options }) => (
    <div
      className={`p-6 rounded-2xl border transition-all duration-500
      ${
        darkMode
          ? "bg-gray-950/20 border-gray-800/50"
          : "bg-gray-50 border-transparent hover:bg-white hover:shadow-xl hover:shadow-gray-200/40"
      }`}
    >
      <div className="flex items-center gap-4 mb-6">
        <div
          className={`p-3 rounded-xl ${
            darkMode
              ? "bg-emerald-500/10 text-emerald-400"
              : "bg-white text-emerald-600 shadow-sm"
          }`}
        >
          <Icon size={18} />
        </div>
        <h4
          className={`text-xs font-bold uppercase tracking-widest ${
            darkMode ? "text-gray-200" : "text-gray-900"
          }`}
        >
          {label}
        </h4>
      </div>
      <select
        value={settings[id]}
        onChange={(e) => handleChange(id, e.target.value)}
        className={`w-full px-6 py-4 rounded-xl font-bold text-xs uppercase tracking-widest outline-none border-2 transition-all cursor-pointer
          ${
            darkMode
              ? "bg-gray-950 border-gray-800 text-white focus:border-emerald-500/50"
              : "bg-white border-gray-100 text-gray-900 focus:border-emerald-600/30"
          }`}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`rounded-[2.5rem] border overflow-hidden backdrop-blur-xl transition-all duration-500
        ${
          darkMode
            ? "bg-gray-950/40 border-gray-800 shadow-2xl"
            : "bg-white border-gray-100 shadow-xl shadow-gray-200/50"
        }`}
    >
      <div className="p-8 sm:p-12">
        <div className="flex items-center gap-4 mb-12">
          <div
            className={`p-4 rounded-xl ${
              darkMode
                ? "bg-emerald-500/10 text-emerald-400"
                : "bg-emerald-50 text-emerald-600"
            }`}
          >
            <Globe size={20} />
          </div>
          <div>
            <h3
              className={`text-xl font-bold tracking-tight ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              App Preferences
            </h3>
            <p
              className={`text-[10px] font-semibold uppercase tracking-widest ${
                darkMode ? "text-gray-500" : "text-gray-400"
              }`}
            >
              Customize your user experience
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SelectItem
            label="Language"
            icon={Activity}
            id="language"
            options={[
              { label: "English (US)", value: "en" },
              { label: "Yorùbá (NG)", value: "yo" },
              { label: "Hausa (NG)", value: "ha" },
              { label: "Igbo (NG)", value: "ig" },
            ]}
          />
          <SelectItem
            label="Currency"
            icon={CreditCard}
            id="currency"
            options={[
              { label: "Naira (₦)", value: "NGN" },
              { label: "Dollar ($)", value: "USD" },
              { label: "Euro (€)", value: "EUR" },
            ]}
          />
          <SelectItem
            label="Timezone"
            icon={Clock}
            id="timezone"
            options={[
              { label: "Lagos (GMT+1)", value: "Africa/Lagos" },
              { label: "UTC Protocol", value: "UTC" },
            ]}
          />
          <SelectItem
            label="Theme"
            icon={Sparkles}
            id="theme"
            options={[
              { label: "Sync with System", value: "system" },
              { label: "Light Mode", value: "light" },
              { label: "Dark Mode", value: "dark" },
            ]}
          />
        </div>
      </div>
    </motion.div>
  );
};

// Main Settings Component
const Settings = () => {
  const { darkMode } = useTheme();

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState("profile");
  const [saveStatus, setSaveStatus] = useState("");
  const [initialLoading, setInitialLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [usingMockData, setUsingMockData] = useState(false);

  // Fetch user settings on mount
  const fetchSettings = useCallback(async () => {
    try {
      setInitialLoading(true);
      setApiError(null);
      const response = await apiClient.get("/settings");
      setUserData(response.data.data);
    } catch (err) {
      console.error("Settings fetch failed:", err);
      // Fallback to mock data
      setUserData(MOCK_USER_DATA);
      setUsingMockData(true);
      setApiError("Using demo data (API unavailable)");
    } finally {
      setInitialLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Handle updates (skip API calls if using mock)
  const handleUpdate = useCallback(
    async (section, data) => {
      if (usingMockData) {
        // Simulate success for mock data
        setSaveStatus("Changes saved locally (demo mode)");
        setTimeout(() => setSaveStatus(""), 3000);
        return;
      }

      setLoading(true);
      setSaveStatus("Saving...");

      try {
        switch (section) {
          case "profile":
            await apiClient.put("/settings/profile", data);
            break;
          case "notifications":
            await apiClient.put("/settings/notifications", data);
            break;
          case "privacy":
            await apiClient.put("/settings/privacy", data);
            break;
          case "password":
            await apiClient.put("/settings/password", {
              currentPassword: data.currentPassword,
              newPassword: data.newPassword,
              confirmPassword: data.confirmPassword,
            });
            break;
          case "twoFactor":
            await apiClient.put("/settings/security", {
              twoFactorEnabled: data,
            });
            break;
          case "preferences":
            await apiClient.put("/settings/preferences", data);
            break;
          default:
            throw new Error("Invalid section");
        }

        // Refresh settings after update
        await fetchSettings();

        setSaveStatus("Saved successfully!");
        setTimeout(() => setSaveStatus(""), 3000);
      } catch (error) {
        setSaveStatus(
          error.response?.data?.message || "Failed to save changes",
        );
        setTimeout(() => setSaveStatus(""), 3000);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [fetchSettings, usingMockData],
  );

  const handleRetryFetch = () => {
    fetchSettings();
  };

  const sections = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy", icon: LockIcon },
    { id: "security", label: "Security", icon: Shield },
    { id: "preferences", label: "Preferences", icon: SettingsIcon },
  ];

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <p className={darkMode ? "text-white" : "text-gray-900"}>
          Failed to load settings
        </p>
        <button
          onClick={handleRetryFetch}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn pb-12">
      {/* Header - Governance Command */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1
            className={`text-2xl lg:text-3xl font-bold tracking-tight uppercase ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Account Settings
          </h1>
          <p
            className={`text-sm font-semibold mt-3 flex items-center gap-3 ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            <span className="w-12 h-[2px] bg-emerald-500" /> Manage your account
            and preferences
          </p>
        </div>

        <AnimatePresence>
          {saveStatus && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: 20 }}
              className={`px-6 py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-xl backdrop-blur-xl
                ${
                  saveStatus.includes("successfully")
                    ? `${
                        darkMode
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-emerald-500/10"
                          : "bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-emerald-500/10"
                      }`
                    : `${
                        darkMode
                          ? "bg-emerald-500/10 text-rose-400 border border-emerald-500/20 shadow-emerald-500/10"
                          : "bg-rose-50 text-rose-700 border border-rose-100 shadow-rose-500/10"
                      }`
                }`}
            >
              {saveStatus}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* API Error Notice - Non-Critical Protocol */}
      {usingMockData && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-6 rounded-3xl border flex items-center justify-between backdrop-blur-xl
            ${
              darkMode
                ? "bg-amber-500/5 border-amber-500/10"
                : "bg-amber-50 border-amber-100"
            }`}
        >
          <div className="flex items-center gap-4">
            <div
              className={`p-2 rounded-xl ${
                darkMode
                  ? "bg-amber-500/20 text-amber-400"
                  : "bg-white text-amber-600 shadow-sm"
              }`}
            >
              <Zap size={16} />
            </div>
            <p
              className={`text-xs font-bold ${
                darkMode ? "text-amber-200/70" : "text-amber-800/70"
              }`}
            >
              {apiError || (
                <>
                  Operating in{" "}
                  <span className="text-amber-500">Autonomous Demo Mode</span>.
                  Offline synchronisation only.
                </>
              )}
            </p>
          </div>
          <button
            onClick={handleRetryFetch}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
              ${
                darkMode
                  ? "bg-amber-500/10 text-amber-400 hover:bg-amber-500 hover:text-white"
                  : "bg-white text-amber-600 hover:bg-amber-600 hover:text-white shadow-sm"
              }`}
          >
            Reconnect
          </button>
        </motion.div>
      )}

      {/* Settings Navigation - Operational Vectors */}
      <div
        className={`rounded-2xl border overflow-hidden backdrop-blur-xl transition-all duration-500
        ${
          darkMode
            ? "bg-gray-950/40 border-gray-800"
            : "bg-white border-gray-100 shadow-lg"
        }`}
      >
        <div className="flex overflow-x-auto custom-scrollbar">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 text-[10px] font-bold uppercase tracking-widest transition-all duration-500 relative
                  ${
                    isActive
                      ? `text-emerald-500 bg-emerald-500/5`
                      : `${
                          darkMode
                            ? "text-gray-500 hover:text-white hover:bg-white/5"
                            : "text-gray-400 hover:text-gray-900 hover:bg-gray-50"
                        }`
                  }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-settings-nav"
                    className="absolute bottom-0 left-0 right-0 h-[3px] bg-emerald-500"
                  />
                )}
                <Icon size={16} />
                <span className="hidden sm:inline">{section.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Settings Content */}
      <div className="space-y-6">
        {activeSection === "profile" && (
          <ProfileSection
            user={userData}
            onUpdate={handleUpdate}
            isLoading={loading}
            onRefresh={fetchSettings}
          />
        )}

        {activeSection === "notifications" && (
          <NotificationSection
            preferences={userData.preferences}
            onUpdate={handleUpdate}
            isLoading={loading}
          />
        )}

        {activeSection === "privacy" && (
          <PrivacySection
            preferences={userData.preferences}
            onUpdate={handleUpdate}
            isLoading={loading}
          />
        )}

        {activeSection === "security" && (
          <SecuritySection
            user={userData}
            onUpdate={handleUpdate}
            isLoading={loading}
          />
        )}

        {activeSection === "preferences" && (
          <PreferencesSection
            preferences={userData.preferences}
            onUpdate={handleUpdate}
          />
        )}
      </div>

      {/* Account Summary - Strategic Lifecycle Module */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-3xl border overflow-hidden backdrop-blur-xl transition-all duration-500 mt-12
          ${
            darkMode
              ? "bg-emerald-500/5 border-emerald-500/10"
              : "bg-gray-900 border-transparent shadow-2xl shadow-emerald-500/20"
          }`}
      >
        <div className="p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-8">
            <div
              className={`w-20 h-20 rounded-2xl flex items-center justify-center shadow-xl
              ${
                darkMode
                  ? "bg-emerald-600 text-white shadow-emerald-500/20"
                  : "bg-white text-emerald-600 shadow-emerald-500/10"
              }`}
            >
              <Shield size={32} />
            </div>
            <div>
              <h3 className={`text-xl font-bold tracking-tight text-white`}>
                Account Summary
              </h3>
              <div
                className={`flex flex-wrap gap-x-6 gap-y-2 mt-2 text-[10px] font-semibold uppercase tracking-widest ${
                  darkMode ? "text-emerald-400" : "text-emerald-500/60"
                }`}
              >
                <p>
                  Joined: {new Date(userData.dateJoined).toLocaleDateString()}
                </p>
                <p>
                  Last Activity:{" "}
                  {new Date(userData.lastLogin).toLocaleDateString()}
                </p>
                <p>Status: {userData.verified ? "Verified Holder" : "Guest"}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end">
            <p
              className={`text-[10px] font-semibold uppercase tracking-widest mb-4 ${
                darkMode ? "text-emerald-400" : "text-emerald-300"
              }`}
            >
              Security integrity
            </p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <motion.div
                  key={i}
                  initial={{ scaleY: 0.1 }}
                  animate={{ scaleY: [0.1, 1, 0.1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                  className="w-1.5 h-6 bg-emerald-500 rounded-full origin-bottom"
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Settings;
