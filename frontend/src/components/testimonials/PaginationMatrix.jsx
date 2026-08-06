import React from "react";
import { motion as Motion } from "framer-motion";

const PaginationMatrix = ({ testimonials, activeIndex, onSelect }) => {
  return (
    <div className="flex justify-center items-center gap-10 mt-24 lg:mt-32">
      {testimonials.map((_, i) => (
        <button
          key={i}
          onClick={() => onSelect(i)}
          className="group relative py-4 px-3 focus:outline-none flex flex-col items-center"
        >
          {/* Active Status Ring */}
          {activeIndex === i && (
            <Motion.div
              layoutId="pagination-ring"
              className="absolute -top-1 w-12 h-12 border-2 border-primary-500/30 rounded-full"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="absolute inset-0 bg-primary-500/5 rounded-full animate-pulse" />
            </Motion.div>
          )}

          {/* Node Point */}
          <div
            className={`relative z-10 w-3 h-3 rounded-full transition-all duration-700 ${
              activeIndex === i
                ? "bg-primary-600 shadow-[0_0_15px_rgba(37,99,235,0.8)] scale-125"
                : "bg-gray-200 group-hover:bg-primary-300 scale-100"
            }`}
          />

          {/* Detailed Node ID */}
          <span
            className={`mt-6 text-[9px] font-black uppercase tracking-[0.3em] transition-all duration-500 ${
              activeIndex === i
                ? "opacity-100 translate-y-0 text-primary-700 font-extrabold"
                : "opacity-40 translate-y-2 text-gray-400 group-hover:opacity-100 group-hover:translate-y-0"
            }`}
          >
            NODE:0{i + 1}
          </span>

          {/* Live Indicator */}
          {activeIndex === i && (
            <Motion.div
              className="mt-2 text-[7px] font-bold text-green-500 uppercase tracking-widest flex items-center gap-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <span className="w-1 h-1 bg-green-500 rounded-full animate-ping" />
              Connected
            </Motion.div>
          )}
        </button>
      ))}
    </div>
  );
};

export default PaginationMatrix;
