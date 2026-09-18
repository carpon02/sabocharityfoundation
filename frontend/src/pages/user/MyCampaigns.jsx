// pages/user/MyCampaigns.jsx - Clerk-style redesign
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import { toast } from "react-hot-toast";
import {
  Heart,
  Target,
  Wallet,
  Plus,
  X,
  Upload,
  Trash2,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  MapPin,
  Search,
  ChevronDown,
  Shield,
  Calendar,
} from "lucide-react";
import {
  fetchUserCampaigns,
  createUserCampaign,
  updateUserCampaign,
  deleteUserCampaign,
} from "../../features/campaign/userCampaignsSlice";
import { formatCurrency } from "../../utils/formatCurrency";
import { calculateProgress } from "../../utils/calculateProgress";
import { getDaysLeft } from "../../utils/getDaysLeft";

// ── Status Config ─────────────────────────────────────────────────────────────
const getCampaignStatus = (campaign) => {
  if (campaign.status === "rejected") return "rejected";
  if (campaign.status === "active" && campaign.approved === true) return "active";
  return "pending";
};

const STATUS_CONFIG = {
  active: { label: "Active", dot: "bg-emerald-500", text: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
  pending: { label: "Pending", dot: "bg-amber-400", text: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20" },
  rejected: { label: "Rejected", dot: "bg-red-500", text: "text-red-600", bg: "bg-red-50 dark:bg-red-900/20" },
};

// ── Shared UI ─────────────────────────────────────────────────────────────────
const Card = ({ children, className = "" }) => {
  const { darkMode } = useTheme();
  return (
    <div className={`rounded-xl border ${darkMode ? "bg-[#111] border-gray-800" : "bg-white border-gray-200 shadow-sm"} ${className}`}>
      {children}
    </div>
  );
};

const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800 ${className}`} />
);

const MiniStat = ({ icon: Icon, label, value, iconBg }) => {
  const { darkMode } = useTheme();
  return (
    <Card className="flex items-center gap-3 p-4">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${iconBg}`}>
        <Icon size={16} />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] text-gray-400 truncate">{label}</p>
        <p className={`text-base font-bold truncate ${darkMode ? "text-white" : "text-gray-900"}`}>{value}</p>
      </div>
    </Card>
  );
};

