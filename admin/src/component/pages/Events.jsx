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
import axios from "axios";
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

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
      });

      if (searchTerm) params.append("search", searchTerm);
      if (filterStatus !== "all") params.append("status", filterStatus);

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/events?${params}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

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
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/events/${eventToDelete}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-1 bg-primary-500 rounded-full" />
            <span className="text-xs font-bold text-primary-600 uppercase tracking-wider">
              Event Management
            </span>
          </div>
          <h1
            className={`text-3xl lg:text-4xl font-bold mb-2 ${
              darkMode ? "text-white" : "text-dark"
            }`}
          >
            Community Events
          </h1>
          <p
            className={`text-base ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Manage and organize community events and programs
          </p>
        </div>

        <Link
          to="/admin/events/create"
          className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 shadow-lg shadow-primary-500/25 transition-all w-fit"
        >
          <Plus size={20} /> Create Event
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <StatsCard key={i} {...stat} index={i} />
        ))}
      </div>

      {/* Filters Section */}
      <div
        className={`p-6 rounded-2xl border ${
          darkMode
            ? "bg-dark-lighter border-gray-800"
            : "bg-white border-gray-200 shadow-lg"
        }`}
      >
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search events by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 outline-none transition-all text-sm font-medium ${
                darkMode
                  ? "bg-gray-800 border-gray-700 text-white focus:border-primary-500"
                  : "bg-gray-50 border-gray-200 text-dark focus:border-primary-500"
              }`}
            />
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className={`px-6 py-3 rounded-xl border-2 outline-none cursor-pointer text-sm font-semibold ${
              darkMode
                ? "bg-gray-800 border-gray-700 text-white"
                : "bg-gray-50 border-gray-200 text-dark"
            }`}
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Refresh Button */}
          <button
            onClick={() => fetchEvents()}
            disabled={loading}
            className={`px-6 py-3 rounded-xl border-2 font-semibold text-sm transition-all flex items-center gap-2 ${
              darkMode
                ? "bg-gray-800 border-gray-700 text-gray-300 hover:text-white disabled:opacity-50"
                : "bg-white border-gray-200 text-gray-600 hover:text-dark disabled:opacity-50"
            }`}
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />{" "}
            Refresh
          </button>
        </div>
      </div>

      {/* Events Table */}
      <div
        className={`rounded-2xl border overflow-hidden ${
          darkMode
            ? "bg-dark-lighter border-gray-800"
            : "bg-white border-gray-200 shadow-lg"
        }`}
      >
        {/* Table Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BarChart3 size={20} className="text-primary-500" />
              <h3
                className={`text-lg font-bold ${
                  darkMode ? "text-white" : "text-dark"
                }`}
              >
                Events List
              </h3>
              <span
                className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                  darkMode
                    ? "bg-gray-800 text-gray-400"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {events?.length || 0} Events
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
                  Event Details
                </th>
                <th
                  className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Date & Time
                </th>
                <th
                  className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Location
                </th>
                <th
                  className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Attendees
                </th>
                <th
                  className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Status
                </th>
                <th
                  className={`px-6 py-4 text-right text-xs font-bold uppercase tracking-wider ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody
              className={`divide-y ${
                darkMode ? "divide-gray-800" : "divide-gray-200"
              }`}
            >
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
                    <motion.tr
                      key={event._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors`}
                    >
                      {/* Event Details */}
                      <td className="px-6 py-4">
                        <div>
                          <h4
                            className={`font-semibold text-sm mb-1 ${
                              darkMode ? "text-white" : "text-dark"
                            }`}
                          >
                            {event.title}
                          </h4>
                          <p
                            className={`text-xs capitalize ${
                              darkMode ? "text-gray-500" : "text-gray-600"
                            }`}
                          >
                            {event.category?.replace(/_/g, " ")}
                          </p>
                        </div>
                      </td>

                      {/* Date & Time */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar size={16} className="text-primary-500" />
                          <span
                            className={
                              darkMode ? "text-gray-300" : "text-gray-700"
                            }
                          >
                            {formatDate(event.eventDate)}
                          </span>
                        </div>
                        {event.eventTime?.start && (
                          <div className="flex items-center gap-2 text-xs mt-1">
                            <Clock size={14} className="text-gray-400" />
                            <span
                              className={
                                darkMode ? "text-gray-500" : "text-gray-600"
                              }
                            >
                              {event.eventTime.start}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Location */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin size={16} className="text-primary-500" />
                          <span
                            className={`truncate max-w-[150px] ${
                              darkMode ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            {event.isOnline
                              ? "Online Event"
                              : event.location?.city || "TBA"}
                          </span>
                        </div>
                      </td>

                      {/* Attendees */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Users size={16} className="text-primary-500" />
                          <span
                            className={`font-semibold text-sm ${
                              darkMode ? "text-white" : "text-dark"
                            }`}
                          >
                            {event.capacity?.registered || 0}
                          </span>
                          <span
                            className={`text-xs ${
                              darkMode ? "text-gray-500" : "text-gray-600"
                            }`}
                          >
                            / {event.capacity?.max || "∞"}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span
                          className={`${status.bg} ${status.color} px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 w-fit`}
                        >
                          <status.icon size={14} />
                          {status.label}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() =>
                              navigate(`/admin/events/${event._id}`)
                            }
                            className={`p-2 rounded-lg transition-all ${
                              darkMode
                                ? "bg-gray-800 text-gray-400 hover:text-white"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                            title="View event"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() =>
                              navigate(`/admin/events/${event._id}/edit`)
                            }
                            className={`p-2 rounded-lg transition-all ${
                              darkMode
                                ? "bg-primary-950/30 text-primary-500 hover:bg-primary-950/50"
                                : "bg-primary-50 text-primary-600 hover:bg-primary-100"
                            }`}
                            title="Edit event"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => {
                              setEventToDelete(event._id);
                              setShowDeleteModal(true);
                            }}
                            className={`p-2 rounded-lg transition-all ${
                              darkMode
                                ? "bg-red-950/30 text-red-500 hover:bg-red-950/50"
                                : "bg-red-50 text-red-600 hover:bg-red-100"
                            }`}
                            title="Delete event"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
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