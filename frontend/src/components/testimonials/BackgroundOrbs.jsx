import React from "react";
import { motion as Motion } from "framer-motion";

const BackgroundOrbs = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Deep Master Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-paper via-primary-50/10 to-paper opacity-50" />

      {/* Cinematic Ambiance: Primary Orb */}
      <Motion.div
        className="absolute top-0 left-0 w-[1000px] h-[1000px] bg-primary-600/10 rounded-full blur-[180px] -translate-y-1/2 -translate-x-1/2"
        animate={{
          x: [-150, 150, -150],
          y: [-150, 100, -150],
          scale: [1, 1.3, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      />

      {/* Cinematic Ambiance: Secondary Orb */}
      <Motion.div
        className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-secondary-400/10 rounded-full blur-[150px] translate-y-1/2 translate-x-1/2"
        animate={{
          x: [150, -150, 150],
          y: [150, -100, 150],
          scale: [1.3, 1, 1.3],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />

      {/* Technical Grid Overlay */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] mix-blend-overlay" />

      {/* Impact Dossier Particles: High Persistence */}
      {[...Array(12)].map((_, i) => (
        <Motion.div
          key={i}
          className="absolute w-1 h-1 bg-primary-500 rounded-full"
          initial={{
            x: Math.random() * 100 + "%",
            y: Math.random() * 100 + "%",
            opacity: 0,
          }}
          animate={{
            y: [null, "-30vh"],
            opacity: [0, 0.4, 0],
            scale: [1, 2, 1],
          }}
          transition={{
            duration: 10 + Math.random() * 10,
            repeat: Infinity,
            delay: Math.random() * 10,
          }}
        />
      ))}

      {/* Horizontal Scanning Pulse */}
      <Motion.div
        className="absolute inset-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary-400/20 to-transparent"
        animate={{
          y: ["-100%", "200%"],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
          delay: 2,
        }}
      />
    </div>
  );
};

export default BackgroundOrbs;
