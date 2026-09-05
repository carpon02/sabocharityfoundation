import React from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Send,
  MessageSquare,
  Clock,
  Globe,
} from "lucide-react";
import { motion as Motion } from "framer-motion";
import { fadeIn, staggerContainer } from "../utils/animations";

const contactCards = [
  {
    href: "mailto:info@saboibadanyouth.org",
    icon: Mail,
    label: "Email Us",
    value: "info@saboibadanyouth.org",
    desc: "For general inquiries, project proposals, and partnership opportunities.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    hoverBorder: "hover:border-emerald-200",
    iconBg: "bg-emerald-100",
  },
  {
    href: "tel:+2348100000000",
    icon: Phone,
    label: "Call Us",
    value: "+234 810 000 0000",
    desc: "Direct hotline for urgent coordination and on-ground support.",
    color: "text-blue-600",
    bg: "bg-blue-50",
    hoverBorder: "hover:border-blue-200",
    iconBg: "bg-blue-100",
  },
  {
    href: "https://goo.gl/maps/example",
    icon: MapPin,
    label: "Visit Us",
    value: "Sabo Community Area, Ibadan",
    desc: "Visit us for meetings, workshops, and community events.",
    isExternal: true,
    color: "text-amber-600",
    bg: "bg-amber-50",
    hoverBorder: "hover:border-amber-200",
    iconBg: "bg-amber-100",
  },
];

const socials = ["Twitter / X", "LinkedIn", "Instagram", "Facebook"];

const ContactSection = () => {
  return (
    <section className="py-24 sm:py-32 bg-gray-50 relative overflow-hidden">
      {/* Subtle Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-emerald-50/30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <Motion.div
          className="text-center mb-16 sm:mb-20 space-y-5"
          variants={staggerContainer(0.1, 0)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <Motion.div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold uppercase tracking-wider"
            variants={fadeIn("down", 0.1)}
          >
            <Send size={14} />
            Get In Touch
          </Motion.div>

          <Motion.h2
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight"
            variants={fadeIn("up", 0.2)}
          >
            Contact{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
              Us Today
            </span>
          </Motion.h2>

          <Motion.p
            className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed"
            variants={fadeIn("up", 0.3)}
          >
            Have a question, want to partner with us, or just want to say hello?
            We'd love to hear from you.
          </Motion.p>
        </Motion.div>

        {/* Contact Cards Grid */}
        <Motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-16"
          variants={staggerContainer(0.1, 0.3)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {contactCards.map((card, i) => (
            <Motion.a
              key={i}
              href={card.href}
              target={card.isExternal ? "_blank" : undefined}
              rel={card.isExternal ? "noopener noreferrer" : undefined}
              variants={fadeIn("up", 0.1 * i)}
              whileHover={{ y: -8 }}
              className={`group relative flex flex-col items-center text-center p-8 lg:p-10 rounded-3xl bg-white border border-gray-200 ${card.hoverBorder} shadow-sm hover:shadow-xl transition-all duration-300`}
            >
              {/* Icon */}
              <div
                className={`w-16 h-16 rounded-2xl ${card.iconBg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
              >
                <card.icon className={`w-7 h-7 ${card.color}`} />
              </div>

              {/* Label */}
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                {card.label}
              </span>

              {/* Value */}
              <h3 className="text-lg font-bold text-gray-900 mb-3 break-all leading-tight">
                {card.value}
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-500 leading-relaxed flex-grow">
                {card.desc}
              </p>

              {/* Hover Arrow */}
              <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-gray-400 group-hover:text-emerald-600 transition-colors">
                Connect
                <ArrowRight
                  size={14}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </div>
            </Motion.a>
          ))}
        </Motion.div>

        {/* Office Hours + Social Grid */}
        <Motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          variants={fadeIn("up", 0.5)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {/* Office Hours Card */}
          <div className="p-8 lg:p-10 rounded-3xl bg-white border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <Clock size={20} className="text-blue-600" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900">
                  Office Hours
                </h4>
                <p className="text-sm text-gray-400">When you can reach us</p>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { day: "Monday – Friday", time: "9:00 AM – 5:00 PM" },
                { day: "Saturday", time: "10:00 AM – 2:00 PM" },
                { day: "Sunday", time: "Closed" },
              ].map((slot, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                >
                  <span className="text-sm font-medium text-gray-700">
                    {slot.day}
                  </span>
                  <span
                    className={`text-sm font-semibold ${slot.time === "Closed" ? "text-red-500" : "text-gray-900"}`}
                  >
                    {slot.time}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Social Media + Quick CTA */}
          <div className="space-y-6">
            {/* Social Links */}
            <div className="p-8 lg:p-10 rounded-3xl bg-white border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                  <Globe size={20} className="text-purple-600" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900">
                    Follow Us
                  </h4>
                  <p className="text-sm text-gray-400">Stay connected online</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                {socials.map((link) => (
                  <button
                    key={link}
                    className="px-5 py-2.5 rounded-xl bg-gray-50 text-gray-600 text-sm font-semibold border border-gray-200 hover:border-emerald-300 hover:text-emerald-700 hover:bg-emerald-50 transition-all duration-200"
                  >
                    {link}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick CTA */}
            <div className="p-8 lg:p-10 rounded-3xl bg-gray-900 text-white flex flex-col sm:flex-row items-center gap-6 shadow-lg">
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0">
                <MessageSquare size={24} className="text-emerald-400" />
              </div>
              <div className="flex-grow text-center sm:text-left">
                <h5 className="text-lg font-bold mb-1">
                  Want to create an account?
                </h5>
                <p className="text-sm text-gray-400">
                  Join as a donor, volunteer, or partner
                </p>
              </div>
              <Link
                to="/login"
                className="px-6 py-3 bg-white text-gray-900 rounded-xl text-sm font-bold hover:bg-emerald-500 hover:text-white transition-all duration-200 whitespace-nowrap"
              >
                Get Started
              </Link>
            </div>
          </div>
        </Motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
