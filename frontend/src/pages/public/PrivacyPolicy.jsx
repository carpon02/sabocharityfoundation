import React from "react";
import { Shield, Lock, Eye, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  const sections = [
    {
      icon: Shield,
      title: "Information We Collect",
      content: [
        {
          subtitle: "Personal Information",
          text: "We collect information that you provide directly to us, including:",
          items: [
            "Name, email address, phone number, and mailing address when you register or make a donation",
            "Payment information (processed securely through third-party payment processors)",
            "Profile information you choose to provide, such as your interests and preferences",
            "Communications you send to us, including messages through our contact forms",
          ],
        },
        {
          subtitle: "Automatically Collected Information",
          text: "When you visit our website, we automatically collect certain information:",
          items: [
            "IP address and browser type",
            "Device information and operating system",
            "Pages visited and time spent on pages",
            "Referring website addresses",
            "Cookies and similar tracking technologies",
          ],
        },
      ],
    },
    {
      icon: Lock,
      title: "How We Use Your Information",
      content: [
        {
          subtitle: "Service Provision",
          text: "We use your information to:",
          items: [
            "Process donations and maintain donation records",
            "Send you receipts and acknowledgments",
            "Respond to your inquiries and provide customer support",
            "Manage your account and preferences",
            "Send you important updates about campaigns you support",
          ],
        },
        {
          subtitle: "Communication",
          text: "With your consent, we may:",
          items: [
            "Send you newsletters and updates about our work",
            "Inform you about new campaigns and opportunities to get involved",
            "Share impact stories and reports",
            "Send you fundraising appeals (you can opt-out at any time)",
          ],
        },
        {
          subtitle: "Legal and Compliance",
          text: "We may use your information to:",
          items: [
            "Comply with legal obligations and regulatory requirements",
            "Prevent fraud and ensure security",
            "Enforce our terms of service",
            "Protect the rights and safety of our users and the foundation",
          ],
        },
      ],
    },
    {
      icon: Eye,
      title: "Information Sharing and Disclosure",
      content: [
        {
          subtitle: "We Do Not Sell Your Data",
          text: "Sabo Ibadan Youth Charity Foundation does not sell, rent, or trade your personal information to third parties.",
        },
        {
          subtitle: "Service Providers",
          text: "We may share information with trusted service providers who assist us in:",
          items: [
            "Payment processing (Paystack, banks)",
            "Email delivery services",
            "Website hosting and analytics",
            "Customer support services",
          ],
        },
        {
          subtitle: "Legal Requirements",
          text: "We may disclose information if required by law or in response to:",
          items: [
            "Court orders or legal processes",
            "Government requests",
            "Enforcement of our terms of service",
            "Protection of rights and safety",
          ],
        },
        {
          subtitle: "Public Information",
          text: "With your consent, we may:",
          items: [
            'Display your name (or "Anonymous" if you choose) on donor lists',
            "Share testimonials and impact stories (with your permission)",
            "Publish campaign updates and reports",
          ],
        },
      ],
    },
    {
      icon: FileText,
      title: "Data Security",
      content: [
        {
          subtitle: "Security Measures",
          text: "We implement appropriate technical and organizational measures to protect your personal information:",
          items: [
            "SSL encryption for data transmission",
            "Secure payment processing through certified providers",
            "Regular security audits and updates",
            "Access controls and authentication",
            "Secure data storage and backup systems",
          ],
        },
        {
          subtitle: "Data Retention",
          text: "We retain your information for as long as necessary to:",
          items: [
            "Fulfill the purposes outlined in this policy",
            "Comply with legal obligations",
            "Resolve disputes and enforce agreements",
            "Maintain accurate financial and donation records (as required by law)",
          ],
        },
      ],
    },
    {
      icon: CheckCircle,
      title: "Your Rights and Choices",
      content: [
        {
          subtitle: "Access and Correction",
          text: "You have the right to:",
          items: [
            "Access your personal information",
            "Correct inaccurate or incomplete information",
            "Request deletion of your information (subject to legal requirements)",
            "Export your data in a portable format",
          ],
        },
        {
          subtitle: "Communication Preferences",
          text: "You can:",
          items: [
            "Opt-out of marketing emails at any time",
            "Unsubscribe from newsletters",
            "Update your communication preferences in your account settings",
            "Contact us to change your preferences",
          ],
        },
        {
          subtitle: "Cookies",
          text: "You can control cookies through your browser settings. However, disabling cookies may affect website functionality.",
        },
      ],
    },
    {
      icon: AlertCircle,
      title: "Children's Privacy",
      content: [
        {
          text: "Our services are not directed to children under 13 years of age. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary-900 to-primary-950 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-6">
            <Shield size={20} />
            <span className="text-sm font-bold uppercase tracking-wider">Legal Document</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto">
            Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
          </p>
          <p className="text-sm text-primary-200 mt-4">
            Last Updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 mb-8 border border-gray-200 dark:border-gray-800 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Introduction
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Sabo Ibadan Youth Charity Foundation ("we," "our," or "us") is committed to protecting your privacy. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you 
              visit our website, make donations, volunteer, or interact with our services.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
              By using our services, you agree to the collection and use of information in accordance with this policy. 
              If you do not agree with our policies and practices, please do not use our services.
            </p>
          </div>

          {/* Main Sections */}
          <div className="space-y-8">
            {sections.map((section, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800 shadow-sm"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                    <section.icon className="text-primary-600 dark:text-primary-400" size={24} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {section.title}
                  </h2>
                </div>

                <div className="space-y-6">
                  {section.content.map((item, itemIndex) => (
                    <div key={itemIndex} className="space-y-3">
                      {item.subtitle && (
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {item.subtitle}
                        </h3>
                      )}
                      {item.text && (
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {item.text}
                        </p>
                      )}
                      {item.items && (
                        <ul className="list-disc list-inside space-y-2 ml-4">
                          {item.items.map((listItem, listIndex) => (
                            <li
                              key={listIndex}
                              className="text-gray-700 dark:text-gray-300 leading-relaxed"
                            >
                              {listItem}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Contact Information */}
          <div className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-2xl p-8 mt-8 border border-primary-200 dark:border-primary-800">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Contact Us
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              If you have questions about this Privacy Policy or wish to exercise your rights, please contact us:
            </p>
            <div className="space-y-2 text-gray-700 dark:text-gray-300">
              <p>
                <strong>Email:</strong> privacy@saboibadanyouth.org
              </p>
              <p>
                <strong>Phone:</strong> +234 810 000 0000
              </p>
              <p>
                <strong>Address:</strong> Sabo, Ibadan, Nigeria
              </p>
            </div>
          </div>

          {/* Updates */}
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-6 mt-8 border border-amber-200 dark:border-amber-800">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-1" size={20} />
              <div>
                <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">
                  Policy Updates
                </h3>
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting 
                  the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review 
                  this Privacy Policy periodically for any changes.
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
            <Link
              to="/"
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold flex items-center gap-2"
            >
              ← Back to Home
            </Link>
            <Link
              to="/terms-of-service"
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold flex items-center gap-2"
            >
              Terms of Service →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;

