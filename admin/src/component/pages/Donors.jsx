// admin/src/component/pages/Donors.jsx - Donor Management Hub
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Users,
  Award,
  Download,
  Activity,
  Star,
  Zap,
  RefreshCw,
  BarChart3,
  Heart,
  Eye,
  TrendingUp,
  ShieldCheck,
  ShieldOff,
  UserCheck,
  X,
  Calendar,
  CreditCard,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { StatsCard } from "../shared";
import {
  fetchDonorStats,
  fetchAllDonors,
  fetchDonorDetails,
  updateUserStatus,
  verifyUser,
  exportDonors,
  setFilters,
  selectDonors,
  selectStats,
  selectPagination,
  selectFilters,
} from "../../features/donor/adminDonorsSlice";

const Donors = () => {
  const dispatch = useDispatch();
  const { darkMode } = useTheme();

  const donors = useSelector(selectDonors);
  const stats = useSelector(selectStats);
  const pagination = useSelector(selectPagination);
  const filters = useSelector(selectFilters);

  const [localSearch, setLocalSearch] = useState(filters.search || "");
  const [isLoading, setIsLoading] = useState(false);

  // ── Action modals ────────────────────────────────────────────────────────
  const [detailDonor, setDetailDonor]       = useState(null);
  const [detailHistory, setDetailHistory]   = useState([]);
  const [detailLoading, setDetailLoading]   = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const [confirmAction, setConfirmAction]   = useState(null); // { type, donor }
  const [actionLoading, setActionLoading]   = useState(false);
  // ────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    dispatch(fetchDonorStats());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchAllDonors(filters));
  }, [dispatch, filters]);

  const internalStats = useMemo(
    () => [
      {
        label: "Donor Community",
        value: (stats?.totalDonors || 0).toLocaleString(),
        subtitle: "Active Supporters",
        icon: Users,
        bgColor: "from-primary-600 to-primary-700",
        trend: "+12%", // Mock trend for magnificence
        trendUp: true,
      },
      {
        label: "Total Support",
        value: new Intl.NumberFormat("en-NG", {
          style: "currency",
          currency: "NGN",
          minimumFractionDigits: 0,
        }).format(stats?.totalAmount || 0),
        subtitle: "Total Impact",
        icon: Activity,
        bgColor: "from-emerald-500 to-emerald-600",
        trend: "+5.4%",
        trendUp: true,
      },
      {
        label: "Lead Partners",
        value: (stats?.topTierCount || 0).toLocaleString(),
        subtitle: "Visionary Supporters",
        icon: Star,
        bgColor: "from-amber-500 to-orange-600",
      },
      {
        label: "Retention Rate",
        value: `${stats?.retentionRate || 0}%`,
        subtitle: "Community Spirit",
        icon: Zap,
        bgColor: "from-primary-700 to-primary-800",
      },
    ],
    [stats]
  );

  const getTierConfig = (amount) => {
    if (amount >= 1000000)
      return {
        label: "Platinum",
        color: "text-emerald-600",
        bg: "bg-emerald-100 dark:bg-emerald-950/30",
        border: "border-emerald-200 dark:border-emerald-800",
        icon: Star,
        glow: "shadow-emerald-500/20",
      };
    if (amount >= 500000)
      return {
        label: "Gold",
        color: "text-amber-600",
        bg: "bg-amber-100 dark:bg-amber-950/30",
        border: "border-amber-200 dark:border-amber-800",
        icon: Award,
        glow: "shadow-amber-500/20",
      };
    if (amount >= 100000)
      return {
        label: "Silver",
        color: "text-gray-600",
        bg: "bg-gray-100 dark:bg-gray-800",
        border: "border-gray-200 dark:border-gray-700",
        icon: Users,
        glow: "shadow-gray-500/20",
      };
    return {
      label: "Bronze",
      color: "text-orange-600",
      bg: "bg-orange-100 dark:bg-orange-950/30",
      border: "border-orange-200 dark:border-orange-800",
      icon: Heart,
      glow: "shadow-orange-500/20",
    };
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      dispatch(setFilters({ ...filters, page: newPage }));
    }
  };

  const handleExport = async () => {
    setIsLoading(true);
    try {
      await dispatch(exportDonors(filters));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    dispatch(fetchAllDonors(filters));
    dispatch(fetchDonorStats());
  };

  // ── Donor detail drawer ──────────────────────────────────────────────────
  const handleViewDetails = async (donor) => {
    setDetailDonor(donor);
    setDetailHistory([]);
    setShowDetailModal(true);
    if (!donor.isGuest) {
      setDetailLoading(true);
      try {
        const res = await dispatch(fetchDonorDetails(donor._id)).unwrap();
        setDetailHistory(res.history || []);
        setDetailDonor(res.donor || donor);
      } catch (_) {}
      finally { setDetailLoading(false); }
    } else {
      setDetailHistory(donor.donations || []);
    }
  };

  // ── Verify / suspend confirm ─────────────────────────────────────────────
  const openConfirm = (type, donor) => setConfirmAction({ type, donor });
  const closeConfirm = () => { if (!actionLoading) setConfirmAction(null); };

  const handleConfirmedAction = async () => {
    if (!confirmAction) return;
    const { type, donor } = confirmAction;
    setActionLoading(true);
    try {
      if (type === 'verify') {
        await dispatch(verifyUser(donor._id)).unwrap();
      } else if (type === 'suspend') {
        await dispatch(updateUserStatus({ id: donor._id, status: 'suspended' })).unwrap();
      } else if (type === 'activate') {
        await dispatch(updateUserStatus({ id: donor._id, status: 'active' })).unwrap();
      }
      dispatch(fetchAllDonors(filters));
      setConfirmAction(null);
    } catch (_) {}
    finally { setActionLoading(false); }
  };
  // ────────────────────────────────────────────────────────────────────────

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <div className="space-y-8 relative">
      {/* Decorative Background Blob */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-1 bg-gradient-to-r from-primary-500 to-primary-300 rounded-full" />
            <span className="text-xs font-bold text-primary-600 uppercase tracking-wider">
              Donor Management
            </span>
          </div>
          <h1
            className={`text-3xl lg:text-4xl font-extrabold mb-2 tracking-tight ${
              darkMode ? "text-white" : "text-dark"
            }`}
          >
            Donor <span className="text-primary-500">Insights</span>
          </h1>
          <p
            className={`text-base max-w-xl ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Track and manage donor relationships, analyze contributions, and cultivate lasting community support.
          </p>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleExport}
          disabled={isLoading}
          className="bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white px-8 py-4 rounded-2xl font-bold text-sm flex items-center gap-3 shadow-xl shadow-primary-500/30 transition-all w-fit disabled:opacity-50"
        >
          <Download size={20} />
          {isLoading ? "Exporting..." : "Export Report"}
        </motion.button>
      </div>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {internalStats.map((stat, i) => (
          <motion.div key={i} variants={itemVariants} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
             <StatsCard {...stat} index={i} />
          </motion.div>
        ))}
      </motion.div>

      {/* Filters Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={`p-6 rounded-3xl border backdrop-blur-sm ${
          darkMode
            ? "bg-dark-lighter/80 border-gray-800"
            : "bg-white/80 border-gray-100 shadow-xl shadow-gray-100/50"
        }`}
      >
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1 group">
            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors"
              size={20}
            />
            <input
              type="text"
              placeholder="Search donors by name or email..."
              value={localSearch}
              onChange={(e) => {
                setLocalSearch(e.target.value);
                dispatch(setFilters({ ...filters, search: e.target.value, page: 1 }));
              }}
              className={`w-full pl-14 pr-6 py-4 rounded-2xl border-2 outline-none transition-all text-sm font-semibold ${
                darkMode
                  ? "bg-gray-800/50 border-gray-700 text-white focus:border-primary-500 focus:bg-gray-800"
                  : "bg-gray-50 border-gray-100 text-dark focus:border-primary-500 focus:bg-white focus:shadow-lg focus:shadow-primary-500/10"
              }`}
            />
          </div>

          {/* Tier Filter */}
          <select
            value={filters.tier || "all"}
            onChange={(e) => {
              const tier = e.target.value;
              dispatch(setFilters({ ...filters, tier: tier !== "all" ? tier : undefined, page: 1 }));
            }}
            className={`px-8 py-4 rounded-2xl border-2 outline-none cursor-pointer text-sm font-bold ${
              darkMode
                ? "bg-gray-800/50 border-gray-700 text-white focus:border-primary-500"
                : "bg-gray-50 border-gray-100 text-dark focus:border-primary-500 hover:bg-white transition-colors"
            }`}
          >
            <option value="all">All Donor Levels</option>
            <option value="platinum">Platinum Donors</option>
            <option value="gold">Gold Supporters</option>
            <option value="silver">Silver Donors</option>
            <option value="bronze">Bronze Supporters</option>
          </select>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            className={`px-8 py-4 rounded-2xl border-2 font-bold text-sm transition-all flex items-center gap-2 hover:scale-105 active:scale-95 ${
              darkMode
                ? "bg-gray-800/50 border-gray-700 text-gray-300 hover:text-white hover:bg-gray-700"
                : "bg-white border-gray-200 text-gray-600 hover:text-primary-600 hover:border-primary-200"
            }`}
          >
            <RefreshCw size={18} /> Refresh
          </button>
        </div>
      </motion.div>

      {/* Donors Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className={`rounded-3xl border overflow-hidden ${
          darkMode
            ? "bg-dark-lighter border-gray-800"
            : "bg-white border-gray-100 shadow-xl shadow-gray-100/50"
        }`}
      >
        {/* Table Header */}
        <div className="p-8 border-b border-gray-100 dark:border-gray-800/50 flex flex-wrap gap-4 items-center justify-between bg-gradient-to-r from-transparent via-transparent to-primary-500/5">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${darkMode ? "bg-primary-900/20" : "bg-primary-50"}`}>
               <BarChart3 size={24} className="text-primary-500" />
            </div>
            <div>
              <h3
                className={`text-xl font-bold ${
                  darkMode ? "text-white" : "text-dark"
                }`}
              >
                Donors List
              </h3>
              <p className={`text-sm mt-1 ${darkMode ? "text-gray-500" : "text-gray-500"}`}>
                Managing {pagination?.total || 0} active relationships
              </p>
            </div>
          </div>
          <span
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider ${
              darkMode
                ? "bg-gray-800 text-gray-400"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {donors?.length || 0} Showing
          </span>
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead
              className={`${
                darkMode ? "bg-gray-900/30" : "bg-gray-50/50"
              } border-b ${darkMode ? "border-gray-800" : "border-gray-100"}`}
            >
              <tr>
                <th
                  className={`px-8 py-5 text-left text-xs font-bold uppercase tracking-wider ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Donor Profile
                </th>
                <th
                  className={`px-8 py-5 text-left text-xs font-bold uppercase tracking-wider ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Total Donated
                </th>
                <th
                  className={`px-8 py-5 text-left text-xs font-bold uppercase tracking-wider ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Contributions
                </th>
                <th
                  className={`px-8 py-5 text-left text-xs font-bold uppercase tracking-wider ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Donor Level
                </th>
                <th
                  className={`px-8 py-5 text-right text-xs font-bold uppercase tracking-wider ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody
              className={`divide-y ${
                darkMode ? "divide-gray-800/50" : "divide-gray-100"
              }`}
            >
              <AnimatePresence mode="wait">
                {donors && donors.length > 0 ? (
                  donors.map((donor, i) => {
                    const tier = getTierConfig(donor.totalDonated);
                    return (
                      <motion.tr
                        key={donor._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`group hover:bg-primary-50/50 dark:hover:bg-primary-900/10 transition-colors cursor-pointer`}
                      >
                        {/* Donor Profile */}
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <motion.div 
                              whileHover={{ scale: 1.1 }}
                              className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-white dark:border-gray-700 shadow-sm"
                            >
                              <img
                                src={
                                  donor.avatar ||
                                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                    donor.fullName
                                  )}&background=10b981&color=fff`
                                }
                                alt={donor.fullName}
                                className="w-full h-full object-cover"
                              />
                            </motion.div>
                            <div>
                              {/* Name row with verified badge inline before the name */}
                              <div className="flex items-center gap-1.5 mb-1">
                                {donor.isVerified && (
                                  <span
                                    title="Verified donor"
                                    className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-emerald-500 text-white flex-shrink-0"
                                  >
                                    <CheckCircle size={10} />
                                  </span>
                                )}
                                <h4
                                  className={`font-bold text-sm group-hover:text-primary-600 transition-colors ${
                                    darkMode ? "text-white" : "text-dark"
                                  }`}
                                >
                                  {donor.fullName}
                                </h4>
                              </div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <p
                                  className={`text-xs font-medium ${
                                    darkMode ? "text-gray-500" : "text-gray-500"
                                  }`}
                                >
                                  {donor.email}
                                </p>
                                {donor.status === 'suspended' && (
                                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-rose-100 dark:bg-rose-900/30 text-rose-500 dark:text-rose-400 text-[10px] font-bold">
                                    <ShieldOff size={9} />
                                    Suspended
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Total Donated */}
                        <td className="px-8 py-6">
                            <div className="flex flex-col">
                                <span className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {new Intl.NumberFormat("en-NG", {
                                    style: "currency",
                                    currency: "NGN",
                                    minimumFractionDigits: 0,
                                    }).format(donor.totalDonated)}
                                </span>
                                <div className="flex items-center gap-1 mt-1 text-xs font-medium text-emerald-500">
                                   <TrendingUp size={12} />
                                   <span>Active</span>
                                </div>
                            </div>
                        </td>

                        {/* Contributions */}
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                             <div className={`p-2 rounded-lg ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}>
                                <Activity size={16} className={`${darkMode ? "text-gray-400" : "text-gray-500"}`} />
                            </div>
                            <div className="flex flex-col">
                                <span
                                    className={`font-bold text-sm ${
                                    darkMode ? "text-white" : "text-dark"
                                    }`}
                                >
                                    {donor.donationCount}
                                </span>
                                <span
                                    className={`text-xs ${
                                    darkMode ? "text-gray-600" : "text-gray-400"
                                    }`}
                                >
                                    Donations made
                                </span>
                            </div>
                          </div>
                        </td>

                        {/* Donor Level */}
                        <td className="px-8 py-6">
                          <span
                            className={`${tier.bg} ${tier.color} ${tier.border} border shadow-sm px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 w-fit transition-all group-hover:scale-105`}
                          >
                            <tier.icon size={14} />
                            {tier.label}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-8 py-6">
                          <div className="flex items-center justify-end gap-2">
                            {/* View Details */}
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleViewDetails(donor)}
                              className={`p-2.5 rounded-xl transition-all ${
                                darkMode
                                  ? "bg-gray-800 text-gray-400 hover:text-primary-400 hover:bg-gray-700"
                                  : "bg-white text-gray-500 hover:text-primary-600 hover:bg-primary-50 shadow-sm border border-gray-100"
                              }`}
                              title="View donation history"
                            >
                              <Eye size={16} />
                            </motion.button>

                            {/* Verify donor — idempotent: hidden if already verified */}
                            {!donor.isGuest && (
                              donor.isVerified ? (
                                /* Already verified — static badge, no action */
                                <span
                                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 cursor-default"
                                  title="Donor is already verified"
                                >
                                  <ShieldCheck size={13} />
                                  Verified
                                </span>
                              ) : (
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => openConfirm('verify', donor)}
                                  className={`p-2.5 rounded-xl transition-all ${
                                    darkMode
                                      ? "bg-gray-800 text-gray-400 hover:text-emerald-400 hover:bg-gray-700"
                                      : "bg-white text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 shadow-sm border border-gray-100"
                                  }`}
                                  title="Verify this donor"
                                >
                                  <ShieldCheck size={16} />
                                </motion.button>
                              )
                            )}

                            {/* Suspend / Activate */}
                            {!donor.isGuest && (
                              donor.status === 'suspended' ? (
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => openConfirm('activate', donor)}
                                  className={`p-2.5 rounded-xl transition-all ${
                                    darkMode
                                      ? "bg-gray-800 text-gray-400 hover:text-emerald-400 hover:bg-gray-700"
                                      : "bg-white text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 shadow-sm border border-gray-100"
                                  }`}
                                  title="Activate donor"
                                >
                                  <UserCheck size={16} />
                                </motion.button>
                              ) : (
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => openConfirm('suspend', donor)}
                                  className={`p-2.5 rounded-xl transition-all ${
                                    darkMode
                                      ? "bg-gray-800 text-gray-400 hover:text-rose-400 hover:bg-gray-700"
                                      : "bg-white text-gray-500 hover:text-rose-600 hover:bg-rose-50 shadow-sm border border-gray-100"
                                  }`}
                                  title="Suspend donor"
                                >
                                  <ShieldOff size={16} />
                                </motion.button>
                              )
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="px-8 py-32 text-center">
                      <div
                        className={`flex flex-col items-center gap-6 ${
                          darkMode ? "text-gray-500" : "text-gray-400"
                        }`}
                      >
                        <div className={`p-6 rounded-full ${darkMode ? "bg-gray-800/50" : "bg-gray-50"}`}>
                           <Users size={64} className="opacity-50" />
                        </div>
                        <div>
                            <p className="text-xl font-bold mb-2">No donors found</p>
                            <p className="text-sm opacity-75">Try adjusting your filters or search terms</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden divide-y divide-gray-200 dark:divide-gray-800">
          {donors && donors.length > 0 ? (
            donors.map((donor, i) => {
              const tier = getTierConfig(donor.totalDonated);
              return (
                <motion.div
                  key={donor._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-6 space-y-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
                        <img
                          src={
                            donor.avatar ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              donor.fullName
                             )}&background=10b981&color=fff`
                           }
                          alt={donor.fullName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4
                          className={`font-bold text-lg mb-1 ${
                            darkMode ? "text-white" : "text-dark"
                          }`}
                        >
                          {donor.fullName}
                        </h4>
                        <p
                          className={`text-sm font-medium ${
                            darkMode ? "text-gray-500" : "text-gray-600"
                          }`}
                        >
                          {donor.email}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`${tier.bg} ${tier.color} ${tier.border} border px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shrink-0`}
                    >
                      <tier.icon size={12} />
                      {tier.label}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50">
                    <div className="flex flex-col gap-1">
                       <span className={`text-xs font-semibold ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Total Donated</span>
                      <span className="font-bold text-emerald-600 text-base">
                         {new Intl.NumberFormat("en-NG", {
                            style: "currency",
                            currency: "NGN",
                            minimumFractionDigits: 0,
                          }).format(donor.totalDonated)}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className={`text-xs font-semibold ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Contributions</span>
                      <span className={`font-bold text-base ${darkMode ? "text-white" : "text-dark"}`}>
                        {donor.donationCount} <span className="text-xs font-normal opacity-70">donations</span>
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
             <div className="p-20 text-center">
              <div
                className={`flex flex-col items-center gap-4 ${
                  darkMode ? "text-gray-500" : "text-gray-400"
                }`}
              >
                <Users size={48} />
                <p className="text-lg font-semibold">No donors found</p>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* ── Donor Detail Modal ──────────────────────────────────────────── */}
      <AnimatePresence>
        {showDetailModal && detailDonor && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-3xl border ${
                darkMode
                  ? "bg-gray-900 border-gray-700"
                  : "bg-white border-gray-200 shadow-2xl"
              }`}
            >
              {/* Header */}
              <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800 bg-inherit rounded-t-3xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-primary-200">
                    <img
                      src={detailDonor.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(detailDonor.fullName)}&background=10b981&color=fff`}
                      alt={detailDonor.fullName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h2 className={`font-extrabold text-lg ${darkMode ? "text-white" : "text-dark"}`}>
                      {detailDonor.fullName}
                    </h2>
                    <p className="text-xs text-gray-500">{detailDonor.email}</p>
                  </div>
                </div>
                <button onClick={() => setShowDetailModal(false)} className="p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                  <X size={20} />
                </button>
              </div>

              {/* Summary */}
              <div className="p-6 grid grid-cols-2 gap-4">
                {[
                  { label: 'Total Donated', value: new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(detailDonor.totalDonated || 0), icon: CreditCard, color: 'text-emerald-500' },
                  { label: 'Donations', value: `${detailDonor.donationCount || 0} made`, icon: Activity, color: 'text-primary-500' },
                  { label: 'First Donation', value: detailDonor.firstDonation ? new Date(detailDonor.firstDonation).toLocaleDateString('en-NG', { year:'numeric', month:'short', day:'numeric' }) : 'N/A', icon: Calendar, color: 'text-amber-500' },
                  { label: 'Last Donation', value: detailDonor.lastDonation ? new Date(detailDonor.lastDonation).toLocaleDateString('en-NG', { year:'numeric', month:'short', day:'numeric' }) : 'N/A', icon: Clock, color: 'text-blue-500' },
                ].map(({ label, value, icon: Icon, color }) => (
                  <div key={label} className={`p-4 rounded-2xl ${ darkMode ? 'bg-gray-800/60' : 'bg-gray-50' }`}>
                    <div className="flex items-center gap-2 mb-1">
                      <Icon size={14} className={color} />
                      <span className="text-xs font-semibold text-gray-500">{label}</span>
                    </div>
                    <p className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-dark'}`}>{value}</p>
                  </div>
                ))}
              </div>

              {/* Donation History */}
              <div className="px-6 pb-6">
                <h3 className={`font-bold text-sm uppercase tracking-wider mb-3 ${ darkMode ? 'text-gray-400' : 'text-gray-500' }`}>Donation History</h3>
                {detailLoading ? (
                  <div className="flex justify-center py-8"><div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>
                ) : detailHistory.length === 0 ? (
                  <p className="text-center text-sm text-gray-400 py-6">No donation history available.</p>
                ) : (
                  <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                    {detailHistory.map((d) => (
                      <div key={d._id} className={`flex items-center justify-between p-3 rounded-xl ${ darkMode ? 'bg-gray-800/50' : 'bg-gray-50' }`}>
                        <div>
                          <p className={`font-bold text-sm ${ darkMode ? 'text-white' : 'text-dark' }`}>
                            {new Intl.NumberFormat('en-NG', { style:'currency', currency:'NGN', minimumFractionDigits:0 }).format(d.amount)}
                          </p>
                          <p className="text-xs text-gray-500">{d.campaign?.title || 'General Donation'}</p>
                          <p className="text-xs text-gray-400">{new Date(d.createdAt).toLocaleDateString('en-NG')}</p>
                        </div>
                        {d.approvalStatus === 'approved' ? (
                          <CheckCircle size={16} className="text-emerald-500 shrink-0" />
                        ) : d.approvalStatus === 'rejected' ? (
                          <XCircle size={16} className="text-rose-500 shrink-0" />
                        ) : (
                          <Clock size={16} className="text-amber-500 shrink-0" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Confirm Action Modal ────────────────────────────────────────── */}
      <AnimatePresence>
        {confirmAction && (
          <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`w-full max-w-sm p-8 rounded-3xl border ${
                darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200 shadow-2xl"
              }`}
            >
              <div className="text-center mb-6">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  confirmAction.type === 'suspend' ? 'bg-rose-100' :
                  confirmAction.type === 'activate' ? 'bg-emerald-100' : 'bg-primary-100'
                }`}>
                  {confirmAction.type === 'suspend' ? <ShieldOff size={28} className="text-rose-500" /> :
                   confirmAction.type === 'activate' ? <UserCheck size={28} className="text-emerald-500" /> :
                   <ShieldCheck size={28} className="text-primary-500" />}
                </div>
                <h3 className={`text-xl font-extrabold mb-2 ${ darkMode ? 'text-white' : 'text-dark' }`}>
                  {confirmAction.type === 'suspend' ? 'Suspend Donor?' :
                   confirmAction.type === 'activate' ? 'Activate Donor?' : 'Verify Donor?'}
                </h3>
                <p className={`text-sm ${ darkMode ? 'text-gray-400' : 'text-gray-600' }`}>
                  {confirmAction.type === 'suspend'
                    ? `${confirmAction.donor.fullName} will be suspended and lose access to their account.`
                    : confirmAction.type === 'activate'
                    ? `${confirmAction.donor.fullName}'s account will be reactivated.`
                    : `${confirmAction.donor.fullName} will be marked as a verified donor.`}
                </p>
              </div>
              <div className="flex gap-3">
                <button onClick={closeConfirm} disabled={actionLoading}
                  className={`flex-1 py-3 rounded-2xl font-bold text-sm transition-all ${ darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200' }`}>
                  Cancel
                </button>
                <button onClick={handleConfirmedAction} disabled={actionLoading}
                  className={`flex-1 py-3 rounded-2xl font-bold text-sm text-white transition-all disabled:opacity-60 flex items-center justify-center gap-2 ${
                    confirmAction.type === 'suspend' ? 'bg-rose-500 hover:bg-rose-600' :
                    confirmAction.type === 'activate' ? 'bg-emerald-500 hover:bg-emerald-600' :
                    'bg-primary-500 hover:bg-primary-600'
                  }`}>
                  {actionLoading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
                  {confirmAction.type === 'suspend' ? 'Suspend' :
                   confirmAction.type === 'activate' ? 'Activate' : 'Verify'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* ─────────────────────────────────────────────────────────────────── */}

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <p
            className={`text-sm font-semibold ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Page {pagination.page} of {pagination.pages}
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className={`p-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                darkMode
                  ? "bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              <ChevronLeft size={20} />
            </button>

            {/* Page Numbers */}
            <div className="hidden sm:flex items-center gap-2">
              {Array.from({ length: Math.min(pagination.pages, 5) }, (_, i) => {
                let pageNum;
                if (pagination.pages <= 5) {
                  pageNum = i + 1;
                } else if (pagination.page <= 3) {
                  pageNum = i + 1;
                } else if (pagination.page >= pagination.pages - 2) {
                  pageNum = pagination.pages - 4 + i;
                } else {
                  pageNum = pagination.page - 2 + i;
                }

                return (
                  <button
                    key={i}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm transition-all shadow-sm ${
                      pagination.page === pageNum
                        ? "bg-primary-500 text-white shadow-primary-500/30 scale-105"
                        : darkMode
                        ? "bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700"
                        : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className={`p-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                darkMode
                   ? "bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700"
                   : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Call to Action - Donor Recognition */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className={`p-10 rounded-3xl border relative overflow-hidden ${
          darkMode
            ? "bg-gradient-to-br from-primary-950/40 to-dark-lighter border-primary-900/30"
            : "bg-gradient-to-br from-primary-50 to-white border-primary-100"
        }`}
      >
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            <Award size={140} />
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-lg ${darkMode ? "bg-primary-900/50" : "bg-primary-100"}`}>
                 <Award className="text-primary-600" size={24} />
              </div>
              <span className="text-xs font-bold tracking-widest uppercase text-primary-500">Premium Feature</span>
            </div>
            <h3
              className={`text-2xl font-extrabold mb-3 ${
                darkMode ? "text-white" : "text-dark"
              }`}
            >
              Donor Recognition Program
            </h3>
            <p
              className={`text-base leading-relaxed max-w-2xl ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Celebrate your most impactful supporters. Our automated loyalty tracking helps you identify and nurture key relationships that drive community resilience.
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-primary-600 border-2 border-primary-100 hover:border-primary-200 px-8 py-4 rounded-2xl font-bold shadow-xl shadow-gray-200/50 hover:shadow-2xl transition-all flex items-center gap-3"
          >
            <Download size={20} />
            <span>View Loyalty Report</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default Donors;