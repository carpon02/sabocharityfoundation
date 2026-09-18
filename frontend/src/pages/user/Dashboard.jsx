// pages/user/Dashboard.jsx — Clerk-style redesign
import React, { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  Heart,
  Wallet,
  Target,
  Calendar,
  ArrowRight,
  RefreshCw,
  Plus,
  MapPin,
  Clock,
  TrendingUp,
  Users,
  BookOpen,
  Utensils,
  TreePine,
  Star,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { fetchUserAnalytics } from "../../features/analytics/analyticsSlice";
import { getUserRegisteredEvents } from "../../features/event/eventSlice";
import Meta from "../../components/Meta";

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt = (n) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n || 0);

const pct = (cur, target) =>
  !target ? 0 : Math.min(Math.round((cur / target) * 100), 100);

const getHour = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

const today = new Date().toLocaleDateString("en-NG", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});

// ── Shared primitives ─────────────────────────────────────────────────────────
const Card = ({ children, className = "" }) => {
  const { darkMode } = useTheme();
  return (
    <div
      className={`rounded-xl border ${
        darkMode
          ? "bg-[#111] border-gray-800"
          : "bg-white border-gray-200 shadow-sm"
      } ${className}`}
    >
      {children}
    </div>
  );
};

const SectionLabel = ({ children }) => (
  <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-3">
    {children}
  </p>
);

