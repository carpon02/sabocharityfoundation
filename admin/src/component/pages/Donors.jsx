// admin/src/component/pages/Donors.jsx - Donor Management Hub
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Users,
  Award,
  Download,
  Filter,
  Activity,
  Star,
  Zap,
  RefreshCw,
  BarChart3,
  Heart,
  Eye,
  Trash2,
  Edit,
  TrendingUp,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { StatsCard } from "../shared";
import {
  fetchDonorStats,
  fetchAllDonors,
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
                              <h4
                                className={`font-bold text-sm mb-1 group-hover:text-primary-600 transition-colors ${
                                  darkMode ? "text-white" : "text-dark"
                                }`}
                              >
                                {donor.fullName}
                              </h4>
                              <p
                                className={`text-xs font-medium ${
                                  darkMode ? "text-gray-500" : "text-gray-500"
                                }`}
                              >
                                {donor.email}
                              </p>
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
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className={`p-2.5 rounded-xl transition-all ${
                                darkMode
                                  ? "bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700"
                                  : "bg-white text-gray-500 hover:text-primary-600 hover:bg-primary-50 shadow-sm border border-gray-100"
                              }`}
                              title="View details"
                            >
                              <Eye size={18} />
                            </motion.button>
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