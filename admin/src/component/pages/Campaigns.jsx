// admin/src/component/pages/Campaigns.jsx — Clerk-Style UI
import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  X,
  Upload,
  Target,
  Activity,
  Users,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Clock,
  XCircle,
  Eye,
  ShieldCheck,
  ShieldX,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import {
  fetchCampaigns,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  approveCampaign,
} from "../../features/campaign/adminCampaignSlice";
import { StatsCard } from "../shared";

const getStatusConfig = (status) => {
  const configs = {
    pending: {
      label: "Pending",
      color: "text-amber-600",
      bg: "bg-amber-50 dark:bg-amber-950/20",
      border: "border-amber-200 dark:border-amber-900/40",
      icon: Clock,
    },
    active: {
      label: "Active",
      color: "text-primary-600",
      bg: "bg-primary-50 dark:bg-primary-950/20",
      border: "border-primary-200 dark:border-primary-900/40",
      icon: CheckCircle2,
    },
    rejected: {
      label: "Rejected",
      color: "text-red-600",
      bg: "bg-red-50 dark:bg-red-950/20",
      border: "border-red-200 dark:border-red-900/40",
      icon: XCircle,
    },
    completed: {
      label: "Completed",
      color: "text-emerald-600",
      bg: "bg-emerald-50 dark:bg-emerald-950/20",
      border: "border-emerald-200 dark:border-emerald-900/40",
      icon: CheckCircle2,
    },
  };
  return configs[status] || configs.pending;
};

