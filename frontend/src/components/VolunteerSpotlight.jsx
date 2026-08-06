import React from "react";
import { Link } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { fadeIn, staggerContainer } from "../utils/animations";
import { Heart, ArrowRight, Quote } from "lucide-react";

const volunteers = [
  {
    name: "Amara Okafor",
    role: "Education Coordinator",
    impact: "Tutored 120+ students in STEM subjects over 2 years",
    since: "2022",
    quote:
      "Every child I teach is a future I help shape. This foundation gave me the platform to make that happen.",
    avatar:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&h=200&fit=crop&crop=face",
    category: "Education",
    categoryColor: "bg-primary-100 text-primary-700",
    hours: "1,200+ hours",
  },
  {
    name: "Emeka Nwosu",
    role: "Health Outreach Lead",
    impact: "Organized 8 free health screening drives reaching 3,000+ people",
    since: "2021",
    quote:
      "Health is a right, not a privilege. I'm proud to help bring that right to our community.",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    category: "Health",
    categoryColor: "bg-rose-100 text-rose-700",
    hours: "800+ hours",
  },
  {
    name: "Fatima Al-Hassan",
    role: "Community Mobilizer",
    impact: "Recruited and trained 200+ new volunteers across Sabo",
    since: "2023",
    quote:
      "When one person rises, they can lift an entire community. That belief drives everything I do here.",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b9e44c96?w=200&h=200&fit=crop&crop=face",
    category: "Community",
    categoryColor: "bg-secondary-100 text-secondary-700",
    hours: "600+ hours",
  },
];

const VolunteerSpotlight = () => {
  return (
    <section className="py-20 sm:py-32 bg-dark relative overflow-hidden">
      {/* Ambient Background */}
      <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-primary-900/20 rounded-full blur-[150px] translate-x-1/3 -translate-y-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary-900/10 rounded-full blur-[120px] -translate-x-1/4 translate-y-1/4 pointer-events-none" />
      <div className="scan-line opacity-5" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <Motion.div
          className="text-center space-y-6 mb-20"
          variants={staggerContainer(0.1, 0)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <Motion.div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-secondary-400 text-[10px] font-black uppercase tracking-[0.2em]"
            variants={fadeIn("down", 0.1)}
          >
            <Heart
              size={12}
              className="fill-secondary-500 text-secondary-500"
            />
            Volunteer Spotlight
          </Motion.div>
          <Motion.h2
            className="text-4xl sm:text-5xl lg:text-7xl font-black text-white tracking-tighter leading-[0.9]"
            variants={fadeIn("up", 0.2)}
          >
            The Humans
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-400 to-secondary-600">
              Behind Impact.
            </span>
          </Motion.h2>
          <Motion.p
            className="text-gray-400 text-lg font-medium max-w-2xl mx-auto leading-relaxed"
            variants={fadeIn("up", 0.3)}
          >
            Our volunteers are our greatest asset. They give their time,
            expertise, and passion to uplift communities every single day.
          </Motion.p>
        </Motion.div>

        {/* Volunteer Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {volunteers.map((vol, i) => (
            <Motion.div
              key={i}
              variants={fadeIn("up", 0.2 + i * 0.15)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.01 }}
              className="group glass-card-dark-premium rounded-[2.5rem] p-8 space-y-6 relative overflow-hidden"
            >
              {/* Subtle Glow & Shimmer on Hover */}
              <div className="absolute inset-0 bg-shimmer-fast opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
              <div className="absolute inset-0 bg-gradient-to-br from-primary-600/0 to-secondary-600/0 group-hover:from-primary-600/10 group-hover:to-secondary-600/10 transition-all duration-700 rounded-[2.5rem]" />

              {/* Header */}
              <div className="flex items-center gap-4 relative z-10">
                  <div className="relative group/avatar">
                    <img
                      src={vol.avatar}
                      alt={vol.name}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-white/10 group-hover/avatar:rotate-3 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary-500 rounded-full border-2 border-dark shadow-[0_0_15px_rgba(16,185,129,0.8)] animate-pulse" />
                  </div>
                <div>
                  <h3 className="font-black text-white text-lg leading-tight">
                    {vol.name}
                  </h3>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">
                    {vol.role}
                  </p>
                </div>
              </div>

              {/* Category & Hours */}
              <div className="flex items-center gap-3 relative z-10">
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${vol.categoryColor}`}
                >
                  {vol.category}
                </span>
                <span className="text-gray-500 text-xs font-bold">
                  {vol.hours} served
                </span>
                <span className="text-gray-600 text-xs">
                  • Since {vol.since}
                </span>
              </div>

              {/* Quote */}
              <div className="relative z-10 p-5 bg-white/5 rounded-2xl border border-white/5">
                <Quote size={16} className="text-secondary-500 mb-2" />
                <p className="text-gray-300 text-sm font-medium leading-relaxed italic">
                  {vol.quote}
                </p>
              </div>

              {/* Impact */}
              <div className="relative z-10 pt-2 border-t border-white/10">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">
                  Impact
                </p>
                <p className="text-sm text-gray-300 font-semibold">
                  {vol.impact}
                </p>
              </div>
            </Motion.div>
          ))}
        </div>

        {/* CTA */}
        <Motion.div
          className="text-center"
          variants={fadeIn("up", 0.5)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <Link
            to="/get-involved"
            className="group inline-flex items-center gap-3 px-12 py-6 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-black rounded-[2rem] hover:shadow-[0_20px_60px_rgba(16,185,129,0.4)] hover:scale-105 transition-all duration-500"
          >
            <Heart size={20} className="fill-white" />
            Join Our Volunteer Team
            <ArrowRight
              size={20}
              className="group-hover:translate-x-2 transition-transform"
            />
          </Link>
          <p className="text-gray-500 text-sm mt-4 font-medium">
            500+ volunteers active • All skill levels welcome
          </p>
        </Motion.div>
      </div>
    </section>
  );
};

export default VolunteerSpotlight;
