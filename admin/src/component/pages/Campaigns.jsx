// admin/src/component/pages/Campaigns.jsx - Sabo Ibadan Youth Charity Foundation
import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  X,
  Upload,
  Target,
  TrendingUp,
  Users,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Activity,
  Clock,
  XCircle,
  Image as ImageIcon,
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

// Status Configuration
const getStatusConfig = (status) => {
  const configs = {
    pending: {
      label: "Pending Review",
      color: "text-amber-600",
      bg: "bg-amber-100 dark:bg-amber-950/30",
      icon: Clock,
    },
    active: {
      label: "Active",
      color: "text-primary-600",
      bg: "bg-primary-100 dark:bg-primary-950/30",
      icon: CheckCircle2,
    },
    rejected: {
      label: "Rejected",
      color: "text-red-600",
      bg: "bg-red-100 dark:bg-red-950/30",
      icon: XCircle,
    },
    completed: {
      label: "Completed",
      color: "text-green-600",
      bg: "bg-green-100 dark:bg-green-950/30",
      icon: CheckCircle2,
    },
  };
  return configs[status] || configs.pending;
};

const Campaigns = () => {
  const { darkMode } = useTheme();
  const dispatch = useDispatch();

  const { campaigns, loading } = useSelector((state) => state.adminCampaigns);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    shortDescription: "",
    category: "education",
    location: "",
    target: "",
    startDate: "",
    endDate: "",
    beneficiariesTarget: "",
    currency: "NGN",
    featured: false,
    urgent: false,
    tags: "",
  });

  useEffect(() => {
    dispatch(
      fetchCampaigns({
        category: filterCategory === "all" ? "" : filterCategory,
        search: searchQuery,
      })
    );
  }, [dispatch, filterCategory, searchQuery]);

  const stats = useMemo(() => {
    const total = campaigns.length;
    const active = campaigns.filter((c) => c.status === "active").length;
    const pending = campaigns.filter((c) => c.status === "pending").length;
    const totalRaised = campaigns
      .filter((c) => c.status === "active")
      .reduce((sum, c) => sum + (c.raisedAmount || 0), 0);

    return [
      {
        label: "Total Campaigns",
        value: total.toString(),
        subtitle: "All campaigns",
        icon: Target,
        bgColor: "from-primary-600 to-primary-700",
      },
      {
        label: "Active Campaigns",
        value: active.toString(),
        subtitle: "Currently running",
        icon: Activity,
        bgColor: "from-primary-500 to-primary-600",
      },
      {
        label: "Pending Review",
        value: pending.toString(),
        subtitle: "Awaiting approval",
        icon: Clock,
        bgColor: "from-amber-500 to-orange-600",
      },
      {
        label: "Total Raised",
        value: `₦${(totalRaised / 1000000).toFixed(1)}M`,
        subtitle: "Funds collected",
        icon: DollarSign,
        bgColor: "from-primary-700 to-primary-800",
      },
    ];
  }, [campaigns]);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);

  const calculatePercentage = (raised, target) =>
    Math.min(Math.round((raised / target) * 100), 100);

  const filteredCampaigns = useMemo(() => {
    let result = [...campaigns];
    if (searchQuery) {
      result = result.filter((c) =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (filterCategory !== "all") {
      result = result.filter((c) => c.category === filterCategory);
    }
    return result;
  }, [campaigns, searchQuery, filterCategory]);

  const openModal = (mode, campaign = null) => {
    setModalMode(mode);
    setSelectedCampaign(campaign);
    if (mode === "edit" && campaign) {
      setFormData({
        title: campaign.title || "",
        description: campaign.description || "",
        shortDescription: campaign.shortDescription || "",
        category: campaign.category || "education",
        location:
          campaign.location?.city || campaign.location?.state
            ? `${campaign.location.city || ""}, ${campaign.location.state || ""}`
                .trim()
                .replace(/^,\s*|,\s*$/g, "")
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
      setFormData({
        title: "",
        description: "",
        shortDescription: "",
        category: "education",
        location: "",
        target: "",
        startDate: "",
        endDate: "",
        beneficiariesTarget: "",
        currency: "NGN",
        featured: false,
        urgent: false,
        tags: "",
      });
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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 3) {
      alert("Maximum 3 images allowed");
      return;
    }
    setImageFiles(files);
    setImagePreviews(files.map((file) => URL.createObjectURL(file)));
  };

  const confirmDelete = async () => {
    if (campaignToDelete) {
      try {
        setDeleting(true);
        await dispatch(deleteCampaign(campaignToDelete.id)).unwrap();
        setShowDeleteModal(false);
        setCampaignToDelete(null);
      } catch (err) {
        console.error("Failed to delete campaign:", err);
      } finally {
        setDeleting(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const campaignData = { ...formData, imageFiles };
      if (modalMode === "create") {
        await dispatch(createCampaign(campaignData)).unwrap();
      } else {
        await dispatch(
          updateCampaign({
            id: selectedCampaign._id || selectedCampaign.id,
            campaignData,
          })
        ).unwrap();
      }
      closeModal();
    } catch (err) {
      console.error("Error submitting campaign:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleApprove = async (id) => {
    await dispatch(approveCampaign({ id, status: "active" }));
  };

  const handleReject = async (id) => {
    if (window.confirm("Are you sure you want to reject this campaign?")) {
      await dispatch(approveCampaign({ id, status: "rejected" }));
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-1 bg-primary-500 rounded-full" />
            <span className="text-xs font-bold text-primary-600 uppercase tracking-wider">
              Campaign Management
            </span>
          </div>
          <h1
            className={`text-3xl lg:text-4xl font-bold mb-2 ${
              darkMode ? "text-white" : "text-dark"
            }`}
          >
            Fundraising Campaigns
          </h1>
          <p
            className={`text-base ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Manage and track fundraising campaigns for community projects
          </p>
        </div>

        <button
          onClick={() => openModal("create")}
          className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 shadow-lg shadow-primary-500/25 transition-all w-fit"
        >
          <Plus size={20} /> Create Campaign
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <StatsCard key={i} {...stat} index={i} />
        ))}
      </div>

      {/* Filters Section */}
      <div
        className={`p-6 rounded-2xl border ${
          darkMode
            ? "bg-dark-lighter border-gray-800"
            : "bg-white border-gray-200 shadow-lg"
        }`}
      >
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search campaigns by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 outline-none transition-all text-sm font-medium ${
                darkMode
                  ? "bg-gray-800 border-gray-700 text-white focus:border-primary-500"
                  : "bg-gray-50 border-gray-200 text-dark focus:border-primary-500"
              }`}
            />
          </div>

          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className={`px-6 py-3 rounded-xl border-2 outline-none cursor-pointer text-sm font-semibold ${
              darkMode
                ? "bg-gray-800 border-gray-700 text-white"
                : "bg-gray-50 border-gray-200 text-dark"
            }`}
          >
            <option value="all">All Categories</option>
            <option value="education">Education</option>
            <option value="health">Health</option>
            <option value="poverty">Poverty Relief</option>
            <option value="infrastructure">Infrastructure</option>
            <option value="emergency">Emergency Relief</option>
          </select>
        </div>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence mode="wait">
          {loading ? (
            // Loading Skeletons
            Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className={`h-[420px] rounded-2xl animate-pulse ${
                  darkMode ? "bg-gray-800" : "bg-gray-100"
                }`}
              />
            ))
          ) : filteredCampaigns.length > 0 ? (
            filteredCampaigns.map((campaign, i) => {
              const percentage = calculatePercentage(
                campaign.raisedAmount || 0,
                campaign.targetAmount || 1
              );
              const statusConfig = getStatusConfig(campaign.status);
              const primaryImage =
                campaign.images?.find((img) => img.isPrimary) ||
                campaign.images?.[0];

              return (
                <motion.div
                  key={campaign._id || campaign.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`group relative flex flex-col overflow-hidden rounded-2xl border transition-all hover:shadow-2xl ${
                    darkMode
                      ? "bg-dark-lighter border-gray-800 hover:border-primary-500/50"
                      : "bg-white border-gray-200 hover:border-primary-300 shadow-lg"
                  }`}
                >
                  {/* Campaign Image */}
                  <div className="relative h-48 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                    <img
                      src={
                        primaryImage?.url ||
                        "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&fit=crop"
                      }
                      alt={campaign.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Status Badge */}
                    <div className="absolute top-4 left-4 z-20">
                      <span
                        className={`${statusConfig.bg} ${statusConfig.color} px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm`}
                      >
                        <statusConfig.icon size={14} />
                        {statusConfig.label}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="absolute top-4 right-4 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openModal("edit", campaign)}
                        className="p-2 bg-white/90 rounded-lg hover:bg-white transition-all shadow-lg"
                        title="Edit campaign"
                      >
                        <Edit size={16} className="text-dark" />
                      </button>
                      <button
                        onClick={() => {
                          setCampaignToDelete({
                            id: campaign._id,
                            title: campaign.title,
                          });
                          setShowDeleteModal(true);
                        }}
                        className="p-2 bg-red-500 rounded-lg hover:bg-red-600 transition-all shadow-lg"
                        title="Delete campaign"
                      >
                        <Trash2 size={16} className="text-white" />
                      </button>
                    </div>

                    {/* Campaign Title */}
                    <div className="absolute bottom-4 left-4 right-4 z-20">
                      <h3 className="text-white text-base font-bold leading-tight line-clamp-2">
                        {campaign.title}
                      </h3>
                    </div>
                  </div>

                  {/* Campaign Details */}
                  <div className="p-5 flex flex-col flex-1 space-y-4">
                    {/* Progress */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-baseline">
                        <div>
                          <p
                            className={`text-xs font-medium ${
                              darkMode ? "text-gray-500" : "text-gray-600"
                            }`}
                          >
                            Raised
                          </p>
                          <p
                            className={`text-lg font-bold ${
                              darkMode ? "text-primary-400" : "text-primary-600"
                            }`}
                          >
                            {formatCurrency(campaign.raisedAmount || 0)}
                          </p>
                        </div>
                        <span
                          className={`text-sm font-bold ${
                            darkMode ? "text-gray-500" : "text-gray-600"
                          }`}
                        >
                          {percentage}%
                        </span>
                      </div>

                      <div
                        className={`h-2 w-full rounded-full overflow-hidden ${
                          darkMode ? "bg-gray-800" : "bg-gray-200"
                        }`}
                      >
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-primary-500 to-primary-600"
                        />
                      </div>

                      <p
                        className={`text-xs font-medium ${
                          darkMode ? "text-gray-500" : "text-gray-600"
                        }`}
                      >
                        Goal: {formatCurrency(campaign.targetAmount || 0)}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    {campaign.status === "pending" ? (
                      <div className="grid grid-cols-2 gap-2 mt-auto pt-4 border-t border-gray-200 dark:border-gray-800">
                        <button
                          onClick={() => handleApprove(campaign._id)}
                          className="py-2.5 rounded-lg bg-primary-500 text-white font-semibold text-sm hover:bg-primary-600 transition-all"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(campaign._id)}
                          className="py-2.5 rounded-lg bg-red-500 text-white font-semibold text-sm hover:bg-red-600 transition-all"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-200 dark:border-gray-800">
                        <div className="flex items-center gap-2">
                          <Users size={16} className="text-primary-500" />
                          <span
                            className={`text-sm font-semibold ${
                              darkMode ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            {campaign.donorCount || 0} Donors
                          </span>
                        </div>
                        <Link
                          to={`/admin/campaigns/${campaign._id}`}
                          className={`p-2 rounded-lg transition-all ${
                            darkMode
                              ? "bg-gray-800 text-gray-400 hover:text-white"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                          title="View details"
                        >
                          <ExternalLink size={16} />
                        </Link>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="col-span-full py-20 text-center">
              <div
                className={`flex flex-col items-center gap-4 ${
                  darkMode ? "text-gray-500" : "text-gray-400"
                }`}
              >
                <Target size={48} />
                <p className="text-lg font-semibold">No campaigns found</p>
                <p className="text-sm">
                  {searchQuery || filterCategory !== "all"
                    ? "Try adjusting your filters"
                    : "Create your first campaign to get started"}
                </p>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !deleting && setShowDeleteModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div
                className={`relative w-full max-w-md rounded-2xl shadow-2xl p-6 ${
                  darkMode ? "bg-dark-lighter" : "bg-white"
                }`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/30 flex items-center justify-center">
                    <AlertTriangle size={24} className="text-red-600" />
                  </div>
                  <div>
                    <h3
                      className={`text-xl font-bold ${
                        darkMode ? "text-white" : "text-dark"
                      }`}
                    >
                      Delete Campaign?
                    </h3>
                    <p
                      className={`text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      This action cannot be undone
                    </p>
                  </div>
                </div>

                <p
                  className={`text-sm mb-6 ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Are you sure you want to delete{" "}
                  <span className="font-semibold text-red-600">
                    "{campaignToDelete?.title}"
                  </span>
                  ? All campaign data and donations will be permanently removed.
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setCampaignToDelete(null);
                    }}
                    disabled={deleting}
                    className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                      darkMode
                        ? "bg-gray-800 text-white hover:bg-gray-700"
                        : "bg-gray-100 text-dark hover:bg-gray-200"
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    disabled={deleting}
                    className="flex-1 py-3 rounded-xl font-semibold bg-red-600 text-white hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deleting ? "Deleting..." : "Delete Campaign"}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Create/Edit Campaign Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !submitting && closeModal()}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
            >
              <div
                className={`relative w-full max-w-3xl my-8 rounded-2xl shadow-2xl ${
                  darkMode ? "bg-dark-lighter" : "bg-white"
                }`}
              >
                {/* Modal Header */}
                <div
                  className={`p-6 border-b flex items-center justify-between ${
                    darkMode ? "border-gray-800" : "border-gray-200"
                  }`}
                >
                  <div>
                    <h2
                      className={`text-2xl font-bold ${
                        darkMode ? "text-white" : "text-dark"
                      }`}
                    >
                      {modalMode === "create"
                        ? "Create Campaign"
                        : "Edit Campaign"}
                    </h2>
                    <p
                      className={`text-sm mt-1 ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {modalMode === "create"
                        ? "Create a new fundraising campaign"
                        : "Update campaign details"}
                    </p>
                  </div>
                  <button
                    onClick={closeModal}
                    disabled={submitting}
                    className={`p-2 rounded-lg transition-colors ${
                      darkMode
                        ? "hover:bg-gray-800 text-gray-400"
                        : "hover:bg-gray-100 text-gray-600"
                    }`}
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Modal Body */}
                <form
                  onSubmit={handleSubmit}
                  className="p-6 space-y-6 max-h-[70vh] overflow-y-auto"
                >
                  {/* Campaign Title */}
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Campaign Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter campaign title"
                      className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all ${
                        darkMode
                          ? "bg-gray-800 border-gray-700 text-white focus:border-primary-500"
                          : "bg-gray-50 border-gray-200 text-dark focus:border-primary-500"
                      }`}
                    />
                  </div>

                  {/* Category and Target Amount */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Category *
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-4 py-3 rounded-xl border-2 outline-none cursor-pointer ${
                          darkMode
                            ? "bg-gray-800 border-gray-700 text-white focus:border-primary-500"
                            : "bg-gray-50 border-gray-200 text-dark focus:border-primary-500"
                        }`}
                      >
                        <option value="education">Education</option>
                        <option value="health">Health</option>
                        <option value="poverty">Poverty Relief</option>
                        <option value="infrastructure">Infrastructure</option>
                        <option value="emergency">Emergency Relief</option>
                      </select>
                    </div>

                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Target Amount (₦) *
                      </label>
                      <input
                        type="number"
                        name="target"
                        value={formData.target}
                        onChange={handleInputChange}
                        required
                        min="1"
                        placeholder="0"
                        className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all ${
                          darkMode
                            ? "bg-gray-800 border-gray-700 text-white focus:border-primary-500"
                            : "bg-gray-50 border-gray-200 text-dark focus:border-primary-500"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Short Description */}
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Short Description
                    </label>
                    <input
                      type="text"
                      name="shortDescription"
                      value={formData.shortDescription}
                      onChange={handleInputChange}
                      placeholder="Brief summary (optional)"
                      maxLength={200}
                      className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all ${
                        darkMode
                          ? "bg-gray-800 border-gray-700 text-white focus:border-primary-500"
                          : "bg-gray-50 border-gray-200 text-dark focus:border-primary-500"
                      }`}
                    />
                  </div>

                  {/* Full Description */}
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Full Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows={5}
                      placeholder="Describe your campaign in detail..."
                      className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all resize-none ${
                        darkMode
                          ? "bg-gray-800 border-gray-700 text-white focus:border-primary-500"
                          : "bg-gray-50 border-gray-200 text-dark focus:border-primary-500"
                      }`}
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="e.g., Ibadan, Oyo State"
                      className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all ${
                        darkMode
                          ? "bg-gray-800 border-gray-700 text-white focus:border-primary-500"
                          : "bg-gray-50 border-gray-200 text-dark focus:border-primary-500"
                      }`}
                    />
                  </div>

                  {/* Images */}
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Campaign Images (Max 3)
                    </label>
                    <div className="grid grid-cols-3 gap-4">
                      <label
                        className={`aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${
                          darkMode
                            ? "bg-gray-800 border-gray-700 hover:border-primary-500"
                            : "bg-gray-50 border-gray-300 hover:border-primary-500"
                        }`}
                      >
                        <Upload size={24} className="text-primary-500 mb-2" />
                        <span
                          className={`text-xs font-medium ${
                            darkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Upload
                        </span>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>

                      {imagePreviews.map((preview, index) => (
                        <div
                          key={index}
                          className="relative aspect-square rounded-xl overflow-hidden group"
                        >
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setImageFiles((prev) =>
                                prev.filter((_, i) => i !== index)
                              );
                              setImagePreviews((prev) =>
                                prev.filter((_, i) => i !== index)
                              );
                            }}
                            className="absolute inset-0 bg-red-600/80 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      ))}

                      {modalMode === "edit" &&
                        imagePreviews.length === 0 &&
                        selectedCampaign?.images?.map((img, index) => (
                          <div
                            key={`existing-${index}`}
                            className="relative aspect-square rounded-xl overflow-hidden"
                          >
                            <img
                              src={img.url}
                              alt={`Current ${index + 1}`}
                              className="w-full h-full object-cover opacity-60"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                              <span className="text-xs font-semibold text-white">
                                Current
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Checkboxes */}
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="featured"
                        checked={formData.featured}
                        onChange={handleInputChange}
                        className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span
                        className={`text-sm font-medium ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Featured Campaign
                      </span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="urgent"
                        checked={formData.urgent}
                        onChange={handleInputChange}
                        className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span
                        className={`text-sm font-medium ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Urgent Campaign
                      </span>
                    </label>
                  </div>
                </form>

                {/* Modal Footer */}
                <div
                  className={`p-6 border-t flex gap-3 ${
                    darkMode ? "border-gray-800" : "border-gray-200"
                  }`}
                >
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={submitting}
                    className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                      darkMode
                        ? "bg-gray-800 text-white hover:bg-gray-700"
                        : "bg-gray-100 text-dark hover:bg-gray-200"
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="flex-1 py-3 rounded-xl font-semibold bg-primary-500 text-white hover:bg-primary-600 transition-all shadow-lg shadow-primary-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting
                      ? "Saving..."
                      : modalMode === "create"
                      ? "Create Campaign"
                      : "Save Changes"}
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