import React from "react";

export const SectionHeader = ({
  title,
  highlight,
  subtitle,
  center = true,
  dark = false,
}) => (
  <div
    className={`${
      center ? "text-center mx-auto" : "text-left"
    } max-w-4xl space-y-6 mb-20`}
  >
    <div
      className={`flex items-center gap-3 ${
        center ? "justify-center" : "justify-start"
      }`}
    >
      <span className="w-10 h-0.5 bg-secondary-500" />
      <span className="text-secondary-600 font-bold uppercase tracking-[0.2em] text-[10px]">
        Impact Horizon
      </span>
    </div>

    <h2
      className={`text-5xl md:text-6xl font-black ${
        dark ? "text-white" : "text-dark"
      } leading-[0.9] tracking-tighter`}
    >
      {title} <br />
      {highlight && (
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-700 to-primary-500 underline decoration-primary-900/10">
          {highlight}
        </span>
      )}
    </h2>

    {subtitle && (
      <p
        className={`text-xl font-medium leading-relaxed max-w-2xl ${
          center ? "mx-auto" : ""
        } ${dark ? "text-gray-400" : "text-gray-500"}`}
      >
        {subtitle}
      </p>
    )}
  </div>
);

export default SectionHeader;
