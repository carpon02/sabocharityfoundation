import React from "react";
import { Users } from "lucide-react";
import { formatCurrency } from "../../utils/formatters";
import { useTheme } from "../../context/ThemeContext";

const TopDonorsTable = ({ donors, isRefreshing }) => {
  const { darkMode } = useTheme();

  return (
    <div
      className={`${
        darkMode ? "bg-dark-lighter border-gray-800/70" : "bg-white border-gray-200/80 shadow-sm"
      } border rounded-xl p-5 ${isRefreshing ? "animate-pulse" : ""}`}
    >
      <div className="mb-5">
        <h3 className={`text-sm font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
          Top Donors
        </h3>
      </div>
      {donors.length > 0 ? (
        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {donors.map((donor, index) => (
            <div key={index} className={`flex items-center gap-3 p-2.5 rounded-lg border transition-colors ${darkMode ? "bg-gray-800/40 border-gray-800 hover:bg-gray-800/70" : "bg-gray-50 border-gray-100 hover:bg-gray-100"}`}>
              <div
                className={`w-6 h-6 rounded flex items-center justify-center font-bold text-[10px] ${
                  index === 0
                    ? "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-500"
                    : index === 1
                      ? "bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                      : index === 2
                        ? "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-500"
                        : darkMode
                          ? "bg-gray-800 text-gray-500"
                          : "bg-gray-100 text-gray-400"
                }`}
              >
                {index + 1}
              </div>
              <img
                src={
                  donor.avatar ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    donor.fullName || donor.name || "U"
                  )}&background=10b981&color=fff`
                }
                alt={donor.fullName || donor.name}
                className="w-8 h-8 rounded-lg flex-shrink-0 object-cover"
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
                  className={`text-[11px] ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {donor.donationCount} donations
                </p>
              </div>
              <div
                className={`font-semibold text-sm ${
                  darkMode ? "text-emerald-400" : "text-emerald-600"
                }`}
              >
                {formatCurrency(donor.totalDonated)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={`text-center py-16 flex flex-col items-center justify-center border border-dashed rounded-xl ${darkMode ? "border-gray-800" : "border-gray-200"}`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${darkMode ? "bg-gray-800/50" : "bg-gray-50"}`}>
            <Users size={16} className={darkMode ? "text-gray-500" : "text-gray-400"} />
          </div>
          <p className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-500"}`}>
            No donor data available
          </p>
        </div>
      )}
    </div>
  );
};

export default TopDonorsTable;
