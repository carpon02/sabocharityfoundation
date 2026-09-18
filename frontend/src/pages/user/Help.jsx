// pages/user/Help.jsx — Clerk-style redesign
import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  BookOpen,
  Wallet,
  Target,
  Heart,
  Shield,
  PlayCircle,
  Phone,
  Mail,
  MapPin,
  ChevronDown,
  ChevronRight,
  MessageSquare,
  Send,
  ExternalLink,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

// ── Help content ──────────────────────────────────────────────────────────────
const CATEGORIES = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: PlayCircle,
    faqs: [
      {
        q: "How do I create an account?",
        a: "Click 'Sign In' in the top navigation, then switch to 'Create account'. Fill in your name, email, and password. Check your email for a verification link to activate your account.",
      },
      {
        q: "How do I make my first donation?",
        a: "Browse campaigns from the Campaigns page, open one you want to support, enter your amount, and complete payment via Paystack. You'll receive a receipt via email immediately.",
      },
      {
        q: "How do I navigate the platform?",
        a: "Your dashboard shows an overview of your activity. Use the sidebar to access My Donations, My Campaigns, Events, and Settings.",
      },
    ],
  },
  {
    id: "donations",
    title: "Donations & Payments",
    icon: Wallet,
    faqs: [
      {
        q: "What payment methods are accepted?",
        a: "We accept Nigerian bank transfers, Paystack (card + bank), OPay, PalmPay, and Kuda. All payments are processed securely via Paystack.",
      },
      {
        q: "How do I download my donation receipt?",
        a: "Go to My Donations, find the donation row, and click the download icon on the right. A PDF receipt will be generated automatically.",
      },
      {
        q: "Can I get a refund on a donation?",
        a: "Donations are generally non-refundable. For exceptional circumstances, contact us within 7 days at support@sabocharityfoundation.org.",
      },
      {
        q: "Is my payment information secure?",
        a: "Yes. We use Paystack, a PCI DSS-compliant payment processor. We never store your card or bank details.",
      },
    ],
  },
  {
    id: "campaigns",
    title: "Creating Campaigns",
    icon: Target,
    faqs: [
      {
        q: "How do I create a campaign?",
        a: "Go to My Campaigns in your dashboard, click 'New Campaign', fill in the title, category, description, target amount, and optionally add images. Submit for admin review.",
      },
      {
        q: "How long does campaign approval take?",
        a: "Campaigns are reviewed within 1–3 business days. You'll receive an email notification once approved or if changes are needed.",
      },
      {
        q: "What are the campaign guidelines?",
        a: "Campaigns must be for genuine community needs in Sabo Ibadan or Nigeria. No political, religious, or personal profit campaigns. See our full terms for details.",
      },
    ],
  },
  {
    id: "events",
    title: "Events & Community",
    icon: Heart,
    faqs: [
      {
        q: "How do I register for an event?",
        a: "Go to Events in your dashboard, find an event, and click 'Register'. Free events register instantly. Paid events redirect you to complete payment.",
      },
      {
        q: "Can I cancel my event registration?",
        a: "Contact us at least 48 hours before the event to cancel. Refunds for paid events are processed within 5–7 business days.",
      },
    ],
  },
  {
    id: "account",
    title: "Account & Security",
    icon: Shield,
    faqs: [
      {
        q: "How do I change my password?",
        a: "Go to Settings → Security tab, enter your current password, then set a new one. Use a strong password with at least 8 characters.",
      },
      {
        q: "How do I update my profile information?",
        a: "Go to Settings → Profile tab. Update your name, phone, bio, and location, then click Save.",
      },
      {
        q: "Can I delete my account?",
        a: "Contact support@sabocharityfoundation.org from your registered email address to request account deletion. Your donation history will be retained for legal compliance.",
      },
    ],
  },
];

// ── Shared UI ─────────────────────────────────────────────────────────────────
const Card = ({ children, className = "" }) => {
  const { darkMode } = useTheme();
  return (
    <div className={`rounded-xl border ${darkMode ? "bg-[#111] border-gray-800" : "bg-white border-gray-200 shadow-sm"} ${className}`}>
      {children}
    </div>
  );
};

