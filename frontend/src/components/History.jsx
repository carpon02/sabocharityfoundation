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
import { fadeIn, staggerContainer, scaleIn } from "../utils/animations";

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
    <section className="relative bg-paper py-20 sm:py-32 lg:py-40 px-4 overflow-hidden border-t border-gray-100">
      {/* Abstract Background Decor */}
      <Motion.div
        className="absolute top-0 right-0 w-[800px] h-[800px] bg-secondary-100/30 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 15, repeat: Infinity }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-32 items-start">
          {/* LEFT COLUMN: The Contextual Foundation */}
          <Motion.div
            className="space-y-10 sm:space-y-12 lg:sticky lg:top-40"
            variants={staggerContainer(0.1, 0)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <div className="space-y-6 sm:space-y-8">
              <Motion.div
                className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass-card border-gray-100 text-secondary-600 font-black text-[10px] uppercase tracking-[0.3em] shadow-sm"
                variants={fadeIn("down", 0.2)}
              >
                <Globe size={14} className="text-secondary-500" />
                Dossier: Institutional Legacy
              </Motion.div>

              <Motion.h2
                className="text-5xl sm:text-7xl md:text-8xl font-black text-dark tracking-tighter leading-[0.8]"
                variants={fadeIn("up", 0.3)}
              >
                A Story of <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-700 via-primary-500 to-primary-800 text-glow-primary">
                  Persistence.
                </span>
              </Motion.h2>

              <Motion.p
                className="text-lg sm:text-xl text-gray-500 font-medium leading-[1.6] max-w-xl"
                variants={fadeIn("up", 0.4)}
              >
                Since 2010, we have evolved from a local gathering into a
                strategic architect of communal sovereignty in Ibadan.
              </Motion.p>
            </div>

            <Motion.div
              className="p-8 sm:p-12 rounded-[2.5rem] sm:rounded-[4rem] bg-dark text-white space-y-6 sm:space-y-8 shadow-[0_50px_100px_-30px_rgba(0,0,0,0.4)] relative overflow-hidden group"
              variants={scaleIn(0.5)}
            >
              <div className="scan-line opacity-5" />
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Sparkles size={160} />
              </div>
              <div className="inline-block px-4 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-primary-400">
                Core Heritage
              </div>
              <h4 className="text-2xl sm:text-3xl font-black tracking-tight">
                The Sabo Origin
              </h4>
              <p className="text-gray-400 font-medium leading-relaxed text-base sm:text-lg">
                We were born in the heart of Sabo, Ibadan. Our story is
                documented in the success of every node we've energized—from
                classrooms to community clinics.
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-secondary-500 to-transparent rounded-full" />
            </Motion.div>
          </Motion.div>

          {/* RIGHT COLUMN: The Interactive Chronology */}
          <Motion.div
            className="space-y-4 sm:space-y-8"
            variants={staggerContainer(0.1, 0.4)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {historyData.map((item, i) => (
              <Motion.div
                key={i}
                variants={fadeIn("up", 0.5 + i * 0.1)}
                className={`group transition-all duration-700 rounded-[2.5rem] sm:rounded-[3rem] ${
                  openIndex === i
                    ? "glass-card-premium border-white p-8 sm:p-10 ring-1 ring-gray-100 shadow-2xl"
                    : "border-b border-gray-100 p-4 sm:p-6 hover:bg-gray-50/50"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
                  className="w-full flex items-center justify-between text-left focus:outline-none"
                >
                  <div className="flex items-center gap-4 sm:gap-6">
                    <div
                      className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-500 ${
                        openIndex === i
                          ? "bg-dark text-white shadow-2xl scale-110 rotate-3"
                          : "bg-gray-50 text-gray-400 group-hover:bg-primary-50 group-hover:text-primary-600"
                      }`}
                    >
                      <item.icon size={24} />
                    </div>
                    <div>
                      <h3
                        className={`text-lg sm:text-2xl font-black transition-colors duration-500 ${
                          openIndex === i
                            ? "text-dark"
                            : "text-gray-400 group-hover:text-dark"
                        }`}
                      >
                        {item.question}
                      </h3>
                      {openIndex !== i && (
                        <div className="text-[8px] sm:text-[10px] font-black text-gray-300 uppercase tracking-widest mt-1">
                          Expand Dossier
                        </div>
                      )}
                    </div>
                  </div>
                  <Motion.div
                    animate={{ rotate: openIndex === i ? 180 : 0 }}
                    transition={{ duration: 0.5 }}
                    className={
                      openIndex === i ? "text-primary-600" : "text-gray-300"
                    }
                  >
                    <ChevronDown size={28} />
                  </Motion.div>
                </button>

                <AnimatePresence>
                  {openIndex === i && (
                    <Motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pl-2 relative mt-6 sm:mt-10">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-600 to-transparent rounded-full opacity-20" />
                        <p className="text-lg sm:text-xl text-gray-500 leading-relaxed font-medium pl-6 sm:pl-8">
                          {item.answer}
                        </p>
                      </div>
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
