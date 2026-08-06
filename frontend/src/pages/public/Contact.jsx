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
      title: "Tactical Email",
      value: "info@saboibadanyouth.org",
      sub: "Official Inquiries Only",
      href: "mailto:info@saboibadanyouth.org"
    },
    {
      icon: Phone,
      title: "Direct Response",
      value: "+234 810 000 0000",
      sub: "Call or WhatsApp",
      href: "tel:+2348100000000"
    },
    {
      icon: MessageSquare,
      title: "WhatsApp Node",
      value: "Chat with Us",
      sub: "Instant Community Support",
      href: "https://wa.me/2348100000000"
    },
    {
      icon: MapPin,
      title: "Tactical HQ",
      value: "Sabo Community Area",
      sub: "Ibadan, Oyo State, Nigeria",
      href: "https://maps.google.com/?q=Sabo+Ibadan+Nigeria"
    },
  ];

  return (
    <div className="bg-white min-h-screen">
      <Meta
        title="Contact Us"
        description="Get in touch with the Sabo Ibadan Youth Charity Foundation. We're here to answer your questions and explore ways to collaborate for community impact."
      />
      {/* --- HERO HEADER --- */}
      <section className="relative pt-32 pb-40 bg-dark overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-900/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />

        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-secondary-500 font-bold text-xs uppercase tracking-widest animate-fade-in-up">
            <MessageSquare className="w-4 h-4" />
            Direct Channel
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter animate-fade-in-up">
            Let's start the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">
              Dialogue.
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto animate-fade-in-up stagger-1">
            Whether you're a donor, a volunteer, or a community member in need -
            our doors and lines are always open.
          </p>
        </div>
      </section>

      {/* --- CONTENT SECTION (FLOAT OVER HERO) --- */}
      <section className="relative -mt-32 z-20 px-4 pb-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Contact Details Column */}
            <div className="lg:col-span-1 space-y-6">
              {contactInfo.map((info, i) => (
                <a
                  key={i}
                  href={info.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block glass-card p-10 rounded-[2.5rem] border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 animate-fade-in-up group"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center group-hover:bg-primary-600 group-hover:text-white transition-all duration-500">
                      <info.icon size={24} />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">
                        {info.title}
                      </h4>
                      <p className="text-lg font-black text-dark mt-1">
                        {info.value}
                      </p>
                      <p className="text-xs text-primary-600 font-bold mt-1">
                        {info.sub}
                      </p>
                    </div>
                  </div>
                </a>
              ))}

              {/* Social Stack */}
              <div className="bg-dark p-10 rounded-[2.5rem] space-y-6 text-white animate-fade-in-up stagger-2">
                <h4 className="text-sm font-black uppercase tracking-widest text-gray-400">
                  Social Synergy
                </h4>
                <div className="flex gap-4">
                  {[Linkedin, Instagram, Twitter].map((Icon, i) => (
                    <button
                      key={i}
                      className="w-12 h-12 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                    >
                      <Icon size={20} className="text-primary-400" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Form Column */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-[4rem] p-10 md:p-20 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] border border-gray-50 animate-fade-in-up stagger-1">
                <div className="space-y-4 mb-12">
                  <h2 className="text-4xl font-black text-dark tracking-tight">
                    Send an Official{" "}
                    <span className="text-primary-700">Message</span>
                  </h2>
                  <p className="text-gray-500 font-medium">
                    Use this form for strategic partnerships or general
                    inquiries.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">
                        Full Identity
                      </label>
                      <input
                        required
                        placeholder="John Doe"
                        className="w-full py-5 px-8 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-primary-500 outline-none transition-all font-bold text-dark placeholder:text-gray-300 shadow-sm"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">
                        Email Address
                      </label>
                      <input
                        required
                        type="email"
                        placeholder="john@example.com"
                        className="w-full py-5 px-8 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-primary-500 outline-none transition-all font-bold text-dark placeholder:text-gray-300 shadow-sm"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">
                      Inquiry Subject
                    </label>
                    <input
                      required
                      placeholder="How can we help you?"
                      className="w-full py-5 px-8 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-primary-500 outline-none transition-all font-bold text-dark placeholder:text-gray-300 shadow-sm"
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">
                      Your Context / Message
                    </label>
                    <textarea
                      required
                      rows={6}
                      placeholder="Describe your inquiry in detail..."
                      className="w-full py-6 px-8 rounded-3xl bg-gray-50 border border-transparent focus:bg-white focus:border-primary-500 outline-none transition-all font-bold text-dark placeholder:text-gray-300 shadow-sm resize-none"
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                    />
                  </div>

                  <button
                    disabled={sending}
                    className="w-full py-6 bg-primary-900 hover:bg-dark text-white font-black rounded-[2rem] shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-4 disabled:opacity-50"
                  >
                    {sending
                      ? "Processing Transmission..."
                      : "Execute Transmission"}
                    <Send
                      size={20}
                      className={sending ? "animate-pulse" : ""}
                    />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- CTA BOTTOM --- */}
      <section className="py-24 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-10">
          <h3 className="text-4xl font-black text-dark tracking-tighter">
            Looking for more{" "}
            <span className="text-secondary-600">immediate</span> impact?
          </h3>
          <div className="flex flex-wrap justify-center gap-6">
            <Link
              to="/get-involved"
              className="px-12 py-6 bg-white border-4 border-primary-100 text-primary-900 font-black rounded-3xl hover:border-primary-300 transition-all flex items-center gap-3"
            >
              Explore Opportunities
              <Sparkles size={20} className="text-secondary-500" />
            </Link>
            <a
              href="https://wa.me/2348100000000"
              target="_blank"
              rel="noopener noreferrer"
              className="px-12 py-6 bg-[#25D366] text-white font-black rounded-3xl hover:bg-[#128C7E] shadow-xl transition-all flex items-center gap-3"
            >
              Chat on WhatsApp
              <MessageSquare size={20} className="fill-white" />
            </a>
            <Link
              to="/make-donation"
              className="px-12 py-6 bg-primary-600 text-white font-black rounded-3xl hover:bg-primary-700 shadow-xl transition-all flex items-center gap-3"
            >
              Make a Donation
              <Heart size={20} className="fill-white" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
