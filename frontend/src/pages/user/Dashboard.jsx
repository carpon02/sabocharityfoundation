// pages/Dashboard.jsx - Sabo Ibadan Youth Charity Foundation
import React, { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Users,
  Utensils,
  BookOpen,
  TreePine,
  Wallet,
  Target,
  Calendar,
  Star,
  TrendingUp,
  ArrowRight,
  Zap,
  Shield,
  Clock,
  RefreshCcw,
  ChevronDown,
  MapPin,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { fetchUserAnalytics } from "../../features/analytics/analyticsSlice";
import { getUserRegisteredEvents } from "../../features/event/eventSlice";

// Utility function for number formatting
const formatNumber = (num) => {
  if (num === undefined || num === null) return "₦0";
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
};

// Utility function for percentage calculation
const calculatePercentage = (current, target) => {
  if (!target || target === 0) return 0;
  return Math.min((current / target) * 100, 100);
};

// Data validation utility
const validateDashboardData = (data) => {
  const defaultData = {
    user: {
      totalDonated: 0,
      campaignsCreated: 0,
      eventsAttended: 0,
      impactScore: 0,
      monthlyGoal: 20000000, // ₦20,000,000 (20 million Naira)
      currentMonthDonations: 0,
    },
    recentDonations: [],
    activeCampaigns: [],
    upcomingEvents: [],
    impactMetrics: [],
  };

  if (!data) return defaultData;

  return {
    user: {
      totalDonated: data?.user?.totalDonated ?? 0,
      campaignsCreated: data?.user?.campaignsCreated ?? 0,
      eventsAttended: data?.user?.eventsAttended ?? 0,
      impactScore: data?.user?.impactScore ?? 0,
      monthlyGoal: data?.user?.monthlyGoal ?? 20000000, // Default to ₦20,000,000
      currentMonthDonations: data?.user?.currentMonthDonations ?? 0,
    },
    recentDonations: Array.isArray(data?.recentDonations)
      ? data.recentDonations
      : [],
    activeCampaigns: Array.isArray(data?.activeCampaigns)
      ? data.activeCampaigns
      : [],
    upcomingEvents: Array.isArray(data?.upcomingEvents)
      ? data.upcomingEvents
      : [],
    impactMetrics: Array.isArray(data?.impactMetrics) ? data.impactMetrics : [],
  };
};

// Icon & Style Mapping
const getMetricConfig = (label) => {
  const configs = {
    "People Helped": {
      icon: Users,
      bg: "bg-emerald-500/10",
      iconColor: "text-emerald-500",
      glow: "shadow-emerald-500/50",
    },
    "Meals Provided": {
      icon: Utensils,
      bg: "bg-orange-500/10",
      iconColor: "text-orange-500",
      glow: "shadow-orange-500/50",
    },
    "Books Donated": {
      icon: BookOpen,
      bg: "bg-blue-500/10",
      iconColor: "text-blue-500",
      glow: "shadow-blue-500/50",
    },
    "Trees Planted": {
      icon: TreePine,
      bg: "bg-green-100 dark:bg-green-900/30",
      iconColor: "text-green-500",
      glow: "shadow-green-500/50",
    },
  };
  return (
    configs[label] || {
      icon: Star,
      bg: "bg-gray-500/10",
      iconColor: "text-gray-500",
      glow: "shadow-gray-500/50",
    }
  );
};

// Component: Modern Stats Card (Impact Module)
const StatsCard = ({
  title,
  value,
  icon: IconComponent,
  color,
  subtitle,
  trend,
  loading = false,
}) => {
  const { darkMode } = useTheme();

  if (loading) {
    return (
      <div
        className={`h-[180px] rounded-xl border animate-pulse ${
          darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"
        }`}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.01 }}
      className={`relative overflow-hidden rounded-2xl border p-6 flex flex-col justify-between min-h-[140px] transition-all group ${
        darkMode
          ? "bg-gray-950/80 border-gray-800 hover:border-emerald-500/50 shadow-2xl shadow-black/50"
          : "bg-white border-gray-100 shadow-xl shadow-gray-200/20 hover:border-emerald-200"
      }`}
    >
      <div
        className={`absolute -right-6 -top-6 w-24 h-24 blur-3xl rounded-full opacity-10 transition-opacity duration-500 group-hover:opacity-20 ${color.replace(
          "text-",
          "bg-",
        )}`}
      />

      <div className="flex items-center justify-between relative z-10">
        <div
          className={`p-3 rounded-xl ${
            darkMode
              ? "bg-gray-900 border-gray-800"
              : "bg-gray-50 border-gray-100"
          } border shadow-inner transition-transform duration-500`}
        >
          {IconComponent && (
            <IconComponent className={`w-5 h-5 sm:w-6 sm:h-6 ${color}`} />
          )}
        </div>
        {trend && (
          <div
            className={`text-xs font-bold px-3 py-1 rounded-lg flex items-center gap-1.5 ${
              trend > 0
                ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                : "bg-rose-500/10 text-rose-500 border border-rose-500/20"
            }`}
          >
            <TrendingUp size={12} className={trend < 0 ? "rotate-180" : ""} />
            {Math.abs(trend)}%
          </div>
        )}
      </div>

      <div className="mt-6 relative z-10">
        <h3
          className={`text-xs font-semibold uppercase tracking-wider mb-2 ${
            darkMode ? "text-gray-500" : "text-gray-400"
          }`}
        >
          {title}
        </h3>
        <div
          className={`text-2xl font-bold tracking-tight ${
            darkMode ? "text-white" : "text-gray-950"
          }`}
        >
          {value}
        </div>
        {subtitle && (
          <p
            className={`text-xs mt-1 font-medium ${
              darkMode ? "text-gray-600" : "text-gray-400"
            }`}
          >
            {subtitle}
          </p>
        )}
      </div>
    </motion.div>
  );
};

