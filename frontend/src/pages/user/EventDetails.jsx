import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  MapPin,
  Calendar,
  Users,
  Share2,
  Clock,
  CheckCircle,
  AlertCircle,
  Heart,
  ArrowRight,
  ChevronLeft,
  Loader,
  ImageIcon,
  FileText,
  List,
  Mic2,
  Globe,
  MessageCircle,
  Facebook,
  Twitter,
} from "lucide-react";
import {
  getEventById,
  registerForEvent,
  clearRegistrationStatus,
} from "../../features/event/eventSlice";
import { toast } from "react-hot-toast";
import { formatDate } from "../../utils/formatDate";
import { formatCurrency } from "../../utils/formatCurrency";
import { useTheme } from "../../context/ThemeContext";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { darkMode } = useTheme();

  const {
    selectedEvent: event,
    loading,
    error,
    registrationSuccess,
    registrationError,
  } = useSelector((state) => state.events);
  const { user } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    if (id) {
      dispatch(getEventById(id));
    }
  }, [dispatch, id]);

  // Handle Registration Success/Error
  useEffect(() => {
    if (registrationSuccess) {
      toast.success("Successfully registered for event!");
      dispatch(clearRegistrationStatus());
      dispatch(getEventById(id)); // Refresh details
    }
    if (registrationError) {
      toast.error(registrationError);
      dispatch(clearRegistrationStatus());
    }
  }, [registrationSuccess, registrationError, dispatch, id]);

  const handleRegister = () => {
    if (!user) {
      toast.error("Please login to register");
      navigate("/login", { state: { from: `/user/events/${id}` } });
      return;
    }
    dispatch(registerForEvent({ eventId: id, registrationData: {} }));
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = `Join me at ${event?.title}!`;

    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        url,
      )}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        text,
      )}&url=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`,
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], "_blank", "width=600,height=400");
    }
  };

  const isRegistered = event?.attendees?.some((a) => {
    const attendeeId = a.user?._id || a.user;
    return (
      attendeeId === user?._id ||
      (a.guestInfo?.email && a.guestInfo?.email === user?.email)
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <Loader className="animate-spin text-primary-500" size={48} />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 p-4 text-center">
        <AlertCircle className="text-red-500 mb-4" size={48} />
        <h2 className="text-2xl font-bold dark:text-white mb-2">
          Event Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          The event you are looking for may have been removed or does not exist.
        </p>
        <Link
          to="/user/events"
          className="bg-primary-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-600 transition-all"
        >
          Back to Events
        </Link>
      </div>
    );
  }

  const primaryImage =
    event.images?.find((img) => img.isPrimary)?.url ||
    event.images?.[0]?.url ||
    "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600&h=400&fit=crop";

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-950" : "bg-gray-50"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 dark:text-gray-400 mb-6 flex items-center gap-2">
          <Link
            to="/user/events"
            className="hover:text-primary-600 transition-colors"
          >
            Events
          </Link>
          <ChevronLeft size={16} className="rotate-180" />
          <span className="text-gray-900 dark:text-white font-medium line-clamp-1">
            {event.title}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image */}
            <div className="relative rounded-2xl overflow-hidden group h-64 sm:h-80 lg:h-[400px]">
              <img
                src={primaryImage}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-primary-500 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg">
                {event.status === "upcoming" ? "Upcoming" : event.status}
              </div>
            </div>

            {/* Header */}
            <div
              className={`rounded-2xl p-6 border ${
                darkMode
                  ? "bg-gray-900 border-gray-800"
                  : "bg-white border-gray-200"
              }`}
            >
              <h1
                className={`text-3xl font-bold mb-4 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {event.title}
              </h1>
              <div className="flex flex-wrap gap-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-primary-500" />
                  {formatDate(event.eventDate)}
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={18} className="text-primary-500" />
                  {event.eventTime?.start} - {event.eventTime?.end}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-primary-500" />
                  {event.location?.venue}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div
              className={`rounded-2xl border overflow-hidden ${
                darkMode
                  ? "bg-gray-900 border-gray-800"
                  : "bg-white border-gray-200"
              }`}
            >
              <div className="flex border-b border-gray-200 dark:border-gray-800 overflow-x-auto">
                {[
                  { id: "details", label: "Details", icon: FileText },
                  { id: "agenda", label: "Agenda", icon: List },
                  { id: "speakers", label: "Speakers", icon: Mic2 },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 min-w-[100px] py-4 px-4 font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                      activeTab === tab.id
                        ? "text-primary-600 border-b-2 border-primary-500 bg-primary-50 dark:bg-primary-900/10 dark:text-primary-400"
                        : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    }`}
                  >
                    <tab.icon size={18} /> {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {activeTab === "details" && (
                  <div
                    className={`prose max-w-none ${
                      darkMode ? "prose-invert" : ""
                    }`}
                  >
                    <p className="whitespace-pre-line leading-relaxed text-gray-600 dark:text-gray-300">
                      {event.description}
                    </p>

                    {event.requirements?.length > 0 && (
                      <div className="mt-6">
                        <h3 className="text-lg font-bold mb-3">Requirements</h3>
                        <ul className="list-disc pl-5 space-y-2">
                          {event.requirements.map((req, i) => (
                            <li key={i}>{req}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "agenda" && (
                  <div className="space-y-4">
                    {event.agenda?.length > 0 ? (
                      event.agenda.map((item, i) => (
                        <div
                          key={i}
                          className="flex gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700"
                        >
                          <div className="w-24 flex-shrink-0 text-sm font-bold text-primary-600">
                            {item.time}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 dark:text-white">
                              {item.activity}
                            </h4>
                            {item.speaker && (
                              <p className="text-sm text-gray-500 mt-1">
                                Speaker: {item.speaker}
                              </p>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        No agenda details available.
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "speakers" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {event.speakers?.length > 0 ? (
                      event.speakers.map((speaker, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700"
                        >
                          <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden">
                            {speaker.image ? (
                              <img
                                src={speaker.image}
                                alt={speaker.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Users className="text-primary-500" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 dark:text-white">
                              {speaker.name}
                            </h4>
                            <p className="text-sm text-primary-600">
                              {speaker.title}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full text-center py-8 text-gray-500">
                        No speakers announced yet.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Registration Card */}
            <div
              className={`rounded-2xl p-6 border shadow-lg ${
                darkMode
                  ? "bg-gray-900 border-gray-800"
                  : "bg-white border-gray-200"
              }`}
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Registration Fee
                  </p>
                  <p
                    className={`text-2xl font-bold ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {event.registrationFee?.amount > 0
                      ? formatCurrency(event.registrationFee.amount)
                      : "Free"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Spots Left
                  </p>
                  <p className="text-xl font-bold text-primary-600">
                    {event.availableSlots ?? "∞"}
                  </p>
                </div>
              </div>

              <button
                onClick={handleRegister}
                disabled={isRegistered || event.availableSlots === 0}
                className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg ${
                  isRegistered
                    ? "bg-green-500 text-white cursor-not-allowed"
                    : event.availableSlots === 0
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-primary-500 text-white hover:bg-primary-600 hover:shadow-primary-500/25"
                }`}
              >
                {isRegistered ? (
                  <>
                    <CheckCircle size={20} /> Registered
                  </>
                ) : event.availableSlots === 0 ? (
                  "Sold Out"
                ) : (
                  <>
                    <Heart size={20} /> Register Now
                  </>
                )}
              </button>

              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500">
                  {event.capacity?.registered || 0} people have registered
                </p>
              </div>
            </div>

            {/* Organizer */}
            <div
              className={`rounded-2xl p-6 border ${
                darkMode
                  ? "bg-gray-900 border-gray-800"
                  : "bg-white border-gray-200"
              }`}
            >
              <h3
                className={`font-bold mb-4 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Organizer
              </h3>
              {event.organizers?.map((org, i) => (
                <div key={i} className="flex items-center gap-3 mb-3 last:mb-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold">
                    {org.firstName?.charAt(0)}
                  </div>
                  <div>
                    <p
                      className={`font-medium ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {org.firstName} {org.lastName}
                    </p>
                    <p className="text-xs text-gray-500">{org.email}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Share */}
            <div
              className={`rounded-2xl p-6 border ${
                darkMode
                  ? "bg-gray-900 border-gray-800"
                  : "bg-white border-gray-200"
              }`}
            >
              <h3
                className={`font-bold mb-4 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Share Event
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => handleShare("twitter")}
                  className="p-3 rounded-lg bg-black text-white hover:opacity-80 transition-opacity"
                >
                  <Twitter size={20} />
                </button>
                <button
                  onClick={() => handleShare("facebook")}
                  className="p-3 rounded-lg bg-blue-600 text-white hover:opacity-80 transition-opacity"
                >
                  <Facebook size={20} />
                </button>
                <button
                  onClick={() => handleShare("whatsapp")}
                  className="p-3 rounded-lg bg-green-500 text-white hover:opacity-80 transition-opacity"
                >
                  <MessageCircle size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
