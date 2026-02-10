import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  BookOpen,
  Wallet,
  Target,
  Heart,
  Shield,
  Clock,
  MessageSquare,
  ArrowRight,
  HelpCircle,
  X,
  Send,
  PlayCircle,
  Phone,
  Mail,
  MapPin,
  Calendar,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

// Help content data
const HELP_CATEGORIES = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: PlayCircle,
    color: "text-primary-600",
    bg: "bg-primary-100 dark:bg-primary-950/30",
    articles: [
      {
        id: "create-account",
        title: "How to create an account",
        content:
          "Learn how to set up your account and get started with Sabo Ibadan Youth Charity Foundation.",
        fullContent: `
          <h3>Creating Your Account</h3>
          <ol>
            <li><strong>Navigate to Registration:</strong> Click "Sign Up" in the top navigation bar</li>
            <li><strong>Provide Information:</strong> Fill in your name, email, phone number, and create a secure password</li>
            <li><strong>Verify Email:</strong> Check your email inbox and click the verification link</li>
            <li><strong>Complete Profile:</strong> Add your location, bio, and profile picture</li>
          </ol>
          <p><strong>Note:</strong> For Nigerian users, we recommend using a Nigerian phone number for SMS notifications.</p>
        `,
        tags: ["account", "registration", "setup"],
        readTime: "3 min read",
      },
      {
        id: "first-donation",
        title: "Making your first donation",
        content:
          "A complete guide to making your first donation, including payment methods accepted in Nigeria.",
        fullContent: `
          <h3>How to Make Your First Donation</h3>
          <ol>
            <li><strong>Find a Campaign:</strong> Browse campaigns in the Campaigns section</li>
            <li><strong>Select Amount:</strong> Choose a preset amount or enter a custom donation</li>
            <li><strong>Choose Payment Method:</strong> Select from bank transfer, mobile money, or card payment</li>
            <li><strong>Complete Payment:</strong> Follow the payment instructions for your chosen method</li>
            <li><strong>Get Receipt:</strong> Download your receipt and track the campaign's progress</li>
          </ol>
          <p><strong>Supported Payment Methods:</strong></p>
          <ul>
            <li>Nigerian bank transfers</li>
            <li>Mobile money (OPay, PalmPay, Kuda)</li>
            <li>Debit/Credit cards from Nigerian banks</li>
          </ul>
        `,
        tags: ["donation", "payment", "first-time"],
        readTime: "5 min read",
      },
      {
        id: "platform-overview",
        title: "Platform overview and navigation",
        content:
          "Understanding the main features and how to navigate through campaigns, events, and your dashboard.",
        fullContent: `
          <h3>Platform Navigation Guide</h3>
          <p>Our platform is designed to make community fundraising easy and transparent.</p>
          
          <h4>Main Sections:</h4>
          <ul>
            <li><strong>Dashboard:</strong> Your personal overview with donation history</li>
            <li><strong>Campaigns:</strong> Browse active fundraising campaigns</li>
            <li><strong>Events:</strong> Discover community events and volunteer opportunities</li>
            <li><strong>Impact:</strong> See the real-world impact of donations in Ibadan</li>
          </ul>
        `,
        tags: ["navigation", "features", "dashboard"],
        readTime: "4 min read",
      },
    ],
  },
  {
    id: "donations",
    title: "Donations & Payments",
    icon: Wallet,
    color: "text-primary-600",
    bg: "bg-primary-100 dark:bg-primary-950/30",
    articles: [
      {
        id: "payment-methods",
        title: "Accepted payment methods in Nigeria",
        content:
          "Bank transfers, mobile money, debit cards, and other payment options available.",
        fullContent: `
          <h3>Payment Methods</h3>
          <p>We accept various payment methods convenient for Nigerian donors:</p>
          
          <h4>Bank Transfers:</h4>
          <ul>
            <li>Direct bank transfer via your banking app</li>
            <li>Internet banking from all Nigerian banks</li>
          </ul>
          
          <h4>Mobile Money:</h4>
          <ul>
            <li>OPay - Instant transfers</li>
            <li>PalmPay - Zero fees</li>
            <li>Kuda - Quick payments</li>
          </ul>
          
          <h4>Cards:</h4>
          <ul>
            <li>Naira debit cards (Verve, Mastercard, Visa)</li>
            <li>International cards (for diaspora donors)</li>
          </ul>
          
          <p><strong>Security:</strong> All transactions are encrypted and secure.</p>
        `,
        tags: ["payment", "nigeria", "bank transfer", "mobile money"],
        readTime: "6 min read",
      },
      {
        id: "donation-receipts",
        title: "Download donation receipts",
        content:
          "How to access and download receipts for your donations for record-keeping purposes.",
        fullContent: `
          <h3>Accessing Your Donation Receipts</h3>
          
          <h4>Instant Receipts:</h4>
          <p>After every donation, you'll receive an instant email receipt with:</p>
          <ul>
            <li>Transaction reference number</li>
            <li>Campaign details</li>
            <li>Amount donated</li>
            <li>Date and time of transaction</li>
          </ul>
          
          <h4>Download from Dashboard:</h4>
          <ol>
            <li>Go to your Dashboard</li>
            <li>Click on "Donation History"</li>
            <li>Find the donation you need a receipt for</li>
            <li>Click "Download Receipt" button</li>
            <li>Choose PDF or print directly</li>
          </ol>
        `,
        tags: ["receipts", "records"],
        readTime: "3 min read",
      },
    ],
  },
  {
    id: "campaigns",
    title: "Creating Campaigns",
    icon: Target,
    color: "text-secondary-600",
    bg: "bg-secondary-100 dark:bg-secondary-950/30",
    articles: [
      {
        id: "create-campaign",
        title: "How to create a successful campaign",
        content:
          "Step-by-step guide to creating compelling campaigns that attract donors and achieve funding goals.",
        fullContent: `
          <h3>Creating a Successful Campaign</h3>
          
          <h4>Preparation:</h4>
          <ul>
            <li>Define clear, specific goals</li>
            <li>Calculate realistic budget</li>
            <li>Gather compelling photos</li>
            <li>Write your story authentically</li>
          </ul>
          
          <h4>Campaign Creation:</h4>
          <ol>
            <li>Click "Create Campaign" from dashboard</li>
            <li>Choose campaign category</li>
            <li>Set funding goal in Naira</li>
            <li>Upload high-quality images</li>
            <li>Write compelling description</li>
            <li>Set campaign duration</li>
          </ol>
          
          <h4>Best Practices:</h4>
          <ul>
            <li><strong>Tell a Story:</strong> Connect emotionally with donors</li>
            <li><strong>Be Specific:</strong> Show exactly how funds will be used</li>
            <li><strong>Regular Updates:</strong> Keep donors informed</li>
            <li><strong>Show Impact:</strong> Share photos and results</li>
          </ul>
        `,
        tags: ["create", "campaign", "fundraising"],
        readTime: "8 min read",
      },
      {
        id: "campaign-guidelines",
        title: "Campaign guidelines and policies",
        content:
          "Rules and best practices for campaigns, including prohibited content and community standards.",
        fullContent: `
          <h3>Campaign Guidelines</h3>
          
          <h4>Allowed Campaigns:</h4>
          <ul>
            <li>Education and scholarship funds</li>
            <li>Healthcare and medical emergencies</li>
            <li>Community development projects</li>
            <li>Youth empowerment programs</li>
          </ul>
          
          <h4>Prohibited Content:</h4>
          <ul>
            <li>Political campaigns</li>
            <li>Illegal activities</li>
            <li>Discriminatory causes</li>
          </ul>
          
          <h4>Verification Requirements:</h4>
          <ul>
            <li>Valid Nigerian identification</li>
            <li>Proof of need</li>
            <li>Bank account information</li>
          </ul>
        `,
        tags: ["guidelines", "policy", "rules"],
        readTime: "6 min read",
      },
    ],
  },
  {
    id: "events",
    title: "Events & Community",
    icon: Calendar,
    color: "text-amber-600",
    bg: "bg-amber-100 dark:bg-amber-950/30",
    articles: [
      {
        id: "find-events",
        title: "Finding events in Ibadan",
        content:
          "How to discover community events and volunteer opportunities in your area.",
        fullContent: `
          <h3>Discovering Local Events</h3>
          
          <h4>Using the Events Page:</h4>
          <ol>
            <li>Navigate to "Events" in the main menu</li>
            <li>Use location filter to find events in Ibadan</li>
            <li>Filter by category</li>
            <li>View event details and register online</li>
          </ol>
          
          <h4>Popular Event Types:</h4>
          <ul>
            <li>Fundraising events</li>
            <li>Community clean-ups</li>
            <li>Youth programs</li>
            <li>Skills training workshops</li>
          </ul>
        `,
        tags: ["events", "ibadan", "volunteer"],
        readTime: "5 min read",
      },
    ],
  },
  {
    id: "account",
    title: "Account & Settings",
    icon: Shield,
    color: "text-blue-600",
    bg: "bg-blue-100 dark:bg-blue-950/30",
    articles: [
      {
        id: "account-security",
        title: "Account security and privacy",
        content:
          "How to secure your account with strong passwords and privacy settings.",
        fullContent: `
          <h3>Securing Your Account</h3>
          
          <h4>Password Best Practices:</h4>
          <ul>
            <li>Use at least 12 characters</li>
            <li>Mix uppercase, lowercase, numbers, and symbols</li>
            <li>Don't reuse passwords</li>
            <li>Change password regularly</li>
          </ul>
          
          <h4>Privacy Settings:</h4>
          <ul>
            <li>Profile visibility control</li>
            <li>Donation history privacy</li>
            <li>Contact information settings</li>
          </ul>
        `,
        tags: ["security", "privacy", "password"],
        readTime: "6 min read",
      },
      {
        id: "profile-settings",
        title: "Updating your profile information",
        content:
          "How to edit your profile and manage your account settings.",
        fullContent: `
          <h3>Managing Your Profile</h3>
          
          <h4>Editing Profile:</h4>
          <ol>
            <li>Click your profile icon</li>
            <li>Select "Settings"</li>
            <li>Go to "Profile" section</li>
            <li>Update your information</li>
            <li>Click "Save Changes"</li>
          </ol>
        `,
        tags: ["profile", "update", "settings"],
        readTime: "3 min read",
      },
    ],
  },
];

