import { motion } from "framer-motion";

// Fade in animation variants
export const fadeIn = (direction = "up", delay = 0) => ({
  hidden: {
    opacity: 0,
    y: direction === "up" ? 40 : direction === "down" ? -40 : 0,
    x: direction === "left" ? 40 : direction === "right" ? -40 : 0,
  },
  show: {
    opacity: 1,
    y: 0,
    x: 0,
    transition: {
      type: "spring",
      duration: 1.2,
      delay,
      ease: [0.25, 0.25, 0.25, 0.75],
    },
  },
});

// Stagger container for children animations
export const staggerContainer = (staggerChildren = 0.1, delayChildren = 0) => ({
  hidden: {},
  show: {
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});

// Scale animation
export const scaleIn = (delay = 0) => ({
  hidden: {
    scale: 0,
    opacity: 0,
  },
  show: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      duration: 0.8,
      delay,
    },
  },
});

// Slide in animation
export const slideIn = (
  direction = "left",
  type = "spring",
  delay = 0,
  duration = 0.75
) => ({
  hidden: {
    x: direction === "left" ? "-100%" : direction === "right" ? "100%" : 0,
    y: direction === "up" ? "100%" : direction === "down" ? "-100%" : 0,
  },
  show: {
    x: 0,
    y: 0,
    transition: {
      type,
      delay,
      duration,
      ease: "easeOut",
    },
  },
});

// Zoom in animation
export const zoomIn = (delay = 0, duration = 0.5) => ({
  hidden: {
    scale: 0,
    opacity: 0,
  },
  show: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "tween",
      delay,
      duration,
      ease: "easeOut",
    },
  },
});

// Text reveal animation
export const textVariant = (delay = 0) => ({
  hidden: {
    y: 50,
    opacity: 0,
  },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      duration: 1.25,
      delay,
    },
  },
});

// Hover scale animation
export const hoverScale = {
  rest: { scale: 1 },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.3,
      type: "spring",
      stiffness: 400,
      damping: 10,
    },
  },
};

// Floating animation
export const floatAnimation = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// Pulse animation
export const pulseAnimation = {
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// Rotate animation
export const rotateAnimation = {
  animate: {
    rotate: [0, 360],
    transition: {
      duration: 20,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

// Viewport animation trigger
export const viewportAnimation = {
  viewport: { once: true, amount: 0.25 },
};

// Export motion component
export { motion };
