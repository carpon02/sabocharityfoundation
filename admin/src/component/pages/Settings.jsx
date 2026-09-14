// admin/src/component/pages/Settings.jsx — Clerk-Style UI
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Mail, Phone, Lock, Bell, Shield, Globe, Save,
  Camera, Eye, EyeOff, CheckCircle, AlertCircle,
  Settings as SettingsIcon, RefreshCw, LogOut,
  ShieldCheck, Zap, Activity, ChevronRight,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import {
  fetchSettings, updateProfile, uploadAvatar, removeAvatar,
  changePassword, updateNotifications, updatePreferences,
  updateSecurity, setSaveStatus, clearSaveStatus,
} from "../../features/settings/settingsSlice";
import toast from "react-hot-toast";

const TABS = [
  { id: "profile",       label: "Profile",       icon: User,          desc: "Personal details" },
  { id: "security",      label: "Security",      icon: Shield,        desc: "Password & 2FA" },
  { id: "notifications", label: "Notifications", icon: Bell,          desc: "Alert preferences" },
  { id: "system",        label: "Preferences",   icon: SettingsIcon,  desc: "System config" },
];

// ── Reusable form field ────────────────────────────────────────────────────
const Field = ({ label, darkMode, children }) => (
  <div>
    <label className={`block text-xs font-medium mb-1.5 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{label}</label>
    {children}
  </div>
);

const inputCls = (darkMode, disabled = false) =>
  `w-full px-3 py-2 rounded-lg border text-sm outline-none transition-all ${disabled ? "opacity-60 cursor-not-allowed" : ""} ${
    darkMode
      ? "bg-gray-800/60 border-gray-700/60 text-white placeholder-gray-500 focus:border-primary-500/50"
      : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-primary-400"
  }`;

// ── Toggle switch ──────────────────────────────────────────────────────────
const Toggle = ({ value, onChange }) => (
  <button
    type="button"
    onClick={onChange}
    className={`relative w-10 h-6 rounded-full transition-colors flex-shrink-0 ${value ? "bg-primary-500" : "bg-gray-300 dark:bg-gray-600"}`}
  >
    <motion.div
      animate={{ x: value ? 16 : 2 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
    />
  </button>
);

const Settings = () => {
  const { darkMode } = useTheme();
  const dispatch = useDispatch();

  const { settings, loading, saveStatus } = useSelector((s) => s.settings);
  const [activeTab,     setActiveTab]     = useState("profile");
  const [showPassword,  setShowPassword]  = useState(false);

  const [localFormData, setLocalFormData] = useState({
    profile: {
      fullName: "", phone: "", bio: "",
      location: { address: "", city: "", state: "", country: "Nigeria" }, avatar: "",
    },
    security: { currentPassword: "", newPassword: "", confirmPassword: "", twoFactorEnabled: false },
    notifications: { emailNotifications: true, pushNotifications: true, donationAlerts: true, campaignUpdates: true },
    system: { language: "English", timezone: "Africa/Lagos", currency: "NGN" },
  });

  useEffect(() => { dispatch(fetchSettings()); }, [dispatch]);

  useEffect(() => {
    if (settings) {
      setLocalFormData((prev) => ({
        ...prev,
        profile: {
          fullName: settings.name || "",
          phone:    settings.phone || "",
          bio:      settings.bio || "",
          location: settings.location || prev.profile.location,
          avatar:   settings.avatar || "",
        },
        security: { ...prev.security, twoFactorEnabled: settings.twoFactorEnabled || false },
      }));
    }
  }, [settings]);

  const handleSave = async () => {
    dispatch(setSaveStatus("saving"));
    try {
      if (activeTab === "profile") {
        await dispatch(updateProfile(localFormData.profile)).unwrap();
      }
      dispatch(setSaveStatus("success"));
      toast.success("Settings saved");
    } catch (err) {
      dispatch(setSaveStatus(err || "Error"));
      toast.error("Failed to save settings");
    } finally {
      setTimeout(() => dispatch(clearSaveStatus()), 3000);
    }
  };

  const setProfile = (patch) =>
    setLocalFormData((p) => ({ ...p, profile: { ...p.profile, ...patch } }));
  const setSecurity = (patch) =>
    setLocalFormData((p) => ({ ...p, security: { ...p.security, ...patch } }));
  const toggleNotif = (key) =>
    setLocalFormData((p) => ({ ...p, notifications: { ...p.notifications, [key]: !p.notifications[key] } }));

  // ── Shared tokens ─────────────────────────────────────────────────────────
  const cardBase = `rounded-xl border ${darkMode ? "bg-dark-lighter border-gray-800/70" : "bg-white border-gray-200/80 shadow-sm"}`;

  const notifLabels = {
    emailNotifications: "Email Notifications",
    pushNotifications:  "Push Notifications",
    donationAlerts:     "Donation Alerts",
    campaignUpdates:    "Campaign Updates",
  };
  const notifDescs = {
    emailNotifications: "Receive email alerts for important events",
    pushNotifications:  "Browser push notifications",
    donationAlerts:     "Alert when a new donation is received",
    campaignUpdates:    "Notify on campaign status changes",
  };

  return (
    <div className="space-y-6 pb-10">

      {/* ── Header ───────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-xl font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>Settings</h1>
          <p className={`text-sm mt-0.5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            Manage your account, security and preferences
          </p>
        </div>
        <div className="flex items-center gap-2">
          {saveStatus && (
            <span className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 ${
              saveStatus === "success" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400" :
              saveStatus === "saving"  ? "bg-primary-50 text-primary-600 dark:bg-primary-950/30 dark:text-primary-400" :
              "bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400"
            }`}>
              {saveStatus === "saving" ? <RefreshCw size={12} className="animate-spin" /> : saveStatus === "success" ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
              {saveStatus === "saving" ? "Saving..." : saveStatus === "success" ? "Saved" : "Failed"}
            </span>
          )}
          <button
            onClick={handleSave}
            className="px-3 py-2 rounded-lg bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Save size={15} /> Save Changes
          </button>
        </div>
      </div>

      {/* ── Layout ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">

        {/* ── Sidebar tabs ─────────────────────────────────────────── */}
        <div className="lg:col-span-1 space-y-2">
          <div className="flex flex-row lg:flex-col gap-1.5 overflow-x-auto pb-1 lg:pb-0">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-left transition-all min-w-max lg:min-w-0 w-full ${
                  activeTab === tab.id
                    ? "bg-primary-500 text-white shadow-sm"
                    : darkMode
                    ? "text-gray-400 hover:text-white hover:bg-gray-800/60"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <div className={`p-1.5 rounded-lg flex-shrink-0 ${activeTab === tab.id ? "bg-white/20" : darkMode ? "bg-gray-800" : "bg-gray-100"}`}>
                  <tab.icon size={14} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium leading-none">{tab.label}</p>
                  <p className={`text-[11px] mt-0.5 ${activeTab === tab.id ? "text-white/70" : darkMode ? "text-gray-600" : "text-gray-400"}`}>
                    {tab.desc}
                  </p>
                </div>
                {activeTab === tab.id && <ChevronRight size={14} className="ml-auto flex-shrink-0 text-white/70 hidden lg:block" />}
              </button>
            ))}
          </div>

          {/* Logout card */}
          <div className={`mt-3 ${cardBase} p-4`}>
            <p className={`text-xs font-semibold mb-1 text-red-600`}>Session</p>
            <p className={`text-xs mb-3 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
              Securely end your admin session.
            </p>
            <button className={`w-full py-2 rounded-lg text-sm font-medium border border-red-200 dark:border-red-900/40 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all flex items-center justify-center gap-1.5`}>
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>

        {/* ── Content panel ────────────────────────────────────────── */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className={`${cardBase} p-6 min-h-[480px]`}
            >

              {/* ── Profile tab ────────────────────────────────────── */}
              {activeTab === "profile" && (
                <div className="space-y-6">
                  <div className={`pb-5 border-b ${darkMode ? "border-gray-800/60" : "border-gray-100"}`}>
                    <h2 className={`text-base font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>Profile & Branding</h2>
                    <p className={`text-xs mt-0.5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Update your foundation's identity and contact details.</p>
                  </div>

                  {/* Avatar */}
                  <div className="flex items-center gap-4">
                    <div className="relative group">
                      <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-white dark:border-gray-700 shadow-md">
                        <img
                          src={localFormData.profile.avatar || "https://ui-avatars.com/api/?name=Admin&background=10b981&color=fff"}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <label className="absolute -bottom-1.5 -right-1.5 p-1.5 bg-gray-900 text-white rounded-lg cursor-pointer hover:bg-primary-600 transition-all shadow-md border-2 border-white dark:border-gray-900">
                        <Camera size={12} />
                        <input type="file" className="hidden" />
                      </label>
                    </div>
                    <div>
                      <p className={`text-sm font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                        {localFormData.profile.fullName || "Admin User"}
                      </p>
                      <p className={`text-xs mt-0.5 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                        {settings?.email || "admin@example.com"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Full Name" darkMode={darkMode}>
                      <input
                        type="text"
                        value={localFormData.profile.fullName}
                        onChange={(e) => setProfile({ fullName: e.target.value })}
                        placeholder="Your full name"
                        className={inputCls(darkMode)}
                      />
                    </Field>
                    <Field label="Email Address" darkMode={darkMode}>
                      <input
                        type="email"
                        value={settings?.email || ""}
                        disabled
                        className={inputCls(darkMode, true)}
                      />
                    </Field>
                    <Field label="Phone Number" darkMode={darkMode}>
                      <input
                        type="tel"
                        value={localFormData.profile.phone}
                        onChange={(e) => setProfile({ phone: e.target.value })}
                        placeholder="+234..."
                        className={inputCls(darkMode)}
                      />
                    </Field>
                    <Field label="Location" darkMode={darkMode}>
                      <input
                        type="text"
                        value={localFormData.profile.location?.city || ""}
                        onChange={(e) => setProfile({ location: { ...localFormData.profile.location, city: e.target.value } })}
                        placeholder="City, State"
                        className={inputCls(darkMode)}
                      />
                    </Field>
                    <Field label="Bio" darkMode={darkMode}>
                      <textarea
                        rows={4}
                        value={localFormData.profile.bio}
                        onChange={(e) => setProfile({ bio: e.target.value })}
                        placeholder="Foundation bio..."
                        className={`${inputCls(darkMode)} resize-none md:col-span-2`}
                      />
                    </Field>
                  </div>
                </div>
              )}

              {/* ── Security tab ───────────────────────────────────── */}
              {activeTab === "security" && (
                <div className="space-y-6">
                  <div className={`pb-5 border-b ${darkMode ? "border-gray-800/60" : "border-gray-100"}`}>
                    <h2 className={`text-base font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>Security Protocols</h2>
                    <p className={`text-xs mt-0.5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Manage passwords and multi-factor authentication.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Current Password" darkMode={darkMode}>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={localFormData.security.currentPassword}
                          onChange={(e) => setSecurity({ currentPassword: e.target.value })}
                          placeholder="••••••••"
                          className={`${inputCls(darkMode)} pr-9`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className={`absolute right-3 top-1/2 -translate-y-1/2 ${darkMode ? "text-gray-400 hover:text-white" : "text-gray-400 hover:text-gray-700"}`}
                        >
                          {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </Field>
                    <Field label="New Password" darkMode={darkMode}>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={localFormData.security.newPassword}
                        onChange={(e) => setSecurity({ newPassword: e.target.value })}
                        placeholder="••••••••"
                        className={inputCls(darkMode)}
                      />
                    </Field>
                    <Field label="Confirm Password" darkMode={darkMode}>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={localFormData.security.confirmPassword}
                        onChange={(e) => setSecurity({ confirmPassword: e.target.value })}
                        placeholder="••••••••"
                        className={inputCls(darkMode)}
                      />
                    </Field>
                  </div>

                  {/* 2FA toggle */}
                  <div className={`flex items-center justify-between p-4 rounded-xl border ${darkMode ? "bg-gray-800/30 border-gray-800/60" : "bg-gray-50 border-gray-100"}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${localFormData.security.twoFactorEnabled ? (darkMode ? "bg-emerald-950/30" : "bg-emerald-50") : (darkMode ? "bg-gray-800" : "bg-gray-100")}`}>
                        <Activity size={17} className={localFormData.security.twoFactorEnabled ? "text-emerald-500" : darkMode ? "text-gray-400" : "text-gray-400"} />
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>Two-Factor Authentication</p>
                        <p className={`text-xs mt-0.5 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>Add an extra layer of security to your account.</p>
                      </div>
                    </div>
                    <Toggle
                      value={localFormData.security.twoFactorEnabled}
                      onChange={() => setSecurity({ twoFactorEnabled: !localFormData.security.twoFactorEnabled })}
                    />
                  </div>
                </div>
              )}

              {/* ── Notifications tab ──────────────────────────────── */}
              {activeTab === "notifications" && (
                <div className="space-y-6">
                  <div className={`pb-5 border-b ${darkMode ? "border-gray-800/60" : "border-gray-100"}`}>
                    <h2 className={`text-base font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>Notification Center</h2>
                    <p className={`text-xs mt-0.5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Customize how and when you want to be alerted.</p>
                  </div>

                  <div className="space-y-2">
                    {Object.entries(localFormData.notifications).map(([key, value]) => (
                      <div
                        key={key}
                        className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                          darkMode ? "bg-gray-800/30 border-gray-800/60 hover:border-gray-700" : "bg-gray-50 border-gray-100 hover:border-gray-200"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${value ? (darkMode ? "bg-primary-950/30" : "bg-primary-50") : (darkMode ? "bg-gray-800" : "bg-gray-100")}`}>
                            <Bell size={15} className={value ? "text-primary-500" : darkMode ? "text-gray-500" : "text-gray-400"} />
                          </div>
                          <div>
                            <p className={`text-sm font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>
                              {notifLabels[key] || key.replace(/([A-Z])/g, " $1")}
                            </p>
                            <p className={`text-xs mt-0.5 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                              {notifDescs[key] || "Receive alerts for important activities"}
                            </p>
                          </div>
                        </div>
                        <Toggle value={value} onChange={() => toggleNotif(key)} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Preferences tab ────────────────────────────────── */}
              {activeTab === "system" && (
                <div className="space-y-6">
                  <div className={`pb-5 border-b ${darkMode ? "border-gray-800/60" : "border-gray-100"}`}>
                    <h2 className={`text-base font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>System Preferences</h2>
                    <p className={`text-xs mt-0.5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Adjust regional settings and platform behavior.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Language" darkMode={darkMode}>
                      <div className="relative">
                        <select className={`${inputCls(darkMode)} appearance-none pr-9`}>
                          <option>English</option>
                          <option>Yoruba</option>
                          <option>Hausa</option>
                        </select>
                        <Globe className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" size={15} />
                      </div>
                    </Field>
                    <Field label="Timezone" darkMode={darkMode}>
                      <div className="relative">
                        <select className={`${inputCls(darkMode)} appearance-none pr-9`}>
                          <option>Africa/Lagos (GMT+1)</option>
                          <option>Africa/Accra (GMT)</option>
                          <option>Africa/Nairobi (GMT+3)</option>
                        </select>
                        <Activity className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" size={15} />
                      </div>
                    </Field>
                    <Field label="Currency" darkMode={darkMode}>
                      <select className={`${inputCls(darkMode)} appearance-none`}>
                        <option value="NGN">Nigerian Naira (₦)</option>
                        <option value="USD">US Dollar ($)</option>
                        <option value="GBP">British Pound (£)</option>
                      </select>
                    </Field>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Trust note ───────────────────────────────────────────────── */}
      <div className={`${`rounded-xl border ${darkMode ? "bg-dark-lighter border-gray-800/70" : "bg-white border-gray-200/80 shadow-sm"}`} p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}>
        <div className="flex items-start gap-3">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${darkMode ? "bg-emerald-950/30" : "bg-emerald-50"}`}>
            <ShieldCheck size={18} className="text-emerald-600" />
          </div>
          <div>
            <p className={`text-sm font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>Foundation Trust</p>
            <p className={`text-xs mt-0.5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              Your configuration ensures operational excellence and transparent administration.
            </p>
          </div>
        </div>
        <button className={`px-4 py-2 rounded-lg border text-sm font-medium flex items-center gap-1.5 flex-shrink-0 ${darkMode ? "border-gray-700 text-gray-300 hover:bg-gray-800" : "border-gray-200 text-gray-700 hover:bg-gray-50"}`}>
          <Shield size={14} /> Security Audit
        </button>
      </div>
    </div>
  );
};

export default Settings;
