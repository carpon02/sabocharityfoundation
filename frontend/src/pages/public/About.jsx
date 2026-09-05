import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchOverviewAnalytics } from "../../features/analytics/analyticsSlice";
import {
  ArrowRight,
  Heart,
  Users,
  BookOpen,
  Award,
  Target,
  Eye,
  Sparkles,
  ShieldCheck,
  Globe,
} from "lucide-react";

import WhatWeDo from "../../components/WhatWeDo";
import History from "../../components/History";
import FAQ from "../../components/FAQ";
import Team from "../../components/Team";
import Meta from "../../components/Meta";

const About = () => {
  const dispatch = useDispatch();
  const { overviewStats } = useSelector((state) => state.analytics);

  useEffect(() => {
    dispatch(fetchOverviewAnalytics());
  }, [dispatch]);

  const stats = [
    {
      icon: Users,
      value: overviewStats
        ? `${Math.floor(overviewStats.livesImpacted).toLocaleString()}+`
        : "—",
      label: "Lives Impacted",
      color: "text-emerald-600",
      bg: "bg-emerald-100",
    },
    {
      icon: BookOpen,
      value: overviewStats
        ? `${overviewStats.totalDonations.toLocaleString()}+`
        : "—",
      label: "Total Donations",
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      icon: Heart,
      value: overviewStats
        ? `${overviewStats.activeVolunteers.toLocaleString()}+`
        : "—",
      label: "Active Volunteers",
      color: "text-rose-600",
      bg: "bg-rose-100",
    },
    {
      icon: Award,
      value: overviewStats ? `${overviewStats.totalCampaigns}+` : "—",
      label: "Active Projects",
      color: "text-amber-600",
      bg: "bg-amber-100",
    },
  ];

  return (
    <div className="bg-white overflow-hidden">
      <Meta
        title="About Our Mission"
        description="Discover the story and heartbeat of Sabo Ibadan Youth Charity Foundation. Founded in 2010, we are on a mission to disrupt poverty and empower the next generation."
      />

      {/* ── HERO SECTION ── */}
      <section className="relative pt-28 pb-32 bg-gray-900 text-white overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-emerald-950/40" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left: Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                Since 2010 · Impact First
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
                Our Legacy of{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                  Hope
                </span>
              </h1>

              <p className="text-lg text-gray-400 leading-relaxed max-w-lg">
                The Sabo Youth Foundation was born from a simple belief: that
                every child in Ibadan deserves a seat at the table of
                opportunity.
              </p>

              <div className="flex items-center gap-8 pt-2">
                <div>
                  <div className="text-2xl font-bold text-white">14+</div>
                  <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                    Years Active
                  </div>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div>
                  <div className="text-2xl font-bold text-white">20k+</div>
                  <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                    Global Supporters
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Image */}
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                <img
                  src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&fit=crop"
                  alt="About Us"
                  className="w-full object-cover aspect-[4/3] hover:scale-105 transition-transform duration-700"
                />
              </div>
              {/* Badge inside image */}
              <div className="absolute bottom-4 left-4 bg-gray-900/80 backdrop-blur-sm px-4 py-3 rounded-xl border border-white/10 shadow-lg">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-xs font-semibold text-white leading-tight">
                    Verified Transparent
                    <br />
                    Organization
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS SECTION ── */}
      <section className="relative -mt-16 z-20 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 lg:p-8 flex flex-col items-center text-center gap-3 shadow-lg border border-gray-100 hover:-translate-y-1 transition-transform duration-200"
            >
              <div
                className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}
              >
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl lg:text-3xl font-bold text-gray-900">
                  {stat.value}
                </div>
                <div className="text-[11px] font-medium text-gray-500 uppercase tracking-wider mt-0.5">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── MISSION & VISION ── */}
      <section className="py-24 sm:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Mission */}
            <div className="p-8 lg:p-12 rounded-2xl bg-gray-50 border border-gray-200 space-y-6 hover:shadow-lg transition-shadow duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Target className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900">
                Our{" "}
                <span className="text-emerald-600">Mission</span>
              </h2>
              <p className="text-base lg:text-lg text-gray-600 leading-relaxed">
                To disrupt generational poverty by providing high-quality
                educational infrastructure, accessible healthcare, and strategic
                economic empowerment for the youth of Ibadan.
              </p>
            </div>

            {/* Vision */}
            <div className="p-8 lg:p-12 rounded-2xl bg-gray-900 text-white space-y-6 hover:shadow-lg transition-shadow duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Eye className="w-7 h-7 text-emerald-400" />
              </div>
              <h2 className="text-3xl lg:text-4xl font-extrabold">
                Our{" "}
                <span className="text-emerald-400">Vision</span>
              </h2>
              <p className="text-base lg:text-lg text-gray-400 leading-relaxed">
                A Lagos and Ibadan where every single young individual,
                regardless of their background, has the tools to thrive and lead
                in the global economy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CORE SECTIONS ── */}
      <div className="space-y-0">
        <WhatWeDo />
        <History />
        <Team />
        <FAQ />
      </div>
    </div>
  );
};

export default About;
