import React from "react";
import { Link } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { fadeIn, staggerContainer } from "../utils/animations";
import { our_leadership_team } from "../assets/assets";
import {
  ShieldCheck,
  FileText,
  Users,
  ArrowRight,
  ExternalLink,
  GraduationCap,
  HeartPulse,
  HandHeart,
} from "lucide-react";

const transparencyCards = [
  {
    icon: FileText,
    title: "Annual Reports",
    desc: "Full financial reports published yearly for public review and accountability.",
    color: "text-primary-600",
    bg: "bg-primary-50",
    border: "border-primary-100",
  },
  {
    icon: ShieldCheck,
    title: "Audited Statements",
    desc: "Independently audited financials ensuring 100% transparency with every Naira.",
    color: "text-secondary-600",
    bg: "bg-secondary-50",
    border: "border-secondary-100",
  },
  {
    icon: ExternalLink,
    title: "CAC Registered",
    desc: "Verified non-profit organisation registered with the Corporate Affairs Commission.",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
  },
];

const AboutUsSection = () => {
  const teamPreview = (our_leadership_team || []).slice(0, 6);

  return (
    <section className="py-24 sm:py-32 bg-white relative overflow-hidden">
      <Motion.div
        className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary-100/30 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 12, repeat: Infinity }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Motion.div
          className="space-y-20"
          variants={staggerContainer(0.1, 0)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {/* ── Our Story & Mission ── */}
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="space-y-8">
              <Motion.div
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary-50 border border-primary-100 text-primary-700 text-[10px] font-black uppercase tracking-[0.3em]"
                variants={fadeIn("down", 0.1)}
              >
                <ShieldCheck size={12} />
                About Us
              </Motion.div>

              <Motion.h2
                className="text-4xl sm:text-5xl lg:text-7xl font-black text-dark tracking-tighter leading-[0.85]"
                variants={fadeIn("up", 0.2)}
              >
                The Foundation <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-800">
                  of Trust.
                </span>
              </Motion.h2>

              <Motion.p
                className="text-lg text-gray-500 font-medium leading-relaxed max-w-xl"
                variants={fadeIn("up", 0.3)}
              >
                The Sabo Ibadan Youth Charity Foundation exists to solve the
                most pressing challenges facing the youth of Sabo, Ibadan
                from education and healthcare to economic empowerment. We
                believe in transparency, community-first action, and building
                lasting, measurable impact.
              </Motion.p>

              <Motion.div variants={fadeIn("up", 0.4)}>
                <Link
                  to="/about"
                  className="group inline-flex items-center gap-3 px-10 py-5 bg-dark text-white font-black uppercase tracking-[0.15em] text-xs rounded-2xl hover:bg-primary-800 transition-all duration-300 shadow-xl"
                >
                  Read Our Full Story
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-2 transition-transform"
                  />
                </Link>
              </Motion.div>
            </div>

            {/* Core Values Pillars */}
            <Motion.div className="space-y-4" variants={fadeIn("left", 0.3)}>
              {[
                {
                  title: "Education",
                  desc: "Building classrooms, providing scholarships, and equipping students with the tools to succeed.",
                  icon: GraduationCap,
                  color: "text-blue-600",
                  bg: "bg-blue-50",
                },
                {
                  title: "Healthcare",
                  desc: "Equipping rural clinics, running free medical outreaches, and promoting community health awareness.",
                  icon: HeartPulse,
                  color: "text-rose-600",
                  bg: "bg-rose-50",
                },
                {
                  title: "Welfare & Empowerment",
                  desc: "Empowering families with sustainable resources, vocational training, and micro-business grants.",
                  icon: HandHeart,
                  color: "text-primary-600",
                  bg: "bg-primary-50",
                },
              ].map((pillar, i) => (
                <Motion.div
                  key={i}
                  whileHover={{ x: 8, scale: 1.01 }}
                  className="group flex items-start gap-5 p-6 sm:p-8 rounded-[2rem] bg-gray-50 border border-gray-100 hover:border-primary-200 hover:bg-white hover:shadow-xl transition-all duration-500 cursor-default"
                >
                  <div className={`p-3 rounded-xl ${pillar.bg} ${pillar.color} group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-sm`}>
                    <pillar.icon size={24} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xl font-black text-dark tracking-tight">
                      {pillar.title}
                    </h4>
                    <p className="text-sm text-gray-500 font-medium leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>
                </Motion.div>
              ))}
            </Motion.div>
          </div>

          {/* ── Team & Board Preview ── */}
          <Motion.div variants={fadeIn("up", 0.4)} className="space-y-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                  <Users size={20} className="text-primary-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-dark tracking-tight">
                    Our Leadership
                  </h3>
                  <p className="text-sm text-gray-400 font-medium">
                    Meet the people driving our mission
                  </p>
                </div>
              </div>
              <Link
                to="/about"
                className="group inline-flex items-center gap-2 text-sm font-bold text-primary-600 hover:text-primary-800 transition-colors"
              >
                View full team
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
              {teamPreview.map((member, i) => (
                <Motion.div
                  key={member.id}
                  variants={fadeIn("up", 0.5 + i * 0.08)}
                  whileHover={{ y: -8, scale: 1.05 }}
                  className="group text-center space-y-3 cursor-default"
                >
                  <div className="relative mx-auto w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-gray-100 group-hover:border-primary-300 transition-all shadow-lg group-hover:shadow-xl">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-black text-dark leading-tight truncate px-1">
                      {member.name}
                    </p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      {member.role}
                    </p>
                  </div>
                </Motion.div>
              ))}
            </div>
          </Motion.div>

          {/* ── Financial Transparency ── */}
          <Motion.div
            variants={fadeIn("up", 0.5)}
            className="grid sm:grid-cols-3 gap-6"
          >
            {transparencyCards.map((card, i) => (
              <Motion.div
                key={i}
                variants={fadeIn("up", 0.6 + i * 0.1)}
                whileHover={{ y: -6 }}
                className={`group p-8 rounded-[2rem] bg-gray-50 border ${card.border} hover:bg-white hover:shadow-xl transition-all duration-500`}
              >
                <div
                  className={`w-14 h-14 rounded-2xl ${card.bg} ${card.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                >
                  <card.icon size={24} />
                </div>
                <h4 className="text-lg font-black text-dark tracking-tight mb-2">
                  {card.title}
                </h4>
                <p className="text-sm text-gray-500 font-medium leading-relaxed">
                  {card.desc}
                </p>
              </Motion.div>
            ))}
          </Motion.div>
        </Motion.div>
      </div>
    </section>
  );
};

export default AboutUsSection;
