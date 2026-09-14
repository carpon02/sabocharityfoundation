import React, { useState, useMemo } from "react";
import { TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import { formatCurrency } from "../../utils/formatters";

const RevenueTrendChart = ({ monthlyData = [], isRefreshing, timeRange = "1M", onTimeRangeChange }) => {
  const { darkMode } = useTheme();
  const [viewMode, setViewMode] = useState("revenue"); // "revenue" | "count"

  const filteredData = useMemo(() => {
    const raw = Array.isArray(monthlyData) ? monthlyData : [];
    if (raw.length === 0) return [];

    if (timeRange === "7D") {
      return raw.slice(-7);
    } else if (timeRange === "1M") {
      return raw.slice(-30);
    } else if (timeRange === "1Y") {
      return raw.slice(-12);
    }
    return raw;
  }, [monthlyData, timeRange]);

  const maxVal = useMemo(() => {
    if (filteredData.length === 0) return 1;
    return Math.max(
      ...filteredData.map((d) => (viewMode === "revenue" ? d.amount || d.revenue || 0 : d.count || 0)),
      1
    );
  }, [filteredData, viewMode]);

  return (
    <div
      className={`${
        darkMode ? "bg-dark-lighter border-gray-800/70" : "bg-white border-gray-200/80 shadow-sm"
      } border rounded-xl p-5 ${isRefreshing ? "animate-pulse" : ""}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h3 className={`text-sm font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
            Donation Trends
          </h3>
          <p className={`text-xs mt-0.5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            Giving activity over time
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2">
          <div className={`flex p-1 rounded-lg ${darkMode ? "bg-gray-800/50" : "bg-gray-100/50"}`}>
            <button
              onClick={() => setViewMode("revenue")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                viewMode === "revenue"
                  ? darkMode
                    ? "bg-gray-700 text-white shadow-sm"
                    : "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Revenue
            </button>
            <button
              onClick={() => setViewMode("count")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                viewMode === "count"
                  ? darkMode
                    ? "bg-gray-700 text-white shadow-sm"
                    : "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Count
            </button>
          </div>
        </div>
      </div>

      {filteredData.length > 0 ? (
        <div className="flex items-end justify-between h-56 gap-2 sm:gap-3 overflow-x-auto pb-2">
          {filteredData.map((data, index) => {
            const val = viewMode === "revenue" ? data.amount || data.revenue || 0 : data.count || 0;
            const heightPercentage = (val / maxVal) * 100;

            return (
              <div key={index} className="flex-1 min-w-[36px] flex flex-col items-center gap-2 group relative">
                <div className="w-full flex items-end justify-center h-full relative">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(heightPercentage, 4)}%` }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.03,
                      ease: "circOut",
                    }}
                    className={`w-full rounded-t-sm transition-all cursor-pointer relative ${
                      darkMode ? "bg-primary-900/60 hover:bg-primary-800/80" : "bg-primary-100 hover:bg-primary-200"
                    }`}
                  >
                    {/* Tooltip */}
                    <div
                      className={`absolute -top-12 left-1/2 transform -translate-x-1/2 ${
                        darkMode ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-900"
                      } border px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap z-30 shadow-lg pointer-events-none text-center`}
                    >
                      <div className="text-xs font-semibold">
                        {viewMode === "revenue" ? formatCurrency(val) : `${val} donations`}
                      </div>
                      <div className="text-[10px] text-gray-500 mt-0.5">
                        {data.month || "Period"}
                      </div>
                    </div>
                  </motion.div>
                </div>
                <span
                  className={`text-[10px] ${
                    darkMode ? "text-gray-500 group-hover:text-gray-300" : "text-gray-400 group-hover:text-gray-600"
                  } transition-colors whitespace-nowrap`}
                >
                  {data.month}
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className={`text-center py-16 flex flex-col items-center justify-center border border-dashed rounded-xl ${darkMode ? "border-gray-800" : "border-gray-200"}`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${darkMode ? "bg-gray-800/50" : "bg-gray-50"}`}>
            <TrendingUp size={16} className={darkMode ? "text-gray-500" : "text-gray-400"} />
          </div>
          <p className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-500"}`}>
            No giving activity detected
          </p>
        </div>
      )}
    </div>
  );
};

export default RevenueTrendChart;
