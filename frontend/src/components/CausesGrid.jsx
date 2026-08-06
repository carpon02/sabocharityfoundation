import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  GraduationCap,
  HeartPulse,
  Building2,
  HelpingHand,
  ArrowUpRight,
  Loader,
} from "lucide-react";
import { motion as Motion } from "framer-motion";
import { fetchAllCampaigns } from "../features/campaign/campaignsSlice";
import { fadeIn, staggerContainer } from "../utils/animations";

const categoryIcons = {
  education: {
    icon: GraduationCap,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    glow: "shadow-blue-500/20",
  },
  health: {
    icon: HeartPulse,
    color: "text-red-500",
    bg: "bg-red-500/10",
    glow: "shadow-red-500/20",
  },
  infrastructure: {
    icon: Building2,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    glow: "shadow-amber-500/20",
  },
  welfare: {
    icon: HelpingHand,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    glow: "shadow-emerald-500/20",
  },
  empowerment: {
    icon: HelpingHand,
    color: "text-primary-500",
    bg: "bg-primary-500/10",
    glow: "shadow-primary-500/20",
  },
  "food relief": {
    icon: HelpingHand,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    glow: "shadow-orange-500/20",
  },
};

const CausesGrid = () => {
  const dispatch = useDispatch();
  const { campaigns, loading } = useSelector((state) => state.campaigns);

  useEffect(() => {
    dispatch(fetchAllCampaigns({ limit: 4 }));
  }, [dispatch]);

  const displayCampaigns = campaigns?.slice(0, 4) || [];

  return (
    <section className="py-24 sm:py-32 lg:py-48 bg-dark-darker text-white relative overflow-hidden">
      {/* Dynamic Ambient Backgrounds */}
      <Motion.div
        className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-primary-900/10 rounded-full blur-[150px] -translate-x-1/2"
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <Motion.div
        className="absolute bottom-1/4 right-0 w-[600px] h-[600px] bg-secondary-900/10 rounded-full blur-[180px] translate-x-1/2"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Motion.div
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-24 lg:mb-32"
          variants={staggerContainer(0.1, 0)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <div className="max-w-3xl space-y-6 sm:space-y-8">
            <Motion.div
              className="inline-flex items-center gap-4 px-5 py-2 rounded-full glass-card border-white/5 text-secondary-500 font-black uppercase tracking-[0.3em] text-[10px] sm:text-xs shadow-2xl"
              variants={fadeIn("down", 0.2)}
            >
              <div className="w-2 h-2 rounded-full bg-secondary-500 animate-pulse" />
              Intelligence Dossier: Current Initiatives
            </Motion.div>
            <Motion.h2
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.85] text-balance"
              variants={fadeIn("up", 0.3)}
            >
              Engineering <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-primary-600 to-secondary-500">
                Resilient Communities.
              </span>
            </Motion.h2>
          </div>
          <Motion.p
            className="text-lg sm:text-xl text-gray-400 max-w-sm font-medium leading-relaxed italic border-l-2 border-primary-900 pl-8 py-2"
            variants={fadeIn("left", 0.4)}
          >
            "Data-driven interventions. Sovereign local execution. Impact that
            scales beyond humanitarian aid."
          </Motion.p>
        </Motion.div>

        {loading ? (
          <div className="flex flex-col justify-center items-center py-32 space-y-6">
            <Loader
              className="animate-spin text-primary-500"
              size={64}
              strokeWidth={1.5}
            />
            <p className="text-gray-500 font-black uppercase tracking-[0.4em] text-[10px]">
              Syncing Mission Data...
            </p>
          </div>
        ) : (
          <Motion.div
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8"
            variants={staggerContainer(0.1, 0.5)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {displayCampaigns.map((campaign, i) => {
              const catData =
                categoryIcons[campaign.category?.toLowerCase()] ||
                categoryIcons["empowerment"];
              const Icon = catData.icon;
              const progress = Math.min(
                Math.round(
                  (campaign.raisedAmount / campaign.targetAmount) * 100
                ),
                100
              );

              return (
                <Motion.div
                  key={campaign._id || i}
                  variants={fadeIn("up", 0.1 * i)}
                  className="group"
                >
                  <Link
                    to={`/campaigns/${campaign._id}`}
                    className="relative flex h-[580px] flex-col justify-end overflow-hidden rounded-[3.5rem] p-10 bg-white/5 backdrop-blur-3xl transition-all duration-700 border border-white/10 hover:border-white/30 hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.6)] group-hover:-translate-y-6"
                  >
                    {/* Category Glow Plate - Dynamic & High-Octane */}
                    <div
                      className={`absolute top-0 right-0 w-48 h-48 blur-[80px] opacity-0 group-hover:opacity-60 transition-all duration-1000 ${catData.bg} animate-pulse`}
                    />

                    {/* Top UI Decor: Mission Metadata */}
                    <div className="absolute top-10 right-10 flex items-center gap-3">
                      <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[8px] font-black uppercase tracking-[0.2em] text-gray-500">
                        Active Node
                      </div>
                      <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/5 border border-white/10 text-white/40 group-hover:bg-secondary-500 group-hover:text-white group-hover:rotate-[360deg] transition-all duration-700 shadow-2xl">
                        <ArrowUpRight className="w-6 h-6" />
                      </div>
                    </div>

                    <div
                      className={`mb-12 w-24 h-24 rounded-[3rem] flex items-center justify-center transition-all duration-700 ${catData.bg} ${catData.glow} group-hover:scale-110 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.5)] border border-white/5`}
                    >
                      <Icon className={`w-12 h-12 ${catData.color}`} />
                    </div>

                    <div className="space-y-6 relative z-10">
                      <div
                        className={`text-[10px] font-black uppercase tracking-[0.6em] transition-colors duration-500 ${catData.color} drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]`}
                      >
                        {campaign.category || "MISSION"}
                      </div>
                      <h3 className="text-4xl font-black leading-[0.9] tracking-tighter group-hover:text-white transition-colors">
                        {campaign.title}
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors line-clamp-3 font-medium italic border-l-2 border-white/5 pl-6">
                        {campaign.shortDescription || campaign.description}
                      </p>
                    </div>

                    {/* Dashboard Style Progress UI: Liquid Impact */}
                    <div className="mt-12 pt-10 border-t border-white/10 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 delay-150">
                      <div className="flex justify-between items-end mb-5">
                        <div className="space-y-1">
                          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 italic">
                            Mission Funding
                          </p>
                          <p className="text-2xl font-black font-mono tracking-tighter text-white">
                            ₦{campaign.raisedAmount.toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p
                            className={`text-2xl font-black font-mono ${catData.color} animate-pulse`}
                          >
                            {progress}%
                          </p>
                        </div>
                      </div>
                      <div className="h-3 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/10 shadow-2xl">
                        <Motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${progress}%` }}
                          transition={{ duration: 2.5, ease: "easeOut" }}
                          className={`h-full rounded-full shadow-[0_0_25px_rgba(255,255,255,0.4)] bg-gradient-to-r from-transparent via-white/20 to-current ${catData.color} bg-current relative overflow-hidden`}
                        >
                           <div className="absolute inset-0 bg-shimmer-fast opacity-30" />
                        </Motion.div>
                      </div>
                    </div>
                  </Link>
                </Motion.div>
              );
            })}
          </Motion.div>
        )}

        {/* Action Link */}
        <Motion.div
          className="mt-20 lg:mt-32 text-center"
          variants={fadeIn("up", 0.8)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <Link
            to="/campaigns"
            className="inline-flex items-center gap-4 text-gray-500 font-black uppercase tracking-[0.4em] text-xs hover:text-white hover:gap-8 transition-all duration-500 group"
          >
            Access Full Directory
            <div className="w-10 h-[1px] bg-gray-800 group-hover:bg-primary-500 group-hover:w-20 transition-all duration-500" />
            <ArrowUpRight className="w-4 h-4 text-primary-500" />
          </Link>
        </Motion.div>
      </div>
    </section>
  );
};

export default CausesGrid;
