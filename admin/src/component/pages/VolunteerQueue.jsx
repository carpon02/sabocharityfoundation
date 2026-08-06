import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  CheckCircle,
  XCircle,
  Eye,
  Users,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Clock,
  Briefcase
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import {
  fetchAllVolunteers,
  approveVolunteer,
  rejectVolunteer,
  setFilters,
  selectVolunteers,
  selectPagination,
  selectFilters,
  selectLoading,
} from "../../features/volunteer/adminVolunteersSlice";
import { toast } from "react-hot-toast";

const VolunteerQueue = () => {
  const dispatch = useDispatch();
  const { darkMode } = useTheme();

  const volunteers = useSelector(selectVolunteers);
  const pagination = useSelector(selectPagination);
  const filters = useSelector(selectFilters);
  const isLoading = useSelector(selectLoading);

  const [localSearch, setLocalSearch] = useState(filters.search || "");
  const [selectedVol, setSelectedVol] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchAllVolunteers(filters));
  }, [dispatch, filters]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      dispatch(setFilters({ ...filters, page: newPage }));
    }
  };

  const handleRefresh = () => {
    dispatch(fetchAllVolunteers(filters));
  };

  const handleApprove = async (id) => {
    if (window.confirm("Are you sure you want to approve this volunteer?")) {
      await dispatch(approveVolunteer(id));
    }
  };

  const openRejectModal = (vol) => {
    setSelectedVol(vol);
    setRejectReason("");
    setIsRejectModalOpen(true);
  };

  const submitReject = async () => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }
    await dispatch(rejectVolunteer({ id: selectedVol._id, rejectionReason: rejectReason }));
    setIsRejectModalOpen(false);
    setSelectedVol(null);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><CheckCircle size={12}/> Approved</span>;
      case "rejected":
        return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><XCircle size={12}/> Rejected</span>;
      default:
        return <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><Clock size={12}/> Pending</span>;
    }
  };

  return (
    <div className="space-y-8 relative">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-1 bg-gradient-to-r from-primary-500 to-primary-300 rounded-full" />
            <span className="text-xs font-bold text-primary-600 uppercase tracking-wider">
              Volunteer Management
            </span>
          </div>
          <h1 className={`text-3xl lg:text-4xl font-extrabold mb-2 tracking-tight ${darkMode ? "text-white" : "text-dark"}`}>
            Approval <span className="text-primary-500">Queue</span>
          </h1>
          <p className={`text-base max-w-xl ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Review pending volunteer applications, manage their onboarding, and assign roles.
          </p>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className={`p-6 rounded-3xl border backdrop-blur-sm ${darkMode ? "bg-dark-lighter/80 border-gray-800" : "bg-white/80 border-gray-100 shadow-xl shadow-gray-100/50"}`}>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500" size={20} />
            <input
              type="text"
              placeholder="Search volunteers by name or email..."
              value={localSearch}
              onChange={(e) => {
                setLocalSearch(e.target.value);
                dispatch(setFilters({ ...filters, search: e.target.value, page: 1 }));
              }}
              className={`w-full pl-14 pr-6 py-4 rounded-2xl border-2 outline-none transition-all text-sm font-semibold ${darkMode ? "bg-gray-800/50 border-gray-700 text-white focus:border-primary-500" : "bg-gray-50 border-gray-100 focus:border-primary-500"}`}
            />
          </div>

          <select
            value={filters.status || ""}
            onChange={(e) => dispatch(setFilters({ ...filters, status: e.target.value, page: 1 }))}
            className={`px-8 py-4 rounded-2xl border-2 outline-none cursor-pointer text-sm font-bold ${darkMode ? "bg-gray-800/50 border-gray-700 text-white" : "bg-gray-50 border-gray-100"}`}
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          <button onClick={handleRefresh} className={`px-8 py-4 rounded-2xl border-2 font-bold text-sm transition-all flex items-center gap-2 ${darkMode ? "bg-gray-800/50 border-gray-700 text-white hover:bg-gray-700" : "bg-white border-gray-200 text-gray-600 hover:text-primary-600"}`}>
            <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} /> Refresh
          </button>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className={`rounded-3xl border overflow-hidden ${darkMode ? "bg-dark-lighter border-gray-800" : "bg-white border-gray-100 shadow-xl"}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`${darkMode ? "bg-gray-900/30 border-gray-800" : "bg-gray-50/50 border-gray-100"} border-b`}>
              <tr>
                <th className={`px-8 py-5 text-left text-xs font-bold uppercase ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Applicant</th>
                <th className={`px-8 py-5 text-left text-xs font-bold uppercase ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Role/Interests</th>
                <th className={`px-8 py-5 text-left text-xs font-bold uppercase ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Availability</th>
                <th className={`px-8 py-5 text-left text-xs font-bold uppercase ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Status</th>
                <th className={`px-8 py-5 text-right text-xs font-bold uppercase ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${darkMode ? "divide-gray-800/50" : "divide-gray-100"}`}>
              {volunteers.length > 0 ? volunteers.map((vol, i) => (
                <tr key={vol._id} className="group hover:bg-primary-50/50 dark:hover:bg-primary-900/10 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className={`font-bold text-sm ${darkMode ? "text-white" : "text-dark"}`}>{vol.firstName} {vol.lastName}</span>
                      <span className="text-xs text-gray-500">{vol.email}</span>
                      <span className="text-xs text-gray-400 mt-1">{vol.phone}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-wrap gap-1">
                      {vol.interests?.slice(0, 2).map((interest, idx) => (
                        <span key={idx} className={`px-2 py-1 rounded text-[10px] uppercase font-bold ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>{interest}</span>
                      ))}
                      {vol.interests?.length > 2 && <span className="text-xs text-gray-500">+{vol.interests.length - 2} more</span>}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                     <span className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>{vol.availability}</span>
                  </td>
                  <td className="px-8 py-6">
                    {getStatusBadge(vol.status)}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setSelectedVol(vol); setIsDetailsModalOpen(true); }} className={`p-2 rounded-xl transition-all ${darkMode ? "bg-gray-800 text-blue-400 hover:bg-gray-700" : "bg-blue-50 text-blue-600 hover:bg-blue-100"}`} title="View Details">
                        <Eye size={18} />
                      </button>
                      {vol.status === 'pending' && (
                        <>
                          <button onClick={() => handleApprove(vol._id)} className={`p-2 rounded-xl transition-all ${darkMode ? "bg-emerald-900/30 text-emerald-400 hover:bg-emerald-900/50" : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"}`} title="Approve">
                            <CheckCircle size={18} />
                          </button>
                          <button onClick={() => openRejectModal(vol)} className={`p-2 rounded-xl transition-all ${darkMode ? "bg-red-900/30 text-red-400 hover:bg-red-900/50" : "bg-red-50 text-red-600 hover:bg-red-100"}`} title="Reject">
                            <XCircle size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-8 py-32 text-center text-gray-500">No volunteers found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <p className={`text-sm font-semibold ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Page {pagination.page} of {pagination.pages}
          </p>
          <div className="flex items-center gap-3">
            <button onClick={() => handlePageChange(pagination.page - 1)} disabled={pagination.page === 1} className="p-3 rounded-xl bg-white border border-gray-200 disabled:opacity-50 dark:bg-gray-800 dark:border-gray-700"><ChevronLeft size={20}/></button>
            <button onClick={() => handlePageChange(pagination.page + 1)} disabled={pagination.page === pagination.pages} className="p-3 rounded-xl bg-white border border-gray-200 disabled:opacity-50 dark:bg-gray-800 dark:border-gray-700"><ChevronRight size={20}/></button>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      <AnimatePresence>
        {isRejectModalOpen && selectedVol && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className={`w-full max-w-md p-6 rounded-2xl shadow-xl ${darkMode ? 'bg-dark-lighter' : 'bg-white'}`}>
              <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-dark'}`}>Reject Volunteer</h3>
              <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Please provide a reason for rejecting {selectedVol.firstName} {selectedVol.lastName}'s application.</p>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Reason for rejection..."
                className={`w-full p-4 rounded-xl border-2 outline-none min-h-[100px] mb-4 ${darkMode ? 'bg-gray-800/50 border-gray-700 text-white' : 'bg-gray-50 border-gray-200'}`}
              />
              <div className="flex gap-3 justify-end">
                <button onClick={() => setIsRejectModalOpen(false)} className={`px-6 py-2 rounded-xl font-bold ${darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'}`}>Cancel</button>
                <button onClick={submitReject} className="px-6 py-2 rounded-xl font-bold bg-red-500 text-white hover:bg-red-600">Reject</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Details Modal */}
      <AnimatePresence>
        {isDetailsModalOpen && selectedVol && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className={`w-full max-w-2xl p-8 rounded-3xl shadow-xl my-8 ${darkMode ? 'bg-dark-lighter' : 'bg-white'}`}>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-dark'}`}>{selectedVol.firstName} {selectedVol.lastName}</h3>
                  <p className="text-primary-500 font-medium">{selectedVol.email} | {selectedVol.phone}</p>
                </div>
                {getStatusBadge(selectedVol.status)}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h4 className={`text-sm font-bold uppercase tracking-wider mb-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Address</h4>
                  <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{selectedVol.address.street}<br/>{selectedVol.address.city}, {selectedVol.address.state}</p>
                </div>
                <div>
                  <h4 className={`text-sm font-bold uppercase tracking-wider mb-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Emergency Contact</h4>
                  <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{selectedVol.emergencyContact.name}<br/>{selectedVol.emergencyContact.phone}</p>
                </div>
              </div>

              <div className="mb-8">
                 <h4 className={`text-sm font-bold uppercase tracking-wider mb-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Why they want to volunteer</h4>
                 <p className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-50 text-gray-700'}`}>{selectedVol.whyVolunteer}</p>
              </div>

              {selectedVol.resumeUrl && (
                <div className="mb-8">
                  <a href={selectedVol.resumeUrl} target="_blank" rel="noreferrer" className="text-primary-500 hover:underline flex items-center gap-2">
                    <Briefcase size={16} /> View Attached Resume
                  </a>
                </div>
              )}

              <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-800">
                <button onClick={() => setIsDetailsModalOpen(false)} className="px-8 py-3 rounded-xl font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">Close</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VolunteerQueue;
