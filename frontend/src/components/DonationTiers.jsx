import React from "react";
import { Heart, Check, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const tiers = [
  {
    name: "Kind Supporter",
    amount: "2500",
    desc: "Provides essential learning materials for two school children.",
    benefits: [
      "Newsletter updates",
      "Digital certificate",
      "Recognition on site",
    ],
    featured: false,
  },
  {
    name: "Impact Partner",
    amount: "10000",
    desc: "Funds a complete medical checkup for a rural family of five.",
    benefits: [
      "Quarterly impact reports",
      "Invitation to annual gala",
      "Priority volunteer slots",
    ],
    featured: true,
  },
  {
    name: "Visionary Patron",
    amount: "50000",
    desc: "Empowers a youth entrepreneur with a full vocational scholarship.",
    benefits: [
      "One-on-one impact tour",
      "Plaque of appreciation",
      "Naming rights to project",
    ],
    featured: false,
  },
];

const DonationTiers = () => {
  const navigate = useNavigate();

  const handleSelect = (amt) => {
    navigate(`/make-donation?amount=${amt}`);
  };

  return (
    <section className="py-24 bg-primary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-secondary-600 font-bold uppercase tracking-widest text-sm">
            Empowerment Tiers
          </h2>
          <h3 className="text-4xl md:text-5xl font-extrabold tracking-tight text-dark">
            Choose Your Level of{" "}
            <span className="text-primary-700">Impact</span>
          </h3>
          <p className="text-lg text-gray-600">
            Every contribution directly funds our fieldwork. Select a tier that
            resonates with your vision for a better future.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier, idx) => (
            <div
              key={idx}
              className={`relative flex flex-col p-10 rounded-[40px] transition-all duration-500 ${
                tier.featured
                  ? "bg-dark text-white scale-105 shadow-[0_40px_80px_-15px_rgba(4,120,87,0.3)] z-10"
                  : "bg-white text-dark hover:shadow-2xl"
              }`}
            >
              {tier.featured && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-secondary-500 text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-lg flex items-center gap-2">
                  <Star className="w-4 h-4 fill-white" />
                  Most Impactful
                </div>
              )}

              <div className="mb-8">
                <h4
                  className={`text-xl font-bold ${
                    tier.featured ? "text-secondary-400" : "text-primary-700"
                  }`}
                >
                  {tier.name}
                </h4>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-4xl font-black">
                    ₦{parseInt(tier.amount).toLocaleString()}
                  </span>
                  <span
                    className={`${
                      tier.featured ? "text-gray-400" : "text-gray-500"
                    } text-sm font-medium`}
                  >
                    / month
                  </span>
                </div>
              </div>

              <p
                className={`mb-10 text-sm leading-relaxed ${
                  tier.featured ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {tier.desc}
              </p>

              <div className="space-y-4 mb-10 flex-grow">
                {tier.benefits.map((benefit, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        tier.featured ? "bg-primary-500" : "bg-primary-100"
                      }`}
                    >
                      <Check
                        className={`w-3 h-3 ${
                          tier.featured ? "text-white" : "text-primary-700"
                        }`}
                        strokeWidth={4}
                      />
                    </div>
                    {benefit}
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleSelect(tier.amount)}
                className={`w-full py-5 rounded-2xl font-black transition-all duration-300 ${
                  tier.featured
                    ? "bg-secondary-500 text-white hover:bg-secondary-600 hover:scale-105"
                    : "bg-dark text-white hover:bg-primary-800"
                }`}
              >
                Start Giving
              </button>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <button
            onClick={() => navigate("/make-donation")}
            className="text-gray-500 font-bold hover:text-primary-700 transition-colors flex items-center gap-2 mx-auto"
          >
            Looking to make a one-time donation?{" "}
            <span className="underline">Click here</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default DonationTiers;
