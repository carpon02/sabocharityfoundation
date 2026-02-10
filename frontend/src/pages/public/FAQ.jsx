import React from "react";
import FAQ from "../../components/FAQ";
import { HelpCircle, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

const FAQPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary-900 to-primary-950 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-6">
            <HelpCircle size={20} />
            <span className="text-sm font-bold uppercase tracking-wider">Support</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto">
            Find answers to common questions about our foundation, donations, volunteering, and more.
          </p>
        </div>
      </section>

      {/* FAQ Component */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <FAQ />
        </div>
      </section>

      {/* Additional Help Section */}
      <section className="py-16 px-4 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-2xl p-8 border border-primary-200 dark:border-primary-800">
            <MessageSquare className="w-12 h-12 text-primary-600 dark:text-primary-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Still Have Questions?
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl"
              >
                Contact Us
              </Link>
              <Link
                to="/user/help"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl transition-all"
              >
                Help Center
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQPage;


