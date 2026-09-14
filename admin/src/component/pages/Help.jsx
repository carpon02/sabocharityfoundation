// admin/src/component/pages/Help.jsx - Help Center — Clerk-Style UI
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search,
  Phone,
  Shield,
  Target,
  Users,
  DollarSign,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Clock,
  Activity,
  ExternalLink,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const Help = () => {
  const { darkMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaq, setExpandedFaq] = useState(null);

  const categories = [
    {
      title: "Campaigns",
      icon: Target,
      desc: "Managing and scaling community campaigns.",
    },
    {
      title: "Donations",
      icon: DollarSign,
      desc: "Processing and verifying donation records.",
    },
    {
      title: "Donors",
      icon: Users,
      desc: "Donor relationships and account management.",
    },
    {
      title: "Data Privacy",
      icon: Shield,
      desc: "Security and compliance guidelines.",
    },
  ];

  const adminFaqs = [
    {
      id: 1,
      question: "How do I pause a campaign?",
      answer:
        "Navigate to Campaigns, find the specific campaign, and use the status toggle or edit modal to deactivate it. This preserves all data while stopping new donations from being accepted.",
    },
    {
      id: 2,
      question: "How do I verify a donation?",
      answer:
        "Go to Donations and filter by 'Pending Review'. Open the donation details, cross-reference the transaction ID, then click Approve or Reject.",
    },
    {
      id: 3,
      question: "How are admin permissions managed?",
      answer:
        "Permissions are managed by the super admin. To add or change access for other team members, contact the technical support team or use the Settings page.",
    },
    {
      id: 4,
      question: "How do I export a report?",
      answer:
        "Go to Analytics and click 'Export CSV'. This downloads a complete donations report for the selected time period, suitable for stakeholder presentations.",
    },
    {
      id: 5,
      question: "Who can approve campaigns?",
      answer:
        "Only super admins and admins with the appropriate role can approve or reject campaigns. Campaign creators can edit their own campaigns but not approve them.",
    },
  ];

  const filteredFaqs = adminFaqs.filter(
    (faq) =>
      !searchQuery ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const contacts = [
    {
      label: "Technical Support",
      contact: "tech@saboyouth.org",
      time: "4h response",
      icon: Activity,
    },
    {
      label: "Finance Team",
      contact: "finance@saboyouth.org",
      time: "8h response",
      icon: Shield,
    },
    {
      label: "Emergency Line",
      contact: "+234 803 SYF OPS",
      time: "Immediate",
      icon: Phone,
    },
  ];

  const cardBase = `rounded-xl border ${
    darkMode
      ? "bg-dark-lighter border-gray-800/70"
      : "bg-white border-gray-200/80 shadow-sm"
  }`;

  return (
    <div className="space-y-6 pb-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className={`text-xl font-semibold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Help Center
          </h1>
          <p
            className={`text-sm mt-0.5 ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Admin resources, FAQs, and support contacts
          </p>
        </div>

        {/* Search */}
        <div className="relative sm:w-64">
          <Search
            className={`absolute left-3 top-1/2 -translate-y-1/2 ${
              darkMode ? "text-gray-500" : "text-gray-400"
            }`}
            size={15}
          />
          <input
            type="text"
            placeholder="Search help..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-9 pr-4 py-2 rounded-lg border text-sm outline-none transition-all ${
              darkMode
                ? "bg-gray-800/60 border-gray-700/50 text-white placeholder-gray-500 focus:border-primary-500/50"
                : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-primary-500/50"
            }`}
          />
        </div>
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((cat, i) => {
          const Icon = cat.icon;
          return (
            <div
              key={i}
              className={`p-5 rounded-xl border flex items-start gap-4 transition-all hover:shadow-md cursor-default ${
                darkMode
                  ? "bg-dark-lighter border-gray-800/70 hover:border-gray-700"
                  : "bg-white border-gray-200/80 shadow-sm hover:border-gray-300"
              }`}
            >
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  darkMode ? "bg-gray-800" : "bg-gray-50"
                }`}
              >
                <Icon size={18} className="text-primary-600" />
              </div>
              <div>
                <p
                  className={`text-sm font-semibold mb-0.5 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {cat.title}
                </p>
                <p
                  className={`text-xs leading-relaxed ${
                    darkMode ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  {cat.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* FAQs */}
        <div className={`xl:col-span-2 ${cardBase} overflow-hidden`}>
          <div
            className={`px-5 py-4 border-b flex items-center gap-2.5 ${
              darkMode ? "border-gray-800/60" : "border-gray-100"
            }`}
          >
            <HelpCircle size={17} className="text-primary-500" />
            <h2
              className={`text-sm font-semibold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Frequently Asked Questions
            </h2>
            <span
              className={`ml-auto px-2 py-0.5 rounded-full text-xs font-medium ${
                darkMode
                  ? "bg-gray-800 text-gray-400"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {filteredFaqs.length}
            </span>
          </div>

          <div className="divide-y divide-gray-100 dark:divide-gray-800/50">
            {filteredFaqs.length === 0 ? (
              <div className="px-5 py-10 text-center">
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  No FAQs match your search
                </p>
              </div>
            ) : (
              filteredFaqs.map((faq) => (
                <div key={faq.id}>
                  <button
                    onClick={() =>
                      setExpandedFaq(expandedFaq === faq.id ? null : faq.id)
                    }
                    className={`w-full px-5 py-4 flex items-center justify-between text-left transition-colors ${
                      darkMode ? "hover:bg-gray-800/30" : "hover:bg-gray-50/50"
                    }`}
                  >
                    <span
                      className={`text-sm font-medium pr-4 ${
                        expandedFaq === faq.id
                          ? darkMode
                            ? "text-white"
                            : "text-primary-700"
                          : darkMode
                          ? "text-gray-200"
                          : "text-gray-800"
                      }`}
                    >
                      {faq.question}
                    </span>
                    <div
                      className={`flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center ${
                        expandedFaq === faq.id
                          ? "bg-primary-500 text-white"
                          : darkMode
                          ? "bg-gray-800 text-gray-400"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {expandedFaq === faq.id ? (
                        <ChevronUp size={14} />
                      ) : (
                        <ChevronDown size={14} />
                      )}
                    </div>
                  </button>
                  <AnimatePresence>
                    {expandedFaq === faq.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div
                          className={`px-5 pb-4 text-sm leading-relaxed ${
                            darkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-4">
          {/* Support Contacts */}
          <div className={cardBase}>
            <div
              className={`px-5 py-4 border-b ${
                darkMode ? "border-gray-800/60" : "border-gray-100"
              }`}
            >
              <h2
                className={`text-sm font-semibold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Support Team
              </h2>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-800/50">
              {contacts.map((c, i) => {
                const Icon = c.icon;
                return (
                  <div key={i} className="px-5 py-4">
                    <div className="flex items-center gap-3 mb-1.5">
                      <div
                        className={`w-7 h-7 rounded-md flex items-center justify-center ${
                          darkMode ? "bg-gray-800" : "bg-gray-50"
                        }`}
                      >
                        <Icon size={14} className="text-primary-500" />
                      </div>
                      <span
                        className={`text-xs font-semibold ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {c.label}
                      </span>
                    </div>
                    <p
                      className={`text-xs font-medium mb-1 pl-10 ${
                        darkMode ? "text-primary-400" : "text-primary-600"
                      }`}
                    >
                      {c.contact}
                    </p>
                    <div className="flex items-center gap-1.5 pl-10">
                      <Clock size={11} className="text-gray-400" />
                      <span
                        className={`text-[11px] ${
                          darkMode ? "text-gray-500" : "text-gray-400"
                        }`}
                      >
                        {c.time}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* System Status */}
          <div
            className={`p-5 rounded-xl border ${
              darkMode
                ? "bg-emerald-950/10 border-emerald-900/30"
                : "bg-emerald-50 border-emerald-100"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle size={16} className="text-emerald-500" />
              <span
                className={`text-sm font-semibold ${
                  darkMode ? "text-emerald-400" : "text-emerald-700"
                }`}
              >
                System Status: Nominal
              </span>
            </div>
            <p
              className={`text-xs leading-relaxed ${
                darkMode ? "text-gray-500" : "text-gray-500"
              }`}
            >
              All platform services are operational. Predictive uptime: 99.98%.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
