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
  FileText,
  Check,
  X,
  Loader,
  AlertCircle,
  Filter,
  ChevronDown,
  DollarSign,
  TrendingUp,
  Wallet,
  ShieldCheck,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Shield,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

import { StatsCard } from "../shared";
import {
  fetchPaymentStats,
  fetchAllPayments,
  approvePayment,
  exportPayments,
  setFilters,
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
  const [selectedPayment, setSelectedPayment] = useState(null);

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
        trend: "+15%", // Mock trend
        trendUp: true,
      },
      {
        label: "Verified Donations",
        value: (stats.overview?.successful?.count || 0).toString(),
        subtitle: "Verified Support",
        icon: ShieldCheck,
        bgColor: "from-emerald-500 to-teal-500",
        trend: "+8.2%", // Mock trend
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

  const handleApprove = (payment) => {
    setSelectedPayment(payment);
    setShowApproveModal(true);
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

      {/* Transaction Tracker / Filters */}
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
              className={`px-8 py-4 rounded-2xl border-2 outline-none cursor-pointer text-sm font-bold xl:min-w-[200px] ${
                darkMode
                  ? "bg-gray-800/50 border-gray-700 text-white focus:border-emerald-500"
                  : "bg-gray-50 border-gray-100 text-dark focus:border-emerald-500 hover:bg-white transition-colors"
              }`}
            >
              <option>Payment Status</option>
              <option>Pending Review</option>
              <option>Verified Donations</option>
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

      {/* Giving activity */}
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
              darkMode
                ? "bg-gray-800 text-gray-400"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {payments?.length || 0} Records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
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
                  Project Path
                </th>
                <th
                  className={`px-8 py-5 text-left text-xs font-bold uppercase tracking-wider ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Donor Details
                </th>
                <th
                  className={`px-8 py-5 text-right text-xs font-bold uppercase tracking-wider ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Amount
                </th>
                <th
                  className={`px-8 py-5 text-left text-xs font-bold uppercase tracking-wider ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Method
                </th>
                <th
                  className={`px-8 py-5 text-left text-xs font-bold uppercase tracking-wider ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Status
                </th>
                <th
                  className={`px-8 py-5 text-center text-xs font-bold uppercase tracking-wider ${
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
                {payments.map((payment, i) => {
                  const statusConfig = getStatusConfig(payment.approvalStatus);
                  return (
                    <motion.tr
                      key={payment._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`group hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 transition-colors cursor-pointer`}
                    >
                      {/* Project Path */}
                      <td className="px-8 py-6 min-w-[240px]">
                        <div className="flex flex-col">
                          <span
                            className={`text-sm font-bold ${
                              darkMode ? "text-white" : "text-dark"
                            }`}
                          >
                            {payment.campaign?.title || "General Donation"}
                          </span>
                          <span
                            className={`text-xs font-medium mt-1 ${darkMode ? "text-gray-500" : "text-gray-500"}`}
                          >
                            ID: #
                            {payment.donationId ||
                              payment._id.slice(-8).toUpperCase()}
                          </span>
                        </div>
                      </td>

                      {/* Donor Details */}
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                            <img
                              src={
                                payment.anonymous
                                  ? "https://ui-avatars.com/api/?name=A&background=random"
                                  : payment.donor?.avatar ||
                                    "https://ui-avatars.com/api/?name=User&background=indigo&color=fff"
                              }
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex flex-col">
                            <span
                              className={`text-sm font-bold ${
                                darkMode ? "text-gray-200" : "text-dark"
                              }`}
                            >
                              {payment.anonymous
                                ? "Anonymous Donor"
                                : payment.donor?.fullName ||
                                  (payment.guestInfo
                                    ? `${payment.guestInfo.firstName} ${payment.guestInfo.lastName}`
                                    : "Foundation Supporter")}
                            </span>
                            <span
                              className={`text-xs font-medium ${darkMode ? "text-gray-500" : "text-gray-500"}`}
                            >
                              {new Date(payment.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="px-8 py-6 text-right">
                        <span
                          className={`text-sm font-bold ${
                            darkMode ? "text-emerald-400" : "text-emerald-600"
                          }`}
                        >
                          {new Intl.NumberFormat("en-NG", {
                            style: "currency",
                            currency: "NGN",
                            minimumFractionDigits: 0,
                          }).format(payment.amount)}
                        </span>
                      </td>

                      {/* Method */}
                      <td className="px-8 py-6">
                        <span
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest ${darkMode ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-600"}`}
                        >
                          {payment.paymentMethod?.replace("_", " ")}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-8 py-6">
                        <span
                          className={`${statusConfig.bg} ${statusConfig.color} ${statusConfig.border} border px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 w-fit`}
                        >
                          <statusConfig.icon size={12} /> {statusConfig.label}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-8 py-6">
                        <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                          {payment.approvalStatus === "pending" && (
                            <>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleApprove(payment)}
                                className={`p-2 rounded-xl transition-all ${
                                  darkMode
                                    ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white"
                                    : "bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white shadow-sm"
                                }`}
                                title="Approve"
                              >
                                <Check size={16} />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className={`p-2 rounded-xl transition-all ${
                                  darkMode
                                    ? "bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white"
                                    : "bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white shadow-sm"
                                }`}
                                title="Reject"
                              >
                                <X size={16} />
                              </motion.button>
                            </>
                          )}
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className={`p-2 rounded-xl transition-all ${
                              darkMode
                                ? "bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700"
                                : "bg-white text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 shadow-sm border border-gray-100"
                            }`}
                            title="View details"
                          >
                            <Eye size={16} />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {pagination.pages > 1 && (
          <div className="flex items-center justify-between p-6">
            <span
              className={`text-xs font-bold uppercase tracking-wider ${darkMode ? "text-gray-500" : "text-gray-400"}`}
            >
              Page {pagination.page} of {pagination.pages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  dispatch(
                    setFilters({ ...filters, page: pagination.page - 1 }),
                  )
                }
                disabled={pagination.page === 1}
                className={`p-2 rounded-lg transition-all disabled:opacity-50 ${darkMode ? "hover:bg-gray-800 text-white" : "hover:bg-gray-100 text-dark"}`}
              >
                <ChevronLeft size={20} />
              </button>

              <div className="hidden sm:flex items-center gap-2">
                {Array.from(
                  { length: Math.min(pagination.pages, 5) },
                  (_, i) => {
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
                        onClick={() =>
                          dispatch(setFilters({ ...filters, page: pageNum }))
                        }
                        className={`w-10 h-10 rounded-xl font-bold text-xs transition-all ${
                          pagination.page === pageNum
                            ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25 scale-105"
                            : darkMode
                              ? "bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700"
                              : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  },
                )}
              </div>

              <button
                onClick={() =>
                  dispatch(
                    setFilters({ ...filters, page: pagination.page + 1 }),
                  )
                }
                disabled={pagination.page === pagination.pages}
                className={`p-2 rounded-lg transition-all disabled:opacity-50 ${darkMode ? "hover:bg-gray-800 text-white" : "hover:bg-gray-100 text-dark"}`}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
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
              <div
                className={`p-2 rounded-lg ${darkMode ? "bg-emerald-900/50" : "bg-emerald-100"}`}
              >
                <ShieldCheck className="text-emerald-600" size={24} />
              </div>
              <span className="text-xs font-bold tracking-widest uppercase text-emerald-500">
                Public Trust
              </span>
            </div>
            <h2
              className={`text-2xl font-extrabold mb-3 ${
                darkMode ? "text-white" : "text-dark"
              }`}
            >
              Financial Transparency
            </h2>
            <p
              className={`text-base leading-relaxed max-w-2xl ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Every donation verified here represents a life-changing
              contribution. We maintain 100% transparency from donor to
              community projects.
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

      {/* Verification Modal Placeholder */}
      <AnimatePresence>
        {showApproveModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`p-8 rounded-[2rem] max-w-lg w-full border ${
                darkMode
                  ? "bg-gray-950 border-gray-800"
                  : "bg-white border-gray-100 shadow-2xl"
              }`}
            >
              <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheck size={40} className="text-emerald-500" />
              </div>
              <h2
                className={`text-2xl font-extrabold tracking-tight text-center ${
                  darkMode ? "text-white" : "text-gray-950"
                }`}
              >
                Verify Donation?
              </h2>
              <p className="mt-4 text-center text-sm font-medium text-gray-500 leading-relaxed">
                Confirming{" "}
                <span
                  className={`font-bold ${darkMode ? "text-white" : "text-dark"}`}
                >
                  {new Intl.NumberFormat("en-NG", {
                    style: "currency",
                    currency: "NGN",
                  }).format(selectedPayment?.amount)}
                </span>{" "}
                for the foundation project. This will finalize the donation
                record and update public ledgers.
              </p>
              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => setShowApproveModal(false)}
                  className={`flex-1 py-4 rounded-xl font-bold uppercase tracking-wider text-xs transition-colors ${
                    darkMode
                      ? "bg-gray-900 text-gray-400 hover:bg-gray-800"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    await dispatch(
                      approvePayment({ paymentId: selectedPayment._id }),
                    );
                    setShowApproveModal(false);
                  }}
                  className="flex-1 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase tracking-wider text-xs shadow-lg shadow-emerald-500/20 transition-all"
                >
                  Confirm Donation
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Payments;
