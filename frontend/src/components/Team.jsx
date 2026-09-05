import React from "react";
import { our_board, our_leadership_team } from "../assets/assets";
import { Linkedin, Twitter } from "lucide-react";
import { motion as Motion } from "framer-motion";
import { fadeIn, staggerContainer } from "../utils/animations";

const TeamMemberCard = ({ name, avatar, role, index }) => (
  <Motion.div
    className="group flex items-center gap-4 p-4 rounded-xl bg-white border border-gray-100 hover:border-emerald-200 hover:shadow-md transition-all duration-200"
    variants={fadeIn("up", 0.08 * index)}
    whileHover={{ y: -3 }}
  >
    {/* Avatar */}
    <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100 shrink-0 ring-2 ring-gray-100 group-hover:ring-emerald-200 transition-all">
      <img
        src={avatar}
        alt={name}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        loading="lazy"
      />
    </div>

    {/* Info */}
    <div className="flex-1 min-w-0">
      <h3 className="text-sm font-bold text-gray-900 truncate">{name}</h3>
      <p className="text-xs text-emerald-600 font-medium">{role}</p>
    </div>

    {/* Socials */}
    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
      <button className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors">
        <Linkedin size={14} />
      </button>
      <button className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors">
        <Twitter size={14} />
      </button>
    </div>
  </Motion.div>
);

const Team = () => {
  return (
    <section className="py-24 sm:py-32 bg-gray-50 px-4 border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <Motion.div
          className="text-center space-y-4 mb-16"
          variants={staggerContainer(0.1, 0)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <Motion.div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-semibold uppercase tracking-wider"
            variants={fadeIn("down", 0.1)}
          >
            Our People
          </Motion.div>
          <Motion.h2
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight"
            variants={fadeIn("up", 0.2)}
          >
            Meet the{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
              Team
            </span>
          </Motion.h2>
          <Motion.p
            className="text-base sm:text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto"
            variants={fadeIn("up", 0.3)}
          >
            The passionate people behind our mission — from strategic board
            oversight to on-the-ground leadership in Ibadan.
          </Motion.p>
        </Motion.div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Board */}
          <Motion.div
            className="space-y-5"
            variants={staggerContainer(0.06, 0.2)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <Motion.div
              className="flex items-center gap-3 mb-6"
              variants={fadeIn("right", 0.1)}
            >
              <div className="w-1 h-6 rounded-full bg-purple-500" />
              <h3 className="text-lg font-bold text-gray-900">
                Board of Directors
              </h3>
              <span className="ml-auto text-xs font-medium text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
                {our_board.length} members
              </span>
            </Motion.div>

            {our_board.map((member, i) => (
              <TeamMemberCard key={member.id} index={i} {...member} />
            ))}
          </Motion.div>

          {/* Leadership */}
          <Motion.div
            className="space-y-5"
            variants={staggerContainer(0.06, 0.3)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <Motion.div
              className="flex items-center gap-3 mb-6"
              variants={fadeIn("right", 0.1)}
            >
              <div className="w-1 h-6 rounded-full bg-emerald-500" />
              <h3 className="text-lg font-bold text-gray-900">
                Leadership Team
              </h3>
              <span className="ml-auto text-xs font-medium text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
                {our_leadership_team.length} members
              </span>
            </Motion.div>

            {our_leadership_team.map((member, i) => (
              <TeamMemberCard key={member.id} index={i} {...member} />
            ))}
          </Motion.div>
        </div>
      </div>
    </section>
  );
};

export default Team;
