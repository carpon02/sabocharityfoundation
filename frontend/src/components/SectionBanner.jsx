import React from "react";

const SectionBanner = ({ title, text, buttonText }) => {
  return (
    <section className="flex flex-col items-center justify-center w-full text-center rounded-2xl py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-10 bg-secondary-500">
      {/* Title */}
      <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-extrabold text-black leading-snug max-w-4xl">
        {title}
      </h1>

      {/* Subtitle */}
      <p className="text-sm sm:text-base md:text-lg text-black mx-auto mt-4 sm:mt-6 max-w-2xl leading-relaxed">
        {text}
      </p>

      {/* CTA Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 bg-secondary-100 px-4 sm:px-6 md:px-8 py-4 sm:py-5 mt-6 sm:mt-8 rounded-2xl sm:rounded-full shadow-md w-full max-w-4xl mx-auto">
         {/* Text */}
         <p className="text-sm sm:text-base md:text-lg font-medium text-primary-500 text-center sm:text-left leading-relaxed">
            Click here to donate now and help out the lives of people in need.
         </p>

         {/* Button */}
         <button className="w-full sm:w-auto px-6 sm:px-8 lg:px-10 py-2 sm:py-3 text-sm sm:text-base md:text-lg bg-primary-500 text-white font-semibold hover:scale-105 transition duration-300 rounded-full shadow-lg">
            {buttonText}
         </button>
      </div>

    </section>
  );
};

export default SectionBanner;
