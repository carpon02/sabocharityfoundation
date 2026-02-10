import React, { useState } from "react";
import { Quote, ChevronLeft, ChevronRight, Zap, Sparkles } from "lucide-react";
import { motion as Motion, AnimatePresence } from "framer-motion";

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const testimonials = [
    {
      image:
        "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200",
      name: "Engr. Musa Bello",
      date: "August 2025",
      role: "Strategic Partner",
      comment:
        "The tactical deployment of educational infrastructure in Ibadan is surgical. They aren't just giving aid; they are architecturalizing future sovereignty.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
      name: "Dr. Amina Yusuf",
      date: "September 2025",
      role: "Healthcare Node Lead",
      comment:
        "Their medical outreach protocol is a masterclass in resilience. By establishing intelligence-driven health nodes, we've secured communal longevity.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&auto=format&fit=crop&q=60",
      name: "Babajide Kola",
      date: "October 2025",
      role: "Industrial Agent",
      comment:
        "Joining the mission provided more than liquidity—it delivered the tools for economic persistence. Sabo is building a legacy of true impact.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=60",
      name: "Zainab Abba",
      date: "November 2025",
      role: "Mission Intelligence",
      comment:
        "Every operation involves the community at its core. It's a high-impact environment where youths are the lead agents of transformation.",
    },
  ];

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActiveIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  const current = testimonials[activeIndex];

  return (
    <section className="py-24 sm:py-32 lg:py-48 bg-paper relative overflow-hidden">
      {/* Cinematic Ambiance: Moving Light Orbs */}
      <Motion.div
        className="absolute top-0 left-0 w-[800px] h-[800px] bg-primary-600/5 rounded-full blur-[150px] -translate-y-1/2 -translate-x-1/2"
        animate={{
          x: [-100, 100, -100],
          y: [-100, 50, -100],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <Motion.div
        className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-secondary-500/10 rounded-full blur-[120px] translate-y-1/2 translate-x-1/2"
        animate={{
          x: [100, -100, 100],
          y: [100, -50, 100],
          scale: [1.2, 1, 1.2],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center space-y-6 mb-24">
          <Motion.div
            className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass-card border-gray-100 text-primary-700 font-black text-[10px] uppercase tracking-[0.4em] shadow-sm mx-auto"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Sparkles size={14} className="text-secondary-500" />
            Impact Dossier: Voices of the Mission
          </Motion.div>
          <Motion.h2
            className="text-5xl sm:text-6xl md:text-8xl font-black text-dark tracking-tighter leading-[0.85]"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            Intelligence & <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-900 border-b-8 border-primary-50">
              Sovereign Testimony.
            </span>
          </Motion.h2>
        </div>

        <div className="relative mt-20 px-4 sm:px-12 lg:px-24">
          <AnimatePresence mode="wait">
            <Motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: 100, rotateY: 45 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              exit={{ opacity: 0, x: -100, rotateY: -45 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-6xl mx-auto perspective-1000"
            >
              <div className="relative p-12 sm:p-20 lg:p-28 rounded-[4rem] sm:rounded-[5rem] lg:rounded-[6rem] bg-white/40 backdrop-blur-3xl shadow-[0_100px_200px_-50px_rgba(0,0,0,0.15)] border border-white overflow-hidden group">
                {/* Visual Accent */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary-500/10 to-transparent rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />

                <div className="relative z-10 grid lg:grid-cols-12 gap-16 lg:gap-24 items-center">
                  {/* Media Side */}
                  <div className="lg:col-span-4 flex flex-col items-center lg:items-start space-y-10">
                    <div className="relative">
                      <Motion.div
                        className="w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 rounded-[4rem] overflow-hidden shadow-2xl border-8 border-white group-hover:rotate-3 transition-transform duration-700"
                        layoutId="avatar"
                      >
                        <img
                          className="w-full h-full object-cover"
                          src={current.image}
                          alt={current.name}
                        />
                      </Motion.div>
                      <Motion.div
                        className="absolute -bottom-6 -right-6 w-16 h-16 bg-primary-900 rounded-[2rem] flex items-center justify-center text-white shadow-2xl z-20"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Quote size={28} className="fill-white" />
                      </Motion.div>
                    </div>

                    <div className="text-center lg:text-left space-y-3">
                      <h4 className="text-2xl sm:text-3xl font-black text-dark tracking-tighter uppercase leading-none">
                        {current.name}
                      </h4>
                      <div className="flex flex-wrap items-center gap-3 justify-center lg:justify-start">
                        <span className="px-4 py-1.5 bg-secondary-100/50 text-secondary-700 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-secondary-200">
                          {current.role}
                        </span>
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-200" />
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          {current.date}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Content Side */}
                  <div className="lg:col-span-8 space-y-10 sm:space-y-12">
                    <div className="flex items-center gap-4 text-primary-600">
                      <Zap
                        size={20}
                        className="fill-primary-600 animate-pulse"
                      />
                      <span className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400">
                        Strategic Narrative Log
                      </span>
                    </div>

                    <p className="text-3xl sm:text-4xl lg:text-5xl font-medium text-dark leading-[1.15] italic tracking-tight text-pretty">
                      “{current.comment}”
                    </p>

                    <div className="pt-12 border-t border-gray-100 flex flex-col sm:flex-row items-center gap-8 lg:gap-12">
                      <div className="flex -space-x-4">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className="w-12 h-12 rounded-2xl border-4 border-white bg-gray-100 overflow-hidden shadow-lg hover:z-30 transition-all hover:-translate-y-2 cursor-pointer"
                          >
                            <img
                              src={`https://i.pravatar.cc/100?u=${
                                i + activeIndex
                              }`}
                              alt="agent"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                      <div className="text-center sm:text-left">
                        <p className="text-sm font-black text-dark tracking-tight uppercase">
                          +1,400 Verified Impact Nodes
                        </p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                          Participating in Sovereign Action
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Motion.div>
          </AnimatePresence>

          {/* Precision Navigation: Modern UI Controllers */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between pointer-events-none px-4 sm:px-0 lg:-mx-12">
            <Motion.button
              whileHover={{ scale: 1.1, x: -10 }}
              whileTap={{ scale: 0.9 }}
              onClick={handlePrev}
              className="pointer-events-auto w-20 h-20 rounded-[2.5rem] bg-white shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] border border-gray-50 flex items-center justify-center text-dark hover:bg-dark hover:text-white transition-all transform z-30"
            >
              <ChevronLeft size={32} strokeWidth={1.5} />
            </Motion.button>
            <Motion.button
              whileHover={{ scale: 1.1, x: 10 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleNext}
              className="pointer-events-auto w-20 h-20 rounded-[2.5rem] bg-white shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] border border-gray-50 flex items-center justify-center text-dark hover:bg-dark hover:text-white transition-all transform z-30"
            >
              <ChevronRight size={32} strokeWidth={1.5} />
            </Motion.button>
          </div>

          {/* Advanced Pagination Matrix */}
          <div className="flex justify-center gap-6 mt-20 lg:mt-32">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className="group relative py-4 px-2 focus:outline-none"
              >
                <div
                  className={`h-1.5 rounded-full transition-all duration-700 ${
                    activeIndex === i
                      ? "w-16 bg-primary-600 shadow-[0_0_15px_rgba(37,99,235,0.5)]"
                      : "w-4 bg-gray-200 group-hover:bg-primary-300"
                  }`}
                />
                <span
                  className={`absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] font-black uppercase tracking-widest transition-all duration-500 ${
                    activeIndex === i
                      ? "opacity-100 translate-y-0 text-primary-600"
                      : "opacity-0 translate-y-2"
                  }`}
                >
                  NODE 0{i + 1}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
