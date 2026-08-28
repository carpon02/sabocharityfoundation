// admin/src/component/pages/AdminDashboard.jsx - Foundation Hub
import React, { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  Users,
  Target,
  Activity,
  Zap,
  Globe,
  BarChart3,
  TrendingUp,
  Heart,
  Calendar,
  RefreshCw,
  Download,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import toast from "react-hot-toast";
import { useTheme } from "../../context/ThemeContext";
import { useSelector, useDispatch } from "react-redux";
import { StatsCard, LoadingSpinner } from "../shared";
import { formatCurrency } from "../../utils";
import {
  fetchPlatformAnalytics,
  fetchDonationTrends,
} from "../../features/analytics/analyticsSlice";
import { fetchCampaigns } from "../../features/campaign/adminCampaignSlice";
import { fetchAllPayments } from "../../features/payment/adminPaymentsSlice";

const AdminDashboard = () => {
  const { darkMode } = useTheme();
  const dispatch = useDispatch();

  const {
    platformAnalytics,
    donationTrends,
    loading: analyticsLoading,
  } = useSelector((state) => state.analytics);
  const { payments, loading: paymentsLoading } = useSelector(
    (state) => state.adminPayments,
  );

  useEffect(() => {
    dispatch(fetchPlatformAnalytics());
    dispatch(fetchCampaigns({ limit: 4 }));
    dispatch(
      fetchAllPayments({ limit: 5, sortBy: "createdAt", order: "desc" }),
    );
    dispatch(fetchDonationTrends());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchPlatformAnalytics());
    dispatch(
      fetchAllPayments({ limit: 5, sortBy: "createdAt", order: "desc" }),
    );
    dispatch(fetchDonationTrends());
  };

  const handleExportCSV = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";
      const res = await fetch(`${baseUrl}/analytics/export/donations`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to export data");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "donations-export.csv";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success("Export downloaded successfully");
    } catch (error) {
      toast.error("Failed to export donations");
    }
  };

  const stats = useMemo(() => {
    if (!platformAnalytics) return [];
    return [
      {
        label: "Total Funds Raised",
        value: formatCurrency(
          platformAnalytics.totalAmount || platformAnalytics.amountRaised || 0,
        ),
        subtitle: "Foundation Assets",
        icon: DollarSign,
        bgColor: "from-primary-600 to-primary-700",
      },
      {
        label: "Foundation Donors",
        value: (platformAnalytics.totalDonors || 0).toLocaleString(),
        subtitle: "Donor Community",
        icon: Users,
        bgColor: "from-secondary-500 to-secondary-600",
      },
      {
        label: "Active Projects",
        value: (platformAnalytics.activeCampaigns || 0).toLocaleString(),
        subtitle: "Direct Help",
        icon: Target,
        bgColor: "from-amber-500 to-orange-600",
      },
      {
        label: "Community Growth",
        value: platformAnalytics.growthRate
          ? `${platformAnalytics.growthRate > 0 ? "+" : ""}${platformAnalytics.growthRate.toFixed(1)}%`
          : "+12.5%",
        subtitle: "Monthly Increase",
        icon: Activity,
        bgColor: "from-primary-700 to-primary-800",
      },
    ];
  }, [platformAnalytics]);

  if (analyticsLoading && !platformAnalytics)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <LoadingSpinner size="large" />
        <p
          className={`text-sm font-medium ${
            darkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Loading Foundation Hub...
        </p>
      </div>
    );

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-1 bg-primary-500 rounded-full" />
            <span className="text-xs font-bold text-primary-600 uppercase tracking-wider">
              Foundation Overview
            </span>
          </div>
          <h1
            className={`text-3xl lg:text-4xl font-bold mb-2 ${
              darkMode ? "text-white" : "text-dark"
            }`}
          >
            Foundation Hub
          </h1>
          <p
            className={`text-base ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Real-time foundation impact and community support metrics
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div
            className={`px-5 py-3 rounded-xl border flex items-center gap-3 ${
              darkMode
                ? "bg-dark-lighter border-gray-800"
                : "bg-white border-gray-200 shadow-lg"
            }`}
          >
            <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            <span
              className={`text-xs font-semibold ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Status: <span className="text-primary-500">Active</span>
            </span>
          </div>
          <button
            onClick={handleExportCSV}
            className={`px-4 py-3 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 ${
              darkMode
                ? "bg-primary-600 hover:bg-primary-700 text-white"
                : "bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/30"
            }`}
            title="Export Donations CSV"
          >
            <Download size={18} />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
          <button
            onClick={handleRefresh}
            disabled={analyticsLoading}
            className={`px-4 py-3 rounded-xl border-2 font-semibold text-sm transition-all flex items-center gap-2 ${
              darkMode
                ? "bg-gray-800 border-gray-700 text-gray-300 hover:text-white disabled:opacity-50"
                : "bg-white border-gray-200 text-gray-600 hover:text-dark disabled:opacity-50"
            }`}
            title="Refresh data"
          >
            <RefreshCw
              size={18}
              className={analyticsLoading ? "animate-spin" : ""}
            />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <StatsCard key={i} {...stat} index={i} />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
        {/* Recent Donations */}
        <div
          className={`xl:col-span-2 rounded-2xl border overflow-hidden ${
            darkMode
              ? "bg-dark-lighter border-gray-800"
              : "bg-white border-gray-200 shadow-lg"
          }`}
        >
          {/* Table Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <TrendingUp size={20} className="text-primary-500" />
                <h3
                  className={`text-lg font-bold ${
                    darkMode ? "text-white" : "text-dark"
                  }`}
                >
                  Recent Donations
                </h3>
                <span
                  className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                    darkMode
                      ? "bg-gray-800 text-gray-400"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {payments?.length || 0} Latest
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead
                className={`${
                  darkMode ? "bg-gray-900/50" : "bg-gray-50"
                } border-b ${darkMode ? "border-gray-800" : "border-gray-200"}`}
              >
                <tr>
                  <th
                    className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Donor
                  </th>
                  <th
                    className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Amount
                  </th>
                  <th
                    className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Method
                  </th>
                  <th
                    className={`px-6 py-4 text-right text-xs font-bold uppercase tracking-wider ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody
                className={`divide-y ${
                  darkMode ? "divide-gray-800" : "divide-gray-200"
                }`}
              >
                {paymentsLoading ? (
                  // Loading Skeleton
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4">
                        <div
                          className={`h-12 rounded-lg animate-pulse ${
                            darkMode ? "bg-gray-800" : "bg-gray-100"
                          }`}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div
                          className={`h-8 rounded-lg animate-pulse ${
                            darkMode ? "bg-gray-800" : "bg-gray-100"
                          }`}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div
                          className={`h-8 rounded-lg animate-pulse ${
                            darkMode ? "bg-gray-800" : "bg-gray-100"
                          }`}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div
                          className={`h-8 rounded-lg animate-pulse ${
                            darkMode ? "bg-gray-800" : "bg-gray-100"
                          }`}
                        />
                      </td>
                    </tr>
                  ))
                ) : payments && payments.length > 0 ? (
                  payments.slice(0, 5).map((p, i) => (
                    <motion.tr
                      key={p._id || i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                            <img
                              src={
                                p.donor?.avatar ||
                                `https://ui-avatars.com/api/?name=${
                                  p.donor?.fullName || "A"
                                }&background=10b981&color=fff`
                              }
                              alt={p.donor?.fullName || "Donor"}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex flex-col">
                            <span
                              className={`text-sm font-semibold ${
                                darkMode ? "text-white" : "text-dark"
                              }`}
                            >
                              {p.donor?.fullName || "Anonymous Donor"}
                            </span>
                            <span
                              className={`text-xs ${
                                darkMode ? "text-gray-500" : "text-gray-600"
                              }`}
                            >
                              {new Date(p.createdAt).toLocaleDateString(
                                "en-NG",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                },
                              )}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-sm font-bold ${
                            darkMode ? "text-white" : "text-dark"
                          }`}
                        >
                          {formatCurrency(p.amount)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-sm capitalize ${
                            darkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {p.paymentMethod?.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                            p.status === "completed"
                              ? "bg-green-100 dark:bg-green-950/30 text-green-600"
                              : "bg-amber-100 dark:bg-amber-950/30 text-amber-600"
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-20 text-center">
                      <div
                        className={`flex flex-col items-center gap-4 ${
                          darkMode ? "text-gray-500" : "text-gray-400"
                        }`}
                      >
                        <Heart size={48} />
                        <p className="text-lg font-semibold">
                          No donations yet
                        </p>
                        <p className="text-sm">
                          Recent donations will appear here
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden divide-y divide-gray-200 dark:divide-gray-800">
            {paymentsLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-6">
                  <div
                    className={`h-20 rounded-xl animate-pulse ${
                      darkMode ? "bg-gray-800" : "bg-gray-100"
                    }`}
                  />
                </div>
              ))
            ) : payments && payments.length > 0 ? (
              payments.slice(0, 5).map((p, i) => (
                <motion.div
                  key={p._id || i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                        <img
                          src={
                            p.donor?.avatar ||
                            `https://ui-avatars.com/api/?name=${
                              p.donor?.fullName || "A"
                            }&background=10b981&color=fff`
                          }
                          alt={p.donor?.fullName || "Donor"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p
                          className={`text-sm font-semibold ${
                            darkMode ? "text-white" : "text-dark"
                          }`}
                        >
                          {p.donor?.fullName || "Anonymous"}
                        </p>
                        <p
                          className={`text-xs ${
                            darkMode ? "text-gray-500" : "text-gray-600"
                          }`}
                        >
                          {new Date(p.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-sm font-bold ${
                        darkMode ? "text-white" : "text-dark"
                      }`}
                    >
                      {formatCurrency(p.amount)}
                    </span>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="p-20 text-center">
                <div
                  className={`flex flex-col items-center gap-4 ${
                    darkMode ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  <Heart size={48} />
                  <p className="text-lg font-semibold">No donations yet</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Cards */}
        <div className="space-y-6">
          {/* Foundation Reach */}
          <div
            className={`p-6 rounded-2xl border ${
              darkMode
                ? "bg-dark-lighter border-gray-800"
                : "bg-white border-gray-200 shadow-lg"
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <h3
                className={`text-lg font-bold ${
                  darkMode ? "text-white" : "text-dark"
                }`}
              >
                Foundation Reach
              </h3>
              <Globe size={20} className="text-primary-500" />
            </div>
            <div className="space-y-5">
              {(
                platformAnalytics?.geoImpact || [
                  { label: "Nigeria (Core)", value: 65, color: "primary" },
                  { label: "International", value: 35, color: "secondary" },
                ]
              ).map((loc, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-center text-sm font-semibold">
                    <span
                      className={darkMode ? "text-gray-400" : "text-gray-600"}
                    >
                      {loc.label}
                    </span>
                    <span className={darkMode ? "text-white" : "text-dark"}>
                      {loc.value}%
                    </span>
                  </div>
                  <div
                    className={`h-2 w-full rounded-full ${
                      darkMode ? "bg-gray-800" : "bg-gray-100"
                    }`}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${loc.value}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className="h-full rounded-full bg-gradient-to-r from-primary-500 to-secondary-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Growth Insight */}
          <div
            className={`p-6 rounded-2xl border overflow-hidden relative ${
              darkMode
                ? "bg-primary-950/20 border-primary-900/30"
                : "bg-primary-50 border-primary-100"
            }`}
          >
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <Zap size={64} className="text-primary-500" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <Heart className="text-primary-600" size={20} />
                <div className="bg-primary-500 w-12 h-1 rounded-full" />
              </div>
              <h3
                className={`text-lg font-bold mb-3 ${
                  darkMode ? "text-white" : "text-dark"
                }`}
              >
                Foundation Growth
              </h3>
              <p
                className={`text-sm leading-relaxed mb-4 ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Foundation performance is tracking at{" "}
                {platformAnalytics?.performanceRate || 122}% of historical
                averages. All giving activities are accelerating.
              </p>
              <button className="w-full py-3 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-semibold text-sm shadow-lg shadow-primary-500/25 transition-all">
                View Detailed Progress
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Donation Trends Chart */}
      <div
        className={`p-6 lg:p-8 rounded-2xl border ${
          darkMode
            ? "bg-dark-lighter border-gray-800"
            : "bg-white border-gray-200 shadow-lg"
        }`}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 size={20} className="text-primary-500" />
              <h3
                className={`text-xl font-bold ${
                  darkMode ? "text-white" : "text-dark"
                }`}
              >
                Donation Trends
              </h3>
            </div>
            <p
              className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Monthly donation statistics
            </p>
          </div>
          <Calendar size={20} className="text-gray-400" />
        </div>
        {donationTrends && donationTrends.length > 0 ? (
          <div className="h-72 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={donationTrends}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? "#374151" : "#e5e7eb"} />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: darkMode ? "#9ca3af" : "#6b7280", fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: darkMode ? "#9ca3af" : "#6b7280", fontSize: 12 }}
                  tickFormatter={(value) => `₦${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: darkMode ? "#111827" : "#ffffff",
                    borderColor: darkMode ? "#374151" : "#e5e7eb",
                    borderRadius: "0.5rem",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
                  }}
                  itemStyle={{ color: "#10b981", fontWeight: "bold" }}
                  formatter={(value) => [formatCurrency(value), "Amount"]}
                  labelStyle={{ color: darkMode ? "#9ca3af" : "#6b7280", marginBottom: "0.25rem" }}
                />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorAmount)" 
                  activeDot={{ r: 6, strokeWidth: 0, fill: "#10b981" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-48 flex items-center justify-center">
            <div
              className={`text-center ${
                darkMode ? "text-gray-500" : "text-gray-400"
              }`}
            >
              <BarChart3 size={48} className="mx-auto mb-3 opacity-50" />
              <p className="text-sm font-semibold">No trend data available</p>
              <p className="text-xs mt-1">
                Data will appear as donations are received
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
