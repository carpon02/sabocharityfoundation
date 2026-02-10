import React from "react";

const StatCard = ({ value, text }) => {
  return (
    <div className="flex flex-col items-center text-center">
      <h3 className="text-3xl md:text-4xl font-bold text-green-600">{value}</h3>
      <p className="text-gray-600 text-sm mt-2">{text}</p>
    </div>
  );
};

export default StatCard;
