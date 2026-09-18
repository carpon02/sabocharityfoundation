// pages/user/Settings.jsx — Clerk-style redesign (all functionality preserved)
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useDispatch } from "react-redux";
import { logout, logoutUser } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import {
  User,
  Bell,
  Shield,
  Lock,
  Camera,
  RefreshCw,
  Globe,
  CreditCard,
  Clock,
  Eye,
  Mail,
  Smartphone,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Activity,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import apiClient from "../../config/apiConfig";

// ── Fallback data ─────────────────────────────────────────────────────────────
const MOCK_USER_DATA = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+234 801 234 5678",
  bio: "Passionate about supporting underprivileged communities in Ibadan.",
  avatar: null,
  verified: true,
  twoFactorEnabled: false,
  authMethod: "email",
  dateJoined: "2024-01-15T10:00:00Z",
  lastLogin: new Date().toISOString(),
  location: { address: "", city: "Ibadan", state: "Oyo", country: "Nigeria" },
  preferences: {
    emailNotifications: { campaignUpdates: true, donationReceipts: true, eventReminders: true, weeklyDigest: false },
    smsNotifications:   { urgentAlerts: true, eventReminders: true, campaignMilestones: true },
    privacy:            { profileVisibility: "public", showDonations: true, showLocation: true, allowContact: false },
    language: "en", currency: "NGN", timezone: "Africa/Lagos", theme: "system",
  },
};

