// admin/src/component/pages/Payments.jsx — Clerk-Style UI
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Download, CreditCard, CheckCircle, Clock, Eye,
  XCircle, RefreshCw, Check, X, Loader, Wallet, ShieldCheck,
  ChevronLeft, ChevronRight, Shield, Calendar, User, TrendingUp,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { StatsCard } from "../shared";
import {
  fetchPaymentStats, fetchAllPayments, approvePayment,
  exportPayments, setFilters, fetchPaymentDetails, rejectPayment,
} from "../../features/payment/adminPaymentsSlice";

/**
 * Returns a display config based on the combined payment status + approval status.
 * This makes the admin table unambiguous at a glance.
 */
const getPaymentDisplayConfig = (payment) => {
  const { status, approvalStatus } = payment;
  if (status === "verified" && approvalStatus === "approved")
    return { label: "Confirmed",       color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950/20", icon: ShieldCheck };
  if (status === "verified" && approvalStatus === "rejected")
    return { label: "Revoked",         color: "text-red-600",     bg: "bg-red-50 dark:bg-red-950/20",       icon: XCircle };
  if (status === "verified" && approvalStatus === "pending")
    return { label: "Awaiting Review", color: "text-blue-600",    bg: "bg-blue-50 dark:bg-blue-950/20",     icon: CheckCircle };
  if (status === "processing")
    return { label: "Awaiting Payment",color: "text-amber-600",   bg: "bg-amber-50 dark:bg-amber-950/20",   icon: Clock };
  if (status === "failed")
    return { label: "Payment Failed",  color: "text-red-600",     bg: "bg-red-50 dark:bg-red-950/20",       icon: XCircle };
  if (status === "pending")
    return { label: "Not Started",     color: "text-gray-500",    bg: "bg-gray-100 dark:bg-gray-800",       icon: Clock };
  // Fallback
  return { label: approvalStatus || status, color: "text-gray-500", bg: "bg-gray-100", icon: Clock };
};

const fmt = (n) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(n);

const Payments = () => {
  const dispatch = useDispatch();
  const { darkMode } = useTheme();
  const { payments, stats, pagination, filters, loading } = useSelector((s) => s.adminPayments);

  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal,  setShowRejectModal]  = useState(false);
  const [showRevokeModal,  setShowRevokeModal]  = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedPayment,  setSelectedPayment]  = useState(null);
  const [rejectionReason,  setRejectionReason]  = useState("");
  const [revokeReason,     setRevokeReason]     = useState("");
  const [initiateRefund,   setInitiateRefund]   = useState(false);
  const [isApproving,      setIsApproving]      = useState(false);
  const [isRejecting,      setIsRejecting]      = useState(false);
  const [isRevoking,       setIsRevoking]       = useState(false);

  useEffect(() => {
    dispatch(fetchPaymentStats({ period: "30days" }));
    dispatch(fetchAllPayments(filters));
  }, [dispatch, filters]);

  const internalStats = useMemo(() => [
    { label: "Total Donations",    value: fmt(stats.overview?.totalPayments || 0),              subtitle: "Foundation Impact",  icon: Wallet,     bgColor: "from-emerald-600 to-teal-600" },
    { label: "Verified Donations", value: (stats.overview?.successful?.count || 0).toString(),  subtitle: "Verified Support",   icon: ShieldCheck, bgColor: "from-emerald-500 to-teal-500" },
    { label: "Pending Payments",   value: (stats.overview?.pending?.count || 0).toString(),     subtitle: "Needs Review",       icon: Clock,      bgColor: "from-amber-500 to-orange-600" },
    { label: "Success Rate",       value: "98.2%",                                              subtitle: "System Reliability", icon: TrendingUp, bgColor: "from-rose-500 to-pink-600" },
  ], [stats]);

  const handleApprove = (p) => { setSelectedPayment(p); setShowApproveModal(true); };
  const handleReject  = (p) => { setSelectedPayment(p); setRejectionReason(""); setInitiateRefund(false); setShowRejectModal(true); };
  const handleRevoke  = (p) => { setSelectedPayment(p); setRevokeReason(""); setShowRevokeModal(true); };
  const handleViewDetails = async (p) => {
    await dispatch(fetchPaymentDetails(p._id));
    setSelectedPayment(p);
    setShowDetailsModal(true);
  };

  const confirmApprove = async () => {
    setIsApproving(true);
    try {
      await dispatch(approvePayment({ paymentId: selectedPayment._id }));
      setShowApproveModal(false);
      dispatch(fetchAllPayments(filters));
      dispatch(fetchPaymentStats({ period: "30days" }));
    } finally { setIsApproving(false); }
  };

  const confirmReject = async () => {
    setIsRejecting(true);
    try {
      await dispatch(rejectPayment({ paymentId: selectedPayment._id, rejectionReason, initiateRefund }));
      setShowRejectModal(false);
      dispatch(fetchAllPayments(filters));
      dispatch(fetchPaymentStats({ period: "30days" }));
    } finally { setIsRejecting(false); }
  };

  // Revoke: used for auto-approved Paystack-verified donations where the admin
  // discovers an issue after the fact (fraud, duplicate, etc.)
  const confirmRevoke = async () => {
    setIsRevoking(true);
    try {
      await dispatch(rejectPayment({
        paymentId: selectedPayment._id,
        rejectionReason: revokeReason || "Revoked by admin",
        initiateRefund: false,
      }));
      setShowRevokeModal(false);
      dispatch(fetchAllPayments(filters));
      dispatch(fetchPaymentStats({ period: "30days" }));
    } finally { setIsRevoking(false); }
  };

  // ── Shared styles ────────────────────────────────────────────────────────
  const cardBase = `rounded-xl border ${darkMode ? "bg-dark-lighter border-gray-800/70" : "bg-white border-gray-200/80 shadow-sm"}`;
  const modalBase = `rounded-xl border shadow-xl ${darkMode ? "bg-[#111] border-gray-800" : "bg-white border-gray-200"}`;
  const inputCls  = `px-3 py-2 rounded-lg border text-sm outline-none transition-all ${darkMode ? "bg-gray-800/60 border-gray-700/50 text-white placeholder-gray-500 focus:border-primary-500/50" : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-primary-400"}`;

  // ── Pagination helpers ───────────────────────────────────────────────────
  const buildPages = () => {
    const total = pagination.pages, cur = pagination.page;
    if (!total || total <= 1) return [];
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    if (cur <= 4) return [1, 2, 3, 4, 5, "…", total];
    if (cur >= total - 3) return [1, "…", total-4, total-3, total-2, total-1, total];
    return [1, "…", cur-1, cur, cur+1, "…", total];
  };

  return (
    <div className="space-y-6 pb-10">

      {/* ── Header ───────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-xl font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>Donations</h1>
          <p className={`text-sm mt-0.5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            {pagination?.total || 0} total records
            {(stats.overview?.pending?.count || 0) > 0 && (
              <> · <span className="text-amber-500 font-medium">{stats.overview.pending.count} pending review</span></>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => dispatch(fetchAllPayments(filters))}
            className={`p-2 rounded-lg border text-sm transition-all ${darkMode ? "bg-dark-lighter border-gray-800 text-gray-400 hover:text-white" : "bg-white border-gray-200 text-gray-600 hover:text-gray-900 shadow-sm"}`}
            title="Refresh"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          </button>
          <button
            onClick={() => dispatch(exportPayments(filters))}
            className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all flex items-center gap-1.5 ${darkMode ? "bg-dark-lighter border-gray-800 text-gray-300 hover:text-white" : "bg-white border-gray-200 text-gray-600 hover:text-gray-900 shadow-sm"}`}
          >
            <Download size={15} />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* ── Stats ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {internalStats.map((s, i) => <StatsCard key={i} {...s} index={i} />)}
      </div>

      {/* ── Filters ──────────────────────────────────────────────────── */}
      <div className={`${cardBase} p-4 flex flex-col sm:flex-row gap-3`}>
        <div className="relative flex-1">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? "text-gray-500" : "text-gray-400"}`} size={15} />
          <input
            type="text"
            placeholder="Search donations..."
            value={filters.search || ""}
            onChange={(e) => dispatch(setFilters({ search: e.target.value, page: 1 }))}
            className={`${inputCls} w-full pl-9`}
          />
        </div>
        <select
          value={filters.approvalStatus || ""}
          onChange={(e) => dispatch(setFilters({ approvalStatus: e.target.value, page: 1 }))}
          className={inputCls}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Verified</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* ── Table ────────────────────────────────────────────────────── */}
      <div className={`${cardBase} overflow-hidden`}>
        {/* Table header label */}
        <div className={`px-5 py-4 border-b flex items-center gap-2.5 ${darkMode ? "border-gray-800/60" : "border-gray-100"}`}>
          <Wallet size={17} className="text-emerald-500" />
          <h2 className={`text-sm font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>Transactions</h2>
          <span className={`ml-auto px-2 py-0.5 rounded-full text-xs font-medium ${darkMode ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-500"}`}>
            {payments?.length || 0}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left">
            <thead>
              <tr className={`border-b ${darkMode ? "border-gray-800/60" : "border-gray-50"}`}>
                {["Campaign", "Donor", "Amount", "Method", "Status", ""].map((h, i) => (
                  <th
                    key={h + i}
                    className={`px-5 py-3 text-xs font-semibold uppercase tracking-wider ${darkMode ? "text-gray-500" : "text-gray-400"} ${i === 2 ? "text-right" : i === 5 ? "text-right" : "text-left"}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="wait">
                {loading && (!payments || payments.length === 0) ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center">
                      <Loader className="animate-spin mx-auto text-emerald-500" size={24} />
                    </td>
                  </tr>
                ) : payments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className={`py-16 text-center text-sm ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                      No donations found.
                    </td>
                  </tr>
                ) : (
                  payments.map((payment, i) => {
                    const sc = getPaymentDisplayConfig(payment);
                    const donorName = payment.anonymous
                      ? "Anonymous"
                      : payment.donor?.fullName || (payment.guestInfo ? `${payment.guestInfo.firstName} ${payment.guestInfo.lastName}` : "Supporter");
                    return (
                      <tr
                        key={payment._id}
                        className={`border-b transition-colors cursor-pointer ${darkMode ? "border-gray-800/40 hover:bg-gray-800/30" : "border-gray-50 hover:bg-gray-50/70"}`}
                      >
                        {/* Campaign */}
                        <td className="px-5 py-3.5">
                          <p className={`text-sm font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>
                            {payment.campaign?.title || "General Donation"}
                          </p>
                          <p className={`text-xs mt-0.5 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                            #{payment.donationId || payment._id.slice(-8).toUpperCase()}
                          </p>
                        </td>

                        {/* Donor */}
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={payment.anonymous
                                ? "https://ui-avatars.com/api/?name=A&background=random"
                                : payment.donor?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(donorName)}&background=059669&color=fff`}
                              alt=""
                              className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                            />
                            <div>
                              <p className={`text-sm font-medium ${darkMode ? "text-gray-200" : "text-gray-800"}`}>{donorName}</p>
                              <p className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                                {new Date(payment.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Amount */}
                        <td className="px-5 py-3.5 text-right">
                          <span className={`text-sm font-semibold ${darkMode ? "text-emerald-400" : "text-emerald-600"}`}>
                            {fmt(payment.amount)}
                          </span>
                        </td>

                        {/* Method */}
                        <td className="px-5 py-3.5">
                          <span className={`inline-block px-2 py-0.5 rounded-md text-xs font-medium capitalize ${darkMode ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-600"}`}>
                            {payment.paymentMethod?.replace("_", " ")}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-3.5">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${sc.bg} ${sc.color}`}>
                            <sc.icon size={11} />{sc.label}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Auto-approved Paystack-verified donations: admin can Revoke */}
                            {payment.approvalStatus === "approved" && payment.status === "verified" && (
                              <button
                                onClick={() => handleRevoke(payment)}
                                title="Revoke this donation"
                                className={`p-1.5 rounded-lg transition-all ${darkMode ? "text-amber-400 hover:bg-amber-950/30" : "text-amber-600 hover:bg-amber-50"}`}
                              >
                                <XCircle size={15} />
                              </button>
                            )}
                            {/* Manual-transfer donations still needing human review */}
                            {payment.approvalStatus === "pending" && payment.status === "verified" && (
                              <>
                                <button
                                  onClick={() => handleApprove(payment)}
                                  title="Approve"
                                  className={`p-1.5 rounded-lg transition-all ${darkMode ? "text-emerald-400 hover:bg-emerald-950/30" : "text-emerald-600 hover:bg-emerald-50"}`}
                                >
                                  <Check size={15} />
                                </button>
                                <button
                                  onClick={() => handleReject(payment)}
                                  title="Reject"
                                  className={`p-1.5 rounded-lg transition-all ${darkMode ? "text-red-400 hover:bg-red-950/30" : "text-red-600 hover:bg-red-50"}`}
                                >
                                  <X size={15} />
                                </button>
                              </>
                            )}
                            {/* No action buttons for processing or failed payments */}
                            <button
                              onClick={() => handleViewDetails(payment)}
                              title="View details"
                              className={`p-1.5 rounded-lg transition-all ${darkMode ? "text-gray-400 hover:text-white hover:bg-gray-800" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"}`}
                            >
                              <Eye size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination?.pages > 1 && (
          <div className={`px-5 py-3.5 border-t flex flex-col sm:flex-row items-center justify-between gap-3 ${darkMode ? "border-gray-800/60" : "border-gray-100"}`}>
            {/* Rows per page */}
            <div className="flex items-center gap-2">
              <span className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>Rows:</span>
              <div className="flex items-center gap-1">
                {[25, 50, 75, 100].map((n) => (
                  <button
                    key={n}
                    onClick={() => dispatch(setFilters({ ...filters, page: 1, limit: n }))}
                    className={`px-2 h-7 rounded-md text-xs font-medium transition-all ${
                      (filters.limit || 25) === n
                        ? "bg-primary-500 text-white"
                        : darkMode ? "bg-gray-800 text-gray-400 hover:text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <span className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                {pagination.total > 0 && `${((pagination.page - 1) * (filters.limit || 25)) + 1}–${Math.min(pagination.page * (filters.limit || 25), pagination.total)} of ${pagination.total}`}
              </span>
            </div>

            {/* Page buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => dispatch(setFilters({ ...filters, page: pagination.page - 1 }))}
                disabled={pagination.page === 1}
                className={`p-1.5 rounded-lg transition-all disabled:opacity-40 ${darkMode ? "hover:bg-gray-800 text-gray-400" : "hover:bg-gray-100 text-gray-600"}`}
              >
                <ChevronLeft size={16} />
              </button>
              {buildPages().map((p, i) =>
                p === "…" ? (
                  <span key={`e${i}`} className={`w-8 text-center text-xs ${darkMode ? "text-gray-600" : "text-gray-400"}`}>…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => dispatch(setFilters({ ...filters, page: p }))}
                    className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                      pagination.page === p
                        ? "bg-primary-500 text-white"
                        : darkMode ? "bg-gray-800 text-gray-400 hover:text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {p}
                  </button>
                )
              )}
              <button
                onClick={() => dispatch(setFilters({ ...filters, page: pagination.page + 1 }))}
                disabled={pagination.page === pagination.pages}
                className={`p-1.5 rounded-lg transition-all disabled:opacity-40 ${darkMode ? "hover:bg-gray-800 text-gray-400" : "hover:bg-gray-100 text-gray-600"}`}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Transparency Note ─────────────────────────────────────────── */}
      <div className={`${cardBase} p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}>
        <div className="flex items-start gap-3">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${darkMode ? "bg-emerald-950/30" : "bg-emerald-50"}`}>
            <ShieldCheck size={18} className="text-emerald-600" />
          </div>
          <div>
            <p className={`text-sm font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>Financial Transparency</p>
            <p className={`text-xs mt-0.5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              Every verified donation is publicly recorded. 100% transparent from donor to community.
            </p>
          </div>
        </div>
        <button className={`px-4 py-2 rounded-lg border text-sm font-medium flex items-center gap-1.5 flex-shrink-0 ${darkMode ? "border-gray-700 text-gray-300 hover:bg-gray-800" : "border-gray-200 text-gray-700 hover:bg-gray-50"}`}>
          <Shield size={14} /> View Report
        </button>
      </div>

      {/* ── Modals ───────────────────────────────────────────────────── */}
      <AnimatePresence>
        {/* Revoke — for auto-approved Paystack donations */}
        {showRevokeModal && (
          <div className="fixed inset-0 z-[103] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }}
              className={`w-full max-w-sm ${modalBase} p-6`}
            >
              <div className="flex items-start gap-3 mb-4">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${darkMode ? "bg-amber-950/30" : "bg-amber-50"}`}>
                  <XCircle size={18} className="text-amber-600" />
                </div>
                <div>
                  <h3 className={`text-sm font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>Revoke Donation?</h3>
                  <p className={`text-xs mt-0.5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                    This will remove{" "}
                    <span className="font-semibold text-amber-600">{fmt(selectedPayment?.amount)}</span>{" "}
                    from confirmed totals. Use only for fraud, duplicates, or errors.
                  </p>
                </div>
              </div>
              <textarea
                value={revokeReason}
                onChange={(e) => setRevokeReason(e.target.value)}
                placeholder="Reason for revoking (optional)..."
                rows={3}
                className={`w-full px-3 py-2 rounded-lg border text-sm outline-none resize-none mb-4 ${darkMode ? "bg-gray-800/60 border-gray-700 text-white placeholder-gray-500" : "bg-gray-50 border-gray-200 text-gray-900"}`}
              />
              <div className="flex gap-2">
                <button onClick={() => setShowRevokeModal(false)} disabled={isRevoking} className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${darkMode ? "border-gray-700 text-gray-300 hover:bg-gray-800" : "border-gray-200 text-gray-700 hover:bg-gray-50"}`}>
                  Cancel
                </button>
                <button onClick={confirmRevoke} disabled={isRevoking} className="flex-1 py-2 rounded-lg text-sm font-medium bg-amber-600 hover:bg-amber-700 text-white transition-all disabled:opacity-50 flex items-center justify-center gap-1.5">
                  {isRevoking ? <><span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Revoking...</> : <><XCircle size={13} /> Revoke</>}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Approve */}
        {showApproveModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }}
              className={`w-full max-w-sm ${modalBase} p-6`}
            >
              <div className="flex items-start gap-3 mb-5">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${darkMode ? "bg-emerald-950/30" : "bg-emerald-50"}`}>
                  <ShieldCheck size={18} className="text-emerald-600" />
                </div>
                <div>
                  <h3 className={`text-sm font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>Verify Donation?</h3>
                  <p className={`text-xs mt-0.5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                    Confirming <span className="font-semibold text-emerald-600">{fmt(selectedPayment?.amount)}</span> for the foundation. This will finalize the record.
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setShowApproveModal(false)} disabled={isApproving} className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${darkMode ? "border-gray-700 text-gray-300 hover:bg-gray-800" : "border-gray-200 text-gray-700 hover:bg-gray-50"}`}>
                  Cancel
                </button>
                <button onClick={confirmApprove} disabled={isApproving} className="flex-1 py-2 rounded-lg text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white transition-all disabled:opacity-50 flex items-center justify-center gap-1.5">
                  {isApproving ? <><span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Verifying...</> : <><Check size={13} /> Confirm</>}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Reject */}
        {showRejectModal && (
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }}
              className={`w-full max-w-sm ${modalBase} p-6`}
            >
              <div className="flex items-start gap-3 mb-4">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${darkMode ? "bg-red-950/30" : "bg-red-50"}`}>
                  <XCircle size={18} className="text-red-600" />
                </div>
                <div>
                  <h3 className={`text-sm font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>Reject Donation?</h3>
                  <p className={`text-xs mt-0.5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Provide a reason for rejection.</p>
                </div>
              </div>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Rejection reason..."
                rows={3}
                className={`w-full px-3 py-2 rounded-lg border text-sm outline-none resize-none mb-3 ${darkMode ? "bg-gray-800/60 border-gray-700 text-white placeholder-gray-500" : "bg-gray-50 border-gray-200 text-gray-900"}`}
              />
              <label className="flex items-center gap-2 cursor-pointer mb-4">
                <input type="checkbox" checked={initiateRefund} onChange={(e) => setInitiateRefund(e.target.checked)} className="w-3.5 h-3.5 accent-red-500" />
                <span className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Initiate Refund</span>
              </label>
              <div className="flex gap-2">
                <button onClick={() => setShowRejectModal(false)} disabled={isRejecting} className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${darkMode ? "border-gray-700 text-gray-300 hover:bg-gray-800" : "border-gray-200 text-gray-700 hover:bg-gray-50"}`}>
                  Cancel
                </button>
                <button onClick={confirmReject} disabled={isRejecting || !rejectionReason.trim()} className="flex-1 py-2 rounded-lg text-sm font-medium bg-red-600 hover:bg-red-700 text-white transition-all disabled:opacity-50 flex items-center justify-center gap-1.5">
                  {isRejecting ? <><span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Rejecting...</> : <><X size={13} /> Reject</>}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* ── Details — Clerk-style slide-over ─────────────────────── */}
        {showDetailsModal && selectedPayment && (() => {
          const cfg = getPaymentDisplayConfig(selectedPayment);
          const StatusIcon = cfg.icon;
          const p = selectedPayment;
          const donorName = p.donor?.fullName
            || (p.anonymous ? "Anonymous Donor" : `${p.guestInfo?.firstName || ""} ${p.guestInfo?.lastName || ""}`.trim() || "Unknown");
          const donorEmail = p.donor?.email || p.guestInfo?.email || "—";
          const donorPhone = p.donor?.phone || p.guestInfo?.phone || "—";
          const isAutoApproved = p.status === "verified" && p.approvalStatus === "approved"
            && (!p.approvedBy || p.verificationDetails?.method?.includes("paystack"));
          const isManualTransfer = p.paymentMethod === "manual_transfer" || p.paymentMethod === "bank_transfer";

          const SectionLabel = ({ children }) => (
            <p className={`text-[10px] font-bold uppercase tracking-widest mb-2.5 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
              {children}
            </p>
          );
          const Row = ({ label, value, valueClass = "", mono = false }) => (
            <div className="flex items-start justify-between gap-4 py-2.5">
              <span className={`text-xs flex-shrink-0 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{label}</span>
              <span className={`text-xs text-right break-all ${mono ? "font-mono" : "font-medium"} ${valueClass || (darkMode ? "text-gray-200" : "text-gray-800")}`}>
                {value || "—"}
              </span>
            </div>
          );
          const Divider = () => <div className={`my-4 border-t ${darkMode ? "border-gray-800" : "border-gray-100"}`} />;

          return (
            <div className="fixed inset-0 z-[102] flex">
              {/* Scrim */}
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowDetailsModal(false)} />

              {/* Slide-over panel — right side */}
              <motion.div
                initial={{ x: "100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "100%", opacity: 0 }}
                transition={{ type: "spring", stiffness: 320, damping: 32 }}
                className={`relative ml-auto h-full w-full max-w-md flex flex-col overflow-hidden ${darkMode ? "bg-[#0e0e0e] border-l border-gray-800" : "bg-white border-l border-gray-200"} shadow-2xl`}
              >
                {/* ── Panel header ── */}
                <div className={`flex items-center justify-between px-6 py-4 border-b flex-shrink-0 ${darkMode ? "border-gray-800 bg-[#111]" : "border-gray-100 bg-white"}`}>
                  <div>
                    <p className={`text-[10px] font-bold uppercase tracking-widest ${darkMode ? "text-gray-500" : "text-gray-400"}`}>Transaction</p>
                    <p className={`text-sm font-semibold mt-0.5 font-mono ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                      {p.donationId || p._id?.slice(-8)?.toUpperCase()}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className={`p-2 rounded-lg transition-all ${darkMode ? "text-gray-400 hover:bg-gray-800 hover:text-white" : "text-gray-400 hover:bg-gray-100 hover:text-gray-700"}`}
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* ── Scrollable body ── */}
                <div className="flex-1 overflow-y-auto">

                  {/* ── Hero: amount + status ── */}
                  <div className={`px-6 py-8 text-center border-b ${darkMode ? "border-gray-800 bg-[#111]" : "border-gray-100 bg-gray-50"}`}>
                    {/* Status badge */}
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-4 ${cfg.bg} ${cfg.color}`}>
                      <StatusIcon size={12} />
                      {cfg.label}
                    </div>
                    {/* Amount */}
                    <p className={`text-4xl font-black tracking-tight ${darkMode ? "text-white" : "text-gray-900"}`}>
                      {fmt(p.amount)}
                    </p>
                    <p className={`text-xs mt-2 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                      {new Date(p.createdAt).toLocaleDateString("en-NG", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                      {" · "}
                      {new Date(p.createdAt).toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" })}
                    </p>

                    {/* Paystack auto-verified badge */}
                    {isAutoApproved && (
                      <div className={`mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${darkMode ? "bg-emerald-950/40 text-emerald-400" : "bg-emerald-50 text-emerald-700"}`}>
                        <ShieldCheck size={12} />
                        Auto-verified by Paystack
                      </div>
                    )}
                  </div>

                  <div className="px-6 py-5 space-y-1">

                    {/* ── Donor ── */}
                    <SectionLabel>Donor</SectionLabel>
                    <div className={`rounded-xl p-4 mb-4 ${darkMode ? "bg-gray-900/60 border border-gray-800" : "bg-gray-50 border border-gray-100"}`}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${darkMode ? "bg-indigo-950/50 text-indigo-300" : "bg-indigo-100 text-indigo-700"}`}>
                          {donorName === "Anonymous Donor" ? "?" : donorName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className={`text-sm font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>{donorName}</p>
                          <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{donorEmail}</p>
                        </div>
                      </div>
                      {donorPhone !== "—" && (
                        <Row label="Phone" value={donorPhone} />
                      )}
                      {p.anonymous && (
                        <div className={`mt-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded ${darkMode ? "bg-gray-800 text-gray-400" : "bg-gray-200 text-gray-500"} w-fit`}>
                          Anonymous
                        </div>
                      )}
                    </div>

                    <Divider />

                    {/* ── Payment details ── */}
                    <SectionLabel>Payment Details</SectionLabel>
                    <div className={`divide-y rounded-xl overflow-hidden ${darkMode ? "divide-gray-800 bg-gray-900/60 border border-gray-800" : "divide-gray-100 bg-gray-50 border border-gray-100"}`}>
                      <div className="px-4"><Row label="Campaign" value={p.campaign?.title} /></div>
                      <div className="px-4"><Row label="Method" value={(p.paymentMethod || "card").replace(/_/g, " ")} /></div>
                      <div className="px-4"><Row label="Reference" value={p.paymentReference || p.paystackReference} mono /></div>
                      {p.transactionId && (
                        <div className="px-4"><Row label="Paystack ID" value={p.transactionId} mono /></div>
                      )}
                      <div className="px-4">
                        <Row
                          label="Payment Status"
                          value={p.status}
                          valueClass={
                            p.status === "verified" ? "text-emerald-600 capitalize" :
                            p.status === "failed"   ? "text-red-600 capitalize" :
                            "text-amber-600 capitalize"
                          }
                        />
                      </div>
                      <div className="px-4">
                        <Row
                          label="Approval"
                          value={p.approvalStatus}
                          valueClass={
                            p.approvalStatus === "approved" ? "text-emerald-600 capitalize" :
                            p.approvalStatus === "rejected" ? "text-red-600 capitalize" :
                            "text-amber-600 capitalize"
                          }
                        />
                      </div>
                      {p.message && (
                        <div className="px-4 py-3">
                          <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>Message</p>
                          <p className={`text-xs italic ${darkMode ? "text-gray-300" : "text-gray-600"}`}>"{p.message}"</p>
                        </div>
                      )}
                    </div>

                    {/* ── Failure reason ── */}
                    {p.failureReason && (
                      <>
                        <Divider />
                        <div className={`rounded-xl p-4 border ${darkMode ? "bg-red-950/20 border-red-900/40" : "bg-red-50 border-red-100"}`}>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-red-600 mb-1">Failure Reason</p>
                          <p className={`text-xs ${darkMode ? "text-red-400" : "text-red-700"}`}>{p.failureReason}</p>
                        </div>
                      </>
                    )}

                    {/* ── Rejection reason ── */}
                    {p.rejectionReason && (
                      <>
                        <Divider />
                        <div className={`rounded-xl p-4 border ${darkMode ? "bg-red-950/20 border-red-900/40" : "bg-red-50 border-red-100"}`}>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-red-600 mb-1">Rejection Reason</p>
                          <p className={`text-xs ${darkMode ? "text-red-400" : "text-red-700"}`}>{p.rejectionReason}</p>
                        </div>
                      </>
                    )}

                    <Divider />

                    {/* ── Timeline ── */}
                    <SectionLabel>Timeline</SectionLabel>
                    <div className="space-y-3 pb-2">
                      {[
                        { label: "Donation created",    date: p.createdAt,    color: "bg-gray-400",    show: true },
                        { label: "Payment verified",    date: p.verifiedAt,   color: "bg-emerald-500", show: !!p.verifiedAt },
                        { label: "Approved",            date: p.approvedAt,   color: "bg-emerald-600", show: !!p.approvedAt && p.approvalStatus === "approved" },
                        { label: "Rejected / Revoked",  date: p.rejectedAt || p.approvedAt, color: "bg-red-500", show: p.approvalStatus === "rejected" },
                      ].filter(e => e.show).map((event, idx, arr) => (
                        <div key={idx} className="flex items-start gap-3">
                          <div className="flex flex-col items-center">
                            <div className={`w-2.5 h-2.5 rounded-full mt-0.5 flex-shrink-0 ${event.color}`} />
                            {idx < arr.length - 1 && (
                              <div className={`w-px flex-1 mt-1 min-h-[20px] ${darkMode ? "bg-gray-800" : "bg-gray-200"}`} />
                            )}
                          </div>
                          <div className="pb-2">
                            <p className={`text-xs font-medium ${darkMode ? "text-gray-200" : "text-gray-800"}`}>{event.label}</p>
                            {event.date && (
                              <p className={`text-[11px] mt-0.5 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                                {new Date(event.date).toLocaleDateString("en-NG", { month: "short", day: "numeric", year: "numeric" })}
                                {" · "}
                                {new Date(event.date).toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" })}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* ── Verification source ── */}
                    {p.verificationDetails?.method && (
                      <>
                        <Divider />
                        <div className={`rounded-xl px-4 py-3 border ${darkMode ? "bg-gray-900/50 border-gray-800" : "bg-gray-50 border-gray-100"}`}>
                          <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>Verification Method</p>
                          <p className={`text-xs font-mono ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                            {p.verificationDetails.method.replace(/_/g, " ")}
                          </p>
                          {p.verificationDetails.notes && (
                            <p className={`text-[11px] mt-1 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>{p.verificationDetails.notes}</p>
                          )}
                        </div>
                      </>
                    )}

                  </div>
                </div>

                {/* ── Sticky action footer ── */}
                {(() => {
                  const showRevoke  = p.status === "verified" && p.approvalStatus === "approved";
                  const showApprove = isManualTransfer && p.status === "verified" && p.approvalStatus === "pending";
                  const showReject  = isManualTransfer && p.status === "verified" && p.approvalStatus === "pending";
                  if (!showRevoke && !showApprove && !showReject) return null;
                  return (
                    <div className={`flex-shrink-0 px-6 py-4 border-t flex gap-2 ${darkMode ? "border-gray-800 bg-[#111]" : "border-gray-100 bg-white"}`}>
                      {showRevoke && (
                        <button
                          onClick={() => { setShowDetailsModal(false); handleRevoke(p); }}
                          className="flex-1 py-2.5 rounded-lg text-sm font-semibold bg-amber-500 hover:bg-amber-600 text-white transition-all flex items-center justify-center gap-1.5"
                        >
                          <XCircle size={14} /> Revoke
                        </button>
                      )}
                      {showApprove && (
                        <button
                          onClick={() => { setShowDetailsModal(false); handleApprove(p); }}
                          className="flex-1 py-2.5 rounded-lg text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-all flex items-center justify-center gap-1.5"
                        >
                          <Check size={14} /> Approve
                        </button>
                      )}
                      {showReject && (
                        <button
                          onClick={() => { setShowDetailsModal(false); handleReject(p); }}
                          className="flex-1 py-2.5 rounded-lg text-sm font-semibold bg-red-600 hover:bg-red-700 text-white transition-all flex items-center justify-center gap-1.5"
                        >
                          <X size={14} /> Reject
                        </button>
                      )}
                    </div>
                  );
                })()}
              </motion.div>
            </div>
          );
        })()}

      </AnimatePresence>
    </div>
  );
};

export default Payments;
