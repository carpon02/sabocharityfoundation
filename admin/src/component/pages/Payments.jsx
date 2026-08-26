// admin/src/component/pages/Payments.jsx - Donation Management Hub
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Download,
  CreditCard,
  CheckCircle,
  Clock,
  Eye,
  XCircle,
  RefreshCw,
  Check,
  X,
  Loader,
  Wallet,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Shield,
  Calendar,
  User,
  TrendingUp,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

import { StatsCard } from "../shared";
import {
  fetchPaymentStats,
  fetchAllPayments,
  approvePayment,
  exportPayments,
  setFilters,
  fetchPaymentDetails,
  rejectPayment,
} from "../../features/payment/adminPaymentsSlice";

const getStatusConfig = (status) => {
  const configs = {
    pending: {
      label: "Awaiting Verification",
      color: "text-amber-500",
      bg: "bg-amber-100 dark:bg-amber-950/30",
      border: "border-amber-200 dark:border-amber-800",
      icon: Clock,
    },
    approved: {
      label: "Donation Verified",
      color: "text-emerald-500",
      bg: "bg-emerald-100 dark:bg-emerald-950/30",
      border: "border-emerald-200 dark:border-emerald-800",
      icon: ShieldCheck,
    },
    rejected: {
      label: "Donation Rejected",
      color: "text-rose-500",
      bg: "bg-rose-100 dark:bg-rose-950/30",
      border: "border-rose-200 dark:border-rose-800",
      icon: XCircle,
    },
  };
  return configs[status] || configs.pending;
};

