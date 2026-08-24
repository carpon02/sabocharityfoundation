import { motion as Motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  ArrowUpRight,
  Send,
  Globe,
  MessageSquare,
} from "lucide-react";
import { fadeIn, staggerContainer } from "../utils/animations";

const ContactSection = () => {
  return (
    <section className="py-24 sm:py-32 lg:py-48 bg-paper relative overflow-hidden">
      {/* Background Polish: Cinematic Blur Orbs */}
      <Motion.div
        className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-600/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 15, repeat: Infinity }}
      />
      <Motion.div
        className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary-100/30 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"
        animate={{ scale: [1.2, 1, 1.2], rotate: [0, 90, 0] }}
        transition={{ duration: 20, repeat: Infinity }}
      />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <Motion.div
          className="text-center mb-24 lg:mb-32 space-y-8"
          variants={staggerContainer(0.1, 0)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <Motion.div
            className="inline-flex items-center gap-4 px-6 py-2 rounded-full glass-card border-gray-100 text-primary-700 font-black text-[10px] uppercase tracking-[0.4em] shadow-sm mx-auto"
            variants={fadeIn("down", 0.2)}
          >
            <Send size={14} className="text-secondary-500 animate-pulse" />
            Get In Touch
          </Motion.div>

          <Motion.h2
            className="text-5xl sm:text-6xl md:text-8xl font-black text-dark tracking-tighter leading-[0.8]"
            variants={fadeIn("up", 0.3)}
          >
            Contact <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-primary-900 to-secondary-600">
              Us Today.
            </span>
          </Motion.h2>

          <Motion.p
            className="text-lg sm:text-xl text-gray-400 font-medium max-w-2xl mx-auto leading-relaxed border-l-2 border-primary-50 pl-8 italic"
            variants={fadeIn("up", 0.4)}
          >
            "Have a question, want to partner with us, or just want to say hello?
            We'd love to hear from you. Reach out to the Sabo Ibadan Youth Charity Foundation."
          </Motion.p>
        </Motion.div>

        <Motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12"
          variants={staggerContainer(0.1, 0.4)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {[
            {
              href: "mailto:info@saboibadanyouth.org",
              icon: Mail,
              label: "Email Us",
              value: "info@saboibadanyouth.org",
              color: "text-primary-600",
              bg: "bg-primary-50",
              glow: "shadow-primary-500/10",
              desc: "For general inquiries, project proposals, and partnership opportunities.",
            },
            {
              href: "tel:+2348100000000",
              icon: Phone,
              label: "Call Us",
              value: "+234 810 000 0000",
              color: "text-secondary-600",
              bg: "bg-secondary-50",
              glow: "shadow-secondary-500/10",
              desc: "Direct hotline for urgent coordination and on-ground support.",
            },
            {
              href: "https://goo.gl/maps/example",
              icon: MapPin,
              label: "Visit Us",
              value: "Sabo Community Area, Ibadan",
              color: "text-amber-600",
              bg: "bg-amber-50",
              glow: "shadow-amber-500/10",
              isExternal: true,
              desc: "Visit us for meetings, workshops, and community events.",
            },
          ].map((node, i) => (
            <Motion.a
              key={i}
              href={node.href}
              target={node.isExternal ? "_blank" : undefined}
              rel={node.isExternal ? "noopener noreferrer" : undefined}
              variants={fadeIn("up", 0.5 + i * 0.1)}
              whileHover={{ y: -16 }}
              className={`group relative p-10 lg:p-14 rounded-[4rem] bg-white border border-gray-100 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] transition-all duration-700 flex flex-col items-center text-center overflow-hidden hover:${node.glow}`}
            >
              {/* Node Active State Design */}
              <div
                className={`absolute top-0 right-0 w-32 h-32 ${node.bg} opacity-0 group-hover:opacity-100 blur-[50px] transition-opacity duration-700 -translate-y-1/2 translate-x-1/2`}
              />

              <div
                className={`w-20 h-20 rounded-[2rem] flex items-center justify-center mb-10 transition-all duration-700 ${node.bg} group-hover:scale-110 shadow-inner group-hover:rotate-[360deg]`}
              >
                <node.icon className={`w-10 h-10 ${node.color}`} />
              </div>

              <div className="space-y-6 relative z-10 flex-grow">
                <div>
                  <div className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em] mb-3 group-hover:text-primary-600 transition-colors">
                    {node.label}
                  </div>
                  <h3 className="text-2xl font-black text-dark tracking-tighter leading-tight break-all">
                    {node.value}
                  </h3>
                </div>

                <p className="text-sm font-medium text-gray-400 group-hover:text-gray-600 transition-colors">
                  {node.desc}
                </p>
              </div>

              <div className="mt-12 flex items-center gap-3 text-[10px] font-black text-dark uppercase tracking-[0.5em] opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                Connect{" "}
                <ArrowUpRight size={14} className="text-secondary-500" />
              </div>
            </Motion.a>
          ))}
        </Motion.div>

        {/* Dynamic Social Grid */}
        <Motion.div
          className="mt-24 lg:mt-32 pt-24 border-t border-gray-100 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
          variants={fadeIn("up", 0.8)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <div className="space-y-8">
            <h4 className="text-3xl sm:text-4xl font-black text-dark tracking-tighter">
              Follow Us on <br />
              <span className="text-primary-600">Social Media.</span>
            </h4>
            <div className="flex flex-wrap gap-4">
              {[
                "Twitter / X",
                "LinkedIn",
                "Instagram",
                "Blog",
              ].map((link) => (
                <button
                  key={link}
                  className="px-6 py-3 rounded-2xl bg-gray-50 text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] border border-transparent hover:border-primary-100 hover:text-primary-600 hover:bg-white transition-all duration-500"
                >
                  {link}
                </button>
              ))}
            </div>
          </div>

          <div className="p-8 lg:p-12 rounded-[3rem] bg-dark-darker text-white flex flex-col sm:flex-row items-center gap-10 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-primary-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative z-10 w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-700">
              <MessageSquare size={32} className="text-primary-400" />
            </div>
            <div className="relative z-10 flex-grow text-center sm:text-left">
              <p className="text-[10px] font-black text-primary-500 uppercase tracking-[0.3em] mb-2">
                Get Started
              </p>
              <h5 className="text-xl font-black tracking-tight mb-4">
                Create an Account?
              </h5>
              <button className="text-[10px] font-black uppercase tracking-[0.4em] px-8 py-3 bg-white text-black rounded-xl hover:bg-primary-500 hover:text-white transition-all duration-500">
                Access Portal
              </button>
            </div>
          </div>
        </Motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
