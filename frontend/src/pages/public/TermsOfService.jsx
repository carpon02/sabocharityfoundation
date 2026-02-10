import React from "react";
import { FileText, Scale, AlertTriangle, CheckCircle, XCircle, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const TermsOfService = () => {
  const sections = [
    {
      icon: FileText,
      title: "Acceptance of Terms",
      content: [
        "By accessing and using the Sabo Ibadan Youth Charity Foundation website and services, you accept and agree to be bound by these Terms of Service and all applicable laws and regulations.",
        "If you do not agree with any of these terms, you are prohibited from using or accessing this site.",
        "These terms apply to all visitors, users, donors, volunteers, and others who access or use our services.",
      ],
    },
    {
      icon: Scale,
      title: "Use License",
      content: [
        "Permission is granted to temporarily access and use our website for personal, non-commercial purposes.",
        "This license does not include:",
        [
          "Modifying or copying materials from the website",
          "Using materials for commercial purposes or public display",
          "Attempting to reverse engineer any software on the website",
          "Removing copyright or proprietary notations from materials",
          "Transferring materials to another person or 'mirroring' materials on another server",
        ],
        "This license shall automatically terminate if you violate any of these restrictions.",
      ],
    },
    {
      icon: Shield,
      title: "Donations and Payments",
      content: [
        "All donations made through our platform are final and non-refundable, except as required by law.",
        "Donations are processed securely through third-party payment processors (Paystack, banks).",
        "We reserve the right to refuse or return any donation at our discretion.",
        "Donors are responsible for ensuring they have the legal right to make donations.",
        "Tax receipts will be issued for eligible donations as required by law.",
        "All donations are used in accordance with our stated mission and purposes.",
      ],
    },
    {
      icon: CheckCircle,
      title: "User Accounts",
      content: [
        "You may be required to create an account to access certain features.",
        "You are responsible for maintaining the confidentiality of your account credentials.",
        "You agree to provide accurate, current, and complete information during registration.",
        "You are responsible for all activities that occur under your account.",
        "You must notify us immediately of any unauthorized use of your account.",
        "We reserve the right to suspend or terminate accounts that violate these terms.",
      ],
    },
    {
      icon: AlertTriangle,
      title: "Prohibited Activities",
      content: [
        "You agree not to:",
        [
          "Use our services for any unlawful purpose or in violation of any laws",
          "Impersonate any person or entity or falsely state your affiliation",
          "Interfere with or disrupt the services or servers",
          "Transmit any viruses, malware, or harmful code",
          "Collect or harvest information about other users",
          "Use automated systems to access our services without permission",
          "Engage in any fraudulent, abusive, or harmful activity",
          "Violate the rights of others, including intellectual property rights",
        ],
      ],
    },
    {
      icon: FileText,
      title: "Campaign Creation and Management",
      content: [
        "Users may create campaigns subject to our approval and guidelines.",
        "Campaign creators must:",
        [
          "Provide accurate and truthful information about their campaigns",
          "Use funds solely for the stated campaign purposes",
          "Comply with all applicable laws and regulations",
          "Maintain transparency and provide updates as required",
        ],
        "We reserve the right to review, approve, reject, or remove any campaign.",
        "Campaigns must align with our mission and values.",
        "False or misleading campaign information may result in immediate removal and legal action.",
      ],
    },
    {
      icon: XCircle,
      title: "Disclaimer",
      content: [
        "The materials on our website are provided on an 'as is' basis.",
        "We make no warranties, expressed or implied, and hereby disclaim all warranties including:",
        [
          "Warranties of merchantability",
          "Fitness for a particular purpose",
          "Non-infringement of intellectual property",
          "Accuracy, reliability, or completeness of materials",
        ],
        "We do not warrant that the website will be available, secure, or error-free.",
        "We are not responsible for any damages resulting from the use or inability to use our services.",
      ],
    },
    {
      icon: AlertTriangle,
      title: "Limitations of Liability",
      content: [
        "In no event shall Sabo Ibadan Youth Charity Foundation or its suppliers be liable for any damages arising out of:",
        [
          "The use or inability to use our services",
          "Unauthorized access to or alteration of your data",
          "Statements or conduct of any third party",
          "Any other matter relating to our services",
        ],
        "This limitation applies whether the alleged liability is based on contract, tort, negligence, strict liability, or any other basis.",
        "Some jurisdictions do not allow the exclusion of certain warranties or limitations of liability, so some of the above limitations may not apply to you.",
      ],
    },
    {
      icon: FileText,
      title: "Intellectual Property",
      content: [
        "All content on our website, including text, graphics, logos, images, and software, is the property of Sabo Ibadan Youth Charity Foundation or its content suppliers.",
        "Content is protected by copyright, trademark, and other intellectual property laws.",
        "You may not reproduce, distribute, modify, or create derivative works without our written permission.",
        "You may use our content for personal, non-commercial purposes with proper attribution.",
      ],
    },
    {
      icon: Shield,
      title: "Indemnification",
      content: [
        "You agree to indemnify, defend, and hold harmless Sabo Ibadan Youth Charity Foundation, its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from:",
        [
          "Your use of our services",
          "Your violation of these Terms of Service",
          "Your violation of any rights of another",
          "Any content you submit or transmit through our services",
        ],
      ],
    },
    {
      icon: FileText,
      title: "Termination",
      content: [
        "We may terminate or suspend your access to our services immediately, without prior notice, for any reason, including breach of these Terms of Service.",
        "Upon termination, your right to use the services will cease immediately.",
        "All provisions of these Terms that by their nature should survive termination shall survive, including ownership provisions, warranty disclaimers, and limitations of liability.",
      ],
    },
    {
      icon: FileText,
      title: "Governing Law",
      content: [
        "These Terms of Service shall be governed by and construed in accordance with the laws of the Federal Republic of Nigeria.",
        "Any disputes arising from these terms or your use of our services shall be subject to the exclusive jurisdiction of the courts of Oyo State, Nigeria.",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary-900 to-primary-950 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-6">
            <Scale size={20} />
            <span className="text-sm font-bold uppercase tracking-wider">Legal Document</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">
            Terms of Service
          </h1>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto">
            Please read these terms carefully before using our services. By using our services, you agree to these terms.
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
              Welcome to Sabo Ibadan Youth Charity Foundation. These Terms of Service ("Terms") govern your access 
              to and use of our website, services, and platform. By accessing or using our services, you agree to be 
              bound by these Terms.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
              If you do not agree to these Terms, please do not use our services. We reserve the right to modify 
              these Terms at any time, and such modifications shall be effective immediately upon posting.
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

                <div className="space-y-4">
                  {section.content.map((item, itemIndex) => {
                    if (Array.isArray(item)) {
                      return (
                        <ul key={itemIndex} className="list-disc list-inside space-y-2 ml-4">
                          {item.map((listItem, listIndex) => (
                            <li
                              key={listIndex}
                              className="text-gray-700 dark:text-gray-300 leading-relaxed"
                            >
                              {listItem}
                            </li>
                          ))}
                        </ul>
                      );
                    }
                    return (
                      <p
                        key={itemIndex}
                        className="text-gray-700 dark:text-gray-300 leading-relaxed"
                      >
                        {item}
                      </p>
                    );
                  })}
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
              If you have questions about these Terms of Service, please contact us:
            </p>
            <div className="space-y-2 text-gray-700 dark:text-gray-300">
              <p>
                <strong>Email:</strong> legal@saboibadanyouth.org
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
              <AlertTriangle className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-1" size={20} />
              <div>
                <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">
                  Terms Updates
                </h3>
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  We reserve the right to update these Terms of Service at any time. We will notify users of any 
                  material changes by posting the new Terms on this page and updating the "Last Updated" date. 
                  Your continued use of our services after such changes constitutes acceptance of the new Terms.
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
            <Link
              to="/privacy-policy"
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold flex items-center gap-2"
            >
              ← Privacy Policy
            </Link>
            <Link
              to="/"
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold flex items-center gap-2"
            >
              Back to Home →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsOfService;


