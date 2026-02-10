import React from "react";
import { Users } from "lucide-react";
import { formatCurrency } from "../../utils/formatters";
import { useTheme } from "../../context/ThemeContext";

const TopDonorsTable = ({ donors, isRefreshing }) => {
  const { darkMode } = useTheme();

  return (
    <div
      className={`${
        darkMode ? "bg-gray-950 border-gray-800" : "bg-white border-gray-200"
      } border rounded-xl p-4 sm:p-6 ${isRefreshing ? "animate-pulse" : ""}`}
    >
      <h3
        className={`text-lg font-bold mb-4 ${
          darkMode ? "text-white" : "text-gray-900"
        }`}
      >
        Top Donors
      </h3>
      {donors.length > 0 ? (
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {donors.map((donor, index) => (
            <div key={index} className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  index === 0
                    ? "bg-amber-500 text-white"
                    : index === 1
                      ? "bg-gray-400 text-white"
                      : index === 2
                        ? "bg-orange-600 text-white"
                        : darkMode
                          ? "bg-gray-800 text-gray-400"
                          : "bg-gray-200 text-gray-600"
                }`}
              >
                {index + 1}
              </div>
              <img
                src={
                  donor.avatar ||
                  `https://ui-avatars.com/api/?name=${
                    donor.fullName || donor.name || "U"
                  }&background=indigo&color=fff`
                }
                alt={donor.fullName || donor.name}
                className="w-10 h-10 rounded-full flex-shrink-0"
                loading="lazy"
              />
              <div className="flex-1 min-w-0">
                <p
                  className={`font-semibold text-sm truncate ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {donor.fullName || donor.name || "Anonymous Donor"}
                </p>
                <p
                  className={`text-xs ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {donor.donationCount} donations
                </p>
              </div>
              <div
                className={`font-bold text-sm ${
                  darkMode ? "text-emerald-400" : "text-emerald-600"
                }`}
              >
                {formatCurrency(donor.totalDonated)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Users
            size={48}
            className={`mx-auto mb-4 ${
              darkMode ? "text-gray-600" : "text-gray-400"
            }`}
          />
          <p
            className={`text-sm ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            No donor data available
          </p>
        </div>
      )}
    </div>
  );
};

export default TopDonorsTable;
