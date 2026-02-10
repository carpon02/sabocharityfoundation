import React from "react";
import { motion as Motion } from "framer-motion";
import { Heart, ArrowUpRight, ShieldCheck, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const Banner = () => {
  return (
    <Motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4"
    >
      <div className="relative overflow-hidden rounded-[2.5rem] bg-dark-darker border border-white/10 group shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]">
        {/* Cinematic Background: Moving Energy Flow */}
        <Motion.div
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary-900/40 via-transparent to-secondary-900/40 opacity-50 pointer-events-none"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />

        <div className="relative z-10 p-6 md:p-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Action Status Node */}
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary-400 group-hover:scale-110 group-hover:rotate-12 transition-all duration-700">
                <Heart className="w-8 h-8 fill-current" />
              </div>
              <Motion.div
                className="absolute -top-2 -right-2 w-6 h-6 bg-secondary-500 rounded-lg flex items-center justify-center shadow-lg"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Zap size={14} className="text-white fill-current" />
              </Motion.div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black text-secondary-500 uppercase tracking-[0.4em]">
                  Protocol Active
                </span>
                <div className="w-2 h-2 rounded-full bg-secondary-500 animate-pulse" />
              </div>
              <h3 className="text-xl md:text-2xl font-black text-white tracking-tight leading-none uppercase">
                Synchronize <span className="text-primary-500">Resources.</span>
              </h3>
              <p className="text-xs font-medium text-gray-400 tracking-wide">
                Join 1,400+ agents of change in architecturalizing communal
                resilience.
              </p>
            </div>
          </div>

          {/* Social Proof Nodes */}
          <div className="hidden xl:flex items-center gap-8 border-l border-white/10 pl-8">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                Sovereignty Index
              </p>
              <p className="text-xl font-black text-white font-mono">98.4%</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                Local Nodes
              </p>
              <p className="text-xl font-black text-white font-mono">42+</p>
            </div>
          </div>

          {/* Precision CTA */}
          <div className="flex flex-col sm:flex-row items-center gap-6 w-full lg:w-auto">
            <div className="flex items-center gap-3 text-gray-500">
              <ShieldCheck size={16} className="text-emerald-500" />
              <span className="text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">
                Verified NGO Intelligence
              </span>
            </div>

            <Link
              to="/campaigns"
              className="group relative px-8 py-4 bg-white text-black rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center gap-3 transition-all hover:scale-105 active:scale-95 shadow-[0_20px_50px_-10px_rgba(255,255,255,0.2)] w-full sm:w-auto justify-center"
            >
              Initialize Funding
              <ArrowUpRight
                size={14}
                className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
              />
            </Link>
          </div>
        </div>
      </div>
    </Motion.div>
  );
};

export default Banner;
