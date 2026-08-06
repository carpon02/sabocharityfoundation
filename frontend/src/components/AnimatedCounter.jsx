import React, { useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform, animate, useInView } from "framer-motion";

const AnimatedCounter = ({ end, duration = 2, prefix = "", suffix = "" }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => {
    return prefix + Math.floor(latest).toLocaleString() + suffix;
  });
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, end, { 
        duration, 
        ease: "easeOut" 
      });
      return controls.stop;
    }
  }, [isInView, end, duration, count]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
};

export default AnimatedCounter;
