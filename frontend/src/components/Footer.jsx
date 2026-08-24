import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Send,
  MapPin,
  Mail,
  Phone,
  Loader,
  CheckCircle,
} from "lucide-react";
import { assets } from "../assets/assets";
import { useDispatch, useSelector } from "react-redux";
import { subscribeNewsletter } from "../features/newsletter/newsletterSlice";
import toast from "react-hot-toast";

const Footer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, subscribed } = useSelector((state) => state.newsletter);
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      await dispatch(subscribeNewsletter(email)).unwrap();
      toast.success("Successfully subscribed to our newsletter!");
      setEmail("");
    } catch (error) {
      toast.error(error || "Failed to subscribe. Please try again.");
    }
  };

  const handleLinkClick = (path) => {
    navigate(path);
  };

  return (
    <footer className="relative bg-dark text-gray-300 pt-32 pb-12 px-4 overflow-hidden">
      {/* Background Polish */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary-900/10 rounded-full blur-[120px] -translate-y-1/2 -translate-x-1/2 animate-slow-drift" />
      <div className="scan-line opacity-5" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          {/* Brand Identity */}
          <div className="lg:col-span-1 space-y-8">
            <Link to="/" className="flex items-center gap-4">
              <img
                src={assets.logo}
                alt="logo"
                className="h-14 w-auto object-contain"
              />
            </Link>
            <h3 className="text-2xl font-black text-white tracking-tight leading-tight">
              Sabo Ibadan Youth Charity Foundation
            </h3>
            <p className="text-sm text-gray-400 font-medium leading-relaxed">
              Building brighter futures through education,
              healthcare, and youth empowerment in Sabo, Ibadan.
            </p>

            {/* Social Intelligence Nodes */}
            <div className="flex items-center gap-3">
              {[
                { icon: Facebook, href: "https://facebook.com", name: "Facebook" },
                { icon: Twitter, href: "https://twitter.com", name: "Twitter" },
                { icon: Instagram, href: "https://instagram.com", name: "Instagram" },
                { icon: Linkedin, href: "https://linkedin.com", name: "LinkedIn" },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="w-11 h-11 rounded-2xl bg-white/5 hover:bg-primary-600 text-gray-400 hover:text-white flex items-center justify-center transition-all duration-300 hover-scale-subtle border border-white/5"
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Nodes */}
          <div className="space-y-6">
            <h4 className="text-sm font-black text-white uppercase tracking-[0.2em]">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { name: "About", path: "/about" },
                { name: "Campaigns", path: "/campaigns" },
                { name: "Impact Stories", path: "/blogs" },
                { name: "Team", path: "/about#team" },
                { name: "Partners", path: "/about#partners" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="text-sm text-gray-400 hover:text-primary-400 transition-colors font-medium flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-primary-400 transition-colors" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Protocols */}
          <div className="space-y-6">
            <h4 className="text-sm font-black text-white uppercase tracking-[0.2em]">
              Get Involved
            </h4>
            <ul className="space-y-3">
              {[
                { name: "Help Center", path: "/user/help" },
                { name: "Donate", path: "/make-donation" },
                { name: "Volunteer", path: "/get-involved" },
                { name: "Contact", path: "/contact" },
                { name: "FAQ", path: "/faq" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="text-sm text-gray-400 hover:text-primary-400 transition-colors font-medium flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-primary-400 transition-colors" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Intelligent Briefing */}
          <div className="space-y-6">
            <h4 className="text-sm font-black text-white uppercase tracking-[0.2em] font-outfit">
              Stay Informed
            </h4>
            <p className="text-sm text-gray-400 font-medium leading-relaxed">
              Subscribe for impact stories, mission updates, and
              transparent financial reporting.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading || subscribed}
                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 text-sm font-medium outline-none focus:border-primary-600 focus:ring-4 focus:ring-primary-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="your@email.com"
                required
              />
              <button
                type="submit"
                disabled={loading || subscribed}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl flex items-center justify-center text-white transition-all hover-scale-subtle"
              >
                {loading ? (
                  <Loader className="animate-spin" size={16} />
                ) : subscribed ? (
                  <CheckCircle size={16} />
                ) : (
                  <Send size={16} />
                )}
              </button>
            </form>

            {/* Contact Intelligence */}
            <div className="space-y-4 pt-4">
              {[
                { icon: Mail, text: "info@saboibadanyouth.org", href: "mailto:info@saboibadanyouth.org" },
                { icon: Phone, text: "+234 810 000 0000 (Call/WhatsApp)", href: "https://wa.me/2348100000000" },
                { icon: MapPin, text: "Sabo Community, Ibadan, Oyo State, Nigeria", href: "https://maps.google.com/?q=Sabo+Ibadan+Nigeria" },
              ].map((contact, i) => (
                <a
                  key={i}
                  href={contact.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 text-xs text-gray-400 hover:text-primary-400 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-primary-600/20 transition-colors">
                    <contact.icon size={14} className="text-primary-500 flex-shrink-0" />
                  </div>
                  <span className="font-semibold leading-tight pt-1">{contact.text}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Institutional Signature */}
        <div className="border-t border-white/10 pt-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-2 text-center md:text-left">
              <p className="text-xs font-bold uppercase tracking-widest text-primary-500">
                CAC Registration No: IT/NO/123456 • Registered Nigerian NGO
              </p>
              <p className="text-xs text-gray-400 font-medium">
                © {new Date().getFullYear()}{" "}
                <span className="text-white font-black font-outfit">
                  Sabo Ibadan Youth Charity Foundation
                </span>
                . Transparency is our protocol.
              </p>
            </div>
            <ul className="flex items-center gap-6 flex-wrap justify-center">
              {[
                { name: "Privacy Policy", path: "/privacy-policy" },
                { name: "Terms of Service", path: "/terms-of-service" },
                { name: "Sitemap", path: "/sitemap" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="text-xs text-gray-500 hover:text-primary-400 transition-colors font-medium uppercase tracking-wider"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
