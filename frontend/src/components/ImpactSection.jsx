import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { assets } from "../assets/assets";
import { Users, School, HeartHandshake, TrendingUp, Star } from "lucide-react";
import { motion as Motion } from "framer-motion";
import { fadeIn, staggerContainer, scaleIn } from "../utils/animations";
import { fetchOverviewAnalytics } from "../features/analytics/analyticsSlice";
import AnimatedCounter from "./AnimatedCounter";

const ImpactSection = () => {
  const dispatch = useDispatch();
  const { overviewStats } = useSelector((state) => state.analytics);

  useEffect(() => {
    dispatch(fetchOverviewAnalytics());
  }, [dispatch]);

  const stats = [
    {
      icon: Users,
      value: overviewStats ? Math.floor(overviewStats.livesImpacted) : 5000,
      suffix: "+",
      label: "Lives Impacted",
      pills: "bg-primary-100 text-primary-700",
    },
    {
      icon: School,
      value: overviewStats ? overviewStats.totalCampaigns : 50,
      suffix: "+",
      label: "Active Campaigns",
      pills: "bg-secondary-100 text-secondary-700",
    },
    {
      icon: HeartHandshake,
      value: overviewStats ? overviewStats.activeVolunteers : 2000,
      suffix: "+",
      label: "Active Volunteers",
      pills: "bg-primary-100 text-primary-700",
    },
    {
      icon: TrendingUp,
      value: overviewStats ? Math.floor(overviewStats.totalRaised / 1000000) : 50,
      prefix: "₦",
      suffix: "M+",
      label: "Direct Funding",
      pills: "bg-secondary-100 text-secondary-700",
    },
  ];

  return (
    <section className="py-20 sm:py-32 bg-paper overflow-hidden relative">
      {/* Cinematic Background Polish */}
      <Motion.div
        className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary-100/30 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* CONTENT LEFT: The Impact Narrative */}
          <Motion.div
            className="space-y-10 sm:space-y-12"
            variants={staggerContainer(0.1, 0)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <div className="space-y-6">
              <Motion.div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary-100/50 border border-secondary-200 text-secondary-700 text-[10px] font-black uppercase tracking-[0.2em]"
                variants={fadeIn("down", 0.2)}
              >
                <TrendingUp size={14} />
                Audited Performance Metrics
              </Motion.div>
              <Motion.h3
                className="text-4xl sm:text-5xl md:text-7xl font-black text-dark tracking-tighter leading-[0.9]"
                variants={fadeIn("up", 0.3)}
              >
                Real Numbers. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-800">
                  Real Sovereignty.
                </span>
              </Motion.h3>
              <Motion.p
                className="text-lg sm:text-xl text-gray-500 font-medium leading-[1.6] max-w-xl"
                variants={fadeIn("up", 0.4)}
              >
                We don't just provide aid; we architecturalize independence. Our
                initiatives are data-driven catalysts for community evolution.
              </Motion.p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
              {stats.map((stat, i) => (
                <Motion.div
                  key={i}
                  variants={fadeIn("up", 0.5 + i * 0.1)}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className={`space-y-4 p-6 sm:p-8 rounded-[2rem] sm:rounded-[3rem] border-gray-100 shadow-xl transition-all duration-500 ${i % 2 === 0 ? 'glass-card-neon-primary' : 'glass-card-neon-secondary'}`}
                >
                  <div
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:rotate-12 ${stat.pills}`}
                  >
                    <stat.icon className="w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-3xl sm:text-4xl font-black text-dark tracking-tighter">
                      <AnimatedCounter
                        end={stat.value}
                        prefix={stat.prefix}
                        suffix={stat.suffix}
                      />
                    </div>
                    <div className="text-[8px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      {stat.label}
                    </div>
                  </div>
                </Motion.div>
              ))}
            </div>
          </Motion.div>

          {/* MEDIA RIGHT: The Proof of Life */}
          <Motion.div
            className="relative"
            variants={fadeIn("left", 0.4)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <div className="relative h-[500px] sm:h-[600px] lg:h-[700px] w-full rounded-[40px] sm:rounded-[60px] lg:rounded-[80px] overflow-hidden shadow-[0_80px_150px_-30px_rgba(0,0,0,0.3)] border-[10px] sm:border-[16px] border-white group">
              <div className="scan-line opacity-10" />
              <img
                src={assets.impact_img}
                alt="Community Impact"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[5s] ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-transparent to-transparent opacity-60" />
            </div>

            {/* Premium Trust Badge */}
            <Motion.div
              className="absolute -bottom-6 sm:-bottom-12 -left-4 sm:-left-12 glass-card-premium p-6 sm:p-12 rounded-[2rem] sm:rounded-[4rem] shadow-2xl max-w-[280px] sm:max-w-sm border-white/50 backdrop-blur-3xl"
              variants={scaleIn(0.6)}
              whileInView={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="flex gap-1.5 sm:gap-2 mb-4 sm:mb-6">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={14}
                    className="fill-secondary-500 text-secondary-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                  />
                ))}
              </div>
              <p className="text-base sm:text-lg font-bold text-dark leading-tight italic">
                "The sovereign educational support protocols have
                architecturalized a brighter trajectory for our youth clusters."
              </p>
              <div className="mt-6 sm:mt-8 flex items-center gap-3 sm:gap-4 border-t border-gray-100 pt-4 sm:pt-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-black text-sm">
                  AM
                </div>
                <div>
                  <div className="text-[10px] sm:text-xs font-black text-dark uppercase tracking-widest">
                    Amina Maikori
                  </div>
                  <div className="text-[8px] sm:text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                    Community Sovereign Lead
                  </div>
                </div>
              </div>
            </Motion.div>
          </Motion.div>
        </div>
      </div>
    </section>
  );
};

export default ImpactSection;
