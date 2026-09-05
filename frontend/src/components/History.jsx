import React, { useState } from "react";
import {
  ChevronDown,
  Sparkles,
  BookOpen,
  Heart,
  Activity,
  Globe,
  ShieldCheck,
} from "lucide-react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { fadeIn, staggerContainer } from "../utils/animations";

const historyData = [
  {
    question: "About the Foundation",
    icon: Globe,
    answer:
      "Sabo Ibadan Youth Charity Foundation is a community-driven organization dedicated to uplifting the lives of underprivileged individuals in the Sabo area of Ibadan, Oyo State. The foundation operates within a vibrant Hausa-speaking Muslim neighborhood, known for its rich cultural heritage and active community engagement.",
  },
  {
    question: "Foundational Overview",
    icon: Sparkles,
    answer:
      "Established by a group of passionate youth from Sabo, the foundation focuses on various social initiatives aimed at improving the well-being of residents, including educational support, health initiatives, community development, and religious & cultural activities.",
  },
  {
    question: "Educational Support",
    icon: BookOpen,
    answer:
      "Providing learning materials and scholarships to students in need, ensuring they have access to quality education and opportunities to succeed through strategic tutoring and resource allocation.",
  },
  {
    question: "Health Initiatives",
    icon: Activity,
    answer:
      "Organizing medical outreach programs and health awareness campaigns to improve the overall well-being of the Sabo community, including regular diagnostic clinics and maternal health focus.",
  },
  {
    question: "Community Development",
    icon: Heart,
    answer:
      "Engaging in projects that enhance the infrastructure and environment of the Sabo community, fostering a safer and more vibrant neighborhood for the next generation of leaders.",
  },
  {
    question: "Strategic Impact",
    icon: ShieldCheck,
    answer:
      "Our work has fostered unity and collective responsibility among the youth of Sabo. By addressing social issues and providing crucial support, it plays a pivotal role in the development and empowerment of the Sabo community.",
  },
];

const History = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="py-24 sm:py-32 bg-gray-50 px-4 border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          {/* Left: Header + Origin Card */}
          <Motion.div
            className="space-y-10 lg:sticky lg:top-32"
            variants={staggerContainer(0.1, 0)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <div className="space-y-5">
              <Motion.div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold uppercase tracking-wider"
                variants={fadeIn("down", 0.2)}
              >
                <Globe size={14} />
                Our History
              </Motion.div>

              <Motion.h2
                className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight"
                variants={fadeIn("up", 0.3)}
              >
                A Story of{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                  Persistence
                </span>
              </Motion.h2>

              <Motion.p
                className="text-base sm:text-lg text-gray-500 leading-relaxed max-w-lg"
                variants={fadeIn("up", 0.4)}
              >
                Since 2010, we have evolved from a local gathering into a
                strategic force for community development in Ibadan.
              </Motion.p>
            </div>

            {/* Origin Card */}
            <Motion.div
              className="p-8 rounded-2xl bg-gray-900 text-white space-y-5 shadow-lg"
              variants={fadeIn("up", 0.5)}
            >
              <div className="inline-block px-3 py-1 bg-white/10 rounded-lg text-xs font-semibold uppercase tracking-wider text-emerald-400">
                Core Heritage
              </div>
              <h4 className="text-xl font-bold">The Sabo Origin</h4>
              <p className="text-gray-400 leading-relaxed text-sm">
                We were born in the heart of Sabo, Ibadan. Our story is
                documented in the success of every community we've impacted
                from classrooms to community clinics.
              </p>
              <div className="w-16 h-0.5 bg-emerald-500 rounded-full" />
            </Motion.div>
          </Motion.div>

          {/* Right: Accordion */}
          <Motion.div
            className="space-y-3"
            variants={staggerContainer(0.08, 0.3)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {historyData.map((item, i) => (
              <Motion.div
                key={i}
                variants={fadeIn("up", 0.1 * i)}
                className={`rounded-2xl transition-all duration-300 ${
                  openIndex === i
                    ? "bg-white border border-gray-200 shadow-lg p-6"
                    : "border border-transparent hover:bg-white hover:border-gray-100 p-5"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
                  className="w-full flex items-center justify-between text-left gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 shrink-0 ${
                        openIndex === i
                          ? "bg-emerald-600 text-white"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      <item.icon size={18} />
                    </div>
                    <h3
                      className={`text-base font-semibold transition-colors ${
                        openIndex === i ? "text-gray-900" : "text-gray-500"
                      }`}
                    >
                      {item.question}
                    </h3>
                  </div>
                  <Motion.div
                    animate={{ rotate: openIndex === i ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className={
                      openIndex === i ? "text-emerald-600" : "text-gray-300"
                    }
                  >
                    <ChevronDown size={20} />
                  </Motion.div>
                </button>

                <AnimatePresence>
                  {openIndex === i && (
                    <Motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="text-sm text-gray-500 leading-relaxed mt-4 pl-[52px] pr-4 border-l-2 border-emerald-200 ml-5">
                        {item.answer}
                      </p>
                    </Motion.div>
                  )}
                </AnimatePresence>
              </Motion.div>
            ))}
          </Motion.div>
        </div>
      </div>
    </section>
  );
};

export default History;
