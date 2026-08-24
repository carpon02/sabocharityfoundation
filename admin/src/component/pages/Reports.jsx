// admin/src/component/pages/Reports.jsx - Foundation Analytics Hub
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

import {
  Download,
  RefreshCw,
  DollarSign,
  Target,
  Users,
  TrendingUp,
  Activity,
  PieChart,
  Calendar,
  Sparkles,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import {
  fetchPlatformAnalytics,
  fetchCampaignAnalytics,
  fetchDonationTrends,
} from "../../features/analytics/analyticsSlice";
import {
  fetchCampaigns,
  fetchCampaignStats,
} from "../../features/campaign/adminCampaignSlice";
import { fetchPaymentStats } from "../../features/payment/adminPaymentsSlice";
import {
  fetchDonorStats,
  fetchAllDonors,
} from "../../features/donor/adminDonorsSlice";
import { StatsCard } from "../shared";
import RevenueTrendChart from "../reports/RevenueTrendChart";
import CategoryDistributionChart from "../reports/CategoryDistributionChart";
import TopCampaignsTable from "../reports/TopCampaignsTable";
import TopDonorsTable from "../reports/TopDonorsTable";
import apiClient from "../../config/apiConfig";

const Reports = () => {
  const { darkMode } = useTheme();
  const dispatch = useDispatch();

  const [dateRange, setDateRange] = useState("1M"); // "7D" | "1M" | "1Y"
  const [isExporting, setIsExporting] = useState(false);

  const {
    platformAnalytics,
    donationTrends,
    loading: analyticsLoading,
  } = useSelector((state) => state.analytics);

  const {
    campaigns = [],
    stats: campaignStats,
    loading: campaignsLoading,
  } = useSelector((state) => state.adminCampaigns);

  const { stats: paymentStats, loading: paymentsLoading } = useSelector(
    (state) => state.adminPayments,
  );

  const {
    donors = [],
    stats: donorStats,
    loading: donorsLoading,
  } = useSelector((state) => state.adminDonors);

  const loading =
    analyticsLoading || campaignsLoading || paymentsLoading || donorsLoading;

  const fetchData = useCallback(async (isManualResync = false) => {
    try {
      if (isManualResync) toast.loading("Resyncing analytics data...", { id: "resync" });
      await Promise.all([
        dispatch(fetchPlatformAnalytics()),
        dispatch(fetchCampaignAnalytics()),
        dispatch(fetchDonationTrends()),
        dispatch(fetchCampaigns({ limit: 50 })),
        dispatch(fetchCampaignStats({})),
        dispatch(fetchPaymentStats({})),
        dispatch(fetchDonorStats({})),
        dispatch(fetchAllDonors({ limit: 50 })),
      ]);
      if (isManualResync) toast.success("Analytics up to date", { id: "resync" });
    } catch {
      if (isManualResync) toast.error("Failed to refresh analytics", { id: "resync" });
    }
  }, [dispatch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle Export CSV
  const handleExportCsv = async () => {
    if (isExporting) return;
    try {
      setIsExporting(true);
      toast.loading("Generating CSV report...", { id: "export-csv" });

      const response = await apiClient.get("/analytics/export/donations", {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `sabo-donations-report-${new Date().toISOString().split("T")[0]}.csv`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("CSV Report downloaded!", { id: "export-csv" });
    } catch (err) {
      console.error(err);
      toast.error("Failed to export report CSV", { id: "export-csv" });
    } finally {
      setIsExporting(false);
    }
  };

  const internalStats = useMemo(() => {
    const totalRevenue =
      platformAnalytics?.totalAmount ||
      platformAnalytics?.totalRaised ||
      paymentStats?.overview?.totalAmount ||
      0;
    const totalDonations =
      platformAnalytics?.totalDonations ||
      paymentStats?.overview?.totalTransactions ||
      0;
    const avgDonation = totalDonations > 0 ? totalRevenue / totalDonations : 0;
    const totalDonorCount = donorStats?.totalCount || platformAnalytics?.totalDonors || 0;

    return [
      {
        label: "Total Funds Raised",
        value: new Intl.NumberFormat("en-NG", {
          style: "currency",
          currency: "NGN",
          minimumFractionDigits: 0,
        }).format(totalRevenue),
        change: "+23.5%",
        trend: "up",
        icon: DollarSign,
        bgColor: "from-emerald-600 to-teal-600",
        trendUp: true,
      },
      {
        label: "Total Donations",
        value: totalDonations.toLocaleString(),
        change: "+18.2%",
        trend: "up",
        icon: Target,
        bgColor: "from-emerald-500 to-teal-600",
        trendUp: true,
      },
      {
        label: "Donor Growth",
        value: totalDonorCount.toLocaleString(),
        change: "+12.8%",
        trend: "up",
        icon: Users,
        bgColor: "from-teal-500 to-cyan-600",
        trendUp: true,
      },
      {
        label: "Avg. Donation",
        value: new Intl.NumberFormat("en-NG", {
          style: "currency",
          currency: "NGN",
        }).format(avgDonation),
        change: "+5.3%",
        trend: "up",
        icon: TrendingUp,
        bgColor: "from-emerald-700 to-teal-800",
        trendUp: true,
      },
    ];
  }, [platformAnalytics, paymentStats, donorStats]);

  const categoryData = useMemo(() => {
    const byCategory = campaignStats?.byCategory || {};
    const entries = Object.entries(byCategory);
    if (entries.length === 0) return [];

    const totalAmount = entries.reduce(
      (sum, [, data]) => sum + (data.totalRaised || 0),
      0
    );

    const colors = [
      "from-emerald-500 to-emerald-600",
      "from-teal-500 to-teal-600",
      "from-amber-500 to-amber-600",
      "from-rose-500 to-rose-600",
      "from-indigo-500 to-indigo-600",
    ];

    return entries
      .map(([category, data], index) => ({
        category: category.charAt(0).toUpperCase() + category.slice(1),
        amount: data.totalRaised || 0,
        count: data.count || 0,
        percentage:
          totalAmount > 0
            ? Math.round(((data.totalRaised || 0) / totalAmount) * 100)
            : 0,
        color: colors[index % colors.length],
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [campaignStats]);

  // Derived Top Donors & Campaigns
  const topDonors = useMemo(() => {
    return [...donors]
      .sort((a, b) => (b.totalDonated || 0) - (a.totalDonated || 0))
      .slice(0, 5);
  }, [donors]);

  const topCampaigns = useMemo(() => {
    return [...campaigns]
      .sort((a, b) => (b.raisedAmount || 0) - (a.raisedAmount || 0))
      .slice(0, 5);
  }, [campaigns]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="space-y-8 relative pb-20 px-4 sm:px-0">
      {/* Decorative Background Blob */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Intelligence Header */}
      <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-1 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" />
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
              Foundation Intelligence
            </span>
          </div>
          <h1
            className={`text-3xl lg:text-4xl font-extrabold mb-2 tracking-tight ${
              darkMode ? "text-white" : "text-dark"
            }`}
          >
            Analytics <span className="text-emerald-500">& Reports</span>
          </h1>
          <p
            className={`text-base max-w-xl ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Real-time data insights into community impact, donation trends, and
            platform performance.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-wrap gap-3"
        >
          <button
            onClick={() => fetchData(true)}
            className={`px-6 py-3.5 rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center gap-2 transition-all ${
              darkMode
                ? "bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 border border-gray-700"
                : "bg-white border border-gray-200 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50"
            }`}
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            <span>Resync Data</span>
          </button>
          <button
            onClick={handleExportCsv}
            disabled={isExporting}
            className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white px-7 py-3.5 rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center gap-2 shadow-xl shadow-emerald-600/30 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
          >
            <Download size={18} />
            <span>{isExporting ? "Exporting..." : "Export Report CSV"}</span>
          </button>
        </motion.div>
      </div>

      {/* Snapshot Grid */}
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
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
          >
            <StatsCard {...stat} index={i} />
          </motion.div>
        ))}
      </motion.div>

      {/* Impact Visualization */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 xl:grid-cols-3 gap-8"
      >
        {/* Revenue Trend */}
        <div className="xl:col-span-2">
          {/* Range Selector Header overlay */}
          <div className="flex justify-end mb-2">
            <div className="flex bg-gray-100 dark:bg-gray-900 p-1 rounded-xl gap-1">
              {["7D", "1M", "1Y"].map((range) => (
                <button
                  key={range}
                  onClick={() => setDateRange(range)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    dateRange === range
                      ? "bg-emerald-500 text-white shadow-md"
                      : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
          <RevenueTrendChart
            monthlyData={donationTrends}
            isRefreshing={loading}
            timeRange={dateRange}
            onTimeRangeChange={setDateRange}
          />
        </div>

        {/* Category Distribution */}
        <div>
          <CategoryDistributionChart
            categoryData={categoryData}
            isRefreshing={loading}
          />
        </div>
      </motion.div>

      {/* Top Campaigns & Top Donors Tables */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        <TopCampaignsTable campaigns={topCampaigns} isRefreshing={loading} />
        <TopDonorsTable donors={topDonors} isRefreshing={loading} />
      </motion.div>

      {/* Strategic Impact & Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className={`p-8 sm:p-10 rounded-3xl border relative overflow-hidden transition-all duration-500 ${
          darkMode
            ? "bg-gradient-to-br from-emerald-950/30 to-dark-lighter border-emerald-900/30"
            : "bg-gradient-to-br from-emerald-50 to-white border-emerald-100 shadow-xl shadow-emerald-500/5"
        }`}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full -mr-20 -mt-20" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 relative z-10">
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <div
                className={`p-2 rounded-lg ${darkMode ? "bg-emerald-900/50" : "bg-emerald-100"}`}
              >
                <Sparkles size={20} className="text-emerald-500" />
              </div>
              <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider">
                Foundation Data Hub
              </span>
            </div>
            <h2
              className={`text-2xl font-extrabold tracking-tight ${
                darkMode ? "text-white" : "text-dark"
              }`}
            >
              Real-Time Community Impact Analysis
            </h2>
            <p
              className={`text-sm sm:text-base font-medium leading-relaxed max-w-2xl ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Every donation recorded here reflects direct community support in the Sabo youth ecosystem. Generate and export data reports to share with stakeholders and partners.
            </p>
          </div>
          <button
            onClick={handleExportCsv}
            disabled={isExporting}
            className="bg-white text-emerald-700 border-2 border-emerald-100 hover:border-emerald-200 px-8 py-4 rounded-2xl font-bold shadow-xl shadow-gray-200/50 hover:shadow-2xl transition-all flex items-center gap-3 shrink-0 active:scale-95 cursor-pointer disabled:opacity-50"
          >
            <Download size={20} />
            <span>Download CSV Report</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Reports;
