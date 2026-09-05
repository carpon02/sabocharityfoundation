import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  Heart,
  Sparkles,
  Linkedin,
  Instagram,
  Twitter,
} from "lucide-react";
import toast from "react-hot-toast";
import Meta from "../../components/Meta";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    // Simulate API call
    setTimeout(() => {
      setSending(false);
      toast.success("Message sent! Our team will reach out shortly.");
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 1500);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      value: "info@saboibadanyouth.org",
      sub: "Official Inquiries",
      href: "mailto:info@saboibadanyouth.org",
    },
    {
      icon: Phone,
      title: "Phone",
      value: "+234 810 000 0000",
      sub: "Call or WhatsApp",
      href: "tel:+2348100000000",
    },
    {
      icon: MessageSquare,
      title: "WhatsApp",
      value: "Chat with Us",
      sub: "Instant Support",
      href: "https://wa.me/2348100000000",
    },
    {
      icon: MapPin,
      title: "Location",
      value: "Sabo Community Area",
      sub: "Ibadan, Oyo State, Nigeria",
      href: "https://maps.google.com/?q=Sabo+Ibadan+Nigeria",
    },
  ];

  return (
    <div className="bg-white min-h-screen">
      <Meta
        title="Contact Us"
        description="Get in touch with the Sabo Ibadan Youth Charity Foundation. We're here to answer your questions and explore ways to collaborate for community impact."
      />

      {/* ── HERO ── */}
      <section className="relative pt-28 pb-36 bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-emerald-950/40" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <MessageSquare className="w-3.5 h-3.5" />
            Get In Touch
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight">
            Let's Start the{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
              Conversation
            </span>
          </h1>
          <p className="text-lg text-gray-400 max-w-xl mx-auto leading-relaxed">
            Whether you're a donor, a volunteer, or a community member in need —
            our doors and lines are always open.
          </p>
        </div>
      </section>

      {/* ── CONTENT ── */}
      <section className="relative -mt-20 z-20 px-4 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Info Cards */}
            <div className="lg:col-span-1 space-y-4">
              {contactInfo.map((info, i) => (
                <a
                  key={i}
                  href={info.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors shrink-0">
                      <info.icon size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                        {info.title}
                      </p>
                      <p className="text-sm font-bold text-gray-900 truncate">
                        {info.value}
                      </p>
                      <p className="text-xs text-emerald-600">{info.sub}</p>
                    </div>
                  </div>
                </a>
              ))}

              {/* Social */}
              <div className="bg-gray-900 p-6 rounded-xl space-y-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Follow Us
                </h4>
                <div className="flex gap-3">
                  {[Linkedin, Instagram, Twitter].map((Icon, i) => (
                    <button
                      key={i}
                      className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                    >
                      <Icon size={16} className="text-emerald-400" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-8 sm:p-12 shadow-lg border border-gray-100">
                <div className="space-y-2 mb-8">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Send a{" "}
                    <span className="text-emerald-600">Message</span>
                  </h2>
                  <p className="text-sm text-gray-500">
                    Use this form for partnerships or general inquiries.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Full Name
                      </label>
                      <input
                        required
                        placeholder="John Doe"
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-sm"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Email Address
                      </label>
                      <input
                        required
                        type="email"
                        placeholder="john@example.com"
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-sm"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Subject
                    </label>
                    <input
                      required
                      placeholder="How can we help you?"
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-sm"
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Message
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Describe your inquiry in detail..."
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-sm resize-none"
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                    />
                  </div>

                  <button
                    disabled={sending}
                    className="w-full py-3.5 bg-gray-900 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 text-sm"
                  >
                    {sending ? "Sending..." : "Send Message"}
                    <Send
                      size={16}
                      className={sending ? "animate-pulse" : ""}
                    />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="py-20 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-8">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Looking for more{" "}
            <span className="text-emerald-600">immediate</span> impact?
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/get-involved"
              className="px-8 py-3.5 bg-white border border-gray-200 text-gray-900 font-semibold rounded-xl hover:border-emerald-200 hover:bg-emerald-50 transition-all flex items-center gap-2 text-sm"
            >
              Explore Opportunities
              <Sparkles size={16} className="text-emerald-500" />
            </Link>
            <a
              href="https://wa.me/2348100000000"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 bg-[#25D366] text-white font-semibold rounded-xl hover:bg-[#128C7E] transition-colors flex items-center gap-2 text-sm shadow-md"
            >
              Chat on WhatsApp
              <MessageSquare size={16} />
            </a>
            <Link
              to="/make-donation"
              className="px-8 py-3.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors flex items-center gap-2 text-sm shadow-md"
            >
              Make a Donation
              <Heart size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
