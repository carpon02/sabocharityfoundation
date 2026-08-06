import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchOverviewAnalytics } from "../features/analytics/analyticsSlice";
import { motion as Motion } from "framer-motion";
import { Heart, TrendingUp, Users } from "lucide-react";
import AnimatedCounter from "./AnimatedCounter";

const DonationProgress = () => {
  const dispatch = useDispatch();
  const { overviewStats } = useSelector((state) => state.analytics);

  useEffect(() => {
    dispatch(fetchOverviewAnalytics());
  }, [dispatch]);

  const goal = 50000000; // ₦50M annual goal
  const raised = overviewStats?.totalRaised || 20500000;
  const donors = overviewStats?.totalDonors || 1240;
  const percentage = Math.min(Math.round((raised / goal) * 100), 100);

  const formatCurrency = (amount) => {
    if (amount >= 1000000) return `₦${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `₦${(amount / 1000).toFixed(0)}K`;
    return `₦${amount.toLocaleString()}`;
  };

  return (
    <div className="relative bg-[#020617] py-10 px-4 overflow-hidden border-y border-white/5">
      {/* Subtle Scan */}
      <div className="scan-line opacity-10" />
      {/* Ambient Glow */}
      <div className="absolute left-0 top-0 w-[400px] h-full bg-primary-500/10 blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          {/* Left: Label */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="w-12 h-12 rounded-2xl bg-secondary-500/20 flex items-center justify-center">
              <TrendingUp size={22} className="text-secondary-400" />
            </div>
            <div className="min-w-[140px]">
              <p className="text-[10px] font-black text-secondary-400 uppercase tracking-[0.3em]">
                Annual Impact Goal
              </p>
              <div className="text-white font-black text-xl flex items-center gap-1">
                <AnimatedCounter end={raised} prefix="₦" /> raised of {formatCurrency(goal)}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex-1 w-full space-y-2">
            <div className="h-4 bg-white/5 rounded-full overflow-hidden p-1 border border-white/10 shadow-inner group relative">
              <Motion.div
                className="h-full rounded-full bg-gradient-to-r from-secondary-400 via-secondary-500 to-primary-500 relative overflow-hidden"
                initial={{ width: "0%" }}
                whileInView={{ width: `${percentage}%` }}
                viewport={{ once: true }}
                transition={{ duration: 2.5, ease: "easeOut", delay: 0.3 }}
              >
                <div className="absolute inset-x-0 inset-y-0 bg-shimmer-fast opacity-30" />
                {/* Glow Tip */}
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-white blur-md opacity-50" />
              </Motion.div>
            </div>
            <div className="flex justify-between text-xs font-bold text-white/60">
              <span className="flex items-center gap-1">
                <AnimatedCounter end={percentage} />% of goal reached
              </span>
              <span>{formatCurrency(goal - raised)} remaining</span>
            </div>
          </div>

          {/* Right: Stats + CTA */}
          <div className="flex items-center gap-6 lg:gap-8 flex-shrink-0">
            <div className="text-center hidden sm:block">
              <div className="flex items-center gap-2 text-white font-black text-lg">
                <Users size={16} className="text-primary-400" />
                <AnimatedCounter end={donors} suffix="+" />
              </div>
              <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest">
                Donors
              </p>
            </div>
            <Link
              to="/make-donation"
              className="group relative flex items-center gap-3 px-10 py-4 bg-secondary-500 hover:bg-white text-dark font-black text-sm rounded-2xl transition-all duration-500 hover:scale-110 active:scale-95 shadow-[0_20px_50px_-10px_rgba(245,158,11,0.5)] overflow-hidden"
            >
              <div className="absolute inset-0 bg-shimmer-fast opacity-0 group-hover:opacity-100 transition-opacity" />
              <Heart size={18} className="fill-dark group-hover:scale-125 transition-transform relative z-10" />
              <span className="relative z-10 uppercase tracking-widest">Initiate Aid</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationProgress;
