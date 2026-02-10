// pages/MyCampaigns.jsx - Charity Projects Hub
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import { toast } from "react-hot-toast";
import {
  Heart,
  Rocket,
  Target,
  Wallet,
  Plus,
  X,
  Edit,
  Upload,
  Trash2,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  TrendingUp,
  MapPin,
  Search,
  ChevronDown,
  Shield,
  Zap,
  Calendar,
  Grid,
  List as ListIcon,
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

const getCampaignStatus = (campaign) => {
  if (campaign.status === "rejected") return "rejected";
  if (campaign.status === "active" && campaign.approved) return "active";
  if (campaign.status === "pending") return "pending";
  return campaign.status || "pending";
};

const getStatusConfig = (status) => {
  const configs = {
    active: {
      icon: CheckCircle,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      label: "Active Project",
      border: "border-emerald-500/20",
    },
    pending: {
      icon: Clock,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      label: "Under Verification",
      border: "border-amber-500/20",
    },
    rejected: {
      icon: XCircle,
      color: "text-rose-500",
      bg: "bg-rose-500/10",
      label: "Cancelled",
      border: "border-rose-500/20",
    },
  };
  return configs[status] || configs.pending;
};

// Component: Modern Stats Card (Foundation Module)
const BusinessStat = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  darkMode,
  delay = 0,
}) => {
  if (!Icon) return null;
  const MotionComponent = motion.div;

  return (
    <MotionComponent
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -5 }}
      className={`relative overflow-hidden rounded-2xl border p-6 flex flex-col justify-between min-h-[150px] transition-all duration-300 group ${
        darkMode
          ? "bg-gray-950 border-gray-800 shadow-2xl shadow-emerald-500/5"
          : "bg-white border-gray-100 shadow-xl shadow-gray-200/20"
      }`}
    >
      <div className="flex items-center justify-between relative z-10">
        <div
          className={`p-3 rounded-xl ${
            darkMode
              ? "bg-gray-900 border-gray-800"
              : "bg-emerald-50 border-emerald-100/50"
          } border`}
        >
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
        <div
          className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${
            darkMode
              ? "bg-gray-900 border-gray-800 text-gray-500"
              : "bg-emerald-50 border-emerald-100/50 text-emerald-600/70"
          }`}
        >
          Stat Details
        </div>
      </div>

      <div className="mt-4 relative z-10">
        <h3
          className={`text-[10px] font-bold uppercase tracking-widest ${
            darkMode ? "text-gray-500" : "text-gray-400"
          }`}
        >
          {title}
        </h3>
        <div
          className={`text-xl font-bold mt-1 tracking-tight ${
            darkMode ? "text-white" : "text-gray-950"
          }`}
        >
          {value}
        </div>
        <p
          className={`text-[9px] mt-1 font-semibold ${
            darkMode ? "text-gray-600" : "text-gray-400"
          }`}
        >
          {subtitle}
        </p>
      </div>
    </MotionComponent>
  );
};

// Delete Confirmation Modal Component (Decommission Protocol)
const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  campaign,
  darkMode,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-gray-950/80 backdrop-blur-xl flex items-center justify-center z-[var(--z-modal)] p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 40 }}
          className={`flex flex-col items-center ${
            darkMode
              ? "bg-gray-950 border-gray-800 shadow-2xl"
              : "bg-white border-gray-100 shadow-xl shadow-gray-200/20"
          } rounded-2xl py-12 px-10 max-w-[480px] w-full border transition-all duration-500`}
        >
          <div className="w-20 h-20 bg-rose-500/10 rounded-2xl flex items-center justify-center mb-8 border border-rose-500/20">
            <Trash2 size={32} className="text-rose-500" />
          </div>

          <h2
            className={`${
              darkMode ? "text-white" : "text-gray-950"
            } text-2xl font-bold tracking-tight text-center leading-tight`}
          >
            Cancel Project?
          </h2>

          <p
            className={`text-sm ${
              darkMode ? "text-gray-400" : "text-gray-500"
            } mt-4 text-center leading-relaxed font-semibold`}
          >
            Are you sure you want to cancel{" "}
            <span className="text-rose-500 font-bold">"{campaign?.title}"</span>
            ?
            <br />
            This action is irreversible and will remove all project data
            permanently from our records.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-10 w-full">
            <button
              onClick={onClose}
              className={`flex-1 py-3.5 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all border ${
                darkMode
                  ? "border-gray-800 text-gray-500 hover:bg-gray-900 hover:text-white"
                  : "border-gray-100 text-gray-400 hover:bg-gray-50 hover:text-gray-700"
              }`}
            >
              Keep Project
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-3.5 rounded-xl text-white bg-rose-600 font-bold text-[10px] uppercase tracking-widest hover:bg-rose-700 shadow-lg shadow-rose-500/20 transition-all active:scale-95"
            >
              Confirm Cancellation
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// Campaign Modal Component (Mission Initializer)
const CampaignModal = ({
  isOpen,
  onClose,
  onSubmit,
  darkMode,
  mode = "create",
  campaign = null,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    shortDescription: "",
    category: "Education",
    location: "",
    target: "",
    startDate: "",
    endDate: "",
    tags: "",
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const categories = [
    "Education",
    "Health",
    "Poverty",
    "Infrastructure",
    "Emergency",
    "Basic Needs",
    "Empowerment",
    "Food Relief",
    "Sports",
    "Welfare",
    "Emergency Relief",
    "Healthcare",
    "Other",
  ];

  useEffect(() => {
    if (mode === "edit" && campaign) {
      setFormData({
        title: campaign.title || "",
        description: campaign.description || "",
        shortDescription: campaign.shortDescription || "",
        category: campaign.category
          ? campaign.category.charAt(0).toUpperCase() +
            campaign.category.slice(1)
          : "Education",
        location:
          campaign.location?.city || campaign.location?.state
            ? `${campaign.location.city || ""}, ${
                campaign.location.state || ""
              }`
                .trim()
                .replace(/^,\s*|,\s*$/g, "")
            : "",
        target: campaign.targetAmount?.toString() || "",
        startDate: campaign.startDate ? campaign.startDate.split("T")[0] : "",
        endDate: campaign.endDate ? campaign.endDate.split("T")[0] : "",
        tags: Array.isArray(campaign.tags) ? campaign.tags.join(", ") : "",
      });
      setImageFiles([]);
      setImagePreviews([]);
    } else {
      setFormData({
        title: "",
        description: "",
        shortDescription: "",
        category: "Education",
        location: "",
        target: "",
        startDate: "",
        endDate: "",
        tags: "",
      });
      setImageFiles([]);
      setImagePreviews([]);
    }
  }, [mode, campaign, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 3) {
      toast.error("Maximum 3 images allowed");
      return;
    }
    setImageFiles(files);
    setImagePreviews(files.map((file) => URL.createObjectURL(file)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(
        { ...formData, imageFiles },
        campaign?._id || campaign?.id,
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-gray-950/90 backdrop-blur-xl flex items-center justify-center z-[var(--z-modal)] p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 50 }}
          className={`${
            darkMode
              ? "bg-gray-950 border-gray-800 shadow-2xl"
              : "bg-white border-gray-100 shadow-xl shadow-gray-200/20"
          } border rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-hidden relative flex flex-col transition-all duration-700`}
        >
          {/* Submitting Overlay */}
          {submitting && (
            <div className="absolute inset-0 bg-gray-950/80 backdrop-blur-md flex items-center justify-center z-[160]">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-6 shadow-lg shadow-emerald-500/20"></div>
                <h3 className="text-white text-xl font-bold">
                  {mode === "create"
                    ? "Submitting Mission..."
                    : "Updating Mission..."}
                </h3>
              </motion.div>
            </div>
          )}

          <div className="px-8 py-6 border-b border-gray-100/10 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="w-8 h-1 bg-emerald-500 rounded-full" />
                <h4
                  className={`text-[10px] font-bold uppercase tracking-widest ${darkMode ? "text-gray-500" : "text-gray-400"}`}
                >
                  Community Empowerment Hub
                </h4>
              </div>
              <h3
                className={`text-2xl md:text-3xl font-bold tracking-tight ${
                  darkMode ? "text-white" : "text-gray-950"
                }`}
              >
                {mode === "create"
                  ? "Launch Impact Project"
                  : "Update Project Details"}
              </h3>
            </div>
            <button
              onClick={onClose}
              className={`p-3 rounded-xl transition-all border ${
                darkMode
                  ? "hover:bg-gray-900 border-gray-800 text-gray-500 hover:text-white"
                  : "hover:bg-gray-50 border-gray-100 text-gray-400 hover:text-gray-950 shadow-sm"
              }`}
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar">
            <form
              onSubmit={handleSubmit}
              id="campaign-form"
              className="space-y-10 pb-8"
            >
              {mode === "create" && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-5 rounded-xl border flex items-start gap-4 ${
                    darkMode
                      ? "bg-emerald-500/5 border-emerald-500/10 text-emerald-400"
                      : "bg-emerald-50 border-emerald-100 text-emerald-700"
                  }`}
                >
                  <Shield className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-1">
                      Verification Protocol
                    </p>
                    <p className="text-xs font-semibold leading-relaxed opacity-90">
                      New projects are reviewed by the foundation to ensure
                      alignment with community goals. Standard verification
                      time:{" "}
                      <span className="underline decoration-emerald-500/30 underline-offset-4">
                        12-24 Hours
                      </span>
                      .
                    </p>
                  </div>
                </motion.div>
              )}

              <div className="space-y-8">
                <div className="group">
                  <label
                    className={`block text-[10px] font-bold uppercase tracking-widest mb-3 transition-colors group-focus-within:text-emerald-500 ${
                      darkMode ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    Project Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    placeholder="E.g., Sabo Vocational Training Center"
                    className={`w-full px-6 py-4 rounded-xl border font-bold text-sm transition-all outline-none ${
                      darkMode
                        ? "bg-gray-900/50 border-gray-800 text-white focus:border-emerald-500/50"
                        : "bg-gray-50 border-gray-100 text-gray-950 focus:border-emerald-500/50"
                    }`}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="group">
                    <label
                      className={`block text-[10px] font-bold uppercase tracking-widest mb-3 transition-colors group-focus-within:text-emerald-500 ${
                        darkMode ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      Impact Category *
                    </label>
                    <div className="relative">
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-6 py-4 rounded-xl border font-bold text-sm transition-all outline-none appearance-none cursor-pointer ${
                          darkMode
                            ? "bg-gray-900 border-gray-800 text-gray-400 focus:text-white focus:border-emerald-500/50"
                            : "bg-gray-50 border-gray-100 text-gray-500 focus:text-gray-950 focus:border-emerald-500/50"
                        }`}
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500 pointer-events-none" />
                    </div>
                  </div>
                  <div className="group">
                    <label
                      className={`block text-[10px] font-bold uppercase tracking-widest mb-3 transition-colors group-focus-within:text-emerald-500 ${
                        darkMode ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      Location *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        required
                        placeholder="E.g., Sabo, Ibadan"
                        className={`w-full pl-12 pr-6 py-4 rounded-xl border font-bold text-sm transition-all outline-none ${
                          darkMode
                            ? "bg-gray-900 border-gray-800 text-white focus:border-emerald-500/50"
                            : "bg-gray-50 border-gray-100 text-gray-950 focus:border-emerald-500/50"
                        }`}
                      />
                    </div>
                  </div>
                </div>

                <div className="group">
                  <label
                    className={`block text-[10px] font-bold uppercase tracking-widest mb-3 transition-colors group-focus-within:text-emerald-500 ${
                      darkMode ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    Short Summary
                  </label>
                  <textarea
                    name="shortDescription"
                    value={formData.shortDescription}
                    onChange={handleInputChange}
                    rows={2}
                    maxLength={200}
                    placeholder="Briefly describe the core mission..."
                    className={`w-full px-6 py-4 rounded-xl border font-semibold text-sm leading-relaxed transition-all outline-none resize-none ${
                      darkMode
                        ? "bg-gray-900 border-gray-800 text-white focus:border-emerald-500/50"
                        : "bg-gray-50 border-gray-100 text-gray-950 focus:border-emerald-500/50"
                    }`}
                  />
                </div>

                <div className="group">
                  <label
                    className={`block text-[10px] font-bold uppercase tracking-widest mb-3 transition-colors group-focus-within:text-emerald-500 ${
                      darkMode ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    Impact Story *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    minLength={50}
                    maxLength={2000}
                    placeholder="Describe the problem, solution, and the impact this project will create..."
                    className={`w-full px-6 py-4 rounded-xl border font-semibold text-sm leading-relaxed transition-all outline-none ${
                      darkMode
                        ? "bg-gray-900 border-gray-800 text-white focus:border-emerald-500/50"
                        : "bg-gray-50 border-gray-100 text-gray-950 focus:border-emerald-500/50"
                    }`}
                  />
                  <div className="flex justify-end mt-3">
                    <span
                      className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-lg border ${
                        darkMode
                          ? "bg-gray-900 border-gray-800 text-gray-600"
                          : "bg-gray-50 border-gray-100 text-gray-400"
                      }`}
                    >
                      {formData.description.length} / 2000
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="group">
                    <label
                      className={`block text-[10px] font-bold uppercase tracking-widest mb-3 transition-colors group-focus-within:text-emerald-500 ${
                        darkMode ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      Contribution Goal (₦) *
                    </label>
                    <div className="relative">
                      <Wallet className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                      <input
                        type="number"
                        name="target"
                        value={formData.target}
                        onChange={handleInputChange}
                        required
                        min="1000"
                        placeholder="0.00"
                        className={`w-full pl-14 pr-6 py-4 rounded-xl border font-bold text-lg transition-all outline-none ${
                          darkMode
                            ? "bg-gray-900 border-gray-800 text-white focus:border-emerald-500/50"
                            : "bg-gray-50 border-gray-100 text-gray-950 focus:border-emerald-500/50"
                        }`}
                      />
                    </div>
                  </div>
                  <div className="group">
                    <label
                      className={`block text-[10px] font-bold uppercase tracking-widest mb-3 transition-colors group-focus-within:text-emerald-500 ${
                        darkMode ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      Timeline
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                        <input
                          type="date"
                          name="startDate"
                          value={formData.startDate}
                          onChange={handleInputChange}
                          required
                          className={`w-full pl-10 pr-4 py-3.5 rounded-xl border font-bold text-[10px] outline-none ${
                            darkMode
                              ? "bg-gray-900 border-gray-800 text-gray-400 focus:text-white"
                              : "bg-gray-50 border-gray-100 text-gray-500 focus:text-gray-950"
                          }`}
                        />
                      </div>
                      <div className="relative">
                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                        <input
                          type="date"
                          name="endDate"
                          value={formData.endDate}
                          onChange={handleInputChange}
                          required
                          className={`w-full pl-10 pr-4 py-3.5 rounded-xl border font-bold text-[10px] outline-none ${
                            darkMode
                              ? "bg-gray-900 border-gray-800 text-gray-400 focus:text-white"
                              : "bg-gray-50 border-gray-100 text-gray-500 focus:text-gray-950"
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="group">
                  <label
                    className={`block text-[10px] font-bold uppercase tracking-widest mb-4 ${
                      darkMode ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    Project Media (Max 3)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <label
                      className={`sm:col-span-1 h-32 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
                        darkMode
                          ? "bg-gray-900/50 border-gray-800 hover:border-emerald-500/50 hover:bg-gray-900"
                          : "bg-gray-50 border-gray-100 hover:border-emerald-200 hover:bg-white"
                      }`}
                    >
                      <div className="p-2 rounded-xl bg-emerald-500/10 mb-2">
                        <Upload className="w-5 h-5 text-emerald-500" />
                      </div>
                      <span className="text-[9px] font-bold uppercase tracking-widest text-gray-500">
                        Upload
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                    <div className="sm:col-span-3 flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
                      {imagePreviews.map((preview, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="relative w-28 h-28 group shrink-0"
                        >
                          <img
                            src={preview}
                            className="w-full h-full object-cover rounded-xl border-2 border-transparent group-hover:border-emerald-500/50 transition-all duration-300"
                            alt=""
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setImageFiles(
                                imageFiles.filter((_, idx) => idx !== i),
                              );
                              setImagePreviews(
                                imagePreviews.filter((_, idx) => idx !== i),
                              );
                            }}
                            className="absolute -top-2 -right-2 w-7 h-7 bg-rose-600 text-white rounded-lg flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-90"
                          >
                            <X size={14} />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Actions */}
          <div
            className={`px-8 py-6 border-t flex flex-col sm:flex-row gap-4 ${
              darkMode
                ? "border-gray-800 bg-gray-950"
                : "border-gray-100 bg-white"
            }`}
          >
            <button
              onClick={onClose}
              className={`flex-1 py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all border ${
                darkMode
                  ? "border-gray-800 text-gray-500 hover:bg-gray-900 hover:text-white"
                  : "border-gray-100 text-gray-400 hover:bg-gray-50 hover:text-gray-950"
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              form="campaign-form"
              disabled={submitting}
              className={`flex-[2] py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest bg-emerald-600 text-white flex items-center justify-center gap-3 transition-all ${
                submitting
                  ? "opacity-70 cursor-wait"
                  : "hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 active:scale-95"
              }`}
            >
              <Rocket size={16} className={submitting ? "animate-spin" : ""} />
              {submitting
                ? "Submitting..."
                : mode === "create"
                  ? "Launch Project"
                  : "Update Project"}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// Campaign Card Component (Foundation Project)
const CampaignCard = ({
  campaign,
  isOwnCampaign,
  onEdit,
  onRequestDelete,
  onDonate,
  darkMode,
  idx = 0,
}) => {
  const status = getCampaignStatus(campaign);
  const statusConfig = getStatusConfig(status);
  const progress = calculateProgress(
    campaign.raisedAmount || 0,
    campaign.targetAmount,
  );
  const daysLeft = getDaysLeft(campaign.endDate);

  const locationStr =
    typeof campaign.location === "string"
      ? campaign.location
      : `${campaign.location?.city || ""}${campaign.location?.city && campaign.location?.state ? ", " : ""}${campaign.location?.state || ""}`.trim() ||
        "IBADAN";

  const MotionDiv = motion.div;

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.05, duration: 0.5 }}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border transition-all duration-300 ${
        darkMode
          ? "bg-gray-950 border-gray-800 hover:border-emerald-500/50 shadow-2xl shadow-emerald-500/5"
          : "bg-white border-gray-100 shadow-xl shadow-gray-200/20 hover:border-emerald-200"
      }`}
    >
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
        <img
          src={
            campaign.images?.[0]?.url ||
            campaign.image ||
            "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&h=400&auto=format&fit=crop"
          }
          alt={campaign.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        <div className="absolute top-4 left-4 z-20">
          <span
            className={`${statusConfig.bg} ${statusConfig.color} border border-current/10 backdrop-blur-md px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5 shadow-sm`}
          >
            <statusConfig.icon size={12} />
            {statusConfig.label}
          </span>
        </div>

        {campaign.featured && (
          <div className="absolute top-4 right-4 z-20">
            <div className="bg-emerald-500 text-white px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest shadow-lg border border-white/20 flex items-center gap-1.5">
              <TrendingUp size={12} /> Spotlight
            </div>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-5 z-20">
          <div className="flex items-center gap-2 text-white/70 text-[10px] font-bold uppercase tracking-widest mb-2">
            <MapPin size={12} className="text-emerald-400" /> {locationStr}
          </div>
          <h3 className="text-white text-lg font-bold leading-tight line-clamp-2 tracking-tight group-hover:text-emerald-400 transition-colors">
            {campaign.title}
          </h3>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1 space-y-5">
        <div>
          <div className="flex justify-between items-end mb-2">
            <span
              className={`text-[10px] font-bold uppercase tracking-widest ${darkMode ? "text-gray-500" : "text-gray-400"}`}
            >
              Impact Goal
            </span>
            <span className="text-emerald-500 text-xs font-bold">
              {progress.toFixed(0)}%
            </span>
          </div>
          <div
            className={`h-1.5 w-full rounded-full overflow-hidden ${
              darkMode ? "bg-gray-900" : "bg-gray-50"
            }`}
          >
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-emerald-500 rounded-full"
            />
          </div>

          <div className="mt-4 flex justify-between items-center">
            <div className="flex flex-col">
              <span
                className={`text-[9px] font-bold uppercase tracking-widest ${darkMode ? "text-gray-600" : "text-gray-400"}`}
              >
                Raised
              </span>
              <span
                className={`text-base font-bold ${darkMode ? "text-white" : "text-gray-950"}`}
              >
                {formatCurrency(campaign.raisedAmount || 0)}
              </span>
            </div>
            <div className="flex flex-col items-end text-right">
              <span
                className={`text-[9px] font-bold uppercase tracking-widest ${darkMode ? "text-gray-600" : "text-gray-400"}`}
              >
                Target
              </span>
              <span
                className={`text-xs font-semibold ${darkMode ? "text-gray-500" : "text-gray-500"}`}
              >
                {formatCurrency(campaign.targetAmount)}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100/10 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-1.5">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`w-6 h-6 rounded-lg border-2 ${darkMode ? "border-gray-950" : "border-white"} overflow-hidden bg-gray-100 shadow-sm`}
                  >
                    <img
                      src={`https://i.pravatar.cc/100?u=${campaign._id}_${i}`}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <span
                className={`text-[9px] font-bold uppercase tracking-widest ${darkMode ? "text-gray-600" : "text-gray-400"}`}
              >
                {campaign.donors || 0}+ Supporters
              </span>
            </div>
            <div
              className={`flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest ${daysLeft > 0 ? "text-emerald-500" : "text-rose-500"}`}
            >
              <Clock size={10} /> {daysLeft > 0 ? `${daysLeft}D` : "Ended"}
            </div>
          </div>

          <div className="flex gap-2">
            {isOwnCampaign ? (
              <>
                <button
                  onClick={() => onEdit(campaign)}
                  className={`flex-1 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all border ${
                    darkMode
                      ? "border-gray-800 text-gray-500 hover:text-white"
                      : "border-gray-100 text-gray-400 hover:text-gray-950"
                  }`}
                >
                  Edit Project
                </button>
                <button
                  onClick={() => onRequestDelete(campaign)}
                  className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all bg-rose-500/5 text-rose-500/50 hover:text-rose-500 hover:bg-rose-500/10 border border-rose-500/10`}
                  title="Remove Project"
                >
                  <Trash2 size={16} />
                </button>
              </>
            ) : (
              <>
                <Link
                  to={`/campaigns/${campaign._id || campaign.id}`}
                  className="flex-1 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest bg-emerald-600 text-white hover:bg-emerald-700 text-center transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
                >
                  Learn More
                </Link>
                {status === "active" && campaign.approved && (
                  <button
                    onClick={() => onDonate(campaign)}
                    className="w-11 h-11 rounded-xl flex items-center justify-center transition-all bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-100"
                    title="Quick Donate"
                  >
                    <Heart size={16} />
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </MotionDiv>
  );
};

// Main Component
const EMPTY_ARRAY = [];

const MyCampaigns = () => {
  const dispatch = useDispatch();
  const { darkMode } = useTheme();
  const { user } = useSelector((state) => state.auth);
  const userCampaignsState = useSelector((state) => state.userCampaigns);
  const location = useLocation();
  const navigate = useNavigate();

  const allCampaigns = userCampaignsState?.allCampaigns || EMPTY_ARRAY;
  const myCampaigns = userCampaignsState?.myCampaigns || EMPTY_ARRAY;
  const loading = userCampaignsState?.loading || false;

  const [tab, setTab] = useState("my");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("created-desc");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState(null);

  const userId = user?.id || user?._id || user?.sub;

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserCampaigns({}));
    }
  }, [dispatch, userId]);

  // Handle auto-open modal from navigation state
  useEffect(() => {
    if (location.state?.openCreateModal) {
      setModalMode("create");
      setIsModalOpen(true);
      // Clear state to prevent reopening on refresh (optional but good practice)
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const displayCampaigns = useMemo(
    () => (tab === "my" ? myCampaigns : allCampaigns),
    [tab, myCampaigns, allCampaigns],
  );

  const handleCampaignSubmit = useCallback(
    async (formData, campaignId = null) => {
      try {
        if (campaignId) {
          await dispatch(
            updateUserCampaign({ id: campaignId, campaignData: formData }),
          ).unwrap();
          toast.success("Project Details Updated", {
            style: {
              borderRadius: "1rem",
              background: "#333",
              color: "#fff",
              fontFamily: "black",
              textTransform: "uppercase",
              fontSize: "10px",
              letterSpacing: "0.2em",
            },
          });
        } else {
          await dispatch(createUserCampaign(formData)).unwrap();
          toast.success("Project Submitted for Review", {
            style: {
              borderRadius: "1rem",
              background: "#333",
              color: "#fff",
              fontFamily: "black",
              textTransform: "uppercase",
              fontSize: "10px",
              letterSpacing: "0.2em",
            },
          });
        }
        setIsModalOpen(false);
      } catch (err) {
        toast.error(err || "Process Failed");
      }
    },
    [dispatch],
  );

  // Added handleConfirmDelete to fix missing function bug
  const handleConfirmDelete = useCallback(async () => {
    if (!campaignToDelete) return;
    try {
      await dispatch(
        deleteUserCampaign(campaignToDelete._id || campaignToDelete.id),
      ).unwrap();
      toast.success("Project Removed Successfully");
      setShowDeleteModal(false);
      setCampaignToDelete(null);
    } catch (err) {
      toast.error(err || "Removal Protocol Failed");
    }
  }, [dispatch, campaignToDelete]);

  const stats = useMemo(() => {
    const active = myCampaigns.filter(
      (c) => getCampaignStatus(c) === "active",
    ).length;
    const pending = myCampaigns.filter(
      (c) => !c.approved || c.status === "pending",
    ).length;
    const raised = myCampaigns
      .filter((c) => c.approved)
      .reduce((sum, c) => sum + (c.raisedAmount || 0), 0);
    return { total: myCampaigns.length, active, pending, raised };
  }, [myCampaigns]);

  const filteredAndSortedCampaigns = useMemo(() => {
    let filtered = [...displayCampaigns];
    if (statusFilter !== "all") {
      filtered = filtered.filter((c) => getCampaignStatus(c) === statusFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (c) =>
          c.title?.toLowerCase().includes(q) ||
          c.category?.toLowerCase().includes(q),
      );
    }
    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt || a.createdDate);
      const dateB = new Date(b.createdAt || b.createdDate);
      if (sortBy === "created-desc") return dateB - dateA;
      if (sortBy === "created-asc") return dateA - dateB;
      return 0;
    });
    return filtered;
  }, [displayCampaigns, statusFilter, searchQuery, sortBy]);

  if (loading && !displayCampaigns.length) {
    return (
      <div className="space-y-16 animate-pulse p-10 max-w-[1700px] mx-auto">
        <div className="h-32 w-1/2 bg-gray-900 rounded-[3rem]" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-64 bg-gray-900 rounded-[3rem]" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-[600px] bg-gray-900 rounded-[4rem]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-500 pb-12 pt-10 px-4 sm:px-6 lg:px-8 ${
        darkMode ? "bg-gray-950 text-white" : "bg-gray-50 text-gray-950"
      }`}
    >
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-8"
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-1 bg-emerald-500 rounded-full" />
              <span
                className={`text-[10px] font-bold uppercase tracking-widest ${darkMode ? "text-gray-500" : "text-gray-400"}`}
              >
                Foundation Hub • Project Center
              </span>
            </div>
            <h1
              className={`text-3xl lg:text-4xl font-bold tracking-tight ${
                darkMode ? "text-white" : "text-gray-950"
              }`}
            >
              Impact Dashboard
            </h1>
            <p
              className={`mt-4 text-sm font-semibold max-w-2xl leading-relaxed ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Manage your community projects, track real-time impact, and
              connect with supporters.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <div className="flex bg-gray-900/5 p-1 rounded-xl">
              {[
                { id: "my", label: "My Missions" },
                { id: "all", label: "Public Feed" },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`px-6 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                    tab === t.id
                      ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                      : darkMode
                        ? "text-gray-500 hover:text-white"
                        : "text-gray-400 hover:text-gray-950"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <button
                onClick={() => {
                  setModalMode("create");
                  setSelectedCampaign(null);
                  setIsModalOpen(true);
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-emerald-500/20 active:scale-95 transition-all flex items-center gap-3"
              >
                <Plus size={16} /> Launch Project
              </button>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        {tab === "my" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <BusinessStat
              title="Active Missions"
              value={stats.active}
              subtitle="Live project protocols"
              icon={Rocket}
              color="text-emerald-500"
              darkMode={darkMode}
              delay={0.1}
            />
            <BusinessStat
              title="Under Review"
              value={stats.pending}
              subtitle="Verification in progress"
              icon={Shield}
              color="text-amber-500"
              darkMode={darkMode}
              delay={0.2}
            />
            <BusinessStat
              title="Total Impact"
              value={formatCurrency(stats.raised)}
              subtitle="Verified contributions"
              icon={Wallet}
              color="text-blue-500"
              darkMode={darkMode}
              delay={0.3}
            />
            <BusinessStat
              title="Success Target"
              value={stats.total}
              subtitle="Initiated projects"
              icon={Target}
              color="text-purple-500"
              darkMode={darkMode}
              delay={0.4}
            />
          </div>
        )}

        {/* Main Interface */}
        <div className="space-y-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-gray-100/10">
            <div className="flex flex-wrap gap-4 w-full">
              <div className="relative group flex-1">
                <Search
                  size={18}
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-500 transition-transform group-focus-within:scale-110"
                />
                <input
                  type="text"
                  placeholder="Search mission projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-14 pr-6 py-4 rounded-xl border-2 font-bold text-[11px] uppercase tracking-widest outline-none transition-all ${
                    darkMode
                      ? "bg-gray-900/50 border-gray-800 text-white focus:border-emerald-500/50"
                      : "bg-white border-gray-100 text-gray-950 focus:border-emerald-500/50"
                  }`}
                />
              </div>

              <div className="flex gap-4">
                <div className="relative group">
                  <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500 pointer-events-none" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className={`pl-6 pr-12 py-4 rounded-xl border-2 font-bold text-[10px] uppercase tracking-widest outline-none appearance-none cursor-pointer transition-all ${
                      darkMode
                        ? "bg-gray-900/50 border-gray-800 text-gray-400 focus:text-white focus:border-emerald-500/50"
                        : "bg-white border-gray-100 text-gray-500 focus:text-gray-950 focus:border-emerald-500/50"
                    }`}
                  >
                    <option value="all">All Channels</option>
                    <option value="active">Active Projects</option>
                    <option value="pending">Under Review</option>
                    <option value="rejected">Cancelled</option>
                  </select>
                </div>

                <div className="relative group">
                  <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500 pointer-events-none" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className={`pl-6 pr-12 py-4 rounded-xl border-2 font-bold text-[10px] uppercase tracking-widest outline-none appearance-none cursor-pointer transition-all ${
                      darkMode
                        ? "bg-gray-900/50 border-gray-800 text-gray-400 focus:text-white focus:border-emerald-500/50"
                        : "bg-white border-gray-100 text-gray-500 focus:text-gray-950 focus:border-emerald-500/50"
                    }`}
                  >
                    <option value="created-desc">Newest First</option>
                    <option value="created-asc">Oldest First</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {filteredAndSortedCampaigns.length > 0 ? (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filteredAndSortedCampaigns.map((c, i) => (
                  <CampaignCard
                    key={c._id || c.id}
                    idx={i}
                    campaign={c}
                    isOwnCampaign={
                      c.createdBy?._id === userId || c.createdBy === userId
                    }
                    onEdit={(selectedC) => {
                      setSelectedCampaign(selectedC);
                      setModalMode("edit");
                      setIsModalOpen(true);
                    }}
                    onRequestDelete={(selectedC) => {
                      setCampaignToDelete(selectedC);
                      setShowDeleteModal(true);
                    }}
                    onDonate={() =>
                      navigate(`/campaigns/${c._id || c.id}/donate`)
                    }
                    darkMode={darkMode}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`py-32 flex flex-col items-center justify-center rounded-3xl border-2 border-dashed ${
                  darkMode
                    ? "border-gray-800 bg-gray-900/20"
                    : "border-gray-100 bg-gray-50/50"
                }`}
              >
                <div className="w-20 h-20 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-8 border border-emerald-500/20">
                  <Rocket className="w-10 h-10 text-emerald-500 opacity-50" />
                </div>
                <h3
                  className={`text-xl font-bold tracking-tight mb-3 ${darkMode ? "text-white" : "text-gray-950"}`}
                >
                  No active missions found
                </h3>
                <p
                  className={`text-sm font-semibold mb-10 max-w-sm text-center ${darkMode ? "text-gray-500" : "text-gray-400"}`}
                >
                  Your impact journey starts here. Launch your first community
                  project or support existing initiatives.
                </p>
                <button
                  onClick={() => {
                    setModalMode("create");
                    setIsModalOpen(true);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
                >
                  Launch Primary Mission
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* CTA Section */}
        <div className="mt-24 mb-12 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-8 border border-emerald-500/20">
            <Zap size={28} className="text-emerald-500" />
          </div>
          <h3
            className={`text-2xl font-bold tracking-tight mb-4 ${
              darkMode ? "text-white" : "text-gray-950"
            }`}
          >
            Strategic Impact Oversight
          </h3>
          <p
            className={`text-sm font-medium mb-10 max-w-xl mx-auto leading-relaxed ${
              darkMode ? "text-gray-500" : "text-gray-400"
            }`}
          >
            Request comprehensive data reports on your campaign performance and
            impact metrics across the community.
          </p>
          <Link
            to="/contact?subject=Impact Report"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-emerald-500/20 active:scale-95 transition-all flex items-center gap-3"
          >
            <TrendingUp size={16} /> Access Impact Analytics
          </Link>
        </div>
      </div>

      <CampaignModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCampaignSubmit}
        darkMode={darkMode}
        mode={modalMode}
        campaign={selectedCampaign}
      />

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        campaign={campaignToDelete}
        darkMode={darkMode}
      />
    </div>
  );
};

export default MyCampaigns;
