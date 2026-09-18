// pages/user/Events.jsx — Clerk-style redesign
import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  getAllEvents,
  registerForEvent,
  clearRegistrationStatus,
} from "../../features/event/eventSlice";
import { useTheme } from "../../context/ThemeContext";
import { formatDate } from "../../utils/formatDate";
import { formatCurrency } from "../../utils/formatCurrency";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  Search,
  Plus,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Star,
  Loader2,
} from "lucide-react";

// ── Helpers ───────────────────────────────────────────────────────────────────
const getStatusCfg = (status, eventDate, endDate) => {
  const now = new Date();
  const start = new Date(eventDate);
  const end = endDate ? new Date(endDate) : start;
  if (status === "completed" || now > end)
    return { label: "Completed", dot: "bg-gray-400", text: "text-gray-500" };
  if (status === "ongoing" || (now >= start && now <= end))
    return { label: "Ongoing", dot: "bg-emerald-500", text: "text-emerald-600" };
  return { label: "Upcoming", dot: "bg-blue-500", text: "text-blue-600" };
};

// ── Shared UI ─────────────────────────────────────────────────────────────────
const Card = ({ children, className = "" }) => {
  const { darkMode } = useTheme();
  return (
    <div className={`rounded-xl border ${darkMode ? "bg-[#111] border-gray-800" : "bg-white border-gray-200 shadow-sm"} ${className}`}>
      {children}
    </div>
  );
};
const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800 ${className}`} />
);

// ── Event Card ────────────────────────────────────────────────────────────────
const EventCard = ({ event, onRegister, registering }) => {
  const { darkMode } = useTheme();
  const { user } = useSelector((s) => s.auth);
  const statusCfg = getStatusCfg(event.status, event.eventDate, event.endDate);
  const isRegistered = event.attendees?.some((a) => {
    const id = a.user?._id || a.user;
    return id === user?._id || (a.guestInfo?.email && a.guestInfo?.email === user?.email);
  });
  const isPast = statusCfg.label === "Completed";

  const image =
    event.images?.find((img) => img.isPrimary)?.url ||
    event.images?.[0]?.url ||
    "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600&h=400&fit=crop";

  const date = event.eventDate ? new Date(event.eventDate) : null;

  return (
    <Card className="overflow-hidden flex flex-col group">
      {/* Image */}
      <div className="relative h-44 overflow-hidden shrink-0">
        <img
          src={image}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Date callout */}
        {date && (
          <div className="absolute top-3 left-3 w-11 h-11 rounded-lg bg-white dark:bg-gray-900 flex flex-col items-center justify-center shadow-md">
            <span className="text-[9px] font-bold uppercase text-emerald-600 leading-none">
              {date.toLocaleString("en", { month: "short" })}
            </span>
            <span className={`text-base font-bold leading-none ${darkMode ? "text-white" : "text-gray-900"}`}>
              {date.getDate()}
            </span>
          </div>
        )}

        {/* Status + Featured */}
        <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5">
          <span className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-md ${darkMode ? "bg-gray-900/80" : "bg-white/90"} ${statusCfg.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
            {statusCfg.label}
          </span>
          {event.featured && (
            <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-md bg-amber-400/90 text-white">
              <Star size={9} fill="white" /> Featured
            </span>
          )}
        </div>

        {/* Fee on image */}
        <div className="absolute bottom-3 right-3">
          {event.registrationFee?.amount > 0 ? (
            <span className="text-[11px] font-bold text-white bg-black/50 backdrop-blur-sm px-2 py-1 rounded-md">
              {formatCurrency(event.registrationFee.amount)}
            </span>
          ) : (
            <span className="text-[11px] font-bold text-emerald-400 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-md">
              Free
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col p-4 gap-3">
        <div>
          <h3 className={`text-sm font-semibold line-clamp-2 leading-snug ${darkMode ? "text-white" : "text-gray-900"}`}>
            {event.title}
          </h3>
          {event.shortDescription && (
            <p className="text-[11px] text-gray-400 mt-1 line-clamp-2">{event.shortDescription}</p>
          )}
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          {event.location?.venue && (
            <span className="flex items-center gap-1 text-[11px] text-gray-400">
              <MapPin size={10} /> {event.location.venue}
            </span>
          )}
          {event.eventDate && (
            <span className="flex items-center gap-1 text-[11px] text-gray-400">
              <Clock size={10} /> {formatDate(event.eventDate)}
            </span>
          )}
          {event.capacity?.registered != null && (
            <span className="flex items-center gap-1 text-[11px] text-gray-400">
              <Users size={10} /> {event.capacity.registered} joined
            </span>
          )}
        </div>

        {/* Capacity warning */}
        {event.availableSlots < 10 && event.availableSlots > 0 && (
          <p className="text-[10px] font-semibold text-amber-500">
            Only {event.availableSlots} spots left!
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-auto pt-1">
          <Link
            to={`/user/events/${event._id}`}
            className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-[12px] font-medium border transition-colors ${
              darkMode
                ? "border-gray-700 text-gray-400 hover:text-white hover:border-gray-600"
                : "border-gray-200 text-gray-600 hover:text-gray-900"
            }`}
          >
            Details <ChevronRight size={12} />
          </Link>

          {!isPast && (
            <button
              disabled={isRegistered || registering === event._id}
              onClick={() => onRegister(event._id)}
              className={`flex-[1.5] flex items-center justify-center gap-1.5 py-2 rounded-lg text-[12px] font-semibold transition-all ${
                isRegistered
                  ? darkMode
                    ? "bg-emerald-900/30 text-emerald-400 border border-emerald-800/40"
                    : "bg-emerald-50 text-emerald-600 border border-emerald-200"
                  : "bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:opacity-90"
              } disabled:opacity-60`}
            >
              {registering === event._id ? (
                <Loader2 size={12} className="animate-spin" />
              ) : isRegistered ? (
                <><CheckCircle2 size={12} /> Registered</>
              ) : (
                <><Plus size={12} /> Register</>
              )}
            </button>
          )}
        </div>
      </div>
    </Card>
  );
};

