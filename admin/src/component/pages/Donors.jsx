// admin/src/component/pages/Donors.jsx — Clerk-Style UI
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, ChevronLeft, ChevronRight, Users, Award,
  Download, Activity, Star, RefreshCw, Heart, Eye,
  TrendingUp, ShieldCheck, ShieldOff, UserCheck, X,
  Calendar, CreditCard, CheckCircle, Clock, Filter, XCircle, Zap,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { StatsCard } from "../shared";
import {
  fetchDonorStats, fetchAllDonors, fetchDonorDetails,
  updateUserStatus, verifyUser, exportDonors, setFilters,
  resetFilters, selectDonors, selectStats, selectPagination,
  selectFilters, selectLoading,
} from "../../features/donor/adminDonorsSlice";

const fmt = (n) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(n);

const getTierConfig = (amount) => {
  if (amount >= 1000000) return { label: "Platinum", color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950/20", icon: Star };
  if (amount >= 500000)  return { label: "Gold",     color: "text-amber-600",   bg: "bg-amber-50 dark:bg-amber-950/20",   icon: Award };
  if (amount >= 100000)  return { label: "Silver",   color: "text-gray-600",    bg: "bg-gray-100 dark:bg-gray-800",       icon: Users };
  return                        { label: "Bronze",   color: "text-orange-600",  bg: "bg-orange-50 dark:bg-orange-950/20", icon: Heart };
};

const Donors = () => {
  const dispatch = useDispatch();
  const { darkMode } = useTheme();

  const donors       = useSelector(selectDonors);
  const stats        = useSelector(selectStats);
  const pagination   = useSelector(selectPagination);
  const filters      = useSelector(selectFilters);
  const donorsLoading = useSelector(selectLoading);

  const [localSearch,      setLocalSearch]      = useState(filters.search || "");
  const [isLoading,        setIsLoading]        = useState(false);
  const [isRefreshing,     setIsRefreshing]     = useState(false);
  const [detailDonor,      setDetailDonor]      = useState(null);
  const [detailHistory,    setDetailHistory]    = useState([]);
  const [showDetailModal,  setShowDetailModal]  = useState(false);
  const [confirmAction,    setConfirmAction]    = useState(null);
  const [actionLoading,    setActionLoading]    = useState(false);
  const searchDebounceRef = useRef(null);

  useEffect(() => { dispatch(fetchDonorStats()); }, [dispatch]);
  useEffect(() => { dispatch(fetchAllDonors(filters)); }, [dispatch, filters]);

  const internalStats = useMemo(() => [
    { label: "Total Donors",   value: (stats?.totalDonors || 0).toLocaleString(),   subtitle: "Active supporters",    icon: Users,    bgColor: "from-primary-600 to-primary-700", trend: "+12%", trendUp: true },
    { label: "Total Raised",   value: fmt(stats?.totalAmount || 0),                 subtitle: "Foundation impact",    icon: Activity, bgColor: "from-emerald-500 to-emerald-600", trend: "+5.4%", trendUp: true },
    { label: "Lead Partners",  value: (stats?.topTierCount || 0).toLocaleString(),  subtitle: "Platinum & Gold tier", icon: Star,     bgColor: "from-amber-500 to-orange-600" },
    { label: "Retention Rate", value: `${stats?.retentionRate || 0}%`,              subtitle: "Community loyalty",    icon: Zap,      bgColor: "from-primary-700 to-primary-800" },
  ], [stats]);

  const handlePageChange = (p) => {
    if (p >= 1 && p <= pagination.pages) dispatch(setFilters({ ...filters, page: p }));
  };

  const handleExport = async () => {
    setIsLoading(true);
    try { await dispatch(exportDonors(filters)); }
    finally { setIsLoading(false); }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([dispatch(fetchAllDonors(filters)), dispatch(fetchDonorStats())]);
    setIsRefreshing(false);
  };

  const handleSearchChange = useCallback((value) => {
    setLocalSearch(value);
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      dispatch(setFilters({ search: value, page: 1 }));
    }, 300);
  }, [dispatch]);

  const handleViewDetails = (donor) => {
    setDetailDonor(donor);
    setDetailHistory([...(donor.donations || [])].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    setShowDetailModal(true);
  };

  const openConfirm  = (type, donor) => setConfirmAction({ type, donor });
  const closeConfirm = () => { if (!actionLoading) setConfirmAction(null); };

  const handleConfirmedAction = async () => {
    if (!confirmAction) return;
    const { type, donor } = confirmAction;
    setActionLoading(true);
    try {
      if (type === "verify")   await dispatch(verifyUser(donor._id)).unwrap();
      if (type === "suspend")  await dispatch(updateUserStatus({ id: donor._id, status: "suspended" })).unwrap();
      if (type === "activate") await dispatch(updateUserStatus({ id: donor._id, status: "active" })).unwrap();
      dispatch(fetchAllDonors(filters));
      setConfirmAction(null);
    } catch (_) {}
    finally { setActionLoading(false); }
  };

  const hasActiveFilters = !!(filters.search || filters.tier || filters.statusFilter);

  // ── Shared style tokens ──────────────────────────────────────────────────
  const cardBase  = `rounded-xl border ${darkMode ? "bg-dark-lighter border-gray-800/70" : "bg-white border-gray-200/80 shadow-sm"}`;
  const modalBase = `rounded-xl border shadow-xl ${darkMode ? "bg-[#111] border-gray-800" : "bg-white border-gray-200"}`;
  const inputCls  = `px-3 py-2 rounded-lg border text-sm outline-none transition-all ${darkMode ? "bg-gray-800/60 border-gray-700/60 text-white placeholder-gray-500 focus:border-primary-500/50" : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-primary-400"}`;

  return (
    <div className="space-y-6 pb-10">

      {/* ── Header ───────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-xl font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>Donors</h1>
          <p className={`text-sm mt-0.5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            {pagination?.total || 0} total donors
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing || donorsLoading}
            className={`p-2 rounded-lg border text-sm transition-all disabled:opacity-50 ${darkMode ? "bg-dark-lighter border-gray-800 text-gray-400 hover:text-white" : "bg-white border-gray-200 text-gray-600 shadow-sm"}`}
          >
            <RefreshCw size={15} className={isRefreshing || donorsLoading ? "animate-spin" : ""} />
          </button>
          <button
            onClick={handleExport}
            disabled={isLoading}
            className={`px-3 py-2 rounded-lg border text-sm font-medium flex items-center gap-1.5 transition-all disabled:opacity-50 ${darkMode ? "bg-dark-lighter border-gray-800 text-gray-300 hover:text-white" : "bg-white border-gray-200 text-gray-600 shadow-sm"}`}
          >
            <Download size={15} />
            <span className="hidden sm:inline">{isLoading ? "Exporting..." : "Export"}</span>
          </button>
        </div>
      </div>

      {/* ── Stats ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {internalStats.map((s, i) => <StatsCard key={i} {...s} index={i} />)}
      </div>

      {/* ── Filters ──────────────────────────────────────────────────── */}
      <div className={`${cardBase} p-4`}>
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? "text-gray-500" : "text-gray-400"}`} size={15} />
            <input
              type="text"
              placeholder="Search donors by name or email..."
              value={localSearch}
              onChange={(e) => handleSearchChange(e.target.value)}
              className={`${inputCls} w-full pl-9 pr-8`}
            />
            {localSearch && (
              <button onClick={() => handleSearchChange("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Tier */}
          <select
            value={filters.tier || "all"}
            onChange={(e) => dispatch(setFilters({ tier: e.target.value !== "all" ? e.target.value : "", page: 1 }))}
            className={inputCls}
          >
            <option value="all">All Tiers</option>
            <option value="platinum">Platinum (≥₦1M)</option>
            <option value="gold">Gold (≥₦500K)</option>
            <option value="silver">Silver (≥₦100K)</option>
            <option value="bronze">Bronze</option>
          </select>

          {/* Status */}
          <select
            value={filters.statusFilter || "all"}
            onChange={(e) => dispatch(setFilters({ statusFilter: e.target.value !== "all" ? e.target.value : "", page: 1 }))}
            className={inputCls}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
            <option value="verified">Verified</option>
          </select>

          {/* Clear */}
          {hasActiveFilters && (
            <button
              onClick={() => { setLocalSearch(""); dispatch(resetFilters()); }}
              className={`px-3 py-2 rounded-lg border text-sm font-medium flex items-center gap-1.5 transition-all ${darkMode ? "border-red-900/40 text-red-400 hover:bg-red-950/20" : "border-red-200 text-red-600 hover:bg-red-50"}`}
            >
              <Filter size={14} /> Clear
            </button>
          )}
        </div>
      </div>

      {/* ── Table ────────────────────────────────────────────────────── */}
      <div className={`${cardBase} overflow-hidden`}>
        {/* Table label */}
        <div className={`px-5 py-4 border-b flex items-center gap-2.5 ${darkMode ? "border-gray-800/60" : "border-gray-100"}`}>
          <Users size={17} className="text-primary-500" />
          <h2 className={`text-sm font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>Donor List</h2>
          <span className={`ml-auto px-2 py-0.5 rounded-full text-xs font-medium ${darkMode ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-500"}`}>
            {donors?.length || 0} showing
          </span>
        </div>

        {/* Desktop table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${darkMode ? "border-gray-800/60" : "border-gray-50"}`}>
                {["Donor", "Total Donated", "Contributions", "Tier", ""].map((h, i) => (
                  <th key={h + i} className={`px-5 py-3 text-xs font-semibold uppercase tracking-wider text-left ${darkMode ? "text-gray-500" : "text-gray-400"} ${i === 4 ? "text-right" : ""}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="wait">
                {donors && donors.length > 0 ? donors.map((donor, i) => {
                  const tier = getTierConfig(donor.totalDonated);
                  return (
                    <tr key={donor._id} className={`border-b transition-colors ${darkMode ? "border-gray-800/40 hover:bg-gray-800/30" : "border-gray-50 hover:bg-gray-50/70"}`}>
                      {/* Donor */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <img
                            src={donor.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(donor.fullName)}&background=10b981&color=fff`}
                            alt={donor.fullName}
                            className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              {donor.isEmailVerified && (
                                <span title="Verified" className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex-shrink-0">
                                  <CheckCircle size={9} />
                                </span>
                              )}
                              <p className={`text-sm font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>{donor.fullName}</p>
                              {donor.isActive === false && (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-red-50 dark:bg-red-950/20 text-red-600">
                                  <ShieldOff size={9} /> Blocked
                                </span>
                              )}
                            </div>
                            <p className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>{donor.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Total donated */}
                      <td className="px-5 py-3.5">
                        <p className={`text-sm font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>{fmt(donor.totalDonated)}</p>
                        <p className="text-xs text-emerald-500 flex items-center gap-1"><TrendingUp size={10} /> Active</p>
                      </td>

                      {/* Contributions */}
                      <td className="px-5 py-3.5">
                        <p className={`text-sm font-medium ${darkMode ? "text-gray-200" : "text-gray-800"}`}>{donor.donationCount}</p>
                        <p className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>donations</p>
                      </td>

                      {/* Tier */}
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${tier.bg} ${tier.color}`}>
                          <tier.icon size={11} /> {tier.label}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleViewDetails(donor)}
                            className={`p-1.5 rounded-lg transition-all ${darkMode ? "text-gray-400 hover:text-white hover:bg-gray-800" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"}`}
                            title="View details"
                          >
                            <Eye size={14} />
                          </button>

                          {!donor.isGuest && (
                            donor.isEmailVerified ? (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400">
                                <ShieldCheck size={11} /> Verified
                              </span>
                            ) : (
                              <button
                                onClick={() => openConfirm("verify", donor)}
                                className={`px-2 py-1 rounded-lg text-xs font-medium border transition-all ${darkMode ? "bg-amber-950/20 border-amber-900/40 text-amber-400 hover:bg-amber-950/40" : "bg-amber-50 border-amber-200 text-amber-600 hover:bg-amber-100"}`}
                              >
                                <ShieldCheck size={11} className="inline mr-1" />Verify
                              </button>
                            )
                          )}

                          {!donor.isGuest && (
                            donor.isActive === false ? (
                              <button
                                onClick={() => openConfirm("activate", donor)}
                                className={`px-2 py-1 rounded-lg text-xs font-medium border transition-all ${darkMode ? "bg-red-950/20 border-red-900/40 text-red-400 hover:bg-emerald-950/20 hover:text-emerald-400" : "bg-red-50 border-red-200 text-red-600 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200"}`}
                              >
                                <UserCheck size={11} className="inline mr-1" />Blocked
                              </button>
                            ) : (
                              <button
                                onClick={() => openConfirm("suspend", donor)}
                                className={`p-1.5 rounded-lg transition-all ${darkMode ? "text-gray-500 hover:text-red-400 hover:bg-red-950/20" : "text-gray-400 hover:text-red-600 hover:bg-red-50"}`}
                                title="Block donor"
                              >
                                <ShieldOff size={14} />
                              </button>
                            )
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan={5} className={`px-5 py-16 text-center text-sm ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                      <Users size={28} className="mx-auto mb-3 opacity-30" />
                      No donors found. Try adjusting your filters.
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Mobile card view */}
        <div className="lg:hidden divide-y divide-gray-100 dark:divide-gray-800">
          {donors && donors.length > 0 ? donors.map((donor) => {
            const tier = getTierConfig(donor.totalDonated);
            return (
              <div key={donor._id} className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={donor.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(donor.fullName)}&background=10b981&color=fff`}
                      alt={donor.fullName}
                      className="w-9 h-9 rounded-lg object-cover"
                    />
                    <div>
                      <p className={`text-sm font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>{donor.fullName}</p>
                      <p className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>{donor.email}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${tier.bg} ${tier.color} flex-shrink-0`}>
                    <tier.icon size={10} /> {tier.label}
                  </span>
                </div>
                <div className={`grid grid-cols-2 gap-3 p-3 rounded-lg ${darkMode ? "bg-gray-800/40" : "bg-gray-50"}`}>
                  <div>
                    <p className={`text-[10px] font-semibold uppercase ${darkMode ? "text-gray-500" : "text-gray-400"}`}>Total Donated</p>
                    <p className="text-sm font-semibold text-emerald-600">{fmt(donor.totalDonated)}</p>
                  </div>
                  <div>
                    <p className={`text-[10px] font-semibold uppercase ${darkMode ? "text-gray-500" : "text-gray-400"}`}>Donations</p>
                    <p className={`text-sm font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>{donor.donationCount}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleViewDetails(donor)} className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-all ${darkMode ? "border-gray-700 text-gray-300" : "border-gray-200 text-gray-600"}`}>
                    <Eye size={12} className="inline mr-1" /> Details
                  </button>
                </div>
              </div>
            );
          }) : (
            <div className={`p-12 text-center text-sm ${darkMode ? "text-gray-500" : "text-gray-400"}`}>No donors found.</div>
          )}
        </div>

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className={`px-5 py-3.5 border-t flex items-center justify-between ${darkMode ? "border-gray-800/60" : "border-gray-100"}`}>
            <p className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
              Page {pagination.page} of {pagination.pages} · {pagination.total} total
            </p>
            <div className="flex items-center gap-1">
              <button onClick={() => handlePageChange(pagination.page - 1)} disabled={pagination.page === 1}
                className={`p-1.5 rounded-lg transition-all disabled:opacity-40 ${darkMode ? "hover:bg-gray-800 text-gray-400" : "hover:bg-gray-100 text-gray-500"}`}>
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: Math.min(pagination.pages, 5) }, (_, i) => {
                let p;
                if (pagination.pages <= 5)              p = i + 1;
                else if (pagination.page <= 3)          p = i + 1;
                else if (pagination.page >= pagination.pages - 2) p = pagination.pages - 4 + i;
                else                                    p = pagination.page - 2 + i;
                return (
                  <button key={i} onClick={() => handlePageChange(p)}
                    className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                      pagination.page === p ? "bg-primary-500 text-white" : darkMode ? "bg-gray-800 text-gray-400 hover:text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}>
                    {p}
                  </button>
                );
              })}
              <button onClick={() => handlePageChange(pagination.page + 1)} disabled={pagination.page === pagination.pages}
                className={`p-1.5 rounded-lg transition-all disabled:opacity-40 ${darkMode ? "hover:bg-gray-800 text-gray-400" : "hover:bg-gray-100 text-gray-500"}`}>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Donor Recognition note ───────────────────────────────────── */}
      <div className={`${cardBase} p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}>
        <div className="flex items-start gap-3">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${darkMode ? "bg-primary-950/30" : "bg-primary-50"}`}>
            <Award size={18} className="text-primary-600" />
          </div>
          <div>
            <p className={`text-sm font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>Donor Recognition Program</p>
            <p className={`text-xs mt-0.5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              Celebrate your most impactful supporters and nurture key relationships.
            </p>
          </div>
        </div>
        <button onClick={handleExport} disabled={isLoading}
          className={`px-4 py-2 rounded-lg border text-sm font-medium flex items-center gap-1.5 flex-shrink-0 disabled:opacity-50 ${darkMode ? "border-gray-700 text-gray-300 hover:bg-gray-800" : "border-gray-200 text-gray-700 hover:bg-gray-50"}`}>
          <Download size={14} /> {isLoading ? "Generating..." : "Loyalty Report"}
        </button>
      </div>

      {/* ── Donor Detail — Clerk-style slide-over ────────────────────── */}
      <AnimatePresence>
        {showDetailModal && detailDonor && (() => {
          const d = detailDonor;
          const tier = getTierConfig(d.totalDonated || 0);
          const TierIcon = tier.icon;
          const isActive    = d.status === "active";
          const isSuspended = d.status === "suspended";
          const isVerified  = d.isVerified;
          const avatarUrl   = d.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(d.fullName)}&background=10b981&color=fff&bold=true`;

          const SectionLabel = ({ children }) => (
            <p className={`text-[10px] font-bold uppercase tracking-widest mb-3 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
              {children}
            </p>
          );
          const Divider = () => <div className={`my-5 border-t ${darkMode ? "border-gray-800" : "border-gray-100"}`} />;

          return (
            <div className="fixed inset-0 z-[120] flex">
              {/* Scrim */}
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowDetailModal(false)} />

              {/* Slide-over panel */}
              <motion.div
                initial={{ x: "100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "100%", opacity: 0 }}
                transition={{ type: "spring", stiffness: 320, damping: 32 }}
                className={`relative ml-auto h-full w-full max-w-md flex flex-col overflow-hidden shadow-2xl ${darkMode ? "bg-[#0e0e0e] border-l border-gray-800" : "bg-white border-l border-gray-200"}`}
              >
                {/* ── Panel header ── */}
                <div className={`flex items-center justify-between px-6 py-4 border-b flex-shrink-0 ${darkMode ? "border-gray-800 bg-[#111]" : "border-gray-100 bg-white"}`}>
                  <div>
                    <p className={`text-[10px] font-bold uppercase tracking-widest ${darkMode ? "text-gray-500" : "text-gray-400"}`}>Donor Profile</p>
                    <p className={`text-sm font-semibold mt-0.5 font-mono ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                      {d._id?.slice(-8)?.toUpperCase()}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className={`p-2 rounded-lg transition-all ${darkMode ? "text-gray-400 hover:bg-gray-800 hover:text-white" : "text-gray-400 hover:bg-gray-100 hover:text-gray-700"}`}
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* ── Scrollable body ── */}
                <div className="flex-1 overflow-y-auto">

                  {/* ── Hero: avatar + name + badges ── */}
                  <div className={`px-6 py-8 text-center border-b ${darkMode ? "border-gray-800 bg-[#111]" : "border-gray-100 bg-gray-50"}`}>
                    <div className="relative inline-block mb-4">
                      <img
                        src={avatarUrl}
                        alt={d.fullName}
                        className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white dark:ring-gray-900 shadow-lg"
                      />
                      {isVerified && (
                        <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center shadow">
                          <ShieldCheck size={12} className="text-white" />
                        </div>
                      )}
                    </div>
                    <h2 className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>{d.fullName}</h2>
                    <p className={`text-sm mt-0.5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{d.email}</p>
                    {d.phone && (
                      <p className={`text-xs mt-1 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>{d.phone}</p>
                    )}

                    {/* Badges row */}
                    <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
                      {/* Tier */}
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${tier.bg} ${tier.color}`}>
                        <TierIcon size={11} /> {tier.label}
                      </div>
                      {/* Account status */}
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                        isActive    ? (darkMode ? "bg-emerald-950/40 text-emerald-400" : "bg-emerald-50 text-emerald-700") :
                        isSuspended ? (darkMode ? "bg-red-950/40 text-red-400"         : "bg-red-50 text-red-700") :
                                      (darkMode ? "bg-gray-800 text-gray-400"           : "bg-gray-100 text-gray-600")
                      }`}>
                        {isActive ? <CheckCircle size={11} /> : isSuspended ? <XCircle size={11} /> : <Clock size={11} />}
                        {isActive ? "Active" : isSuspended ? "Suspended" : d.status}
                      </div>
                      {isVerified && (
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${darkMode ? "bg-blue-950/40 text-blue-400" : "bg-blue-50 text-blue-700"}`}>
                          <ShieldCheck size={11} /> Verified
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="px-6 py-5">

                    {/* ── Stats grid ── */}
                    <SectionLabel>Impact Summary</SectionLabel>
                    <div className="grid grid-cols-2 gap-3 mb-5">
                      {[
                        { label: "Total Donated",  value: fmt(d.totalDonated || 0),      icon: CreditCard, color: "text-emerald-600", bg: darkMode ? "bg-emerald-950/30" : "bg-emerald-50" },
                        { label: "Donations Made", value: `${d.donationCount || 0}`,      icon: Heart,      color: "text-rose-500",    bg: darkMode ? "bg-rose-950/30"    : "bg-rose-50" },
                        { label: "First Donation", value: d.firstDonation ? new Date(d.firstDonation).toLocaleDateString("en-NG", { month: "short", day: "numeric", year: "numeric" }) : "N/A", icon: Calendar, color: "text-amber-500", bg: darkMode ? "bg-amber-950/30" : "bg-amber-50" },
                        { label: "Last Donation",  value: d.lastDonation  ? new Date(d.lastDonation).toLocaleDateString("en-NG",  { month: "short", day: "numeric", year: "numeric" }) : "N/A", icon: Clock,    color: "text-blue-500",  bg: darkMode ? "bg-blue-950/30"  : "bg-blue-50" },
                      ].map(({ label, value, icon: Icon, color, bg }) => (
                        <div key={label} className={`p-4 rounded-xl border ${darkMode ? "border-gray-800 bg-gray-900/60" : "border-gray-100 bg-gray-50"}`}>
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${bg}`}>
                            <Icon size={15} className={color} />
                          </div>
                          <p className={`text-[11px] font-medium mb-0.5 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>{label}</p>
                          <p className={`text-sm font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>{value}</p>
                        </div>
                      ))}
                    </div>

                    <Divider />

                    {/* ── Account info ── */}
                    <SectionLabel>Account Details</SectionLabel>
                    <div className={`divide-y rounded-xl overflow-hidden mb-5 ${darkMode ? "divide-gray-800 bg-gray-900/60 border border-gray-800" : "divide-gray-100 bg-gray-50 border border-gray-100"}`}>
                      {[
                        { label: "Member since", value: d.createdAt ? new Date(d.createdAt).toLocaleDateString("en-NG", { year: "numeric", month: "long", day: "numeric" }) : "—" },
                        { label: "Role",          value: d.role || "donor" },
                        { label: "Verification",  value: isVerified ? "Verified" : "Unverified" },
                        { label: "Account",       value: isActive ? "Active" : isSuspended ? "Suspended" : d.status },
                      ].map(({ label, value }) => (
                        <div key={label} className="flex items-center justify-between px-4 py-2.5">
                          <span className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{label}</span>
                          <span className={`text-xs font-medium capitalize ${darkMode ? "text-gray-200" : "text-gray-800"}`}>{value}</span>
                        </div>
                      ))}
                    </div>

                    <Divider />

                    {/* ── Donation history timeline ── */}
                    <SectionLabel>Donation History</SectionLabel>
                    {detailHistory.length === 0 ? (
                      <div className={`text-center py-8 rounded-xl border ${darkMode ? "border-gray-800 bg-gray-900/40" : "border-gray-100 bg-gray-50"}`}>
                        <Heart size={28} className={`mx-auto mb-2 ${darkMode ? "text-gray-700" : "text-gray-300"}`} />
                        <p className={`text-sm ${darkMode ? "text-gray-500" : "text-gray-400"}`}>No donations yet</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {detailHistory.slice(0, 10).map((don, idx, arr) => (
                          <div key={don._id} className="flex items-start gap-3">
                            <div className="flex flex-col items-center flex-shrink-0">
                              <div className={`w-2.5 h-2.5 rounded-full mt-1 ${
                                don.approvalStatus === "approved" ? "bg-emerald-500" :
                                don.approvalStatus === "rejected" ? "bg-red-500" :
                                "bg-amber-400"
                              }`} />
                              {idx < arr.length - 1 && (
                                <div className={`w-px flex-1 mt-1 min-h-[24px] ${darkMode ? "bg-gray-800" : "bg-gray-200"}`} />
                              )}
                            </div>
                            <div className={`flex-1 pb-2 p-3 rounded-xl border ${darkMode ? "bg-gray-900/60 border-gray-800" : "bg-gray-50 border-gray-100"}`}>
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <p className={`text-sm font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>{fmt(don.amount)}</p>
                                  <p className={`text-xs mt-0.5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{don.campaign?.title || "General Donation"}</p>
                                  <p className={`text-[11px] mt-0.5 ${darkMode ? "text-gray-600" : "text-gray-400"}`}>
                                    {new Date(don.createdAt).toLocaleDateString("en-NG", { month: "short", day: "numeric", year: "numeric" })}
                                  </p>
                                </div>
                                <div className={`flex-shrink-0 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                                  don.approvalStatus === "approved" ? (darkMode ? "bg-emerald-950/50 text-emerald-400" : "bg-emerald-50 text-emerald-700") :
                                  don.approvalStatus === "rejected" ? (darkMode ? "bg-red-950/50 text-red-400"         : "bg-red-50 text-red-700") :
                                                                      (darkMode ? "bg-amber-950/50 text-amber-400"     : "bg-amber-50 text-amber-700")
                                }`}>
                                  {don.approvalStatus || "pending"}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                        {detailHistory.length > 10 && (
                          <p className={`text-xs text-center ${darkMode ? "text-gray-600" : "text-gray-400"}`}>
                            +{detailHistory.length - 10} more donations
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* ── Sticky action footer ── */}
                <div className={`flex-shrink-0 px-6 py-4 border-t flex gap-2 ${darkMode ? "border-gray-800 bg-[#111]" : "border-gray-100 bg-white"}`}>
                  {!isVerified && (
                    <button
                      onClick={() => { setShowDetailModal(false); openConfirm("verify", d); }}
                      className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-1.5 ${darkMode ? "bg-blue-900/50 hover:bg-blue-900/70 text-blue-300 border border-blue-800" : "bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200"}`}
                    >
                      <ShieldCheck size={14} /> Verify
                    </button>
                  )}
                  {isActive ? (
                    <button
                      onClick={() => { setShowDetailModal(false); openConfirm("suspend", d); }}
                      className="flex-1 py-2.5 rounded-lg text-sm font-semibold bg-red-600 hover:bg-red-700 text-white transition-all flex items-center justify-center gap-1.5"
                    >
                      <ShieldOff size={14} /> Block
                    </button>
                  ) : isSuspended ? (
                    <button
                      onClick={() => { setShowDetailModal(false); openConfirm("activate", d); }}
                      className="flex-1 py-2.5 rounded-lg text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-all flex items-center justify-center gap-1.5"
                    >
                      <UserCheck size={14} /> Activate
                    </button>
                  ) : null}
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

      {/* ── Confirm Action Modal ─────────────────────────────────────── */}
      <AnimatePresence>
        {confirmAction && (
          <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }}
              className={`w-full max-w-sm ${modalBase} p-6`}
            >
              <div className="flex items-start gap-3 mb-5">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  confirmAction.type === "suspend"  ? (darkMode ? "bg-red-950/30" : "bg-red-50") :
                  confirmAction.type === "activate" ? (darkMode ? "bg-emerald-950/30" : "bg-emerald-50") :
                                                     (darkMode ? "bg-primary-950/30" : "bg-primary-50")
                }`}>
                  {confirmAction.type === "suspend"  ? <ShieldOff  size={18} className="text-red-600" /> :
                   confirmAction.type === "activate" ? <UserCheck  size={18} className="text-emerald-600" /> :
                                                      <ShieldCheck size={18} className="text-primary-600" />}
                </div>
                <div>
                  <h3 className={`text-sm font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                    {confirmAction.type === "suspend" ? "Block Donor?" : confirmAction.type === "activate" ? "Activate Donor?" : "Verify Donor?"}
                  </h3>
                  <p className={`text-xs mt-0.5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                    {confirmAction.type === "suspend"
                      ? `${confirmAction.donor.fullName} will be blocked and lose account access.`
                      : confirmAction.type === "activate"
                      ? `${confirmAction.donor.fullName}'s account will be reactivated.`
                      : `${confirmAction.donor.fullName} will be marked as a verified donor.`}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={closeConfirm} disabled={actionLoading} className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${darkMode ? "border-gray-700 text-gray-300 hover:bg-gray-800" : "border-gray-200 text-gray-700 hover:bg-gray-50"}`}>
                  Cancel
                </button>
                <button onClick={handleConfirmedAction} disabled={actionLoading} className={`flex-1 py-2 rounded-lg text-sm font-medium text-white transition-all disabled:opacity-60 flex items-center justify-center gap-1.5 ${
                  confirmAction.type === "suspend" ? "bg-red-600 hover:bg-red-700" :
                  confirmAction.type === "activate" ? "bg-emerald-600 hover:bg-emerald-700" :
                  "bg-primary-600 hover:bg-primary-700"
                }`}>
                  {actionLoading && <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  {confirmAction.type === "suspend" ? "Block" : confirmAction.type === "activate" ? "Activate" : "Verify"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Donors;