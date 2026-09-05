import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { subscribeNewsletter } from "../features/newsletter/newsletterSlice";
import { motion as Motion } from "framer-motion";
import { fadeIn, staggerContainer } from "../utils/animations";
import {
  Send,
  CheckCircle,
  Loader2,
  Mail,
  Bell,
  Heart,
  ArrowRight,
} from "lucide-react";
import toast from "react-hot-toast";

const benefits = [
  { icon: Bell, text: "Event & programme alerts" },
  { icon: Heart, text: "Impact stories from the field" },
  { icon: Mail, text: "Monthly community updates" },
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
    <section className="py-20 sm:py-28 bg-gradient-to-br from-emerald-50 via-white to-teal-50 relative overflow-hidden">
      {/* Subtle Background Shapes */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-100/40 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Motion.div
          className="bg-white rounded-3xl border border-gray-200 shadow-xl p-8 sm:p-12 lg:p-16 text-center"
          variants={staggerContainer(0.1, 0)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {/* Icon */}
          <Motion.div
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-100 mb-6"
            variants={fadeIn("down", 0.1)}
          >
            <Mail size={24} className="text-emerald-600" />
          </Motion.div>

          {/* Heading */}
          <Motion.h2
            className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight mb-4"
            variants={fadeIn("up", 0.2)}
          >
            Stay Connected with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
              Our Impact
            </span>
          </Motion.h2>

          <Motion.p
            className="text-base sm:text-lg text-gray-500 max-w-xl mx-auto leading-relaxed mb-8"
            variants={fadeIn("up", 0.25)}
          >
            Get real-time updates on our programmes, events, and the difference
            your support is making in Sabo.
          </Motion.p>

          {/* Benefits */}
          <Motion.div
            className="flex flex-wrap items-center justify-center gap-3 mb-10"
            variants={fadeIn("up", 0.3)}
          >
            {benefits.map((b, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-50 border border-gray-100 text-gray-600 text-sm font-medium"
              >
                <b.icon size={14} className="text-emerald-600" />
                {b.text}
              </div>
            ))}
          </Motion.div>

          {/* Form */}
          <Motion.form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            variants={fadeIn("up", 0.35)}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading || subscribed}
              placeholder="your@email.com"
              required
              className="flex-1 px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 text-sm font-medium outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={loading || subscribed}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap shadow-sm"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Subscribing...
                </>
              ) : subscribed ? (
                <>
                  <CheckCircle size={16} className="text-emerald-400" />
                  Subscribed!
                </>
              ) : (
                <>
                  <Send size={16} />
                  Subscribe
                </>
              )}
            </button>
          </Motion.form>

          {/* Privacy Note */}
          <Motion.p
            className="text-xs text-gray-400 mt-4"
            variants={fadeIn("up", 0.4)}
          >
            No spam, ever. Unsubscribe anytime. We respect your privacy.
          </Motion.p>
        </Motion.div>
      </div>
    </section>
  );
};

export default NewsletterCTA;