// ── Reusable form field ───────────────────────────────────────────────────────
const Field = ({ label, darkMode, children }) => (
  <div>
    <label className={`block text-xs font-medium mb-1.5 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
      {label}
    </label>
    {children}
  </div>
);

const inputCls = (darkMode) =>
  `w-full min-w-0 px-3 py-2.5 rounded-lg border text-sm outline-none transition-all ${
    darkMode
      ? "bg-gray-800/60 border-gray-700/60 text-white placeholder-gray-500 focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/20"
      : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-primary-400 focus:ring-1 focus:ring-primary-400/20"
  }`;

const Campaigns = () => {
  const { darkMode } = useTheme();
  const dispatch = useDispatch();

  const { campaigns, loading } = useSelector((s) => s.adminCampaigns);
  const adminUser = useSelector((s) => s.adminAuth?.admin || s.adminAuth?.user);
  const adminId = adminUser?._id || adminUser?.id;

  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [campaignToReject, setCampaignToReject] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [approving, setApproving] = useState(null);

  const emptyForm = {
    title: "", description: "", shortDescription: "",
    category: "education", location: "", target: "",
    startDate: "", endDate: "", beneficiariesTarget: "",
    currency: "NGN", featured: false, urgent: false, tags: "",
  };
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    dispatch(fetchCampaigns({
      category: filterCategory === "all" ? "" : filterCategory,
      search: searchQuery,
    }));
  }, [dispatch, filterCategory, searchQuery]);

  const stats = useMemo(() => {
    const total = campaigns.length;
    const active = campaigns.filter((c) => c.status === "active").length;
    const pending = campaigns.filter((c) => c.status === "pending").length;
    const totalRaised = campaigns
      .filter((c) => c.status === "active")
      .reduce((sum, c) => sum + (c.raisedAmount || 0), 0);
    return [
      { label: "Total Campaigns", value: total.toString(), subtitle: "All campaigns", icon: Target, bgColor: "from-primary-600 to-primary-700" },
      { label: "Active Campaigns", value: active.toString(), subtitle: "Currently running", icon: Activity, bgColor: "from-primary-500 to-primary-600" },
      { label: "Pending Review", value: pending.toString(), subtitle: "Awaiting approval", icon: Clock, bgColor: "from-amber-500 to-orange-600" },
      { label: "Total Raised", value: `₦${(totalRaised / 1000000).toFixed(1)}M`, subtitle: "Funds collected", icon: DollarSign, bgColor: "from-primary-700 to-primary-800" },
    ];
  }, [campaigns]);

  const fmt = (n) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(n);
  const pct = (raised, target) => Math.min(Math.round(((raised || 0) / (target || 1)) * 100), 100);

  const filtered = useMemo(() => {
    let r = [...campaigns];
    if (searchQuery) r = r.filter((c) => c.title.toLowerCase().includes(searchQuery.toLowerCase()));
    if (filterCategory !== "all") r = r.filter((c) => c.category === filterCategory);
    if (statusFilter !== "all") {
      if (statusFilter === "pending") r = r.filter((c) => c.status === "pending" || !c.approved);
      else if (statusFilter === "active") r = r.filter((c) => c.status === "active" && c.approved);
      else r = r.filter((c) => c.status === statusFilter);
    }
    return r;
  }, [campaigns, searchQuery, filterCategory, statusFilter]);

  const openModal = (mode, campaign = null) => {
    setModalMode(mode);
    setSelectedCampaign(campaign);
    if (mode === "edit" && campaign) {
      setFormData({
        title: campaign.title || "",
        description: campaign.description || "",
        shortDescription: campaign.shortDescription || "",
        category: campaign.category || "education",
        location: campaign.location?.city || campaign.location?.state
          ? `${campaign.location.city || ""}, ${campaign.location.state || ""}`.trim().replace(/^,\s*|,\s*$/g, "")
          : "",
        target: campaign.targetAmount?.toString() || "",
        startDate: campaign.startDate ? campaign.startDate.split("T")[0] : "",
        endDate: campaign.endDate ? campaign.endDate.split("T")[0] : "",
        beneficiariesTarget: campaign.beneficiaries?.target?.toString() || "",
        currency: campaign.currency || "NGN",
        featured: campaign.featured || false,
        urgent: campaign.urgent || false,
        tags: Array.isArray(campaign.tags) ? campaign.tags.join(", ") : "",
      });
    } else {
      setFormData(emptyForm);
    }
    setImageFiles([]);
    setImagePreviews([]);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCampaign(null);
    setImageFiles([]);
    setImagePreviews([]);
  };

  const handleInput = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "target") {
      // Strip commas so raw numeric value is stored
      const raw = value.replace(/,/g, "");
      if (raw === "" || /^\d+$/.test(raw)) {
        setFormData((p) => ({ ...p, target: raw }));
      }
      return;
    }
    setFormData((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 3) { alert("Maximum 3 images allowed"); return; }
    setImageFiles(files);
    setImagePreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const confirmDelete = async () => {
    if (!campaignToDelete) return;
    setDeleting(true);
    try {
      await dispatch(deleteCampaign(campaignToDelete.id)).unwrap();
      setShowDeleteModal(false);
      setCampaignToDelete(null);
    } catch (err) { console.error(err); }
    finally { setDeleting(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = { ...formData, imageFiles };
      if (modalMode === "create") {
        await dispatch(createCampaign(data)).unwrap();
      } else {
        await dispatch(updateCampaign({ id: selectedCampaign._id || selectedCampaign.id, campaignData: data })).unwrap();
      }
      closeModal();
    } catch (err) { console.error(err); }
    finally { setSubmitting(false); }
  };

  const handleApprove = async (id) => {
    setApproving(id);
    try { await dispatch(approveCampaign({ id, status: "active" })).unwrap(); }
    finally { setApproving(null); }
  };

  const handleReject = async () => {
    if (!campaignToReject) return;
    setApproving(campaignToReject._id);
    try {
      await dispatch(approveCampaign({ id: campaignToReject._id, status: "rejected" })).unwrap();
      setShowRejectModal(false);
      setCampaignToReject(null);
    } finally { setApproving(null); }
  };

  const pendingCount = campaigns.filter((c) => c.status === "pending" || !c.approved).length;

  // ── Shared card base ─────────────────────────────────────────────────────
  const cardBase = `rounded-xl border ${darkMode ? "bg-dark-lighter border-gray-800/70" : "bg-white border-gray-200/80 shadow-sm"}`;
  const modalBase = `rounded-xl border shadow-xl ${darkMode ? "bg-[#111] border-gray-800" : "bg-white border-gray-200"}`;

  return (
    <div className="space-y-6 pb-10">

      {/* ── Page Header ──────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-xl font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
            Campaigns
          </h1>
          <p className={`text-sm mt-0.5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            {campaigns.length} total · {pendingCount > 0 && <span className="text-amber-500 font-medium">{pendingCount} pending review</span>}
          </p>
        </div>
        <button
          onClick={() => openModal("create")}
          className="px-3 py-2 rounded-lg bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium flex items-center gap-1.5 transition-all shadow-sm"
        >
          <Plus size={15} /> Create Campaign
        </button>
      </div>

      {/* ── Stats ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => <StatsCard key={i} {...s} index={i} />)}
      </div>

      {/* ── Filters ──────────────────────────────────────────────────── */}
      <div className={`${cardBase} p-4`}>
        <div className="flex flex-col sm:flex-row gap-3 mb-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? "text-gray-500" : "text-gray-400"}`} size={15} />
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`${inputCls(darkMode)} pl-9`}
            />
          </div>
          {/* Category */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className={inputCls(darkMode)}
          >
            <option value="all">All Categories</option>
            <option value="education">Education</option>
            <option value="health">Health</option>
            <option value="poverty">Poverty Relief</option>
            <option value="infrastructure">Infrastructure</option>
            <option value="emergency">Emergency Relief</option>
          </select>
        </div>

        {/* Status tabs */}
        <div className="flex flex-wrap gap-1.5">
          {[
            { key: "all", label: "All" },
            { key: "pending", label: `Pending (${pendingCount})` },
            { key: "active", label: "Active" },
            { key: "completed", label: "Completed" },
            { key: "rejected", label: "Rejected" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                statusFilter === tab.key
                  ? tab.key === "pending"
                    ? "bg-amber-500 text-white"
                    : tab.key === "rejected"
                    ? "bg-red-500 text-white"
                    : "bg-primary-500 text-white"
                  : darkMode
                  ? "bg-gray-800/60 text-gray-400 hover:text-white border border-gray-700/50"
                  : "bg-gray-100 text-gray-500 hover:text-gray-800 border border-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Campaign Grid ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <AnimatePresence mode="wait">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className={`h-80 rounded-xl animate-pulse ${darkMode ? "bg-gray-800/60" : "bg-gray-100"}`}
              />
            ))
          ) : filtered.length > 0 ? (
            filtered.map((campaign, i) => {
              const p = pct(campaign.raisedAmount, campaign.targetAmount);
              const sc = getStatusConfig(campaign.status);
              const img = campaign.images?.find((x) => x.isPrimary) || campaign.images?.[0];
              const isOwner = adminId && (campaign.createdBy?._id === adminId || campaign.createdBy === adminId);
              const isPending = campaign.status === "pending" || !campaign.approved;

              return (
                <motion.div
                  key={campaign._id || campaign.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={`group flex flex-col overflow-hidden rounded-xl border transition-all hover:shadow-md ${
                    darkMode
                      ? "bg-dark-lighter border-gray-800/70 hover:border-gray-700"
                      : "bg-white border-gray-200/80 shadow-sm hover:border-gray-300"
                  }`}
                >
                  {/* Image */}
                  <div className="relative h-40 overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <img
                      src={img?.url || "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&fit=crop"}
                      alt={campaign.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Status badge */}
                    <div className="absolute top-2.5 left-2.5">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold border ${sc.bg} ${sc.color} ${sc.border}`}>
                        <sc.icon size={11} />{sc.label}
                      </span>
                    </div>
                    {/* Hover actions */}
                    <div className="absolute top-2.5 right-2.5 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      {isOwner && (
                        <button
                          onClick={() => openModal("edit", campaign)}
                          className="p-1.5 bg-white/95 rounded-lg hover:bg-white shadow-sm"
                          title="Edit campaign"
                        >
                          <Edit size={13} className="text-gray-700" />
                        </button>
                      )}
                      <a
                        href={`/campaigns/${campaign._id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 bg-white/95 rounded-lg hover:bg-white shadow-sm"
                        title="View live"
                      >
                        <Eye size={13} className="text-gray-700" />
                      </a>
                      <button
                        onClick={() => { setCampaignToDelete({ id: campaign._id, title: campaign.title }); setShowDeleteModal(true); }}
                        className="p-1.5 bg-red-500 rounded-lg hover:bg-red-600 shadow-sm"
                        title="Delete"
                      >
                        <Trash2 size={13} className="text-white" />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 flex flex-col flex-1 gap-3">
                    <div>
                      <h3 className={`text-sm font-semibold leading-snug line-clamp-2 mb-1 ${darkMode ? "text-white" : "text-gray-900"}`}>
                        {campaign.title}
                      </h3>
                      <p className={`text-xs capitalize ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                        {campaign.category}
                      </p>
                    </div>

                    {/* Progress */}
                    <div className="space-y-1.5">
                      <div className="flex items-baseline justify-between">
                        <span className={`text-sm font-semibold ${darkMode ? "text-primary-400" : "text-primary-600"}`}>
                          {fmt(campaign.raisedAmount || 0)}
                        </span>
                        <span className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>{p}%</span>
                      </div>
                      <div className={`h-1.5 w-full rounded-full overflow-hidden ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}>
                        <div
                          className="h-full bg-primary-500 rounded-full transition-all duration-700"
                          style={{ width: `${p}%` }}
                        />
                      </div>
                      <p className={`text-[11px] ${darkMode ? "text-gray-600" : "text-gray-400"}`}>
                        Goal: {fmt(campaign.targetAmount || 0)}
                      </p>
                    </div>

                    {/* Actions */}
                    {isPending ? (
                      <div className={`mt-auto pt-3 border-t ${darkMode ? "border-gray-800/60" : "border-gray-100"} space-y-2`}>
                        <p className="text-[11px] font-medium text-amber-500 flex items-center gap-1">
                          <Clock size={10} className="animate-pulse" /> Awaiting admin approval
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => handleApprove(campaign._id)}
                            disabled={approving === campaign._id}
                            className="py-2 rounded-lg bg-primary-500 hover:bg-primary-600 text-white text-xs font-medium transition-all flex items-center justify-center gap-1.5 disabled:opacity-60"
                          >
                            {approving === campaign._id ? (
                              <><span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> Approving...</>
                            ) : (
                              <><ShieldCheck size={12} /> Approve</>
                            )}
                          </button>
                          <button
                            onClick={() => { setCampaignToReject(campaign); setShowRejectModal(true); }}
                            disabled={approving === campaign._id}
                            className="py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-xs font-medium transition-all flex items-center justify-center gap-1.5 disabled:opacity-60"
                          >
                            <ShieldX size={12} /> Reject
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className={`mt-auto pt-3 border-t flex items-center justify-between ${darkMode ? "border-gray-800/60" : "border-gray-100"}`}>
                        <div className="flex items-center gap-1.5">
                          <Users size={13} className="text-primary-500" />
                          <span className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                            {campaign.donorCount || 0} donors
                          </span>
                        </div>
                        <Link
                          to={`/admin/campaigns/${campaign._id}`}
                          className={`p-1.5 rounded-lg transition-all ${darkMode ? "text-gray-400 hover:text-white hover:bg-gray-800" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"}`}
                          title="View details"
                        >
                          <ExternalLink size={14} />
                        </Link>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="col-span-full py-20 text-center">
              <Target size={36} className={`mx-auto mb-3 ${darkMode ? "text-gray-600" : "text-gray-300"}`} />
              <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>No campaigns found</p>
              <p className={`text-xs mt-1 ${darkMode ? "text-gray-600" : "text-gray-400"}`}>
                {searchQuery || filterCategory !== "all" ? "Try adjusting your filters" : "Create your first campaign to get started"}
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Delete Modal ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {showDeleteModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => !deleting && setShowDeleteModal(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className={`w-full max-w-sm ${modalBase} p-6`}>
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-9 h-9 rounded-lg bg-red-50 dark:bg-red-950/30 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle size={18} className="text-red-600" />
                  </div>
                  <div>
                    <h3 className={`text-sm font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>Delete Campaign?</h3>
                    <p className={`text-xs mt-0.5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                      This will permanently delete <span className="font-medium text-red-600">"{campaignToDelete?.title}"</span> and all associated data.
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setShowDeleteModal(false); setCampaignToDelete(null); }}
                    disabled={deleting}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${darkMode ? "border-gray-700 text-gray-300 hover:bg-gray-800" : "border-gray-200 text-gray-700 hover:bg-gray-50"}`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    disabled={deleting}
                    className="flex-1 py-2 rounded-lg text-sm font-medium bg-red-600 hover:bg-red-700 text-white transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
                  >
                    {deleting ? <><span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Deleting...</> : "Delete"}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Reject Modal ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {showRejectModal && campaignToReject && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => { setShowRejectModal(false); setCampaignToReject(null); }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className={`w-full max-w-sm ${modalBase} p-6`}>
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-9 h-9 rounded-lg bg-red-50 dark:bg-red-950/30 flex items-center justify-center flex-shrink-0">
                    <ShieldX size={18} className="text-red-600" />
                  </div>
                  <div>
                    <h3 className={`text-sm font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>Reject Campaign?</h3>
                    <p className={`text-xs mt-0.5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                      <span className="font-medium text-red-600">"{campaignToReject.title}"</span> will not go live. The creator will be notified.
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setShowRejectModal(false); setCampaignToReject(null); }}
                    disabled={!!approving}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${darkMode ? "border-gray-700 text-gray-300 hover:bg-gray-800" : "border-gray-200 text-gray-700 hover:bg-gray-50"}`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReject}
                    disabled={!!approving}
                    className="flex-1 py-2 rounded-lg text-sm font-medium bg-red-600 hover:bg-red-700 text-white transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
                  >
                    {approving ? <><span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Rejecting...</> : <><ShieldX size={13} /> Reject</>}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Create / Edit Modal ───────────────────────────────────────── */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => !submitting && closeModal()}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 20 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto"
            >
              <div className={`relative w-full max-w-3xl my-8 min-w-0 overflow-hidden ${modalBase}`}>

                {/* ── Header ──────────────────────────────────────────── */}
                <div className={`px-7 py-5 border-b flex items-center justify-between gap-4 ${
                  darkMode ? "border-gray-800" : "border-gray-100"
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${
                      darkMode ? "bg-primary-500/10" : "bg-primary-50"
                    }`}>
                      <Target size={18} className="text-primary-500" />
                    </div>
                    <div>
                      <h2 className={`text-base font-bold tracking-tight ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}>
                        {modalMode === "create" ? "Create Campaign" : "Edit Campaign"}
                      </h2>
                      <p className={`text-xs mt-0.5 ${
                        darkMode ? "text-gray-500" : "text-gray-400"
                      }`}>
                        {modalMode === "create" ? "Add a new fundraising campaign" : "Update campaign details"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={closeModal}
                    disabled={submitting}
                    className={`p-2 rounded-lg transition-colors shrink-0 ${
                      darkMode
                        ? "text-gray-400 hover:bg-gray-800 hover:text-white"
                        : "text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                    }`}
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* ── Form ────────────────────────────────────────────── */}
                <form onSubmit={handleSubmit} className="px-7 py-6 space-y-6 max-h-[68vh] overflow-y-auto overflow-x-hidden">

                  {/* Campaign Title */}
                  <Field label="Campaign Title *" darkMode={darkMode}>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInput}
                      required
                      placeholder="e.g., Help Build a School in Sabo, Ibadan"
                      className={inputCls(darkMode)}
                      style={{ wordBreak: "break-word", overflowWrap: "break-word" }}
                    />
                  </Field>

                  {/* Category + Target */}
                  <div className={`p-4 rounded-xl border ${
                    darkMode ? "border-gray-800 bg-gray-900/40" : "border-gray-100 bg-gray-50/60"
                  } space-y-4`}>
                    <p className={`text-[10px] font-bold uppercase tracking-widest ${
                      darkMode ? "text-gray-500" : "text-gray-400"
                    }`}>Fundraising Details</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="Category *" darkMode={darkMode}>
                        <select name="category" value={formData.category} onChange={handleInput} required className={inputCls(darkMode)}>
                          <option value="education">Education</option>
                          <option value="health">Health</option>
                          <option value="poverty">Poverty Relief</option>
                          <option value="infrastructure">Infrastructure</option>
                          <option value="emergency">Emergency Relief</option>
                          <option value="basic needs">Basic Needs</option>
                          <option value="empowerment">Empowerment</option>
                          <option value="food relief">Food Relief</option>
                          <option value="sports">Sports</option>
                          <option value="welfare">Welfare</option>
                          <option value="other">Other</option>
                        </select>
                      </Field>

                      {/* Naira-formatted amount */}
                      <Field label="Target Amount (₦) *" darkMode={darkMode}>
                        <div className="relative min-w-0">
                          <span className={`absolute left-3 top-1/2 -translate-y-1/2 font-bold text-sm select-none ${
                            darkMode ? "text-primary-400" : "text-primary-600"
                          }`}>₦</span>
                          <input
                            type="text"
                            name="target"
                            inputMode="numeric"
                            value={formData.target ? Number(formData.target).toLocaleString("en-NG") : ""}
                            onChange={handleInput}
                            required
                            placeholder="e.g. 500,000"
                            className={`${inputCls(darkMode)} pl-7`}
                          />
                        </div>
                        {formData.target && Number(formData.target) >= 1000 && (
                          <p className="text-[10px] text-primary-500 font-semibold mt-1">
                            Goal: ₦{Number(formData.target).toLocaleString("en-NG")}
                          </p>
                        )}
                      </Field>
                    </div>
                  </div>

                  {/* Descriptions */}
                  <div className="space-y-4">
                    <Field label="Short Description" darkMode={darkMode}>
                      <input
                        type="text"
                        name="shortDescription"
                        value={formData.shortDescription}
                        onChange={handleInput}
                        placeholder="Brief one-liner shown on campaign cards (optional)"
                        maxLength={200}
                        className={inputCls(darkMode)}
                      />
                      <p className={`text-[10px] mt-1 ${
                        darkMode ? "text-gray-600" : "text-gray-400"
                      }`}>{formData.shortDescription.length}/200 characters</p>
                    </Field>

                    <Field label="Full Description *" darkMode={darkMode}>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInput}
                        required
                        rows={5}
                        placeholder="Describe your campaign in detail — who it helps, how funds will be used, and why it matters..."
                        className={`${inputCls(darkMode)} resize-y break-words`}
                        style={{ wordBreak: "break-word", overflowWrap: "break-word" }}
                      />
                      <p className={`text-[10px] mt-1 ${
                        darkMode ? "text-gray-600" : "text-gray-400"
                      }`}>{formData.description.length}/2000 characters</p>
                    </Field>
                  </div>

                  {/* Location + Beneficiaries */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Location" darkMode={darkMode}>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInput}
                        placeholder="e.g., Ibadan, Oyo State"
                        className={inputCls(darkMode)}
                      />
                    </Field>
                    <Field label="Beneficiaries Target" darkMode={darkMode}>
                      <input
                        type="number"
                        name="beneficiariesTarget"
                        value={formData.beneficiariesTarget}
                        onChange={handleInput}
                        placeholder="Number of beneficiaries"
                        min="1"
                        className={inputCls(darkMode)}
                      />
                    </Field>
                  </div>

                  {/* Dates */}
                  <div className={`p-4 rounded-xl border ${
                    darkMode ? "border-gray-800 bg-gray-900/40" : "border-gray-100 bg-gray-50/60"
                  } space-y-4`}>
                    <p className={`text-[10px] font-bold uppercase tracking-widest ${
                      darkMode ? "text-gray-500" : "text-gray-400"
                    }`}>Campaign Duration</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="Start Date" darkMode={darkMode}>
                        <input
                          type="date"
                          name="startDate"
                          value={formData.startDate}
                          onChange={handleInput}
                          className={`${inputCls(darkMode)} cursor-pointer ${
                            darkMode ? "[color-scheme:dark]" : "[color-scheme:light]"
                          }`}
                        />
                      </Field>
                      <Field label="End Date" darkMode={darkMode}>
                        <input
                          type="date"
                          name="endDate"
                          value={formData.endDate}
                          min={formData.startDate || undefined}
                          onChange={handleInput}
                          className={`${inputCls(darkMode)} cursor-pointer ${
                            darkMode ? "[color-scheme:dark]" : "[color-scheme:light]"
                          }`}
                        />
                      </Field>
                    </div>
                  </div>

                  {/* Images */}
                  <Field label="Campaign Images (Max 3)" darkMode={darkMode}>
                    <div className="flex flex-wrap gap-3 mt-2">
                      <label className={`w-20 h-20 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${
                        darkMode
                          ? "border-gray-700 hover:border-primary-500/60 hover:bg-primary-500/5"
                          : "border-gray-200 hover:border-primary-400 hover:bg-primary-50"
                      }`}>
                        <Upload size={16} className="text-primary-500 mb-1" />
                        <span className={`text-[10px] font-semibold ${
                          darkMode ? "text-gray-500" : "text-gray-400"
                        }`}>Upload</span>
                        <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
                      </label>
                      {imagePreviews.map((src, idx) => (
                        <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden group shadow-sm">
                          <img src={src} alt="" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => {
                              setImageFiles((p) => p.filter((_, i) => i !== idx));
                              setImagePreviews((p) => p.filter((_, i) => i !== idx));
                            }}
                            className="absolute inset-0 bg-red-600/80 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                      {modalMode === "edit" && imagePreviews.length === 0 && selectedCampaign?.images?.map((img, idx) => (
                        <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border ${
                          darkMode ? 'border-gray-700' : 'border-gray-200'
                        }">
                          <img src={img.url} alt="" className="w-full h-full object-cover opacity-70" />
                          <div className="absolute inset-0 flex items-end justify-center pb-1">
                            <span className="text-[9px] text-white font-bold bg-black/50 px-1.5 py-0.5 rounded">Current</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Field>

                  {/* Flags */}
                  <div className={`flex gap-6 p-4 rounded-xl border ${
                    darkMode ? "border-gray-800 bg-gray-900/30" : "border-gray-100 bg-gray-50"
                  }`}>
                    {[
                      { name: "featured", label: "Featured", desc: "Shown prominently on homepage" },
                      { name: "urgent", label: "Urgent", desc: "Marked with urgent badge" },
                    ].map(({ name, label, desc }) => (
                      <label key={name} className="flex items-start gap-3 cursor-pointer flex-1">
                        <div className="relative mt-0.5">
                          <input
                            type="checkbox"
                            name={name}
                            checked={formData[name]}
                            onChange={handleInput}
                            className="sr-only peer"
                          />
                          <div className={`w-9 h-5 rounded-full transition-colors peer-checked:bg-primary-500 ${
                            darkMode ? "bg-gray-700" : "bg-gray-200"
                          }`} />
                          <div className="absolute left-0.5 top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-4" />
                        </div>
                        <div>
                          <p className={`text-sm font-semibold ${
                            darkMode ? "text-gray-200" : "text-gray-800"
                          }`}>{label}</p>
                          <p className={`text-[10px] ${
                            darkMode ? "text-gray-500" : "text-gray-400"
                          }`}>{desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </form>

                {/* ── Footer ──────────────────────────────────────────── */}
                <div className={`px-7 py-4 border-t flex items-center gap-3 ${
                  darkMode ? "border-gray-800 bg-gray-950/50" : "border-gray-100 bg-gray-50/50"
                }`}>
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={submitting}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-semibold border transition-all ${
                      darkMode
                        ? "border-gray-700 text-gray-300 hover:bg-gray-800"
                        : "border-gray-200 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitting}
                    className={`flex-[2] py-2.5 rounded-lg text-sm font-semibold text-white transition-all shadow-md flex items-center justify-center gap-2 ${
                      submitting
                        ? "bg-primary-400 cursor-wait opacity-80 shadow-none"
                        : "bg-primary-500 hover:bg-primary-600 active:bg-primary-700 shadow-primary-500/20 cursor-pointer"
                    }`}
                  >
                    {submitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin shrink-0" />
                        {modalMode === "create" ? "Creating Campaign..." : "Saving Changes..."}
                      </>
                    ) : modalMode === "create" ? (
                      <><Target size={15} /> Create Campaign</>
                    ) : (
                      <><CheckCircle2 size={15} /> Save Changes</>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Campaigns;