const Help = () => {
  const { darkMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  // Filter content
  const filteredContent = useMemo(() => {
    let content = HELP_CATEGORIES;

    if (activeCategory !== "all") {
      content = content.filter((cat) => cat.id === activeCategory);
    }

    if (!searchQuery) return content;

    const query = searchQuery.toLowerCase();
    return content
      .map((cat) => ({
        ...cat,
        articles: cat.articles.filter(
          (art) =>
            art.title.toLowerCase().includes(query) ||
            art.content.toLowerCase().includes(query) ||
            art.tags.some((tag) => tag.toLowerCase().includes(query))
        ),
      }))
      .filter((cat) => cat.articles.length > 0);
  }, [searchQuery, activeCategory]);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    alert("Support request submitted! We will contact you shortly.");
    setContactForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="space-y-12 pb-20">
      {/* Hero Section */}
      <div
        className={`relative rounded-2xl overflow-hidden p-12 lg:p-16 ${
          darkMode
            ? "bg-gradient-to-br from-primary-950/30 to-dark-lighter"
            : "bg-gradient-to-br from-primary-50 to-white"
        }`}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(#059669_0.5px,transparent_0.5px)] [background-size:24px_24px]" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-16 h-16 bg-primary-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6"
          >
            <HelpCircle size={32} className="text-primary-600" />
          </motion.div>

          <h1
            className={`text-4xl lg:text-5xl font-bold mb-4 ${
              darkMode ? "text-white" : "text-dark"
            }`}
          >
            How Can We Help You?
          </h1>
          <p
            className={`text-lg mb-8 ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Find answers to common questions and get support for your account
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search for help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 outline-none transition-all ${
                darkMode
                  ? "bg-gray-800 border-gray-700 text-white focus:border-primary-500"
                  : "bg-white border-gray-200 text-dark focus:border-primary-500 shadow-lg"
              }`}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-3">
          <div className="sticky top-24 space-y-4">
            <h3
              className={`text-sm font-bold mb-4 ${
                darkMode ? "text-gray-500" : "text-gray-600"
              }`}
            >
              Categories
            </h3>

            <button
              onClick={() => setActiveCategory("all")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                activeCategory === "all"
                  ? "bg-primary-500 text-white shadow-lg shadow-primary-500/25"
                  : darkMode
                  ? "hover:bg-gray-800 text-gray-400"
                  : "hover:bg-gray-100 text-gray-600"
              }`}
            >
              <BookOpen size={18} /> All Articles
            </button>

            {HELP_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                  activeCategory === cat.id
                    ? "bg-primary-500 text-white shadow-lg shadow-primary-500/25"
                    : darkMode
                    ? "hover:bg-gray-800 text-gray-400"
                    : "hover:bg-gray-100 text-gray-600"
                }`}
              >
                <cat.icon size={18} /> {cat.title}
              </button>
            ))}

            {/* Contact Support Card */}
            <div
              className={`mt-8 p-6 rounded-2xl border ${
                darkMode
                  ? "bg-dark-lighter border-gray-800"
                  : "bg-primary-50 border-primary-100"
              }`}
            >
              <MessageSquare className="text-primary-600 mb-4" size={28} />
              <h4
                className={`text-lg font-bold mb-2 ${
                  darkMode ? "text-white" : "text-dark"
                }`}
              >
                Need More Help?
              </h4>
              <p
                className={`text-sm mb-4 ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Our support team is ready to assist you
              </p>
              <a
                href="#contact"
                className="block w-full text-center py-2.5 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition-all"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-9 space-y-8">
          {filteredContent.map((category) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-2xl border overflow-hidden ${
                darkMode
                  ? "bg-dark-lighter border-gray-800"
                  : "bg-white border-gray-200 shadow-lg"
              }`}
            >
              {/* Category Header */}
              <div
                className={`p-6 border-b ${
                  darkMode ? "border-gray-800" : "border-gray-200"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${category.bg}`}>
                    <category.icon size={24} className={category.color} />
                  </div>
                  <div>
                    <h2
                      className={`text-2xl font-bold ${
                        darkMode ? "text-white" : "text-dark"
                      }`}
                    >
                      {category.title}
                    </h2>
                    <p
                      className={`text-sm ${
                        darkMode ? "text-gray-500" : "text-gray-600"
                      }`}
                    >
                      {category.articles.length} articles
                    </p>
                  </div>
                </div>
              </div>

              {/* Articles List */}
              <div
                className={`divide-y ${
                  darkMode ? "divide-gray-800" : "divide-gray-200"
                }`}
              >
                {category.articles.map((article) => (
                  <button
                    key={article.id}
                    onClick={() => setSelectedArticle(article)}
                    className={`w-full text-left p-6 transition-colors group ${
                      darkMode ? "hover:bg-gray-800/50" : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <h3
                          className={`text-lg font-bold mb-2 group-hover:text-primary-600 transition-colors ${
                            darkMode ? "text-white" : "text-dark"
                          }`}
                        >
                          {article.title}
                        </h3>
                        <p
                          className={`text-sm mb-3 ${
                            darkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {article.content}
                        </p>
                        <div className="flex items-center gap-4">
                          <span
                            className={`text-xs font-medium px-3 py-1 rounded-full ${
                              darkMode
                                ? "bg-gray-800 text-gray-400"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {article.readTime}
                          </span>
                          <div className="flex gap-2">
                            {article.tags.slice(0, 2).map((tag) => (
                              <span
                                key={tag}
                                className="text-xs text-primary-600 font-medium"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <ArrowRight
                        size={20}
                        className="text-gray-400 group-hover:text-primary-600 transition-colors"
                      />
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          ))}

          {/* Contact Form */}
          <motion.div
            id="contact"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-8 lg:p-12 rounded-2xl border ${
              darkMode
                ? "bg-dark-lighter border-gray-800"
                : "bg-white border-gray-200 shadow-lg"
            }`}
          >
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <h2
                  className={`text-3xl font-bold mb-3 ${
                    darkMode ? "text-white" : "text-dark"
                  }`}
                >
                  Contact Support
                </h2>
                <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                  Can't find what you're looking for? Send us a message
                </p>
              </div>

              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={(e) =>
                        setContactForm({ ...contactForm, name: e.target.value })
                      }
                      className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all ${
                        darkMode
                          ? "bg-gray-800 border-gray-700 text-white focus:border-primary-500"
                          : "bg-gray-50 border-gray-200 text-dark focus:border-primary-500"
                      }`}
                    />
                  </div>
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) =>
                        setContactForm({
                          ...contactForm,
                          email: e.target.value,
                        })
                      }
                      className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all ${
                        darkMode
                          ? "bg-gray-800 border-gray-700 text-white focus:border-primary-500"
                          : "bg-gray-50 border-gray-200 text-dark focus:border-primary-500"
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    required
                    value={contactForm.subject}
                    onChange={(e) =>
                      setContactForm({
                        ...contactForm,
                        subject: e.target.value,
                      })
                    }
                    className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all ${
                      darkMode
                        ? "bg-gray-800 border-gray-700 text-white focus:border-primary-500"
                        : "bg-gray-50 border-gray-200 text-dark focus:border-primary-500"
                    }`}
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Message
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={contactForm.message}
                    onChange={(e) =>
                      setContactForm({
                        ...contactForm,
                        message: e.target.value,
                      })
                    }
                    className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all resize-none ${
                      darkMode
                        ? "bg-gray-800 border-gray-700 text-white focus:border-primary-500"
                        : "bg-gray-50 border-gray-200 text-dark focus:border-primary-500"
                    }`}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-semibold shadow-lg shadow-primary-500/25 transition-all flex items-center justify-center gap-2"
                >
                  <Send size={18} /> Send Message
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Article Modal */}
      <AnimatePresence>
        {selectedArticle && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedArticle(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
            >
              <div
                className={`relative w-full max-w-3xl my-8 rounded-2xl shadow-2xl ${
                  darkMode ? "bg-dark-lighter" : "bg-white"
                }`}
              >
                {/* Modal Header */}
                <div
                  className={`flex justify-between items-center p-6 border-b ${
                    darkMode ? "border-gray-800" : "border-gray-200"
                  }`}
                >
                  <span
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                      darkMode
                        ? "bg-primary-950/30 text-primary-400"
                        : "bg-primary-50 text-primary-600"
                    }`}
                  >
                    {selectedArticle.readTime}
                  </span>
                  <button
                    onClick={() => setSelectedArticle(null)}
                    className={`p-2 rounded-lg transition-colors ${
                      darkMode
                        ? "hover:bg-gray-800 text-gray-400"
                        : "hover:bg-gray-100 text-gray-600"
                    }`}
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="p-6 lg:p-8 max-h-[70vh] overflow-y-auto">
                  <h2
                    className={`text-2xl lg:text-3xl font-bold mb-6 ${
                      darkMode ? "text-white" : "text-dark"
                    }`}
                  >
                    {selectedArticle.title}
                  </h2>

                  <div
                    className={`prose ${
                      darkMode ? "prose-invert" : ""
                    } max-w-none prose-headings:font-bold prose-p:leading-relaxed`}
                    dangerouslySetInnerHTML={{
                      __html: selectedArticle.fullContent,
                    }}
                  />

                  {/* Tags */}
                  <div
                    className={`mt-8 pt-6 border-t ${
                      darkMode ? "border-gray-800" : "border-gray-200"
                    }`}
                  >
                    <p
                      className={`text-sm font-medium mb-3 ${
                        darkMode ? "text-gray-500" : "text-gray-600"
                      }`}
                    >
                      Related Tags
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedArticle.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                            darkMode
                              ? "bg-gray-800 text-gray-400"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Help;