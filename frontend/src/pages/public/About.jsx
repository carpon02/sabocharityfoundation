import React from "react";
import {
  ArrowRight,
  Heart,
  Users,
  BookOpen,
  TrendingUp,
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

const stats = [
  {
    icon: Users,
    value: "5,000+",
    label: "Lives Impacted",
    color: "text-primary-600",
    bg: "bg-primary-50",
  },
  {
    icon: BookOpen,
    value: "1,200+",
    label: "Children Educated",
    color: "text-secondary-600",
    bg: "bg-secondary-50",
  },
  {
    icon: Heart,
    value: "500+",
    label: "Families Supported",
    color: "text-primary-600",
    bg: "bg-primary-50",
  },
  {
    icon: Award,
    value: "50+",
    label: "Active Projects",
    color: "text-secondary-600",
    bg: "bg-secondary-50",
  },
];

const About = () => {
  return (
    <div className="bg-paper overflow-hidden">
      {/* --- PREMIUM HERO SECTION --- */}
      <section className="relative pt-32 pb-24 overflow-hidden bg-primary-950 text-white">
        {/* Abstract Background Flashes */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-800/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary-800/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-10 animate-fade-in-up">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-secondary-400 font-bold text-xs uppercase tracking-widest">
                <Sparkles className="w-4 h-4" />
                Since 2010 • Impact First
              </div>

              <h1 className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter">
                Our legacy of <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-400 to-secondary-500 underline decoration-primary-500/30">
                  Hope.
                </span>
              </h1>

              <p className="text-xl text-gray-400 leading-relaxed max-w-xl">
                The Sabo Youth Foundation was born from a simple belief: that
                every child in Ibadan deserves a seat at the table of
                opportunity.
              </p>

              <div className="flex items-center gap-8 pt-6">
                <div className="space-y-1">
                  <div className="text-3xl font-black text-white">14+</div>
                  <div className="text-[10px] text-gray-500 uppercase font-black tracking-widest">
                    Years of Dedication
                  </div>
                </div>
                <div className="w-px h-12 bg-white/10" />
                <div className="space-y-1">
                  <div className="text-3xl font-black text-white">20k+</div>
                  <div className="text-[10px] text-gray-500 uppercase font-black tracking-widest">
                    Global Supporters
                  </div>
                </div>
              </div>
            </div>

            <div className="relative animate-fade-in-up stagger-1">
              <div className="relative z-10 rounded-[3rem] overflow-hidden border-[16px] border-white/5 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&fit=crop"
                  alt="About Us"
                  className="w-full h-full object-cover aspect-[4/3] hover:scale-110 transition-transform duration-[2s]"
                />
              </div>
              {/* Floating glass badge */}
              <div className="absolute -bottom-8 -left-8 glass-card-dark p-8 rounded-[2rem] shadow-2xl animate-float">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-secondary-500 flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-sm font-bold text-white max-w-[120px] leading-tight">
                    Verified Transparent Organization
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- STATS SECTION (GLASSCARDS) --- */}
      <section className="relative -mt-20 z-20 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="glass-card p-10 rounded-[2.5rem] flex flex-col items-center text-center space-y-4 hover:-translate-y-2 transition-transform shadow-xl"
            >
              <div
                className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center`}
              >
                <stat.icon className="w-7 h-7" />
              </div>
              <div>
                <div className="text-4xl font-black text-dark">
                  {stat.value}
                </div>
                <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- MISSION & VISION (HIGH CONTRAST) --- */}
      <section className="py-32 bg-paper">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10">
            <div className="p-12 md:p-16 rounded-[4rem] bg-gray-50 border border-gray-100 space-y-8 hover:bg-gray-100 transition-colors group">
              <div className="w-20 h-20 rounded-3xl bg-primary-900 flex items-center justify-center group-hover:rotate-6 transition-transform">
                <Target className="w-10 h-10 text-primary-400" />
              </div>
              <h2 className="text-5xl font-black text-dark leading-tight">
                Our <span className="text-primary-700">Mission</span>
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed font-medium">
                To disrupt generational poverty by providing high-quality
                educational infrastructure, accessible healthcare, and strategic
                economic empowerment for the youth of Ibadan.
              </p>
            </div>

            <div className="p-12 md:p-16 rounded-[4rem] bg-primary-900 text-white space-y-8 hover:bg-primary-950 transition-colors group">
              <div className="w-20 h-20 rounded-3xl bg-white/10 flex items-center justify-center group-hover:-rotate-6 transition-transform">
                <Eye className="w-10 h-10 text-secondary-400" />
              </div>
              <h2 className="text-5xl font-black leading-tight text-white">
                Our <span className="text-secondary-400">Vision</span>
              </h2>
              <p className="text-xl text-primary-100 leading-relaxed font-medium">
                A Lagos and Ibadan where every single young individual,
                regardless of their background, has the tools to thrive and lead
                in the global economy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- CORE SECTIONS (EXISTING COMPONENTS) --- */}
      <div className="space-y-0">
        <WhatWeDo />
        <History />
        <Team />
        <FAQ />
      </div>

      {/* --- PREMIUM CTA FINALE --- */}
      <section className="py-32 px-4 bg-paper relative overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-px bg-gradient-to-r from-transparent via-gray-100 to-transparent" />

        <div className="max-w-7xl mx-auto relative rounded-[5rem] overflow-hidden bg-dark p-12 md:p-32 text-center group">
          {/* Abstract Glows */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-900/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 group-hover:bg-primary-500/10 transition-colors duration-1000" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary-900/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10 max-w-4xl mx-auto space-y-12">
            <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-secondary-500 font-bold text-xs uppercase tracking-[0.3em] animate-pulse">
              Initiative Deployment
            </div>

            <h2 className="text-6xl md:text-8xl font-black text-white leading-[0.85] tracking-tighter">
              The Future is <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">
                Ours to Build.
              </span>
            </h2>

            <p className="text-xl md:text-2xl text-primary-100/60 font-medium leading-relaxed max-w-2xl mx-auto italic">
              "Your contribution is the pulse of our operation. Every classroom
              constructed, every child treated—it starts with your decision to
              act."
            </p>

            <div className="flex flex-wrap justify-center gap-8 pt-6">
              <button className="relative group/btn overflow-hidden px-12 py-6 bg-primary-600 text-white font-black rounded-[2rem] shadow-[0_20px_50px_rgba(16,185,129,0.3)] hover:scale-110 active:scale-95 transition-all">
                <span className="relative z-10 flex items-center gap-3">
                  Become a Vanguard <Users className="w-5 h-5" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-600 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
              </button>

              <button className="relative px-12 py-6 bg-white text-dark font-black rounded-[2rem] shadow-2xl hover:bg-gray-100 hover:scale-110 active:scale-95 transition-all flex items-center gap-3 group/heart">
                Secure Transmission
                <Heart className="w-5 h-5 text-primary-600 group-hover/heart:fill-primary-600 transition-all" />
              </button>
            </div>

            {/* Trust Markers */}
            <div className="pt-16 flex flex-wrap items-center justify-center gap-12 border-t border-white/5 opacity-30">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white">
                <ShieldCheck size={16} className="text-primary-500" />
                Bank-Grade Encryption
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white">
                <Globe size={16} className="text-primary-500" />
                Global Impact Network
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white">
                <Sparkles size={16} className="text-primary-500" />
                Transparency Protocol
              </div>
            </div>
          </div>

          {/* Decorative Corner */}
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary-500/10 rounded-full blur-[80px]" />
        </div>
      </section>
    </div>
  );
};

export default About;
