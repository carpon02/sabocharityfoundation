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
  Users,
  Target,
  Sparkles,
  HeartOff,
} from "lucide-react";
import { motion as Motion } from "framer-motion";
import { fetchAllCampaigns } from "../features/campaign/campaignsSlice";
import { fadeIn, staggerContainer } from "../utils/animations";
import { formatCurrency } from "../utils/formatCurrency";

const categoryConfig = {
  education: {
    icon: GraduationCap,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-500/10",
    badge: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
    bar: "from-blue-500 to-indigo-500",
  },
  health: {
    icon: HeartPulse,
    color: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-500/10",
    badge: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300",
    bar: "from-rose-500 to-red-500",
  },
  infrastructure: {
    icon: Building2,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10",
    badge: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
    bar: "from-amber-500 to-orange-500",
  },
  welfare: {
    icon: HelpingHand,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
    badge: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
    bar: "from-emerald-500 to-teal-500",
  },
  empowerment: {
    icon: HelpingHand,
    color: "text-primary-600 dark:text-primary-400",
    bg: "bg-primary-500/10",
    badge: "bg-primary-100 text-primary-800 dark:bg-primary-900/40 dark:text-primary-300",
    bar: "from-primary-500 to-primary-600",
  },
};

const CausesGrid = () => {
  const dispatch = useDispatch();
  const { campaigns, loading } = useSelector((state) => state.campaigns);

  useEffect(() => {
    dispatch(fetchAllCampaigns({ limit: 4 }));
  }, [dispatch]);

  const displayCampaigns = (campaigns || []).slice(0, 4);

  return (
    <section className="py-24 sm:py-32 bg-dark text-white relative overflow-hidden">
      {/* Background Polish */}
      <Motion.div
        className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-primary-900/10 rounded-full blur-[150px] -translate-x-1/2 pointer-events-none"
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <Motion.div
        className="absolute bottom-1/4 right-0 w-[600px] h-[600px] bg-secondary-900/10 rounded-full blur-[180px] translate-x-1/2 pointer-events-none"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <Motion.div
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16 lg:mb-24"
          variants={staggerContainer(0.1, 0)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <div className="max-w-3xl space-y-6">
            <Motion.div
              className="inline-flex items-center gap-3 px-5 py-2 rounded-full glass-card border-white/10 text-secondary-400 font-black uppercase tracking-[0.3em] text-[10px] sm:text-xs shadow-2xl"
              variants={fadeIn("down", 0.2)}
            >
              <Sparkles className="w-3.5 h-3.5 text-secondary-400 animate-pulse" />
              <span>Active Campaigns</span>
            </Motion.div>
            <Motion.h2
              className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.9] text-white"
              variants={fadeIn("up", 0.3)}
            >
              Building <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-primary-500 to-secondary-400">
                Stronger Communities.
              </span>
            </Motion.h2>
          </div>
          <Motion.p
            className="text-base sm:text-lg text-gray-400 max-w-md font-medium leading-relaxed italic border-l-2 border-primary-500/30 pl-6 py-1"
            variants={fadeIn("left", 0.4)}
          >
            "Targeted programmes. Community-driven execution. Direct funding with 100% transparency."
          </Motion.p>
        </Motion.div>

        {loading && (!campaigns || campaigns.length === 0) ? (
          <div className="flex flex-col justify-center items-center py-24 space-y-4">
            <Loader className="animate-spin text-primary-500" size={48} />
            <p className="text-gray-400 font-black uppercase tracking-[0.3em] text-xs">
              Loading Mission Data...
            </p>
          </div>
        ) : displayCampaigns.length === 0 ? (
          <Motion.div
            className="flex flex-col items-center justify-center py-24 gap-4 text-center"
            variants={fadeIn("up", 0.2)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <HeartOff size={56} className="text-primary-400/50" />
            <h3 className="text-2xl font-bold text-white">No Active Campaigns</h3>
            <p className="text-gray-400 max-w-sm">
              New community projects are being planned. Check back soon or get involved!
            </p>
            <Link
              to="/get-involved"
              className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-bold text-sm rounded-2xl hover:bg-primary-700 transition-all"
            >
              Get Involved <ArrowUpRight size={14} />
            </Link>
          </Motion.div>
        ) : (
          <Motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
            variants={staggerContainer(0.1, 0.2)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {displayCampaigns.map((campaign, i) => {
              const catKey = (campaign.category || "welfare").toLowerCase();
              const catData = categoryConfig[catKey] || categoryConfig.welfare;
              const Icon = catData.icon;

              const raised = campaign.raisedAmount || campaign.raised || 0;
              const target = campaign.targetAmount || campaign.target || 1;
              const progress = Math.min(Math.round((raised / target) * 100), 100);
              const donorsCount = campaign.donorsCount || campaign.donorCount || campaign.donors || 0;

              const imageUrl =
                campaign.images?.[0]?.url ||
                campaign.image ||
                "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&h=400&fit=crop";

              return (
                <Motion.div key={campaign._id || i} variants={fadeIn("up", 0.1 * i)}>
                  <Link
                    to={`/campaigns/${campaign._id || campaign.id}`}
                    className="group flex flex-col h-full rounded-[2.5rem] bg-white/5 border border-white/10 overflow-hidden hover:border-primary-500/50 hover:shadow-[0_20px_50px_-10px_rgba(16,185,129,0.3)] transition-all duration-500 hover:-translate-y-2"
                  >
                    {/* Cover Image & Category Badge */}
                    <div className="relative h-48 sm:h-52 w-full overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={campaign.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/20 to-transparent" />
                      
                      {/* Category Badge */}
                      <div className="absolute top-4 left-4 flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider backdrop-blur-md ${catData.badge}`}>
                          {campaign.category || "Welfare"}
                        </span>
                      </div>

                      {/* Arrow Icon */}
                      <div className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover:bg-primary-500 group-hover:scale-110 transition-all duration-300">
                        <ArrowUpRight size={18} />
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                      <div className="space-y-3">
                        <h3 className="text-xl font-black text-white leading-snug tracking-tight group-hover:text-primary-400 transition-colors line-clamp-2">
                          {campaign.title}
                        </h3>
                        <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 font-medium">
                          {campaign.shortDescription || campaign.description}
                        </p>
                      </div>

                      {/* Progress & Funding Info — Always Visible */}
                      <div className="space-y-3 pt-4 border-t border-white/10">
                        <div className="flex justify-between items-baseline text-xs">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-0.5">Raised</span>
                            <span className="font-black text-white text-sm">{formatCurrency(raised)}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-0.5">Target</span>
                            <span className="font-semibold text-gray-300">{formatCurrency(target)}</span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                          <Motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${progress}%` }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                            className={`bg-gradient-to-r ${catData.bar} h-full rounded-full`}
                          />
                        </div>

                        {/* Footer stats */}
                        <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-wider pt-1">
                          <span className="flex items-center gap-1">
                            <Users size={12} className="text-primary-400" />
                            {donorsCount} Donors
                          </span>
                          <span className="text-primary-400 font-black">
                            {progress}% Funded
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </Motion.div>
              );
            })}
          </Motion.div>
        )}

        {/* View All Campaigns Link */}
        <Motion.div
          className="mt-16 text-center"
          variants={fadeIn("up", 0.4)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <Link
            to="/campaigns"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-white/5 border border-white/10 hover:border-primary-500/50 hover:bg-white/10 text-white font-black uppercase tracking-[0.2em] text-xs transition-all duration-300 group"
          >
            <span>Explore All Campaigns</span>
            <ArrowUpRight size={16} className="text-primary-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Link>
        </Motion.div>
      </div>
    </section>
  );
};

export default CausesGrid;