// Component: Premium Progress Ring (Target Node)
const ProgressRing = ({ progress, size = 180, strokeWidth = 14 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  const { darkMode } = useTheme();

  return (
    <div className="relative inline-flex items-center justify-center group">
      <div className="absolute inset-0 bg-indigo-500/10 blur-[60px] rounded-full scale-75 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      <svg
        width={size}
        height={size}
        className="transform -rotate-90 relative z-10 drop-shadow-2xl"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className={darkMode ? "text-gray-900" : "text-gray-50"}
        />
        <motion.circle
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: strokeDashoffset }}
          transition={{ duration: 2, ease: "circOut" }}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#impact-gradient-v4)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeLinecap="round"
          className="drop-shadow-[0_0_15px_rgba(16,185,129,0.4)]"
        />
        <defs>
          <linearGradient
            id="impact-gradient-v4"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
        </defs>
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <span
            className={`text-4xl font-bold block tracking-tighter ${
              darkMode ? "text-white" : "text-gray-950"
            }`}
          >
            {Math.round(progress)}%
          </span>
          <span
            className={`text-[10px] font-bold uppercase tracking-widest block mt-1 ${
              darkMode ? "text-emerald-500/80" : "text-emerald-600/80"
            }`}
          >
            Mission Flow
          </span>
        </motion.div>
      </div>
    </div>
  );
};

// Component: Premium Campaign Card (Strategic Node)
const CampaignCard = ({ campaign }) => {
  const { darkMode } = useTheme();
  const progressPercentage = calculatePercentage(
    campaign.raised,
    campaign.target,
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      className={`group relative rounded-2xl overflow-hidden border transition-all duration-500 ${
        darkMode
          ? "bg-gray-950/80 border-gray-800 hover:border-emerald-500/50 shadow-2xl shadow-black/50"
          : "bg-white border-gray-100 shadow-xl shadow-gray-200/20 hover:border-emerald-200"
      }`}
    >
      <div className="relative h-48 sm:h-56 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
        <img
          src={
            campaign.image ||
            "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=500&auto=format&fit=crop"
          }
          alt={campaign.title}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4 z-20">
          <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg">
            Active Mission
          </span>
        </div>
        <div className="absolute bottom-4 left-4 right-4 z-20">
          <h3 className="text-white font-bold text-lg leading-tight line-clamp-2">
            {campaign.title}
          </h3>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between items-end">
            <span
              className={`text-xs font-semibold uppercase tracking-wider ${
                darkMode ? "text-gray-600" : "text-gray-400"
              }`}
            >
              Progress
            </span>
            <span className="text-sm font-bold text-emerald-500">
              {progressPercentage.toFixed(0)}%
            </span>
          </div>
          <div
            className={`w-full overflow-hidden h-2 rounded-full ${
              darkMode ? "bg-gray-900" : "bg-gray-100"
            }`}
          >
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1.5, ease: "circOut" }}
              className="bg-emerald-600 h-full rounded-full shadow-[0_0_12px_rgba(16,185,129,0.3)]"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
          <div className="flex flex-col">
            <span
              className={`text-[10px] font-bold uppercase tracking-wider ${
                darkMode ? "text-gray-600" : "text-gray-400"
              }`}
            >
              Raised
            </span>
            <span
              className={`text-base font-bold ${
                darkMode ? "text-white" : "text-gray-950"
              }`}
            >
              {formatNumber(campaign.raised)}
            </span>
          </div>
          <Link
            to={`/campaigns/${campaign.id}`}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
          >
            Explore <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

