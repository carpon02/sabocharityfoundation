// pages/Events.jsx - Sabo Ibadan Youth Charity Foundation
import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
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
  Filter,
  ArrowRight,
  Star,
  Plus,
  CheckCircle2,
  XCircle,
  Heart,
  Sparkles,
  Grid3x3,
} from "lucide-react";

// Status Configuration
const getStatusConfig = (status, eventDate, endDate) => {
  const now = new Date();
  const start = new Date(eventDate);
  const end = endDate ? new Date(endDate) : start;

  if (status === "completed" || now > end)
    return {
      label: "Mission Accomplished",
      color: "text-gray-500",
      bg: "bg-gray-100", // Dark mode classes are usually handled in component or theme
      icon: CheckCircle2,
    };
  if (status === "ongoing" || (now >= start && now <= end))
    return {
      label: "Active Program",
      color: "text-emerald-500",
      bg: "bg-emerald-50",
      icon: Sparkles,
    };
  return {
    label: "Upcoming Opportunity",
    color: "text-blue-500",
    bg: "bg-blue-50",
    icon: Clock,
  };
};

// Status Badge Component
const StatusBadge = ({ label, color, bg, icon: Icon, darkMode }) => {
  if (!Icon) return null;
  return (
    <span
      className={`${color} ${darkMode ? "bg-gray-900/80 border-gray-800" : `${bg} border-${color.split("-")[1]}-100`} px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 border backdrop-blur-md shadow-sm`}
    >
      <Icon size={12} /> {label}
    </span>
  );
};

