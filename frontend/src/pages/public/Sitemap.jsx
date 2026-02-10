import React from "react";
import { Map, Home, Users, Heart, FileText, Mail, Globe, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const Sitemap = () => {
  const siteStructure = [
    {
      title: "Main Pages",
      icon: Home,
      links: [
        { name: "Home", path: "/", description: "Welcome to Sabo Ibadan Youth Charity Foundation" },
        { name: "About Us", path: "/about", description: "Learn about our mission and impact" },
        { name: "Campaigns", path: "/campaigns", description: "Browse active fundraising campaigns" },
        { name: "Blogs", path: "/blogs", description: "Read our latest news and stories" },
      ],
    },
    {
      title: "Get Involved",
      icon: Users,
      links: [
        { name: "Get Involved", path: "/get-involved", description: "Volunteer, become an ambassador, or partner with us" },
        { name: "Make a Donation", path: "/make-donation", description: "Support our cause with a donation" },
        { name: "Contact Us", path: "/contact", description: "Get in touch with our team" },
      ],
    },
    {
      title: "Media & Resources",
      icon: FileText,
      links: [
        { name: "Media", path: "/media", description: "Photos, videos, and press releases" },
        { name: "FAQ", path: "/faq", description: "Frequently asked questions" },
      ],
    },
    {
      title: "Legal & Policies",
      icon: Globe,
      links: [
        { name: "Privacy Policy", path: "/privacy-policy", description: "How we protect your privacy" },
        { name: "Terms of Service", path: "/terms-of-service", description: "Terms and conditions of use" },
        { name: "Sitemap", path: "/sitemap", description: "Complete site navigation" },
      ],
    },
    {
      title: "User Account",
      icon: Heart,
      links: [
        { name: "Login", path: "/login", description: "Sign in to your account" },
        { name: "Dashboard", path: "/user/dashboard", description: "User dashboard (requires login)", protected: true },
        { name: "My Campaigns", path: "/user/my-campaigns", description: "Manage your campaigns", protected: true },
        { name: "My Donations", path: "/user/my-donations", description: "View your donation history", protected: true },
        { name: "Events", path: "/user/events", description: "Browse and register for events", protected: true },
        { name: "Settings", path: "/user/settings", description: "Account settings and preferences", protected: true },
        { name: "Help Center", path: "/user/help", description: "Get help and support", protected: true },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary-900 to-primary-950 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-6">
            <Map size={20} />
            <span className="text-sm font-bold uppercase tracking-wider">Site Navigation</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">
            Sitemap
          </h1>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto">
            Find all pages and resources on our website. Navigate easily to any section.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {siteStructure.map((section, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                    <section.icon className="text-primary-600 dark:text-primary-400" size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {section.title}
                  </h2>
                </div>

                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link
                        to={link.path}
                        className="group flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                      >
                        <ChevronRight
                          size={16}
                          className="text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 mt-0.5 flex-shrink-0 transition-colors"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                              {link.name}
                            </span>
                            {link.protected && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 font-medium">
                                Login Required
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                            {link.description}
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Quick Links */}
          <div className="mt-12 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-2xl p-8 border border-primary-200 dark:border-primary-800">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Quick Links
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                to="/campaigns"
                className="flex items-center gap-3 p-4 bg-white dark:bg-gray-900 rounded-xl hover:shadow-lg transition-all border border-gray-200 dark:border-gray-800"
              >
                <Heart className="text-primary-600 dark:text-primary-400" size={20} />
                <span className="font-semibold text-gray-900 dark:text-white">Active Campaigns</span>
              </Link>
              <Link
                to="/get-involved"
                className="flex items-center gap-3 p-4 bg-white dark:bg-gray-900 rounded-xl hover:shadow-lg transition-all border border-gray-200 dark:border-gray-800"
              >
                <Users className="text-primary-600 dark:text-primary-400" size={20} />
                <span className="font-semibold text-gray-900 dark:text-white">Get Involved</span>
              </Link>
              <Link
                to="/contact"
                className="flex items-center gap-3 p-4 bg-white dark:bg-gray-900 rounded-xl hover:shadow-lg transition-all border border-gray-200 dark:border-gray-800"
              >
                <Mail className="text-primary-600 dark:text-primary-400" size={20} />
                <span className="font-semibold text-gray-900 dark:text-white">Contact Us</span>
              </Link>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
            <Link
              to="/"
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold flex items-center gap-2"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Sitemap;


