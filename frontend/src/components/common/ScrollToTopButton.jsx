import React, { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";
import { motion as Motion, AnimatePresence } from "framer-motion";

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled up to given distance
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Set the top cordinate to 0
  // make scrolling smooth
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <Motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          onClick={scrollToTop}
          className="fixed bottom-28 right-8 z-[999] p-4 rounded-2xl bg-primary-600 text-white shadow-[0_20px_40px_-10px_rgba(5,150,105,0.4)] hover:bg-primary-700 hover:scale-110 active:scale-95 transition-all duration-300 border border-primary-500/20 backdrop-blur-sm"
          aria-label="Scroll to top"
        >
          <ChevronUp size={24} strokeWidth={3} />
        </Motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTopButton;
