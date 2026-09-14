// admin/src/component/pages/VolunteerQueue.jsx — Clerk-Style UI
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

// ── Data helpers ──────────────────────────────────────────────────────────
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

// ── Status badge ──────────────────────────────────────────────────────────
const STATUS_CFG = {
  approved:     { bg: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400", icon: <CheckCircle size={11} />, label: "Approved"    },
  rejected:     { bg: "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400",                 icon: <XCircle     size={11} />, label: "Rejected"    },
  under_review: { bg: "bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400",             icon: <Eye         size={11} />, label: "Under Review" },
  on_hold:      { bg: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",               icon: <AlertCircle size={11} />, label: "On Hold"     },
};
const StatusBadge = ({ status }) => {
  const cfg = STATUS_CFG[status] || { bg: "bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400", icon: <Clock size={11} />, label: "Pending" };
  return (
    <span className={`${cfg.bg} px-2.5 py-1 rounded-full text-[11px] font-medium flex items-center gap-1 w-fit`}>
      {cfg.icon} {cfg.label}
    </span>
  );
};

// ── Detail row ────────────────────────────────────────────────────────────
const DetailBlock = ({ icon, label, value, darkMode }) => (
  <div>
    <h4 className={`text-[10px] font-semibold uppercase tracking-wider mb-1 flex items-center gap-1 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
      {icon} {label}
    </h4>
    <p className={`text-sm leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-700"}`}>{value || "—"}</p>
  </div>
);

// ── Approve confirm modal ─────────────────────────────────────────────────
const ConfirmModal = ({ vol, darkMode, onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.15 }}
      className={`w-full max-w-sm rounded-xl border shadow-xl p-6 ${darkMode ? "bg-[#111] border-gray-800" : "bg-white border-gray-200"}`}
    >
      <div className={`flex items-start gap-3 mb-5`}>
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${darkMode ? "bg-emerald-950/30" : "bg-emerald-50"}`}>
          <CheckCircle size={18} className="text-emerald-600" />
        </div>
        <div>
          <h3 className={`text-sm font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
            Approve {vol.applicationType === "ambassador" ? "Ambassador" : "Volunteer"}?
          </h3>
          <p className={`text-xs mt-0.5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            You're about to approve <span className={`font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>{getFullName(vol)}</span>.
            This grants them {vol.applicationType === "ambassador" ? "ambassador" : "volunteer"} access.
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={onCancel} className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${darkMode ? "border-gray-700 text-gray-300 hover:bg-gray-800" : "border-gray-200 text-gray-700 hover:bg-gray-50"}`}>
          Cancel
        </button>
        <button onClick={onConfirm} className="flex-1 py-2 rounded-lg text-sm font-medium bg-emerald-500 hover:bg-emerald-600 text-white transition-all">
          Yes, Approve
        </button>
      </div>
    </motion.div>
  </div>
);

// ── Inline action menu ────────────────────────────────────────────────────
const ActionMenu = ({ vol, darkMode, onView, onApprove, onReject }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);

  const isPending = getStatus(vol) === "pending";

  const items = [
    { label: "View Details", icon: <Eye size={13} />,         cls: darkMode ? "text-blue-400 hover:bg-blue-900/20" : "text-blue-600 hover:bg-blue-50", action: () => { onView(vol); setOpen(false); } },
    ...(isPending ? [
      { label: "Approve",    icon: <CheckCircle size={13} />, cls: darkMode ? "text-emerald-400 hover:bg-emerald-900/20" : "text-emerald-600 hover:bg-emerald-50", action: () => { onApprove(vol._id); setOpen(false); } },
      { label: "Reject",     icon: <XCircle size={13} />,     cls: darkMode ? "text-red-400 hover:bg-red-900/20" : "text-red-600 hover:bg-red-50", action: () => { onReject(vol); setOpen(false); } },
    ] : []),
  ];

  return (
    <div ref={ref} className="relative inline-block">
      <button
        onClick={() => setOpen((p) => !p)}
        className={`p-1.5 rounded-lg transition-all ${open ? darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-900" : darkMode ? "text-gray-400 hover:bg-gray-800 hover:text-white" : "text-gray-400 hover:bg-gray-100 hover:text-gray-700"}`}
      >
        <MoreVertical size={15} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.12 }}
            className={`absolute right-0 top-full mt-1.5 z-40 min-w-[150px] rounded-xl border shadow-lg overflow-hidden ${darkMode ? "bg-gray-900 border-gray-700/60" : "bg-white border-gray-200"}`}
          >
            <div className={`px-3 py-2 border-b ${darkMode ? "border-gray-800" : "border-gray-100"}`}>
              <p className={`text-[10px] font-semibold uppercase tracking-wider truncate ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                {getFullName(vol)}
              </p>
            </div>
            <div className="p-1">
              {items.map((item) => (
                <button
                  key={item.label}
                  onClick={item.action}
                  className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium text-left transition-all ${item.cls}`}
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

// ── Main component ────────────────────────────────────────────────────────
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

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== (filters.search || "")) {
        dispatch(setFilters({ search: localSearch, page: 1 }));
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [localSearch, filters.search, dispatch]);

  useEffect(() => { dispatch(fetchAllVolunteers(filters)); }, [dispatch, filters]);

  const handlePageChange = (p) => {
    if (p >= 1 && p <= pagination.pages) dispatch(setFilters({ ...filters, page: p }));
  };

  const handleApprove = useCallback((id) => {
    const vol = volunteers.find((v) => v._id === id);
    setConfirmTarget(vol || { _id: id });
  }, [volunteers]);

  const confirmApprove = useCallback(async () => {
    const id = confirmTarget._id;
    setConfirmTarget(null);
    try { await dispatch(approveVolunteer(id)).unwrap(); toast.success("Volunteer approved!"); }
    catch (err) { toast.error(err || "Failed to approve"); }
  }, [confirmTarget, dispatch]);

  const openRejectModal = useCallback((vol) => {
    setSelectedVol(vol); setRejectReason(""); setIsRejectModalOpen(true);
  }, []);

  const submitReject = async () => {
    if (!rejectReason.trim()) { toast.error("Please provide a reason"); return; }
    try {
      await dispatch(rejectVolunteer({ id: selectedVol._id, reason: rejectReason })).unwrap();
      toast.success("Volunteer rejected.");
      setIsRejectModalOpen(false); setSelectedVol(null);
    } catch (err) { toast.error(err || "Failed"); }
  };

  const openDetails = useCallback((vol) => { setSelectedVol(vol); setIsDetailsModalOpen(true); }, []);

  // ── Shared style tokens ─────────────────────────────────────────────────
  const cardBase  = `rounded-xl border ${darkMode ? "bg-dark-lighter border-gray-800/70" : "bg-white border-gray-200/80 shadow-sm"}`;
  const modalBase = `rounded-xl border shadow-xl ${darkMode ? "bg-[#111] border-gray-800" : "bg-white border-gray-200"}`;
  const inputCls  = `px-3 py-2 rounded-lg border text-sm outline-none transition-all ${darkMode ? "bg-gray-800/60 border-gray-700/60 text-white placeholder-gray-500 focus:border-primary-500/50" : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-primary-400"}`;

  return (
    <div className="space-y-6 pb-10">

      {/* ── Header ───────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-xl font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>Volunteers</h1>
          <p className={`text-sm mt-0.5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            {pagination?.total || 0} total applications
          </p>
        </div>
        <button
          onClick={() => dispatch(fetchAllVolunteers(filters))}
          className={`p-2 rounded-lg border text-sm transition-all ${darkMode ? "bg-dark-lighter border-gray-800 text-gray-400 hover:text-white" : "bg-white border-gray-200 text-gray-600 hover:text-gray-900 shadow-sm"}`}
          title="Refresh"
        >
          <RefreshCw size={15} className={isLoading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* ── Type Tabs ────────────────────────────────────────────────── */}
      <div className={`flex items-center gap-1 p-1 rounded-lg border w-fit ${darkMode ? "bg-gray-900/60 border-gray-800" : "bg-gray-100 border-gray-200"}`}>
        {[
          { id: "",           label: "All" },
          { id: "volunteer",  label: "Volunteers" },
          { id: "ambassador", label: "Ambassadors" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); dispatch(setFilters({ ...filters, applicationType: tab.id, page: 1 })); }}
            className={`px-3.5 py-1.5 rounded-md text-sm font-medium transition-all ${
              activeTab === tab.id
                ? darkMode ? "bg-primary-600 text-white shadow" : "bg-white text-primary-600 shadow-sm"
                : darkMode ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Filters ──────────────────────────────────────────────────── */}
      <div className={`${cardBase} p-4 flex flex-col sm:flex-row gap-3`}>
        <div className="relative flex-1">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? "text-gray-500" : "text-gray-400"}`} size={15} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className={`${inputCls} w-full pl-9`}
          />
        </div>
        <select
          value={filters.status || ""}
          onChange={(e) => dispatch(setFilters({ ...filters, status: e.target.value, page: 1 }))}
          className={inputCls}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="under_review">Under Review</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="on_hold">On Hold</option>
        </select>
      </div>

      {/* ── Mobile cards ─────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 md:hidden">
        {volunteers.length === 0 ? (
          <div className={`${cardBase} p-12 text-center text-sm ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
            {isLoading ? "Loading…" : "No applications found."}
          </div>
        ) : volunteers.map((vol) => (
          <div key={vol._id} className={`${cardBase} p-4`}>
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <p className={`font-semibold text-sm ${darkMode ? "text-white" : "text-gray-900"}`}>{getFullName(vol)}</p>
                <p className={`text-xs mt-0.5 flex items-center gap-1 ${darkMode ? "text-gray-500" : "text-gray-400"}`}><Mail size={10} />{getEmail(vol)}</p>
                <p className={`text-xs mt-0.5 flex items-center gap-1 ${darkMode ? "text-gray-500" : "text-gray-400"}`}><Phone size={10} />{getPhone(vol)}</p>
              </div>
              <ActionMenu vol={vol} darkMode={darkMode} onView={openDetails} onApprove={handleApprove} onReject={openRejectModal} />
            </div>
            <div className="flex items-center justify-between">
              <div className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                <span className="capitalize">{getAvailability(vol)}</span> · <span>{getTimeCommit(vol)}</span>
              </div>
              <StatusBadge status={getStatus(vol)} />
            </div>
          </div>
        ))}
      </div>

      {/* ── Desktop table ─────────────────────────────────────────────── */}
      <div className={`hidden md:block ${cardBase} overflow-hidden`}>
        <div className={`px-5 py-4 border-b flex items-center gap-2.5 ${darkMode ? "border-gray-800/60" : "border-gray-100"}`}>
          <User size={17} className="text-primary-500" />
          <h2 className={`text-sm font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>Applications</h2>
          <span className={`ml-auto px-2 py-0.5 rounded-full text-xs font-medium ${darkMode ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-500"}`}>
            {pagination?.total || 0}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${darkMode ? "border-gray-800/60" : "border-gray-50"}`}>
                {["#", "Applicant", "Availability", "Time / Week", "Status", ""].map((h, i) => (
                  <th key={h + i} className={`px-5 py-3 text-xs font-semibold uppercase tracking-wider text-left ${darkMode ? "text-gray-500" : "text-gray-400"} ${i === 5 ? "text-right" : ""}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {volunteers.length === 0 ? (
                <tr>
                  <td colSpan={6} className={`px-5 py-16 text-center text-sm ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                    {isLoading ? "Loading…" : "No applications found."}
                  </td>
                </tr>
              ) : volunteers.map((vol, idx) => {
                const serial = ((pagination?.page ?? 1) - 1) * (pagination?.limit ?? 20) + idx + 1;
                return (
                  <tr key={vol._id} className={`border-b transition-colors ${darkMode ? "border-gray-800/40 hover:bg-gray-800/30" : "border-gray-50 hover:bg-gray-50/70"}`}>
                    <td className={`px-5 py-3.5 text-xs font-medium tabular-nums ${darkMode ? "text-gray-600" : "text-gray-400"}`}>{serial}</td>
                    <td className="px-5 py-3.5">
                      <p className={`text-sm font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>{getFullName(vol)}</p>
                      <p className={`text-xs mt-0.5 flex items-center gap-1 ${darkMode ? "text-gray-500" : "text-gray-400"}`}><Mail size={10} />{getEmail(vol)}</p>
                      <p className={`text-xs mt-0.5 flex items-center gap-1 ${darkMode ? "text-gray-500" : "text-gray-400"}`}><Phone size={10} />{getPhone(vol)}</p>
                    </td>
                    <td className={`px-5 py-3.5 text-sm capitalize ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{getAvailability(vol)}</td>
                    <td className={`px-5 py-3.5 text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{getTimeCommit(vol)}</td>
                    <td className="px-5 py-3.5"><StatusBadge status={getStatus(vol)} /></td>
                    <td className="px-5 py-3.5 text-right">
                      <ActionMenu vol={vol} darkMode={darkMode} onView={openDetails} onApprove={handleApprove} onReject={openRejectModal} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination?.pages > 1 && (
          <div className={`px-5 py-3.5 border-t flex items-center justify-between ${darkMode ? "border-gray-800/60" : "border-gray-100"}`}>
            <p className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
              Page {pagination.page} of {pagination.pages} · {pagination.total} total
            </p>
            <div className="flex items-center gap-1">
              <button onClick={() => handlePageChange(pagination.page - 1)} disabled={pagination.page === 1}
                className={`p-1.5 rounded-lg transition-all disabled:opacity-40 ${darkMode ? "hover:bg-gray-800 text-gray-400" : "hover:bg-gray-100 text-gray-500"}`}>
                <ChevronLeft size={16} />
              </button>
              <button onClick={() => handlePageChange(pagination.page + 1)} disabled={pagination.page === pagination.pages}
                className={`p-1.5 rounded-lg transition-all disabled:opacity-40 ${darkMode ? "hover:bg-gray-800 text-gray-400" : "hover:bg-gray-100 text-gray-500"}`}>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Approve confirm modal ─────────────────────────────────────── */}
      <AnimatePresence>
        {confirmTarget && (
          <ConfirmModal vol={confirmTarget} darkMode={darkMode} onConfirm={confirmApprove} onCancel={() => setConfirmTarget(null)} />
        )}
      </AnimatePresence>

      {/* ── Reject modal ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {isRejectModalOpen && selectedVol && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
              className={`w-full sm:max-w-md rounded-t-xl sm:rounded-xl shadow-xl p-6 ${darkMode ? "bg-[#111] border border-gray-800" : "bg-white border border-gray-200"}`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-sm font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>Reject Volunteer</h3>
                <button onClick={() => setIsRejectModalOpen(false)} className={`p-1.5 rounded-lg ${darkMode ? "text-gray-400 hover:bg-gray-800" : "text-gray-400 hover:bg-gray-100"}`}>
                  <X size={16} />
                </button>
              </div>
              <p className={`text-xs mb-3 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                Provide a reason for rejecting <strong className={darkMode ? "text-white" : "text-gray-900"}>{getFullName(selectedVol)}</strong>'s application.
              </p>
              <textarea
                value={rejectReason} onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Reason for rejection…" rows={4}
                className={`w-full px-3 py-2 rounded-lg border text-sm outline-none resize-none mb-4 ${darkMode ? "bg-gray-800/60 border-gray-700 text-white placeholder-gray-500 focus:border-red-500/50" : "bg-gray-50 border-gray-200 focus:border-red-400"}`}
              />
              <div className="flex gap-2">
                <button onClick={() => setIsRejectModalOpen(false)} className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${darkMode ? "border-gray-700 text-gray-300 hover:bg-gray-800" : "border-gray-200 text-gray-700 hover:bg-gray-50"}`}>
                  Cancel
                </button>
                <button onClick={submitReject} className="flex-1 py-2 rounded-lg text-sm font-medium bg-red-500 hover:bg-red-600 text-white transition-all">
                  Reject
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Details modal ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {isDetailsModalOpen && selectedVol && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
              className={`w-full sm:max-w-2xl rounded-t-xl sm:rounded-xl shadow-xl p-6 sm:my-8 ${darkMode ? "bg-[#111] border border-gray-800" : "bg-white border border-gray-200"}`}
            >
              {/* Modal header */}
              <div className={`flex items-start justify-between mb-5 pb-4 border-b ${darkMode ? "border-gray-800/60" : "border-gray-100"}`}>
                <div className="flex-1 min-w-0 pr-4">
                  <h3 className={`text-base font-semibold truncate ${darkMode ? "text-white" : "text-gray-900"}`}>{getFullName(selectedVol)}</h3>
                  <div className={`flex flex-wrap gap-3 mt-1 text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                    <span className="flex items-center gap-1"><Mail size={11} />{getEmail(selectedVol)}</span>
                    <span className="flex items-center gap-1"><Phone size={11} />{getPhone(selectedVol)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <StatusBadge status={getStatus(selectedVol)} />
                  <button onClick={() => setIsDetailsModalOpen(false)} className={`p-1.5 rounded-lg ${darkMode ? "text-gray-400 hover:bg-gray-800" : "text-gray-400 hover:bg-gray-100"}`}>
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Detail grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                <DetailBlock icon={<MapPin size={11} />}   label="Address"      value={getAddress(selectedVol)}    darkMode={darkMode} />
                <DetailBlock icon={<Calendar size={11} />} label="Availability" value={`${getAvailability(selectedVol)} · ${getTimeCommit(selectedVol)}`} darkMode={darkMode} />
                {selectedVol.professionalInfo?.occupation && (
                  <DetailBlock icon={<Briefcase size={11} />} label="Occupation"
                    value={`${selectedVol.professionalInfo.occupation}${selectedVol.professionalInfo.employer ? ` at ${selectedVol.professionalInfo.employer}` : ""}`}
                    darkMode={darkMode} />
                )}
                {selectedVol.emergencyContact?.name && (
                  <DetailBlock icon={<User size={11} />} label="Emergency Contact"
                    value={`${selectedVol.emergencyContact.name} · ${selectedVol.emergencyContact.phone || "—"}`}
                    darkMode={darkMode} />
                )}
              </div>

              {selectedVol.motivation && (
                <div className="mb-4">
                  <h4 className={`text-[10px] font-semibold uppercase tracking-wider mb-2 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>Motivation</h4>
                  <p className={`p-3 rounded-lg text-sm leading-relaxed ${darkMode ? "bg-gray-800/50 text-gray-300" : "bg-gray-50 text-gray-700"}`}>
                    {selectedVol.motivation}
                  </p>
                </div>
              )}

              {selectedVol.volunteerPreferences?.preferredAreas?.length > 0 && (
                <div className="mb-5">
                  <h4 className={`text-[10px] font-semibold uppercase tracking-wider mb-2 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>Preferred Areas</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedVol.volunteerPreferences.preferredAreas.map((area) => (
                      <span key={area} className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${darkMode ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-700"}`}>
                        {area.replace(/_/g, " ")}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className={`flex flex-col sm:flex-row gap-2 pt-4 border-t ${darkMode ? "border-gray-800/60" : "border-gray-100"}`}>
                {getStatus(selectedVol) === "pending" && (
                  <>
                    <button onClick={() => { setIsDetailsModalOpen(false); handleApprove(selectedVol._id); }}
                      className="flex-1 py-2 rounded-lg text-sm font-medium bg-emerald-500 hover:bg-emerald-600 text-white transition-all">
                      Approve
                    </button>
                    <button onClick={() => { setIsDetailsModalOpen(false); openRejectModal(selectedVol); }}
                      className="flex-1 py-2 rounded-lg text-sm font-medium bg-red-500 hover:bg-red-600 text-white transition-all">
                      Reject
                    </button>
                  </>
                )}
                <button onClick={() => setIsDetailsModalOpen(false)}
                  className={`flex-1 sm:flex-none sm:ml-auto px-6 py-2 rounded-lg text-sm font-medium border transition-all ${darkMode ? "border-gray-700 text-gray-300 hover:bg-gray-800" : "border-gray-200 text-gray-700 hover:bg-gray-50"}`}>
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
