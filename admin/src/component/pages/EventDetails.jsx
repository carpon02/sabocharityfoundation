// admin/src/component/pages/EventDetails.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar, MapPin, Clock, Users, Edit, Trash2, ArrowLeft,
  CheckCircle, XCircle, Download, Search, Shield, Activity,
  Zap, Info, Globe, AlertCircle,
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
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/events/${id}`);
        setEvent(response.data.data.event);
      } catch {
        toast.error("Failed to fetch event details");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await apiClient.delete(`/events/${id}`);
      toast.success("Event deleted successfully");
      navigate("/admin/events");
    } catch {
      toast.error("Could not delete event");
    } finally {
      setDeleting(false);
    }
  };

  const cardBase  = `rounded-xl border ${darkMode ? "bg-dark-lighter border-gray-800/70" : "bg-white border-gray-200/80 shadow-sm"}`;
  const innerCard = `rounded-xl border ${darkMode ? "bg-gray-900/60 border-gray-800" : "bg-gray-50 border-gray-100"}`;

  const SectionLabel = ({ children }) => (
    <p className={`text-[10px] font-bold uppercase tracking-widest mb-3 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
      {children}
    </p>
  );
  const Divider = () => <div className={`my-5 border-t ${darkMode ? "border-gray-800" : "border-gray-100"}`} />;

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <div className={`w-10 h-10 rounded-full border-4 border-t-primary-500 animate-spin ${darkMode ? "border-gray-800" : "border-gray-200"}`} />
        <p className={`text-xs font-semibold ${darkMode ? "text-gray-500" : "text-gray-400"}`}>Loading event…</p>
      </div>
    );

  if (!event)
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4 text-center">
        <XCircle size={44} className={darkMode ? "text-gray-700" : "text-gray-300"} />
        <p className={`text-sm font-semibold ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Event not found</p>
        <Link to="/admin/events" className="text-xs text-primary-500 hover:underline flex items-center gap-1">
          <ArrowLeft size={13} /> Back to Events
        </Link>
      </div>
    );

  const registered  = event.capacity?.registered || 0;
  const maxCapacity = event.capacity?.max || 0;
  const attended    = event.capacity?.attended || 0;
  const capPct      = maxCapacity > 0 ? Math.min((registered / maxCapacity) * 100, 100) : 0;
  const isFull      = maxCapacity > 0 && registered >= maxCapacity;
  const isFree      = !event.registrationFee?.amount || event.registrationFee.amount === 0;

  const getStatusConfig = (s) => {
    const map = {
      draft:     { label: "Draft",     color: "text-gray-500",    bg: "bg-gray-100 dark:bg-gray-800",         icon: AlertCircle },
      published: { label: "Published", color: "text-primary-600", bg: "bg-primary-50 dark:bg-primary-950/30", icon: CheckCircle },
      ongoing:   { label: "Ongoing",   color: "text-amber-600",   bg: "bg-amber-50 dark:bg-amber-950/30",     icon: Activity },
      completed: { label: "Completed", color: "text-green-600",   bg: "bg-green-50 dark:bg-green-950/30",     icon: CheckCircle },
      cancelled: { label: "Cancelled", color: "text-red-600",     bg: "bg-red-50 dark:bg-red-950/30",         icon: XCircle },
    };
    return map[s] || map.draft;
  };
  const statusCfg  = getStatusConfig(event.status);
  const StatusIcon = statusCfg.icon;

  const internalStats = [
    { label: "Registered", value: registered.toString(), subtitle: `of ${maxCapacity || "∞"} max`, icon: Users,       bgColor: "from-primary-600 to-primary-700" },
    { label: "Attended",   value: attended.toString(),   subtitle: "Verified attendees",           icon: CheckCircle, bgColor: "from-emerald-500 to-emerald-600" },
    { label: "Format",     value: event.isOnline ? "Online" : "Physical", subtitle: event.location?.city || "Ibadan", icon: Globe, bgColor: "from-blue-500 to-indigo-600" },
    { label: "Entry",      value: isFree ? "Free" : `${event.registrationFee?.currency || "NGN"} ${(event.registrationFee?.amount || 0).toLocaleString()}`, subtitle: "Registration", icon: Zap, bgColor: "from-amber-500 to-orange-600" },
  ];

  const tabs = [
    { id: "overview",  label: "Overview",  icon: Activity },
    { id: "attendees", label: "Attendees", icon: Users },
    { id: "details",   label: "Details",   icon: Info },
  ];

  const filteredAttendees = (event.attendees || []).filter((a) => {
    const name = a.user
      ? `${a.user.firstName} ${a.user.lastName}`
      : `${a.guestInfo?.firstName || ""} ${a.guestInfo?.lastName || ""}`.trim();
    return (
      name.toLowerCase().includes(searchAttendee.toLowerCase()) ||
      (a.user?.email || a.guestInfo?.email || "").toLowerCase().includes(searchAttendee.toLowerCase())
    );
  });

  return (
    <div className="space-y-6 pb-16">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/admin/events")}
            className={`p-2 rounded-lg border transition-all ${darkMode ? "border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800" : "border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-100 shadow-sm"}`}
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className={`text-xl font-semibold leading-snug ${darkMode ? "text-white" : "text-gray-900"}`}>{event.title}</h1>
            <p className={`text-xs mt-0.5 capitalize ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              {event.category?.replace(/_/g, " ")} · {event._id?.slice(-8)?.toUpperCase()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${statusCfg.bg} ${statusCfg.color}`}>
            <StatusIcon size={12} /> {statusCfg.label}
          </span>
          <Link
            to={`/admin/events/${id}/edit`}
            className={`px-3 py-2 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-all ${darkMode ? "border-gray-700 text-gray-300 hover:bg-gray-800" : "border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm"}`}
          >
            <Edit size={13} /> Edit
          </Link>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-3 py-2 rounded-lg text-xs font-medium bg-red-600 hover:bg-red-700 text-white flex items-center gap-1.5 transition-all"
          >
            <Trash2 size={13} /> Delete
          </button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {internalStats.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
            <StatsCard {...s} index={i} />
          </motion.div>
        ))}
      </div>

      {/* ── Tabs ── */}
      <div className={`flex gap-1 p-1 rounded-xl border ${darkMode ? "bg-gray-900/50 border-gray-800" : "bg-gray-50 border-gray-200 shadow-sm"}`}>
        {tabs.map(({ id: tabId, label, icon: Icon }) => (
          <button
            key={tabId}
            onClick={() => setActiveTab(tabId)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all flex-1 justify-center ${
              activeTab === tabId ? "bg-primary-500 text-white shadow-sm" : darkMode ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-800"
            }`}
          >
            <Icon size={13} /> {label}
          </button>
        ))}
      </div>

      {/* ── Content grid ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">

        {/* Main panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className={`xl:col-span-2 ${cardBase} p-6`}
          >

            {/* OVERVIEW */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {(event.images?.length > 0 || event.coverImage) && (
                  <div className="aspect-video w-full rounded-xl overflow-hidden">
                    <img src={event.images?.[0]?.url || event.coverImage} className="w-full h-full object-cover" alt={event.title} />
                  </div>
                )}
                {event.description && (
                  <div>
                    <SectionLabel>About</SectionLabel>
                    <p className={`text-sm leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-600"}`}>{event.description}</p>
                  </div>
                )}
                <Divider />
                <SectionLabel>Schedule & Location</SectionLabel>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className={`p-4 rounded-xl border ${innerCard}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar size={14} className="text-primary-500" />
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${darkMode ? "text-gray-500" : "text-gray-400"}`}>Date</span>
                    </div>
                    <p className={`text-sm font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                      {new Date(event.eventDate).toLocaleDateString("en-NG", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                    </p>
                  </div>
                  <div className={`p-4 rounded-xl border ${innerCard}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Clock size={14} className="text-primary-500" />
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${darkMode ? "text-gray-500" : "text-gray-400"}`}>Time</span>
                    </div>
                    <p className={`text-sm font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                      {event.eventTime?.start || "TBA"}{event.eventTime?.end ? ` – ${event.eventTime.end}` : ""}
                    </p>
                  </div>
                  <div className={`sm:col-span-2 p-4 rounded-xl border ${innerCard}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin size={14} className="text-primary-500" />
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${darkMode ? "text-gray-500" : "text-gray-400"}`}>Location</span>
                    </div>
                    <p className={`text-sm font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                      {event.isOnline
                        ? `Online${event.onlineDetails?.meetingLink ? ` · ${event.onlineDetails.meetingLink}` : ""}`
                        : [event.location?.venue, event.location?.address, event.location?.city].filter(Boolean).join(", ") || "TBA"}
                    </p>
                  </div>
                </div>
                {maxCapacity > 0 && (
                  <>
                    <Divider />
                    <SectionLabel>Capacity</SectionLabel>
                    <div className={`p-4 rounded-xl border ${innerCard}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-sm font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                          {registered} <span className={`font-normal text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>registered</span>
                        </span>
                        <span className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{maxCapacity} max</span>
                      </div>
                      <div className={`w-full rounded-full h-2 ${darkMode ? "bg-gray-800" : "bg-gray-200"}`}>
                        <div
                          className={`h-2 rounded-full transition-all ${capPct >= 90 ? "bg-red-500" : capPct >= 60 ? "bg-amber-500" : "bg-emerald-500"}`}
                          style={{ width: `${capPct}%` }}
                        />
                      </div>
                      {isFull && <p className="text-xs text-red-500 mt-2 font-medium">This event is fully booked.</p>}
                    </div>
                  </>
                )}
                {event.tags?.length > 0 && (
                  <>
                    <Divider />
                    <SectionLabel>Tags</SectionLabel>
                    <div className="flex flex-wrap gap-1.5">
                      {event.tags.map((tag) => (
                        <span key={tag} className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${darkMode ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-600"}`}>
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* ATTENDEES */}
            {activeTab === "attendees" && (
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <Search size={14} className={`absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? "text-gray-500" : "text-gray-400"}`} />
                    <input
                      type="text"
                      placeholder="Search attendees…"
                      value={searchAttendee}
                      onChange={(e) => setSearchAttendee(e.target.value)}
                      className={`w-full pl-9 pr-4 py-2 rounded-lg border text-sm outline-none transition-all ${darkMode ? "bg-gray-800/60 border-gray-700 text-white placeholder-gray-500 focus:border-primary-500/50" : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-primary-400"}`}
                    />
                  </div>
                  <button className={`px-3 py-2 rounded-lg border text-xs font-medium flex items-center gap-1.5 flex-shrink-0 ${darkMode ? "border-gray-700 text-gray-300 hover:bg-gray-800" : "border-gray-200 text-gray-700 hover:bg-gray-50"}`}>
                    <Download size={13} /> Export
                  </button>
                </div>
                {filteredAttendees.length === 0 ? (
                  <div className={`py-16 text-center rounded-xl border ${darkMode ? "border-gray-800 bg-gray-900/40" : "border-gray-100 bg-gray-50"}`}>
                    <Users size={32} className={`mx-auto mb-3 ${darkMode ? "text-gray-700" : "text-gray-300"}`} />
                    <p className={`text-sm ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                      {searchAttendee ? "No attendees match your search" : "No attendees yet"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredAttendees.map((attendee, i) => {
                      const name = attendee.user
                        ? `${attendee.user.firstName} ${attendee.user.lastName}`
                        : `${attendee.guestInfo?.firstName || ""} ${attendee.guestInfo?.lastName || ""}`.trim() || "Guest";
                      const email = attendee.user?.email || attendee.guestInfo?.email || "";
                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.03 }}
                          className={`flex items-center justify-between gap-3 p-3.5 rounded-xl border transition-all ${darkMode ? "bg-gray-900/40 border-gray-800 hover:bg-gray-900" : "bg-gray-50 border-gray-100 hover:bg-white"}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 ${darkMode ? "bg-primary-950/50 text-primary-300" : "bg-primary-100 text-primary-700"}`}>
                              {name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className={`text-sm font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>{name}</p>
                              <p className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>{email || "—"}</p>
                            </div>
                          </div>
                          <span className={`flex-shrink-0 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${
                            attendee.attended
                              ? (darkMode ? "bg-emerald-950/50 text-emerald-400" : "bg-emerald-50 text-emerald-700")
                              : (darkMode ? "bg-gray-800 text-gray-500" : "bg-gray-100 text-gray-500")
                          }`}>
                            {attendee.attended ? "Attended" : "Registered"}
                          </span>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* DETAILS */}
            {activeTab === "details" && (
              <div className="space-y-6">
                <div>
                  <SectionLabel>Requirements</SectionLabel>
                  {event.requirements?.length > 0 ? (
                    <ul className="space-y-2">
                      {event.requirements.map((req, i) => (
                        <li key={i} className={`flex items-start gap-3 p-3.5 rounded-xl border ${innerCard}`}>
                          <Shield size={13} className="text-primary-500 mt-0.5 shrink-0" />
                          <span className={`text-xs leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-600"}`}>{req}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className={`text-xs italic ${darkMode ? "text-gray-600" : "text-gray-400"}`}>No specific requirements listed.</p>
                  )}
                </div>
                <Divider />
                <div>
                  <SectionLabel>Benefits</SectionLabel>
                  {event.benefits?.length > 0 ? (
                    <ul className="space-y-2">
                      {event.benefits.map((b, i) => (
                        <li key={i} className={`flex items-start gap-3 p-3.5 rounded-xl border ${innerCard}`}>
                          <Zap size={13} className="text-amber-500 mt-0.5 shrink-0" />
                          <span className={`text-xs leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-600"}`}>{b}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className={`text-xs italic ${darkMode ? "text-gray-600" : "text-gray-400"}`}>No benefits listed.</p>
                  )}
                </div>
                <Divider />
                <div className={`divide-y rounded-xl overflow-hidden ${darkMode ? "divide-gray-800 bg-gray-900/60 border border-gray-800" : "divide-gray-100 bg-gray-50 border border-gray-100"}`}>
                  {[
                    { label: "Organizer",    value: event.createdBy ? `${event.createdBy.firstName} ${event.createdBy.lastName}` : "—" },
                    { label: "Created",      value: new Date(event.createdAt).toLocaleDateString("en-NG", { year: "numeric", month: "long", day: "numeric" }) },
                    { label: "Featured",     value: event.featured ? "Yes" : "No" },
                    { label: "Registration", value: isFree ? "Free" : `${event.registrationFee?.currency || "NGN"} ${(event.registrationFee?.amount || 0).toLocaleString()}` },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between px-4 py-3">
                      <span className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{label}</span>
                      <span className={`text-xs font-medium ${darkMode ? "text-gray-200" : "text-gray-800"}`}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* ── Sidebar ── */}
        <div className="space-y-4">
          <div className={`${cardBase} p-5`}>
            <SectionLabel>Quick Facts</SectionLabel>
            <div className={`divide-y rounded-xl overflow-hidden ${darkMode ? "divide-gray-800 bg-gray-900/60 border border-gray-800" : "divide-gray-100 bg-gray-50 border border-gray-100"}`}>
              {[
                { icon: Calendar, label: "Date",     value: new Date(event.eventDate).toLocaleDateString("en-NG", { month: "short", day: "numeric", year: "numeric" }) },
                { icon: Clock,    label: "Time",     value: event.eventTime?.start || "TBA" },
                { icon: MapPin,   label: "Location", value: event.isOnline ? "Online" : event.location?.city || "TBA" },
                { icon: Users,    label: "Capacity", value: maxCapacity > 0 ? `${registered}/${maxCapacity}` : `${registered} registered` },
                { icon: Globe,    label: "Format",   value: event.isOnline ? "Online" : "In-person" },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3 px-4 py-3">
                  <Icon size={13} className={darkMode ? "text-gray-500" : "text-gray-400"} />
                  <span className={`text-xs flex-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{label}</span>
                  <span className={`text-xs font-medium ${darkMode ? "text-gray-200" : "text-gray-800"}`}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={`${cardBase} p-5`}>
            <SectionLabel>Status</SectionLabel>
            <div className="space-y-2">
              {[
                { label: "Media",     stat: (event.images?.length || 0) > 0 || event.coverImage ? "Published" : "Missing",                   ok: (event.images?.length || 0) > 0 || !!event.coverImage },
                { label: "Attendees", stat: (event.attendees?.length || 0) > 0 ? `${event.attendees.length} registered` : "None yet",        ok: (event.attendees?.length || 0) > 0 },
                { label: "Featured",  stat: event.featured ? "Featured" : "Standard",                                                         ok: !!event.featured },
                { label: "Status",    stat: statusCfg.label,                                                                                  ok: ["published", "ongoing", "completed"].includes(event.status) },
              ].map(({ label, stat, ok }) => (
                <div key={label} className={`flex items-center justify-between px-3 py-2.5 rounded-lg ${darkMode ? "bg-gray-900/60" : "bg-gray-50"}`}>
                  <span className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{label}</span>
                  <span className={`text-xs font-semibold ${ok ? "text-emerald-600" : darkMode ? "text-gray-500" : "text-gray-400"}`}>{stat}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={`${cardBase} p-5`}>
            <SectionLabel>Actions</SectionLabel>
            <div className="space-y-2">
              <Link
                to={`/admin/events/${id}/edit`}
                className={`w-full py-2.5 rounded-lg text-sm font-semibold border flex items-center justify-center gap-2 transition-all ${darkMode ? "border-gray-700 text-gray-300 hover:bg-gray-800" : "border-gray-200 text-gray-700 hover:bg-gray-50"}`}
              >
                <Edit size={14} /> Edit Event
              </Link>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="w-full py-2.5 rounded-lg text-sm font-semibold bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-2 transition-all"
              >
                <Trash2 size={14} /> Delete Event
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Delete Modal ── */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              className={`w-full max-w-sm rounded-xl border shadow-xl p-6 ${darkMode ? "bg-[#111] border-gray-800" : "bg-white border-gray-200"}`}
            >
              <div className="flex items-start gap-3 mb-5">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${darkMode ? "bg-red-950/30" : "bg-red-50"}`}>
                  <Trash2 size={18} className="text-red-600" />
                </div>
                <div>
                  <h3 className={`text-sm font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>Delete Event?</h3>
                  <p className={`text-xs mt-0.5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                    Permanently removes <span className="font-semibold text-red-500">"{event.title}"</span> and all {event.attendees?.length || 0} registrations.
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleting}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-all ${darkMode ? "border-gray-700 text-gray-300 hover:bg-gray-800" : "border-gray-200 text-gray-700 hover:bg-gray-50"}`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 py-2.5 rounded-lg text-sm font-medium bg-red-600 hover:bg-red-700 text-white transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  {deleting
                    ? <><span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Deleting…</>
                    : <><Trash2 size={13} /> Delete</>}
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
