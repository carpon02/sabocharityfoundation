import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUpcomingEvents } from "../features/event/eventsSlice";
import { motion as Motion } from "framer-motion";
import { fadeIn, staggerContainer } from "../utils/animations";
import { Calendar, MapPin, Clock, ArrowRight, Loader, CalendarX } from "lucide-react";

const categoryColors = {
  education: "bg-primary-100 text-primary-700 border-primary-200",
  health: "bg-rose-100 text-rose-700 border-rose-200",
  community: "bg-secondary-100 text-secondary-700 border-secondary-200",
  community_outreach: "bg-secondary-100 text-secondary-700 border-secondary-200",
  fundraiser: "bg-purple-100 text-purple-700 border-purple-200",
  volunteer: "bg-blue-100 text-blue-700 border-blue-200",
  volunteer_drive: "bg-blue-100 text-blue-700 border-blue-200",
  workshop: "bg-teal-100 text-teal-700 border-teal-200",
  conference: "bg-indigo-100 text-indigo-700 border-indigo-200",
  charity_run: "bg-orange-100 text-orange-700 border-orange-200",
};

const formatDate = (dateStr) => {
  if (!dateStr) return { day: "TBD", month: "", year: "", time: "" };
  const d = new Date(dateStr);
  return {
    day: d.getDate(),
    month: d.toLocaleString("default", { month: "short" }),
    year: d.getFullYear(),
    time: d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
  };
};

// Resolve the event date from either eventDate or date field
const getEventDate = (event) => event.eventDate || event.date || event.startDate;

// Resolve the event location from object or string
const getEventLocation = (event) => {
  if (!event.location) return null;
  if (typeof event.location === "string") return event.location;
  const { venue, city, state } = event.location;
  return [venue, city, state].filter(Boolean).join(", ");
};

const UpcomingEvents = () => {
  const dispatch = useDispatch();
  const { upcomingEvents, loading } = useSelector((state) => state.events);

  useEffect(() => {
    dispatch(fetchUpcomingEvents());
  }, [dispatch]);

  const displayEvents = (upcomingEvents || []).slice(0, 3);

  return (
    <section className="py-20 sm:py-32 bg-paper relative overflow-hidden">
      {/* Background Glow */}
      <Motion.div
        className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary-100/30 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 pointer-events-none"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 12, repeat: Infinity }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <Motion.div
          className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-16 gap-6"
          variants={staggerContainer(0.1, 0)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <div className="space-y-4">
            <Motion.div
              className="inline-flex items-center gap-2 px-6 py-2 rounded-full glass-card-neon-secondary border-secondary-500/30 text-secondary-800 text-[10px] font-black uppercase tracking-[0.4em] shadow-[0_20px_50px_-10px_rgba(245,158,11,0.2)]"
              variants={fadeIn("down", 0.1)}
            >
              <Calendar size={14} className="text-secondary-600 animate-pulse" />
              Upcoming Events
            </Motion.div>
            <Motion.h2
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-dark tracking-tighter leading-[0.9]"
              variants={fadeIn("up", 0.2)}
            >
              Be Part of
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-800">
                Something Real.
              </span>
            </Motion.h2>
          </div>
          <Motion.div variants={fadeIn("left", 0.3)}>
            <Link
              to="/get-involved"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-dark text-white font-bold text-sm rounded-2xl hover:bg-primary-700 transition-all duration-300"
            >
              All Events
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </Motion.div>
        </Motion.div>

        {/* Events Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader className="animate-spin text-primary-600" size={40} />
          </div>
        ) : displayEvents.length === 0 ? (
          <Motion.div
            variants={fadeIn("up", 0.2)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="flex flex-col items-center justify-center py-24 gap-4 text-center"
          >
            <CalendarX size={56} className="text-primary-300" />
            <h3 className="text-2xl font-bold text-dark">No Upcoming Events</h3>
            <p className="text-gray-500 max-w-sm">
              Check back soon — exciting events are being planned for the community.
            </p>
            <Link
              to="/get-involved"
              className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-bold text-sm rounded-2xl hover:bg-primary-700 transition-all"
            >
              Get Involved <ArrowRight size={14} />
            </Link>
          </Motion.div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayEvents.map((event, i) => {
              const date = formatDate(getEventDate(event));
              const location = getEventLocation(event);
              const colorClass =
                categoryColors[event.category?.toLowerCase()] ||
                categoryColors.community;
              return (
                <Motion.div
                  key={event._id}
                  variants={fadeIn("up", 0.2 + i * 0.1)}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  whileHover={{ y: -8 }}
                  className="group bg-white rounded-[2.5rem] overflow-hidden shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500"
                >
                  {/* Event Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={
                        event.image ||
                        event.imageUrl ||
                        event.featuredImage?.url ||
                        `https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=400&fit=crop`
                      }
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark/50 to-transparent" />
                    {/* Date Badge */}
                    <div className="absolute top-4 left-4 glass-card-premium rounded-2xl px-5 py-3 text-center shadow-2xl border-white/50 backdrop-blur-xl">
                      <div className="text-3xl font-black text-dark tracking-tighter leading-none">
                        {date.day}
                      </div>
                      <div className="text-[10px] font-black text-primary-600 uppercase tracking-widest mt-1">
                        {date.month}
                      </div>
                    </div>
                    {/* Category */}
                    {event.category && (
                      <div
                        className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${colorClass}`}
                      >
                        {event.category.replace(/_/g, " ")}
                      </div>
                    )}
                  </div>

                  {/* Event Content */}
                  <div className="p-8 space-y-4">
                    <h3 className="text-xl font-black text-dark leading-tight group-hover:text-primary-700 transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-sm text-gray-500 font-medium leading-relaxed line-clamp-2">
                      {event.description}
                    </p>
                    <div className="space-y-2 pt-2">
                      {location && (
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <MapPin
                            size={14}
                            className="text-primary-500 flex-shrink-0"
                          />
                          <span className="truncate font-medium">{location}</span>
                        </div>
                      )}
                      {event.eventTime?.start && (
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Clock
                            size={14}
                            className="text-secondary-500 flex-shrink-0"
                          />
                          <span className="font-medium">
                            {event.eventTime.start}
                            {event.eventTime.end ? ` – ${event.eventTime.end}` : ""}
                          </span>
                        </div>
                      )}
                    </div>
                    <Link
                      to={`/events/${event.slug || event._id}`}
                      className="group/btn relative mt-6 w-full inline-flex items-center justify-center gap-3 py-4 bg-dark text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 hover:scale-105 active:scale-95"
                    >
                      <div className="absolute inset-0 bg-shimmer-fast opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <span className="relative z-10 flex items-center gap-2">
                        Learn More <ArrowRight size={14} className="group-hover/btn:translate-x-2 transition-transform" />
                      </span>
                    </Link>
                  </div>
                </Motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default UpcomingEvents;
