// admin/src/component/pages/Help.jsx - Foundation Resource Center
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Mail,
  Phone,
  Book,
  FileText,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Send,
  HelpCircle,
  Rocket,
  Shield,
  Target,
  Users,
  DollarSign,
  BarChart3,
  MessageCircle,
  Clock,
  AlertCircle,
  CheckCircle,
  Zap,
  Activity,
  Info,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const Help = () => {
  const { darkMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaq, setExpandedFaq] = useState(null);

  const doctrineProtocols = [
    {
      title: "Project Expansion",
      icon: Target,
      desc: "Scaling community impact through project optimization.",
      color: "from-emerald-600 to-teal-600",
    },
    {
      title: "Donation Hub",
      icon: DollarSign,
      desc: "Managing donation records and transparency.",
      color: "from-emerald-500 to-teal-400",
    },
    {
      title: "Donor Relations",
      icon: Users,
      desc: "Building relationships with our community supporters.",
      color: "from-emerald-400 to-teal-500",
    },
    {
      title: "Data Privacy",
      icon: Shield,
      desc: "Ensuring security of foundation and donor data.",
      color: "from-teal-600 to-emerald-700",
    },
  ];

  const adminFaqs = [
    {
      id: 1,
      question: "How to Pause a Project?",
      answer:
        "Navigate to Projects, find the specific project, and use the status toggle to deactivate it. This keeps the data for your records while stopping new donations.",
    },
    {
      id: 2,
      question: "How to Verify a Donation?",
      answer:
        "Go to the Donation Management Hub and look for 'Awaiting Verification'. Cross-reference the transaction details to ensure transparency.",
    },
    {
      id: 3,
      question: "Managing Admin Permissions?",
      answer:
        "Permissions are managed by the main admin. To add or change access for other team members, contact the technical support team.",
    },
  ];

  return (
    <div className="space-y-16 pb-20">
      {/* Support Header */}
      <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-6 lg:gap-8">
        <div>
          <h1
            className={`text-3xl lg:text-5xl font-black tracking-tighter ${
              darkMode ? "text-white" : "text-gray-950"
            }`}
          >
            Resource Center
          </h1>
          <p
            className={`text-[10px] lg:text-xs font-black uppercase tracking-widest mt-2 flex items-center gap-3 ${
              darkMode ? "text-gray-600" : "text-gray-400"
            }`}
          >
            <span className="w-8 lg:w-10 h-0.5 bg-emerald-500" /> Administrative
            Help & Foundation Resources
          </p>
        </div>
        <div className="flex gap-4 w-full lg:w-auto">
          <div className="relative group flex-1 lg:min-w-[300px]">
            <Search className="absolute left-4 lg:left-6 top-1/2 -translate-y-1/2 w-4 lg:w-5 h-4 lg:h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search help resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-12 lg:pl-14 pr-6 lg:pr-8 py-3 lg:py-4 rounded-2xl lg:rounded-[2rem] border font-black text-[10px] lg:text-xs outline-none transition-all ${
                darkMode
                  ? "bg-gray-950 border-gray-800 text-white focus:border-emerald-500/50 shadow-xl"
                  : "bg-white border-gray-100 text-gray-950 focus:border-emerald-500/50 shadow-lg"
              }`}
            />
          </div>
        </div>
      </div>

      {/* Doctrine Protocols Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {doctrineProtocols.map((protocol, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -10 }}
            className={`p-6 lg:p-8 rounded-[2.5rem] lg:rounded-[3rem] border backdrop-blur-md transition-all duration-500 flex flex-col items-center text-center ${
              darkMode
                ? "bg-gray-950 border-gray-800"
                : "bg-white border-gray-100 shadow-xl shadow-gray-200/20"
            }`}
          >
            <div
              className={`w-14 h-14 lg:w-16 lg:h-16 rounded-2xl lg:rounded-3xl bg-gradient-to-br ${protocol.color} flex items-center justify-center text-white shadow-xl mb-4 lg:mb-6`}
            >
              <protocol.icon size={24} className="lg:w-7 lg:h-7" />
            </div>
            <h3
              className={`text-xs lg:text-sm font-black uppercase tracking-widest mb-2 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {protocol.title}
            </h3>
            <p className="text-[9px] lg:text-[10px] font-bold text-gray-500 leading-relaxed">
              {protocol.desc}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Main Support Area */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        <div className="xl:col-span-2 space-y-10">
          <div
            className={`p-10 lg:p-14 rounded-[4rem] border ${
              darkMode
                ? "bg-gray-950 border-gray-800"
                : "bg-white border-gray-100 shadow-2xl"
            }`}
          >
            <div className="flex items-center gap-6 mb-12">
              <div className="p-5 rounded-3xl bg-emerald-500/10">
                <HelpCircle size={32} className="text-emerald-500" />
              </div>
              <div>
                <h3
                  className={`text-2xl font-black tracking-tight ${
                    darkMode ? "text-white" : "text-gray-950"
                  }`}
                >
                  Operational FAQs
                </h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mt-1">
                  Answers to Common Questions
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {adminFaqs.map((faq) => (
                <div
                  key={faq.id}
                  className={`rounded-[2rem] border transition-all duration-500 ${
                    expandedFaq === faq.id
                      ? darkMode
                        ? "bg-gray-900 border-emerald-500/30 shadow-2xl shadow-emerald-500/5"
                        : "bg-emerald-50 border-emerald-500/20"
                      : darkMode
                        ? "bg-gray-950 border-gray-800"
                        : "bg-white border-gray-100"
                  }`}
                >
                  <button
                    onClick={() =>
                      setExpandedFaq(expandedFaq === faq.id ? null : faq.id)
                    }
                    className="w-full p-8 flex items-center justify-between text-left"
                  >
                    <span
                      className={`text-xs font-black uppercase tracking-widest ${
                        expandedFaq === faq.id
                          ? darkMode
                            ? "text-white"
                            : "text-emerald-600"
                          : darkMode
                            ? "text-gray-400"
                            : "text-gray-600"
                      }`}
                    >
                      {faq.question}
                    </span>
                    <div
                      className={`p-2 rounded-xl transition-all ${
                        expandedFaq === faq.id
                          ? "bg-emerald-600 text-white"
                          : darkMode
                            ? "bg-gray-900 text-gray-600"
                            : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {expandedFaq === faq.id ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </div>
                  </button>
                  <AnimatePresence>
                    {expandedFaq === faq.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div
                          className={`px-8 pb-8 text-[11px] font-bold leading-relaxed ${
                            darkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

          <div
            className={`p-12 rounded-[4rem] border relative overflow-hidden transition-all duration-500 ${
              darkMode
                ? "bg-emerald-950/20 border-emerald-500/20 shadow-2xl"
                : "bg-emerald-50 border-emerald-100 shadow-xl shadow-emerald-200/20"
            }`}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full -mr-20 -mt-20" />
            <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
              <div className="flex-1 space-y-4">
                <div className="p-4 rounded-2xl bg-emerald-500/10 w-fit">
                  <Zap size={32} className="text-emerald-500" />
                </div>
                <h2
                  className={`text-3xl font-black tracking-tight ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Foundation Support
                </h2>
                <p
                  className={`text-sm font-bold leading-relaxed max-w-2xl ${
                    darkMode
                      ? "text-emerald-300/60"
                      : "text-emerald-700 opacity-80"
                  }`}
                >
                  Our resource center is optimized for administrative
                  excellence. Every guide ensures the Sabo youth mission remains
                  strong and effective.
                </p>
              </div>
              <button className="bg-emerald-600 px-12 py-6 rounded-3xl font-black uppercase tracking-widest text-[11px] text-white shadow-2xl shadow-emerald-600/40 hover:bg-emerald-700 transition-all active:scale-95">
                Full Resource Archive
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-10">
          <div
            className={`p-10 rounded-[3rem] border backdrop-blur-md ${
              darkMode
                ? "bg-gray-950 border-gray-800 shadow-2xl"
                : "bg-white border-gray-100 shadow-2xl shadow-gray-200/20"
            }`}
          >
            <h3
              className={`text-xl font-black tracking-tight mb-8 ${
                darkMode ? "text-white" : "text-gray-950"
              }`}
            >
              Support Team
            </h3>
            <div className="space-y-6">
              {[
                {
                  label: "Technical Ops",
                  contact: "tech@saboyouth.org",
                  time: "4h Response",
                  icon: Activity,
                },
                {
                  label: "Fiscal Integrity",
                  contact: "finance@saboyouth.org",
                  time: "8h Response",
                  icon: Shield,
                },
                {
                  label: "Direct Emergency",
                  contact: "+234 803 SYF OPS",
                  time: "Immediate",
                  icon: Phone,
                },
              ].map((contact, i) => (
                <div
                  key={i}
                  className={`p-6 rounded-[2rem] border transition-all ${
                    darkMode
                      ? "bg-gray-900 border-gray-800 hover:border-emerald-500/30"
                      : "bg-gray-50 border-gray-100 hover:border-emerald-500/20"
                  }`}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                      <contact.icon size={18} />
                    </div>
                    <span
                      className={`text-[10px] font-black uppercase tracking-widest ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {contact.label}
                    </span>
                  </div>
                  <p
                    className={`text-xs font-black truncate mb-2 ${
                      darkMode ? "text-emerald-400" : "text-emerald-600"
                    }`}
                  >
                    {contact.contact}
                  </p>
                  <div className="flex items-center gap-2">
                    <Clock size={12} className="text-gray-500" />
                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                      {contact.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className={`p-10 rounded-[3rem] border backdrop-blur-md ${
              darkMode
                ? "bg-emerald-950/10 border-emerald-500/20"
                : "bg-emerald-50 border-emerald-100 shadow-xl shadow-emerald-200/20"
            }`}
          >
            <div className="flex items-center gap-4 mb-6 text-emerald-500">
              <CheckCircle size={24} />
              <span className="text-[10px] font-black uppercase tracking-widest">
                System Health: Nominal
              </span>
            </div>
            <p className="text-[10px] font-bold text-gray-500 leading-relaxed translate-y-[-4px]">
              Platform operational vectors are synchronized. Predictive uptime:
              99.98%.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
