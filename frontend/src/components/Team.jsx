import React from "react";
import { Link } from "react-router-dom";
import { our_board, our_leadership_team } from "../assets/assets";
import { Linkedin, Twitter, ArrowUpRight } from "lucide-react";
import { motion as Motion } from "framer-motion";
import { fadeIn, staggerContainer, scaleIn } from "../utils/animations";

const TeamMemberCard = ({ id, name, avatar, role, category, index }) => (
  <Motion.div
    className="group relative"
    variants={fadeIn("up", 0.1 * index)}
    whileHover={{ y: -10 }}
  >
    <div className="relative aspect-[4/5] rounded-[2.5rem] sm:rounded-[3rem] overflow-hidden bg-gray-100 shadow-xl group-hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] transition-all duration-700">
      <Motion.img
        src={avatar}
        alt={name}
        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/20 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 space-y-3 sm:space-y-4 translate-y-6 group-hover:translate-y-0 transition-transform duration-500">
        <div className="space-y-1">
          <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
            {name}
          </h3>
          <p className="text-primary-400 font-bold text-[10px] sm:text-xs uppercase tracking-widest">
            {role}
          </p>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 opacity-0 group-hover:opacity-100 transition-opacity delay-100">
          <button className="p-2 rounded-lg bg-white/10 text-white hover:bg-primary-500 transition-colors">
            <Linkedin size={14} />
          </button>
          <button className="p-2 rounded-lg bg-white/10 text-white hover:bg-primary-500 transition-colors">
            <Twitter size={14} />
          </button>
          <Link
            to={`/team/${id}`}
            className="ml-auto w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-secondary-500 text-white flex items-center justify-center hover:scale-110 transition-transform"
          >
            <ArrowUpRight size={18} />
          </Link>
        </div>
      </div>

      {/* Category Badge */}
      <div className="absolute top-6 left-6 sm:top-8 sm:left-8 px-3 py-1 sm:px-4 sm:py-1.5 glass-card-dark rounded-full text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-primary-400">
        {category}
      </div>
    </div>
  </Motion.div>
);

const Team = () => {
  return (
    <div className="space-y-0 bg-paper">
      {/* --- OUR BOARD SECTION --- */}
      <section className="py-20 sm:py-32 px-4 border-t border-gray-50 overflow-hidden">
        <Motion.div
          className="max-w-7xl mx-auto space-y-16 sm:space-y-20"
          variants={staggerContainer(0.1, 0)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <div className="grid md:grid-cols-2 gap-10 items-end">
            <div className="space-y-4 sm:space-y-6">
              <Motion.div
                className="flex items-center gap-3"
                variants={fadeIn("right", 0.2)}
              >
                <span className="w-10 h-0.5 bg-secondary-500" />
                <span className="text-secondary-600 font-bold uppercase tracking-[0.2em] text-[10px]">
                  Governance
                </span>
              </Motion.div>
              <Motion.h2
                className="text-5xl sm:text-6xl md:text-7xl font-black text-dark tracking-tighter leading-[0.9]"
                variants={fadeIn("up", 0.3)}
              >
                The <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-700 to-primary-500">
                  Board.
                </span>
              </Motion.h2>
            </div>
            <Motion.p
              className="text-lg sm:text-xl text-gray-500 font-medium leading-relaxed max-w-lg mb-2"
              variants={fadeIn("up", 0.4)}
            >
              Our visionary board provides the strategic oversight and
              governance necessary to ensure every program meets the highest
              standards of impact.
            </Motion.p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10">
            {our_board.map((member, i) => (
              <TeamMemberCard
                key={member.id}
                index={i}
                category="BOARD"
                {...member}
              />
            ))}
          </div>
        </Motion.div>
      </section>

      {/* --- OUR LEADERSHIP SECTION (DARK THEME) --- */}
      <section className="py-20 sm:py-32 px-4 bg-primary-950 text-white relative overflow-hidden">
        {/* Abstract Glow */}
        <Motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-primary-900/20 rounded-full blur-[140px]"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 10, repeat: Infinity }}
        />

        <Motion.div
          className="max-w-7xl mx-auto space-y-16 sm:space-y-20 relative z-10"
          variants={staggerContainer(0.1, 0)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <div className="text-center space-y-4 sm:space-y-6">
            <Motion.div
              className="flex items-center justify-center gap-3"
              variants={fadeIn("down", 0.2)}
            >
              <span className="w-10 h-0.5 bg-secondary-500" />
              <span className="text-secondary-400 font-bold uppercase tracking-[0.2em] text-[10px]">
                Operations
              </span>
            </Motion.div>
            <Motion.h2
              className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tighter leading-[0.9]"
              variants={fadeIn("up", 0.3)}
            >
              Leadership{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-200">
                Team.
              </span>
            </Motion.h2>
            <Motion.p
              className="text-lg sm:text-xl text-primary-100/60 font-medium leading-relaxed max-w-2xl mx-auto"
              variants={fadeIn("up", 0.4)}
            >
              The strategic minds implementing our vision on the ground, every
              single day in the heart of Ibadan.
            </Motion.p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10">
            {our_leadership_team.map((member, i) => (
              <TeamMemberCard
                key={member.id}
                index={i}
                category="EXECUTIVE"
                {...member}
              />
            ))}
          </div>
        </Motion.div>
      </section>
    </div>
  );
};

export default Team;