// ── Shared primitives ─────────────────────────────────────────────────────────
const Card = ({ children, className = "" }) => {
  const { darkMode } = useTheme();
  return (
    <div className={`rounded-xl border ${darkMode ? "bg-[#111] border-gray-800" : "bg-white border-gray-200 shadow-sm"} ${className}`}>
      {children}
    </div>
  );
};
const CardHeader = ({ title, description, action }) => {
  const { darkMode } = useTheme();
  return (
    <div className={`flex items-start justify-between gap-3 px-5 py-4 border-b ${darkMode ? "border-gray-800" : "border-gray-100"}`}>
      <div>
        <p className={`text-sm font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>{title}</p>
        {description && <p className="text-[12px] text-gray-400 mt-0.5">{description}</p>}
      </div>
      {action}
    </div>
  );
};

const inputCls = (darkMode) =>
  `w-full px-3 py-2.5 rounded-lg border text-sm outline-none transition-colors ${
    darkMode
      ? "bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:border-gray-600"
      : "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-gray-300 focus:bg-white"
  }`;

const Label = ({ children }) => {
  const { darkMode } = useTheme();
  return (
    <label className={`block text-[11px] font-medium mb-1.5 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
      {children}
    </label>
  );
};

// ── Toggle Switch ─────────────────────────────────────────────────────────────
const Toggle = ({ checked, onChange, disabled }) => {
  const { darkMode } = useTheme();
  return (
    <button
      onClick={onChange}
      disabled={disabled}
      role="switch"
      aria-checked={checked}
      className={`relative inline-flex w-9 h-5 rounded-full transition-colors duration-200 shrink-0 disabled:opacity-50 ${
        checked ? "bg-emerald-600" : darkMode ? "bg-gray-700" : "bg-gray-200"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${
          checked ? "translate-x-4" : "translate-x-0"
        }`}
      />
    </button>
  );
};

// ── Toggle Row ────────────────────────────────────────────────────────────────
const ToggleRow = ({ label, description, checked, onChange, disabled }) => {
  const { darkMode } = useTheme();
  return (
    <div className={`flex items-center justify-between gap-4 py-3.5 px-5 border-b last:border-0 ${darkMode ? "border-gray-800" : "border-gray-100"}`}>
      <div className="min-w-0">
        <p className={`text-sm font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>{label}</p>
        {description && <p className="text-[11px] text-gray-400 mt-0.5">{description}</p>}
      </div>
      <Toggle checked={checked} onChange={onChange} disabled={disabled} />
    </div>
  );
};

// ── Tabs ──────────────────────────────────────────────────────────────────────
const TABS = [
  { id: "profile",       label: "Profile",       icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "privacy",       label: "Privacy",       icon: Eye },
  { id: "security",      label: "Security",      icon: Shield },
  { id: "preferences",   label: "Preferences",   icon: Globe },
];

// ── Profile Tab ───────────────────────────────────────────────────────────────
const ProfileTab = ({ user, onUpdate, isLoading, onRefresh }) => {
  const { darkMode } = useTheme();
  const [editing, setEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
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

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));
  const setLoc = (key, val) => setForm((p) => ({ ...p, location: { ...p.location, [key]: val } }));

  const handleSave = async () => {
    await onUpdate("profile", form);
    setEditing(false);
  };

  const handleCancel = () => {
    setForm({ fullName: user.name, phone: user.phone, bio: user.bio, location: user.location });
    setEditing(false);
  };

  const handleAvatar = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return alert("Please upload an image file");
    if (file.size > 2 * 1024 * 1024) return alert("Image must be smaller than 2MB");
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("avatar", file);
      await apiClient.post("/settings/avatar", fd, { headers: { "Content-Type": "multipart/form-data" } });
      await onRefresh();
    } catch (err) {
      console.error("Avatar upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  const initials = (user.name || "U").split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="space-y-4">
      {/* Avatar */}
      <Card>
        <CardHeader
          title="Profile photo"
          description="Upload a photo to personalize your account"
        />
        <div className="p-5 flex items-center gap-5">
          <div className="relative shrink-0">
            <div className="w-16 h-16 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xl font-bold overflow-hidden">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                initials
              )}
            </div>
            <label className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer shadow-md transition-opacity ${
              darkMode ? "bg-gray-700 text-gray-200 hover:bg-gray-600" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}>
              {uploading ? <RefreshCw size={11} className="animate-spin" /> : <Camera size={11} />}
              <input type="file" accept="image/*" onChange={handleAvatar} disabled={uploading} className="hidden" />
            </label>
          </div>
          <div>
            <p className={`text-sm font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>{user.name}</p>
            <p className="text-[12px] text-gray-400">{user.email}</p>
            {user.verified && (
              <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-medium text-emerald-600">
                <CheckCircle2 size={11} /> Verified
              </span>
            )}
          </div>
        </div>
      </Card>

      {/* Personal info */}
      <Card>
        <CardHeader
          title="Personal information"
          description="Update your name, phone, and bio"
          action={
            !editing ? (
              <button
                onClick={() => setEditing(true)}
                className={`text-[12px] font-medium px-3 py-1.5 rounded-lg transition-colors ${
                  darkMode
                    ? "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleCancel}
                  className={`text-[12px] font-medium px-3 py-1.5 rounded-lg transition-colors ${
                    darkMode ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="text-[12px] font-semibold px-3 py-1.5 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:opacity-90 disabled:opacity-50 transition-opacity"
                >
                  {isLoading ? "Saving…" : "Save"}
                </button>
              </div>
            )
          }
        />
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>Full name</Label>
            {editing ? (
              <input className={inputCls(darkMode)} value={form.fullName} onChange={(e) => set("fullName", e.target.value)} placeholder="Your full name" />
            ) : (
              <p className={`text-sm py-2.5 px-3 rounded-lg ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>{user.name || "—"}</p>
            )}
          </div>
          <div>
            <Label>Email address</Label>
            <div className={`flex items-center justify-between text-sm py-2.5 px-3 rounded-lg ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
              <span className={darkMode ? "text-gray-300" : "text-gray-700"}>{user.email}</span>
              {user.verified && <span className="text-[10px] text-emerald-600 font-medium">Verified</span>}
            </div>
          </div>
          <div>
            <Label>Phone number</Label>
            {editing ? (
              <input className={inputCls(darkMode)} type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+234..." />
            ) : (
              <p className={`text-sm py-2.5 px-3 rounded-lg ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>{user.phone || "—"}</p>
            )}
          </div>
          <div>
            <Label>Location</Label>
            {editing ? (
              <div className="flex gap-2">
                <input className={inputCls(darkMode)} value={form.location.city} onChange={(e) => setLoc("city", e.target.value)} placeholder="City" />
                <input className={`${inputCls(darkMode)} w-24`} value={form.location.state} onChange={(e) => setLoc("state", e.target.value)} placeholder="State" />
              </div>
            ) : (
              <p className={`text-sm py-2.5 px-3 rounded-lg ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
                {[user.location?.city, user.location?.state].filter(Boolean).join(", ") || "—"}
              </p>
            )}
          </div>
          <div className="sm:col-span-2">
            <Label>Bio</Label>
            {editing ? (
              <textarea
                rows={3}
                className={`${inputCls(darkMode)} resize-none`}
                value={form.bio}
                onChange={(e) => set("bio", e.target.value)}
                placeholder="Tell us about yourself…"
              />
            ) : (
              <p className={`text-sm py-2.5 px-3 rounded-lg ${darkMode ? "bg-gray-900 text-gray-300" : "bg-gray-50 text-gray-700"}`}>
                {user.bio || "No bio yet."}
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* Account info */}
      <Card>
        <CardHeader title="Account details" />
        <div className={`divide-y ${darkMode ? "divide-gray-800" : "divide-gray-100"}`}>
          {[
            { label: "Member since", value: user.dateJoined ? new Date(user.dateJoined).toLocaleDateString("en-NG", { year: "numeric", month: "long", day: "numeric" }) : "—" },
            { label: "Last sign in",  value: user.lastLogin  ? new Date(user.lastLogin).toLocaleDateString("en-NG",  { year: "numeric", month: "long", day: "numeric" }) : "—" },
            { label: "Account status", value: user.verified ? "Verified" : "Unverified" },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between px-5 py-3.5">
              <p className={`text-[12px] ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{label}</p>
              <p className={`text-[12px] font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>{value}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

// ── Notifications Tab ─────────────────────────────────────────────────────────
const NotificationsTab = ({ preferences, onUpdate, isLoading }) => {
  const [s, setS] = useState({
    emailNotifications: { ...preferences.emailNotifications },
    smsNotifications:   { ...preferences.smsNotifications },
  });

  const toggle = async (cat, key) => {
    // Optimistic update
    const prev = s;
    const next = { ...s, [cat]: { ...s[cat], [key]: !s[cat][key] } };
    setS(next);
    try {
      await onUpdate("notifications", next);
    } catch {
      // Rollback on failure
      setS(prev);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader title="Email notifications" description="Choose which emails you receive" />
        <ToggleRow label="Campaign updates"   description="Progress reports from campaigns you support"      checked={s.emailNotifications.campaignUpdates}  onChange={() => toggle("emailNotifications","campaignUpdates")}  disabled={isLoading} />
        <ToggleRow label="Donation receipts"  description="Instant confirmation after every donation"         checked={s.emailNotifications.donationReceipts} onChange={() => toggle("emailNotifications","donationReceipts")} disabled={isLoading} />
        <ToggleRow label="Event reminders"    description="Reminders for upcoming events you've joined"      checked={s.emailNotifications.eventReminders}   onChange={() => toggle("emailNotifications","eventReminders")}   disabled={isLoading} />
        <ToggleRow label="Weekly digest"      description="A summary of foundation activity each week"       checked={s.emailNotifications.weeklyDigest}     onChange={() => toggle("emailNotifications","weeklyDigest")}     disabled={isLoading} />
      </Card>

      <Card>
        <CardHeader title="SMS notifications" description="Text alerts sent to your phone number" />
        <ToggleRow label="Urgent alerts"       description="High-priority notifications that can't wait"     checked={s.smsNotifications.urgentAlerts}       onChange={() => toggle("smsNotifications","urgentAlerts")}       disabled={isLoading} />
        <ToggleRow label="Event reminders"     description="SMS reminders before registered events"          checked={s.smsNotifications.eventReminders}     onChange={() => toggle("smsNotifications","eventReminders")}     disabled={isLoading} />
        <ToggleRow label="Campaign milestones" description="Notify when your supported campaigns hit goals"  checked={s.smsNotifications.campaignMilestones} onChange={() => toggle("smsNotifications","campaignMilestones")} disabled={isLoading} />
      </Card>
    </div>
  );
};

// ── Privacy Tab ───────────────────────────────────────────────────────────────
const PrivacyTab = ({ preferences, onUpdate, isLoading }) => {
  const { darkMode } = useTheme();
  const [s, setS] = useState({ ...preferences.privacy });

  const change = async (key, val) => {
    const next = { ...s, [key]: val };
    setS(next);
    await onUpdate("privacy", next);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader title="Profile visibility" description="Control who can see your profile" />
        <div className="p-5">
          <Label>Who can view your profile</Label>
          <select
            value={s.profileVisibility || "public"}
            onChange={(e) => change("profileVisibility", e.target.value)}
            className={`${inputCls(darkMode)} cursor-pointer`}
          >
            <option value="public">Everyone (public)</option>
            <option value="donors">Verified donors only</option>
            <option value="private">Only me (private)</option>
          </select>
        </div>
      </Card>

      <Card>
        <CardHeader title="Data sharing" description="Choose what others can see about you" />
        <ToggleRow label="Show donation history" description="Display campaigns you've supported on your profile" checked={s.showDonations}  onChange={() => change("showDonations",  !s.showDonations)}  disabled={isLoading} />
        <ToggleRow label="Show location"         description="Share your city and state with other users"         checked={s.showLocation}   onChange={() => change("showLocation",   !s.showLocation)}   disabled={isLoading} />
        <ToggleRow label="Allow direct messages" description="Let other verified users message you"               checked={s.allowContact}   onChange={() => change("allowContact",   !s.allowContact)}   disabled={isLoading} />
      </Card>
    </div>
  );
};

// ── Security Tab ──────────────────────────────────────────────────────────────
const SecurityTab = ({ user, onUpdate, isLoading }) => {
  const { darkMode } = useTheme();
  const [showPw, setShowPw] = useState(false);
  const [pw, setPw] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [err, setErr] = useState("");

  const handleChangePw = async (e) => {
    e.preventDefault();
    if (pw.newPassword !== pw.confirmPassword) { setErr("New passwords don't match"); return; }
    if (pw.newPassword.length < 8) { setErr("Password must be at least 8 characters"); return; }
    setErr("");
    try {
      await onUpdate("password", pw);
      setPw({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setShowPw(false);
    } catch (e) {
      setErr(e.message || "Failed to change password");
    }
  };

  return (
    <div className="space-y-4">
      {/* Password */}
      <Card>
        <CardHeader
          title="Password"
          description={user.authMethod === "google" ? "Managed by Google" : "Change your account password"}
          action={
            user.authMethod !== "google" && (
              <button
                onClick={() => setShowPw((p) => !p)}
                className={`text-[12px] font-medium px-3 py-1.5 rounded-lg transition-colors ${
                  darkMode ? "bg-gray-800 text-gray-300 hover:bg-gray-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {showPw ? "Cancel" : "Change password"}
              </button>
            )
          }
        />

        {user.authMethod === "google" && (
          <div className="p-5">
            <p className="text-sm text-gray-400">
              Your account is linked to Google Sign-In. Manage your password through{" "}
              <a href="https://myaccount.google.com/security" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
                Google Account settings
              </a>.
            </p>
          </div>
        )}

        {showPw && user.authMethod !== "google" && (
          <form onSubmit={handleChangePw} className="p-5 space-y-4">
            {err && (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
                <AlertTriangle size={14} /> {err}
              </div>
            )}
            <div>
              <Label>Current password</Label>
              <input type="password" className={inputCls(darkMode)} placeholder="Enter current password"
                value={pw.currentPassword} onChange={(e) => setPw((p) => ({ ...p, currentPassword: e.target.value }))} required />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>New password</Label>
                <input type="password" className={inputCls(darkMode)} placeholder="Min. 8 characters"
                  value={pw.newPassword} onChange={(e) => setPw((p) => ({ ...p, newPassword: e.target.value }))} required />
              </div>
              <div>
                <Label>Confirm new password</Label>
                <input type="password" className={inputCls(darkMode)} placeholder="Repeat new password"
                  value={pw.confirmPassword} onChange={(e) => setPw((p) => ({ ...p, confirmPassword: e.target.value }))} required />
              </div>
            </div>
            <button type="submit" disabled={isLoading}
              className="px-4 py-2.5 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {isLoading ? "Saving…" : "Update password"}
            </button>
          </form>
        )}
      </Card>

      {/* Sessions / Account info */}
      <Card>
        <CardHeader title="Account security" description="Overview of your account's security status" />
        <div className={`divide-y ${darkMode ? "divide-gray-800" : "divide-gray-100"}`}>
          {[
            { label: "Account verification", value: user.verified ? "Verified ✓" : "Not verified", ok: user.verified },
            { label: "Sign-in method",        value: user.authMethod === "google" ? "Google OAuth" : "Email & password" },
            { label: "Two-factor auth",       value: user.twoFactorEnabled ? "Enabled" : "Not enabled", ok: user.twoFactorEnabled },
          ].map(({ label, value, ok }) => (
            <div key={label} className="flex items-center justify-between px-5 py-3.5">
              <p className={`text-[12px] ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{label}</p>
              <span className={`text-[12px] font-medium ${
                ok === true ? "text-emerald-600" : ok === false ? "text-amber-500" : darkMode ? "text-white" : "text-gray-900"
              }`}>
                {value}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Danger zone */}
      <DeleteAccountSection onUpdate={onUpdate} isLoading={isLoading} />
    </div>
  );
};

// ── Delete Account (its own card so SecurityTab stays clean) ──────────────────
const DeleteAccountSection = ({ onUpdate, isLoading }) => {
  const { darkMode } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1); // 1 = confirm intent, 2 = enter password
  const [password, setPassword] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [err, setErr] = useState("");

  const handleDelete = async (e) => {
    e.preventDefault();
    if (!password) { setErr("Password is required"); return; }
    setDeleting(true);
    setErr("");
    try {
      await onUpdate("deleteAccount", { password, confirmation: "DELETE" });
      dispatch(logout());
      dispatch(logoutUser());
      navigate("/");
    } catch (error) {
      setErr(error.response?.data?.message || error.message || "Failed to delete account");
      setDeleting(false);
    }
  };

  return (
    <Card className="border-red-200 dark:border-red-900/40">
      <CardHeader title="Danger zone" description="Permanent, irreversible actions" />
      <div className="p-5">
        {!open ? (
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-gray-400">
              Deleting your account removes all your data permanently and cannot be undone.
            </p>
            <button
              onClick={() => setOpen(true)}
              className="shrink-0 px-4 py-2 rounded-lg border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              Delete account
            </button>
          </div>
        ) : step === 1 ? (
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800">
              <AlertTriangle size={16} className="text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 dark:text-red-400">
                This will permanently delete your account, all donation history, and campaign data. This <strong>cannot</strong> be undone.
              </p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setOpen(false)} className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${darkMode ? "border-gray-700 text-gray-400 hover:border-gray-600 hover:text-white" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                Cancel
              </button>
              <button onClick={() => setStep(2)} className="flex-1 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors">
                I understand, continue
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleDelete} className="space-y-4">
            <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              Enter your password to confirm account deletion:
            </p>
            {err && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
                <AlertTriangle size={13} /> {err}
              </div>
            )}
            <input
              type="password"
              placeholder="Your current password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputCls(darkMode)}
              required
              autoFocus
            />
            <div className="flex gap-2">
              <button type="button" onClick={() => { setOpen(false); setStep(1); setPassword(""); setErr(""); }}
                className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${darkMode ? "border-gray-700 text-gray-400 hover:text-white" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                Cancel
              </button>
              <button type="submit" disabled={deleting || !password}
                className="flex-1 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2">
                {deleting ? <><RefreshCw size={13} className="animate-spin" /> Deleting…</> : "Delete my account"}
              </button>
            </div>
          </form>
        )}
      </div>
    </Card>
  );
};

// ── Preferences Tab ───────────────────────────────────────────────────────────
const PreferencesTab = ({ preferences, onUpdate }) => {
  const { darkMode, setDarkMode } = useTheme();
  const [s, setS] = useState({
    language: preferences.language || "en",
    currency: preferences.currency || "NGN",
    timezone: preferences.timezone || "Africa/Lagos",
    theme:    preferences.theme    || "system",
  });

  const change = async (key, val) => {
    const next = { ...s, [key]: val };
    setS(next);
    // Apply theme change live
    if (key === "theme") {
      if (val === "dark")   setDarkMode(true);
      if (val === "light")  setDarkMode(false);
      if (val === "system") setDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
    await onUpdate("preferences", next);
  };

  const fields = [
    { key: "language", label: "Language", icon: Activity, options: [
      { label: "English (US)", value: "en" },
      { label: "Yorùbá (NG)", value: "yo" },
      { label: "Hausa (NG)",  value: "ha" },
      { label: "Igbo (NG)",   value: "ig" },
    ]},
    { key: "currency", label: "Currency", icon: CreditCard, options: [
      { label: "Nigerian Naira (₦)", value: "NGN" },
      { label: "US Dollar ($)",       value: "USD" },
      { label: "Euro (€)",            value: "EUR" },
    ]},
    { key: "timezone", label: "Timezone", icon: Clock, options: [
      { label: "Lagos (GMT+1)", value: "Africa/Lagos" },
      { label: "UTC",           value: "UTC" },
    ]},
    { key: "theme", label: "Appearance", icon: Sparkles, options: [
      { label: "System default", value: "system" },
      { label: "Light mode",     value: "light"  },
      { label: "Dark mode",      value: "dark"   },
    ]},
  ];

  return (
    <Card>
      <CardHeader title="App preferences" description="Customize your experience" />
      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
        {fields.map(({ key, label, icon: Icon, options }) => (
          <div key={key}>
            <div className="flex items-center gap-1.5 mb-1.5">
              <Icon size={13} className="text-gray-400" />
              <Label>{label}</Label>
            </div>
            <select
              value={s[key]}
              onChange={(e) => change(key, e.target.value)}
              className={`${inputCls(darkMode)} cursor-pointer`}
            >
              {options.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </Card>
  );
};

// ── Main Settings ─────────────────────────────────────────────────────────────
const Settings = () => {
  const { darkMode } = useTheme();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const [toast, setToast] = useState(null); // { type: "success"|"error", text }
  const [usingMock, setUsingMock] = useState(false);

  const showToast = (type, text) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchSettings = useCallback(async () => {
    try {
      setInitialLoading(true);
      const res = await apiClient.get("/settings");
      setUserData(res.data.data);
      setUsingMock(false);
    } catch {
      setUserData(MOCK_USER_DATA);
      setUsingMock(true);
    } finally {
      setInitialLoading(false);
    }
  }, []);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  const handleUpdate = useCallback(async (section, data) => {
    if (usingMock) { showToast("success", "Saved locally (demo mode)"); return; }
    setLoading(true);
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
          await apiClient.put("/settings/security", { twoFactorEnabled: data });
          break;
        case "preferences":
          await apiClient.put("/settings/preferences", data);
          break;
        case "deleteAccount":
          await apiClient.delete("/settings/account", { data });
          break;
        default:
          throw new Error("Unknown settings section: " + section);
      }
      if (section !== "deleteAccount") {
        await fetchSettings();
        showToast("success", "Changes saved");
      }
    } catch (err) {
      showToast("error", err.response?.data?.message || "Failed to save changes");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchSettings, usingMock]);

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw size={20} className="animate-spin text-gray-400" />
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Failed to load settings</p>
        <button onClick={fetchSettings} className="text-sm text-emerald-600 font-medium hover:underline">Retry</button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>Settings</h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage your account and preferences</p>
        </div>

        {/* Toast */}
        {toast && (
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${
            toast.type === "success"
              ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400"
              : "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
          }`}>
            {toast.type === "success" ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
            {toast.text}
          </div>
        )}
      </div>

      {/* Demo mode banner */}
      {usingMock && (
        <div className={`flex items-center justify-between gap-3 px-4 py-3 rounded-lg border ${
          darkMode ? "bg-amber-900/10 border-amber-800/30 text-amber-400" : "bg-amber-50 border-amber-100 text-amber-700"
        }`}>
          <div className="flex items-center gap-2">
            <Zap size={14} className="shrink-0" />
            <p className="text-[12px] font-medium">Demo mode — API unavailable. Changes are saved locally only.</p>
          </div>
          <button onClick={fetchSettings} className="text-[12px] font-semibold underline">Retry</button>
        </div>
      )}

      {/* Tab bar */}
      <div className={`flex gap-1 p-1 rounded-lg border ${darkMode ? "bg-gray-900 border-gray-800" : "bg-gray-100 border-gray-200"} overflow-x-auto`}>
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-[12px] font-medium whitespace-nowrap transition-all ${
              activeTab === id
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            <Icon size={13} />
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "profile"       && <ProfileTab       user={userData}                onUpdate={handleUpdate} isLoading={loading} onRefresh={fetchSettings} />}
      {activeTab === "notifications" && <NotificationsTab preferences={userData.preferences} onUpdate={handleUpdate} isLoading={loading} />}
      {activeTab === "privacy"       && <PrivacyTab       preferences={userData.preferences} onUpdate={handleUpdate} isLoading={loading} />}
      {activeTab === "security"      && <SecurityTab      user={userData}                onUpdate={handleUpdate} isLoading={loading} />}
      {activeTab === "preferences"   && <PreferencesTab   preferences={userData.preferences} onUpdate={handleUpdate} />}
    </div>
  );
};

export default Settings;
