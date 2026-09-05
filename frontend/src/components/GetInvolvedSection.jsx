import React from "react";
import { Link } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { fadeIn, staggerContainer } from "../utils/animations";
import {
  Heart,
  ArrowRight,
  ClipboardList,
  Gift,
  Handshake,
} from "lucide-react";

const involvements = [
  {
    icon: ClipboardList,
    title: "Volunteer With Us",
    desc: "Join our dedicated team of volunteers. Whether you can give a few hours or commit regularly, there's a role for you — from tutoring students to organising health drives.",
    cta: "Sign Up to Volunteer",
    link: "/get-involved",
    color: "text-primary-600",
    bg: "bg-primary-50",
    border: "border-primary-100",
    stats: "500+ Active Volunteers",
  },
  {
    icon: Gift,
    title: "Fundraise For Us",
    desc: "Launch your own fundraising campaign — a birthday fundraiser, community challenge, or corporate match. We provide toolkits, social media assets, and full support.",
    cta: "Start a Fundraiser",
    link: "/get-involved",
    color: "text-secondary-600",
    bg: "bg-secondary-50",
    border: "border-secondary-100",
    stats: "₦50M+ Raised by Peers",
  },
  {
    icon: Handshake,
    title: "Corporate Partnerships",
    desc: "Partner with us to sponsor events, match employee donations, or fund entire programmes. We offer full visibility, co-branding, and measurable impact reports.",
    cta: "Become a Partner",
    link: "/contact",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
    stats: "45+ Org Partners",
  },
];

const GetInvolvedSection = () => {
  return (
    <section className="py-24 sm:py-32 bg-paper relative overflow-hidden">
      {/* Background */}
      <Motion.div
        className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-secondary-100/30 rounded-full blur-[150px] translate-x-1/3 translate-y-1/3 pointer-events-none"
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      <Motion.div
        className="absolute top-0 left-0 w-[400px] h-[400px] bg-primary-100/20 rounded-full blur-[120px] -translate-x-1/4 -translate-y-1/4 pointer-events-none"
        animate={{ scale: [1.1, 1, 1.1] }}
        transition={{ duration: 14, repeat: Infinity }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <Motion.div
          className="text-center space-y-6 mb-20"
          variants={staggerContainer(0.1, 0)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <Motion.div
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-secondary-50 border border-secondary-100 text-secondary-700 text-[10px] font-black uppercase tracking-[0.3em]"
            variants={fadeIn("down", 0.1)}
          >
            <Heart size={12} className="fill-secondary-600" />
            Get Involved
          </Motion.div>
          <Motion.h2
            className="text-4xl sm:text-6xl lg:text-7xl font-black text-dark tracking-tighter leading-[0.9]"
            variants={fadeIn("up", 0.2)}
          >
            More Ways to <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">
              Make a Difference.
            </span>
          </Motion.h2>
          <Motion.p
            className="text-lg text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed"
            variants={fadeIn("up", 0.3)}
          >
            Your support goes beyond financial aid. Volunteer your time, run a
            fundraiser, or partner with us to create lasting change in Sabo.
          </Motion.p>
        </Motion.div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {involvements.map((item, i) => (
            <Motion.div
              key={i}
              variants={fadeIn("up", 0.3 + i * 0.15)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              whileHover={{ y: -10, scale: 1.02 }}
              className={`group relative p-10 rounded-[3rem] bg-white border ${item.border} shadow-xl hover:shadow-2xl transition-all duration-500 flex flex-col overflow-hidden`}
            >
              {/* Hover Shimmer */}
              <div className="absolute inset-0 bg-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              {/* Icon */}
              <div
                className={`relative z-10 w-16 h-16 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-sm`}
              >
                <item.icon size={28} />
              </div>

              {/* Content */}
              <h3 className="relative z-10 text-2xl font-black text-dark tracking-tight mb-3">
                {item.title}
              </h3>
              <p className="relative z-10 text-sm text-gray-500 font-medium leading-relaxed mb-8 flex-grow">
                {item.desc}
              </p>

              {/* Stats */}
              <div className="relative z-10 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 pb-6 border-b border-gray-100">
                {item.stats}
              </div>

              {/* CTA */}
              <Link
                to={item.link}
                className="relative z-10 group/btn w-full inline-flex items-center justify-center gap-3 py-4 bg-dark text-white font-black uppercase tracking-[0.15em] text-xs rounded-2xl hover:bg-primary-700 transition-all duration-300 shadow-lg overflow-hidden"
              >
                <div className="absolute inset-0 bg-shimmer-fast opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10 flex items-center gap-2">
                  {item.cta}
                  <ArrowRight
                    size={16}
                    className="group-hover/btn:translate-x-1 transition-transform"
                  />
                </span>
              </Link>
            </Motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GetInvolvedSection;
