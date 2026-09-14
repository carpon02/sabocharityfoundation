// admin/src/component/pages/AdminDashboard.jsx - Clerk-Style Redesign
import React, { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  DollarSign,
  Users,
  Target,
  Activity,
  BarChart3,
  TrendingUp,
  Heart,
  Calendar,
  RefreshCw,
  Download,
  ArrowUpRight,
  Clock,
  CheckCircle,
  XCircle,
  ExternalLink,
  ChevronRight,
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
import { LoadingSpinner } from "../shared";
import { formatCurrency } from "../../utils";
import {
  fetchPlatformAnalytics,
  fetchDonationTrends,
} from "../../features/analytics/analyticsSlice";
import { fetchCampaigns } from "../../features/campaign/adminCampaignSlice";
import { fetchAllPayments } from "../../features/payment/adminPaymentsSlice";

// Payment status badge config
const getStatusBadge = (status) => {
  switch (status) {
    case "completed":
      return {
        label: "Completed",
        icon: CheckCircle,
        className: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400",
      };
    case "pending":
      return {
        label: "Pending",
        icon: Clock,
        className: "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400",
      };
    case "failed":
      return {
        label: "Failed",
        icon: XCircle,
        className: "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400",
      };
    default:
      return {
        label: status,
        icon: Clock,
        className: "bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
      };
  }
};

// Stat metric card — Clerk-style: bordered, no gradients, clean numbers
const MetricCard = ({ label, value, subtitle, icon: Icon, change, index }) => {
  const { darkMode } = useTheme();
  const isPositive = change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3 }}
      className={`p-5 rounded-xl border transition-all hover:shadow-md ${
        darkMode
          ? "bg-dark-lighter border-gray-800/70 hover:border-gray-700"
          : "bg-white border-gray-200/80 hover:border-gray-300 shadow-sm"
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-9 h-9 rounded-lg flex items-center justify-center ${
            darkMode ? "bg-gray-800/80" : "bg-gray-50"
          }`}
        >
          <Icon size={18} className="text-primary-600" />
        </div>
        {change !== undefined && (
          <div
            className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
              isPositive
                ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400"
                : "bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400"
            }`}
          >
            <ArrowUpRight
              size={12}
              className={isPositive ? "" : "rotate-180"}
            />
            {Math.abs(change).toFixed(1)}%
          </div>
        )}
      </div>
      <p
        className={`text-2xl font-bold mb-1 tracking-tight ${
          darkMode ? "text-white" : "text-gray-900"
        }`}
      >
        {value}
      </p>
      <p
        className={`text-sm font-medium ${
          darkMode ? "text-gray-400" : "text-gray-500"
        }`}
      >
        {label}
      </p>
      {subtitle && (
        <p
          className={`text-xs mt-0.5 ${
            darkMode ? "text-gray-600" : "text-gray-400"
          }`}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
};

const AdminDashboard = () => {
  const { darkMode } = useTheme();
  const dispatch = useDispatch();

  const {
    platformAnalytics,
    donationTrends,
    loading: analyticsLoading,
  } = useSelector((state) => state.analytics);
  const { payments, loading: paymentsLoading } = useSelector(
    (state) => state.adminPayments
  );
  const { campaigns } = useSelector((state) => state.adminCampaigns);

  useEffect(() => {
    dispatch(fetchPlatformAnalytics());
    dispatch(fetchCampaigns({ limit: 4 }));
    dispatch(
      fetchAllPayments({ limit: 5, sortBy: "createdAt", order: "desc" })
    );
    dispatch(fetchDonationTrends());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchPlatformAnalytics());
    dispatch(fetchAllPayments({ limit: 5, sortBy: "createdAt", order: "desc" }));
    dispatch(fetchDonationTrends());
  };

  const handleExportCSV = async () => {
    try {
      const baseUrl =
        import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";
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

  const metrics = useMemo(() => {
    if (!platformAnalytics) return [];
    return [
      {
        label: "Total Funds Raised",
        value: formatCurrency(
          platformAnalytics.totalAmount || platformAnalytics.amountRaised || 0
        ),
        subtitle: "All time",
        icon: DollarSign,
        change: platformAnalytics.growthRate,
      },
      {
        label: "Total Donors",
        value: (platformAnalytics.totalDonors || 0).toLocaleString(),
        subtitle: "Donor community",
        icon: Users,
      },
      {
        label: "Active Campaigns",
        value: (platformAnalytics.activeCampaigns || 0).toLocaleString(),
        subtitle: "Currently running",
        icon: Target,
      },
      {
        label: "Monthly Growth",
        value: platformAnalytics.growthRate
          ? `${platformAnalytics.growthRate > 0 ? "+" : ""}${platformAnalytics.growthRate.toFixed(1)}%`
          : "+12.5%",
        subtitle: "vs last month",
        icon: Activity,
        change: platformAnalytics.growthRate,
      },
    ];
  }, [platformAnalytics]);

  // Pending campaigns that need review
  const pendingCampaigns = useMemo(
    () => campaigns.filter((c) => c.status === "pending" || !c.approved).slice(0, 3),
    [campaigns]
  );

  if (analyticsLoading && !platformAnalytics)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3">
        <LoadingSpinner size="large" />
        <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
          Loading dashboard...
        </p>
      </div>
    );

  return (
    <div className="space-y-6 pb-10">
      {/* Page Header — Clerk style: clean, minimal */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className={`text-xl font-semibold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Dashboard
          </h1>
          <p
            className={`text-sm mt-0.5 ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Foundation overview and key metrics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={analyticsLoading}
            className={`p-2 rounded-lg border text-sm font-medium transition-all flex items-center gap-1.5 ${
              darkMode
                ? "bg-dark-lighter border-gray-800 text-gray-400 hover:text-white hover:border-gray-700"
                : "bg-white border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300 shadow-sm"
            }`}
            title="Refresh data"
          >
            <RefreshCw size={15} className={analyticsLoading ? "animate-spin" : ""} />
          </button>
          <button
            onClick={handleExportCSV}
            className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all flex items-center gap-1.5 ${
              darkMode
                ? "bg-dark-lighter border-gray-800 text-gray-300 hover:text-white hover:border-gray-700"
                : "bg-white border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300 shadow-sm"
            }`}
          >
            <Download size={15} />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {analyticsLoading && !platformAnalytics
          ? Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className={`p-5 rounded-xl border animate-pulse ${
                  darkMode ? "bg-dark-lighter border-gray-800" : "bg-white border-gray-200 shadow-sm"
                }`}
              >
                <div className={`w-9 h-9 rounded-lg mb-4 ${darkMode ? "bg-gray-800" : "bg-gray-100"}`} />
                <div className={`h-7 rounded w-2/3 mb-2 ${darkMode ? "bg-gray-800" : "bg-gray-100"}`} />
                <div className={`h-4 rounded w-1/2 ${darkMode ? "bg-gray-800" : "bg-gray-100"}`} />
              </div>
            ))
          : metrics.map((m, i) => <MetricCard key={i} {...m} index={i} />)}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Donations Table — xl:col-span-2 */}
        <div
          className={`xl:col-span-2 rounded-xl border overflow-hidden ${
            darkMode
              ? "bg-dark-lighter border-gray-800/70"
              : "bg-white border-gray-200/80 shadow-sm"
          }`}
        >
          <div
            className={`px-5 py-4 border-b flex items-center justify-between ${
              darkMode ? "border-gray-800/60" : "border-gray-100"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <TrendingUp size={17} className="text-primary-500" />
              <h2
                className={`text-sm font-semibold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Recent Donations
              </h2>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  darkMode ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-500"
                }`}
              >
                {payments?.length || 0}
              </span>
            </div>
            <Link
              to="/admin/payments"
              className={`flex items-center gap-1 text-xs font-medium transition-colors ${
                darkMode
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              View all <ChevronRight size={13} />
            </Link>
          </div>

          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr
                  className={`border-b text-left ${
                    darkMode ? "border-gray-800/60" : "border-gray-50"
                  }`}
                >
                  {["Donor", "Amount", "Method", "Status"].map((h, i) => (
                    <th
                      key={h}
                      className={`px-5 py-3 text-xs font-semibold uppercase tracking-wider ${
                        darkMode ? "text-gray-500" : "text-gray-400"
                      } ${i === 3 ? "text-right" : ""}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paymentsLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td className="px-5 py-3" colSpan={4}>
                        <div
                          className={`h-10 rounded-lg animate-pulse ${
                            darkMode ? "bg-gray-800" : "bg-gray-50"
                          }`}
                        />
                      </td>
                    </tr>
                  ))
                ) : payments && payments.length > 0 ? (
                  payments.slice(0, 5).map((p, i) => {
                    const badge = getStatusBadge(p.status);
                    const BadgeIcon = badge.icon;
                    return (
                      <motion.tr
                        key={p._id || i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className={`border-b transition-colors ${
                          darkMode
                            ? "border-gray-800/40 hover:bg-gray-800/30"
                            : "border-gray-50 hover:bg-gray-50/50"
                        }`}
                      >
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <img
                              src={
                                p.donor?.avatar ||
                                `https://ui-avatars.com/api/?name=${
                                  encodeURIComponent(p.donor?.fullName || "A")
                                }&background=10b981&color=fff&size=64`
                              }
                              alt={p.donor?.fullName || "Donor"}
                              className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                            />
                            <div>
                              <p
                                className={`text-sm font-medium ${
                                  darkMode ? "text-white" : "text-gray-900"
                                }`}
                              >
                                {p.donor?.fullName || "Anonymous"}
                              </p>
                              <p
                                className={`text-xs ${
                                  darkMode ? "text-gray-500" : "text-gray-400"
                                }`}
                              >
                                {new Date(p.createdAt).toLocaleDateString("en-NG", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`text-sm font-semibold ${
                              darkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {formatCurrency(p.amount)}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`text-sm capitalize ${
                              darkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            {p.paymentMethod?.replace("_", " ") || "—"}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${badge.className}`}
                          >
                            <BadgeIcon size={11} />
                            {badge.label}
                          </span>
                        </td>
                      </motion.tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={4} className="px-5 py-16 text-center">
                      <Heart
                        size={32}
                        className={`mx-auto mb-3 ${
                          darkMode ? "text-gray-700" : "text-gray-300"
                        }`}
                      />
                      <p
                        className={`text-sm font-medium ${
                          darkMode ? "text-gray-500" : "text-gray-400"
                        }`}
                      >
                        No donations yet
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden divide-y divide-gray-100 dark:divide-gray-800/50">
            {paymentsLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="p-4">
                    <div
                      className={`h-14 rounded-lg animate-pulse ${
                        darkMode ? "bg-gray-800" : "bg-gray-50"
                      }`}
                    />
                  </div>
                ))
              : payments &&
                payments.slice(0, 5).map((p, i) => {
                  const badge = getStatusBadge(p.status);
                  const BadgeIcon = badge.icon;
                  return (
                    <div key={p._id || i} className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            p.donor?.avatar ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(p.donor?.fullName || "A")}&background=10b981&color=fff&size=64`
                          }
                          alt={p.donor?.fullName || "Donor"}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <p className={`text-sm font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>
                            {p.donor?.fullName || "Anonymous"}
                          </p>
                          <span className={`inline-flex items-center gap-1 text-xs ${badge.className} px-1.5 py-0.5 rounded`}>
                            <BadgeIcon size={10} />
                            {badge.label}
                          </span>
                        </div>
                      </div>
                      <span className={`text-sm font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                        {formatCurrency(p.amount)}
                      </span>
                    </div>
                  );
                })}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Pending Campaigns */}
          <div
            className={`rounded-xl border overflow-hidden ${
              darkMode
                ? "bg-dark-lighter border-gray-800/70"
                : "bg-white border-gray-200/80 shadow-sm"
            }`}
          >
            <div
              className={`px-5 py-4 border-b flex items-center justify-between ${
                darkMode ? "border-gray-800/60" : "border-gray-100"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Target size={17} className="text-amber-500" />
                <h2
                  className={`text-sm font-semibold ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Pending Approval
                </h2>
                {pendingCampaigns.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400">
                    {pendingCampaigns.length}
                  </span>
                )}
              </div>
              <Link
                to="/admin/campaigns"
                className={`flex items-center gap-1 text-xs font-medium transition-colors ${
                  darkMode
                    ? "text-gray-400 hover:text-white"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Review <ChevronRight size={13} />
              </Link>
            </div>

            {pendingCampaigns.length === 0 ? (
              <div className="px-5 py-8 text-center">
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  No campaigns awaiting approval
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-800/50">
                {pendingCampaigns.map((c) => (
                  <div key={c._id} className="px-5 py-3.5 flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-medium truncate ${
                          darkMode ? "text-gray-200" : "text-gray-800"
                        }`}
                      >
                        {c.title}
                      </p>
                      <p className={`text-xs mt-0.5 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                        {c.category} · {new Date(c.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400 flex-shrink-0">
                      Pending
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div
            className={`rounded-xl border p-5 ${
              darkMode
                ? "bg-dark-lighter border-gray-800/70"
                : "bg-white border-gray-200/80 shadow-sm"
            }`}
          >
            <div className="flex items-center gap-2.5 mb-4">
              <BarChart3 size={17} className="text-primary-500" />
              <h2
                className={`text-sm font-semibold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Foundation Stats
              </h2>
            </div>
            <div className="space-y-3">
              {[
                {
                  label: "Campaigns Created",
                  value: (platformAnalytics?.totalCampaigns || campaigns.length || 0).toLocaleString(),
                },
                {
                  label: "Avg. Donation",
                  value: platformAnalytics?.averageDonation
                    ? formatCurrency(platformAnalytics.averageDonation)
                    : "—",
                },
                {
                  label: "Beneficiaries Reached",
                  value: (platformAnalytics?.beneficiaries || 0).toLocaleString(),
                },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {item.label}
                  </span>
                  <span
                    className={`text-sm font-semibold ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Donation Trends Chart */}
      <div
        className={`rounded-xl border ${
          darkMode
            ? "bg-dark-lighter border-gray-800/70"
            : "bg-white border-gray-200/80 shadow-sm"
        }`}
      >
        <div
          className={`px-5 py-4 border-b flex items-center justify-between ${
            darkMode ? "border-gray-800/60" : "border-gray-100"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <BarChart3 size={17} className="text-primary-500" />
            <h2
              className={`text-sm font-semibold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Donation Trends
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary-500" />
            <span className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              Monthly
            </span>
          </div>
        </div>

        <div className="p-5">
          {donationTrends && donationTrends.length > 0 ? (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={donationTrends}
                  margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke={darkMode ? "#1f2937" : "#f3f4f6"}
                  />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: darkMode ? "#6b7280" : "#9ca3af", fontSize: 11 }}
                    dy={8}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: darkMode ? "#6b7280" : "#9ca3af", fontSize: 11 }}
                    tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`}
                    width={60}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: darkMode ? "#1f2937" : "#ffffff",
                      borderColor: darkMode ? "#374151" : "#e5e7eb",
                      borderRadius: "0.5rem",
                      fontSize: "12px",
                      boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                    }}
                    itemStyle={{ color: "#10b981", fontWeight: "600" }}
                    formatter={(value) => [formatCurrency(value), "Donations"]}
                    labelStyle={{ color: darkMode ? "#9ca3af" : "#6b7280", marginBottom: "4px" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="#10b981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorAmount)"
                    activeDot={{ r: 5, strokeWidth: 0, fill: "#10b981" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center">
              <div className={`text-center ${darkMode ? "text-gray-600" : "text-gray-300"}`}>
                <BarChart3 size={36} className="mx-auto mb-2" />
                <p className={`text-sm font-medium ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                  No trend data available
                </p>
                <p className={`text-xs mt-0.5 ${darkMode ? "text-gray-600" : "text-gray-400"}`}>
                  Data will appear as donations are received
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
