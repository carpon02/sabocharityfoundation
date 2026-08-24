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
        darkMode ? "bg-gray-950 border-gray-800" : "bg-white border-gray-100 shadow-xl"
      } border rounded-[2.5rem] p-6 lg:p-8 ${isRefreshing ? "animate-pulse" : ""}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h3 className={`text-xl font-black tracking-tight ${darkMode ? "text-white" : "text-gray-950"}`}>
            Donation Trends
          </h3>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mt-1">
            Giving Activity Over Time
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2">
          <div className="flex bg-gray-100 dark:bg-gray-900 p-1 rounded-xl">
            <button
              onClick={() => setViewMode("revenue")}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                viewMode === "revenue"
                  ? darkMode
                    ? "bg-gray-800 text-white shadow-md"
                    : "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Revenue
            </button>
            <button
              onClick={() => setViewMode("count")}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                viewMode === "count"
                  ? darkMode
                    ? "bg-gray-800 text-white shadow-md"
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
        <div className="flex items-end justify-between h-64 gap-2 sm:gap-3 overflow-x-auto pb-2">
          {filteredData.map((data, index) => {
            const val = viewMode === "revenue" ? data.amount || data.revenue || 0 : data.count || 0;
            const heightPercentage = (val / maxVal) * 100;

            return (
              <div key={index} className="flex-1 min-w-[36px] flex flex-col items-center gap-3 group relative">
                <div className="w-full flex items-end justify-center h-full relative">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(heightPercentage, 4)}%` }}
                    transition={{
                      duration: 0.8,
                      delay: index * 0.05,
                      ease: "circOut",
                    }}
                    className="w-full bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-2xl relative group-hover:from-emerald-500 group-hover:to-emerald-300 transition-all cursor-pointer shadow-lg group-hover:shadow-emerald-500/30"
                  >
                    {/* Tooltip */}
                    <div
                      className={`absolute -top-14 left-1/2 transform -translate-x-1/2 ${
                        darkMode ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-900"
                      } border px-3 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap z-30 shadow-xl pointer-events-none text-center`}
                    >
                      <div className="text-xs font-black">
                        {viewMode === "revenue" ? formatCurrency(val) : `${val} donations`}
                      </div>
                      <div className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mt-0.5">
                        {data.month || "Period"}
                      </div>
                    </div>
                  </motion.div>
                </div>
                <span
                  className={`text-[9px] font-black uppercase tracking-widest ${
                    darkMode ? "text-gray-500 group-hover:text-white" : "text-gray-400 group-hover:text-gray-900"
                  } transition-colors`}
                >
                  {data.month}
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-900 rounded-full flex items-center justify-center mb-4">
            <TrendingUp size={24} className={darkMode ? "text-gray-600" : "text-gray-400"} />
          </div>
          <p className={`text-xs font-black uppercase tracking-widest ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
            No giving activity detected
          </p>
        </div>
      )}
    </div>
  );
};

export default RevenueTrendChart;
