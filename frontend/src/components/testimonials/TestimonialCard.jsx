import React from "react";
import { Quote, Zap, ShieldCheck } from "lucide-react";
import { motion as Motion } from "framer-motion";

const TestimonialCard = ({ current, activeIndex }) => {
  return (
    <div className="relative group max-w-6xl mx-auto">
      {/* Cinematic Shadow/Depth Layer */}
      <div className="absolute inset-x-8 -bottom-12 h-24 bg-dark/20 blur-[100px] rounded-[6rem] -z-10 group-hover:bg-primary-900/10 transition-colors duration-700" />

      <div className="relative p-8 sm:p-14 lg:p-20 rounded-[3rem] sm:rounded-[4rem] lg:rounded-[5rem] glass-card-premium shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] border-white/80 overflow-visible">
        {/* Visual Accent: Top Right Glow */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-primary-400/10 to-transparent rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

        <div className="relative z-10 grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          {/* MEDIA SIDE: The Sovereign Portrait */}
          <div className="lg:col-span-4 flex flex-col items-center lg:items-start space-y-10">
            <div className="relative">
              {/* Floating Frame Effect */}
              <Motion.div
                className="relative w-48 h-48 sm:w-56 sm:h-56 lg:w-72 lg:h-72 rounded-[3.5rem] sm:rounded-[4.5rem] overflow-hidden shadow-2xl border-8 border-white group-hover:rotate-2 transition-transform duration-1000 ease-out z-10"
                layoutId="avatar"
              >
                <img
                  className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-[3s]"
                  src={current.image}
                  alt={current.name}
                />
              </Motion.div>

              {/* Orbital Status Badge */}
              <Motion.div
                className="absolute -bottom-4 -right-4 w-16 h-16 glass-card-dark-premium rounded-[2rem] flex items-center justify-center text-white shadow-2xl z-20 border-white/20"
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Quote
                  size={24}
                  className="fill-primary-500 text-primary-500"
                />
              </Motion.div>

              {/* Decorative Geometric Element */}
              <div className="absolute -top-8 -left-8 w-32 h-32 border-2 border-primary-100 rounded-full -z-10 group-hover:scale-110 transition-transform duration-1000 opacity-40" />
            </div>

            <div className="text-center lg:text-left space-y-3">
              <h4 className="text-2xl sm:text-3xl font-black text-dark tracking-tighter uppercase leading-none font-outfit">
                {current.name}
              </h4>
              <div className="flex flex-wrap items-center gap-3 justify-center lg:justify-start">
                <span className="px-4 py-1.5 glass-card-dark-premium text-white rounded-full text-[9px] font-black uppercase tracking-[0.3em] shadow-lg border-white/10">
                  {current.role}
                </span>
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-4 py-1.5 rounded-full border border-gray-100">
                  {current.date}
                </span>
              </div>
            </div>
          </div>

          {/* CONTENT SIDE: The Strategic Narrative */}
          <div className="lg:col-span-8 space-y-10">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-primary-100 rounded-xl text-primary-600">
                <Zap size={20} className="fill-primary-600 animate-pulse" />
              </div>
              <div className="space-y-0.5">
                <span className="block text-[9px] font-black uppercase tracking-[0.5em] text-gray-400">
                  Strategic Mission Log
                </span>
                <span className="block text-[8px] font-bold text-primary-600/60 uppercase tracking-widest">
                  Encryption Level: Sovereign
                </span>
              </div>
            </div>

            <p className="text-2xl sm:text-3xl lg:text-4xl font-medium text-dark leading-[1.2] italic tracking-tight text-pretty font-outfit">
              “{current.comment}”
            </p>

            {/* Impact Integrity Footer */}
            <div className="pt-10 border-t border-primary-100 flex flex-col sm:flex-row items-center gap-8">
              <div className="flex -space-x-5">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-14 h-14 rounded-[1.75rem] border-4 border-white bg-gray-50 overflow-hidden shadow-xl hover:z-30 transition-all hover:-translate-y-3 cursor-pointer group/avatar"
                  >
                    <img
                      src={`https://i.pravatar.cc/150?u=${i + activeIndex + 10}`}
                      alt="agent"
                      className="w-full h-full object-cover grayscale group-hover/avatar:grayscale-0 transition-all duration-500"
                    />
                  </div>
                ))}
              </div>
              <div className="text-center sm:text-left space-y-1.5 flex-1 w-full">
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <ShieldCheck size={14} className="text-green-500" />
                  <p className="text-[10px] font-black text-dark tracking-tight uppercase">
                    +1.4K Verified Mission Nodes
                  </p>
                </div>
                <div className="h-1.5 w-full bg-gray-100/50 rounded-full overflow-hidden max-w-[200px] mx-auto sm:mx-0 relative">
                  <Motion.div
                    className="h-full bg-primary-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] relative overflow-hidden"
                    initial={{ width: "0%" }}
                    whileInView={{ width: "88%" }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                  >
                    <div className="absolute inset-0 bg-shimmer-fast opacity-30" />
                  </Motion.div>
                </div>
                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                  Participating in Sovereign Action Network
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Cinematic Scan Line Internal */}
        <div className="absolute inset-0 scan-line opacity-[0.05] z-0 pointer-events-none" />
      </div>
    </div>
  );
};

export default TestimonialCard;
