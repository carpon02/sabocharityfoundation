// What We Are About Component with consistent colors

import React from "react";
const WhatWeAreAbout = () => {
  // Removed hoveredIndex as it is unused

  const aboutSections = [
    {
      icon: (
        <svg
          className="w-7 h-7"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
      title: "Why We Do It",
      description:
        "We strive to make a positive impact in our community by empowering individuals and supporting initiatives that create meaningful change.",
      gradient: "from-emerald-500 to-emerald-600",
    },
    {
      icon: (
        <svg
          className="w-7 h-7"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      title: "Our Mission",
      description:
        "To provide resources, guidance, and opportunities that help communities grow, thrive, and achieve sustainable development.",
      gradient: "from-amber-500 to-orange-500",
    },
    {
      icon: (
        <svg
          className="w-7 h-7"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
      ),
      title: "Our Vision",
      description:
        "A world where every individual has access to tools and support to reach their full potential.",
      gradient: "from-emerald-600 to-teal-600",
    },
    {
      icon: (
        <svg
          className="w-7 h-7"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      title: "History",
      description:
        "Founded in 2015, our organization has worked tirelessly on numerous projects to uplift and support underserved communities.",
      gradient: "from-amber-600 to-yellow-600",
    },
  ];

  return (
    <div className="w-full bg-white py-20 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="text-center relative mb-16 max-w-3xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          What We Are <span className="text-emerald-600">About</span>
        </h2>
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-16 h-1 bg-gradient-to-r from-emerald-500 to-amber-500 rounded-full"></div>
          <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
          <div className="w-16 h-1 bg-gradient-to-l from-amber-500 to-emerald-500 rounded-full"></div>
        </div>
        <p className="text-lg text-gray-600 leading-relaxed">
          Discover our mission, vision, history, and the driving force behind
          our commitment to community empowerment
        </p>
      </div>

      {/* About Sections */}
      <div className="relative max-w-7xl mx-auto">
        {/* Background blur effect */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-100 rounded-full opacity-20 blur-3xl"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {aboutSections.map((section, index) => (
            <div key={index} className="group relative">
              <div className="relative bg-white rounded-3xl p-8 h-full shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-gray-100 hover:border-emerald-200 overflow-hidden">
                {/* Background gradient on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${section.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                ></div>

                {/* Icon */}
                <div className="relative mb-6">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${section.gradient} flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}
                  >
                    {section.icon}
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-emerald-600 transition-colors">
                  {section.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {section.description}
                </p>

                {/* Decorative corner */}
                <div className="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br from-emerald-100 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhatWeAreAbout;
