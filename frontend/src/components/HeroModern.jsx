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
} from "../utils/animations";
import heroImg from "../assets/hero_img.png";

const HeroModern = () => {
  const dispatch = useDispatch();
  const { overviewStats } = useSelector((state) => state.analytics);
  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    setMousePos({
      x: (e.clientX / window.innerWidth - 0.5) * 40,
      y: (e.clientY / window.innerHeight - 0.5) * 40,
    });
  };

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
    <section 
      onMouseMove={handleMouseMove}
      className="relative min-h-[110vh] flex items-center bg-paper overflow-hidden"
    >
      {/* Cinematic Background Polish */}
      <Motion.div
        className="absolute top-0 right-0 w-full lg:w-3/4 h-full bg-gradient-to-l from-primary-50/60 via-transparent to-transparent pointer-events-none"
        animate={{ 
          opacity: [0.4, 0.7, 0.4],
          x: mousePos.x * 0.5,
          y: mousePos.y * 0.5
        }}
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative z-10 w-full min-h-[90vh] flex flex-col items-center justify-center text-center">
        {/* CENTRAL HUB: The Narrative focal point */}
        <Motion.div
          className="relative z-20 space-y-12 max-w-4xl mx-auto"
          variants={staggerContainer(0.1, 0)}
          initial="hidden"
          animate="show"
        >
          <Motion.div
            className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass-card-neon-primary border-primary-500/30 text-primary-900 font-black text-[10px] uppercase tracking-[0.3em] shadow-[0_20px_50px_-10px_rgba(16,185,129,0.2)] group/protocol overflow-hidden mx-auto"
            variants={fadeIn("down", 0.2)}
          >
            <div className="absolute inset-0 bg-shimmer-fast opacity-0 group-hover/protocol:opacity-20 transition-opacity" />
            <Sparkles
              size={14}
              className="text-primary-600 animate-pulse relative z-10"
            />
            <span className="relative z-10">Sabo Impact Protocol v4.0</span>
          </Motion.div>

          <div className="space-y-6">
            <Motion.h1
              className="text-6xl sm:text-7xl md:text-8xl xl:text-[11rem] font-black tracking-[-0.05em] text-dark leading-[0.8] text-balance"
              variants={textVariant(0.3)}
            >
              Spark <br />
              <span className="text-glow-primary text-primary-600">
                Change.
              </span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-800 via-primary-500 to-secondary-500 pb-4">
                Drive Hope.
              </span>
            </Motion.h1>

            <Motion.p
              className="text-lg sm:text-xl lg:text-2xl text-gray-500 max-w-2xl mx-auto leading-relaxed font-semibold italic border-y-2 border-primary-500/20 py-6"
              variants={fadeIn("up", 0.4)}
            >
              "We don't just provide aid; we architecturalize independence.
              Bridging global compassion with sovereign local implementation."
            </Motion.p>
          </div>

          <Motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6"
            variants={fadeIn("up", 0.5)}
          >
            <Link
              to="/make-donation"
              className="group relative w-full sm:w-auto overflow-hidden px-14 py-8 bg-dark text-white font-black rounded-[2.5rem] hover:scale-110 active:scale-95 transition-all duration-500 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)]"
            >
              <div className="absolute inset-0 bg-shimmer-fast opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10 flex items-center justify-center gap-4 text-xl">
                Empower Sabo Youth{" "}
                <Heart className="w-6 h-6 fill-primary-500 text-primary-500 group-hover:scale-125 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-primary-800 to-dark opacity-0 group-hover:opacity-50 transition-opacity duration-700" />
            </Link>

            <Link
              to="/about"
              className="group relative w-full sm:w-auto px-14 py-8 bg-white text-dark font-black rounded-[2.5rem] border-4 border-gray-100 hover:border-dark transition-all duration-500 text-center text-xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-shimmer-fast opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10">
                Our Strategic Vision
                <ArrowRight className="inline-flex ml-3 w-6 h-6 group-hover:translate-x-3 transition-transform" />
              </span>
            </Link>
          </Motion.div>
        </Motion.div>

        {/* DATA NODES: Symmetrical Tactical Interface */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Top Left: Lives Impacted */}
          <Motion.div
            className="absolute left-[5%] top-[20%] pointer-events-auto"
            animate={{ 
              x: mousePos.x * -1.5,
              y: mousePos.y * -1.5,
            }}
          >
            <div className="glass-card-premium p-8 rounded-[3rem] shadow-2xl border-white group/widget overflow-hidden relative">
              {!overviewStats && <div className="absolute inset-0 bg-shimmer-fast opacity-10" />}
              <div className="flex flex-col items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary-600 text-white flex items-center justify-center shadow-lg shadow-primary-500/30">
                  <Users size={28} />
                </div>
                <div>
                  <div className="text-3xl font-black text-dark tracking-tighter">
                    {overviewStats ? livesImpacted : <div className="w-20 h-8 bg-gray-200 animate-pulse rounded-md" />}
                  </div>
                  <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                    Impact Nodes
                  </div>
                </div>
              </div>
            </div>
          </Motion.div>

          {/* Top Right: Annual Goal */}
          <Motion.div
            className="absolute right-[5%] top-[20%] pointer-events-auto"
            animate={{ 
              x: mousePos.x * 1.5,
              y: mousePos.y * -1.5,
            }}
          >
            <div className="glass-card-neon-secondary p-8 rounded-[3rem] shadow-2xl overflow-hidden relative min-w-[200px]">
              {!overviewStats && <div className="absolute inset-0 bg-shimmer-fast opacity-10" />}
              <div className="space-y-4">
                <div className="text-3xl font-black text-white text-glow-secondary leading-none">
                  {overviewStats ? annualGoal : <div className="w-20 h-8 bg-white/20 animate-pulse rounded-md mx-auto" />}
                </div>
                <div className="text-[9px] font-black text-secondary-400 uppercase tracking-widest">
                  Annual Target
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-secondary-500 shadow-[0_0_15px_#f59e0b]" style={{ width: "85%" }} />
                </div>
              </div>
            </div>
          </Motion.div>

          {/* Bottom Left: Transparency */}
          <Motion.div
            className="absolute left-[5%] bottom-[20%] pointer-events-auto"
            animate={{ 
              x: mousePos.x * -1.2,
              y: mousePos.y * 1.2,
            }}
          >
            <div className="glass-card-premium p-6 rounded-[2.5rem] shadow-xl border-white flex items-center gap-4">
              <div className="p-3 bg-gray-50 rounded-xl text-primary-600">
                <ShieldCheck size={20} />
              </div>
              <div className="text-left">
                <div className="text-[8px] font-black text-gray-400 uppercase tracking-[0.3em]">Protocol Log</div>
                <div className="text-[10px] font-black text-dark uppercase tracking-widest">Transparency</div>
              </div>
            </div>
          </Motion.div>

          {/* Bottom Right: Community */}
          <Motion.div
            className="absolute right-[5%] bottom-[20%] pointer-events-auto"
            animate={{ 
              x: mousePos.x * 1.2,
              y: mousePos.y * 1.2,
            }}
          >
            <div className="glass-card-premium p-6 rounded-[2.5rem] shadow-xl border-white flex items-center gap-4">
              <div className="p-3 bg-gray-50 rounded-xl text-secondary-500">
                <Users size={20} />
              </div>
              <div className="text-left">
                <div className="text-[8px] font-black text-gray-400 uppercase tracking-[0.3em]">Network Active</div>
                <div className="text-[10px] font-black text-dark uppercase tracking-widest">Community</div>
              </div>
            </div>
          </Motion.div>

          {/* CENTER IMAGE: "Aurelius" Hub v3.0 */}
          <div className="absolute inset-0 -z-10 flex items-center justify-center opacity-30 select-none pointer-events-none">
             <div className="relative w-[600px] h-[600px] lg:w-[800px] lg:h-[800px] rounded-full overflow-hidden grayscale contrast-125 border-[20px] border-white/40 shadow-inner">
                <img src={heroImg} alt="Backdrop" className="w-full h-full object-cover scale-150" />
                <div className="absolute inset-0 bg-gradient-to-b from-paper/80 via-transparent to-paper/80" />
                <div className="absolute inset-0 bg-paper/20 backdrop-blur-3xl" />
                
                {/* Tactical Scope Overlays */}
                <div className="absolute inset-0 border-[2px] border-primary-500/10 rounded-full animate-ping delay-700" />
                <div className="absolute inset-0 border-[1px] border-primary-500/5 rounded-full scale-110" />
                
                {/* Community Sovereignty Label */}
                <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 text-primary-900/40 text-[10px] font-black uppercase tracking-[0.8em]">
                  Community Sovereignty
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroModern;
