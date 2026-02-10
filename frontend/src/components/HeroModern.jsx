import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchOverviewAnalytics } from "../features/analytics/analyticsSlice";
import {
  Heart,
  ArrowRight,
  ShieldCheck,
  Users,
  Globe,
  Sparkles,
} from "lucide-react";
import { motion as Motion } from "framer-motion";
import {
  fadeIn,
  staggerContainer,
  textVariant,
  floatAnimation,
  scaleIn,
} from "../utils/animations";
import heroImg from "../assets/hero_img.png";

const HeroModern = () => {
  const dispatch = useDispatch();
  const { overviewStats } = useSelector((state) => state.analytics);

  useEffect(() => {
    dispatch(fetchOverviewAnalytics());
  }, [dispatch]);

  const livesImpacted = overviewStats
    ? `${Math.floor(overviewStats.livesImpacted).toLocaleString()}+`
    : "5,000+";
  const annualGoal = overviewStats
    ? `₦${(overviewStats.totalRaised / 1000000).toFixed(1)}M+`
    : "₦12.5M+";

  return (
    <section className="relative min-h-[110vh] flex items-center bg-paper overflow-hidden">
      {/* Cinematic Background Polish */}
      <Motion.div
        className="absolute top-0 right-0 w-full lg:w-3/4 h-full bg-gradient-to-l from-primary-50/40 via-transparent to-transparent pointer-events-none"
        animate={{ opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 5, repeat: Infinity }}
      />

      {/* Floating Sparkles/Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <Motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary-400 rounded-full"
            initial={{
              x: Math.random() * 100 + "%",
              y: Math.random() * 100 + "%",
              opacity: 0,
            }}
            animate={{
              y: [null, "-20vh"],
              opacity: [0, 1, 0],
              scale: [1, 2, 1],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Floating Abstract Shapes */}
      <Motion.div
        className="absolute top-20 right-[15%] w-64 h-64 bg-secondary-200/20 rounded-full blur-[100px] pointer-events-none"
        animate={{
          y: [0, 50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 15, repeat: Infinity }}
      />

      <Motion.div
        className="absolute bottom-40 left-[10%] w-96 h-96 bg-primary-200/20 rounded-full blur-[120px] pointer-events-none"
        animate={{
          x: [0, -30, 0],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 12, repeat: Infinity }}
      />

      {/* Futuristic Grid Overlay */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02] pointer-events-none" />
      <div className="scan-line opacity-[0.02]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative z-10 w-full">
        <Motion.div
          className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center"
          variants={staggerContainer(0.1, 0)}
          initial="hidden"
          animate="show"
        >
          {/* CONTENT LEFT: The Narrative */}
          <div className="space-y-12">
            <Motion.div
              className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/60 backdrop-blur-2xl border border-white text-primary-900 font-black text-[10px] uppercase tracking-[0.3em] shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05)]"
              variants={fadeIn("down", 0.2)}
            >
              <Sparkles
                size={14}
                className="text-secondary-500 animate-pulse"
              />
              Sabo Impact Protocol v4.0
            </Motion.div>

            <div className="space-y-6">
              <Motion.h1
                className="text-6xl sm:text-7xl md:text-8xl xl:text-[10rem] font-black tracking-[-0.05em] text-dark leading-[0.8] text-balance"
                variants={textVariant(0.3)}
              >
                Spark <br />
                <span className="text-glow-primary text-primary-700">
                  Change.
                </span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-800 via-primary-500 to-secondary-500 pb-2">
                  Drive Hope.
                </span>
              </Motion.h1>

              <Motion.p
                className="text-lg sm:text-xl lg:text-2xl text-gray-500 max-w-xl leading-relaxed font-semibold italic border-l-4 border-primary-500 pl-6 py-2"
                variants={fadeIn("up", 0.4)}
              >
                "We don't just provide aid; we architecturalize independence.
                Bridging global compassion with sovereign local implementation."
              </Motion.p>
            </div>

            <Motion.div
              className="flex flex-col sm:flex-row items-center gap-6 pt-6"
              variants={fadeIn("up", 0.5)}
            >
              <Link
                to="/make-donation"
                className="group relative w-full sm:w-auto overflow-hidden px-12 py-7 bg-dark text-white font-black rounded-[2.5rem] hover:scale-105 active:scale-95 transition-all duration-500 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)]"
              >
                <span className="relative z-10 flex items-center justify-center gap-4 text-lg">
                  Initiate Funding{" "}
                  <Heart className="w-6 h-6 fill-primary-500 text-primary-500 group-hover:scale-125 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-primary-800 to-dark opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              </Link>

              <Link
                to="/about"
                className="group w-full sm:w-auto px-12 py-7 bg-white text-dark font-black rounded-[2.5rem] border-4 border-gray-100 hover:border-dark hover:bg-dark hover:text-white transition-all duration-500 text-center text-lg"
              >
                The Blueprint
                <ArrowRight className="inline-flex ml-3 w-6 h-6 group-hover:translate-x-3 transition-transform" />
              </Link>
            </Motion.div>

            {/* Micro-Trust Infrastructure */}
            <Motion.div
              className="pt-16 grid grid-cols-3 gap-10 border-t border-gray-100"
              variants={staggerContainer(0.1, 0.6)}
            >
              {[
                {
                  label: "Transparency",
                  icon: ShieldCheck,
                  color: "text-primary-600",
                },
                {
                  label: "Community",
                  icon: Users,
                  color: "text-secondary-500",
                },
                {
                  label: "GlobalReach",
                  icon: Globe,
                  color: "text-primary-700",
                },
              ].map((badge, i) => (
                <Motion.div
                  key={i}
                  className="space-y-4 group cursor-default"
                  variants={scaleIn(i * 0.1)}
                >
                  <div
                    className={`p-3 rounded-2xl bg-gray-50 inline-block group-hover:bg-white group-hover:shadow-xl transition-all duration-500 ${badge.color}`}
                  >
                    <badge.icon className="w-7 h-7 group-hover:rotate-12 transition-transform" />
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 group-hover:text-dark transition-colors">
                    {badge.label}
                  </div>
                </Motion.div>
              ))}
            </Motion.div>
          </div>

          {/* MEDIA RIGHT: The "Aurelius" Frame */}
          <Motion.div
            className="relative lg:h-[800px] flex items-center justify-center"
            variants={fadeIn("left", 0.6)}
          >
            {/* The Main Stage */}
            <div className="relative group p-4 sm:p-6 lg:p-8 bg-white rounded-[4rem] sm:rounded-[5rem] lg:rounded-[6rem] shadow-[0_100px_200px_-50px_rgba(0,0,0,0.25)] border border-gray-100 rotate-2 group-hover:rotate-0 transition-transform duration-1000">
              <div className="relative rounded-[3rem] sm:rounded-[4rem] lg:rounded-[5rem] overflow-hidden">
                <img
                  src={heroImg}
                  alt="Community Sovereignty"
                  className="w-full h-full object-cover aspect-[4/5] scale-110 group-hover:scale-100 transition-transform duration-[4s] cubic-bezier(0.4, 0, 0.2, 1)"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity" />
              </div>

              {/* Premium Floating Status */}
              <div className="absolute top-12 right-12 flex items-center gap-2 px-4 py-2 bg-white/40 backdrop-blur-md rounded-full border border-white/50 text-white font-black text-[10px] uppercase tracking-widest shadow-2xl">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-ping" />
                Live: Site Deployment
              </div>
            </div>

            {/* Performance Widgets */}
            <Motion.div
              className="absolute -left-12 bottom-20 z-20 glass-card-premium p-8 rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border-white"
              {...floatAnimation}
            >
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-primary-600 text-white flex items-center justify-center shadow-lg shadow-primary-500/30">
                  <Users className="w-8 h-8" />
                </div>
                <div>
                  <div className="text-4xl font-black text-dark tracking-tighter">
                    {livesImpacted}
                  </div>
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Direct Lives Impacted
                  </div>
                </div>
              </div>
            </Motion.div>

            <Motion.div
              className="absolute -right-8 top-10 z-20 glass-card-dark-premium p-8 rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)]"
              animate={{ y: [0, -20, 0] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
            >
              <div className="space-y-4 text-center min-w-[180px]">
                <div className="text-3xl font-black text-white text-glow-secondary">
                  {annualGoal}
                </div>
                <div className="text-[10px] font-black text-secondary-400 uppercase tracking-widest">
                  Annual Impact Goal
                </div>
                <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
                  <Motion.div
                    className="bg-secondary-500 h-full shadow-[0_0_20px_#f59e0b]"
                    initial={{ width: "0%" }}
                    animate={{ width: "85%" }}
                    transition={{ duration: 2.5, delay: 1.5 }}
                  />
                </div>
                <div className="text-[9px] font-bold text-gray-400 flex justify-between uppercase">
                  <span>85% Reached</span>
                  <span>Q1 Phase</span>
                </div>
              </div>
            </Motion.div>

            {/* Decorative Background Glows */}
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary-200/30 rounded-full blur-[120px] -z-10" />
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-secondary-200/30 rounded-full blur-[120px] -z-10" />
          </Motion.div>
        </Motion.div>
      </div>
    </section>
  );
};

export default HeroModern;
