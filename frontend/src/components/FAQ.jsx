import React, { useState } from "react";
import {
  ChevronDown,
  MessageSquare,
  HelpCircle,
  ShieldCheck,
  Globe,
  Award,
  Sparkles,
  Heart,
} from "lucide-react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { fadeIn, staggerContainer, scaleIn } from "../utils/animations";

const faqs = [
  {
    question: "How can I volunteer with Sabo Youth Foundation?",
    icon: Heart,
    answer:
      "Join our strategic vanguard by filling out the 'Get Involved' transmission or contacting our coordinators directly. We prioritize specialists in structural education and community healthcare.",
  },
  {
    question: "Are donor contributions strictly managed?",
    icon: ShieldCheck,
    answer:
      "Absolute transparency is our protocol. 100% of public capital is deployed to program operations, with administrative overhead sustained by our executive board members and private endowment.",
  },
  {
    question: "Does the foundation offer recurring engagement?",
    icon: Award,
    answer:
      "Yes, the 'Impact Vanguard' is our recurring commitment program. Monthly contributions provide the stability needed for multi-year educational infrastructure projects in Ibadan.",
  },
  {
    question: "Can I allocate capital to specific pillars?",
    icon: Globe,
    answer:
      "Major strategists may designate funds for specific impact modules—Education, Health, or Infrastructure. General contributions are allocated to the quadrant with highest priority need.",
  },
  {
    question: "Is the foundation a registered legal entity?",
    icon: HelpCircle,
    answer:
      "The Sabo Youth Foundation is a fully sanctioned NGO. We issue verified documentation for all contributions exceeding 5,000 Naira for fiscal record-keeping.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="relative bg-dark py-20 sm:py-32 px-4 overflow-hidden border-t border-white/5">
      {/* Abstract Background Elements */}
      <Motion.div
        className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-primary-900/10 rounded-full blur-[140px] -translate-y-1/2 translate-x-1/4 pointer-events-none"
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 12, repeat: Infinity }}
      />
      <Motion.div
        className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary-900/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/4 pointer-events-none"
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 15, repeat: Infinity }}
      />

      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-start">
          {/* Left Block: Identity & Context */}
          <Motion.div
            className="space-y-8 sm:space-y-12 lg:sticky lg:top-32"
            variants={staggerContainer(0.1, 0)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <div className="space-y-6">
              <Motion.div
                className="flex items-center gap-3"
                variants={fadeIn("right", 0.2)}
              >
                <span className="w-10 h-0.5 bg-secondary-500" />
                <span className="text-secondary-400 font-bold uppercase tracking-[0.3em] text-[10px]">
                  Intelligence Center
                </span>
              </Motion.div>
              <Motion.h2
                className="text-5xl sm:text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.9]"
                variants={fadeIn("up", 0.3)}
              >
                Protocol <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600 underline decoration-white/5">
                  Clarity.
                </span>
              </Motion.h2>
              <Motion.p
                className="text-lg sm:text-xl text-primary-100/60 font-medium leading-relaxed max-w-lg italic"
                variants={fadeIn("up", 0.4)}
              >
                Complete transparency is the cornerstone of our mission. Explore
                the data points most vital to our supporters.
              </Motion.p>
            </div>

            {/* Support Card - Dark Glass */}
            <Motion.div
              className="relative group max-w-md"
              variants={scaleIn(0.5)}
            >
              <div className="absolute inset-0 bg-primary-500 rounded-[3rem] blur-2xl opacity-10 group-hover:opacity-20 transition-opacity" />
              <div className="relative glass-card-dark p-8 sm:p-12 rounded-[3.5rem] border border-white/5 space-y-6 sm:space-y-8 overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Sparkles size={120} />
                </div>
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-secondary-500 border border-white/10">
                  <MessageSquare size={32} />
                </div>
                <div className="space-y-2">
                  <h4 className="text-2xl font-black text-white">
                    Direct Inquiry?
                  </h4>
                  <p className="text-primary-100/40 text-sm font-medium">
                    Our strategic team monitors communications 24/7 for
                    high-impact partnerships.
                  </p>
                </div>
                <button className="w-full py-5 bg-white text-dark font-black rounded-2xl hover:bg-secondary-500 hover:text-white transition-all transform active:scale-95 shadow-2xl">
                  Open Sequence
                </button>
              </div>
            </Motion.div>
          </Motion.div>

          {/* Right Block: Accordion Grid */}
          <Motion.div
            className="space-y-4"
            variants={staggerContainer(0.1, 0.4)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {faqs.map((faq, i) => (
              <Motion.div
                key={i}
                variants={fadeIn("up", 0.5 + i * 0.1)}
                className={`group transition-all duration-700 rounded-[2.5rem] sm:rounded-[3rem] border border-white/5 ${
                  openIndex === i
                    ? "bg-white/5 border-white/10 shadow-2xl p-6 sm:p-10"
                    : "hover:bg-white/5 p-6 sm:p-8"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
                  className="w-full flex items-start gap-4 sm:gap-8 text-left focus:outline-none"
                >
                  <div
                    className={`mt-1 flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-500 ${
                      openIndex === i
                        ? "bg-primary-500 text-white shadow-[0_0_30px_rgba(16,185,129,0.4)]"
                        : "bg-white/5 text-primary-200/40 group-hover:text-primary-400 group-hover:border-white/10 border border-transparent"
                    }`}
                  >
                    <faq.icon size={24} />
                  </div>

                  <div className="flex-1 space-y-4">
                    <h3
                      className={`text-xl sm:text-2xl font-black tracking-tight leading-tight transition-colors duration-500 ${
                        openIndex === i
                          ? "text-white"
                          : "text-primary-100/40 group-hover:text-white"
                      }`}
                    >
                      {faq.question}
                    </h3>

                    <AnimatePresence>
                      {openIndex === i && (
                        <Motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{
                            duration: 0.5,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className="overflow-hidden"
                        >
                          <p className="text-base sm:text-lg text-primary-100/60 font-medium leading-relaxed pr-8 pt-4">
                            {faq.answer}
                          </p>
                        </Motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <Motion.div
                    animate={{ rotate: openIndex === i ? 180 : 0 }}
                    transition={{ duration: 0.5 }}
                    className={`mt-2 ${
                      openIndex === i
                        ? "text-secondary-500"
                        : "text-white/10 group-hover:text-white/30"
                    }`}
                  >
                    <ChevronDown size={28} />
                  </Motion.div>
                </button>
              </Motion.div>
            ))}

            {/* Footer Stamp */}
            <Motion.div
              className="pt-12 flex items-center gap-6 px-10 opacity-20"
              variants={fadeIn("up", 1)}
            >
              <div className="w-16 h-px bg-white" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white">
                Trust Layer Verified
              </span>
            </Motion.div>
          </Motion.div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
