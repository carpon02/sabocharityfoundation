// admin/src/component/pages/EditEvent.jsx - Event Refinement Hub
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Upload,
  X,
  Plus,
  Globe,
  DollarSign,
  AlertCircle,
  ArrowLeft,
  Shield,
  Activity,
  Zap,
  Info,
  CheckCircle,
  Save,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import apiClient from "../../config/apiConfig";
import { toast } from "react-hot-toast";

const EditEvent = () => {
  const { darkMode } = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("basic");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    shortDescription: "",
    category: "workshop",
    eventDate: "",
    endDate: "",
    eventTime: { start: "", end: "" },
    location: {
      venue: "",
      address: "",
      city: "",
      state: "",
      country: "Nigeria",
    },
    isOnline: false,
    onlineDetails: {
      platform: "",
      meetingLink: "",
      meetingId: "",
      passcode: "",
    },
    capacity: { max: "" },
    registrationRequired: true,
    registrationDeadline: "",
    registrationFee: { amount: 0, currency: "NGN" },
    status: "draft",
    featured: false,
    tags: [],
    requirements: [],
    benefits: [],
  });

  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setFetchLoading(true);
        const response = await apiClient.get(`/events/${id}`);
        const event = response.data.data.event;
        const formatDate = (date) =>
          date ? new Date(date).toISOString().split("T")[0] : "";

        setFormData({
          title: event.title || "",
          description: event.description || "",
          shortDescription: event.shortDescription || "",
          category: event.category || "workshop",
          eventDate: formatDate(event.eventDate),
          endDate: formatDate(event.endDate),
          eventTime: {
            start: event.eventTime?.start || "",
            end: event.eventTime?.end || "",
          },
          location: {
            venue: event.location?.venue || "",
            address: event.location?.address || "",
            city: event.location?.city || "",
            state: event.location?.state || "",
            country: event.location?.country || "Nigeria",
          },
          isOnline: event.isOnline || false,
          onlineDetails: {
            platform: event.onlineDetails?.platform || "",
            meetingLink: event.onlineDetails?.meetingLink || "",
            meetingId: event.onlineDetails?.meetingId || "",
            passcode: event.onlineDetails?.passcode || "",
          },
          capacity: { max: event.capacity?.max || "" },
          registrationRequired: event.registrationRequired ?? true,
          registrationDeadline: formatDate(event.registrationDeadline),
          registrationFee: {
            amount: event.registrationFee?.amount || 0,
            currency: event.registrationFee?.currency || "NGN",
          },
          status: event.status || "draft",
          featured: event.featured || false,
          tags: event.tags || [],
          requirements: event.requirements || [],
          benefits: event.benefits || [],
        });
        setExistingImages(event.images || []);
      } catch {
        toast.error("Process Error: Failed to fetch event details");
      } finally {
        setFetchLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === "checkbox" ? checked : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + newImages.length + existingImages.length > 5) {
      toast.error("Capacity Limit Exceeded (Max 5)");
      return;
    }
    setNewImages((prev) => [...prev, ...files]);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () =>
        setNewImagePreviews((prev) => [...prev, reader.result]);
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const submitData = new FormData();
      newImages.forEach((img) => submitData.append("images", img));
      const dataToSend = { ...formData, existingImages };
      Object.keys(dataToSend).forEach((key) => {
        if (typeof dataToSend[key] === "object") {
          submitData.append(key, JSON.stringify(dataToSend[key]));
        } else {
          submitData.append(key, dataToSend[key]);
        }
      });
      await apiClient.put(`/events/${id}`, submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Event Refined (Update Successful)");
      navigate(`/admin/events`);
    } catch {
      toast.error("Process Failed: Could not update event");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "basic", label: "Basic Info", icon: Calendar },
    { id: "details", label: "Location & Link", icon: MapPin },
    { id: "registration", label: "Attendees & Fees", icon: Users },
    { id: "additional", label: "Event Media", icon: Plus },
  ];

  if (fetchLoading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <Activity size={40} className="animate-spin text-emerald-500" />
        <p
          className={`text-[10px] font-black uppercase tracking-[0.3em] ${
            darkMode ? "text-gray-600" : "text-gray-400"
          }`}
        >
          Loading Event Details...
        </p>
      </div>
    );

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
              Edit Event
            </h1>
            <div className="flex items-center gap-3 mt-3">
              <div className="w-10 h-1 bg-emerald-500 rounded-full" />
              <span
                className={`text-[11px] font-bold uppercase tracking-widest ${
                  darkMode ? "text-gray-500" : "text-gray-400"
                }`}
              >
                Refine community outreach details
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] flex items-center gap-2 shadow-lg shadow-emerald-600/20 active:scale-95 transition-all"
          >
            {loading ? (
              <Activity size={16} className="animate-spin" />
            ) : (
              <>
                <Save size={16} /> Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tabs Matrix */}
      <div
        className={`p-2 rounded-2xl border backdrop-blur-md flex gap-2 overflow-x-auto no-scrollbar ${
          darkMode
            ? "bg-gray-950/50 border-gray-800"
            : "bg-white border-gray-100 shadow-xl shadow-gray-200/20"
        }`}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-3 px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-[10px] whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
                : darkMode
                  ? "text-gray-500 hover:text-white"
                  : "text-gray-400 hover:text-gray-950"
            }`}
          >
            <tab.icon size={14} /> {tab.label}
          </button>
        ))}
      </div>

      {/* Form Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        <div className="xl:col-span-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className={`p-8 lg:p-10 rounded-2xl border transition-all ${
                darkMode
                  ? "bg-gray-950/80 border-gray-800 shadow-2xl"
                  : "bg-white border-gray-100 shadow-xl shadow-gray-200/20"
              }`}
            >
              {activeTab === "basic" && (
                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 ml-4">
                      Event Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className={`w-full px-6 py-4 rounded-xl border font-semibold text-sm outline-none transition-all ${
                        darkMode
                          ? "bg-gray-900 border-gray-800 text-white focus:border-emerald-500/50"
                          : "bg-gray-50 border-gray-100 text-gray-950 focus:border-emerald-500/50"
                      }`}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 ml-4">
                      Event Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={6}
                      className={`w-full px-6 py-4 rounded-xl border font-medium text-sm outline-none transition-all ${
                        darkMode
                          ? "bg-gray-900 border-gray-800 text-white focus:border-emerald-500/50"
                          : "bg-gray-50 border-gray-100 text-gray-950 focus:border-emerald-500/50"
                      }`}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 ml-4">
                        Event Category
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className={`w-full px-6 py-4 rounded-xl border font-bold text-[11px] uppercase tracking-widest outline-none appearance-none cursor-pointer ${
                          darkMode
                            ? "bg-gray-900 border-gray-800 text-white"
                            : "bg-gray-50 border-gray-100 text-gray-950"
                        }`}
                      >
                        <option value="workshop">Workshop</option>
                        <option value="seminar">Seminar</option>
                        <option value="fundraiser">Fundraiser</option>
                        <option value="community_outreach">
                          Community Outreach
                        </option>
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 ml-4">
                        Event Status
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className={`w-full px-6 py-4 rounded-xl border font-bold text-[11px] uppercase tracking-widest outline-none appearance-none cursor-pointer ${
                          darkMode
                            ? "bg-gray-900 border-gray-800 text-white"
                            : "bg-gray-50 border-gray-100 text-gray-950"
                        }`}
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="postponed">Postponed</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "details" && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 ml-4">
                        Event Date
                      </label>
                      <input
                        type="date"
                        name="eventDate"
                        value={formData.eventDate}
                        onChange={handleChange}
                        className={`w-full px-6 py-4 rounded-xl border font-semibold text-sm outline-none ${
                          darkMode
                            ? "bg-gray-900 border-gray-800 text-white"
                            : "bg-gray-50 border-gray-100 text-gray-950"
                        }`}
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 ml-4">
                        Start Time
                      </label>
                      <input
                        type="time"
                        name="eventTime.start"
                        value={formData.eventTime.start}
                        onChange={handleChange}
                        className={`w-full px-6 py-4 rounded-xl border font-semibold text-sm outline-none ${
                          darkMode
                            ? "bg-gray-900 border-gray-800 text-white"
                            : "bg-gray-50 border-gray-100 text-gray-950"
                        }`}
                      />
                    </div>
                  </div>
                  <div
                    className={`flex items-center gap-4 p-6 rounded-xl border ${
                      darkMode
                        ? "bg-emerald-500/5 border-emerald-500/10"
                        : "bg-emerald-50 border-emerald-100"
                    }`}
                  >
                    <input
                      type="checkbox"
                      name="isOnline"
                      checked={formData.isOnline}
                      onChange={handleChange}
                      className="w-5 h-5 rounded border-emerald-500 text-emerald-600 focus:ring-emerald-500"
                    />
                    <label
                      className={`text-xs font-bold uppercase tracking-widest ${
                        darkMode ? "text-emerald-400" : "text-emerald-600"
                      }`}
                    >
                      This is an Online Event
                    </label>
                  </div>
                  {!formData.isOnline ? (
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 ml-4">
                        Physical Venue
                      </label>
                      <input
                        type="text"
                        name="location.venue"
                        value={formData.location.venue}
                        onChange={handleChange}
                        className={`w-full px-6 py-4 rounded-xl border font-semibold text-sm outline-none ${
                          darkMode
                            ? "bg-gray-900 border-gray-800 text-white"
                            : "bg-gray-50 border-gray-100 text-gray-950"
                        }`}
                      />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 ml-4">
                        Meeting Link
                      </label>
                      <input
                        type="url"
                        name="onlineDetails.meetingLink"
                        value={formData.onlineDetails.meetingLink}
                        onChange={handleChange}
                        className={`w-full px-6 py-4 rounded-xl border font-semibold text-sm outline-none ${
                          darkMode
                            ? "bg-gray-900 border-gray-800 text-white"
                            : "bg-gray-50 border-gray-100 text-gray-950"
                        }`}
                      />
                    </div>
                  )}
                </div>
              )}

              {activeTab === "registration" && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 ml-4">
                        Max Capacity
                      </label>
                      <div className="relative">
                        <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="number"
                          name="capacity.max"
                          value={formData.capacity.max}
                          onChange={handleChange}
                          placeholder="Unlimited if empty"
                          className={`w-full pl-12 pr-6 py-4 rounded-xl border font-semibold text-sm outline-none ${
                            darkMode
                              ? "bg-gray-900 border-gray-800 text-white focus:border-emerald-500/50"
                              : "bg-gray-50 border-gray-100 text-gray-950 focus:border-emerald-500/50"
                          }`}
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 ml-4">
                        Registration Fee
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                          ₦
                        </span>
                        <input
                          type="number"
                          name="registrationFee.amount"
                          value={formData.registrationFee.amount}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-6 py-4 rounded-xl border font-semibold text-sm outline-none ${
                            darkMode
                              ? "bg-gray-900 border-gray-800 text-white focus:border-emerald-500/50"
                              : "bg-gray-50 border-gray-100 text-gray-950 focus:border-emerald-500/50"
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "additional" && (
                <div className="space-y-8">
                  <div className="space-y-6">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 ml-4">
                      Existing Gallery
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                      {existingImages.map((img, i) => (
                        <div
                          key={i}
                          className="relative group rounded-xl overflow-hidden aspect-square border border-gray-200 dark:border-gray-800 shadow-sm"
                        >
                          <img
                            src={img.url}
                            className="w-full h-full object-cover transition-transform group-hover:scale-110"
                            alt="event"
                          />
                          <button
                            onClick={() =>
                              setExistingImages((prev) =>
                                prev.filter((_, idx) => idx !== i),
                              )
                            }
                            className="absolute top-2 right-2 p-1.5 bg-rose-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 ml-4">
                      New Event Media
                    </label>
                    <div
                      className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
                        darkMode
                          ? "border-gray-800 hover:border-emerald-500/50 hover:bg-emerald-500/5"
                          : "border-gray-200 hover:border-emerald-500/30 hover:bg-gray-50"
                      }`}
                    >
                      <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p
                        className={`text-sm font-semibold ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Click or drag to add more photos
                      </p>
                      <input
                        type="file"
                        multiple
                        onChange={handleImageChange}
                        className="hidden"
                        id="asset-upload"
                      />
                      <label
                        htmlFor="asset-upload"
                        className="mt-6 inline-block px-8 py-3 bg-emerald-600/10 text-emerald-500 border border-emerald-500/20 rounded-xl font-bold uppercase tracking-widest text-[10px] cursor-pointer hover:bg-emerald-600 hover:text-white transition-all shadow-lg"
                      >
                        Select New Images
                      </label>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-8">
                      {newImagePreviews.map((p, i) => (
                        <div
                          key={i}
                          className="relative group rounded-xl overflow-hidden aspect-square border border-emerald-500/30 shadow-lg shadow-emerald-500/10"
                        >
                          <img
                            src={p}
                            className="w-full h-full object-cover transition-transform group-hover:scale-110"
                            alt="preview"
                          />
                          <div className="absolute top-2 left-2 bg-emerald-600 text-[8px] font-bold text-white px-2 py-1 rounded-lg uppercase tracking-tight">
                            New
                          </div>
                          <button
                            onClick={() => {
                              setNewImages(
                                newImages.filter((_, idx) => idx !== i),
                              );
                              setNewImagePreviews(
                                newImagePreviews.filter((_, idx) => idx !== i),
                              );
                            }}
                            className="absolute top-2 right-2 p-1.5 bg-rose-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
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
              Refinement Checklist
            </h3>
            <div className="space-y-4">
              {[
                {
                  label: "Content Sync",
                  status: "Optimal",
                  icon: Shield,
                  color: "text-emerald-500",
                },
                {
                  label: "Timeline",
                  status: "Verified",
                  icon: Activity,
                  color: "text-emerald-500",
                },
                {
                  label: "Capacity",
                  status: formData.capacity.max ? "Defined" : "Unlimited",
                  icon: Zap,
                  color: "text-gray-400",
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
              Update Protocol
            </h3>
            <p className="text-[11px] font-medium text-gray-500 leading-relaxed mb-8">
              Saving these changes will update the event details across the Sabo
              network.
            </p>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-4 rounded-xl bg-emerald-600 text-white font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-emerald-600/20 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <Activity size={16} className="animate-spin" />
              ) : (
                "Sync Changes"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditEvent;
