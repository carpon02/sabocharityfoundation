import React from "react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";
import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import { motion as Motion } from "framer-motion";
import { fadeIn, staggerContainer } from "../utils/animations";

const pillars = [
  {
    title: "Education",
    desc: "Building classrooms and providing scholarships.",
    color: "text-emerald-600",
    bg: "bg-emerald-100",
  },
  {
    title: "Healthcare",
    desc: "Equipping rural clinics and medical outreaches.",
    color: "text-blue-600",
    bg: "bg-blue-100",
  },
  {
    title: "Welfare",
    desc: "Empowering families with sustainable resources.",
    color: "text-amber-600",
    bg: "bg-amber-100",
  },
];

const WhatWeDo = () => {
  return (
    <section className="py-24 sm:py-32 bg-white px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Text */}
          <Motion.div
            className="space-y-10"
            variants={staggerContainer(0.1, 0)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <div className="space-y-6">
              <Motion.div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold uppercase tracking-wider"
                variants={fadeIn("down", 0.2)}
              >
                <ShieldCheck size={14} />
                Our Mission
              </Motion.div>

              <Motion.h2
                className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight"
                variants={fadeIn("up", 0.3)}
              >
                Beyond{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                  Philanthropy
                </span>
              </Motion.h2>

              <Motion.p
                className="text-base sm:text-lg text-gray-500 leading-relaxed max-w-lg"
                variants={fadeIn("up", 0.4)}
              >
                We build strong, self-sufficient communities. Our programs are
                carefully designed to create lasting change and resilience across
                Sabo, Ibadan.
              </Motion.p>
            </div>

            <div className="space-y-3">
              {pillars.map((item, i) => (
                <Motion.div
                  key={i}
                  variants={fadeIn("up", 0.5 + i * 0.1)}
                  whileHover={{ x: 4 }}
                  className="flex items-start gap-4 p-5 rounded-xl bg-gray-50 border border-gray-100 hover:border-emerald-200 hover:shadow-md transition-all duration-200 group"
                >
                  <div
                    className={`p-2.5 rounded-xl ${item.bg} ${item.color} group-hover:scale-105 transition-transform shrink-0`}
                  >
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">
                      {item.title}
                    </h4>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                </Motion.div>
              ))}
            </div>

            <Motion.div variants={fadeIn("up", 0.7)}>
              <Link
                to="/campaigns"
                className="group inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors shadow-lg"
              >
                Explore Our Programs
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Motion.div>
          </Motion.div>

          {/* Image */}
          <Motion.div
            className="relative"
            variants={fadeIn("left", 0.4)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-200">
              <img
                src={assets.what_we_do_img}
                alt="Community Impact"
                className="w-full object-cover aspect-[4/5] hover:scale-105 transition-transform duration-700"
              />
            </div>

            {/* Promise Card */}
            <div className="absolute -top-4 -right-4 sm:top-6 sm:right-6 bg-white rounded-2xl p-5 shadow-lg border border-gray-200 max-w-[200px]">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                  Our Promise
                </span>
              </div>
              <div className="text-3xl font-extrabold text-gray-900">100%</div>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Every donation goes directly to community programmes.
              </p>
              <div className="w-full h-1 bg-gray-100 rounded-full mt-3 overflow-hidden">
                <Motion.div
                  className="h-full bg-emerald-500 rounded-full"
                  initial={{ width: "0%" }}
                  whileInView={{ width: "100%" }}
                  transition={{ duration: 2, delay: 0.5 }}
                />
              </div>
            </div>
          </Motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhatWeDo;
