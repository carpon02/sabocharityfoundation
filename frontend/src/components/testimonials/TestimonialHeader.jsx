import React from "react";
import { Sparkles } from "lucide-react";
import { motion as Motion } from "framer-motion";

const TestimonialHeader = () => {
  return (
    <div className="text-center space-y-8 mb-28">
      <Motion.div
        className="inline-flex items-center gap-4 px-8 py-3 rounded-full glass-card-premium border-white/60 text-primary-800 font-bold text-[11px] uppercase tracking-[0.5em] shadow-xl mx-auto group"
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="relative">
          <Sparkles size={16} className="text-secondary-500 relative z-10" />
          <Motion.div
            className="absolute inset-0 bg-secondary-400/50 blur-lg rounded-full"
            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
        <span className="relative z-10">
          Sabo Impact Dossier: Field Testimonies
        </span>
      </Motion.div>

      <div className="space-y-4">
        <Motion.h2
          className="text-6xl sm:text-7xl md:text-9xl font-black text-dark tracking-[-0.04em] leading-[0.8] text-balance"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Intelligence & <br />
          <span className="text-glow-primary text-primary-700 decoration-secondary-500 decoration-8 underline-offset-[-20px]">
            Sovereign Impact.
          </span>
        </Motion.h2>
        <Motion.p
          className="text-gray-400 font-bold uppercase tracking-[0.3em] text-[10px]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          // Verified Communication Nodes: Activated
        </Motion.p>
      </div>
    </div>
  );
};

export default TestimonialHeader;
