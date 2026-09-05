import React from "react";
import { Link } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { fadeIn, staggerContainer } from "../utils/animations";
import AnimatedCounter from "./AnimatedCounter";
import {
  Heart,
  ArrowRight,
  RefreshCw,
  CreditCard,
  ShieldCheck,
  BookOpen,
  Stethoscope,
  Lightbulb,
  TrendingUp,
} from "lucide-react";

const impactTiers = [
  {
    amount: 1000,
    title: "School Supplies",
    desc: "Provides a full set of textbooks and stationery for one primary student for a whole term.",
    icon: BookOpen,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    amount: 5000,
    title: "Health Screening",
    desc: "Covers a comprehensive medical screening and basic treatment for a child in Sabo.",
    icon: Stethoscope,
    color: "text-primary-600",
    bg: "bg-primary-50",
    featured: true,
  },
  {
    amount: 25000,
    title: "Empowerment Grant",
    desc: "Seed funding for a youth-led micro-business, including 3 months of mentorship.",
    icon: Lightbulb,
    color: "text-secondary-600",
    bg: "bg-secondary-50",
  },
  {
    amount: 100000,
    title: "Infrastructure Fund",
    desc: "Directly funds the maintenance and solar power supply for our community learning hub.",
    icon: TrendingUp,
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
];

const DonateSection = () => {
  return (
    <section className="py-24 sm:py-32 bg-gradient-to-br from-primary-900 via-dark to-dark text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-600/10 rounded-full blur-[180px] translate-x-1/3 -translate-y-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary-500/5 rounded-full blur-[120px] -translate-x-1/4 translate-y-1/4 pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      <div className="scan-line opacity-5" />

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
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-secondary-400 text-[10px] font-black uppercase tracking-[0.3em]"
            variants={fadeIn("down", 0.1)}
          >
            <Heart size={12} className="fill-secondary-500 text-secondary-500" />
            Support Us
          </Motion.div>
          <Motion.h2
            className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.9]"
            variants={fadeIn("up", 0.2)}
          >
            Your Donation <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400">
              Powers Real Change.
            </span>
          </Motion.h2>
          <Motion.p
            className="text-lg text-gray-400 font-medium max-w-2xl mx-auto leading-relaxed"
            variants={fadeIn("up", 0.3)}
          >
            Every Naira donated is a direct investment in the future of Sabo.
            See exactly what your support accomplishes with full transparency.
          </Motion.p>
        </Motion.div>

        {/* Impact Tiers Grid */}
        <Motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-20"
          variants={staggerContainer(0.1, 0.2)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {impactTiers.map((tier, i) => (
            <Motion.div
              key={i}
              variants={fadeIn("up", 0.1 * i)}
              whileHover={{ y: -8, scale: 1.03 }}
              className={`group relative p-8 sm:p-10 rounded-[3rem] bg-white/5 border border-white/10 hover:border-primary-500/30 hover:shadow-[0_30px_60px_-10px_rgba(16,185,129,0.2)] transition-all duration-500 overflow-hidden ${
                tier.featured ? "ring-1 ring-secondary-500/30" : ""
              }`}
            >
              {/* Hover glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-600/0 to-secondary-600/0 group-hover:from-primary-600/5 group-hover:to-secondary-600/5 transition-all duration-700 rounded-[3rem]" />

              {tier.featured && (
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-secondary-500/20 text-secondary-400 text-[10px] font-black uppercase tracking-wider border border-secondary-500/20">
                  Popular
                </div>
              )}

              <div
                className={`relative z-10 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl ${tier.bg} ${tier.color} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-inner`}
              >
                <tier.icon size={28} />
              </div>

              <div className="relative z-10 space-y-3">
                <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  <AnimatedCounter end={tier.amount} prefix="₦" />
                </div>
                <h4 className="text-lg font-black text-primary-400 tracking-tight">
                  {tier.title}
                </h4>
                <p className="text-sm text-gray-400 font-medium leading-relaxed">
                  {tier.desc}
                </p>
              </div>
            </Motion.div>
          ))}
        </Motion.div>

        {/* Donation CTAs */}
        <Motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
          variants={fadeIn("up", 0.6)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {/* Primary: Donate Now */}
          <Link
            to="/make-donation"
            className="group relative px-12 py-6 bg-white text-primary-700 rounded-3xl font-black uppercase tracking-[0.2em] text-sm overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.3)] flex items-center gap-4 w-full sm:w-auto justify-center"
          >
            <div className="absolute inset-0 bg-primary-50 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <CreditCard size={18} className="relative z-10" />
            <span className="relative z-10">Donate Now</span>
            <ArrowRight
              size={18}
              className="group-hover:translate-x-2 transition-transform relative z-10"
            />
          </Link>

          {/* Secondary: Monthly Giving */}
          <Link
            to="/make-donation?recurring=true"
            className="group inline-flex items-center gap-3 px-10 py-6 rounded-3xl bg-white/5 border border-white/10 hover:border-secondary-500/30 text-white font-black uppercase tracking-[0.15em] text-xs transition-all duration-300 hover:scale-105 w-full sm:w-auto justify-center"
          >
            <RefreshCw size={16} className="text-secondary-400" />
            Set Up Monthly Giving
            <ArrowRight
              size={14}
              className="text-secondary-400 group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </Motion.div>

        {/* Security Note */}
        <Motion.div
          className="mt-10 text-center"
          variants={fadeIn("up", 0.7)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 text-gray-500 text-xs font-medium">
            <ShieldCheck size={14} className="text-primary-500" />
            Secure payment powered by Paystack. Your data is encrypted and safe.
          </div>
        </Motion.div>
      </div>
    </section>
  );
};

export default DonateSection;