// ── Stat Card ─────────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, sub, iconBg }) => {
  const { darkMode } = useTheme();
  return (
    <Card className="p-5 flex items-start gap-4">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${iconBg}`}>
        <Icon size={18} />
      </div>
      <div className="min-w-0">
        <p className={`text-[11px] font-medium ${darkMode ? "text-gray-500" : "text-gray-500"}`}>
          {label}
        </p>
        <p className={`text-xl font-bold mt-0.5 truncate ${darkMode ? "text-white" : "text-gray-900"}`}>
          {value}
        </p>
        {sub && (
          <p className={`text-[11px] mt-0.5 ${darkMode ? "text-gray-600" : "text-gray-400"}`}>
            {sub}
          </p>
        )}
      </div>
    </Card>
  );
};

// ── Progress Bar ──────────────────────────────────────────────────────────────
const ProgressBar = ({ value, max }) => {
  const p = pct(value, max);
  return (
    <div className="w-full h-1.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
      <div
        className="h-full rounded-full bg-emerald-500 transition-all duration-700"
        style={{ width: `${p}%` }}
      />
    </div>
  );
};

// ── Status Dot ────────────────────────────────────────────────────────────────
const StatusDot = ({ status }) => {
  const map = {
    active: "bg-emerald-500",
    approved: "bg-emerald-500",
    completed: "bg-gray-400",
    pending: "bg-amber-400",
    rejected: "bg-red-500",
  };
  return (
    <span
      className={`inline-block w-2 h-2 rounded-full shrink-0 ${map[status] || "bg-gray-400"}`}
    />
  );
};

// ── Recent Donation Row ───────────────────────────────────────────────────────
const DonationRow = ({ d }) => {
  const { darkMode } = useTheme();
  return (
    <div
      className={`flex items-center gap-3 py-3 px-4 rounded-lg transition-colors ${
        darkMode ? "hover:bg-gray-800/50" : "hover:bg-gray-50"
      }`}
    >
      <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
        <Heart size={14} className="text-emerald-600 dark:text-emerald-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${darkMode ? "text-white" : "text-gray-900"}`}>
          {d.campaign?.title || "General Donation"}
        </p>
        <p className="text-[11px] text-gray-400">
          {new Date(d.createdAt).toLocaleDateString("en-NG", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <StatusDot status={d.status} />
        <span className={`text-sm font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
          {fmt(d.amount)}
        </span>
      </div>
    </div>
  );
};

// ── Campaign Row ──────────────────────────────────────────────────────────────
const CampaignRow = ({ c }) => {
  const { darkMode } = useTheme();
  const progress = pct(c.raisedAmount || c.raised, c.targetAmount || c.target);
  const id = c._id || c.id;
  return (
    <Link
      to={`/campaigns/${id}`}
      className={`block p-4 rounded-lg border transition-colors group ${
        darkMode
          ? "border-gray-800 hover:border-gray-700 hover:bg-gray-800/40"
          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <p className={`text-sm font-medium truncate ${darkMode ? "text-white" : "text-gray-900"}`}>
            {c.title}
          </p>
          <p className="text-[11px] text-gray-400 mt-0.5">{c.category || "General"}</p>
        </div>
        <ChevronRight
          size={14}
          className="text-gray-400 group-hover:text-gray-600 shrink-0 mt-0.5 transition-colors"
        />
      </div>
      <ProgressBar value={c.raisedAmount || c.raised} max={c.targetAmount || c.target} />
      <div className="flex items-center justify-between mt-2">
        <span className="text-[11px] text-gray-400">
          {fmt(c.raisedAmount || c.raised)} raised
        </span>
        <span className="text-[11px] font-semibold text-emerald-600">{progress}%</span>
      </div>
    </Link>
  );
};

// ── Event Row ─────────────────────────────────────────────────────────────────
const EventRow = ({ e }) => {
  const { darkMode } = useTheme();
  const date = e.eventDate ? new Date(e.eventDate) : null;
  return (
    <div
      className={`flex items-center gap-3 py-3 px-4 rounded-lg transition-colors ${
        darkMode ? "hover:bg-gray-800/50" : "hover:bg-gray-50"
      }`}
    >
      {date ? (
        <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex flex-col items-center justify-center shrink-0 text-blue-600 dark:text-blue-400">
          <span className="text-[10px] font-bold uppercase leading-none">
            {date.toLocaleString("en", { month: "short" })}
          </span>
          <span className="text-base font-bold leading-none">{date.getDate()}</span>
        </div>
      ) : (
        <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
          <Calendar size={14} className="text-gray-400" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${darkMode ? "text-white" : "text-gray-900"}`}>
          {e.title || e.name}
        </p>
        <p className="text-[11px] text-gray-400 truncate flex items-center gap-1">
          <MapPin size={10} />
          {e.location?.city || e.location || "TBA"}
        </p>
      </div>
      <span
        className={`text-[10px] font-semibold px-2 py-1 rounded-md shrink-0 ${
          darkMode ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-500"
        }`}
      >
        Registered
      </span>
    </div>
  );
};

// ── Impact Metric Row ─────────────────────────────────────────────────────────
const metricIcon = { "People Helped": Users, "Meals Provided": Utensils, "Books Donated": BookOpen, "Trees Planted": TreePine };
const MetricRow = ({ m }) => {
  const { darkMode } = useTheme();
  const Icon = metricIcon[m.label] || Star;
  return (
    <div className={`flex items-center gap-3 py-2.5 px-4 rounded-lg ${darkMode ? "hover:bg-gray-800/40" : "hover:bg-gray-50"} transition-colors`}>
      <Icon size={15} className="text-emerald-500 shrink-0" />
      <span className={`flex-1 text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
        {m.label}
      </span>
      <span className={`text-sm font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
        {m.value?.toLocaleString()}
      </span>
      {m.growth != null && (
        <span className="text-[10px] font-semibold text-emerald-500 flex items-center gap-0.5">
          <TrendingUp size={10} />+{m.growth}%
        </span>
      )}
    </div>
  );
};

// ── Loading Skeleton ──────────────────────────────────────────────────────────
const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800 ${className}`} />
);

// ── Main Dashboard ────────────────────────────────────────────────────────────
const Dashboard = () => {
  const dispatch = useDispatch();
  const { darkMode } = useTheme();
  const { user: authUser } = useSelector((s) => s.auth);
  const { userAnalytics, loading, error } = useSelector((s) => s.analytics);
  const { userRegisteredEvents, userEventsLoading } = useSelector((s) => s.events);

  useEffect(() => {
    if (authUser) {
      dispatch(fetchUserAnalytics());
      dispatch(getUserRegisteredEvents());
    }
  }, [dispatch, authUser]);

  const data = useMemo(() => ({
    user: userAnalytics?.user || {},
    recentDonations: userAnalytics?.recentDonations || [],
    activeCampaigns: userAnalytics?.activeCampaigns || [],
    impactMetrics: userAnalytics?.impactMetrics || [],
  }), [userAnalytics]);

  const firstName = authUser?.fullName?.split(" ")[0] || "there";

  // ── Stats ──────────────────────────────────────────────────────────────────
  const stats = [
    {
      icon: Wallet,
      label: "Total Donated",
      value: fmt(data.user.totalDonated),
      sub: "All time",
      iconBg: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
    },
    {
      icon: Target,
      label: "Campaigns",
      value: data.user.campaignsCreated ?? 0,
      sub: "Created",
      iconBg: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
    },
    {
      icon: Calendar,
      label: "Events",
      value: data.user.eventsAttended ?? 0,
      sub: "Attended",
      iconBg: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
    },
    {
      icon: Star,
      label: "Impact Score",
      value: data.user.impactScore ?? 0,
      sub: "Points",
      iconBg: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",
    },
  ];

  // ── Monthly progress ───────────────────────────────────────────────────────
  const monthPct = pct(data.user.currentMonthDonations, data.user.monthlyGoal);

  // ── Error State ────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 text-center px-4">
        <AlertCircle size={40} className="text-red-400" />
        <div>
          <p className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
            Failed to load dashboard
          </p>
          <p className="text-sm text-gray-400 mt-1">{error}</p>
        </div>
        <button
          onClick={() => dispatch(fetchUserAnalytics())}
          className="mt-2 px-4 py-2 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <Meta
        title={`Dashboard | ${authUser?.fullName || "User"}`}
        description="Your personal impact dashboard at Sabo Ibadan Youth Charity Foundation."
      />

      {/* ── Page Header ──────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
            {getHour()}, {firstName} 👋
          </h1>
          <p className="text-sm text-gray-400 mt-1">{today}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { dispatch(fetchUserAnalytics()); dispatch(getUserRegisteredEvents()); }}
            disabled={loading}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
              darkMode
                ? "border-gray-700 text-gray-400 hover:text-white hover:border-gray-600"
                : "border-gray-200 text-gray-600 hover:text-gray-900"
            } disabled:opacity-50`}
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
          <Link
            to="/user/my-campaigns"
            state={{ openCreateModal: true }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <Plus size={14} />
            New Campaign
          </Link>
        </div>
      </div>

      {/* ── Stats Row ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {loading
          ? [1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-24" />)
          : stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      {/* ── Monthly Goal ─────────────────────────────────────────────────── */}
      {!loading && data.user.monthlyGoal > 0 && (
        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className={`text-sm font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                Monthly giving goal
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">
                {fmt(data.user.currentMonthDonations)} of {fmt(data.user.monthlyGoal)}
              </p>
            </div>
            <span className="text-sm font-bold text-emerald-600">{monthPct}%</span>
          </div>
          <ProgressBar value={data.user.currentMonthDonations} max={data.user.monthlyGoal} />
        </Card>
      )}

      {/* ── Main two-column grid ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* ── Recent Donations (wider) ────────────────────────────────── */}
        <Card className="lg:col-span-3 overflow-hidden">
          <div className={`flex items-center justify-between px-5 py-4 border-b ${darkMode ? "border-gray-800" : "border-gray-100"}`}>
            <div>
              <p className={`text-sm font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                Recent donations
              </p>
            </div>
            <Link
              to="/user/my-donations"
              className="flex items-center gap-1 text-[12px] font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="p-2">
            {loading ? (
              [1, 2, 3].map((i) => <Skeleton key={i} className="h-14 mb-2" />)
            ) : data.recentDonations.length > 0 ? (
              data.recentDonations.slice(0, 5).map((d) => (
                <DonationRow key={d._id} d={d} />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Heart size={28} className="text-gray-300 mb-3" />
                <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                  No donations yet
                </p>
                <Link
                  to="/campaigns"
                  className="mt-3 text-[12px] text-emerald-600 font-medium hover:underline"
                >
                  Browse campaigns →
                </Link>
              </div>
            )}
          </div>
        </Card>

        {/* ── Impact Metrics (narrower) ───────────────────────────────── */}
        <Card className="lg:col-span-2 overflow-hidden">
          <div className={`px-5 py-4 border-b ${darkMode ? "border-gray-800" : "border-gray-100"}`}>
            <p className={`text-sm font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
              Your impact
            </p>
          </div>
          <div className="p-2">
            {loading ? (
              [1, 2, 3].map((i) => <Skeleton key={i} className="h-10 mb-2" />)
            ) : data.impactMetrics.length > 0 ? (
              data.impactMetrics.map((m, i) => <MetricRow key={i} m={m} />)
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Star size={28} className="text-gray-300 mb-3" />
                <p className={`text-sm ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                  Impact will appear as you donate
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* ── Active Campaigns ─────────────────────────────────────────────── */}
      {(loading || data.activeCampaigns.length > 0) && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className={`text-sm font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
              Active campaigns
            </p>
            <Link
              to="/campaigns"
              className="flex items-center gap-1 text-[12px] font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              Browse all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {loading
              ? [1, 2, 3].map((i) => <Skeleton key={i} className="h-28" />)
              : data.activeCampaigns.slice(0, 3).map((c) => (
                  <CampaignRow key={c._id || c.id} c={c} />
                ))}
          </div>
        </div>
      )}

      {/* ── Registered Events ────────────────────────────────────────────── */}
      <Card className="overflow-hidden">
        <div className={`flex items-center justify-between px-5 py-4 border-b ${darkMode ? "border-gray-800" : "border-gray-100"}`}>
          <p className={`text-sm font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
            Your events
          </p>
          <Link
            to="/user/events"
            className="flex items-center gap-1 text-[12px] font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            View all <ArrowRight size={12} />
          </Link>
        </div>
        <div className="p-2">
          {userEventsLoading ? (
            [1, 2].map((i) => <Skeleton key={i} className="h-14 mb-2" />)
          ) : userRegisteredEvents.length > 0 ? (
            userRegisteredEvents.slice(0, 4).map((e) => (
              <EventRow key={e._id || e.id} e={e} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Calendar size={28} className="text-gray-300 mb-3" />
              <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                No events registered
              </p>
              <Link
                to="/user/events"
                className="mt-2 text-[12px] text-emerald-600 font-medium hover:underline"
              >
                Find events →
              </Link>
            </div>
          )}
        </div>
      </Card>

      {/* ── Quick Actions ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { to: "/campaigns", icon: Heart, label: "Browse campaigns", desc: "Find causes to support" },
          { to: "/user/my-donations", icon: Wallet, label: "Donation history", desc: "View all your donations" },
          { to: "/user/events", icon: Calendar, label: "Events", desc: "Community gatherings" },
        ].map(({ to, icon: Icon, label, desc }) => (
          <Link
            key={to}
            to={to}
            className={`flex items-center gap-3 p-4 rounded-xl border transition-all group ${
              darkMode
                ? "border-gray-800 hover:border-gray-700 hover:bg-gray-800/40"
                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${darkMode ? "bg-gray-800" : "bg-gray-100"} group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/30 transition-colors`}>
              <Icon size={16} className="text-gray-500 group-hover:text-emerald-600 transition-colors" />
            </div>
            <div className="min-w-0">
              <p className={`text-sm font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>{label}</p>
              <p className="text-[11px] text-gray-400">{desc}</p>
            </div>
            <ChevronRight size={14} className="text-gray-400 ml-auto shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