// ── Delete Modal ──────────────────────────────────────────────────────────────
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, campaign, darkMode }) => {
  if (!isOpen) return null;
  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className={`flex flex-col items-center ${
            darkMode ? "bg-[#111] border-gray-800" : "bg-white border-gray-200 shadow-xl"
          } border rounded-xl py-8 px-6 max-w-sm w-full`}
        >
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
            <Trash2 size={24} className="text-red-600 dark:text-red-400" />
          </div>
          <h2 className={`text-lg font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>Delete Campaign?</h2>
          <p className="text-sm text-gray-500 mt-2 text-center">
            Are you sure you want to delete <span className="font-semibold">"{campaign?.title}"</span>? This action cannot be undone.
          </p>
          <div className="flex gap-3 mt-6 w-full">
            <button
              onClick={onClose}
              className={`flex-1 py-2 rounded-lg font-medium text-sm transition-colors ${
                darkMode ? "bg-gray-800 text-gray-300 hover:bg-gray-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-2 rounded-lg font-medium text-sm bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// ── Campaign Modal ────────────────────────────────────────────────────────────
const STEPS = ["Basics", "Details", "Media"];

const inputCls = (darkMode) =>
  `w-full px-3 py-2.5 text-sm rounded-lg border outline-none transition-all ${
    darkMode
      ? "bg-gray-900/80 border-gray-700 text-white placeholder:text-gray-600 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20"
      : "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/20 focus:bg-white"
  }`;

const labelCls = (darkMode) =>
  `block text-xs font-semibold mb-1.5 ${darkMode ? "text-gray-400" : "text-gray-600"}`;

const CampaignModal = ({ isOpen, onClose, onSubmit, darkMode, mode = "create", campaign = null }) => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    title: "", description: "", shortDescription: "", category: "Education", location: "", target: "", startDate: "", endDate: "", tags: "",
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const categories = ["Education", "Health", "Poverty", "Infrastructure", "Emergency", "Basic Needs", "Empowerment", "Food Relief", "Sports", "Welfare", "Healthcare", "Other"];

  useEffect(() => {
    setStep(0);
    if (mode === "edit" && campaign) {
      setFormData({
        title: campaign.title || "",
        description: campaign.description || "",
        shortDescription: campaign.shortDescription || "",
        category: campaign.category ? campaign.category.charAt(0).toUpperCase() + campaign.category.slice(1) : "Education",
        location: (campaign.location?.city || campaign.location?.state)
          ? `${campaign.location.city || ""}, ${campaign.location.state || ""}`.trim().replace(/^,\s*|,\s*$/g, "")
          : "",
        target: campaign.targetAmount?.toString() || "",
        startDate: campaign.startDate ? campaign.startDate.split("T")[0] : "",
        endDate: campaign.endDate ? campaign.endDate.split("T")[0] : "",
        tags: Array.isArray(campaign.tags) ? campaign.tags.join(", ") : "",
      });
      setImageFiles([]);
      setImagePreviews([]);
    } else {
      setFormData({ title: "", description: "", shortDescription: "", category: "Education", location: "", target: "", startDate: "", endDate: "", tags: "" });
      setImageFiles([]);
      setImagePreviews([]);
    }
  }, [mode, campaign, isOpen]);

  const handleInputChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 3) { toast.error("Maximum 3 images allowed"); return; }
    setImageFiles(files);
    setImagePreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const today = new Date().toISOString().split("T")[0];

  // Step validation before advancing
  const canAdvance = () => {
    if (step === 0) return formData.title.trim().length >= 5 && formData.category && formData.location.trim();
    if (step === 1) return formData.description.trim().length >= 50 && formData.target && formData.startDate && formData.endDate;
    return true;
  };

  const handleNext = () => { if (canAdvance()) setStep((s) => Math.min(s + 1, STEPS.length - 1)); };
  const handleBack = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.startDate) return toast.error("Please select a start date.");
    if (!formData.endDate) return toast.error("Please select an end date.");
    if (new Date(formData.endDate) <= new Date(formData.startDate)) return toast.error("End date must be after start date.");

    setSubmitting(true);
    try {
      await onSubmit({ ...formData, imageFiles }, campaign?._id || campaign?.id);
      onClose();
    } catch (err) {
      // handled via toast
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const durationDays = formData.startDate && formData.endDate
    ? Math.max(0, Math.ceil((new Date(formData.endDate) - new Date(formData.startDate)) / 86400000))
    : null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.97 }}
          transition={{ type: "spring", stiffness: 400, damping: 32 }}
          className={`${darkMode ? "bg-[#0f0f0f] border-gray-800/80" : "bg-white border-gray-200"} border rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl`}
        >
          {/* Header */}
          <div className={`px-6 pt-5 pb-4 border-b ${darkMode ? "border-gray-800/80" : "border-gray-100"}`}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className={`text-lg font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                  {mode === "create" ? "Start a Campaign" : "Edit Campaign"}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {mode === "create" ? "Fill in the details to submit your campaign for review." : "Update your campaign information."}
                </p>
              </div>
              <button
                onClick={onClose}
                className={`p-1.5 rounded-lg transition-colors ${darkMode ? "hover:bg-gray-800 text-gray-500" : "hover:bg-gray-100 text-gray-400"}`}
              >
                <X size={17} />
              </button>
            </div>

            {/* Step indicator */}
            <div className="flex items-center gap-0">
              {STEPS.map((label, i) => (
                <React.Fragment key={label}>
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                      i < step
                        ? "bg-emerald-500 text-white"
                        : i === step
                        ? darkMode ? "bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/40" : "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-400"
                        : darkMode ? "bg-gray-800 text-gray-600" : "bg-gray-100 text-gray-400"
                    }`}>
                      {i < step ? <CheckCircle2 size={13} /> : i + 1}
                    </div>
                    <span className={`text-xs font-medium transition-colors ${
                      i === step
                        ? darkMode ? "text-white" : "text-gray-900"
                        : "text-gray-500"
                    }`}>{label}</span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`flex-1 mx-3 h-px transition-colors ${i < step ? "bg-emerald-500" : darkMode ? "bg-gray-800" : "bg-gray-200"}`} style={{ minWidth: 24 }} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto">
            <form id="campaign-form" onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                {/* ── Step 0: Basics ─────────────────────────────── */}
                {step === 0 && (
                  <motion.div
                    key="step0"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.18 }}
                    className="p-6 space-y-5"
                  >
                    <div className="space-y-1.5">
                      <label className={labelCls(darkMode)}>Campaign Title *</label>
                      <input
                        type="text" name="title" value={formData.title} onChange={handleInputChange}
                        required placeholder="e.g. Build a school in Sabo, Ibadan"
                        className={inputCls(darkMode)}
                      />
                      <p className="text-[11px] text-gray-500">Choose a clear, compelling title. Minimum 5 characters.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className={labelCls(darkMode)}>Category *</label>
                        <select name="category" value={formData.category} onChange={handleInputChange} required className={inputCls(darkMode)}>
                          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className={labelCls(darkMode)}>Location *</label>
                        <input
                          type="text" name="location" value={formData.location} onChange={handleInputChange}
                          required placeholder="e.g. Sabo, Ibadan"
                          className={inputCls(darkMode)}
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className={labelCls(darkMode)}>Short Summary <span className="font-normal text-gray-500">(optional)</span></label>
                        <span className="text-[10px] text-gray-500">{formData.shortDescription.length}/200</span>
                      </div>
                      <textarea
                        name="shortDescription" value={formData.shortDescription} onChange={handleInputChange}
                        rows={2} maxLength={200} placeholder="A one-liner shown on campaign cards..."
                        className={`${inputCls(darkMode)} resize-none`}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className={labelCls(darkMode)}>Tags <span className="font-normal text-gray-500">(optional, comma-separated)</span></label>
                      <input
                        type="text" name="tags" value={formData.tags} onChange={handleInputChange}
                        placeholder="e.g. water, children, community"
                        className={inputCls(darkMode)}
                      />
                    </div>
                  </motion.div>
                )}

                {/* ── Step 1: Details ────────────────────────────── */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.18 }}
                    className="p-6 space-y-5"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className={labelCls(darkMode)}>Why are you raising funds? *</label>
                        <span className={`text-[10px] ${formData.description.length < 50 ? "text-amber-500" : "text-gray-500"}`}>
                          {formData.description.length}/2000
                        </span>
                      </div>
                      <textarea
                        name="description" value={formData.description} onChange={handleInputChange}
                        required rows={5} minLength={50} maxLength={2000}
                        placeholder="Explain the cause, who it helps, and how donations will be used. Be as detailed as possible — donors give more when they understand the impact."
                        className={`${inputCls(darkMode)} resize-none`}
                      />
                      {formData.description.length > 0 && formData.description.length < 50 && (
                        <p className="text-[11px] text-amber-500">At least {50 - formData.description.length} more characters needed.</p>
                      )}
                    </div>

                    {/* Fundraising goal */}
                    <div className="space-y-1.5">
                      <label className={labelCls(darkMode)}>Fundraising Goal (₦) *</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-emerald-500">₦</span>
                        <input
                          type="text" inputMode="numeric" name="target"
                          value={formData.target ? Number(formData.target).toLocaleString("en-NG") : ""}
                          onChange={(e) => {
                            const raw = e.target.value.replace(/,/g, "");
                            if (raw === "" || /^\d+$/.test(raw)) setFormData((p) => ({ ...p, target: raw }));
                          }}
                          required placeholder="500,000"
                          className={`${inputCls(darkMode)} pl-8`}
                        />
                      </div>
                      {formData.target && Number(formData.target) >= 1000 && (
                        <p className="text-[11px] text-emerald-500 font-medium">Goal: ₦{Number(formData.target).toLocaleString("en-NG")}</p>
                      )}
                      {formData.target && Number(formData.target) > 0 && Number(formData.target) < 1000 && (
                        <p className="text-[11px] text-red-500">Minimum goal is ₦1,000</p>
                      )}
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className={labelCls(darkMode)}>Start Date *</label>
                        <input
                          type="date" name="startDate" value={formData.startDate} min={today}
                          onChange={handleInputChange} required
                          className={`${inputCls(darkMode)} ${darkMode ? "[color-scheme:dark]" : "[color-scheme:light]"}`}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className={labelCls(darkMode)}>End Date *</label>
                        <input
                          type="date" name="endDate" value={formData.endDate}
                          min={formData.startDate ? new Date(new Date(formData.startDate).getTime() + 86400000).toISOString().split("T")[0] : today}
                          onChange={handleInputChange} required
                          className={`${inputCls(darkMode)} ${darkMode ? "[color-scheme:dark]" : "[color-scheme:light]"}`}
                        />
                      </div>
                    </div>
                    {durationDays !== null && durationDays > 0 && (
                      <p className="text-[11px] text-emerald-500 font-medium -mt-2">
                        Campaign duration: <span className="font-bold">{durationDays} days</span>
                      </p>
                    )}
                  </motion.div>
                )}

                {/* ── Step 2: Media ──────────────────────────────── */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.18 }}
                    className="p-6 space-y-5"
                  >
                    {/* Review summary */}
                    <div className={`rounded-xl border p-4 space-y-3 ${darkMode ? "bg-gray-900/50 border-gray-800" : "bg-gray-50 border-gray-100"}`}>
                      <p className={`text-xs font-semibold ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Campaign Summary</p>
                      <div className="space-y-2">
                        <div className="flex gap-3">
                          <span className="text-[11px] text-gray-500 w-20 shrink-0">Title</span>
                          <span className={`text-[11px] font-semibold truncate ${darkMode ? "text-white" : "text-gray-900"}`}>{formData.title || "—"}</span>
                        </div>
                        <div className="flex gap-3">
                          <span className="text-[11px] text-gray-500 w-20 shrink-0">Category</span>
                          <span className={`text-[11px] font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>{formData.category}</span>
                        </div>
                        <div className="flex gap-3">
                          <span className="text-[11px] text-gray-500 w-20 shrink-0">Goal</span>
                          <span className="text-[11px] font-semibold text-emerald-500">{formData.target ? `₦${Number(formData.target).toLocaleString("en-NG")}` : "—"}</span>
                        </div>
                        <div className="flex gap-3">
                          <span className="text-[11px] text-gray-500 w-20 shrink-0">Duration</span>
                          <span className={`text-[11px] font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                            {durationDays ? `${durationDays} days` : "—"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Image upload */}
                    <div className="space-y-2">
                      <label className={labelCls(darkMode)}>Campaign Photos <span className="font-normal text-gray-500">(up to 3, optional)</span></label>
                      <p className="text-[11px] text-gray-500 -mt-1">Campaigns with photos receive significantly more donations.</p>

                      <div className="grid grid-cols-3 gap-3">
                        {imagePreviews.map((preview, i) => (
                          <div key={i} className={`relative aspect-video rounded-lg overflow-hidden border ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                            <img src={preview} alt="" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => { setImageFiles(imageFiles.filter((_, idx) => idx !== i)); setImagePreviews(imagePreviews.filter((_, idx) => idx !== i)); }}
                              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                            >
                              <X size={11} />
                            </button>
                          </div>
                        ))}
                        {imagePreviews.length < 3 && (
                          <label className={`aspect-video rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors ${
                            darkMode ? "border-gray-700 hover:border-emerald-500/50 hover:bg-gray-900/50" : "border-gray-200 hover:border-emerald-400 hover:bg-emerald-50/50"
                          }`}>
                            <Upload size={18} className="text-gray-400 mb-1" />
                            <span className="text-[10px] text-gray-500">Add photo</span>
                            <input type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
                          </label>
                        )}
                      </div>
                    </div>

                    {/* Review notice */}
                    {mode === "create" && (
                      <div className={`rounded-lg border p-3 flex items-start gap-3 ${darkMode ? "bg-emerald-950/30 border-emerald-900/50" : "bg-emerald-50 border-emerald-100"}`}>
                        <Shield size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                        <p className="text-[11px] text-emerald-600 dark:text-emerald-400 leading-relaxed">
                          Your campaign will be reviewed by the Sabo Foundation team before going live. Typical review time: <strong>12–24 hours</strong>.
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>

          {/* Footer */}
          <div className={`px-6 py-4 border-t ${darkMode ? "border-gray-800/80" : "border-gray-100"} flex items-center justify-between gap-3`}>
            <button
              type="button"
              onClick={step === 0 ? onClose : handleBack}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${darkMode ? "hover:bg-gray-800 text-gray-400" : "hover:bg-gray-100 text-gray-600"}`}
            >
              {step === 0 ? "Cancel" : "← Back"}
            </button>

            <div className="flex items-center gap-1.5">
              {STEPS.map((_, i) => (
                <div key={i} className={`h-1 rounded-full transition-all ${i === step ? "w-6 bg-emerald-500" : darkMode ? "w-2 bg-gray-700" : "w-2 bg-gray-200"}`} />
              ))}
            </div>

            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={!canAdvance()}
                className={`px-5 py-2 rounded-lg text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                Next →
              </button>
            ) : (
              <button
                type="submit"
                form="campaign-form"
                disabled={submitting}
                onClick={handleSubmit}
                className={`px-5 py-2 rounded-lg text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex items-center gap-2 ${submitting ? "opacity-70" : ""}`}
              >
                {submitting ? "Submitting..." : mode === "create" ? "Submit Campaign" : "Save Changes"}
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};


// ── Campaign Card ─────────────────────────────────────────────────────────────
const CampaignCard = ({ campaign, isOwnCampaign, onEdit, onRequestDelete, onDonate }) => {
  const { darkMode } = useTheme();
  const status = getCampaignStatus(campaign);
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const progress = Math.min(100, calculateProgress(campaign.raisedAmount || 0, campaign.targetAmount));
  const daysLeft = getDaysLeft(campaign.endDate);

  const image = campaign.images?.[0]?.url || campaign.image || null;

  const locationStr =
    typeof campaign.location === "string"
      ? campaign.location
      : `${campaign.location?.city || ""}${campaign.location?.city && campaign.location?.state ? ", " : ""}${campaign.location?.state || ""}`.trim() || null;

  const category = campaign.category
    ? campaign.category.charAt(0).toUpperCase() + campaign.category.slice(1)
    : null;

  return (
    <Card className="flex flex-col overflow-hidden group transition-all hover:border-emerald-500/40 hover:shadow-md">
      {/* Image */}
      <div className={`relative h-44 shrink-0 overflow-hidden ${darkMode ? "bg-gray-900" : "bg-gray-100"}`}>
        {image ? (
          <img
            src={image}
            alt={campaign.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Heart size={32} className="text-emerald-500/25" />
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Status badge */}
        <div className="absolute top-3 left-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 dark:bg-black/75 backdrop-blur-sm border border-white/20 dark:border-white/10 shadow-sm">
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} ${status === "pending" ? "animate-pulse" : ""}`} />
            <span className={`text-[10px] font-semibold tracking-wide ${cfg.text}`}>{cfg.label}</span>
          </div>
        </div>

        {/* Category + Days left at the bottom of image */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          {category && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold text-white bg-black/40 backdrop-blur-sm">
              {category}
            </span>
          )}
          {daysLeft !== null && (
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold backdrop-blur-sm ${
              daysLeft <= 0
                ? "bg-red-500/80 text-white"
                : daysLeft <= 7
                ? "bg-amber-500/80 text-white"
                : "bg-black/40 text-white"
            }`}>
              {daysLeft <= 0 ? "Ended" : `${daysLeft}d left`}
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        {/* Location */}
        {locationStr && (
          <div className="flex items-center gap-1 mb-1.5">
            <MapPin size={11} className="text-gray-400 shrink-0" />
            <span className="text-[11px] text-gray-400 truncate">{locationStr}</span>
          </div>
        )}

        {/* Title */}
        <h3 className={`text-sm font-semibold line-clamp-2 leading-snug ${darkMode ? "text-white" : "text-gray-900"}`}>
          {campaign.title}
        </h3>

        {/* Progress */}
        <div className="mt-4">
          <div className={`h-1.5 w-full rounded-full overflow-hidden ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}>
            <div
              className={`h-full rounded-full transition-all ${
                progress >= 100 ? "bg-blue-500" : "bg-emerald-500"
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between items-center mt-2">
            <div>
              <p className={`text-sm font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                {formatCurrency(campaign.raisedAmount || 0)}
              </p>
              <p className="text-[11px] text-gray-400">raised</p>
            </div>
            <div className="text-right">
              <p className={`text-sm font-semibold ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                {progress.toFixed(0)}%
              </p>
              <p className="text-[11px] text-gray-400">of {formatCurrency(campaign.targetAmount)}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`mt-4 pt-3 border-t ${darkMode ? "border-gray-800" : "border-gray-100"} flex gap-2`}>
          {isOwnCampaign ? (
            <>
              <button
                onClick={() => onEdit(campaign)}
                className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-colors ${
                  darkMode
                    ? "border-gray-700 text-gray-300 hover:bg-gray-800 hover:border-gray-600"
                    : "border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                Edit
              </button>
              <button
                onClick={() => onRequestDelete(campaign)}
                className={`w-9 h-9 rounded-lg border flex items-center justify-center transition-colors ${
                  darkMode
                    ? "border-red-900/50 text-red-400 hover:bg-red-900/20"
                    : "border-red-100 text-red-500 hover:bg-red-50"
                }`}
              >
                <Trash2 size={14} />
              </button>
            </>
          ) : (
            <>
              <Link
                to={`/campaigns/${campaign._id || campaign.id}`}
                className={`flex-1 py-2 rounded-lg text-xs font-medium text-center border transition-colors ${
                  darkMode
                    ? "border-gray-700 text-gray-300 hover:bg-gray-800"
                    : "border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                View
              </Link>
              {status === "active" && (
                <button
                  onClick={() => onDonate(campaign)}
                  className="flex-1 py-2 rounded-lg text-xs font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                >
                  Donate
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </Card>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
const EMPTY_ARRAY = [];

const MyCampaigns = () => {
  const dispatch = useDispatch();
  const { darkMode } = useTheme();
  const { user } = useSelector((state) => state.auth);
  const { allCampaigns = EMPTY_ARRAY, myCampaigns = EMPTY_ARRAY, loading } = useSelector((state) => state.userCampaigns);
  const location = useLocation();
  const navigate = useNavigate();

  const [tab, setTab] = useState("my");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState(null);

  const userId = user?.id || user?._id || user?.sub;

  useEffect(() => {
    if (userId) dispatch(fetchUserCampaigns({}));
  }, [dispatch, userId]);

  useEffect(() => {
    if (location.state?.openCreateModal) {
      setModalMode("create");
      setIsModalOpen(true);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const displayCampaigns = useMemo(() => (tab === "my" ? myCampaigns : allCampaigns), [tab, myCampaigns, allCampaigns]);

  const handleCampaignSubmit = useCallback(async (formData, campaignId = null) => {
    if (campaignId) {
      await dispatch(updateUserCampaign({ id: campaignId, campaignData: formData })).unwrap();
      toast.success("Campaign updated successfully!");
    } else {
      await dispatch(createUserCampaign(formData)).unwrap();
      toast.success("Campaign submitted for review!");
    }
  }, [dispatch]);

  const handleConfirmDelete = useCallback(async () => {
    if (!campaignToDelete) return;
    try {
      await dispatch(deleteUserCampaign(campaignToDelete._id || campaignToDelete.id)).unwrap();
      toast.success("Campaign deleted.");
      setShowDeleteModal(false);
      setCampaignToDelete(null);
    } catch (err) {
      toast.error(err || "Could not delete campaign.");
    }
  }, [dispatch, campaignToDelete]);

  const stats = useMemo(() => {
    const active = myCampaigns.filter((c) => getCampaignStatus(c) === "active").length;
    const pending = myCampaigns.filter((c) => !c.approved || c.status === "pending").length;
    const raised = myCampaigns.filter((c) => c.approved).reduce((sum, c) => sum + (c.raisedAmount || 0), 0);
    return { total: myCampaigns.length, active, pending, raised };
  }, [myCampaigns]);

  const filteredCampaigns = useMemo(() => {
    let filtered = [...displayCampaigns];
    if (statusFilter !== "all") filtered = filtered.filter((c) => getCampaignStatus(c) === statusFilter);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter((c) => c.title?.toLowerCase().includes(q));
    }
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return filtered;
  }, [displayCampaigns, statusFilter, searchQuery]);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>Campaigns</h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage your fundraising initiatives</p>
        </div>
        <button
          onClick={() => { setModalMode("create"); setSelectedCampaign(null); setIsModalOpen(true); }}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 w-fit"
        >
          <Plus size={16} /> Create Campaign
        </button>
      </div>

      {/* Tabs */}
      <div className={`flex gap-1 p-1 rounded-lg w-fit ${darkMode ? "bg-[#111] border border-gray-800" : "bg-gray-100"}`}>
        <button onClick={() => setTab("my")} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${tab === "my" ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm" : "text-gray-500 hover:text-gray-900 dark:hover:text-white"}`}>
          My Campaigns
        </button>
        <button onClick={() => setTab("all")} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${tab === "all" ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm" : "text-gray-500 hover:text-gray-900 dark:hover:text-white"}`}>
          All Campaigns
        </button>
      </div>

      {/* Stats */}
      {tab === "my" && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <MiniStat icon={Heart} label="Active" value={stats.active} iconBg="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400" />
          <MiniStat icon={Shield} label="Pending" value={stats.pending} iconBg="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400" />
          <MiniStat icon={Wallet} label="Raised" value={formatCurrency(stats.raised)} iconBg="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" />
          <MiniStat icon={Target} label="Total" value={stats.total} iconBg="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400" />
        </div>
      )}

      {/* Toolbar */}
      <Card>
        <div className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-3 ${darkMode ? "border-gray-800" : "border-gray-100"}`}>
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text" placeholder="Search campaigns..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-9 pr-3 py-2 text-sm rounded-lg border outline-none transition-colors ${darkMode ? "bg-gray-900 border-gray-700 text-white focus:border-gray-600" : "bg-gray-50 border-gray-200 text-gray-900 focus:border-gray-300"}`}
            />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={`px-3 py-2 text-sm rounded-lg border outline-none cursor-pointer ${darkMode ? "bg-gray-900 border-gray-700 text-gray-300" : "bg-white border-gray-200 text-gray-700"}`}>
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </Card>

      {/* Grid */}
      {loading && !displayCampaigns.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-64" />)}
        </div>
      ) : filteredCampaigns.length === 0 ? (
        <div className="py-16 flex flex-col items-center justify-center text-center">
          <Heart size={32} className="text-gray-300 mb-3" />
          <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>No campaigns found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCampaigns.map((c) => (
            <CampaignCard
              key={c._id || c.id}
              campaign={c}
              isOwnCampaign={c.createdBy?._id === userId || c.createdBy === userId}
              onEdit={(sc) => { setSelectedCampaign(sc); setModalMode("edit"); setIsModalOpen(true); }}
              onRequestDelete={(sc) => { setCampaignToDelete(sc); setShowDeleteModal(true); }}
              onDonate={() => navigate(`/campaigns/${c._id || c.id}/donate`)}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <CampaignModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleCampaignSubmit} darkMode={darkMode} mode={modalMode} campaign={selectedCampaign} />
      <DeleteConfirmationModal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} onConfirm={handleConfirmDelete} campaign={campaignToDelete} darkMode={darkMode} />
    </div>
  );
};

export default MyCampaigns;
