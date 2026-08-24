import { motion as Motion } from "framer-motion";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";
import { fadeIn, staggerContainer, scaleIn } from "../utils/animations";
import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";

const pillars = [
  {
    title: "Education",
    desc: "Building classrooms and providing scholarships.",
    color: "text-primary-600",
    bg: "bg-primary-50",
  },
  {
    title: "Healthcare",
    desc: "Equipping rural clinics and medical outreaches.",
    color: "text-secondary-600",
    bg: "bg-secondary-50",
  },
  {
    title: "Welfare",
    desc: "Empowering families with sustainable resources.",
    color: "text-primary-600",
    bg: "bg-primary-50",
  },
];

const WhatWeDo = () => {
  return (
    <section className="w-full bg-paper py-20 sm:py-32 lg:py-40 px-4 relative overflow-hidden">
      {/* Background Polish */}
      <Motion.div
        className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-900/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"
        animate={{ x: [0, 50, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 15, repeat: Infinity }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32 items-center">
          {/* TEXT SECTION: Strategic Narrative */}
          <Motion.div
            className="space-y-10 sm:space-y-12"
            variants={staggerContainer(0.1, 0)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <div className="space-y-6 sm:space-y-8">
              <Motion.div
                className="inline-flex items-center gap-3 px-4 sm:px-6 py-1.5 sm:py-2 rounded-full glass-card border-gray-100 text-secondary-600 font-black text-[10px] uppercase tracking-[0.3em] shadow-sm"
                variants={fadeIn("down", 0.2)}
              >
                <ShieldCheck size={14} className="text-secondary-500" />
                Our Mission
              </Motion.div>

              <Motion.h2
                className="text-5xl sm:text-7xl md:text-8xl font-black text-dark tracking-tighter leading-[0.85]"
                variants={fadeIn("up", 0.3)}
              >
                Beyond <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-700 via-primary-500 to-primary-800 text-glow-primary">
                  Philanthropy.
                </span>
              </Motion.h2>

              <Motion.p
                className="text-lg sm:text-xl text-gray-500 leading-relaxed font-medium max-w-xl"
                variants={fadeIn("up", 0.4)}
              >
                We build strong, self-sufficient communities. Our programs
                are carefully designed to create lasting change and
                resilience across Sabo, Ibadan.
              </Motion.p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:gap-6">
              {pillars.map((item, i) => (
                <Motion.div
                  key={i}
                  variants={fadeIn("up", 0.5 + i * 0.1)}
                  whileHover={{ x: 10, scale: 1.02 }}
                  className="flex items-start gap-4 sm:gap-6 p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] bg-white border border-gray-100 hover:border-primary-100 hover:shadow-2xl transition-all duration-500 group cursor-default"
                >
                  <div
                    className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl ${item.bg} ${item.color} group-hover:bg-primary-600 group-hover:text-white transition-all duration-500 shadow-sm`}
                  >
                    <CheckCircle2 size={24} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xl sm:text-2xl font-black text-dark tracking-tight">
                      {item.title}
                    </h4>
                    <p className="text-sm sm:text-base text-gray-500 font-medium">
                      {item.desc}
                    </p>
                  </div>
                </Motion.div>
              ))}
            </div>

            <Link
              to="/campaigns"
              className="group relative inline-flex items-center justify-center px-10 sm:px-12 py-5 sm:py-6 font-black text-white transition-all bg-dark rounded-[1.5rem] sm:rounded-[2rem] hover:bg-primary-900 hover-scale-subtle shadow-2xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative flex items-center gap-3 text-sm sm:text-base">
                Explore Our Programs
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </span>
            </Link>
          </Motion.div>

          {/* MEDIA SECTION: The Vision Stack */}
          <Motion.div
            className="relative"
            variants={fadeIn("left", 0.4)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <div className="relative rounded-[40px] sm:rounded-[60px] lg:rounded-[80px] overflow-hidden shadow-[0_100px_150px_-30px_rgba(0,0,0,0.3)] border-[10px] sm:border-[15px] lg:border-[20px] border-white group">
              <div className="scan-line opacity-10" />
              <img
                src={assets.what_we_do_img}
                alt="Impact"
                className="w-full h-full object-cover aspect-[4/5] group-hover:scale-110 transition-transform duration-[4s] ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-transparent to-transparent opacity-60" />
            </div>

            {/* Premium Intelligence Card */}
            <Motion.div
              className="absolute -top-6 sm:-top-12 -right-4 sm:-right-12 glass-card-premium p-6 sm:p-12 rounded-[2rem] sm:rounded-[4rem] shadow-3xl max-w-[240px] sm:max-w-[320px] border-white"
              variants={scaleIn(0.6)}
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-4">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[8px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Our Promise
                </span>
              </div>
              <div className="text-4xl sm:text-6xl font-black text-dark tracking-tighter">
                100%
              </div>
              <p className="text-gray-600 font-black text-[8px] sm:text-xs mt-2 sm:mt-3 leading-relaxed uppercase tracking-widest">
                Every donation goes directly to community programmes.
              </p>
              <div className="w-full h-1 bg-gray-100 rounded-full mt-4 sm:mt-6 relative overflow-hidden">
                <Motion.div
                  className="absolute inset-y-0 left-0 bg-secondary-500 shadow-[0_0_10px_#f59e0b]"
                  initial={{ width: "0%" }}
                  whileInView={{ width: "100%" }}
                  transition={{ duration: 2, delay: 1 }}
                />
              </div>
            </Motion.div>

            {/* Decorative Geometry */}
            <Motion.div
              className="absolute -bottom-8 sm:-bottom-16 -left-8 sm:-left-16 w-32 sm:w-64 h-32 sm:h-64 bg-primary-100/50 rounded-[2rem] sm:rounded-[4rem] -rotate-12 -z-10 blur-2xl"
              animate={{ rotate: [-12, -20, -12], scale: [1, 1.1, 1] }}
              transition={{ duration: 8, repeat: Infinity }}
            />
          </Motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhatWeDo;
