// admin/src/component/pages/Events.jsx - Sabo Ibadan Youth Charity Foundation
import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Plus,
  Search,
  Filter,
  MapPin,
  Users,
  Clock,
  Edit,
  Trash2,
  Eye,
  AlertCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Activity,
  CheckCircle2,
  Heart,
  Download,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import apiClient from "../../config/apiConfig";
import { toast } from "react-hot-toast";
import { StatsCard } from "../shared";

const Events = () => {
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventDetail, setShowEventDetail] = useState(false);

  const handleViewEvent = (event) => {
    setSelectedEvent(event);
    setShowEventDetail(true);
  };

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
      });

      if (searchTerm) params.append("search", searchTerm);
      if (filterStatus !== "all") params.append("status", filterStatus);

      const response = await apiClient.get(`/events?${params}`);

      setEvents(response.data.data.events);
      setPagination(response.data.data.pagination);
    } catch (error) {
      toast.error("Failed to load events");
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, searchTerm, filterStatus]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const stats = [
    {
      label: "Total Events",
      value: pagination.total.toString(),
      subtitle: "All time events",
      icon: Calendar,
      bgColor: "from-primary-600 to-primary-700",
    },
    {
      label: "Upcoming Events",
      value: events
        .filter((e) => new Date(e.eventDate) > new Date())
        .length.toString(),
      subtitle: "Scheduled ahead",
      icon: Clock,
      bgColor: "from-secondary-500 to-secondary-600",
    },
    {
      label: "Ongoing Events",
      value: events.filter((e) => e.status === "ongoing").length.toString(),
      subtitle: "Currently active",
      icon: Activity,
      bgColor: "from-amber-500 to-orange-600",
    },
    {
      label: "Total Attendees",
      value: events
        .reduce((sum, e) => sum + (e.capacity?.registered || 0), 0)
        .toString(),
      subtitle: "Community members",
      icon: Users,
      bgColor: "from-primary-700 to-primary-800",
    },
  ];

  const getStatusConfig = (status) => {
    const configs = {
      draft: {
        label: "Draft",
        color: "text-gray-500",
        bg: "bg-gray-100 dark:bg-gray-800",
        icon: AlertCircle,
      },
      published: {
        label: "Published",
        color: "text-primary-600",
        bg: "bg-primary-100 dark:bg-primary-950/30",
        icon: CheckCircle2,
      },
      ongoing: {
        label: "Ongoing",
        color: "text-amber-600",
        bg: "bg-amber-100 dark:bg-amber-950/30",
        icon: Activity,
      },
      completed: {
        label: "Completed",
        color: "text-green-600",
        bg: "bg-green-100 dark:bg-green-950/30",
        icon: CheckCircle2,
      },
      cancelled: {
        label: "Cancelled",
        color: "text-red-600",
        bg: "bg-red-100 dark:bg-red-950/30",
        icon: AlertCircle,
      },
    };
    return configs[status] || configs.draft;
  };

  const handleDeleteEvent = async () => {
    try {
      setDeleting(true);
      await apiClient.delete(`/events/${eventToDelete}`);
      toast.success("Event deleted successfully");
      setShowDeleteModal(false);
      setEventToDelete(null);
      fetchEvents();
    } catch (error) {
      toast.error("Failed to delete event");
      console.error("Error deleting event:", error);
    } finally {
      setDeleting(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      setPagination((prev) => ({ ...prev, page: newPage }));
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-xl font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
            Events
          </h1>
          <p className={`text-sm mt-0.5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            Manage and organize community events
          </p>
        </div>
        <Link
          to="/admin/events/create"
          className="px-3 py-2 rounded-lg bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium flex items-center gap-1.5 transition-all shadow-sm"
        >
          <Plus size={15} /> Create Event
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <StatsCard key={i} {...stat} index={i} />
        ))}
      </div>

      {/* Filters */}
      <div className={`p-4 rounded-xl border flex flex-col sm:flex-row gap-3 ${darkMode ? "bg-dark-lighter border-gray-800/70" : "bg-white border-gray-200/80 shadow-sm"}`}>
        <div className="relative flex-1">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? "text-gray-500" : "text-gray-400"}`} size={15} />
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-9 pr-4 py-2 rounded-lg border text-sm outline-none transition-all ${
              darkMode ? "bg-gray-800/60 border-gray-700/50 text-white placeholder-gray-500 focus:border-primary-500/50" : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-primary-500/50"
            }`}
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className={`px-3 py-2 rounded-lg border text-sm outline-none cursor-pointer ${
            darkMode ? "bg-gray-800/60 border-gray-700/50 text-white" : "bg-gray-50 border-gray-200 text-gray-700"
          }`}
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <button
          onClick={() => fetchEvents()}
          disabled={loading}
          className={`p-2 rounded-lg border text-sm transition-all disabled:opacity-50 ${
            darkMode ? "bg-dark-lighter border-gray-800 text-gray-400 hover:text-white" : "bg-white border-gray-200 text-gray-600 hover:text-gray-900 shadow-sm"
          }`}
          title="Refresh"
        >
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Events Table */}
      <div className={`rounded-xl border overflow-hidden ${darkMode ? "bg-dark-lighter border-gray-800/70" : "bg-white border-gray-200/80 shadow-sm"}`}>
        <div className={`px-5 py-4 border-b flex items-center gap-2.5 ${darkMode ? "border-gray-800/60" : "border-gray-100"}`}>
          <Calendar size={17} className="text-primary-500" />
          <h2 className={`text-sm font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>Events</h2>
          <span className={`ml-auto px-2 py-0.5 rounded-full text-xs font-medium ${darkMode ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-500"}`}>
            {events?.length || 0}
          </span>
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b text-left ${darkMode ? "border-gray-800/60" : "border-gray-50"}`}>
                {["Event", "Date", "Location", "Attendees", "Status", ""].map((h, i) => (
                  <th key={h + i} className={`px-5 py-3 text-xs font-semibold uppercase tracking-wider ${darkMode ? "text-gray-500" : "text-gray-400"} ${i === 5 ? "text-right" : ""}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
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
              ) : events && events.length > 0 ? (
                events.map((event) => {
                  const status = getStatusConfig(event.status);
                  return (
                    <tr
                      key={event._id}
                      className={`border-b transition-colors ${darkMode ? "border-gray-800/40 hover:bg-gray-800/30" : "border-gray-50 hover:bg-gray-50/50"}`}
                    >
                      <td className="px-5 py-3.5">
                        <div>
                          <p className={`text-sm font-medium mb-0.5 ${darkMode ? "text-white" : "text-gray-900"}`}>{event.title}</p>
                          <p className={`text-xs capitalize ${darkMode ? "text-gray-500" : "text-gray-400"}`}>{event.category?.replace(/_/g, " ")}</p>
                        </div>
                      </td>

                      <td className="px-5 py-3.5">
                        <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>{formatDate(event.eventDate)}</p>
                        {event.eventTime?.start && <p className={`text-xs mt-0.5 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>{event.eventTime.start}</p>}
                      </td>

                      <td className="px-5 py-3.5">
                        <span className={`text-sm truncate ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{event.isOnline ? "Online" : event.location?.city || "TBA"}</span>
                      </td>

                      <td className="px-5 py-3.5">
                        <span className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>{event.capacity?.registered || 0} <span className={`${darkMode ? "text-gray-600" : "text-gray-400"}`}>/ {event.capacity?.max || "∞"}</span></span>
                      </td>

                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                          <status.icon size={11} />{status.label}
                        </span>
                      </td>

                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button onClick={() => handleViewEvent(event)} className={`p-1.5 rounded-lg transition-all ${darkMode ? "text-gray-400 hover:text-white hover:bg-gray-800" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"}`} title="View">
                            <Eye size={16} />
                          </button>
                          <button onClick={() => navigate(`/admin/events/${event._id}/edit`)} className={`p-1.5 rounded-lg transition-all ${darkMode ? "text-primary-400 hover:bg-primary-950/30" : "text-primary-600 hover:bg-primary-50"}`} title="Edit">
                            <Edit size={16} />
                          </button>
                          <button onClick={() => { setEventToDelete(event._id); setShowDeleteModal(true); }} className={`p-1.5 rounded-lg transition-all ${darkMode ? "text-red-400 hover:bg-red-950/30" : "text-red-500 hover:bg-red-50"}`} title="Delete">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-20 text-center">
                    <div
                      className={`flex flex-col items-center gap-4 ${
                        darkMode ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      <Calendar size={48} />
                      <p className="text-lg font-semibold">No events found</p>
                      <p className="text-sm">
                        Create your first event to get started
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
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-6">
                <div
                  className={`h-32 rounded-xl animate-pulse ${
                    darkMode ? "bg-gray-800" : "bg-gray-100"
                  }`}
                />
              </div>
            ))
          ) : events && events.length > 0 ? (
            events.map((event) => {
              const status = getStatusConfig(event.status);
              return (
                <motion.div
                  key={event._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-6 space-y-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h4
                        className={`font-semibold text-base mb-1 ${
                          darkMode ? "text-white" : "text-dark"
                        }`}
                      >
                        {event.title}
                      </h4>
                      <p
                        className={`text-sm capitalize ${
                          darkMode ? "text-gray-500" : "text-gray-600"
                        }`}
                      >
                        {event.category?.replace(/_/g, " ")}
                      </p>
                    </div>
                    <span
                      className={`${status.bg} ${status.color} px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shrink-0`}
                    >
                      <status.icon size={12} />
                      {status.label}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-primary-500" />
                      <span className={darkMode ? "text-gray-300" : "text-gray-700"}>
                        {formatDate(event.eventDate)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-primary-500" />
                      <span className={darkMode ? "text-gray-300" : "text-gray-700"}>
                        {event.capacity?.registered || 0} Registered
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/admin/events/${event._id}/edit`)}
                      className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                        darkMode
                          ? "bg-primary-950/30 text-primary-500"
                          : "bg-primary-50 text-primary-600"
                      }`}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setEventToDelete(event._id);
                        setShowDeleteModal(true);
                      }}
                      className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                        darkMode
                          ? "bg-red-950/30 text-red-500"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      Delete
                    </button>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="p-20 text-center">
              <div
                className={`flex flex-col items-center gap-4 ${
                  darkMode ? "text-gray-500" : "text-gray-400"
                }`}
              >
                <Calendar size={48} />
                <p className="text-lg font-semibold">No events found</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-between">
          <p
            className={`text-sm font-medium ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Page {pagination.page} of {pagination.pages}
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className={`p-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                darkMode
                  ? "bg-gray-800 text-gray-400 hover:text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <ChevronLeft size={20} />
            </button>

            {/* Page Numbers */}
            <div className="hidden sm:flex items-center gap-2">
              {Array.from({ length: Math.min(pagination.pages, 5) }, (_, i) => {
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
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center font-semibold text-sm transition-all ${
                      pagination.page === pageNum
                        ? "bg-primary-500 text-white shadow-lg shadow-primary-500/25"
                        : darkMode
                        ? "bg-gray-800 text-gray-400 hover:text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className={`p-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                darkMode
                  ? "bg-gray-800 text-gray-400 hover:text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-8 rounded-2xl border ${
          darkMode
            ? "bg-primary-950/20 border-primary-900/30"
            : "bg-primary-50 border-primary-100"
        }`}
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <Heart className="text-primary-600" size={24} />
              <div className="bg-primary-500 w-16 h-1 rounded-full" />
            </div>
            <h3
              className={`text-xl font-bold mb-2 ${
                darkMode ? "text-white" : "text-dark"
              }`}
            >
              Community Impact Report
            </h3>
            <p
              className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Every event creates lasting impact in the lives of young people across Ibadan. View detailed analytics and success metrics.
            </p>
          </div>
          <button
            className="bg-primary-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-primary-500/25 hover:bg-primary-600 transition-all flex items-center gap-2"
          >
            <Download size={18} />
            Download Report
          </button>
        </div>
      </motion.div>

      {/* ── Event Detail — Clerk-style slide-over ────────────────────── */}
      <AnimatePresence>
        {showEventDetail && selectedEvent && (() => {
          const ev = selectedEvent;
          const status = getStatusConfig(ev.status);
          const StatusIcon = status.icon;
          const registered = ev.capacity?.registered || 0;
          const maxCapacity = ev.capacity?.max || 0;
          const capacityPct = maxCapacity > 0 ? Math.min((registered / maxCapacity) * 100, 100) : 0;
          const isPast = new Date(ev.eventDate) < new Date();
          const isFull = maxCapacity > 0 && registered >= maxCapacity;

          const SectionLabel = ({ children }) => (
            <p className={`text-[10px] font-bold uppercase tracking-widest mb-3 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
              {children}
            </p>
          );
          const Divider = () => <div className={`my-5 border-t ${darkMode ? "border-gray-800" : "border-gray-100"}`} />;
          const Row = ({ label, value, icon: Icon }) => (
            <div className="flex items-center gap-3 py-2.5">
              {Icon && <Icon size={14} className={darkMode ? "text-gray-500" : "text-gray-400"} />}
              <span className={`text-xs flex-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{label}</span>
              <span className={`text-xs font-medium ${darkMode ? "text-gray-200" : "text-gray-800"}`}>{value || "—"}</span>
            </div>
          );

          return (
            <div className="fixed inset-0 z-[110] flex">
              {/* Scrim */}
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowEventDetail(false)} />

              {/* Slide-over panel */}
              <motion.div
                initial={{ x: "100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "100%", opacity: 0 }}
                transition={{ type: "spring", stiffness: 320, damping: 32 }}
                className={`relative ml-auto h-full w-full max-w-md flex flex-col overflow-hidden shadow-2xl ${darkMode ? "bg-[#0e0e0e] border-l border-gray-800" : "bg-white border-l border-gray-200"}`}
              >
                {/* ── Panel header ── */}
                <div className={`flex items-center justify-between px-6 py-4 border-b flex-shrink-0 ${darkMode ? "border-gray-800 bg-[#111]" : "border-gray-100 bg-white"}`}>
                  <div>
                    <p className={`text-[10px] font-bold uppercase tracking-widest ${darkMode ? "text-gray-500" : "text-gray-400"}`}>Event</p>
                    <p className={`text-sm font-semibold mt-0.5 font-mono ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                      {ev._id?.slice(-8)?.toUpperCase()}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowEventDetail(false)}
                    className={`p-2 rounded-lg transition-all ${darkMode ? "text-gray-400 hover:bg-gray-800 hover:text-white" : "text-gray-400 hover:bg-gray-100 hover:text-gray-700"}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>

                {/* ── Scrollable body ── */}
                <div className="flex-1 overflow-y-auto">

                  {/* ── Hero: cover image or colored banner ── */}
                  <div className="relative">
                    {ev.coverImage ? (
                      <img src={ev.coverImage} alt={ev.title} className="w-full h-44 object-cover" />
                    ) : (
                      <div className={`w-full h-44 flex items-center justify-center ${darkMode ? "bg-primary-950/30" : "bg-primary-50"}`}>
                        <Calendar size={48} className="text-primary-400 opacity-40" />
                      </div>
                    )}
                    {/* Status badge over image */}
                    <div className="absolute top-3 left-3">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${status.bg} ${status.color}`}>
                        <StatusIcon size={11} /> {status.label}
                      </span>
                    </div>
                    {isFull && (
                      <div className="absolute top-3 right-3">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${darkMode ? "bg-red-950/80 text-red-300" : "bg-red-100 text-red-700"} backdrop-blur-sm`}>
                          Full
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="px-6 py-5">

                    {/* Title + category */}
                    <h2 className={`text-xl font-bold leading-snug mb-1 ${darkMode ? "text-white" : "text-gray-900"}`}>{ev.title}</h2>
                    <p className={`text-sm capitalize mb-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{ev.category?.replace(/_/g, " ")}</p>

                    {/* Tags */}
                    {ev.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {ev.tags.map((tag) => (
                          <span key={tag} className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${darkMode ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-600"}`}>#{tag}</span>
                        ))}
                      </div>
                    )}

                    <Divider />

                    {/* ── Event details ── */}
                    <SectionLabel>Event Details</SectionLabel>
                    <div className={`divide-y rounded-xl overflow-hidden ${darkMode ? "divide-gray-800 bg-gray-900/60 border border-gray-800" : "divide-gray-100 bg-gray-50 border border-gray-100"}`}>
                      <div className="px-4">
                        <Row label="Date" value={formatDate(ev.eventDate)} icon={Calendar} />
                      </div>
                      {ev.eventTime?.start && (
                        <div className="px-4">
                          <Row label="Time" value={`${ev.eventTime.start}${ev.eventTime.end ? ` – ${ev.eventTime.end}` : ""}`} icon={Clock} />
                        </div>
                      )}
                      <div className="px-4">
                        <Row
                          label="Location"
                          value={ev.isOnline ? "Online Event" : [ev.location?.venue, ev.location?.city].filter(Boolean).join(", ") || "TBA"}
                          icon={MapPin}
                        />
                      </div>
                      {ev.organizer && (
                        <div className="px-4">
                          <Row label="Organizer" value={ev.organizer} icon={Users} />
                        </div>
                      )}
                    </div>

                    <Divider />

                    {/* ── Capacity ── */}
                    <SectionLabel>Capacity</SectionLabel>
                    <div className={`p-4 rounded-xl border ${darkMode ? "bg-gray-900/60 border-gray-800" : "bg-gray-50 border-gray-100"}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-sm font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                          {registered} <span className={`font-normal text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>registered</span>
                        </span>
                        <span className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                          {maxCapacity > 0 ? `${maxCapacity} max` : "Unlimited"}
                        </span>
                      </div>
                      {maxCapacity > 0 && (
                        <div className={`w-full rounded-full h-2 ${darkMode ? "bg-gray-800" : "bg-gray-200"}`}>
                          <div
                            className={`h-2 rounded-full transition-all ${capacityPct >= 90 ? "bg-red-500" : capacityPct >= 60 ? "bg-amber-500" : "bg-emerald-500"}`}
                            style={{ width: `${capacityPct}%` }}
                          />
                        </div>
                      )}
                      {isFull && (
                        <p className="text-xs text-red-500 mt-2 font-medium">This event is fully booked.</p>
                      )}
                    </div>

                    {/* ── Description ── */}
                    {ev.description && (
                      <>
                        <Divider />
                        <SectionLabel>Description</SectionLabel>
                        <p className={`text-sm leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                          {ev.description}
                        </p>
                      </>
                    )}

                    {/* ── Timestamps ── */}
                    <Divider />
                    <SectionLabel>Timeline</SectionLabel>
                    <div className={`divide-y rounded-xl overflow-hidden ${darkMode ? "divide-gray-800 bg-gray-900/60 border border-gray-800" : "divide-gray-100 bg-gray-50 border border-gray-100"}`}>
                      <div className="px-4"><Row label="Created" value={formatDate(ev.createdAt)} icon={Clock} /></div>
                      {ev.updatedAt && ev.updatedAt !== ev.createdAt && (
                        <div className="px-4"><Row label="Last Updated" value={formatDate(ev.updatedAt)} icon={RefreshCw} /></div>
                      )}
                      {isPast && (
                        <div className="px-4">
                          <div className="flex items-center gap-3 py-2.5">
                            <TrendingUp size={14} className="text-emerald-500" />
                            <span className={`text-xs flex-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Event Status</span>
                            <span className="text-xs font-medium text-emerald-600">Completed</span>
                          </div>
                        </div>
                      )}
                    </div>

                  </div>
                </div>

                {/* ── Sticky action footer ── */}
                <div className={`flex-shrink-0 px-6 py-4 border-t flex gap-2 ${darkMode ? "border-gray-800 bg-[#111]" : "border-gray-100 bg-white"}`}>
                  <button
                    onClick={() => { setShowEventDetail(false); navigate(`/admin/events/${ev._id}`); }}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-1.5 ${darkMode ? "bg-gray-800 hover:bg-gray-700 text-gray-200" : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`}
                  >
                    <Eye size={14} /> Full View
                  </button>
                  <button
                    onClick={() => { setShowEventDetail(false); navigate(`/admin/events/${ev._id}/edit`); }}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-1.5 ${darkMode ? "bg-primary-900/50 hover:bg-primary-900/70 text-primary-300 border border-primary-800" : "bg-primary-50 hover:bg-primary-100 text-primary-700 border border-primary-200"}`}
                  >
                    <Edit size={14} /> Edit
                  </button>
                  <button
                    onClick={() => { setShowEventDetail(false); setEventToDelete(ev._id); setShowDeleteModal(true); }}
                    className="flex-1 py-2.5 rounded-lg text-sm font-semibold bg-red-600 hover:bg-red-700 text-white transition-all flex items-center justify-center gap-1.5"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !deleting && setShowDeleteModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div
                className={`relative w-full max-w-md rounded-2xl shadow-2xl p-6 ${
                  darkMode ? "bg-dark-lighter" : "bg-white"
                }`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/30 flex items-center justify-center">
                    <AlertCircle size={24} className="text-red-600" />
                  </div>
                  <div>
                    <h3
                      className={`text-xl font-bold ${
                        darkMode ? "text-white" : "text-dark"
                      }`}
                    >
                      Delete Event?
                    </h3>
                    <p
                      className={`text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      This action cannot be undone
                    </p>
                  </div>
                </div>

                <p
                  className={`text-sm mb-6 ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Are you sure you want to delete this event? All event data,
                  registrations, and related information will be permanently
                  removed.
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setEventToDelete(null);
                    }}
                    disabled={deleting}
                    className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                      darkMode
                        ? "bg-gray-800 text-white hover:bg-gray-700"
                        : "bg-gray-100 text-dark hover:bg-gray-200"
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteEvent}
                    disabled={deleting}
                    className="flex-1 py-3 rounded-xl font-semibold bg-red-600 text-white hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deleting ? "Deleting..." : "Delete Event"}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Events;