// ── Main ──────────────────────────────────────────────────────────────────────
const Events = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const { events, loading, filters, registrationSuccess, registrationError } =
    useSelector((s) => s.events);
  const { user } = useSelector((s) => s.auth);

  const [search, setSearch] = useState(filters.search || "");
  const [tab, setTab] = useState("all");
  const [registering, setRegistering] = useState(null);

  useEffect(() => { dispatch(getAllEvents({})); }, [dispatch, filters]);

  useEffect(() => {
    if (registrationSuccess) {
      toast.success("Successfully registered!");
      setRegistering(null);
      dispatch(clearRegistrationStatus());
      dispatch(getAllEvents({}));
    }
    if (registrationError) {
      toast.error(registrationError);
      setRegistering(null);
      dispatch(clearRegistrationStatus());
    }
  }, [registrationSuccess, registrationError, dispatch]);

  const filtered = useMemo(() => {
    let r = [...events];
    if (tab === "featured") r = r.filter((e) => e.featured);
    if (tab === "upcoming") r = r.filter((e) => e.status === "upcoming");
    if (search) r = r.filter((e) => e.title.toLowerCase().includes(search.toLowerCase()));
    return r;
  }, [events, tab, search]);

  const handleRegister = (eventId) => {
    if (!user) {
      toast.error("Please sign in to register for events");
      navigate("/login?redirect=/user/events");
      return;
    }
    setRegistering(eventId);
    dispatch(registerForEvent({ eventId, registrationData: {} }));
  };

  const TABS = [
    { key: "all", label: "All events" },
    { key: "featured", label: "Featured" },
    { key: "upcoming", label: "Upcoming" },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
            Events
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Community programs & gatherings
          </p>
        </div>
        <Link
          to="/contact?subject=Event%20Proposal"
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          <Plus size={14} /> Propose Event
        </Link>
      </div>

      {/* ── Toolbar ─────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Tabs */}
        <div className={`flex gap-1 p-1 rounded-lg border ${darkMode ? "bg-gray-900 border-gray-800" : "bg-gray-100 border-gray-200"}`}>
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-4 py-1.5 rounded-md text-[12px] font-medium transition-all ${
                tab === key
                  ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-1">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search events…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full pl-8 pr-3 py-2 text-sm rounded-lg border outline-none transition-colors ${
              darkMode
                ? "bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:border-gray-600"
                : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-gray-300"
            }`}
          />
        </div>
      </div>

      {/* ── Count ───────────────────────────────────────────────────── */}
      {!loading && (
        <p className="text-[12px] text-gray-400">
          {filtered.length} event{filtered.length !== 1 ? "s" : ""}
          {search ? ` matching "${search}"` : ""}
        </p>
      )}

      {/* ── Grid ────────────────────────────────────────────────────── */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => <Skeleton key={i} className="h-80" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <XCircle size={36} className="text-gray-300 mb-3" />
          <p className={`font-medium text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            {search ? `No events match "${search}"` : "No events available right now"}
          </p>
          {search && (
            <button
              onClick={() => { setSearch(""); setTab("all"); }}
              className="mt-3 text-sm text-emerald-600 font-medium hover:underline"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((event) => (
            <EventCard
              key={event._id}
              event={event}
              onRegister={handleRegister}
              registering={registering}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;