// Event Card Component
const EventCard = ({ event, darkMode, idx = 0, onRegister }) => {
  const status = getStatusConfig(event.status, event.eventDate, event.endDate);
  const { user } = useSelector((state) => state.auth);
  const isRegistered = event.attendees?.some((a) => {
    const attendeeId = a.user?._id || a.user;
    return (
      attendeeId === user?._id ||
      (a.guestInfo?.email && a.guestInfo?.email === user?.email)
    );
  });

  const primaryImage =
    event.images?.find((img) => img.isPrimary)?.url ||
    event.images?.[0]?.url ||
    "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600&h=400&fit=crop";

  const MotionDiv = motion.div;

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.05, duration: 0.4 }}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border transition-all duration-300 ${
        darkMode
          ? "bg-gray-950 border-gray-800 hover:border-emerald-500/50 shadow-2xl shadow-emerald-500/5"
          : "bg-white border-gray-100 hover:border-emerald-200 shadow-xl shadow-gray-200/20"
      }`}
    >
      {/* Event Image */}
      <div className="relative h-52 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
        <img
          src={primaryImage}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Status Badge */}
        <div className="absolute top-4 left-4 z-20">
          <StatusBadge {...status} darkMode={darkMode} />
        </div>

        {/* Event Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-5 z-20">
          <div className="flex items-center gap-2 text-white/70 text-[10px] font-bold uppercase tracking-widest mb-2">
            <Calendar size={12} className="text-emerald-400" />{" "}
            {formatDate(event.eventDate)}
          </div>
          <h3 className="text-white text-lg font-bold leading-tight line-clamp-2 tracking-tight group-hover:text-emerald-400 transition-colors">
            {event.title}
          </h3>
        </div>
      </div>

      {/* Event Details */}
      <div className="p-6 flex flex-col flex-1 space-y-4">
        {/* Registration Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-emerald-500 flex-shrink-0" />
            <p
              className={`text-xs font-semibold truncate max-w-[150px] ${darkMode ? "text-gray-400" : "text-gray-600"}`}
            >
              {event.location?.venue || "Ibadan, Nigeria"}
            </p>
          </div>
          {event.registrationFee?.amount > 0 ? (
            <span
              className={`text-xs font-bold ${darkMode ? "text-emerald-400" : "text-emerald-600"}`}
            >
              {formatCurrency(event.registrationFee.amount)}
            </span>
          ) : (
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">
              Free
            </span>
          )}
        </div>

        {/* Description */}
        <p
          className={`text-xs leading-relaxed line-clamp-2 font-medium ${darkMode ? "text-gray-500" : "text-gray-500"}`}
        >
          {event.shortDescription || event.description}
        </p>

        {/* Capacity Info */}
        <div
          className={`p-3 rounded-xl flex items-center justify-between border ${
            darkMode
              ? "bg-gray-900/50 border-gray-800"
              : "bg-gray-50/50 border-gray-100"
          }`}
        >
          <div className="flex items-center gap-3">
            <Users size={14} className="text-emerald-500" />
            <span
              className={`text-[11px] font-bold ${darkMode ? "text-gray-300" : "text-gray-700"}`}
            >
              {event.capacity?.registered || 0} Joined
            </span>
          </div>
          {event.availableSlots < 10 && event.availableSlots > 0 && (
            <span className="text-[9px] font-bold uppercase text-rose-500">
              Only {event.availableSlots} left
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Link
            to={`/user/events/${event._id}`}
            className={`flex-1 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all border ${
              darkMode
                ? "bg-gray-900 border-gray-800 text-gray-400 hover:text-white"
                : "bg-white border-gray-100 text-gray-400 hover:text-gray-950"
            }`}
          >
            Insights
          </Link>

          <button
            disabled={isRegistered}
            onClick={() => onRegister(event)}
            className={`flex-[1.5] py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
              isRegistered
                ? darkMode
                  ? "bg-emerald-950/30 text-emerald-500 border border-emerald-800/30"
                  : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 active:scale-95"
            }`}
          >
            {isRegistered ? (
              "Registered"
            ) : (
              <>
                <Plus size={14} /> Join Now
              </>
            )}
          </button>
        </div>
      </div>
    </MotionDiv>
  );
};

// Main Component
const Events = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const { events, loading, filters, registrationSuccess, registrationError } =
    useSelector((state) => state.events);
  const { user } = useSelector((state) => state.auth);

  const [searchQuery, setSearchQuery] = useState(filters.search || "");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    dispatch(getAllEvents({}));
  }, [dispatch, filters]);

  // Handle Registration Success/Error
  useEffect(() => {
    if (registrationSuccess) {
      toast.success("Successfully registered for event!");
      dispatch(clearRegistrationStatus());
      dispatch(getAllEvents({})); // Refresh events to update available slots/status
    }
    if (registrationError) {
      toast.error(registrationError);
      dispatch(clearRegistrationStatus());
    }
  }, [registrationSuccess, registrationError, dispatch]);

  const filteredEvents = useMemo(() => {
    let result = [...events];
    if (activeTab === "featured") result = result.filter((e) => e.featured);
    if (activeTab === "upcoming")
      result = result.filter((e) => e.status === "upcoming");
    if (searchQuery)
      result = result.filter((e) =>
        e.title.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    return result;
  }, [events, activeTab, searchQuery]);

  const featuredEvents = useMemo(
    () => events.filter((e) => e.featured).slice(0, 3),
    [events],
  );

  const handleRegister = (eventId) => {
    if (!user) {
      toast.error("Please login to register for this event");
      navigate("/login", { state: { from: "/events" } });
      return;
    }
    dispatch(registerForEvent({ eventId, registrationData: {} }));
  };

  return (
    <div className="space-y-10 pb-12">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-end justify-between gap-8"
      >
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-1 bg-emerald-500 rounded-full" />
            <span
              className={`text-[10px] font-bold uppercase tracking-widest ${darkMode ? "text-gray-500" : "text-gray-400"}`}
            >
              Community Hub • Impact Events
            </span>
          </div>
          <h1
            className={`text-3xl lg:text-4xl font-bold tracking-tight ${
              darkMode ? "text-white" : "text-gray-950"
            }`}
          >
            Mission Programs
          </h1>
          <p
            className={`text-sm mt-3 max-w-xl font-medium leading-relaxed ${darkMode ? "text-gray-400" : "text-gray-500"}`}
          >
            Discover and join community initiatives designed to create lasting
            impact. From youth empowerment to local charity drives, find your
            place in our mission.
          </p>
        </div>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Link
            to="/contact?subject=Event%20Proposal"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-emerald-600/20 active:scale-95 transition-all flex items-center gap-3"
          >
            <Plus size={16} /> Propose Mission
          </Link>
        </motion.div>
      </motion.div>

      {/* Navigation & Search Area */}
      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row items-center gap-4">
          {/* Tab Filters */}
          <div
            className={`p-1 rounded-xl border flex-1 lg:flex-none flex items-center gap-1 ${
              darkMode
                ? "bg-gray-950 border-gray-800"
                : "bg-white border-gray-100 shadow-xl shadow-gray-200/20"
            }`}
          >
            {["all", "featured", "upcoming"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                  activeTab === tab
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
                    : darkMode
                      ? "text-gray-500 hover:text-white"
                      : "text-gray-400 hover:text-gray-950"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative flex-1 w-full">
            <Search
              className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search missions by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-14 pr-6 py-3.5 rounded-xl text-sm font-bold outline-none border transition-all ${
                darkMode
                  ? "bg-gray-950 border-gray-800 text-white focus:border-emerald-500/50"
                  : "bg-white border-gray-100 text-gray-950 focus:border-emerald-500/50 shadow-xl shadow-gray-200/20"
              }`}
            />
          </div>

          <button
            onClick={() => {
              toast.success("Intelligence filters coming soon!");
            }}
            className={`p-3.5 rounded-xl border flex items-center gap-2 font-bold uppercase tracking-widest text-[10px] transition-all ${
              darkMode
                ? "bg-gray-950 border-gray-800 text-gray-500 hover:text-white"
                : "bg-white border-gray-100 text-gray-400 hover:text-gray-950 shadow-xl shadow-gray-200/20"
            }`}
          >
            <Filter size={16} /> Filters
          </button>
        </div>
      </div>

      {/* Featured Missions */}
      {featuredEvents.length > 0 && activeTab === "all" && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10">
              <Sparkles size={18} className="text-emerald-500" />
            </div>
            <h2
              className={`text-xl font-bold tracking-tight ${darkMode ? "text-white" : "text-gray-950"}`}
            >
              Spotlight Missions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEvents.map((event, i) => (
              <EventCard
                key={event._id}
                event={event}
                darkMode={darkMode}
                idx={i}
                onRegister={(e) => handleRegister(e._id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* All Missions Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10">
              <Grid3x3 size={18} className="text-emerald-500" />
            </div>
            <h3
              className={`text-sm font-bold tracking-tight ${darkMode ? "text-gray-300" : "text-gray-800"}`}
            >
              All Community Missions
            </h3>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
            {filteredEvents.length} Active
          </span>
        </div>

        <AnimatePresence mode="wait">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`h-96 rounded-2xl animate-pulse ${
                    darkMode ? "bg-gray-900" : "bg-gray-100/50"
                  }`}
                />
              ))}
            </div>
          ) : filteredEvents.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-20 text-center"
            >
              <div
                className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 ${
                  darkMode
                    ? "bg-gray-950 border border-gray-800"
                    : "bg-emerald-50"
                }`}
              >
                <XCircle size={32} className="text-gray-400" />
              </div>
              <h3
                className={`text-lg font-bold ${darkMode ? "text-white" : "text-gray-950"}`}
              >
                No Missions Found
              </h3>
              <p
                className={`text-[10px] font-bold uppercase tracking-widest mt-4 text-gray-500`}
              >
                Refine your intelligence or reset filters to explore more.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveTab("all");
                }}
                className="mt-10 px-10 py-4 bg-emerald-600 text-white rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 active:scale-95 transition-all"
              >
                Reset Search
              </button>
            </motion.div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredEvents.map((event, idx) => (
                <EventCard
                  key={event._id}
                  event={event}
                  darkMode={darkMode}
                  idx={idx}
                  onRegister={(e) => handleRegister(e._id)}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Call to Action Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={`p-10 lg:p-14 rounded-2xl border flex flex-col lg:flex-row items-center justify-between gap-10 overflow-hidden relative ${
          darkMode
            ? "bg-gray-950 border-gray-800 shadow-2xl shadow-emerald-500/5"
            : "bg-white border-gray-100 shadow-2xl shadow-gray-200/20"
        }`}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -ml-32 -mb-32" />

        <div className="flex-1 space-y-6 text-center lg:text-left relative z-10">
          <div className="flex items-center gap-3 justify-center lg:justify-start">
            <Heart className="text-emerald-500" size={24} />
            <div className="bg-emerald-500 w-12 h-1 rounded-full" />
          </div>
          <h2
            className={`text-2xl lg:text-3xl font-bold tracking-tight ${
              darkMode ? "text-white" : "text-gray-950"
            }`}
          >
            Forge Your Legacy
          </h2>
          <p
            className={`text-sm leading-relaxed max-w-xl font-medium ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Become an active part of the Sabo Ibadan movement. Your
            participation today creates a ripple effect of positive change for
            the youth of tomorrow.
          </p>
        </div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative z-10"
        >
          <Link
            to="/contact?subject=Get%20Involved"
            className="bg-emerald-600 text-white px-10 py-5 rounded-xl font-bold uppercase tracking-widest text-[10px] shadow-2xl shadow-emerald-600/30 hover:bg-emerald-700 transition-all block text-center"
          >
            Join the Movement
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Events;
