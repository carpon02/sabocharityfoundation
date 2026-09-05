import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  GraduationCap,
  HeartPulse,
  Building2,
  HelpingHand,
  ArrowRight,
  Loader2,
  Users,
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
    badge: "bg-blue-50 text-blue-700 border-blue-200",
    bar: "from-blue-500 to-indigo-500",
  },
  health: {
    icon: HeartPulse,
    badge: "bg-rose-50 text-rose-700 border-rose-200",
    bar: "from-rose-500 to-red-500",
  },
  infrastructure: {
    icon: Building2,
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    bar: "from-amber-500 to-orange-500",
  },
  welfare: {
    icon: HelpingHand,
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    bar: "from-emerald-500 to-teal-500",
  },
  empowerment: {
    icon: HelpingHand,
    badge: "bg-purple-50 text-purple-700 border-purple-200",
    bar: "from-purple-500 to-violet-500",
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
    <section className="py-24 sm:py-32 bg-gray-900 text-white relative overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-emerald-950/50 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <Motion.div
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14 lg:mb-20"
          variants={staggerContainer(0.1, 0)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <div className="max-w-2xl space-y-5">
            <Motion.div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-emerald-400 text-xs font-semibold uppercase tracking-wider"
              variants={fadeIn("down", 0.1)}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Active Campaigns
            </Motion.div>
            <Motion.h2
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight"
              variants={fadeIn("up", 0.2)}
            >
              Building{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                Stronger Communities
              </span>
            </Motion.h2>
            <Motion.p
              className="text-gray-400 text-base sm:text-lg leading-relaxed max-w-lg"
              variants={fadeIn("up", 0.3)}
            >
              Targeted programmes with community-driven execution. Direct
              funding with 100% transparency.
            </Motion.p>
          </div>

          <Motion.div variants={fadeIn("left", 0.3)}>
            <Link
              to="/campaigns"
              className="group inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 text-white text-sm font-semibold rounded-xl hover:bg-white/10 hover:border-white/20 transition-all duration-200"
            >
              View All Campaigns
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </Motion.div>
        </Motion.div>

        {/* Campaign Cards */}
        {loading && (!campaigns || campaigns.length === 0) ? (
          <div className="flex flex-col justify-center items-center py-24 gap-3">
            <Loader2 className="animate-spin text-emerald-500" size={40} />
            <p className="text-gray-400 text-sm font-medium">
              Loading campaigns...
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
            <HeartOff size={48} className="text-gray-600" />
            <h3 className="text-xl font-bold">No Active Campaigns</h3>
            <p className="text-gray-400 max-w-sm text-sm">
              New community projects are being planned. Check back soon or get
              involved!
            </p>
            <Link
              to="/get-involved"
              className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
            >
              Get Involved <ArrowRight size={14} />
            </Link>
          </Motion.div>
        ) : (
          <Motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={staggerContainer(0.08, 0.1)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {displayCampaigns.map((campaign, i) => {
              const catKey = (campaign.category || "welfare").toLowerCase();
              const catData = categoryConfig[catKey] || categoryConfig.welfare;

              const raised = campaign.raisedAmount || campaign.raised || 0;
              const target = campaign.targetAmount || campaign.target || 1;
              const progress = Math.min(
                Math.round((raised / target) * 100),
                100
              );
              const donorsCount =
                campaign.donorsCount ||
                campaign.donorCount ||
                campaign.donors ||
                0;

              const imageUrl =
                campaign.images?.[0]?.url ||
                campaign.image ||
                "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&h=400&fit=crop";

              return (
                <Motion.div
                  key={campaign._id || i}
                  variants={fadeIn("up", 0.1 * i)}
                >
                  <Link
                    to={`/campaigns/${campaign._id || campaign.id}`}
                    className="group flex flex-col h-full rounded-2xl bg-white/5 border border-white/10 overflow-hidden hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300 hover:-translate-y-1"
                  >
                    {/* Image */}
                    <div className="relative h-48 w-full overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={campaign.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent" />

                      {/* Category */}
                      <div className="absolute top-3 left-3">
                        <span
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold uppercase tracking-wide border backdrop-blur-sm ${catData.badge}`}
                        >
                          {campaign.category || "Welfare"}
                        </span>
                      </div>

                      {/* Arrow */}
                      <div className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white group-hover:bg-emerald-500 transition-colors duration-200">
                        <ArrowRight size={14} />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                      <div>
                        <h3 className="text-base font-bold text-white leading-snug group-hover:text-emerald-400 transition-colors line-clamp-2 mb-1.5">
                          {campaign.title}
                        </h3>
                        <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">
                          {campaign.shortDescription || campaign.description}
                        </p>
                      </div>

                      {/* Funding Info */}
                      <div className="space-y-3 pt-3 border-t border-white/10">
                        <div className="flex justify-between items-baseline text-xs">
                          <div>
                            <span className="text-[10px] font-medium uppercase tracking-wider text-gray-500 block">
                              Raised
                            </span>
                            <span className="font-bold text-white text-sm">
                              {formatCurrency(raised)}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] font-medium uppercase tracking-wider text-gray-500 block">
                              Target
                            </span>
                            <span className="font-medium text-gray-400 text-sm">
                              {formatCurrency(target)}
                            </span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                          <Motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${progress}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className={`bg-gradient-to-r ${catData.bar} h-full rounded-full`}
                          />
                        </div>

                        {/* Footer stats */}
                        <div className="flex justify-between items-center text-[11px] text-gray-500">
                          <span className="flex items-center gap-1">
                            <Users size={12} className="text-emerald-500" />
                            {donorsCount} Donors
                          </span>
                          <span className="text-emerald-400 font-semibold">
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
      </div>
    </section>
  );
};

export default CausesGrid;
