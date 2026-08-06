import React, { useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";

// Constants
import { testimonials } from "../constants/testimonials";

// Sub-components
import BackgroundOrbs from "./testimonials/BackgroundOrbs";
import TestimonialHeader from "./testimonials/TestimonialHeader";
import TestimonialCard from "./testimonials/TestimonialCard";
import NavigationButtons from "./testimonials/NavigationButtons";
import PaginationMatrix from "./testimonials/PaginationMatrix";

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActiveIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );
  };

  const current = testimonials[activeIndex];

  return (
    <section className="py-16 sm:py-24 lg:py-32 bg-paper relative overflow-hidden min-h-[600px] flex flex-col justify-center">
      <BackgroundOrbs />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <TestimonialHeader />

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
              <TestimonialCard current={current} activeIndex={activeIndex} />
            </Motion.div>
          </AnimatePresence>

          <NavigationButtons onPrev={handlePrev} onNext={handleNext} />

          <PaginationMatrix
            testimonials={testimonials}
            activeIndex={activeIndex}
            onSelect={setActiveIndex}
          />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
