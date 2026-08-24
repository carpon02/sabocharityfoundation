import React from "react";
import { motion as Motion } from "framer-motion";
import { ShieldCheck, Heart, ArrowRight, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { staggerContainer } from "../utils/animations";

const GreenTrustBanner = () => {
  return (
    <section className="relative pt-8 pb-4 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <Motion.div
          className="relative rounded-[3rem] bg-gradient-to-r from-primary-600 via-primary-500 to-primary-700 p-6 md:p-8 shadow-[0_40px_100px_-20px_rgba(5,150,105,0.4)] overflow-hidden group"
          variants={staggerContainer(0.1, 0)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {/* Cinematic Background Polish */}
          <div className="absolute inset-0 bg-shimmer-fast opacity-20 pointer-events-none" />
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary-400/20 rounded-full blur-3xl animate-slow-drift" />
          <div className="scan-line opacity-10" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
            {/* Left: Trust Identity */}
            <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
              <div className="relative">
                <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white scale-110 group-hover:rotate-12 transition-all duration-700 shadow-2xl">
                  <ShieldCheck size={40} className="fill-white/10" />
                </div>
                <Motion.div
                  className="absolute -top-2 -right-2 w-8 h-8 bg-secondary-500 rounded-xl flex items-center justify-center shadow-lg border-4 border-primary-500"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Zap size={16} className="text-white fill-current" />
                </Motion.div>
              </div>

              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-[10px] font-black uppercase tracking-[0.4em]">
                  <span className="w-2 h-2 rounded-full bg-secondary-400 animate-pulse" />
                  Trusted & Verified
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter leading-none">
                  Institutional Trust. <br />
                  <span className="text-primary-100">Real Impact.</span>
                </h2>
                <p className="text-sm font-medium text-primary-50/80 max-w-md leading-relaxed">
                  "Registered with CAC and committed to full transparency. 
                  Your support is carefully managed and fully accounted for."
                </p>
              </div>
            </div>

            {/* Right: Social Proof & CTA */}
            <div className="flex flex-col sm:flex-row items-center gap-8 w-full lg:w-auto">
              {/* Stat Nodes */}
              <div className="hidden xl:flex items-center gap-10 border-l border-white/10 pl-10">
                <div className="text-center">
                  <p className="text-[10px] font-black text-primary-100/60 uppercase tracking-widest mb-1">
                    Transparency
                  </p>
                  <p className="text-2xl font-black text-white font-mono leading-none">100%</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-black text-primary-100/60 uppercase tracking-widest mb-1">
                    Audited
                  </p>
                  <p className="text-2xl font-black text-white font-mono leading-none">ANNUAL</p>
                </div>
              </div>

              <Link
                to="/make-donation"
                className="group relative px-12 py-6 bg-white text-primary-700 rounded-3xl font-black uppercase tracking-[0.2em] text-sm overflow-hidden transition-all hover:scale-110 active:scale-95 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.3)] w-full sm:w-auto flex items-center justify-center gap-4"
              >
                <div className="absolute inset-0 bg-primary-50 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                <Heart size={18} className="fill-primary-600 transition-transform group-hover:scale-125 relative z-10" />
                <span className="relative z-10">Donate Now</span>
                <ArrowRight size={18} className="group-hover:translate-x-3 transition-transform relative z-10" />
              </Link>
            </div>
          </div>
        </Motion.div>
      </div>
    </section>
  );
};

export default GreenTrustBanner;