// ── FAQ Accordion Item ────────────────────────────────────────────────────────
const FaqItem = ({ q, a }) => {
  const { darkMode } = useTheme();
  const [open, setOpen] = useState(false);
  return (
    <div className={`border-b last:border-0 ${darkMode ? "border-gray-800" : "border-gray-100"}`}>
      <button
        onClick={() => setOpen((p) => !p)}
        className={`w-full flex items-center justify-between gap-3 px-5 py-4 text-left transition-colors ${
          darkMode ? "hover:bg-gray-800/40" : "hover:bg-gray-50"
        }`}
      >
        <span className={`text-sm font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>
          {q}
        </span>
        <ChevronDown
          size={15}
          className={`shrink-0 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className={`px-5 pb-4 text-sm leading-relaxed ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          {a}
        </div>
      )}
    </div>
  );
};

// ── Category Section ──────────────────────────────────────────────────────────
const CategorySection = ({ cat, isOpen, onToggle }) => {
  const { darkMode } = useTheme();
  const Icon = cat.icon;
  return (
    <Card className="overflow-hidden">
      <button
        onClick={onToggle}
        className={`w-full flex items-center gap-3 px-5 py-4 transition-colors ${
          darkMode ? "hover:bg-gray-800/30" : "hover:bg-gray-50"
        }`}
      >
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
          darkMode ? "bg-gray-800" : "bg-gray-100"
        }`}>
          <Icon size={15} className="text-emerald-600" />
        </div>
        <span className={`flex-1 text-sm font-semibold text-left ${darkMode ? "text-white" : "text-gray-900"}`}>
          {cat.title}
        </span>
        <span className="text-[11px] text-gray-400 mr-2">{cat.faqs.length} articles</span>
        <ChevronDown
          size={14}
          className={`text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && (
        <div className={`border-t ${darkMode ? "border-gray-800" : "border-gray-100"}`}>
          {cat.faqs.map((faq) => (
            <FaqItem key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </div>
      )}
    </Card>
  );
};

// ── Main ──────────────────────────────────────────────────────────────────────
const Help = () => {
  const { darkMode } = useTheme();
  const [search, setSearch] = useState("");
  const [openCat, setOpenCat] = useState("getting-started");
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);

  // Filtered search results — flatten all FAQs
  const searchResults = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    const results = [];
    CATEGORIES.forEach((cat) => {
      cat.faqs.forEach((faq) => {
        if (faq.q.toLowerCase().includes(q) || faq.a.toLowerCase().includes(q)) {
          results.push({ ...faq, category: cat.title });
        }
      });
    });
    return results;
  }, [search]);

  const handleSend = (e) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setForm({ name: "", email: "", subject: "", message: "" });
      alert("Message sent! We'll get back to you within 24 hours.");
    }, 1200);
  };

  const inputCls = `w-full px-3 py-2.5 rounded-lg border text-sm outline-none transition-colors ${
    darkMode
      ? "bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:border-gray-600"
      : "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-gray-300 focus:bg-white"
  }`;

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* ── Header ──────────────────────────────────────────────────── */}
      <div>
        <h1 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
          Help & Support
        </h1>
        <p className="text-sm text-gray-400 mt-0.5">Find answers or contact our team</p>
      </div>

      {/* ── Search ──────────────────────────────────────────────────── */}
      <div className="relative">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search help articles…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`w-full pl-10 pr-4 py-3 text-sm rounded-xl border outline-none transition-colors ${
            darkMode
              ? "bg-[#111] border-gray-700 text-white placeholder:text-gray-500 focus:border-gray-600"
              : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-gray-300 shadow-sm"
          }`}
        />
      </div>

      {/* ── Search Results ───────────────────────────────────────────── */}
      {search && (
        <Card>
          {searchResults.length === 0 ? (
            <div className="px-5 py-8 text-center">
              <p className={`text-sm ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                No results for "{search}"
              </p>
            </div>
          ) : (
            <div>
              <p className={`px-5 py-3 text-[11px] font-semibold uppercase tracking-widest border-b ${
                darkMode ? "text-gray-500 border-gray-800" : "text-gray-400 border-gray-100"
              }`}>
                {searchResults.length} result{searchResults.length !== 1 ? "s" : ""}
              </p>
              {searchResults.map((r, i) => (
                <div
                  key={i}
                  className={`px-5 py-3.5 border-b last:border-0 ${darkMode ? "border-gray-800" : "border-gray-100"}`}
                >
                  <p className={`text-[10px] text-gray-400 mb-1`}>{r.category}</p>
                  <p className={`text-sm font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>{r.q}</p>
                  <p className={`text-[12px] mt-1 line-clamp-2 ${darkMode ? "text-gray-500" : "text-gray-500"}`}>{r.a}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* ── Quick Links ──────────────────────────────────────────────── */}
      {!search && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { to: "/campaigns", icon: Target, label: "Browse campaigns" },
            { to: "/user/my-donations", icon: Wallet, label: "My donations" },
            { to: "/user/events", icon: Heart, label: "Find events" },
          ].map(({ to, icon: Icon, label }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-2 p-3.5 rounded-xl border text-sm font-medium transition-all group ${
                darkMode
                  ? "border-gray-800 text-gray-400 hover:text-white hover:border-gray-700"
                  : "border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300"
              }`}
            >
              <Icon size={15} className="text-emerald-500 shrink-0" />
              {label}
              <ChevronRight size={12} className="ml-auto opacity-40 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </div>
      )}

      {/* ── FAQ Categories ───────────────────────────────────────────── */}
      {!search && (
        <div className="space-y-3">
          <p className={`text-[11px] font-semibold uppercase tracking-widest ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
            Frequently asked questions
          </p>
          {CATEGORIES.map((cat) => (
            <CategorySection
              key={cat.id}
              cat={cat}
              isOpen={openCat === cat.id}
              onToggle={() => setOpenCat(openCat === cat.id ? null : cat.id)}
            />
          ))}
        </div>
      )}

      {/* ── Contact Form ─────────────────────────────────────────────── */}
      {!search && (
        <Card className="overflow-hidden">
          <div className={`px-5 py-4 border-b ${darkMode ? "border-gray-800" : "border-gray-100"}`}>
            <p className={`text-sm font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
              Contact support
            </p>
            <p className="text-[12px] text-gray-400 mt-0.5">
              We usually respond within 24 hours
            </p>
          </div>
          <form onSubmit={handleSend} className="p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={`block text-[11px] font-medium mb-1.5 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Name</label>
                <input className={inputCls} placeholder="Your name" value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div>
                <label className={`block text-[11px] font-medium mb-1.5 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Email</label>
                <input className={inputCls} type="email" placeholder="you@example.com" value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </div>
            </div>
            <div>
              <label className={`block text-[11px] font-medium mb-1.5 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Subject</label>
              <input className={inputCls} placeholder="What's this about?" value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })} required />
            </div>
            <div>
              <label className={`block text-[11px] font-medium mb-1.5 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Message</label>
              <textarea rows={4} className={`${inputCls} resize-none`} placeholder="Describe your issue in detail…"
                value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
            </div>
            <button
              type="submit"
              disabled={sending}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {sending ? (
                <span className="w-4 h-4 border-2 border-white/30 dark:border-gray-900/30 border-t-white dark:border-t-gray-900 rounded-full animate-spin" />
              ) : (
                <Send size={13} />
              )}
              {sending ? "Sending…" : "Send message"}
            </button>
          </form>

          {/* Contact info */}
          <div className={`px-5 py-4 border-t flex flex-wrap gap-4 ${darkMode ? "border-gray-800 bg-gray-900/30" : "border-gray-100 bg-gray-50"}`}>
            {[
              { icon: Mail, text: "support@sabocharityfoundation.org", href: "mailto:support@sabocharityfoundation.org" },
              { icon: Phone, text: "+234 800 000 0000", href: "tel:+2348000000000" },
              { icon: MapPin, text: "Sabo, Ibadan, Oyo State" },
            ].map(({ icon: Icon, text, href }) => (
              <div key={text} className="flex items-center gap-2">
                <Icon size={12} className="text-gray-400 shrink-0" />
                {href ? (
                  <a href={href} className="text-[12px] text-emerald-600 hover:underline">{text}</a>
                ) : (
                  <span className="text-[12px] text-gray-400">{text}</span>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default Help;