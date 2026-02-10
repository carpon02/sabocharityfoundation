import React from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  HandHeart,
  Users,
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe,
} from "lucide-react";
import { motion as Motion } from "framer-motion";
import { fadeIn, staggerContainer } from "../utils/animations";

const Support = () => {
  const supports = [
    {
      icon: Heart,
      title: "Direct Humanitarian Aid",
      description:
        "Inject liquidity directly into verified community projects for immediate relief and sustainable infrastructure development.",
      color: "text-red-500",
      bg: "bg-red-500/10",
      count: "8.4k",
      label: "Active Donors",
    },
    {
      icon: Users,
      title: "Community Personnel",
      description:
        "Join our network of dedicated volunteers to lead local transformation and engineering projects in the heart of Sabo.",
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      count: "1.2k",
      label: "Field Agents",
    },
    {
      icon: HandHeart,
      title: "Strategic Alliance",
      description:
        "Scale impact through corporate partnership. Architect sustainable systems for regional growth and long-term prosperity.",
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      count: "45+",
      label: "Org Partners",
    },
  ];

  return (
    <section className="py-24 sm:py-32 lg:py-48 bg-dark-darker text-white relative overflow-hidden">
      {/* High-Octane Background: Geometric Matrix & Noise */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      <Motion.div
        className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-600/10 rounded-full blur-[180px] -translate-y-1/2 translate-x-1/2"
        animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 12, repeat: Infinity }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Motion.div
          className="text-center max-w-4xl mx-auto space-y-8 mb-24 lg:mb-32"
          variants={staggerContainer(0.1, 0)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <Motion.div
            className="inline-flex items-center gap-4 px-6 py-2 rounded-full glass-card border-white/5 text-secondary-500 font-black uppercase tracking-[0.4em] text-[10px] sm:text-xs shadow-2xl"
            variants={fadeIn("down", 0.2)}
          >
            <Globe className="w-4 h-4 animate-spin-slow" />
            Sabo Community Relief Protocol
          </Motion.div>
          <Motion.h2
            className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.8]"
            variants={fadeIn("up", 0.3)}
          >
            Empower the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-white to-primary-600">
              Future of Sabo.
            </span>
          </Motion.h2>
          <Motion.p
            className="text-lg sm:text-xl text-gray-400 font-medium max-w-2xl mx-auto leading-relaxed"
            variants={fadeIn("up", 0.4)}
          >
            "Collective action is the catalyst for local transformation. Join us
            in architecturalizing a new era of communal prosperity."
          </Motion.p>
        </Motion.div>

        <Motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12"
          variants={staggerContainer(0.1, 0.5)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {supports.map((item, i) => (
            <Motion.div
              key={i}
              variants={fadeIn("up", 0.2 * i)}
              className="group relative p-10 lg:p-12 rounded-[3.5rem] bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-700 hover:-translate-y-4 hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)]"
            >
              <div
                className={`absolute inset-0 rounded-[3.5rem] opacity-0 group-hover:opacity-10 transition-opacity duration-700 ${item.bg}`}
              />

              <div className="relative z-10 space-y-10">
                <div
                  className={`w-20 h-20 rounded-[2.5rem] flex items-center justify-center transition-all duration-700 ${item.bg} group-hover:scale-110 shadow-2xl`}
                >
                  <item.icon className={`w-10 h-10 ${item.color}`} />
                </div>

                <div className="space-y-6">
                  <h3 className="text-3xl font-black tracking-tight leading-none group-hover:text-white transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed font-medium group-hover:text-gray-300 transition-colors">
                    {item.description}
                  </p>
                </div>

                <div className="pt-10 border-t border-white/5 flex items-end justify-between">
                  <div>
                    <p
                      className={`text-3xl font-black font-mono tracking-tighter ${item.color}`}
                    >
                      {item.count}
                    </p>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">
                      {item.label}
                    </p>
                  </div>
                  <Link
                    to={
                      item.title === "Direct Humanitarian Aid"
                        ? "/campaigns"
                        : "/contact"
                    }
                    className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-500 -mr-4"
                  >
                    <ArrowRight className="w-6 h-6" />
                  </Link>
                </div>
              </div>
            </Motion.div>
          ))}
        </Motion.div>

        {/* Master CTA Plate */}
        <Motion.div
          className="mt-24 lg:mt-32 p-12 lg:p-20 rounded-[4rem] lg:rounded-[6rem] bg-gradient-to-br from-primary-900 to-dark border border-primary-500/30 relative overflow-hidden group shadow-2xl"
          variants={fadeIn("up", 0.8)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-secondary-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 text-center lg:text-left">
            <div className="space-y-6">
              <div className="flex items-center justify-center lg:justify-start gap-4">
                <ShieldCheck className="text-secondary-500 w-8 h-8" />
                <span className="text-xs font-black uppercase tracking-[0.5em] text-secondary-500 italic">
                  Trusted NGO Verification
                </span>
              </div>
              <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter leading-none text-white">
                Become a Sabo <br />
                <span className="text-secondary-500">Impact Leader.</span>
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Link
                to="/register"
                className="group relative px-12 py-6 bg-white text-black rounded-3xl font-black uppercase tracking-[0.2em] text-sm overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_20px_50px_-10px_rgba(255,255,255,0.3)]"
              >
                <div className="absolute inset-0 bg-primary-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                <span className="relative z-10 group-hover:text-white flex items-center gap-3">
                  Join the Mission <Zap size={18} className="fill-current" />
                </span>
              </Link>
            </div>
          </div>
        </Motion.div>
      </div>
    </section>
  );
};

export default Support;
