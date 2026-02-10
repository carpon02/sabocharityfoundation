import React, { useState } from "react";
import QuickAmountButton from "./QuickAmountButton";

const DonationForm = ({
  intent,
  setIntent,
  setShowPopup,
  setPopupStep,
  // submitted,
  setSubmitted,
  // assets,
}) => {
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agreed) return;
    setShowPopup(true);
    setPopupStep("bank");
    setSubmitted(false);
  };

  return (
    <section className="max-w-7xl mx-auto py-12">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Show Some Love ❤️</h2>
          <p className="text-gray-600">
            Your donation supports education, healthcare, and empowerment for youths at
            Sabo Ibadan Youth Charity Foundation. Choose an amount that works best for you.
          </p>

          <div className="flex gap-3 flex-wrap">
            {[1000, 5000, 10000, 20000].map((amt) => (
              <QuickAmountButton key={amt} amount={amt} onSelect={setIntent} />
            ))}
          </div>
        </div>

        {/* Donation Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-100 rounded-lg shadow-lg p-6 sm:p-8 space-y-6 hover:shadow-xl transition"
        >
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Donation Amount (₦)
            </label>
            <input
              type="number"
              value={intent}
              onChange={(e) => setIntent(e.target.value)}
              placeholder="Enter amount"
              min="100"
              className="border border-gray-200 shadow-sm p-3 rounded-md w-full text-sm focus:ring-2 focus:ring-green-400 outline-none"
              required
            />
          </div>

          <div className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 border border-gray-300 shadow-sm rounded-md"
            />
            <span className="text-gray-600">
              I agree with Terms of Use and Privacy Policy
            </span>
          </div>

          <button
            type="submit"
            className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 hover:scale-105 transition text-sm font-semibold w-full sm:w-auto"
          >
            Donate Now
          </button>
        </form>
      </div>
    </section>
  );
};

export default DonationForm;
