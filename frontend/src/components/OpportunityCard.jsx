import React from "react";
import { MdArrowOutward } from "react-icons/md";

const OpportunityCard = ({ title, description, image, volunteerText, actionText }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow max-w-lg flex flex-col gap-2">
      {/* Title */}
      <p className="text-gray-900 text-xl font-bold uppercase font-sans">{title}</p>

      {/* Description */}
      <p className="text-gray-500 text-sm mb-3">{description}</p>

      {/* Image */}
      <img
        className="rounded-md w-full h-52 object-cover bg-green-50"
        src={image}
        alt={title}
      />

      {/* Buttons (side by side) */}
      <div className="flex gap-3 mt-2">
        <button className="  flex items-center justify-center gap-2 px-4 py-2 bg-black text-gray-200 rounded-full text-sm sm:text-base font-medium hover:bg-green-600 transition">
          {volunteerText}
          <span className="bg-gray-800 text-lg sm:text-xl p-2 rounded-full text-white">
            <MdArrowOutward />
          </span>
        </button>
        <button className=" px-4 py-2 bg-gray-50 border border-gray-300 text-black rounded-full text-sm sm:text-base font-medium hover:bg-green-600 transition">
          {actionText}
        </button>
      </div>
    </div>
  );
};

export default OpportunityCard;