const Payments = () => {
  const dispatch = useDispatch();
  const { darkMode } = useTheme();

  const { payments, stats, pagination, filters, loading } = useSelector(
    (state) => state.adminPayments,
  );

  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [initiateRefund, setInitiateRefund] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  useEffect(() => {
    dispatch(fetchPaymentStats({ period: "30days" }));
    dispatch(fetchAllPayments(filters));
  }, [dispatch, filters]);

  const internalStats = useMemo(
    () => [
      {
        label: "Total Donations",
        value: new Intl.NumberFormat("en-NG", {
          style: "currency",
          currency: "NGN",
          minimumFractionDigits: 0,
        }).format(stats.overview?.totalPayments || 0),
        subtitle: "Foundation Impact",
        icon: Wallet,
        bgColor: "from-emerald-600 to-teal-600",
        trend: "+15%",
        trendUp: true,
      },
      {
        label: "Verified Donations",
        value: (stats.overview?.successful?.count || 0).toString(),
        subtitle: "Verified Support",
        icon: ShieldCheck,
        bgColor: "from-emerald-500 to-teal-500",
        trend: "+8.2%",
        trendUp: true,
      },
      {
        label: "Pending Payments",
        value: (stats.overview?.pending?.count || 0).toString(),
        subtitle: "Needs Review",
        icon: Clock,
        bgColor: "from-amber-500 to-orange-600",
      },
      {
        label: "Success Rate",
        value: "98.2%",
        subtitle: "System Reliability",
        icon: TrendingUp,
        bgColor: "from-rose-500 to-pink-600",
      },
    ],
    [stats],
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const handleApprove = (payment) => {
    setSelectedPayment(payment);
    setShowApproveModal(true);
  };

  const handleReject = (payment) => {
    setSelectedPayment(payment);
    setRejectionReason("");
    setInitiateRefund(false);
    setShowRejectModal(true);
  };

  const handleViewDetails = async (payment) => {
    await dispatch(fetchPaymentDetails(payment._id));
    setSelectedPayment(payment);
    setShowDetailsModal(true);
  };

  return (
    <div className="space-y-8 relative">
      {/* Decorative Background Blob */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-1 bg-gradient-to-r from-emerald-500 to-emerald-300 rounded-full" />
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
              Financial Management
            </span>
          </div>
          <h1
            className={`text-3xl lg:text-4xl font-extrabold mb-2 tracking-tight ${
              darkMode ? "text-white" : "text-dark"
            }`}
          >
            Donation <span className="text-emerald-500">History</span>
          </h1>
          <p
            className={`text-base max-w-xl ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Monitor, verify, and analyze incoming financial contributions to
            ensure transparency and accountability.
          </p>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => dispatch(exportPayments(filters))}
          className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white px-8 py-4 rounded-2xl font-bold text-sm flex items-center gap-3 shadow-xl shadow-emerald-500/30 transition-all w-fit disabled:opacity-50"
        >
          <Download size={20} />
          <span className="whitespace-nowrap">Export Giving Report</span>
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
          <motion.div
            key={i}
            variants={itemVariants}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <StatsCard {...stat} index={i} />
          </motion.div>
        ))}
      </motion.div>

      {/* Filters */}
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
          <div className="relative flex-1 group">
            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors"
              size={20}
            />
            <input
              type="text"
              placeholder="Search giving records..."
              value={filters.search || ""}
              onChange={(e) =>
                dispatch(setFilters({ search: e.target.value, page: 1 }))
              }
              className={`w-full pl-14 pr-6 py-4 rounded-2xl border-2 outline-none transition-all text-sm font-semibold ${
                darkMode
                  ? "bg-gray-800/50 border-gray-700 text-white focus:border-emerald-500 focus:bg-gray-800"
                  : "bg-gray-50 border-gray-100 text-dark focus:border-emerald-500 focus:bg-white focus:shadow-lg focus:shadow-emerald-500/10"
              }`}
            />
          </div>
          <div className="flex flex-wrap gap-4 w-full xl:w-auto">
            <select
              value={filters.approvalStatus || ""}
              onChange={(e) =>
                dispatch(setFilters({ approvalStatus: e.target.value, page: 1 }))
              }
              className={`px-6 py-4 rounded-2xl border-2 outline-none cursor-pointer text-sm font-bold xl:min-w-[180px] ${
                darkMode
                  ? "bg-gray-800/50 border-gray-700 text-white focus:border-emerald-500"
                  : "bg-gray-50 border-gray-100 text-dark focus:border-emerald-500 hover:bg-white transition-colors"
              }`}
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending Review</option>
              <option value="approved">Verified Donations</option>
              <option value="rejected">Rejected</option>
            </select>
            <button
              onClick={() => dispatch(fetchAllPayments(filters))}
              className={`px-8 py-4 rounded-2xl border-2 font-bold text-sm transition-all flex items-center gap-2 hover:scale-105 active:scale-95 whitespace-nowrap ${
                darkMode
                  ? "bg-gray-800/50 border-gray-700 text-gray-300 hover:text-white hover:bg-gray-700"
                  : "bg-white border-gray-200 text-gray-600 hover:text-emerald-600 hover:border-emerald-200"
              }`}
            >
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />{" "}
              Refresh
            </button>
          </div>
        </div>
      </motion.div>

      {/* Transaction Table */}
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
        <div className="p-8 border-b border-gray-100 dark:border-gray-800/50 flex flex-wrap gap-4 items-center justify-between bg-gradient-to-r from-transparent via-transparent to-emerald-500/5">
          <div className="flex items-center gap-4">
            <div
              className={`p-3 rounded-xl ${darkMode ? "bg-emerald-900/20" : "bg-emerald-50"}`}
            >
              <Wallet size={24} className="text-emerald-500" />
            </div>
            <div>
              <h3
                className={`text-xl font-bold ${
                  darkMode ? "text-white" : "text-dark"
                }`}
              >
                Live Transaction Feed
              </h3>
              <p
                className={`text-sm mt-1 ${darkMode ? "text-gray-500" : "text-gray-500"}`}
              >
                Real-time donation tracking and status updates
              </p>
            </div>
          </div>
          <span
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider ${
              darkMode ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-600"
            }`}
          >
            {payments?.length || 0} Records
          </span>
        </div>

        <div className="overflow-x-auto w-full -mx-0">
          <table className="w-full min-w-[800px] text-left">
            <thead
              className={`${
                darkMode ? "bg-gray-900/30" : "bg-gray-50/50"
              } border-b ${darkMode ? "border-gray-800" : "border-gray-100"}`}
            >
              <tr>
                {["Project Path", "Donor Details", "Amount", "Method", "Status", "Actions"].map(
                  (h, i) => (
                    <th
                      key={h}
                      className={`px-8 py-5 ${i === 2 ? "text-right" : i === 5 ? "text-center" : "text-left"} text-xs font-bold uppercase tracking-wider ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody
              className={`divide-y ${
                darkMode ? "divide-gray-800/50" : "divide-gray-100"
              }`}
            >
              <AnimatePresence mode="wait">
                {loading && (!payments || payments.length === 0) ? (
                  <tr>
                    <td colSpan={6} className="py-20 text-center">
                      <Loader className="animate-spin mx-auto text-emerald-500" size={32} />
                    </td>
                  </tr>
                ) : payments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className={`py-20 text-center text-sm font-medium ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                      No donations found.
                    </td>
                  </tr>
                ) : (
                  payments.map((payment, i) => {
                    const statusConfig = getStatusConfig(payment.approvalStatus);
                    return (
                      <motion.tr
                        key={payment._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className={`group hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 transition-colors cursor-pointer`}
                      >
                        {/* Project */}
                        <td className="px-8 py-6 min-w-[220px]">
                          <div className="flex flex-col">
                            <span className={`text-sm font-bold ${darkMode ? "text-white" : "text-dark"}`}>
                              {payment.campaign?.title || "General Donation"}
                            </span>
                            <span className={`text-xs font-medium mt-1 ${darkMode ? "text-gray-500" : "text-gray-500"}`}>
                              ID: #{payment.donationId || payment._id.slice(-8).toUpperCase()}
                            </span>
                          </div>
                        </td>

                        {/* Donor */}
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 flex-shrink-0">
                              <img
                                src={
                                  payment.anonymous
                                    ? "https://ui-avatars.com/api/?name=A&background=random"
                                    : payment.donor?.avatar ||
                                      "https://ui-avatars.com/api/?name=User&background=059669&color=fff"
                                }
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex flex-col">
                              <span className={`text-sm font-bold ${darkMode ? "text-gray-200" : "text-dark"}`}>
                                {payment.anonymous
                                  ? "Anonymous Donor"
                                  : payment.donor?.fullName ||
                                    (payment.guestInfo
                                      ? `${payment.guestInfo.firstName} ${payment.guestInfo.lastName}`
                                      : "Foundation Supporter")}
                              </span>
                              <span className={`text-xs font-medium ${darkMode ? "text-gray-500" : "text-gray-500"}`}>
                                {new Date(payment.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Amount */}
                        <td className="px-8 py-6 text-right">
                          <span className={`text-sm font-bold ${darkMode ? "text-emerald-400" : "text-emerald-600"}`}>
                            {new Intl.NumberFormat("en-NG", {
                              style: "currency",
                              currency: "NGN",
                              minimumFractionDigits: 0,
                            }).format(payment.amount)}
                          </span>
                        </td>

                        {/* Method */}
                        <td className="px-8 py-6">
                          <span className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest ${darkMode ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-600"}`}>
                            {payment.paymentMethod?.replace("_", " ")}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-8 py-6">
                          <span className={`${statusConfig.bg} ${statusConfig.color} ${statusConfig.border} border px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 w-fit`}>
                            <statusConfig.icon size={12} /> {statusConfig.label}
                          </span>
                        </td>

                        {/* Actions - always visible */}
                        <td className="px-8 py-6">
                          <div className="flex items-center justify-center gap-2">
                            {payment.approvalStatus === "pending" && (
                              <>
                                <motion.button
                                  whileHover={{ scale: isApproving && selectedPayment?._id === payment._id ? 1 : 1.15 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleApprove(payment)}
                                  disabled={isApproving && selectedPayment?._id === payment._id}
                                  title="Approve"
                                  className={`p-2 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                                    darkMode
                                      ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white"
                                      : "bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white shadow-sm"
                                  }`}
                                >
                                  {isApproving && selectedPayment?._id === payment._id
                                    ? <Loader size={16} className="animate-spin" />
                                    : <Check size={16} />}
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: isRejecting && selectedPayment?._id === payment._id ? 1 : 1.15 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleReject(payment)}
                                  disabled={isRejecting && selectedPayment?._id === payment._id}
                                  title="Reject"
                                  className={`p-2 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                                    darkMode
                                      ? "bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white"
                                      : "bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white shadow-sm"
                                  }`}
                                >
                                  {isRejecting && selectedPayment?._id === payment._id
                                    ? <Loader size={16} className="animate-spin" />
                                    : <X size={16} />}
                                </motion.button>
                              </>
                            )}
                            <motion.button
                              whileHover={{ scale: 1.15 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleViewDetails(payment)}
                              title="View details"
                              className={`p-2 rounded-xl transition-all ${
                                darkMode
                                  ? "bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700"
                                  : "bg-white text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 shadow-sm border border-gray-100"
                              }`}
                            >
                              <Eye size={16} />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* ── Pagination Bar ──────────────────────────────────────────── */}
        <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t ${darkMode ? "border-gray-800" : "border-gray-100"}`}>

          {/* Left: rows-per-page selector + count */}
          <div className="flex items-center gap-3">
            <span className={`text-xs font-semibold ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              Rows per page:
            </span>
            <div className="flex items-center gap-1">
              {[25, 50, 75, 100].map((n) => (
                <button
                  key={n}
                  onClick={() => dispatch(setFilters({ ...filters, page: 1, limit: n }))}
                  className={`min-w-[40px] h-8 px-2 rounded-lg text-xs font-bold transition-all ${
                    (filters.limit || 25) === n
                      ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/30"
                      : darkMode
                        ? "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
            <span className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
              {pagination.total > 0 ? (
                <>
                  Showing{" "}
                  <span className={`font-bold ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    {((pagination.page - 1) * (filters.limit || 25)) + 1}–
                    {Math.min(pagination.page * (filters.limit || 25), pagination.total)}
                  </span>{" "}
                  of{" "}
                  <span className={`font-bold ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    {pagination.total}
                  </span>
                </>
              ) : (
                "No records"
              )}
            </span>
          </div>

          {/* Right: page navigation */}
          {pagination.pages > 1 && (
            <div className="flex items-center gap-2">
              {/* Previous */}
              <button
                onClick={() => dispatch(setFilters({ ...filters, page: pagination.page - 1 }))}
                disabled={pagination.page === 1}
                className={`p-2 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                  darkMode ? "hover:bg-gray-800 text-white" : "hover:bg-gray-100 text-dark"
                }`}
                title="Previous page"
              >
                <ChevronLeft size={18} />
              </button>

              {/* Page numbers (up to 7 visible) */}
              <div className="flex items-center gap-1">
                {(() => {
                  const total = pagination.pages;
                  const cur = pagination.page;
                  let pages = [];
                  if (total <= 7) {
                    pages = Array.from({ length: total }, (_, i) => i + 1);
                  } else if (cur <= 4) {
                    pages = [1, 2, 3, 4, 5, "…", total];
                  } else if (cur >= total - 3) {
                    pages = [1, "…", total - 4, total - 3, total - 2, total - 1, total];
                  } else {
                    pages = [1, "…", cur - 1, cur, cur + 1, "…", total];
                  }
                  return pages.map((p, i) =>
                    p === "…" ? (
                      <span
                        key={`ellipsis-${i}`}
                        className={`w-8 text-center text-xs select-none ${darkMode ? "text-gray-600" : "text-gray-400"}`}
                      >
                        …
                      </span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => dispatch(setFilters({ ...filters, page: p }))}
                        className={`w-9 h-9 rounded-xl font-bold text-xs transition-all ${
                          pagination.page === p
                            ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25 scale-105"
                            : darkMode
                              ? "bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700"
                              : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {p}
                      </button>
                    )
                  );
                })()}
              </div>

              {/* Next */}
              <button
                onClick={() => dispatch(setFilters({ ...filters, page: pagination.page + 1 }))}
                disabled={pagination.page === pagination.pages}
                className={`p-2 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                  darkMode ? "hover:bg-gray-800 text-white" : "hover:bg-gray-100 text-dark"
                }`}
                title="Next page"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
        {/* ──────────────────────────────────────────────────────────────── */}
      </motion.div>

      {/* Transparency Note */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className={`p-10 rounded-3xl border relative overflow-hidden ${
          darkMode
            ? "bg-gradient-to-br from-emerald-950/20 to-dark-lighter border-emerald-900/30"
            : "bg-gradient-to-br from-emerald-50 to-white border-emerald-100"
        }`}
      >
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <Shield size={140} />
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-lg ${darkMode ? "bg-emerald-900/50" : "bg-emerald-100"}`}>
                <ShieldCheck className="text-emerald-600" size={24} />
              </div>
              <span className="text-xs font-bold tracking-widest uppercase text-emerald-500">
                Public Trust
              </span>
            </div>
            <h2 className={`text-2xl font-extrabold mb-3 ${darkMode ? "text-white" : "text-dark"}`}>
              Financial Transparency
            </h2>
            <p className={`text-base leading-relaxed max-w-2xl ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              Every donation verified here represents a life-changing contribution.
              We maintain 100% transparency from donor to community projects.
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-emerald-700 border-2 border-emerald-100 hover:border-emerald-200 px-8 py-4 rounded-2xl font-bold shadow-xl shadow-gray-200/50 hover:shadow-2xl transition-all flex items-center gap-3"
          >
            <ShieldCheck size={20} />
            <span>View Transparency Report</span>
          </motion.button>
        </div>
      </motion.div>

      {/* ── Modals ── */}
      <AnimatePresence>
        {/* Approve Modal */}
        {showApproveModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`p-8 rounded-[2rem] max-w-lg w-full border ${
                darkMode ? "bg-gray-950 border-gray-800" : "bg-white border-gray-100 shadow-2xl"
              }`}
            >
              <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheck size={40} className="text-emerald-500" />
              </div>
              <h2 className={`text-2xl font-extrabold tracking-tight text-center ${darkMode ? "text-white" : "text-gray-950"}`}>
                Verify Donation?
              </h2>
              <p className="mt-4 text-center text-sm font-medium text-gray-500 leading-relaxed">
                Confirming{" "}
                <span className={`font-bold ${darkMode ? "text-white" : "text-dark"}`}>
                  {new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(selectedPayment?.amount)}
                </span>{" "}
                for the foundation project. This will finalize the donation record and update public ledgers.
              </p>
              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => setShowApproveModal(false)}
                  disabled={isApproving}
                  className={`flex-1 py-4 rounded-xl font-bold uppercase tracking-wider text-xs transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                    darkMode ? "bg-gray-900 text-gray-400 hover:bg-gray-800" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  Cancel
                </button>
                <button
                  disabled={isApproving}
                  onClick={async () => {
                    setIsApproving(true);
                    try {
                      await dispatch(approvePayment({ paymentId: selectedPayment._id }));
                      setShowApproveModal(false);
                      // Refresh both the table AND the stat cards
                      dispatch(fetchAllPayments(filters));
                      dispatch(fetchPaymentStats({ period: "30days" }));
                    } finally {
                      setIsApproving(false);
                    }
                  }}
                  className="flex-1 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold uppercase tracking-wider text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
                >
                  {isApproving ? (
                    <>
                      <Loader size={14} className="animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Check size={14} />
                      Confirm Donation
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Reject Modal */}
        {showRejectModal && (
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`p-8 rounded-[2rem] max-w-lg w-full border ${
                darkMode ? "bg-gray-950 border-gray-800" : "bg-white border-gray-100 shadow-2xl"
              }`}
            >
              <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle size={40} className="text-rose-500" />
              </div>
              <h2 className={`text-2xl font-extrabold tracking-tight text-center ${darkMode ? "text-white" : "text-gray-950"}`}>
                Reject Donation?
              </h2>
              <p className="mt-4 text-center text-sm font-medium text-gray-500 leading-relaxed">
                Provide a reason for rejection and optionally initiate a refund.
              </p>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Rejection reason..."
                rows={3}
                className={`w-full mt-4 p-3 rounded-xl border outline-none text-sm resize-none ${
                  darkMode ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500" : "bg-gray-50 border-gray-200 text-gray-900"
                }`}
              />
              <div className="flex items-center mt-4 gap-2">
                <input
                  type="checkbox"
                  checked={initiateRefund}
                  onChange={(e) => setInitiateRefund(e.target.checked)}
                  id="refundCheckbox"
                  className="w-4 h-4 accent-rose-500"
                />
                <label
                  htmlFor="refundCheckbox"
                  className={`text-sm font-medium cursor-pointer ${darkMode ? "text-gray-200" : "text-gray-800"}`}
                >
                  Initiate Refund
                </label>
              </div>
              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => setShowRejectModal(false)}
                  disabled={isRejecting}
                  className={`flex-1 py-4 rounded-xl font-bold uppercase tracking-wider text-xs transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                    darkMode ? "bg-gray-900 text-gray-400 hover:bg-gray-800" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  Cancel
                </button>
                <button
                  disabled={isRejecting || !rejectionReason.trim()}
                  onClick={async () => {
                    setIsRejecting(true);
                    try {
                      await dispatch(rejectPayment({ paymentId: selectedPayment._id, rejectionReason, initiateRefund }));
                      setShowRejectModal(false);
                      // Refresh both the table AND the stat cards
                      dispatch(fetchAllPayments(filters));
                      dispatch(fetchPaymentStats({ period: "30days" }));
                    } finally {
                      setIsRejecting(false);
                    }
                  }}
                  className="flex-1 py-4 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold uppercase tracking-wider text-xs shadow-lg shadow-rose-500/20 transition-all flex items-center justify-center gap-2"
                >
                  {isRejecting ? (
                    <>
                      <Loader size={14} className="animate-spin" />
                      Rejecting...
                    </>
                  ) : (
                    <>
                      <X size={14} />
                      Confirm Rejection
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Details Modal */}
        {showDetailsModal && (
          <div className="fixed inset-0 z-[102] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`relative p-8 rounded-2xl max-w-lg w-full border ${
                darkMode
                  ? "bg-gray-900/70 border-gray-700 backdrop-blur-xl"
                  : "bg-white/80 border-gray-200 backdrop-blur-xl shadow-2xl"
              }`}
            >
              <button
                onClick={() => setShowDetailsModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className={`text-2xl font-extrabold mb-6 text-center ${darkMode ? "text-white" : "text-gray-900"}`}>
                Donation Receipt
              </h2>
              <div className={`space-y-3 text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                <div className="flex items-center justify-between p-3 bg-gray-500/10 rounded-xl">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-emerald-500" />
                    <span className="font-medium">Donor</span>
                  </div>
                  <span className="font-semibold">
                    {selectedPayment?.donor?.fullName || (selectedPayment?.anonymous ? "Anonymous" : "N/A")}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-500/10 rounded-xl">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-emerald-500" />
                    <span className="font-medium">Amount</span>
                  </div>
                  <span className="font-bold text-emerald-500">
                    {new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(selectedPayment?.amount)}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-500/10 rounded-xl">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-emerald-500" />
                    <span className="font-medium">Method</span>
                  </div>
                  <span className="font-semibold capitalize">{selectedPayment?.paymentMethod?.replace("_", " ")}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-500/10 rounded-xl">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span className="font-medium">Status</span>
                  </div>
                  <span className={`font-semibold capitalize ${
                    selectedPayment?.approvalStatus === "approved"
                      ? "text-emerald-500"
                      : selectedPayment?.approvalStatus === "rejected"
                        ? "text-rose-500"
                        : "text-amber-500"
                  }`}>
                    {selectedPayment?.approvalStatus}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-500/10 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-500" />
                    <span className="font-medium">Date</span>
                  </div>
                  <span className="font-semibold">
                    {new Date(selectedPayment?.createdAt).toLocaleDateString("en-NG", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                {selectedPayment?.rejectionReason && (
                  <div className="p-4 bg-rose-500/10 rounded-xl border border-rose-200 text-rose-500">
                    <p className="font-bold text-xs uppercase mb-1">Rejection Reason</p>
                    <p className="text-sm">{selectedPayment.rejectionReason}</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Payments;
