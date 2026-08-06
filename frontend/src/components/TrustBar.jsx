import React from "react";
import { motion as Motion } from "framer-motion";
import { fadeIn } from "../utils/animations";
import { ShieldCheck, Award, Globe, Building2, Users, BadgeCheck } from "lucide-react";

const partners = [
  {
    icon: ShieldCheck,
    name: "CAC Registered",
    sub: "Corporate Affairs Commission",
    color: "text-primary-600",
    bg: "bg-primary-50",
    border: "border-primary-100",
  },
  {
    icon: Globe,
    name: "UNICEF Partner",
    sub: "UN Children's Fund Nigeria",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
  },
  {
    icon: Building2,
    name: "Oyo State Govt.",
    sub: "Official State Partner",
    color: "text-secondary-600",
    bg: "bg-secondary-50",
    border: "border-secondary-100",
  },
  {
    icon: Users,
    name: "NYC Affiliate",
    sub: "Nigerian Youth Council",
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-100",
  },
  {
    icon: Award,
    name: "ISO Certified",
    sub: "Quality Management Certified",
    color: "text-rose-600",
    bg: "bg-rose-50",
    border: "border-rose-100",
  },
  {
    icon: BadgeCheck,
    name: "Transparent NGO",
    sub: "100% Audited Annually",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
  },
];

const TrustBar = () => {
  return (
    <section className="py-16 bg-white border-y border-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <Motion.div
          className="text-center mb-12 space-y-3"
          variants={fadeIn("down", 0.1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary-50 border border-primary-100 text-primary-700 text-[10px] font-black uppercase tracking-[0.3em]">
            <ShieldCheck size={12} />
            Verified Trust Signals
          </div>
          <p className="text-sm text-gray-400 font-medium">
            Registered, certified, and partnered with leading global institutions
          </p>
        </Motion.div>

        {/* Infinite Marquee Wrapper */}
        <div className="relative mt-8">
          {/* Gradients to hide edges for a "fade" effect */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          <div className="flex overflow-hidden group">
            <div className="flex animate-marquee group-hover:[animation-play-state:paused]">
              {/* Double use of the same array for seamless loop */}
              {[...partners, ...partners].map((partner, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 mx-4 w-56 group/item"
                >
                  <Motion.div
                    variants={fadeIn("up", 0.05)}
                    whileHover={{ y: -4, scale: 1.02 }}
                    className={`flex flex-col items-center text-center p-6 rounded-3xl border ${partner.border} ${partner.bg} hover:shadow-xl transition-all duration-500 cursor-default bg-white/50 backdrop-blur-sm`}
                  >
                    <div
                      className={`w-14 h-14 rounded-2xl ${partner.bg} border ${partner.border} flex items-center justify-center mb-4 group-hover/item:scale-110 group-hover/item:rotate-12 transition-all duration-500 shadow-sm`}
                    >
                      <partner.icon size={28} className={partner.color} />
                    </div>
                    <span className={`text-sm font-black ${partner.color} leading-tight`}>
                      {partner.name}
                    </span>
                    <span className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-widest leading-tight">
                      {partner.sub}
                    </span>
                  </Motion.div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustBar;
