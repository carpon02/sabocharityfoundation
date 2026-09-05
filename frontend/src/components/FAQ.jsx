import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronDown,
  MessageSquare,
  HelpCircle,
  ShieldCheck,
  Globe,
  Award,
  Heart,
} from "lucide-react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { fadeIn, staggerContainer } from "../utils/animations";

const faqs = [
  {
    question: "How can I volunteer with Sabo Youth Foundation?",
    icon: Heart,
    answer:
      "You can join our volunteer team by filling out the 'Get Involved' form or contacting our coordinators directly. We welcome specialists in education, healthcare, and community development.",
  },
  {
    question: "Are donor contributions strictly managed?",
    icon: ShieldCheck,
    answer:
      "Absolute transparency is our protocol. 100% of public donations are deployed to programme operations, with administrative costs covered by our board members and private endowment.",
  },
  {
    question: "Does the foundation offer recurring donations?",
    icon: Award,
    answer:
      "Yes! Our recurring giving programme provides the stability needed for multi-year educational infrastructure projects in Ibadan. You can set up monthly contributions through our donation page.",
  },
  {
    question: "Can I direct funds to a specific cause?",
    icon: Globe,
    answer:
      "Yes, donors may designate funds for specific impact areas — Education, Health, or Infrastructure. General contributions are allocated to the area with highest priority need.",
  },
  {
    question: "Is the foundation a registered legal entity?",
    icon: HelpCircle,
    answer:
      "The Sabo Youth Foundation is a fully registered NGO with the Corporate Affairs Commission (CAC). We issue verified documentation for all contributions exceeding ₦5,000.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="py-24 sm:py-32 bg-gray-900 px-4 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left: Header + CTA */}
          <Motion.div
            className="space-y-10 lg:sticky lg:top-32"
            variants={staggerContainer(0.1, 0)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <div className="space-y-5">
              <Motion.div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-emerald-400 text-xs font-semibold uppercase tracking-wider"
                variants={fadeIn("right", 0.2)}
              >
                <HelpCircle size={14} />
                FAQ
              </Motion.div>
              <Motion.h2
                className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight"
                variants={fadeIn("up", 0.3)}
              >
                Frequently Asked{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                  Questions
                </span>
              </Motion.h2>
              <Motion.p
                className="text-base sm:text-lg text-gray-400 leading-relaxed max-w-lg"
                variants={fadeIn("up", 0.4)}
              >
                Complete transparency is the cornerstone of our mission. Find
                answers to the most common questions from our supporters.
              </Motion.p>
            </div>

            {/* Contact Card */}
            <Motion.div
              className="p-8 rounded-2xl bg-white/5 border border-white/10 space-y-5"
              variants={fadeIn("up", 0.5)}
            >
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400">
                <MessageSquare size={22} />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-1">
                  Still have questions?
                </h4>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Our team is happy to help with any inquiries about donations,
                  partnerships, or programmes.
                </p>
              </div>
              <Link
                to="/contact"
                className="block w-full py-3.5 bg-white text-gray-900 font-semibold text-sm rounded-xl text-center hover:bg-emerald-500 hover:text-white transition-colors"
              >
                Contact Us
              </Link>
            </Motion.div>
          </Motion.div>

          {/* Right: Accordion */}
          <Motion.div
            className="space-y-2"
            variants={staggerContainer(0.08, 0.3)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {faqs.map((faq, i) => (
              <Motion.div
                key={i}
                variants={fadeIn("up", 0.1 * i)}
                className={`rounded-2xl transition-all duration-300 ${
                  openIndex === i
                    ? "bg-white/5 border border-white/10 p-6"
                    : "border border-transparent hover:bg-white/[0.03] p-5"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
                  className="w-full flex items-start gap-4 text-left"
                >
                  <div
                    className={`mt-0.5 w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 ${
                      openIndex === i
                        ? "bg-emerald-500 text-white"
                        : "bg-white/5 text-gray-500"
                    }`}
                  >
                    <faq.icon size={18} />
                  </div>

                  <div className="flex-1">
                    <h3
                      className={`text-base font-semibold leading-snug transition-colors ${
                        openIndex === i ? "text-white" : "text-gray-400"
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
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <p className="text-sm text-gray-400 leading-relaxed mt-3 pr-4">
                            {faq.answer}
                          </p>
                        </Motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <Motion.div
                    animate={{ rotate: openIndex === i ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className={`mt-1 shrink-0 ${
                      openIndex === i ? "text-emerald-400" : "text-gray-600"
                    }`}
                  >
                    <ChevronDown size={18} />
                  </Motion.div>
                </button>
              </Motion.div>
            ))}
          </Motion.div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
