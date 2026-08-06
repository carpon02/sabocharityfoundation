import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { subscribeNewsletter } from "../features/newsletter/newsletterSlice";
import { motion as Motion } from "framer-motion";
import { fadeIn, staggerContainer } from "../utils/animations";
import { Send, CheckCircle, Loader, Mail, Heart, Bell } from "lucide-react";
import toast from "react-hot-toast";

const features = [
  { icon: Bell, text: "Event & program alerts" },
  { icon: Heart, text: "Impact stories from the field" },
  { icon: Mail, text: "Monthly mission briefings" },
];

const NewsletterCTA = () => {
  const dispatch = useDispatch();
  const { loading, subscribed } = useSelector((state) => state.newsletter);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    try {
      await dispatch(subscribeNewsletter(email)).unwrap();
      toast.success("Welcome to the Sabo community! ✨");
      setEmail("");
    } catch (error) {
      toast.error(error || "Subscription failed. Please try again.");
    }
  };

  return (
    <section className="py-20 sm:py-32 bg-gradient-to-br from-primary-50 via-paper to-secondary-50 relative overflow-hidden">
      {/* Background Shapes */}
      <Motion.div
        className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-100/60 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/3 pointer-events-none"
        animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0.8, 0.6] }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      <Motion.div
        className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary-100/60 rounded-full blur-[100px] -translate-x-1/4 translate-y-1/4 pointer-events-none"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 14, repeat: Infinity, delay: 2 }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Motion.div
          className="glass-card-neon-primary rounded-[4rem] p-12 sm:p-16 lg:p-24 shadow-[0_60px_150px_-20px_rgba(16,185,129,0.2)] border-primary-500/20 text-center relative overflow-hidden"
          variants={staggerContainer(0.1, 0)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {/* Badge */}
          <Motion.div
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary-50 border border-primary-200 text-primary-700 text-[10px] font-black uppercase tracking-[0.3em] mb-10"
            variants={fadeIn("down", 0.1)}
          >
            <Mail size={12} />
            Stay Informed
          </Motion.div>

          {/* Headline */}
          <Motion.h2
            className="text-4xl sm:text-5xl lg:text-7xl font-black text-dark tracking-tighter leading-[0.9] mb-6"
            variants={fadeIn("up", 0.2)}
          >
            Don't Miss &<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">
              Moment of Impact.
            </span>
          </Motion.h2>

          <Motion.p
            className="text-lg sm:text-xl text-dark/70 font-medium leading-relaxed max-w-2xl mx-auto mb-12 italic border-l-4 border-primary-500 pl-8 py-2"
            variants={fadeIn("up", 0.3)}
          >
            "Information is the catalyst for coordinated action. Join the Sabo 
            Intelligence Briefing for real-time mission updates and impact stories."
          </Motion.p>

          {/* Feature Pills */}
          <Motion.div
            className="flex flex-wrap items-center justify-center gap-4 mb-12"
            variants={fadeIn("up", 0.35)}
          >
            {features.map((f, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 border border-gray-200 text-gray-600 text-sm font-semibold"
              >
                <f.icon size={14} className="text-primary-600" />
                {f.text}
              </div>
            ))}
          </Motion.div>

          {/* Form */}
          <Motion.form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto"
            variants={fadeIn("up", 0.4)}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading || subscribed}
              placeholder="your@email.com"
              required
              className="flex-1 px-6 py-5 bg-white border-2 border-gray-200 rounded-2xl text-dark placeholder-gray-400 text-sm font-medium outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            />
            <button
              type="submit"
              disabled={loading || subscribed}
              className="group relative px-10 py-5 bg-dark text-white font-black text-[10px] uppercase tracking-[0.4em] rounded-[2rem] hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)] hover:scale-110 active:scale-95 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 whitespace-nowrap overflow-hidden"
            >
              <div className="absolute inset-0 bg-shimmer-fast opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              {loading ? (
                <>
                  <Loader size={16} className="animate-spin relative z-10" /> <span className="relative z-10">Initializing...</span>
                </>
              ) : subscribed ? (
                <>
                  <CheckCircle size={16} className="relative z-10 text-primary-400" /> <span className="relative z-10">Authenticated</span>
                </>
              ) : (
                <>
                  <Send size={16} className="relative z-10" /> <span className="relative z-10">Subscribe</span>
                </>
              )}
            </button>
          </Motion.form>

          {/* Trust */}
          <Motion.p
            className="text-xs text-gray-400 font-medium mt-6"
            variants={fadeIn("up", 0.45)}
          >
            No spam, ever. Unsubscribe anytime. We respect your privacy.
          </Motion.p>
        </Motion.div>
      </div>
    </section>
  );
};

export default NewsletterCTA;
