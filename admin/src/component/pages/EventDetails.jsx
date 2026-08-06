// admin/src/component/pages/EventDetails.jsx - Foundation Event Report
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Edit,
  Trash2,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  Download,
  Search,
  Filter,
  Shield,
  Activity,
  Zap,
  Info,
  Globe,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import apiClient from "../../config/apiConfig";
import { toast } from "react-hot-toast";
import { StatsCard } from "../shared";

const EventDetails = () => {
  const { darkMode } = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [searchAttendee, setSearchAttendee] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/events/${id}`);
        setEvent(response.data.data.event);
      } catch {
        toast.error("Process Error: Failed to fetch event details");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleDelete = async () => {
    try {
      await apiClient.delete(`/events/${id}`);
      toast.success("Event Deleted Successfully");
      navigate("/admin/events");
    } catch {
      toast.error("Action Failed: Could not delete event");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <Activity size={40} className="animate-spin text-emerald-500" />
        <p
          className={`text-[10px] font-black uppercase tracking-[0.3em] ${
            darkMode ? "text-gray-600" : "text-gray-400"
          }`}
        >
          Loading Event Data...
        </p>
      </div>
    );

  if (!event)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
        <XCircle size={60} className="text-gray-800 mb-6" />
        <h3 className="text-2xl font-black tracking-tight text-white mb-4">
          Event Not Found
        </h3>
        <Link
          to="/admin/events"
          className="text-emerald-500 font-black uppercase tracking-widest text-[10px] hover:text-emerald-400 transition-colors"
        >
          Return to Events
        </Link>
      </div>
    );

  const internalStats = [
    {
      label: "Attending",
      value: event.capacity.registered?.toString() || "0",
      subtitle: `Max ${event.capacity.max || "∞"}`,
      icon: Users,
      bgColor: "from-emerald-600 to-emerald-700",
    },
    {
      label: "Actual Attendance",
      value: event.capacity.attended?.toString() || "0",
      subtitle: "Verified Impact",
      icon: CheckCircle,
      bgColor: "from-emerald-500 to-emerald-600",
    },
    {
      label: "Event Format",
      value: event.isOnline ? "Online" : "Physical",
      subtitle: event.location.city || "Ibadan, Nigeria",
      icon: Globe,
      bgColor: "from-blue-500 to-indigo-600",
    },
    {
      label: "Revenue",
      value:
        event.registrationFee?.amount > 0
          ? `${
              event.registrationFee.currency
            } ${event.registrationFee.amount.toLocaleString()}`
          : "Free",
      subtitle: "Contribution",
      icon: Zap,
      bgColor: "from-amber-500 to-orange-600",
    },
  ];

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-8">
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate("/admin/events")}
            className={`p-4 rounded-xl border transition-all ${
              darkMode
                ? "bg-gray-950 border-gray-800 text-gray-400 hover:text-white"
                : "bg-white border-gray-100 text-gray-500 hover:text-gray-950 shadow-lg"
            }`}
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1
              className={`text-3xl lg:text-4xl font-bold tracking-tight ${
                darkMode ? "text-white" : "text-gray-950"
              }`}
            >
              {event.title}
            </h1>
            <div className="flex items-center gap-3 mt-3">
              <div className="w-10 h-1 bg-emerald-500 rounded-full" />
              <span
                className={`text-[11px] font-bold uppercase tracking-widest ${
                  darkMode ? "text-gray-500" : "text-gray-400"
                }`}
              >
                {event.category.replace("_", " ")} • Program Analysis
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link
            to={`/admin/events/${id}/edit`}
            className={`px-6 py-3 rounded-xl border font-bold uppercase tracking-widest text-[10px] flex items-center gap-2 transition-all ${
              darkMode
                ? "bg-gray-900 border-gray-800 text-gray-400 hover:text-white"
                : "bg-white border-gray-100 text-gray-500 hover:text-gray-950 shadow-md"
            }`}
          >
            <Edit size={16} /> Edit Event
          </Link>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="bg-rose-600 hover:bg-rose-700 text-white px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-[10px] flex items-center gap-2 shadow-lg shadow-rose-600/20 active:scale-95 transition-all"
          >
            <Trash2 size={16} /> Delete
          </button>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {internalStats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <StatsCard {...stat} showGradientBg={true} />
          </motion.div>
        ))}
      </div>

      {/* Tab Navigator */}
      <div
        className={`p-2 rounded-2xl border backdrop-blur-md flex gap-2 overflow-x-auto no-scrollbar ${
          darkMode
            ? "bg-gray-950/50 border-gray-800"
            : "bg-white border-gray-100 shadow-xl shadow-gray-200/20"
        }`}
      >
        {["overview", "attendees", "details"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-3 px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-[10px] whitespace-nowrap transition-all ${
              activeTab === tab
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
                : darkMode
                  ? "text-gray-500 hover:text-white"
                  : "text-gray-400 hover:text-gray-950"
            }`}
          >
            {tab === "overview" && <Activity size={14} />}
            {tab === "attendees" && <Users size={14} />}
            {tab === "details" && <Info size={14} />}
            {tab === "overview"
              ? "Program Overview"
              : tab === "attendees"
                ? "Participants"
                : "Logistics & Requirements"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10 items-start">
        <div className="xl:col-span-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className={`p-8 lg:p-10 rounded-2xl border overflow-hidden ${
                darkMode
                  ? "bg-gray-950 border-gray-800 shadow-2xl"
                  : "bg-white border-gray-100 shadow-xl"
              }`}
            >
              {activeTab === "overview" && (
                <div className="space-y-10">
                  {event.images && event.images.length > 0 && (
                    <div className="aspect-video w-full rounded-2xl overflow-hidden border border-gray-800/10 group">
                      <img
                        src={event.images[0].url}
                        className="w-full h-full object-cover transition-all duration-700 hover:scale-105"
                        alt="Event Hero"
                      />
                    </div>
                  )}
                  <div className="space-y-4">
                    <h3
                      className={`text-xl font-bold tracking-tight ${
                        darkMode ? "text-white" : "text-gray-950"
                      }`}
                    >
                      Program Summary
                    </h3>
                    <p
                      className={`text-sm font-medium leading-relaxed ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {event.description}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div
                      className={`p-6 rounded-xl border ${
                        darkMode
                          ? "bg-gray-900/50 border-gray-800"
                          : "bg-gray-50 border-gray-100"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <Calendar size={18} className="text-emerald-500" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                          Scheduled Date
                        </span>
                      </div>
                      <p
                        className={`font-bold text-sm ${
                          darkMode ? "text-white" : "text-gray-950"
                        }`}
                      >
                        {new Date(event.eventDate).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div
                      className={`p-6 rounded-xl border ${
                        darkMode
                          ? "bg-gray-900/50 border-gray-800"
                          : "bg-gray-50 border-gray-100"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <Clock size={18} className="text-emerald-500" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                          Time Schedule
                        </span>
                      </div>
                      <p
                        className={`font-bold text-sm ${
                          darkMode ? "text-white" : "text-gray-950"
                        }`}
                      >
                        {event.eventTime.start} —{" "}
                        {event.eventTime.end || "Completion"}
                      </p>
                    </div>
                    <div
                      className={`md:col-span-2 p-6 rounded-xl border ${
                        darkMode
                          ? "bg-gray-900/50 border-gray-800"
                          : "bg-gray-50 border-gray-100"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <MapPin size={18} className="text-emerald-500" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                          Program Location
                        </span>
                      </div>
                      <p
                        className={`font-bold text-sm ${
                          darkMode ? "text-white" : "text-gray-950"
                        }`}
                      >
                        {event.isOnline
                          ? `Online: ${event.onlineDetails?.meetingLink}`
                          : `${event.location.venue}, ${event.location.city}`}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "attendees" && (
                <div className="space-y-8">
                  <div className="flex flex-col md:flex-row items-center gap-4 justify-between border-b border-gray-100 dark:border-gray-800 pb-8">
                    <div className="relative flex-1 w-full max-w-sm">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search participants..."
                        value={searchAttendee}
                        onChange={(e) => setSearchAttendee(e.target.value)}
                        className={`w-full pl-12 pr-6 py-3 rounded-xl border font-semibold text-sm outline-none transition-all ${
                          darkMode
                            ? "bg-gray-900 border-gray-800 text-white focus:border-emerald-500/50"
                            : "bg-gray-50 border-gray-100 text-gray-950 focus:border-emerald-500/50"
                        }`}
                      />
                    </div>
                    <button className="bg-emerald-600/10 text-emerald-500 hover:bg-emerald-600 hover:text-white px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-[9px] flex items-center gap-2 active:scale-95 transition-all">
                      <Download size={14} /> Export List
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {event.attendees
                      ?.filter((a) =>
                        (a.user?.firstName || a.guestInfo?.firstName || "")
                          .toLowerCase()
                          .includes(searchAttendee.toLowerCase()),
                      )
                      .map((attendee, i) => {
                        const name = attendee.user
                          ? `${attendee.user.firstName} ${attendee.user.lastName}`
                          : `${attendee.guestInfo?.firstName || ""} ${
                              attendee.guestInfo?.lastName || ""
                            }`.trim();
                        return (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className={`p-5 rounded-xl border flex items-center justify-between transition-all ${
                              darkMode
                                ? "bg-gray-900/40 border-gray-800 hover:bg-gray-900"
                                : "bg-gray-50 border-gray-100 hover:bg-white"
                            }`}
                          >
                            <div className="flex items-center gap-4">
                              <div
                                className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white shadow-lg ${
                                  darkMode
                                    ? "bg-gray-800"
                                    : "bg-emerald-100 text-emerald-600"
                                }`}
                              >
                                {name.charAt(0)}
                              </div>
                              <div>
                                <p
                                  className={`font-bold text-sm tracking-tight ${
                                    darkMode ? "text-white" : "text-gray-950"
                                  }`}
                                >
                                  {name || "Anonymous Ally"}
                                </p>
                                <p className="text-[10px] font-medium text-gray-500">
                                  {attendee.user?.email ||
                                    attendee.guestInfo?.email}
                                </p>
                              </div>
                            </div>
                            <span
                              className={`px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest border ${
                                attendee.attended
                                  ? "text-emerald-500 border-emerald-500/20 bg-emerald-500/10"
                                  : "text-gray-400 border-gray-100 dark:border-gray-800 bg-gray-100/50 dark:bg-gray-900/50"
                              }`}
                            >
                              {attendee.attended ? "Verified" : "Pending"}
                            </span>
                          </motion.div>
                        );
                      })}
                  </div>
                </div>
              )}

              {activeTab === "details" && (
                <div className="space-y-10">
                  <div className="space-y-8">
                    <h3
                      className={`text-lg font-bold tracking-tight text-emerald-500`}
                    >
                      Program Details & Requirements
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                      <div className="space-y-4">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-4">
                          Expectations
                        </span>
                        <ul className="space-y-3">
                          {event.requirements?.map((req, i) => (
                            <li
                              key={i}
                              className={`p-4 rounded-xl border flex items-start gap-4 ${
                                darkMode
                                  ? "bg-gray-900 border-gray-800"
                                  : "bg-gray-50 border-gray-100 shadow-sm"
                              }`}
                            >
                              <Shield
                                size={14}
                                className="text-emerald-500 mt-0.5 shrink-0"
                              />
                              <span className="text-xs font-medium text-gray-500 leading-relaxed">
                                {req}
                              </span>
                            </li>
                          )) || (
                            <p className="text-[11px] font-medium text-gray-400 pl-4 italic">
                              No specific requirements listed.
                            </p>
                          )}
                        </ul>
                      </div>
                      <div className="space-y-4">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-4">
                          Community Benefits
                        </span>
                        <ul className="space-y-3">
                          {event.benefits?.map((benefit, i) => (
                            <li
                              key={i}
                              className={`p-4 rounded-xl border flex items-start gap-4 ${
                                darkMode
                                  ? "bg-gray-900 border-gray-800"
                                  : "bg-gray-50 border-gray-100 shadow-sm"
                              }`}
                            >
                              <Zap
                                size={14}
                                className="text-emerald-500 mt-0.5 shrink-0"
                              />
                              <span className="text-xs font-medium text-gray-500 leading-relaxed">
                                {benefit}
                              </span>
                            </li>
                          )) || (
                            <p className="text-[11px] font-medium text-gray-400 pl-4 italic">
                              No benefits highlighted.
                            </p>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`p-6 rounded-2xl border border-gray-100 dark:border-gray-800 grid grid-cols-1 md:grid-cols-2 gap-6 ${
                      darkMode ? "bg-gray-900/30" : "bg-gray-50/50"
                    }`}
                  >
                    <div>
                      <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest block mb-1">
                        Organized By
                      </span>
                      <p
                        className={`font-bold text-sm ${
                          darkMode ? "text-white" : "text-gray-950"
                        }`}
                      >
                        {event.createdBy?.firstName} {event.createdBy?.lastName}
                      </p>
                    </div>
                    <div className="md:text-right">
                      <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest block mb-1">
                        Timeline Metadata
                      </span>
                      <p className="font-medium text-[10px] text-gray-500">
                        Mission Created:{" "}
                        {new Date(event.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="space-y-8">
          <div
            className={`p-8 rounded-2xl border transition-all ${
              darkMode
                ? "bg-gray-950 border-gray-800 shadow-2xl shadow-emerald-500/5"
                : "bg-white border-gray-100 shadow-xl shadow-gray-200/20"
            }`}
          >
            <h3
              className={`text-lg font-bold tracking-tight mb-8 ${
                darkMode ? "text-white" : "text-gray-950"
              }`}
            >
              Mission Intelligence
            </h3>
            <div className="space-y-4">
              {[
                {
                  label: "Media Content",
                  status: event.images?.length > 0 ? "Published" : "Pending",
                  icon: Shield,
                  color:
                    event.images?.length > 0
                      ? "text-emerald-500"
                      : "text-amber-500",
                },
                {
                  label: "Involvement",
                  status: event.attendees?.length > 0 ? "Active" : "Stable",
                  icon: Activity,
                  color:
                    event.attendees?.length > 0
                      ? "text-emerald-500"
                      : "text-gray-500",
                },
                {
                  label: "Visibility",
                  status: event.featured ? "High (Featured)" : "Standard",
                  icon: Zap,
                  color: event.featured ? "text-emerald-500" : "text-gray-400",
                },
              ].map((metric, i) => (
                <div
                  key={i}
                  className={`p-5 rounded-xl border flex items-center justify-between transition-all ${
                    darkMode
                      ? "bg-gray-900/50 border-gray-800 hover:bg-gray-900"
                      : "bg-gray-50 border-gray-100 hover:bg-white"
                  }`}
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                      {metric.label}
                    </span>
                    <span
                      className={`text-[11px] font-bold uppercase tracking-widest ${metric.color}`}
                    >
                      {metric.status}
                    </span>
                  </div>
                  <metric.icon size={16} className={metric.color} />
                </div>
              ))}
            </div>
          </div>

          <div
            className={`p-8 rounded-2xl border overflow-hidden relative transition-all ${
              darkMode
                ? "bg-emerald-950/20 border-emerald-500/30 shadow-2xl"
                : "bg-emerald-50 border-emerald-100 shadow-xl"
            }`}
          >
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl" />
            <h3
              className={`text-lg font-bold tracking-tight mb-3 ${
                darkMode ? "text-white" : "text-gray-950"
              }`}
            >
              Management Actions
            </h3>
            <p className="text-[11px] font-medium text-gray-500 leading-relaxed mb-8">
              Update this event to sync the latest information with the
              community network.
            </p>
            <button
              onClick={() => navigate(`/admin/events/${id}/edit`)}
              className="w-full py-4 rounded-xl bg-emerald-600 text-white font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-emerald-600/20 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              Refine Program Details
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 dark:bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`p-10 rounded-2xl max-w-md w-full border shadow-2xl ${
                darkMode
                  ? "bg-gray-950 border-gray-800"
                  : "bg-white border-gray-100"
              }`}
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 rounded-xl bg-rose-500/10 text-rose-500">
                  <XCircle size={24} />
                </div>
                <div>
                  <h2
                    className={`text-xl font-bold tracking-tight ${
                      darkMode ? "text-white" : "text-gray-950"
                    }`}
                  >
                    Delete Event?
                  </h2>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mt-1">
                    This action is irreversible
                  </p>
                </div>
              </div>
              <p
                className={`text-sm font-medium leading-relaxed mb-10 ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Are you sure you want to delete{" "}
                <span className="font-bold text-emerald-500">
                  "{event.title}"
                </span>
                ? All {event.attendees?.length || 0} registration records will
                be permanently removed.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className={`flex-1 py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all ${
                    darkMode
                      ? "bg-gray-900 text-gray-400 hover:text-white border border-gray-800"
                      : "bg-gray-100 text-gray-500 hover:text-gray-950 shadow-sm"
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 py-4 rounded-xl bg-rose-600 text-white font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-rose-600/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Trash2 size={14} /> Confirm
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EventDetails;
