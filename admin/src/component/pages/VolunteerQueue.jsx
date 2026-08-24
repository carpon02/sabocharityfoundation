import React, { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, CheckCircle, XCircle, Eye, RefreshCw,
  ChevronLeft, ChevronRight, Clock, Briefcase,
  User, Phone, Mail, MapPin, Calendar, AlertCircle, X,
  MoreVertical,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import {
  fetchAllVolunteers, approveVolunteer, rejectVolunteer, setFilters,
  selectVolunteers, selectPagination, selectFilters, selectLoading,
} from "../../features/volunteer/adminVolunteersSlice";
import { toast } from "react-hot-toast";

// ── Data helpers ──────────────────────────────────────────────
const getFullName     = (v) => `${v.personalInfo?.firstName || ""} ${v.personalInfo?.lastName || ""}`.trim() || "—";
const getEmail        = (v) => v.personalInfo?.email || "—";
const getPhone        = (v) => v.personalInfo?.phone || "—";
const getAvailability = (v) => (v.volunteerPreferences?.availability  || "—").replace(/_/g, " ");
const getTimeCommit   = (v) => (v.volunteerPreferences?.timeCommitment || "—").replace(/_/g, " ");
const getStatus       = (v) => v.applicationStatus || "pending";
const getAddress      = (v) => {
  const a = v.personalInfo?.address || {};
  return [a.street, a.city, a.state, a.postalCode, a.country].filter(Boolean).join(", ") || "—";
};

// ── Status badge ──────────────────────────────────────────────
const STATUS_CFG = {
  approved:     { bg: "bg-emerald-100 text-emerald-700", icon: <CheckCircle size={11} />, label: "Approved"    },
  rejected:     { bg: "bg-red-100    text-red-700",      icon: <XCircle     size={11} />, label: "Rejected"    },
  under_review: { bg: "bg-blue-100   text-blue-700",     icon: <Eye         size={11} />, label: "Under Review" },
  on_hold:      { bg: "bg-gray-100   text-gray-600",     icon: <AlertCircle size={11} />, label: "On Hold"     },
};
const StatusBadge = ({ status }) => {
  const cfg = STATUS_CFG[status] || { bg: "bg-amber-100 text-amber-700", icon: <Clock size={11} />, label: "Pending" };
  return (
    <span className={`${cfg.bg} px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 w-fit`}>
      {cfg.icon} {cfg.label}
    </span>
  );
};

// ── DetailBlock ───────────────────────────────────────────────
const DetailBlock = ({ icon, label, value, darkMode }) => (
  <div>
    <h4 className={`text-[10px] font-bold uppercase tracking-widest mb-1 flex items-center gap-1 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
      {icon} {label}
    </h4>
    <p className={`text-sm leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-700"}`}>{value || "—"}</p>
  </div>
);

// ── ConfirmModal ─────────────────────────────────────────────
const ConfirmModal = ({ vol, darkMode, onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className={`w-full max-w-sm rounded-3xl shadow-2xl p-6 ${darkMode ? "bg-dark-lighter border border-gray-800" : "bg-white border border-gray-100"}`}
    >
      {/* Icon */}
      <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-100 mx-auto mb-4">
        <CheckCircle size={28} className="text-emerald-600" />
      </div>
      {/* Copy */}
      <h3 className={`text-lg font-bold text-center mb-1 ${darkMode ? "text-white" : "text-gray-900"}`}>
        Approve {vol.applicationType === "ambassador" ? "Ambassador" : "Volunteer"}?
      </h3>
      <p className={`text-sm text-center mb-6 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
        You're about to approve{" "}
        <span className={`font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>{getFullName(vol)}</span>.
        This will grant them {vol.applicationType === "ambassador" ? "ambassador" : "volunteer"} access.
      </p>
      {/* Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all
            ${darkMode ? "bg-gray-800 text-gray-300 hover:bg-gray-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 py-3 rounded-xl font-semibold text-sm bg-emerald-500 text-white hover:bg-emerald-600 transition-all"
        >
          Yes, Approve
        </button>
      </div>
    </motion.div>
  </div>
);

// ── ActionMenu — floating popup triggered by ⋯ button ─────────
const ActionMenu = ({ vol, darkMode, onView, onApprove, onReject }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const isPending = getStatus(vol) === "pending";

  const items = [
    {
      label: "View Details",
      icon: <Eye size={14} />,
      color: darkMode ? "text-blue-400 hover:bg-blue-900/30" : "text-blue-600 hover:bg-blue-50",
      action: () => { onView(vol); setOpen(false); },
    },
    ...(isPending ? [
      {
        label: "Approve",
        icon: <CheckCircle size={14} />,
        color: darkMode ? "text-emerald-400 hover:bg-emerald-900/30" : "text-emerald-600 hover:bg-emerald-50",
        action: () => { onApprove(vol._id); setOpen(false); },
      },
      {
        label: "Reject",
        icon: <XCircle size={14} />,
        color: darkMode ? "text-red-400 hover:bg-red-900/30" : "text-red-600 hover:bg-red-50",
        action: () => { onReject(vol); setOpen(false); },
      },
    ] : []),
  ];

  return (
    <div ref={ref} className="relative inline-block">
      {/* Trigger button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={`p-2 rounded-xl font-bold transition-all
          ${open
            ? darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-900"
            : darkMode ? "text-gray-400 hover:bg-gray-800 hover:text-white" : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
          }`}
        title="Actions"
      >
        <MoreVertical size={18} />
      </button>

      {/* Floating popup */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -6 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={`absolute right-0 top-full mt-2 z-40 min-w-[160px] rounded-2xl border shadow-2xl overflow-hidden
              ${darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-100"}`}
          >
            {/* Popup header */}
            <div className={`px-4 py-2.5 border-b ${darkMode ? "border-gray-800" : "border-gray-100"}`}>
              <p className={`text-[11px] font-bold uppercase tracking-wider truncate max-w-[130px]
                ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                {getFullName(vol)}
              </p>
            </div>
            {/* Action items */}
            <div className="p-1.5 flex flex-col gap-0.5">
              {items.map((item) => (
                <button
                  key={item.label}
                  onClick={item.action}
                  className={`flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-left transition-all ${item.color}`}
                >
                  {item.icon} {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── Main component ────────────────────────────────────────────
const VolunteerQueue = () => {
  const dispatch     = useDispatch();
  const { darkMode } = useTheme();

  const volunteers = useSelector(selectVolunteers);
  const pagination = useSelector(selectPagination);
  const filters    = useSelector(selectFilters);
  const isLoading  = useSelector(selectLoading);

  const [confirmTarget,      setConfirmTarget]      = useState(null);
  const [localSearch,        setLocalSearch]        = useState(filters.search || "");
  const [activeTab,          setActiveTab]          = useState(filters.applicationType || "");
  const [selectedVol,        setSelectedVol]        = useState(null);
  const [rejectReason,       setRejectReason]       = useState("");
  const [isRejectModalOpen,  setIsRejectModalOpen]  = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== (filters.search || "")) {
        dispatch(setFilters({ search: localSearch, page: 1 }));
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [localSearch, filters.search, dispatch]);

  useEffect(() => {
    dispatch(fetchAllVolunteers(filters));
  }, [dispatch, filters]);

  const handlePageChange = (p) => {
    if (p >= 1 && p <= pagination.pages) dispatch(setFilters({ ...filters, page: p }));
  };

  const handleApprove = useCallback((id) => {
    // Find the volunteer object so the confirm modal can show the name
    const vol = volunteers.find((v) => v._id === id);
    setConfirmTarget(vol || { _id: id });
  }, [volunteers]);

  const confirmApprove = useCallback(async () => {
    const id = confirmTarget._id;
    setConfirmTarget(null);
    try {
      await dispatch(approveVolunteer(id)).unwrap();
      toast.success("Volunteer approved!");
    } catch (err) { toast.error(err || "Failed to approve"); }
  }, [confirmTarget, dispatch]);

  const openRejectModal = useCallback((vol) => {
    setSelectedVol(vol); setRejectReason(""); setIsRejectModalOpen(true);
  }, []);

  const submitReject = async () => {
    if (!rejectReason.trim()) { toast.error("Please provide a reason"); return; }
    try {
      await dispatch(rejectVolunteer({ id: selectedVol._id, reason: rejectReason })).unwrap();
      toast.success("Volunteer rejected.");
      setIsRejectModalOpen(false);
      setSelectedVol(null);
    } catch (err) { toast.error(err || "Failed"); }
  };

  const openDetails = useCallback((vol) => {
    setSelectedVol(vol); setIsDetailsModalOpen(true);
  }, []);

  // Shared style tokens
  const surface = darkMode ? "bg-dark-lighter border-gray-800" : "bg-white border-gray-100 shadow-xl";
  const text     = darkMode ? "text-white" : "text-dark";
  const sub      = darkMode ? "text-gray-400" : "text-gray-600";

  return (
    <div className="space-y-6 px-4 sm:px-0">

      {/* ── Header ── */}
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-1 bg-gradient-to-r from-primary-500 to-primary-300 rounded-full" />
          <span className="text-[11px] font-bold text-primary-600 uppercase tracking-wider">Volunteer Management</span>
        </div>
        <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight ${text}`}>
          Approval <span className="text-primary-500">Queue</span>
        </h1>
        <p className={`text-sm mt-1 max-w-xl ${sub}`}>Review pending applications, manage onboarding, and assign roles.</p>
      </motion.div>

      {/* ── Type Tabs ── */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className={`flex items-center gap-1 p-1.5 rounded-2xl border w-fit ${darkMode ? "bg-gray-900/60 border-gray-800" : "bg-gray-100/80 border-gray-200"}`}>
        {[
          { id: "",            label: "All Applications",  count: null },
          { id: "volunteer",   label: "Volunteers",         count: null },
          { id: "ambassador",  label: "Ambassadors",        count: null },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              dispatch(setFilters({ ...filters, applicationType: tab.id, page: 1 }));
            }}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all
              ${ activeTab === tab.id
                ? darkMode
                  ? "bg-primary-600 text-white shadow-lg"
                  : "bg-white text-primary-600 shadow-md"
                : darkMode
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-500 hover:text-gray-800"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </motion.div>

      {/* ── Filters ── */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className={`p-4 sm:p-6 rounded-2xl border backdrop-blur-sm ${surface}`}>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 pointer-events-none" size={18} />
            <input
              type="text"
              placeholder="Search by name or email…"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className={`w-full pl-11 pr-4 py-3 rounded-xl border-2 outline-none transition-all text-sm font-medium
                ${darkMode ? "bg-gray-800/50 border-gray-700 text-white focus:border-primary-500 placeholder-gray-500"
                           : "bg-gray-50 border-gray-100 focus:border-primary-500 placeholder-gray-400"}`}
            />
          </div>
          <select
            value={filters.status || ""}
            onChange={(e) => dispatch(setFilters({ ...filters, status: e.target.value, page: 1 }))}
            className={`px-4 py-3 rounded-xl border-2 outline-none cursor-pointer text-sm font-semibold
              ${darkMode ? "bg-gray-800/50 border-gray-700 text-white" : "bg-gray-50 border-gray-100 text-gray-700"}`}
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="under_review">Under Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="on_hold">On Hold</option>
          </select>
          <button
            onClick={() => dispatch(fetchAllVolunteers(filters))}
            className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl border-2 font-semibold text-sm transition-all
              ${darkMode ? "bg-gray-800/50 border-gray-700 text-white hover:bg-gray-700"
                         : "bg-white border-gray-200 text-gray-600 hover:text-primary-600 hover:border-primary-200"}`}
          >
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </motion.div>

      {/* ── Content ── */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>

        {/* MOBILE cards */}
        <div className="flex flex-col gap-4 md:hidden">
          {volunteers.length === 0 ? (
            <div className={`rounded-2xl border p-12 text-center ${surface} ${sub}`}>
              {isLoading ? "Loading…" : activeTab === "ambassador" ? "No ambassadors found." : activeTab === "volunteer" ? "No volunteers found." : "No applications found."}
            </div>
          ) : volunteers.map((vol) => (
            <div key={vol._id} className={`rounded-2xl border p-5 ${surface}`}>
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <p className={`font-bold text-base ${text}`}>{getFullName(vol)}</p>
                  <p className={`text-xs mt-0.5 flex items-center gap-1 ${sub}`}><Mail size={11} />{getEmail(vol)}</p>
                  <p className={`text-xs mt-0.5 flex items-center gap-1 ${sub}`}><Phone size={11} />{getPhone(vol)}</p>
                </div>
                {/* Action popup on mobile card */}
                <ActionMenu vol={vol} darkMode={darkMode} onView={openDetails} onApprove={handleApprove} onReject={openRejectModal} />
              </div>
              <div className="grid grid-cols-2 gap-3 mb-3 text-xs">
                <div>
                  <span className={`block font-bold uppercase tracking-wider mb-0.5 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>Availability</span>
                  <span className={`capitalize ${darkMode ? "text-gray-300" : "text-gray-700"}`}>{getAvailability(vol)}</span>
                </div>
                <div>
                  <span className={`block font-bold uppercase tracking-wider mb-0.5 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>Time/Week</span>
                  <span className={darkMode ? "text-gray-300" : "text-gray-700"}>{getTimeCommit(vol)}</span>
                </div>
              </div>
              <StatusBadge status={getStatus(vol)} />
            </div>
          ))}
        </div>

        {/* DESKTOP table */}
        <div className={`hidden md:block rounded-3xl border overflow-hidden ${surface}`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`border-b ${darkMode ? "bg-gray-900/30 border-gray-800" : "bg-gray-50/50 border-gray-100"}`}>
                <tr>
                  {["S/N", "Applicant", "Availability", "Time / Week", "Status", ""].map((h, i) => (
                    <th key={i} className={`px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className={`divide-y ${darkMode ? "divide-gray-800/50" : "divide-gray-100"}`}>
                {volunteers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className={`px-6 py-24 text-center text-sm ${sub}`}>
                      {isLoading ? "Loading…" : activeTab === "ambassador" ? "No ambassadors found." : activeTab === "volunteer" ? "No volunteers found." : "No applications found."}
                    </td>
                  </tr>
                ) : volunteers.map((vol, idx) => {
                  const serialNo = ((pagination?.page ?? 1) - 1) * (pagination?.limit ?? 20) + idx + 1;
                  return (
                  <tr key={vol._id} className={`transition-colors ${darkMode ? "hover:bg-gray-800/30" : "hover:bg-gray-50/60"}`}>
                    {/* S/N */}
                    <td className={`px-6 py-5 text-sm font-bold tabular-nums ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                      {serialNo}
                    </td>
                    <td className="px-6 py-5">
                      <p className={`font-bold text-sm ${text}`}>{getFullName(vol)}</p>
                      <p className={`text-xs mt-0.5 flex items-center gap-1 ${sub}`}><Mail size={10} />{getEmail(vol)}</p>
                      <p className={`text-xs mt-0.5 flex items-center gap-1 ${darkMode ? "text-gray-500" : "text-gray-400"}`}><Phone size={10} />{getPhone(vol)}</p>
                    </td>
                    <td className={`px-6 py-5 text-sm capitalize ${darkMode ? "text-gray-300" : "text-gray-700"}`}>{getAvailability(vol)}</td>
                    <td className={`px-6 py-5 text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>{getTimeCommit(vol)}</td>
                    <td className="px-6 py-5"><StatusBadge status={getStatus(vol)} /></td>
                    {/* Action popup column */}
                    <td className="px-6 py-5 text-right">
                      <ActionMenu vol={vol} darkMode={darkMode} onView={openDetails} onApprove={handleApprove} onReject={openRejectModal} />
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* ══ Approve Confirm Modal ══ */}
      <AnimatePresence>
        {confirmTarget && (
          <ConfirmModal
            vol={confirmTarget}
            darkMode={darkMode}
            onConfirm={confirmApprove}
            onCancel={() => setConfirmTarget(null)}
          />
        )}
      </AnimatePresence>

      {/* ── Pagination ── */}
      {pagination?.pages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className={`text-sm font-semibold ${sub}`}>Page {pagination.page} of {pagination.pages} · {pagination.total} total</p>
          <div className="flex items-center gap-2">
            <button onClick={() => handlePageChange(pagination.page - 1)} disabled={pagination.page === 1}
              className={`p-2.5 rounded-xl border transition-all disabled:opacity-40 ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-700"}`}>
              <ChevronLeft size={18} />
            </button>
            <button onClick={() => handlePageChange(pagination.page + 1)} disabled={pagination.page === pagination.pages}
              className={`p-2.5 rounded-xl border transition-all disabled:opacity-40 ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-700"}`}>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* ══ Reject Modal ══ */}
      <AnimatePresence>
        {isRejectModalOpen && selectedVol && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 60 }}
              className={`w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl shadow-2xl p-6 ${darkMode ? "bg-dark-lighter" : "bg-white"}`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-bold ${text}`}>Reject Volunteer</h3>
                <button onClick={() => setIsRejectModalOpen(false)} className={`p-2 rounded-lg ${darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"}`}>
                  <X size={18} className={sub} />
                </button>
              </div>
              <p className={`text-sm mb-4 ${sub}`}>
                Provide a reason for rejecting <strong className={text}>{getFullName(selectedVol)}</strong>'s application.
              </p>
              <textarea
                value={rejectReason} onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Reason for rejection…" rows={4}
                className={`w-full p-4 rounded-xl border-2 outline-none resize-none mb-4 text-sm
                  ${darkMode ? "bg-gray-800/50 border-gray-700 text-white placeholder-gray-500 focus:border-red-500"
                             : "bg-gray-50 border-gray-200 focus:border-red-400"}`}
              />
              <div className="flex gap-3">
                <button onClick={() => setIsRejectModalOpen(false)}
                  className={`flex-1 py-3 rounded-xl font-semibold text-sm ${darkMode ? "bg-gray-800 text-gray-300 hover:bg-gray-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                  Cancel
                </button>
                <button onClick={submitReject} className="flex-1 py-3 rounded-xl font-semibold text-sm bg-red-500 text-white hover:bg-red-600">
                  Reject
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ══ Details Modal ══ */}
      <AnimatePresence>
        {isDetailsModalOpen && selectedVol && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 60 }}
              className={`w-full sm:max-w-2xl rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 sm:my-8 ${darkMode ? "bg-dark-lighter" : "bg-white"}`}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1 min-w-0 pr-4">
                  <h3 className={`text-xl sm:text-2xl font-bold truncate ${text}`}>{getFullName(selectedVol)}</h3>
                  <div className={`flex flex-wrap gap-3 mt-1 text-xs ${sub}`}>
                    <span className="flex items-center gap-1"><Mail size={12} />{getEmail(selectedVol)}</span>
                    <span className="flex items-center gap-1"><Phone size={12} />{getPhone(selectedVol)}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <StatusBadge status={getStatus(selectedVol)} />
                  <button onClick={() => setIsDetailsModalOpen(false)} className={`p-2 rounded-lg ${darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"}`}>
                    <X size={18} className={sub} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
                <DetailBlock icon={<MapPin size={12} />}   label="Address"      value={getAddress(selectedVol)}    darkMode={darkMode} />
                <DetailBlock icon={<Calendar size={12} />} label="Availability" value={`${getAvailability(selectedVol)} · ${getTimeCommit(selectedVol)}`} darkMode={darkMode} />
                {selectedVol.professionalInfo?.occupation && (
                  <DetailBlock icon={<Briefcase size={12} />} label="Occupation"
                    value={`${selectedVol.professionalInfo.occupation}${selectedVol.professionalInfo.employer ? ` at ${selectedVol.professionalInfo.employer}` : ""}`}
                    darkMode={darkMode} />
                )}
                {selectedVol.emergencyContact?.name && (
                  <DetailBlock icon={<User size={12} />} label="Emergency Contact"
                    value={`${selectedVol.emergencyContact.name} · ${selectedVol.emergencyContact.phone || "—"}`}
                    darkMode={darkMode} />
                )}
              </div>

              {selectedVol.motivation && (
                <div className="mb-6">
                  <h4 className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>Motivation</h4>
                  <p className={`p-4 rounded-xl text-sm leading-relaxed ${darkMode ? "bg-gray-800 text-gray-300" : "bg-gray-50 text-gray-700"}`}>
                    {selectedVol.motivation}
                  </p>
                </div>
              )}

              {selectedVol.volunteerPreferences?.preferredAreas?.length > 0 && (
                <div className="mb-6">
                  <h4 className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>Preferred Areas</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedVol.volunteerPreferences.preferredAreas.map((area) => (
                      <span key={area} className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${darkMode ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-700"}`}>
                        {area.replace(/_/g, " ")}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4 border-t ${darkMode ? "border-gray-800" : "border-gray-100"}`}>
                {getStatus(selectedVol) === "pending" && (
                  <>
                    <button onClick={() => { setIsDetailsModalOpen(false); handleApprove(selectedVol._id); }}
                      className="flex-1 py-3 rounded-xl font-semibold text-sm bg-emerald-500 text-white hover:bg-emerald-600 transition-all">
                      ✓ Approve
                    </button>
                    <button onClick={() => { setIsDetailsModalOpen(false); openRejectModal(selectedVol); }}
                      className="flex-1 py-3 rounded-xl font-semibold text-sm bg-red-500 text-white hover:bg-red-600 transition-all">
                      ✗ Reject
                    </button>
                  </>
                )}
                <button onClick={() => setIsDetailsModalOpen(false)}
                  className={`flex-1 sm:flex-none sm:ml-auto px-8 py-3 rounded-xl font-semibold text-sm transition-all
                    ${darkMode ? "bg-gray-800 text-gray-300 hover:bg-gray-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VolunteerQueue;
