// admin/src/component/pages/Reports.jsx - Foundation Analytics Hub
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";

import {
  Download,
  RefreshCw,
  DollarSign,
  Target,
  Users,
  TrendingUp,
  Activity,
  Calendar,
  PieChart,
  BarChart3,
  ArrowUpRight,
  TrendingDown,
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

const Reports = () => {
  const { darkMode } = useTheme();
  const dispatch = useDispatch();

  const [dateRange, setDateRange] = useState("this-month");

  const {
    platformAnalytics,
    donationTrends,
    loading: analyticsLoading,
  } = useSelector((state) => state.analytics);
  const { stats: campaignStats, loading: campaignsLoading } = useSelector(
    (state) => state.adminCampaigns,
  );
  const { stats: paymentStats, loading: paymentsLoading } = useSelector(
    (state) => state.adminPayments,
  );
  const { stats: donorStats, loading: donorsLoading } = useSelector(
    (state) => state.adminDonors,
  );

  const loading =
    analyticsLoading || campaignsLoading || paymentsLoading || donorsLoading;

  const fetchData = useCallback(async () => {
    await Promise.all([
      dispatch(fetchPlatformAnalytics()),
      dispatch(fetchCampaignAnalytics()),
      dispatch(fetchDonationTrends()),
      dispatch(fetchCampaigns({ limit: 50 })),
      dispatch(fetchCampaignStats({})),
      dispatch(fetchPaymentStats({ period: dateRange.replace("-", "") })),
      dispatch(fetchDonorStats({})),
      dispatch(fetchAllDonors({ limit: 50 })),
    ]);
  }, [dispatch, dateRange]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const internalStats = useMemo(() => {
    const totalRevenue =
      platformAnalytics?.totalAmount ||
      paymentStats?.overview?.totalAmount ||
      0;
    const totalDonations =
      platformAnalytics?.totalDonations ||
      paymentStats?.overview?.totalTransactions ||
      0;
    const avgDonation = totalDonations > 0 ? totalRevenue / totalDonations : 0;

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
        value: (donorStats?.totalCount || 0).toLocaleString(),
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
        change: "-5.3%",
        trend: "down",
        icon: TrendingUp,
        bgColor: "from-emerald-700 to-teal-800",
        trendUp: false,
      },
    ];
  }, [platformAnalytics, paymentStats, donorStats]);

  const categoryData = useMemo(() => {
    const byCategory = campaignStats?.byCategory || {};
    const entries = Object.entries(byCategory);
    if (entries.length === 0) return [];

    const totalAmount = entries.reduce(
      (sum, [, data]) => sum + (data.totalRaised || 0),
      0,
    );
    const colors = [
      "from-emerald-500 to-emerald-600",
      "from-teal-500 to-teal-600",
      "from-amber-500 to-amber-600",
      "from-rose-500 to-rose-600",
      "from-emerald-400 to-emerald-500",
      "from-teal-400 to-teal-500",
    ];

    return entries
      .map(([category, data], index) => ({
        category: category.charAt(0).toUpperCase() + category.slice(1),
        amount: data.totalRaised || 0,
        count: data.count || 0,
        percentage:
          totalAmount > 0
            ? Math.round((data.totalRaised / totalAmount) * 100)
            : 0,
        color: colors[index % colors.length],
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [campaignStats]);

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
    <div className="space-y-8 relative pb-20">
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
            onClick={() => fetchData()}
            className={`px-6 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center gap-2 transition-all ${
              darkMode
                ? "bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700"
                : "bg-white border border-gray-100 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50"
            }`}
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />{" "}
            Resync Data
          </button>
          <button className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center gap-2 shadow-xl shadow-emerald-600/30 active:scale-95 transition-all">
            <Download size={18} /> Export Report
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
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <StatsCard {...stat} index={i} />
          </motion.div>
        ))}
      </motion.div>

      {/* Impact Visualization */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 xl:grid-cols-3 gap-8"
      >
        {/* Revenue Trend */}
        <div
          className={`xl:col-span-2 p-8 rounded-[2.5rem] border backdrop-blur-sm ${
            darkMode
              ? "bg-dark-lighter/80 border-gray-800"
              : "bg-white/80 border-gray-100 shadow-xl shadow-gray-100/50"
          }`}
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div
                className={`p-3 rounded-2xl ${darkMode ? "bg-emerald-900/20" : "bg-emerald-50"}`}
              >
                <TrendingUp className="text-emerald-500" size={24} />
              </div>
              <div>
                <h3
                  className={`text-xl font-bold tracking-tight ${
                    darkMode ? "text-white" : "text-dark"
                  }`}
                >
                  Donation Trends
                </h3>
                <p
                  className={`text-sm mt-1 ${darkMode ? "text-gray-500" : "text-gray-500"}`}
                >
                  Monthly Giving Analysis
                </p>
              </div>
            </div>

            <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
              {["7D", "1M", "1Y"].map((range) => (
                <button
                  key={range}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    range === "1M" // hardcoded active state for now
                      ? "bg-white dark:bg-gray-700 shadow-sm text-emerald-600 dark:text-emerald-400"
                      : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[350px] w-full">
            <RevenueTrendChart monthlyData={donationTrends} />
          </div>
        </div>

        {/* Category Distribution */}
        <div
          className={`p-8 rounded-[2.5rem] border backdrop-blur-sm flex flex-col ${
            darkMode
              ? "bg-dark-lighter/80 border-gray-800"
              : "bg-white/80 border-gray-100 shadow-xl shadow-gray-100/50"
          }`}
        >
          <div className="mb-8 flex items-center gap-4">
            <div
              className={`p-3 rounded-2xl ${darkMode ? "bg-teal-900/20" : "bg-teal-50"}`}
            >
              <PieChart className="text-teal-500" size={24} />
            </div>
            <div>
              <h3
                className={`text-xl font-bold tracking-tight ${
                  darkMode ? "text-white" : "text-dark"
                }`}
              >
                Impact Sectors
              </h3>
              <p
                className={`text-sm mt-1 ${darkMode ? "text-gray-500" : "text-gray-500"}`}
              >
                Donations by Category
              </p>
            </div>
          </div>
          <div className="flex-1 min-h-[300px] flex items-center justify-center">
            {categoryData.length > 0 ? (
              <div className="w-full h-full">
                <CategoryDistributionChart categoryData={categoryData} />
              </div>
            ) : (
              <div className="text-center text-gray-400">
                <PieChart size={48} className="mx-auto mb-2 opacity-50" />
                <p>No category data available</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Foundation Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className={`p-10 rounded-3xl border relative overflow-hidden transition-all duration-500 ${
          darkMode
            ? "bg-gradient-to-br from-emerald-950/30 to-dark-lighter border-emerald-900/30"
            : "bg-gradient-to-br from-emerald-50 to-white border-emerald-100"
        }`}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full -mr-20 -mt-20" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div
                className={`p-2 rounded-lg ${darkMode ? "bg-emerald-900/50" : "bg-emerald-100"}`}
              >
                <Activity size={24} className="text-emerald-500" />
              </div>
              <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider">
                Strategic Insight
              </span>
            </div>
            <h2
              className={`text-2xl font-extrabold tracking-tight ${
                darkMode ? "text-white" : "text-dark"
              }`}
            >
              Community Impact Goals
            </h2>
            <p
              className={`text-base font-medium leading-relaxed max-w-2xl ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Our analytics hub utilizes real-time donation data to track
              community empowerment progress. Every data point here informs our
              next community projects in the Sabo youth ecosystem.
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-emerald-700 border-2 border-emerald-100 hover:border-emerald-200 px-8 py-4 rounded-2xl font-bold shadow-xl shadow-gray-200/50 hover:shadow-2xl transition-all flex items-center gap-3"
          >
            <Download size={20} />
            <span>Download Strategy Report</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default Reports;
