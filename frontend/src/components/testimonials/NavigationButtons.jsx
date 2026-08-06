import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion as Motion } from "framer-motion";

const NavigationButtons = ({ onPrev, onNext }) => {
  return (
    <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between pointer-events-none px-4 lg:-mx-16 z-30">
      <Motion.button
        whileHover={{ scale: 1.1, x: -15 }}
        whileTap={{ scale: 0.9 }}
        onClick={onPrev}
        className="pointer-events-auto w-24 h-24 rounded-[3rem] bg-white/40 backdrop-blur-2xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-white/50 flex items-center justify-center text-dark hover:bg-primary-900 hover:text-white transition-all duration-500 group"
      >
        <ChevronLeft
          size={40}
          strokeWidth={1}
          className="group-hover:scale-110 transition-transform"
        />
      </Motion.button>
      <Motion.button
        whileHover={{ scale: 1.1, x: 15 }}
        whileTap={{ scale: 0.9 }}
        onClick={onNext}
        className="pointer-events-auto w-24 h-24 rounded-[3rem] bg-white/40 backdrop-blur-2xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-white/50 flex items-center justify-center text-dark hover:bg-primary-900 hover:text-white transition-all duration-500 group"
      >
        <ChevronRight
          size={40}
          strokeWidth={1}
          className="group-hover:scale-110 transition-transform"
        />
      </Motion.button>
    </div>
  );
};

export default NavigationButtons;
