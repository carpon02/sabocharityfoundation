import React from "react";
import { motion as Motion } from "framer-motion";
import { fadeIn, staggerContainer } from "../utils/animations";
import { Quote, Star, BookOpen } from "lucide-react";

const stories = [
  {
    name: "Aisha Bello",
    role: "Scholarship Recipient, 2023",
    story:
      "Before the foundation, I couldn't afford school fees. Today, I'm studying Computer Science at the University of Ibadan — all thanks to the Sabo Youth scholarship.",
    image:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&h=200&fit=crop&crop=face",
    impact: "Full scholarship funded",
    category: "Education",
    categoryColor: "bg-blue-500/10 text-blue-400",
  },
  {
    name: "Ibrahim Musa",
    role: "Health Outreach Beneficiary",
    story:
      "The free medical screening caught my son's eye condition early. Without it, we would never have known. The foundation saved his sight.",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    impact: "Early diagnosis achieved",
    category: "Health",
    categoryColor: "bg-rose-500/10 text-rose-400",
  },
  {
    name: "Fatima Adeyemi",
    role: "Women Empowerment Graduate",
    story:
      "The micro-business grant and 3 months of mentorship helped me start my tailoring shop. I now employ two other women from Sabo.",
    image:
      "https://images.unsplash.com/photo-1494790108755-2616b9e44c96?w=200&h=200&fit=crop&crop=face",
    impact: "3 jobs created",
    category: "Empowerment",
    categoryColor: "bg-secondary-500/10 text-secondary-400",
  },
];

const SuccessStories = () => {
  return (
    <section className="py-24 sm:py-32 bg-dark text-white relative overflow-hidden">
      {/* Ambient Background */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-900/20 rounded-full blur-[150px] translate-x-1/3 -translate-y-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary-900/10 rounded-full blur-[120px] -translate-x-1/4 translate-y-1/4 pointer-events-none" />
      <div className="scan-line opacity-5" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <Motion.div
          className="text-center space-y-6 mb-20"
          variants={staggerContainer(0.1, 0)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <Motion.div
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-secondary-400 text-[10px] font-black uppercase tracking-[0.3em]"
            variants={fadeIn("down", 0.1)}
          >
            <BookOpen size={12} />
            Success Stories
          </Motion.div>
          <Motion.h2
            className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.9]"
            variants={fadeIn("up", 0.2)}
          >
            Real Lives. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-400 to-secondary-600">
              Real Transformation.
            </span>
          </Motion.h2>
          <Motion.p
            className="text-lg text-gray-400 font-medium max-w-2xl mx-auto leading-relaxed"
            variants={fadeIn("up", 0.3)}
          >
            Hear directly from the people whose lives have been transformed by
            your generosity and our programmes on the ground.
          </Motion.p>
        </Motion.div>

        {/* Stories Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {stories.map((story, i) => (
            <Motion.div
              key={i}
              variants={fadeIn("up", 0.3 + i * 0.15)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className="group relative rounded-[2.5rem] bg-white/5 border border-white/10 p-8 sm:p-10 space-y-6 hover:border-primary-500/30 hover:shadow-[0_20px_50px_-10px_rgba(16,185,129,0.2)] transition-all duration-500 overflow-hidden"
            >
              {/* Hover Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-600/0 to-secondary-600/0 group-hover:from-primary-600/5 group-hover:to-secondary-600/5 transition-all duration-700 rounded-[2.5rem]" />

              {/* Category Badge */}
              <span
                className={`relative z-10 inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${story.categoryColor}`}
              >
                {story.category}
              </span>

              {/* Quote */}
              <div className="relative z-10">
                <Quote size={20} className="text-secondary-500/50 mb-3" />
                <p className="text-gray-300 text-sm font-medium leading-relaxed italic">
                  &ldquo;{story.story}&rdquo;
                </p>
              </div>

              {/* Person */}
              <div className="relative z-10 flex items-center gap-4 pt-4 border-t border-white/10">
                <div className="relative">
                  <img
                    src={story.image}
                    alt={story.name}
                    className="w-12 h-12 rounded-xl object-cover border border-white/10 group-hover:border-primary-500/30 transition-all"
                    loading="lazy"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary-500 rounded-full border-2 border-dark animate-pulse" />
                </div>
                <div>
                  <p className="text-sm font-black text-white">{story.name}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    {story.role}
                  </p>
                </div>
              </div>

              {/* Impact Badge */}
              <div className="relative z-10 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-500/10 border border-primary-500/20">
                <Star
                  size={12}
                  className="text-secondary-500 fill-secondary-500"
                />
                <span className="text-xs font-bold text-primary-400">
                  {story.impact}
                </span>
              </div>
            </Motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SuccessStories;
