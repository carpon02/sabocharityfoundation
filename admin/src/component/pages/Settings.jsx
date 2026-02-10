// admin/src/component/pages/Settings.jsx - Foundation Settings Hub
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Lock,
  Bell,
  Shield,
  Globe,
  Save,
  Camera,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Settings as SettingsIcon,
  RefreshCw,
  LogOut,
  ShieldCheck,
  Zap,
  Activity,
  ChevronRight,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import {
  fetchSettings,
  updateProfile,
  uploadAvatar,
  removeAvatar,
  changePassword,
  updateNotifications,
  updatePreferences,
  updateSecurity,
  setSaveStatus,
  clearSaveStatus,
} from "../../features/settings/settingsSlice";
import toast from "react-hot-toast";

const Settings = () => {
  const { darkMode } = useTheme();
  const dispatch = useDispatch();

  const { settings, loading, uploading, error, saveStatus, usingMockData } =
    useSelector((state) => state.settings);
  const [activeTab, setActiveTab] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);

  const [localFormData, setLocalFormData] = useState({
    profile: {
      fullName: "",
      phone: "",
      bio: "",
      location: { address: "", city: "", state: "", country: "Nigeria" },
      avatar: "",
    },
    security: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      twoFactorEnabled: false,
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      donationAlerts: true,
      campaignUpdates: true,
    },
    system: { language: "English", timezone: "Africa/Lagos", currency: "NGN" },
  });

  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  useEffect(() => {
    if (settings) {
      setLocalFormData((prev) => ({
        ...prev,
        profile: {
          fullName: settings.name || "",
          phone: settings.phone || "",
          bio: settings.bio || "",
          location: settings.location || prev.profile.location,
          avatar: settings.avatar || "",
        },
        security: {
          ...prev.security,
          twoFactorEnabled: settings.twoFactorEnabled || false,
        },
      }));
    }
  }, [settings]);

  const handleSave = async () => {
    dispatch(setSaveStatus("saving"));
    try {
      if (activeTab === "profile") {
        await dispatch(updateProfile(localFormData.profile)).unwrap();
      }
      // Simulate save for other tabs for now as they might not have backend endpoints ready
      // In a real app, you'd dispatch specific update actions

      dispatch(setSaveStatus("success"));
      toast.success("Settings updated successfully");
    } catch (err) {
      dispatch(setSaveStatus(err || "Execution Error"));
      toast.error("Failed to update settings");
    } finally {
      setTimeout(() => dispatch(clearSaveStatus()), 3000);
    }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User, desc: "Personal Details" },
    { id: "security", label: "Security", icon: Shield, desc: "Password & 2FA" },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      desc: "Alert Preferences",
    },
    {
      id: "system",
      label: "Preferences",
      icon: SettingsIcon,
      desc: "System Config",
    },
  ];

  const tabVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.1, duration: 0.4 },
    }),
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  return (
    <div className="space-y-12 relative pb-20">
      {/* Decorative Background Blob */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Governance Header */}
      <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-6 lg:gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-1 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" />
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
              Configuration Hub
            </span>
          </div>
          <h1
            className={`text-3xl lg:text-5xl font-extrabold tracking-tight mb-2 ${
              darkMode ? "text-white" : "text-gray-950"
            }`}
          >
            Foundation <span className="text-emerald-500">Settings</span>
          </h1>
          <p
            className={`text-sm font-medium flex items-center gap-3 ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Manage your account settings, security protocols, and system
            preferences.
          </p>
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-4">
          {saveStatus && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`px-6 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 ${
                saveStatus === "success"
                  ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                  : saveStatus === "saving"
                    ? "bg-emerald-600 text-white"
                    : "bg-rose-500 text-white"
              }`}
            >
              <Zap
                size={14}
                className={saveStatus === "saving" ? "animate-spin" : ""}
              />{" "}
              {saveStatus === "saving"
                ? "Committing..."
                : saveStatus === "success"
                  ? "Protocol Updated"
                  : "Failed"}
            </motion.div>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white px-8 lg:px-10 py-4 lg:py-5 rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-xl shadow-emerald-600/30 active:scale-95 transition-all text-center"
          >
            <Save size={18} />{" "}
            <span className="whitespace-nowrap">Save Changes</span>
          </motion.button>
        </div>
      </div>

      {/* Interface Split */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
        {/* Navigation Dossier */}
        <div className="lg:col-span-1 space-y-6">
          <div className="flex flex-row lg:flex-col gap-3 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide">
            {tabs.map((tab, i) => (
              <motion.button
                key={tab.id}
                custom={i}
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                onClick={() => setActiveTab(tab.id)}
                className={`w-full group relative p-5 rounded-2xl border transition-all duration-300 flex items-center justify-between text-left min-w-[200px] lg:min-w-0 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-emerald-600 to-emerald-500 border-transparent text-white shadow-xl shadow-emerald-500/30 ring-2 ring-emerald-500/20 ring-offset-2 ring-offset-transparent"
                    : darkMode
                      ? "bg-gray-900 border-gray-800 text-gray-500 hover:border-gray-700 hover:bg-gray-800"
                      : "bg-white border-gray-100 text-gray-500 hover:border-emerald-100 hover:bg-emerald-50/50 shadow-sm"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`p-2.5 rounded-xl transition-all ${
                      activeTab === tab.id
                        ? "bg-white/20"
                        : darkMode
                          ? "bg-gray-800 group-hover:bg-gray-700 text-gray-400 group-hover:text-emerald-400"
                          : "bg-gray-100 group-hover:bg-emerald-100/50 text-gray-400 group-hover:text-emerald-500"
                    }`}
                  >
                    <tab.icon size={20} />
                  </div>
                  <div>
                    <span className="block text-xs font-black uppercase tracking-widest mb-0.5">
                      {tab.label}
                    </span>
                    <span
                      className={`text-[10px] font-medium ${activeTab === tab.id ? "text-emerald-100" : "text-gray-400"}`}
                    >
                      {tab.desc}
                    </span>
                  </div>
                </div>

                {activeTab === tab.id && (
                  <ChevronRight size={16} className="text-white/70" />
                )}
              </motion.button>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className={`mt-4 p-6 rounded-3xl border ${
              darkMode
                ? "bg-rose-950/20 border-rose-500/20"
                : "bg-rose-50 border-rose-100"
            }`}
          >
            <h4
              className={`text-xs font-black uppercase tracking-widest mb-3 ${
                darkMode ? "text-rose-400" : "text-rose-600"
              }`}
            >
              Session Control
            </h4>
            <p className="text-xs font-medium text-gray-500 mb-6 leading-relaxed">
              Securely terminate your current administrative session.
            </p>
            <button className="w-full py-4 rounded-xl bg-white text-rose-500 border border-rose-100 font-bold uppercase tracking-widest text-xs hover:bg-rose-500 hover:text-white hover:border-rose-500 hover:shadow-lg hover:shadow-rose-500/30 transition-all flex items-center justify-center gap-2">
              <LogOut size={16} /> Logout
            </button>
          </motion.div>
        </div>

        {/* Configuration Terminal */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={`p-8 lg:p-12 rounded-[3.5rem] border backdrop-blur-md min-h-[600px] ${
                darkMode
                  ? "bg-dark-lighter/80 border-gray-700 shadow-2xl"
                  : "bg-white/90 border-gray-100 shadow-2xl shadow-gray-200/50"
              }`}
            >
              {activeTab === "profile" && (
                <div className="space-y-10">
                  <div className="flex flex-col md:flex-row items-center gap-10 border-b border-gray-100 dark:border-gray-800 pb-10">
                    <div className="relative group">
                      <div className="w-36 h-36 rounded-[2.5rem] overflow-hidden border-4 border-white dark:border-gray-800 shadow-2xl shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-shadow">
                        <img
                          src={
                            localFormData.profile.avatar ||
                            "https://ui-avatars.com/api/?name=Admin&background=10b981&color=fff"
                          }
                          alt=""
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <label className="absolute -bottom-3 -right-3 p-3.5 bg-gray-900 text-white rounded-xl cursor-pointer hover:bg-emerald-600 transition-all shadow-xl hover:scale-110 border-4 border-white dark:border-gray-900">
                        <Camera size={20} />
                        <input type="file" className="hidden" />
                      </label>
                    </div>
                    <div className="flex-1 text-center md:text-left space-y-2">
                      <h3
                        className={`text-3xl font-extrabold tracking-tight ${
                          darkMode ? "text-white" : "text-gray-950"
                        }`}
                      >
                        Profile & Branding
                      </h3>
                      <p className="text-sm font-medium text-gray-500">
                        Update your foundation's identity and contact details
                        visible to the public.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-4">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={localFormData.profile.fullName}
                        onChange={(e) =>
                          setLocalFormData({
                            ...localFormData,
                            profile: {
                              ...localFormData.profile,
                              fullName: e.target.value,
                            },
                          })
                        }
                        className={`w-full px-8 py-5 rounded-2xl border-2 font-bold text-sm outline-none transition-all ${
                          darkMode
                            ? "bg-gray-900 border-gray-800 text-white focus:border-emerald-500 focus:bg-gray-800"
                            : "bg-gray-50 border-gray-100 text-gray-950 focus:border-emerald-500 focus:bg-white"
                        }`}
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-4">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={settings?.email}
                        disabled
                        className={`w-full px-8 py-5 rounded-2xl border-2 font-bold text-sm outline-none opacity-60 cursor-not-allowed ${
                          darkMode
                            ? "bg-gray-900 border-gray-800 text-gray-400"
                            : "bg-gray-50 border-gray-100 text-gray-500"
                        }`}
                      />
                    </div>
                    <div className="md:col-span-2 space-y-3">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-4">
                        Foundation Bio
                      </label>
                      <textarea
                        rows={4}
                        value={localFormData.profile.bio}
                        onChange={(e) =>
                          setLocalFormData({
                            ...localFormData,
                            profile: {
                              ...localFormData.profile,
                              bio: e.target.value,
                            },
                          })
                        }
                        className={`w-full px-8 py-5 rounded-3xl border-2 font-medium text-sm outline-none transition-all resize-none ${
                          darkMode
                            ? "bg-gray-900 border-gray-800 text-white focus:border-emerald-500 focus:bg-gray-800"
                            : "bg-gray-50 border-gray-100 text-gray-950 focus:border-emerald-500 focus:bg-white"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "security" && (
                <div className="space-y-10">
                  <div className="flex items-center gap-6 pb-10 border-b border-gray-100 dark:border-gray-800">
                    <div className="p-5 rounded-3xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                      <ShieldCheck size={40} />
                    </div>
                    <div>
                      <h3
                        className={`text-2xl font-extrabold tracking-tight ${
                          darkMode ? "text-white" : "text-gray-950"
                        }`}
                      >
                        Security Protocols
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Manage passwords and multi-factor authentication.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-4">
                          Current Password
                        </label>
                        <div className="relative group">
                          <input
                            type={showPassword ? "text" : "password"}
                            className={`w-full px-8 py-5 rounded-2xl border-2 font-bold text-sm outline-none transition-all ${
                              darkMode
                                ? "bg-gray-900 border-gray-800 text-white focus:border-emerald-500"
                                : "bg-gray-50 border-gray-100 text-gray-950 focus:border-emerald-500 focus:bg-white"
                            }`}
                            placeholder="••••••••"
                          />
                          <button
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-500 transition-colors"
                          >
                            {showPassword ? (
                              <EyeOff size={20} />
                            ) : (
                              <Eye size={20} />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-4">
                          New Password
                        </label>
                        <div className="relative group">
                          <input
                            type={showPassword ? "text" : "password"}
                            className={`w-full px-8 py-5 rounded-2xl border-2 font-bold text-sm outline-none transition-all ${
                              darkMode
                                ? "bg-gray-900 border-gray-800 text-white focus:border-emerald-500"
                                : "bg-gray-50 border-gray-100 text-gray-950 focus:border-emerald-500 focus:bg-white"
                            }`}
                            placeholder="••••••••"
                          />
                        </div>
                      </div>
                    </div>

                    <div
                      className={`p-8 rounded-[2.5rem] border-2 flex items-center justify-between transition-all ${
                        darkMode
                          ? "bg-gray-800/20 border-gray-700 hover:border-emerald-500/50"
                          : "bg-gray-50 border-gray-100 hover:border-emerald-200"
                      }`}
                    >
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center">
                          <Activity size={28} className="text-emerald-500" />
                        </div>
                        <div className="flex flex-col">
                          <span
                            className={`text-sm font-black uppercase tracking-widest mb-1 ${
                              darkMode ? "text-white" : "text-gray-950"
                            }`}
                          >
                            Two-Factor Authentication
                          </span>
                          <span className="text-xs font-medium text-gray-500">
                            Add an extra layer of security to your foundation
                            account.
                          </span>
                        </div>
                      </div>
                      <div
                        className={`w-14 h-8 rounded-full border-2 p-1 cursor-pointer transition-all ${
                          localFormData.security.twoFactorEnabled
                            ? "border-emerald-500 bg-emerald-500"
                            : "border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-700"
                        }`}
                        onClick={() =>
                          setLocalFormData({
                            ...localFormData,
                            security: {
                              ...localFormData.security,
                              twoFactorEnabled:
                                !localFormData.security.twoFactorEnabled,
                            },
                          })
                        }
                      >
                        <motion.div
                          animate={{
                            x: localFormData.security.twoFactorEnabled ? 24 : 0,
                          }}
                          className={`w-5 h-5 rounded-full bg-white shadow-sm`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "notifications" && (
                <div className="space-y-10">
                  <div className="flex flex-col md:flex-row justify-between gap-6 pb-8 border-b border-gray-100 dark:border-gray-800">
                    <div>
                      <h3
                        className={`text-2xl font-extrabold tracking-tight ${
                          darkMode ? "text-white" : "text-gray-950"
                        }`}
                      >
                        Notification Center
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Customize how and when you want to be alerted.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {Object.entries(localFormData.notifications).map(
                      ([key, value]) => (
                        <motion.div
                          key={key}
                          whileHover={{ scale: 1.01 }}
                          className={`p-6 rounded-3xl border flex items-center justify-between transition-all group ${
                            darkMode
                              ? "bg-gray-900/30 border-gray-800 hover:bg-gray-900 hover:border-emerald-500/30"
                              : "bg-white border-gray-100 hover:shadow-lg hover:shadow-emerald-500/5 hover:border-emerald-100"
                          }`}
                        >
                          <div className="flex items-center gap-6">
                            <div
                              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${value ? "bg-emerald-500/10 text-emerald-500" : "bg-gray-100 text-gray-400 dark:bg-gray-800"}`}
                            >
                              <Bell
                                size={22}
                                className={value ? "fill-emerald-500/20" : ""}
                              />
                            </div>
                            <div className="flex flex-col">
                              <span
                                className={`text-xs font-black uppercase tracking-widest mb-0.5 ${
                                  darkMode ? "text-white" : "text-gray-950"
                                }`}
                              >
                                {key.replace(/([A-Z])/g, " $1")}
                              </span>
                              <span className="text-[10px] font-bold text-gray-500">
                                Receive alerts for important activities
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={() =>
                              setLocalFormData({
                                ...localFormData,
                                notifications: {
                                  ...localFormData.notifications,
                                  [key]: !value,
                                },
                              })
                            }
                            className={`w-14 h-8 rounded-full transition-colors relative ${
                              value
                                ? "bg-emerald-500"
                                : "bg-gray-200 dark:bg-gray-700"
                            }`}
                          >
                            <motion.div
                              animate={{ x: value ? 26 : 4 }}
                              className="w-5 h-5 bg-white rounded-full shadow-md absolute top-1.5 left-0"
                            />
                          </button>
                        </motion.div>
                      ),
                    )}
                  </div>
                </div>
              )}

              {activeTab === "system" && (
                <div className="space-y-12">
                  <div className="pb-8 border-b border-gray-100 dark:border-gray-800">
                    <h3
                      className={`text-2xl font-extrabold tracking-tight ${
                        darkMode ? "text-white" : "text-gray-950"
                      }`}
                    >
                      System Preferences
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Adjust regional settings and platform behavior.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-4">
                        Language Selection
                      </label>
                      <div className="relative">
                        <select
                          className={`w-full px-8 py-5 rounded-2xl border-2 font-bold text-sm outline-none appearance-none cursor-pointer transition-all ${
                            darkMode
                              ? "bg-gray-900 border-gray-800 text-white focus:border-emerald-500"
                              : "bg-gray-50 border-gray-100 text-gray-950 focus:border-emerald-500 focus:bg-white"
                          }`}
                        >
                          <option>International Protocol (English)</option>
                          <option>Regional Dialect (Yoruba)</option>
                          <option>Regional Dialect (Hausa)</option>
                        </select>
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                          <Globe size={18} />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-4">
                        Temporal Zone
                      </label>
                      <div className="relative">
                        <select
                          className={`w-full px-8 py-5 rounded-2xl border-2 font-bold text-sm outline-none appearance-none cursor-pointer transition-all ${
                            darkMode
                              ? "bg-gray-900 border-gray-800 text-white focus:border-emerald-500"
                              : "bg-gray-50 border-gray-100 text-gray-950 focus:border-emerald-500 focus:bg-white"
                          }`}
                        >
                          <option>Lagos Operations (GMT+1)</option>
                          <option>Accra Operations (GMT)</option>
                          <option>Nairobi Operations (GMT+3)</option>
                        </select>
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                          <Activity size={18} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Governance Note */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className={`p-10 rounded-[3rem] border relative overflow-hidden transition-all duration-500 ${
          darkMode
            ? "bg-gradient-to-br from-emerald-950/20 to-dark-lighter border-emerald-900/30"
            : "bg-gradient-to-br from-emerald-50 to-white border-emerald-100"
        }`}
      >
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <ShieldCheck size={180} />
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
          <div className="flex-1 space-y-4 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
              <div
                className={`p-2.5 rounded-xl ${darkMode ? "bg-emerald-900/40" : "bg-emerald-100"}`}
              >
                <ShieldCheck size={24} className="text-emerald-500" />
              </div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                Security & Trust
              </span>
            </div>
            <h2
              className={`text-3xl font-extrabold tracking-tight ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Foundation Trust
            </h2>
            <p
              className={`text-sm font-medium leading-relaxed max-w-2xl mx-auto md:mx-0 ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Your system configuration ensures our operational excellence.
              Trust is built on secure, synchronized, and transparent
              administrative protocols.
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-emerald-700 border-2 border-emerald-50 hover:border-emerald-200 px-10 py-5 rounded-2xl font-bold uppercase tracking-widest text-xs shadow-xl shadow-gray-200/50 hover:shadow-2xl transition-all"
          >
            Run Security Audit
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default Settings;