// Component: Operational Pulse (Donation Heartbeat)
const ActivityTimeline = ({ donations }) => {
  const { darkMode } = useTheme();

  return (
    <div className="space-y-6 relative ml-1.5 pt-2">
      <div
        className={`absolute left-0 top-6 bottom-6 w-0.5 ${
          darkMode ? "bg-gray-800" : "bg-gray-100"
        }`}
      />
      {donations.map((donation, index) => (
        <motion.div
          key={donation.id}
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.05 }}
          className="flex items-start gap-5 relative"
        >
          <div
            className={`absolute -left-1.5 w-3.5 h-3.5 rounded-full border-2 ${
              donation.status === "completed"
                ? "bg-emerald-500 border-white dark:border-gray-950"
                : "bg-amber-500 border-white dark:border-gray-950"
            } z-10 mt-1 shadow-md`}
          />

          <div
            className={`flex-1 p-5 rounded-2xl border transition-all duration-300 group ${
              darkMode
                ? "bg-gray-900/40 border-gray-800/80 hover:bg-gray-900 shadow-xl"
                : "bg-white border-gray-100 hover:bg-gray-50 shadow-lg shadow-gray-200/10"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    darkMode ? "bg-gray-800" : "bg-gray-50"
                  }`}
                >
                  <Zap
                    size={14}
                    className={
                      donation.status === "completed"
                        ? "text-emerald-500"
                        : "text-amber-500"
                    }
                  />
                </div>
                <p
                  className={`text-sm font-semibold tracking-tight ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {donation.campaign}
                </p>
              </div>
              <span className="text-sm font-bold text-emerald-600">
                +{formatNumber(donation.amount)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div
                className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider ${
                  darkMode ? "text-gray-600" : "text-gray-400"
                }`}
              >
                <Clock size={12} />
                {new Date(donation.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </div>
              <span
                className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg border ${
                  donation.status === "completed"
                    ? "border-emerald-500/20 text-emerald-500 bg-emerald-500/5"
                    : "border-amber-500/20 text-amber-500 bg-amber-500/5"
                }`}
              >
                {donation.status}
              </span>
            </div>
          </div>
        </motion.div>
      ))}

      <AnimatePresence>
        {(!donations || donations.length === 0) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-12 text-center"
          >
            <div
              className={`w-12 h-12 rounded-full mb-4 flex items-center justify-center ${
                darkMode ? "bg-gray-900" : "bg-gray-50"
              }`}
            >
              <Heart className="text-gray-500" size={20} />
            </div>
            <p
              className={`text-xs font-semibold uppercase tracking-wider ${
                darkMode ? "text-gray-700" : "text-gray-400"
              }`}
            >
              No impact activity found.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Main Dashboard Component
const Dashboard = () => {
  const dispatch = useDispatch();
  const { darkMode } = useTheme();
  const { user: authUser } = useSelector((state) => state.auth);
  const { userAnalytics, loading, error } = useSelector(
    (state) => state.analytics,
  );
  const { userRegisteredEvents, userEventsLoading } = useSelector(
    (state) => state.events,
  );

  useEffect(() => {
    if (authUser) {
      dispatch(fetchUserAnalytics());
      dispatch(getUserRegisteredEvents());
    }
  }, [dispatch, authUser]);

  // Validate and sanitize data
  const data = useMemo(
    () => validateDashboardData(userAnalytics),
    [userAnalytics],
  );

  // Refresh handler
  const handleRefresh = () => {
    dispatch(fetchUserAnalytics());
    dispatch(getUserRegisteredEvents());
  };

  const monthlyProgress = useMemo(
    () =>
      calculatePercentage(
        data.user?.currentMonthDonations || 0,
        data.user?.monthlyGoal || 0,
      ),
    [data.user?.currentMonthDonations, data.user?.monthlyGoal],
  );

  const quickStats = useMemo(
    () => [
      {
        title: "Total Contributed",
        value: formatNumber(data.user?.totalDonated),
        icon: Wallet,
        color: "text-emerald-500",
        subtitle: "Foundation Impact Contribution",
        trend: 12,
      },
      {
        title: "Active Projects",
        value: data.user?.campaignsCreated || 0,
        icon: Heart,
        color: "text-rose-500",
        subtitle: "Community Initiatives",
        trend: 5,
      },
      {
        title: "Foundation Events",
        value: data.user?.eventsAttended || 0,
        icon: Calendar,
        color: "text-emerald-500",
        subtitle: "Community Engagements",
        trend: 8,
      },
      {
        title: "Impact Score",
        value: data.user?.impactScore || 0,
        icon: Star,
        color: "text-amber-500",
        subtitle: "Philanthropy Tier",
        trend: 24,
      },
    ],
    [data.user],
  );

  const enhancedImpactMetrics = useMemo(
    () =>
      (data.impactMetrics || []).map((metric) => ({
        ...metric,
        ...getMetricConfig(metric.label),
      })),
    [data.impactMetrics],
  );

  if (loading) {
    return (
      <div className="space-y-12 p-8 md:p-12 animate-pulse">
        <div className="h-[400px] w-full rounded-2xl bg-gray-200 dark:bg-gray-900 border border-gray-100 dark:border-gray-800" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-[180px] rounded-xl bg-gray-200 dark:bg-gray-900 border border-gray-100 dark:border-gray-800"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-32 text-center px-6"
      >
        <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mb-8 border border-rose-500/20 shadow-xl shadow-rose-500/10">
          <Shield className="w-10 h-10 text-rose-500" />
        </div>
        <h2
          className={`text-3xl font-bold mb-4 tracking-tight ${
            darkMode ? "text-white" : "text-gray-950"
          }`}
        >
          Operation Interrupted
        </h2>
        <p
          className={`max-w-md text-sm font-medium leading-relaxed mb-10 ${
            darkMode ? "text-gray-500" : "text-gray-400"
          }`}
        >
          We encountered an issue fetching foundation data: {error}
        </p>
        <button
          onClick={() => dispatch(fetchUserAnalytics())}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-10 py-4 rounded-xl transition-all shadow-xl shadow-emerald-500/20 active:scale-95"
        >
          Retry Connection
        </button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8 sm:space-y-12 pb-12 max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8">
      {/* Foundation Impact Center (Header) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl overflow-hidden shadow-2xl shadow-emerald-500/5 group min-h-[300px] md:min-h-[400px] flex flex-col"
      >
        <div className="absolute inset-0 bg-gray-950">
          {/* Refined Background Elements */}
          <div className="absolute top-0 right-0 w-full h-full">
            <div className="absolute -top-[10%] -right-[5%] w-[60%] h-[60%] bg-emerald-600/10 blur-[120px] rounded-full" />
            <div className="absolute -bottom-[10%] -left-[5%] w-[50%] h-[50%] bg-emerald-500/5 blur-[100px] rounded-full" />
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_0.5px,transparent_0.5px)] [background-size:32px_32px]" />
          </div>
        </div>

        <div className="relative z-10 h-full p-6 sm:p-8 md:p-10 lg:p-14 flex flex-col justify-center flex-1">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <span className="w-12 h-1 bg-emerald-500 rounded-full" />
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400/80">
                Foundation Empowerment
              </h4>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Sabo Ibadan Youth <br />
              <span className="text-emerald-500">Charity Foundation</span>
            </h1>
            <p className="text-gray-400 text-sm md:text-base max-w-2xl mb-12 font-medium leading-relaxed">
              Empowering the youth and community of{" "}
              <span className="text-emerald-400">Sabo Ibadan</span>. Your
              strategic commitment drives our shared mission forward.
            </p>
          </motion.div>

          <div className="flex flex-wrap gap-5">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/user/my-campaigns"
                state={{ openCreateModal: true }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-3.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-xl shadow-emerald-500/20"
              >
                <Heart size={18} /> Launch Mission
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <button
                onClick={handleRefresh}
                disabled={loading}
                className={`bg-white/5 backdrop-blur-md border border-white/10 text-white px-10 py-3.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${
                  loading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-white/10 hover:border-white/20"
                }`}
              >
                <RefreshCcw
                  size={16}
                  className={`${loading ? "animate-spin" : ""}`}
                />{" "}
                Refresh Matrix
              </button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Foundation Impact Matrix (Quick Stats) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        {quickStats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 min-[1100px]:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
        {/* Charity Goals (Progress) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`p-6 sm:p-8 rounded-2xl border transition-all ${
            darkMode
              ? "bg-gray-950/80 border-gray-800 shadow-2xl shadow-emerald-500/5"
              : "bg-white border-gray-100 shadow-xl shadow-gray-200/20"
          }`}
        >
          <div className="mb-10 sm:mb-14 flex items-center justify-between">
            <div>
              <h2
                className={`text-xl font-bold ${
                  darkMode ? "text-white" : "text-gray-950"
                }`}
              >
                Mission Goal
              </h2>
              <p
                className={`text-xs font-semibold mt-1 ${
                  darkMode ? "text-gray-600" : "text-gray-400"
                }`}
              >
                Monthly impact target progress
              </p>
            </div>
            <div
              className={`p-3 rounded-xl ${
                darkMode
                  ? "bg-gray-900 border-gray-800"
                  : "bg-gray-50 border-gray-100"
              } border`}
            >
              <TrendingUp size={16} className="text-emerald-500" />
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="hidden sm:block">
              <ProgressRing progress={monthlyProgress} size={200} />
            </div>
            <div className="sm:hidden">
              <ProgressRing
                progress={monthlyProgress}
                size={160}
                strokeWidth={12}
              />
            </div>

            <div className="mt-14 space-y-6 text-center w-full">
              <div className="flex flex-col items-center gap-1.5">
                <span
                  className={`text-[10px] font-bold uppercase tracking-[0.2em] ${
                    darkMode ? "text-gray-600" : "text-gray-400"
                  }`}
                >
                  Current Contribution
                </span>
                <span
                  className={`text-4xl font-bold tracking-tight ${
                    darkMode ? "text-white" : "text-gray-950"
                  }`}
                >
                  {formatNumber(data.user?.currentMonthDonations)}
                </span>
              </div>

              <div
                className={`p-4 rounded-xl border ${
                  darkMode
                    ? "bg-emerald-500/5 border-emerald-500/10"
                    : "bg-emerald-50 border-emerald-100"
                }`}
              >
                <p
                  className={`text-[11px] font-bold uppercase tracking-widest ${
                    darkMode ? "text-emerald-400" : "text-emerald-600"
                  }`}
                >
                  Goal: {formatNumber(data.user?.monthlyGoal)} Foundation Target
                </p>
              </div>

              <div className="pt-6">
                <p
                  className={`text-[11px] font-medium leading-relaxed ${
                    darkMode ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  Remaining to reach community objective:{" "}
                  <span className="font-bold text-emerald-500">
                    {formatNumber(
                      (data.user?.monthlyGoal || 0) -
                        (data.user?.currentMonthDonations || 0),
                    )}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Community Activity (Timeline) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`p-6 sm:p-8 rounded-2xl border transition-all ${
            darkMode
              ? "bg-gray-950/80 border-gray-800 shadow-2xl shadow-emerald-500/5"
              : "bg-white border-gray-100 shadow-xl shadow-gray-200/20"
          }`}
        >
          <div className="mb-10 sm:mb-14 flex items-center justify-between">
            <div>
              <h2
                className={`text-xl font-bold ${
                  darkMode ? "text-white" : "text-gray-950"
                }`}
              >
                Impact Activity
              </h2>
              <p
                className={`text-xs font-semibold mt-1 ${
                  darkMode ? "text-gray-600" : "text-gray-400"
                }`}
              >
                Real-time engagement feed
              </p>
            </div>
            <Link
              to="/user/my-donations"
              className="p-3 bg-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 transition-all active:scale-95"
            >
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="max-h-[550px] overflow-y-auto custom-scrollbar pr-3">
            <ActivityTimeline donations={data.recentDonations || []} />
          </div>
        </motion.div>

        {/* Foundation Impact Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`min-[1100px]:col-span-full xl:col-span-1 p-6 sm:p-8 rounded-2xl border transition-all ${
            darkMode
              ? "bg-gray-950/80 border-gray-800 shadow-2xl shadow-emerald-500/5"
              : "bg-white border-gray-100 shadow-xl shadow-gray-200/20"
          }`}
        >
          <div className="mb-10 sm:mb-14">
            <h2
              className={`text-xl font-bold tracking-tight ${
                darkMode ? "text-white" : "text-gray-950"
              }`}
            >
              Foundation Metrics
            </h2>
            <p
              className={`text-xs font-semibold mt-1 ${
                darkMode ? "text-gray-600" : "text-gray-400"
              }`}
            >
              Cumulative achievement summary
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {enhancedImpactMetrics.length > 0 ? (
              enhancedImpactMetrics.map((metric, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.01, x: 4 }}
                  className={`flex items-center justify-between p-4 sm:p-5 gap-4 rounded-2xl border transition-all duration-300 ${
                    darkMode
                      ? "bg-gray-900/40 border-gray-800/60 hover:bg-gray-900 shadow-xl"
                      : "bg-gray-50 border-gray-100 hover:border-emerald-100 hover:bg-white"
                  }`}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div
                      className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center shrink-0 ${metric.bg} border border-white/5 shadow-lg shadow-emerald-500/5`}
                    >
                      <metric.icon
                        className={`w-6 h-6 sm:w-7 sm:h-7 ${metric.iconColor}`}
                      />
                    </div>
                    <div className="min-w-0">
                      <h4
                        className={`text-sm font-bold tracking-tight truncate ${
                          darkMode ? "text-white" : "text-gray-950"
                        }`}
                      >
                        {metric.label}
                      </h4>
                      <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-1.5 mt-1">
                        <TrendingUp size={12} /> Impact +{metric.growth}%
                      </p>
                    </div>
                  </div>
                  <div
                    className={`text-lg font-bold tracking-tight shrink-0 text-right ${
                      darkMode ? "text-white" : "text-gray-950"
                    }`}
                  >
                    {metric.value.toLocaleString()}
                  </div>
                </motion.div>
              ))
            ) : (
              <div
                className={`flex flex-col items-center justify-center py-10 rounded-xl border-2 border-dashed ${
                  darkMode
                    ? "border-gray-800 bg-gray-950/30"
                    : "border-gray-100 bg-gray-50/50"
                }`}
              >
                <div className="w-12 h-12 bg-indigo-500/10 rounded-full flex items-center justify-center mb-4">
                  <Target className="text-indigo-500" size={24} />
                </div>
                <p
                  className={`text-xs font-semibold text-center max-w-[200px] ${
                    darkMode ? "text-gray-600" : "text-gray-400"
                  }`}
                >
                  Impact metrics will calibrate as you participate in missions.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <div className="space-y-10 sm:space-y-12">
        <div className="flex items-center justify-between px-2">
          <div>
            <h2
              className={`text-2xl md:text-3xl font-bold tracking-tight ${
                darkMode ? "text-white" : "text-gray-950"
              }`}
            >
              Featured Projects
            </h2>
            <p
              className={`text-[10px] sm:text-xs font-bold uppercase tracking-widest mt-2 ${
                darkMode ? "text-gray-600" : "text-gray-400"
              }`}
            >
              Strategic community missions
            </p>
          </div>
          <Link
            to="/campaigns"
            className="hidden md:flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-emerald-500 transition-all border border-emerald-500/20 px-8 py-3.5 rounded-xl bg-emerald-500/5 hover:bg-emerald-500 hover:text-white"
          >
            Explore Missions <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10">
          {data.activeCampaigns.length > 0 ? (
            data.activeCampaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))
          ) : (
            <div
              className={`col-span-full py-24 rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center text-center ${
                darkMode
                  ? "border-gray-800 bg-gray-950/50"
                  : "border-gray-100 bg-gray-50/50"
              }`}
            >
              <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6">
                <Heart className="text-emerald-500" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">No active missions</h3>
              <p className="text-gray-500 text-xs font-semibold max-w-xs">
                Our charity initiatives are being reorganized. Launch a new
                mission to support the community.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Foundation Events Showcase */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className={`p-8 sm:p-12 rounded-3xl border transition-all ${
          darkMode
            ? "bg-gray-950 border-gray-800 shadow-2xl"
            : "bg-white border-gray-100 shadow-2xl shadow-emerald-500/5"
        }`}
      >
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 sm:mb-16 gap-8 px-2">
          <div>
            <div className="w-12 h-1 bg-emerald-500 mb-6 rounded-full" />
            <h2
              className={`text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight ${
                darkMode ? "text-white" : "text-gray-950"
              }`}
            >
              Foundation Events
            </h2>
            <p
              className={`text-xs font-semibold uppercase tracking-widest mt-3 ${
                darkMode ? "text-gray-600" : "text-gray-400"
              }`}
            >
              Your registered community activities
            </p>
          </div>
          <Link
            to="/user/events"
            className="px-10 py-4 rounded-xl bg-gray-900 hover:bg-emerald-600 text-white text-xs font-bold uppercase tracking-widest transition-all shadow-xl"
          >
            Explore Events
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10">
          {userEventsLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className={`h-64 rounded-xl animate-pulse ${
                  darkMode
                    ? "bg-gray-900 border-gray-800"
                    : "bg-gray-50 border-gray-100"
                } border`}
              />
            ))
          ) : userRegisteredEvents.length > 0 ? (
            userRegisteredEvents.map((event) => (
              <motion.div
                key={event._id || event.id}
                whileHover={{ y: -12, scale: 1.02 }}
                className={`p-6 rounded-xl border transition-all group ${
                  darkMode
                    ? "bg-gray-900/50 border-gray-800/80 hover:bg-gray-900 hover:border-emerald-500/30"
                    : "bg-gray-50 border-gray-100 hover:border-emerald-200 hover:bg-white hover:shadow-2xl"
                }`}
              >
                <div className="flex justify-between items-start mb-8">
                  <div
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-500 ${
                      darkMode
                        ? "bg-gray-800 group-hover:bg-emerald-600 group-hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]"
                        : "bg-white shadow-lg group-hover:bg-emerald-600 group-hover:text-white"
                    }`}
                  >
                    <Calendar
                      size={20}
                      className={
                        darkMode
                          ? "text-emerald-400 group-hover:text-white"
                          : "text-emerald-600"
                      }
                    />
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-[10px] font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full border ${
                        darkMode
                          ? "border-gray-800 text-gray-500"
                          : "border-gray-200 text-gray-400"
                      }`}
                    >
                      {event.status || "Active"}
                    </span>
                  </div>
                </div>
                <h3
                  className={`text-lg sm:text-xl font-bold mb-4 tracking-tight leading-tight ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {event.title || event.name}
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Clock
                      size={14}
                      className={darkMode ? "text-gray-600" : "text-gray-400"}
                    />
                    <span
                      className={`text-[10px] font-semibold uppercase tracking-widest ${
                        darkMode ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      {event.eventDate
                        ? new Date(event.eventDate).toLocaleDateString()
                        : event.date || "TBA"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin
                      size={14}
                      className={darkMode ? "text-gray-600" : "text-gray-400"}
                    />
                    <span
                      className={`text-[10px] font-semibold uppercase tracking-widest truncate ${
                        darkMode ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      {event.location?.city || event.location || "TBA"}
                    </span>
                  </div>
                </div>
                <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-800/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-1.5 sm:-space-x-2">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-gray-950 bg-emerald-600 flex items-center justify-center text-[7px] sm:text-[8px] font-bold text-white shadow-lg"
                        >
                          {i}
                        </div>
                      ))}
                    </div>
                    <span className="text-[8px] sm:text-[9px] font-semibold uppercase tracking-widest text-gray-600">
                      Registered
                    </span>
                  </div>
                  <ArrowRight
                    size={14}
                    className="text-gray-600 group-hover:text-emerald-500 transition-colors"
                  />
                </div>
              </motion.div>
            ))
          ) : (
            <div
              className={`col-span-full py-20 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center ${
                darkMode
                  ? "border-gray-800 bg-gray-950/50"
                  : "border-gray-100 bg-gray-50/50"
              }`}
            >
              <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6">
                <Calendar className="text-emerald-500" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">No events registered</h3>
              <p className="text-gray-500 text-xs font-semibold max-w-xs">
                You haven't registered for any community events yet. Explore our
                upcoming gatherings to get involved.
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
