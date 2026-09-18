// pages/user/MyDonation.jsx — Clerk-style redesign
import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import { useTheme } from "../../context/ThemeContext";
import {
  Heart,
  Wallet,
  Download,
  Share2,
  Search,
  RefreshCw,
  CheckCircle2,
  Clock,
  XCircle,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Target,
} from "lucide-react";
import {
  fetchMyDonations,
  downloadReceipt,
  updateFilters,
  setCurrentPage,
} from "../../features/donation/donationSlice";

// ── Status config ─────────────────────────────────────────────────────────────
const STATUS = {
  completed:  { label: "Completed",  dot: "bg-emerald-500", text: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
  approved:   { label: "Approved",   dot: "bg-emerald-500", text: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
  verified:   { label: "Verified",   dot: "bg-blue-500",    text: "text-blue-600",    bg: "bg-blue-50 dark:bg-blue-900/20" },
  processing: { label: "Processing", dot: "bg-amber-400",   text: "text-amber-600",   bg: "bg-amber-50 dark:bg-amber-900/20" },
  pending:    { label: "Pending",    dot: "bg-amber-400",   text: "text-amber-600",   bg: "bg-amber-50 dark:bg-amber-900/20" },
  failed:     { label: "Failed",     dot: "bg-red-500",     text: "text-red-600",     bg: "bg-red-50 dark:bg-red-900/20" },
};
const getStatus = (s) => STATUS[s] || STATUS.pending;

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

// ── Stat Mini Card ────────────────────────────────────────────────────────────
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

// ── Donation Row ──────────────────────────────────────────────────────────────
const DonationRow = ({ donation, idx }) => {
  const { darkMode } = useTheme();
  const dispatch = useDispatch();
  const cfg = getStatus(donation.status);
  const image =
    donation.campaign?.images?.[0]?.url ||
    donation.campaign?.images?.[0] ||
    null;

  const handleShare = () => {
    const text = `I supported "${donation.campaign?.title || "Sabo Ibadan"}" — join me!`;
    const url = `${window.location.origin}/campaigns/${donation.campaign?._id || ""}`;
    if (navigator.share) {
      navigator.share({ title: "Sabo Ibadan Impact", text, url });
    } else {
      navigator.clipboard.writeText(`${text} ${url}`);
      toast.success("Link copied!");
    }
  };

  return (
    <div
      className={`flex items-center gap-4 px-4 py-3.5 border-b last:border-0 transition-colors ${
        darkMode
          ? "border-gray-800 hover:bg-gray-800/30"
          : "border-gray-100 hover:bg-gray-50"
      }`}
    >
      {/* Campaign thumb */}
      <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        {image ? (
          <img src={image} alt="" className="w-full h-full object-cover" />
        ) : (
          <Heart size={14} className="text-emerald-500" />
        )}
      </div>

      {/* Campaign name + ID */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${darkMode ? "text-white" : "text-gray-900"}`}>
          {donation.campaign?.title || "General Donation"}
        </p>
        <p className="text-[11px] text-gray-400 mt-0.5 font-mono">
          #{(donation.donationId || donation._id).substring(0, 10).toUpperCase()}
        </p>
      </div>

      {/* Status */}
      <div className="hidden sm:flex items-center gap-1.5 shrink-0">
        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
        <span className={`text-[11px] font-medium ${cfg.text}`}>{cfg.label}</span>
      </div>

      {/* Date */}
      <p className="hidden md:block text-[12px] text-gray-400 shrink-0 w-24 text-right">
        {formatDate(donation.createdAt)}
      </p>

      {/* Amount */}
      <p className={`text-sm font-semibold shrink-0 w-28 text-right ${darkMode ? "text-white" : "text-gray-900"}`}>
        {formatCurrency(donation.amount)}
      </p>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() => dispatch(downloadReceipt(donation._id))}
          title="Download receipt"
          className={`w-7 h-7 rounded-md flex items-center justify-center transition-colors ${
            darkMode ? "hover:bg-gray-700 text-gray-500 hover:text-gray-200" : "hover:bg-gray-100 text-gray-400 hover:text-gray-700"
          }`}
        >
          <Download size={13} />
        </button>
        <button
          onClick={handleShare}
          title="Share"
          className={`w-7 h-7 rounded-md flex items-center justify-center transition-colors ${
            darkMode ? "hover:bg-gray-700 text-gray-500 hover:text-gray-200" : "hover:bg-gray-100 text-gray-400 hover:text-gray-700"
          }`}
        >
          <Share2 size={13} />
        </button>
      </div>
    </div>
  );
};

// ── Main ──────────────────────────────────────────────────────────────────────
const MyDonations = () => {
  const dispatch = useDispatch();
  const { darkMode } = useTheme();
  const { donations, stats, loading, filters, pagination, currentPage } =
    useSelector((s) => s.donations);
  const { status: filterStatus, search: searchQuery, sortBy } = filters;
  const { pages: totalPages } = pagination;

  useEffect(() => {
    dispatch(fetchMyDonations({ page: currentPage }));
  }, [dispatch, currentPage, filterStatus, sortBy]);

  const miniStats = [
    { icon: Wallet,   label: "Total donated",  value: formatCurrency(stats?.totalDonated || 0),            iconBg: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400" },
    { icon: Target,   label: "Donations made",  value: (stats?.totalCount || 0).toLocaleString(),           iconBg: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" },
    { icon: RefreshCw,label: "Recurring",       value: (stats?.recurring || 0).toLocaleString(),            iconBg: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400" },
    { icon: BarChart3, label: "Verification",   value: "Authentic",                                          iconBg: "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400" },
  ];

  // Filtered donations for search
  const displayed = useMemo(() => {
    if (!searchQuery) return donations;
    return donations.filter((d) =>
      (d.campaign?.title || "").toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [donations, searchQuery]);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* ── Header ────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
            Donations
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">Your complete giving history</p>
        </div>
        <button
          onClick={() => dispatch(fetchMyDonations({ page: 1 }))}
          disabled={loading}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
            darkMode
              ? "border-gray-700 text-gray-400 hover:text-white"
              : "border-gray-200 text-gray-600 hover:text-gray-900"
          } disabled:opacity-50`}
        >
          <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* ── Mini Stats ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {loading
          ? [1,2,3,4].map((i) => <Skeleton key={i} className="h-16" />)
          : miniStats.map((s) => <MiniStat key={s.label} {...s} />)
        }
      </div>

      {/* ── Table Card ────────────────────────────────────────────────── */}
      <Card>
        {/* Toolbar */}
        <div className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-3 border-b ${darkMode ? "border-gray-800" : "border-gray-100"}`}>
          {/* Search */}
          <div className="relative flex-1">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by campaign name…"
              value={searchQuery}
              onChange={(e) => dispatch(updateFilters({ search: e.target.value }))}
              className={`w-full pl-8 pr-3 py-2 text-sm rounded-lg border outline-none transition-colors ${
                darkMode
                  ? "bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:border-gray-600"
                  : "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-gray-300 focus:bg-white"
              }`}
            />
          </div>
          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => dispatch(updateFilters({ sortBy: e.target.value }))}
            className={`px-3 py-2 text-sm rounded-lg border outline-none cursor-pointer ${
              darkMode
                ? "bg-gray-900 border-gray-700 text-gray-300"
                : "bg-white border-gray-200 text-gray-700"
            }`}
          >
            <option value="createdAt">Newest first</option>
            <option value="amount">Highest amount</option>
          </select>
          {/* Status filter */}
          <select
            value={filterStatus || "all"}
            onChange={(e) => dispatch(updateFilters({ status: e.target.value === "all" ? "" : e.target.value }))}
            className={`px-3 py-2 text-sm rounded-lg border outline-none cursor-pointer ${
              darkMode
                ? "bg-gray-900 border-gray-700 text-gray-300"
                : "bg-white border-gray-200 text-gray-700"
            }`}
          >
            <option value="all">All statuses</option>
            <option value="completed">Completed</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        {/* Table header */}
        <div className={`hidden md:grid grid-cols-[40px_1fr_120px_100px_110px_64px] items-center gap-4 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-widest ${darkMode ? "text-gray-600 border-b border-gray-800" : "text-gray-400 border-b border-gray-100"}`}>
          <span />
          <span>Campaign</span>
          <span>Status</span>
          <span className="text-right">Date</span>
          <span className="text-right">Amount</span>
          <span />
        </div>

        {/* Rows */}
        <div>
          {loading && !donations.length ? (
            [1,2,3,4,5].map((i) => <Skeleton key={i} className="h-14 mx-3 mb-2" />)
          ) : displayed.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Heart size={32} className="text-gray-300 mb-3" />
              <p className={`font-medium text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                {searchQuery ? "No donations match your search" : "No donations yet"}
              </p>
              {!searchQuery && (
                <Link
                  to="/campaigns"
                  className="mt-3 text-sm text-emerald-600 font-medium hover:underline"
                >
                  Browse campaigns →
                </Link>
              )}
            </div>
          ) : (
            displayed.map((d, idx) => (
              <DonationRow key={d._id} donation={d} idx={idx} />
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className={`flex items-center justify-between px-4 py-3 border-t ${darkMode ? "border-gray-800" : "border-gray-100"}`}>
            <p className="text-[12px] text-gray-400">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex items-center gap-1">
              <button
                disabled={currentPage <= 1}
                onClick={() => dispatch(setCurrentPage(currentPage - 1))}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors disabled:opacity-40 ${
                  darkMode ? "hover:bg-gray-800 text-gray-400" : "hover:bg-gray-100 text-gray-600"
                }`}
              >
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => dispatch(setCurrentPage(p))}
                  className={`w-8 h-8 rounded-lg text-[12px] font-medium transition-colors ${
                    currentPage === p
                      ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                      : darkMode
                        ? "hover:bg-gray-800 text-gray-400"
                        : "hover:bg-gray-100 text-gray-600"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                disabled={currentPage >= totalPages}
                onClick={() => dispatch(setCurrentPage(currentPage + 1))}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors disabled:opacity-40 ${
                  darkMode ? "hover:bg-gray-800 text-gray-400" : "hover:bg-gray-100 text-gray-600"
                }`}
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default MyDonations;
