// admin/src/component/pages/Reports.jsx - Analytics — Clerk-Style UI
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import {
  Download,
  RefreshCw,
  DollarSign,
  Target,
  Users,
  TrendingUp,
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

  const [dateRange, setDateRange] = useState("1M");
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
    (state) => state.adminPayments
  );

  const {
    donors = [],
    stats: donorStats,
    loading: donorsLoading,
  } = useSelector((state) => state.adminDonors);

  const loading =
    analyticsLoading || campaignsLoading || paymentsLoading || donorsLoading;

  const fetchData = useCallback(
    async (isManualResync = false) => {
      try {
        if (isManualResync)
          toast.loading("Resyncing analytics data...", { id: "resync" });
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
        if (isManualResync)
          toast.success("Analytics up to date", { id: "resync" });
      } catch {
        if (isManualResync)
          toast.error("Failed to refresh analytics", { id: "resync" });
      }
    },
    [dispatch]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
    const totalDonorCount =
      donorStats?.totalCount || platformAnalytics?.totalDonors || 0;

    return [
      {
        label: "Total Funds Raised",
        value: new Intl.NumberFormat("en-NG", {
          style: "currency",
          currency: "NGN",
          minimumFractionDigits: 0,
        }).format(totalRevenue),
        trend: "+23.5%",
        trendUp: true,
        icon: DollarSign,
        bgColor: "from-primary-600 to-primary-700",
      },
      {
        label: "Total Donations",
        value: totalDonations.toLocaleString(),
        trend: "+18.2%",
        trendUp: true,
        icon: Target,
        bgColor: "from-primary-500 to-primary-600",
      },
      {
        label: "Total Donors",
        value: totalDonorCount.toLocaleString(),
        trend: "+12.8%",
        trendUp: true,
        icon: Users,
        bgColor: "from-amber-500 to-orange-600",
      },
      {
        label: "Avg. Donation",
        value: new Intl.NumberFormat("en-NG", {
          style: "currency",
          currency: "NGN",
          minimumFractionDigits: 0,
        }).format(avgDonation),
        trend: "+5.3%",
        trendUp: true,
        icon: TrendingUp,
        bgColor: "from-primary-700 to-primary-800",
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
      "from-primary-500 to-primary-600",
      "from-amber-500 to-amber-600",
      "from-emerald-500 to-emerald-600",
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

  const topDonors = useMemo(
    () =>
      [...donors]
        .sort((a, b) => (b.totalDonated || 0) - (a.totalDonated || 0))
        .slice(0, 5),
    [donors]
  );

  const topCampaigns = useMemo(
    () =>
      [...campaigns]
        .sort((a, b) => (b.raisedAmount || 0) - (a.raisedAmount || 0))
        .slice(0, 5),
    [campaigns]
  );

  return (
    <div className="space-y-6 pb-10">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className={`text-xl font-semibold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Analytics
          </h1>
          <p
            className={`text-sm mt-0.5 ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Foundation performance and donation trends
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchData(true)}
            disabled={loading}
            className={`p-2 rounded-lg border text-sm font-medium transition-all ${
              darkMode
                ? "bg-dark-lighter border-gray-800 text-gray-400 hover:text-white hover:border-gray-700"
                : "bg-white border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300 shadow-sm"
            }`}
            title="Refresh data"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          </button>
          <button
            onClick={handleExportCsv}
            disabled={isExporting}
            className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all flex items-center gap-1.5 disabled:opacity-50 ${
              darkMode
                ? "bg-dark-lighter border-gray-800 text-gray-300 hover:text-white hover:border-gray-700"
                : "bg-white border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300 shadow-sm"
            }`}
          >
            <Download size={15} />
            <span className="hidden sm:inline">
              {isExporting ? "Exporting..." : "Export CSV"}
            </span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {internalStats.map((stat, i) => (
          <StatsCard key={i} {...stat} index={i} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Revenue Trend */}
        <div className="xl:col-span-2">
          <div className="flex justify-end mb-2">
            <div
              className={`flex p-1 rounded-lg gap-1 border ${
                darkMode
                  ? "bg-dark-lighter border-gray-800"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              {["7D", "1M", "1Y"].map((range) => (
                <button
                  key={range}
                  onClick={() => setDateRange(range)}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                    dateRange === range
                      ? "bg-primary-500 text-white shadow-sm"
                      : darkMode
                      ? "text-gray-400 hover:text-white"
                      : "text-gray-500 hover:text-gray-900"
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
        <CategoryDistributionChart
          categoryData={categoryData}
          isRefreshing={loading}
        />
      </div>

      {/* Top Campaigns & Donors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopCampaignsTable campaigns={topCampaigns} isRefreshing={loading} />
        <TopDonorsTable donors={topDonors} isRefreshing={loading} />
      </div>

      {/* Export CTA */}
      <div
        className={`p-5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
          darkMode
            ? "bg-dark-lighter border-gray-800/70"
            : "bg-white border-gray-200/80 shadow-sm"
        }`}
      >
        <div>
          <h3
            className={`text-sm font-semibold mb-1 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Export Foundation Data
          </h3>
          <p
            className={`text-xs ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Download a full CSV report to share with stakeholders and partners.
          </p>
        </div>
        <button
          onClick={handleExportCsv}
          disabled={isExporting}
          className="px-4 py-2 rounded-lg bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium transition-all flex items-center gap-2 shadow-sm disabled:opacity-50 flex-shrink-0"
        >
          <Download size={15} />
          {isExporting ? "Exporting..." : "Download CSV"}
        </button>
      </div>
    </div>
  );
};

export default Reports;
