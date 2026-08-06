import React from "react";
import { 
  Heart, 
  BookOpen, 
  Stethoscope, 
  Lightbulb, 
  TrendingUp,
  ArrowRight
} from "lucide-react";
import { motion as Motion } from "framer-motion";
import { fadeIn, staggerContainer } from "../utils/animations";
import AnimatedCounter from "./AnimatedCounter";

const impactTiers = [
  {
    amount: 1000,
    title: "School Supplies",
    desc: "Provides a full set of textbooks and stationery for one primary student for a whole term.",
    icon: BookOpen,
    color: "text-blue-600",
    bg: "bg-blue-50"
  },
  {
    amount: 5000,
    title: "Health Diagnostic",
    desc: "Covers a comprehensive medical screening and basic treatment for a child in Sabo.",
    icon: Stethoscope,
    color: "text-primary-600",
    bg: "bg-primary-50"
  },
  {
    amount: 25000,
    title: "Empowerment Grant",
    desc: "Seed funding for a youth-led micro-business, including 3 months of mentorship.",
    icon: Lightbulb,
    color: "text-secondary-600",
    bg: "bg-secondary-50"
  },
  {
    amount: 100000,
    title: "Infrastructure Support",
    desc: "Directly funds the maintenance and solar power supply for our community learning hub.",
    icon: TrendingUp,
    color: "text-purple-600",
    bg: "bg-purple-50"
  }
];

const HowItHelps = () => {
  return (
    <section className="py-24 sm:py-32 bg-paper relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-100 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Motion.div 
          className="text-center space-y-6 mb-20"
          variants={staggerContainer(0.1, 0)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <Motion.div 
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full glass-card-neon-primary border-primary-500/30 text-primary-900 font-black uppercase tracking-[0.4em] text-[10px] shadow-[0_20px_50px_-10px_rgba(16,185,129,0.2)]"
            variants={fadeIn("down", 0.1)}
          >
            <Heart size={14} className="fill-primary-600 animate-pulse" />
            Impact Architecture v2.0
          </Motion.div>
          <Motion.h2 
            className="text-4xl sm:text-6xl font-black text-dark tracking-tighter leading-tight"
            variants={fadeIn("up", 0.2)}
          >
            How Your Support <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-800">
              Changes Real Lives.
            </span>
          </Motion.h2>
          <Motion.p 
            className="text-lg text-gray-500 font-medium max-w-2xl mx-auto"
            variants={fadeIn("up", 0.3)}
          >
            We maintain a 100% transparency protocol. Every Naira donated is a 
            precision-guided investment in the future of Sabo Ibadan.
          </Motion.p>
        </Motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {impactTiers.map((tier, i) => (
            <Motion.div
              key={i}
              className="group relative p-10 rounded-[3.5rem] bg-white border border-gray-100 shadow-xl hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] hover:-translate-y-4 transition-all duration-700 overflow-hidden"
              variants={fadeIn("up", 0.4 + i * 0.1)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              <div className="absolute inset-0 bg-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className={`relative z-10 w-20 h-20 rounded-[2.5rem] ${tier.bg} ${tier.color} flex items-center justify-center mb-10 group-hover:rotate-12 transition-all duration-500 shadow-inner`}>
                <tier.icon size={32} />
              </div>
              
              <div className="space-y-4">
                <div className="text-3xl font-black text-dark tracking-tight">
                  <AnimatedCounter end={tier.amount} prefix="₦" />
                </div>
                <h4 className="text-xl font-black text-primary-800 tracking-tight">
                  {tier.title}
                </h4>
                <p className="text-sm text-gray-500 font-medium leading-relaxed pb-6">
                  {tier.desc}
                </p>
                <div className="pt-6 border-t border-gray-50 flex items-center justify-between group-hover:text-primary-600 transition-colors">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-primary-600">
                    Sovereign Impact
                  </span>
                  <ArrowRight size={16} />
                </div>
              </div>
            </Motion.div>
          ))}
        </div>

        {/* Accountability Note */}
        <Motion.div 
          className="mt-24 p-12 lg:p-16 rounded-[4rem] bg-dark text-white text-center relative overflow-hidden group shadow-2xl border border-white/5"
          variants={fadeIn("up", 0.8)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {/* Abstract Glow */}
          <div className="absolute top-0 right-0 w-[500px] h-full bg-primary-600/10 blur-[100px] pointer-events-none group-hover:scale-150 transition-transform duration-[3s]" />
          <p className="relative z-10 text-base font-medium text-gray-400 max-w-4xl mx-auto italic leading-relaxed">
            "Sabo Impact Architecture: Your contribution is managed through a multi-sig transparency protocol. 
            Detailed impact reports are published quarterly for all stakeholders, ensuring 100% sovereign accountability."
          </p>
        </Motion.div>
      </div>
    </section>
  );
};

export default HowItHelps;
