// pages/MyDonations.jsx - Foundation Giving History
import React, { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import { useTheme } from "../../context/ThemeContext";
import {
  Calendar,
  RefreshCcw,
  Target,
  Wallet,
  Download,
  Share2,
  TrendingUp,
  BarChart3,
  Heart,
  Users,
  Zap,
  ArrowRight,
  Search,
  Filter,
  CheckCircle,
  Clock,
  XCircle,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";
import {
  fetchMyDonations,
  downloadReceipt,
  updateFilters,
  setCurrentPage,
} from "../../features/donation/donationSlice";

// Status Configuration for Premium Look
const getStatusConfig = (status) => {
  const configs = {
    completed: {
      icon: CheckCircle,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      label: "Success",
      border: "border-emerald-500/20",
    },
    approved: {
      icon: CheckCircle,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      label: "Approved",
      border: "border-emerald-500/20",
    },
    verified: {
      icon: ShieldCheck,
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
      label: "Awaiting Approval",
      border: "border-emerald-400/20",
    },
    processing: {
      icon: RefreshCcw,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      label: "Processing",
      border: "border-amber-500/20",
      animate: "animate-spin",
    },
    pending: {
      icon: Clock,
      label: "Pending",
      border: "border-emerald-500/20",
    },
    failed: {
      icon: XCircle,
      color: "text-rose-500",
      bg: "bg-rose-500/10",
      label: "Failed",
      border: "border-rose-500/20",
    },
  };
  return configs[status] || configs.pending;
};

// Component: Modern Analytics Card
const AnalyticsCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  darkMode,
  delay = 0,
}) => {
  if (!Icon) return null;
  const MotionDiv = motion.div;

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`relative overflow-hidden rounded-2xl border backdrop-blur-md p-6 flex flex-col justify-between min-h-[140px] transition-all duration-300 ${
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
          className={`w-2 h-2 rounded-full ${color.replace(
            "text-",
            "bg-",
          )} animate-pulse`}
        />
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
    </MotionDiv>
  );
};

// Component: Donation Record (Simplified Card)
const DonationRecord = ({ donation, dispatch, darkMode, idx = 0 }) => {
  const statusConfig = getStatusConfig(donation.status);
  const MotionDiv = motion.div;

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.05 }}
      className={`group relative p-5 rounded-2xl border transition-all duration-300 ${
        darkMode
          ? "bg-gray-950 hover:bg-gray-900 border-gray-800"
          : "bg-white hover:bg-gray-50 border-gray-100 shadow-xl shadow-gray-200/20"
      }`}
    >
      <div className="flex flex-col lg:flex-row gap-6 items-center">
        {/* Campaign Info */}
        <div className="flex items-center gap-5 flex-1 w-full">
          <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-gray-800/10">
            <img
              src={
                donation.campaign?.images?.[0]?.url ||
                donation.campaign?.images?.[0] ||
                "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=100&h=100&fit=crop"
              }
              alt=""
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h4
              className={`text-sm font-bold tracking-tight truncate ${
                darkMode ? "text-white" : "text-gray-950"
              }`}
            >
              {donation.campaign?.title || "Deleted Project"}
            </h4>
            <div className="flex items-center gap-3 mt-1.5">
              <span
                className={`${statusConfig.bg} ${statusConfig.color} px-3 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest border border-current/10`}
              >
                {statusConfig.label}
              </span>
              <span
                className={`text-[10px] font-medium ${darkMode ? "text-gray-600" : "text-gray-400"}`}
              >
                ID: #
                {donation.donationId ||
                  donation._id.substring(0, 8).toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Transaction Pulse */}
        <div className="flex items-center justify-between w-full lg:w-auto lg:gap-12 lg:border-l lg:pl-12 border-gray-800/10">
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">
              Amount
            </span>
            <span
              className={`text-lg font-bold ${darkMode ? "text-white" : "text-emerald-600"}`}
            >
              {formatCurrency(donation.amount)}
            </span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">
              Timeline
            </span>
            <span
              className={`text-[11px] font-semibold ${darkMode ? "text-gray-500" : "text-gray-600"}`}
            >
              {formatDate(donation.createdAt)}
            </span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => dispatch(downloadReceipt(donation._id))}
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                darkMode
                  ? "bg-gray-900 text-gray-500 hover:text-white"
                  : "bg-gray-50 text-gray-400 hover:text-gray-600 hover:bg-white border border-gray-100"
              }`}
              title="Download Receipt"
            >
              <Download size={16} />
            </button>
            <button
              onClick={() => {
                const shareText = `I just supported the project "${donation.campaign?.title || "Sabo Ibadan"}" on Sabo Ibadan Youth Charity Foundation! Support the cause.`;
                const shareUrl = `${window.location.origin}/campaigns/${donation.campaign?._id || ""}`;

                if (navigator.share) {
                  navigator.share({
                    title: "Sabo Ibadan Impact",
                    text: shareText,
                    url: shareUrl,
                  });
                } else {
                  navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
                  toast.success("Link Copied to Clipboard");
                }
              }}
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                darkMode
                  ? "bg-gray-900 text-gray-500 hover:text-white"
                  : "bg-gray-50 text-gray-400 hover:text-gray-600 hover:bg-white border border-gray-100"
              }`}
              title="Share Contribution"
            >
              <Share2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </MotionDiv>
  );
};

// Main Component
const MyDonations = () => {
  const dispatch = useDispatch();
  const { darkMode } = useTheme();
  const { donations, stats, loading, filters, pagination, currentPage } =
    useSelector((state) => state.donations);

  const { status: filterStatus, search: searchQuery, sortBy } = filters;
  const { pages: totalPages } = pagination;

  useEffect(() => {
    dispatch(fetchMyDonations({ page: currentPage }));
  }, [dispatch, currentPage, filterStatus, sortBy]);

  const internalStats = useMemo(
    () => [
      {
        title: "Contribution Total",
        value: formatCurrency(stats?.totalDonated || 0),
        subtitle: "Verified Community Impact",
        icon: Wallet,
        color: "text-emerald-500",
      },
      {
        title: "Donation Events",
        value: (stats?.totalCount || 0).toLocaleString(),
        subtitle: "Acts of Support",
        icon: Target,
        color: "text-emerald-600",
      },
      {
        title: "Monthly Support",
        value: (stats?.recurring || 0).toLocaleString(),
        subtitle: "Continuous Commitments",
        icon: RefreshCcw,
        color: "text-emerald-500",
      },
      {
        title: "Trust Verification",
        value: "Authentic",
        subtitle: "System Verified",
        icon: BarChart3,
        color: "text-blue-500",
      },
    ],
    [stats],
  );

  return (
    <div className="space-y-12 sm:space-y-12 pb-12 max-w-[1600px] mx-auto">
      {/* Dynamic Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div>
          <h1
            className={`text-3xl lg:text-4xl font-bold tracking-tight ${
              darkMode ? "text-white" : "text-gray-950"
            }`}
          >
            Contribution History
          </h1>
          <div className="flex items-center gap-3 mt-3">
            <div className="w-10 h-1 bg-emerald-500 rounded-full" />
            <span
              className={`text-[11px] font-bold uppercase tracking-widest ${
                darkMode ? "text-gray-500" : "text-gray-400"
              }`}
            >
              Donor Intelligence • Impact Tracking
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => dispatch(fetchMyDonations({ page: 1 }))}
            className={`px-6 py-3 rounded-xl flex items-center gap-3 font-bold uppercase tracking-widest text-[10px] transition-all border ${
              darkMode
                ? "bg-gray-950 border-gray-800 text-gray-500 hover:text-white"
                : "bg-white border-gray-100 text-gray-500 hover:text-gray-950 shadow-lg shadow-gray-200/20"
            }`}
          >
            <RefreshCcw size={14} className={loading ? "animate-spin" : ""} />{" "}
            Update Records
          </button>
        </div>
      </div>

      {/* Foundation Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        {internalStats.map((stat, i) => (
          <AnalyticsCard
            key={i}
            {...stat}
            darkMode={darkMode}
            delay={i * 0.1}
          />
        ))}
      </div>

      <div
        className={`p-2 rounded-2xl border backdrop-blur-md flex flex-col md:flex-row items-center gap-4 transition-all duration-700 ${
          darkMode
            ? "bg-gray-950 border-gray-800 shadow-2xl"
            : "bg-white border-gray-100 shadow-xl shadow-gray-200/10"
        }`}
      >
        <div className="relative flex-1 w-full flex items-center">
          <Search className="absolute left-6 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search donations by campaign name..."
            value={searchQuery}
            onChange={(e) =>
              dispatch(updateFilters({ search: e.target.value }))
            }
            className={`w-full pl-14 pr-6 py-4 rounded-xl border font-bold text-sm transition-all outline-none ${
              darkMode
                ? "bg-gray-900 border-gray-800 text-white focus:border-emerald-500/50"
                : "bg-gray-50 border-gray-100 text-gray-950 focus:border-emerald-500/50"
            }`}
          />
        </div>
        <div className="flex gap-4 w-full md:w-auto px-2 pb-2 md:pb-0">
          <div className="relative flex-1 sm:flex-initial">
            <select
              value={sortBy}
              onChange={(e) =>
                dispatch(updateFilters({ sortBy: e.target.value }))
              }
              className={`w-full px-8 py-4 rounded-xl border font-bold uppercase tracking-widest text-[10px] outline-none appearance-none cursor-pointer pr-12 min-w-[160px] ${
                darkMode
                  ? "bg-gray-900 border-gray-800 text-gray-400"
                  : "bg-gray-50 border-gray-100 text-gray-500"
              }`}
            >
              <option value="createdAt">Sort by Date</option>
              <option value="amount">Highest Amount</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>

          <button
            className={`px-8 py-4 rounded-xl border font-bold uppercase tracking-widest text-[10px] transition-all flex items-center gap-2 ${
              darkMode
                ? "bg-gray-900 border-gray-800 text-gray-500 hover:text-white"
                : "bg-gray-100 border-gray-100 text-gray-400 hover:text-gray-950"
            }`}
          >
            <Filter size={14} /> Refine
          </button>
        </div>
      </div>

      {/* Audit List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {loading && !donations.length ? (
            [1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`h-24 w-full rounded-2xl animate-pulse ${
                  darkMode ? "bg-gray-900" : "bg-gray-100/50"
                }`}
              />
            ))
          ) : donations.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-20 text-center"
            >
              <div
                className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 ${
                  darkMode ? "bg-gray-900" : "bg-emerald-50"
                }`}
              >
                <Heart size={32} className="text-emerald-500" />
              </div>
              <h3
                className={`text-lg font-bold ${
                  darkMode ? "text-white" : "text-gray-950"
                }`}
              >
                No Contributions Found
              </h3>
              <p
                className={`mt-4 text-[10px] font-bold uppercase tracking-widest text-gray-500`}
              >
                Your legacy begins with the first step of support.
              </p>
              <Link
                to="/campaigns"
                className="mt-10 inline-block px-10 py-4 bg-emerald-600 text-white rounded-xl font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-emerald-600/20 active:scale-95 transition-all"
              >
                Support a Project
              </Link>
            </motion.div>
          ) : (
            donations.map((donation, idx) => (
              <DonationRecord
                key={donation._id}
                donation={donation}
                dispatch={dispatch}
                darkMode={darkMode}
                idx={idx}
              />
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Pagination Protocol */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-3 pt-10">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => dispatch(setCurrentPage(i + 1))}
              aria-label={`Page ${i + 1}`}
              aria-current={currentPage === i + 1 ? "page" : undefined}
              className={`w-11 h-11 rounded-lg font-bold transition-all ${
                currentPage === i + 1
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
                  : darkMode
                    ? "bg-gray-900 text-gray-500 hover:bg-gray-800"
                    : "bg-white text-gray-400 hover:bg-gray-50 border border-gray-100"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyDonations;
