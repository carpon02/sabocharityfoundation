import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchOverviewAnalytics } from "../features/analytics/analyticsSlice";
import {
  Heart,
  ArrowRight,
  ShieldCheck,
  Users,
  TrendingUp,
} from "lucide-react";
import { motion as Motion } from "framer-motion";
import { fadeIn, staggerContainer, textVariant } from "../utils/animations";
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
  const totalRaised = overviewStats
    ? `₦${(overviewStats.totalRaised / 1000000).toFixed(1)}M+`
    : "₦12.5M+";

  return (
    <section className="relative min-h-screen flex items-center bg-white overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImg}
          alt="Sabo Community"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/70 lg:to-white/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-white/50" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Content */}
          <Motion.div
            className="space-y-8 max-w-xl"
            variants={staggerContainer(0.1, 0)}
            initial="hidden"
            animate="show"
          >
            {/* Badge */}
            <Motion.div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold"
              variants={fadeIn("down", 0.1)}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Empowering Sabo Youth Since 2020
            </Motion.div>

            {/* Headline */}
            <Motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-gray-900 tracking-tight leading-[1.1]"
              variants={textVariant(0.2)}
            >
              Building a{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                Brighter Future
              </span>{" "}
              for Every Child
            </Motion.h1>

            {/* Subtext */}
            <Motion.p
              className="text-lg text-gray-600 leading-relaxed max-w-lg"
              variants={fadeIn("up", 0.3)}
            >
              We don't just give aid — we build lasting independence. Connecting
              hearts worldwide to transform lives through education, healthcare,
              and empowerment in Sabo, Ibadan.
            </Motion.p>

            {/* CTAs */}
            <Motion.div
              className="flex flex-col sm:flex-row items-start gap-4"
              variants={fadeIn("up", 0.4)}
            >
              <Link
                to="/make-donation"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-gray-900 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-all duration-200 shadow-lg shadow-gray-900/20 hover:shadow-emerald-700/30"
              >
                <Heart className="w-5 h-5 fill-emerald-400 text-emerald-400 group-hover:scale-110 transition-transform" />
                Donate Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/about"
                className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 font-semibold rounded-xl border-2 border-gray-200 hover:border-gray-900 transition-all duration-200"
              >
                Learn Our Story
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Motion.div>

            {/* Trust Badges */}
            <Motion.div
              className="flex items-center gap-6 pt-4"
              variants={fadeIn("up", 0.5)}
            >
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <ShieldCheck size={16} className="text-emerald-600" />
                <span className="font-medium">CAC Registered</span>
              </div>
              <div className="w-px h-4 bg-gray-200" />
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <ShieldCheck size={16} className="text-emerald-600" />
                <span className="font-medium">100% Transparent</span>
              </div>
            </Motion.div>
          </Motion.div>

          {/* Right: Stats Cards (visible on lg+) */}
          <Motion.div
            className="hidden lg:flex flex-col gap-5 items-end"
            variants={staggerContainer(0.15, 0.4)}
            initial="hidden"
            animate="show"
          >
            {/* Stats Card 1 */}
            <Motion.div
              variants={fadeIn("left", 0.1)}
              className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-lg w-72"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <Users size={22} className="text-emerald-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {livesImpacted}
                  </div>
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lives Impacted
                  </div>
                </div>
              </div>
            </Motion.div>

            {/* Stats Card 2 */}
            <Motion.div
              variants={fadeIn("left", 0.2)}
              className="bg-gray-900 text-white rounded-2xl p-6 shadow-lg w-72"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <TrendingUp size={22} className="text-emerald-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{totalRaised}</div>
                  <div className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Total Raised
                  </div>
                </div>
              </div>
              <div className="mt-4 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <Motion.div
                  className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: "78%" }}
                  transition={{ duration: 1.5, delay: 1 }}
                />
              </div>
            </Motion.div>

            {/* Stats Card 3 */}
            <Motion.div
              variants={fadeIn("left", 0.3)}
              className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-lg w-72"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                  <ShieldCheck size={22} className="text-amber-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">100%</div>
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transparency
                  </div>
                </div>
              </div>
            </Motion.div>
          </Motion.div>
        </div>

        {/* Mobile Stats Bar */}
        <Motion.div
          className="grid grid-cols-3 gap-3 mt-12 lg:hidden"
          variants={fadeIn("up", 0.6)}
          initial="hidden"
          animate="show"
        >
          <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm text-center">
            <div className="text-lg font-bold text-gray-900">
              {livesImpacted}
            </div>
            <div className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mt-0.5">
              Lives Impacted
            </div>
          </div>
          <div className="p-4 rounded-xl bg-gray-900 text-white text-center shadow-sm">
            <div className="text-lg font-bold">{totalRaised}</div>
            <div className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mt-0.5">
              Total Raised
            </div>
          </div>
          <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm text-center">
            <div className="text-lg font-bold text-gray-900">100%</div>
            <div className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mt-0.5">
              Transparent
            </div>
          </div>
        </Motion.div>
      </div>
    </section>
  );
};

export default HeroModern;
