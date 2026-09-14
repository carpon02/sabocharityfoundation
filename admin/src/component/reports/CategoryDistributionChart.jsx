import { BarChart3, PieChart } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import { formatCurrency } from "../../utils/formatters";

const CategoryDistributionChart = ({ categoryData, isRefreshing }) => {
  const { darkMode } = useTheme();

  // Ensure categoryData is an array
  const dataArray = Array.isArray(categoryData) ? categoryData : [];

  return (
    <div
      className={`${
        darkMode
          ? "bg-dark-lighter border-gray-800/70"
          : "bg-white border-gray-200/80 shadow-sm"
      } border rounded-xl p-5 ${isRefreshing ? "animate-pulse" : ""}`}
    >
      <div className="mb-6">
        <h3
          className={`text-sm font-semibold ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          By Category
        </h3>
        <p className={`text-xs mt-0.5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
          Impact distribution
        </p>
      </div>

      {dataArray.length > 0 ? (
        <div className="space-y-5 max-h-[19rem] overflow-y-auto pr-2 custom-scrollbar">
          {dataArray.map((cat, index) => (
            <div key={index} className="space-y-1.5 group">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div
                    className={`w-2 h-2 rounded-full bg-gradient-to-r ${cat.color} flex-shrink-0`}
                  ></div>
                  <span
                    className={`font-medium truncate ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {cat.category}
                  </span>
                </div>
                <span
                  className={`font-semibold ml-2 flex-shrink-0 ${
                    darkMode ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  {cat.percentage}%
                </span>
              </div>
              <div
                className={`w-full ${
                  darkMode ? "bg-gray-800" : "bg-gray-100"
                } rounded-full h-1.5 overflow-hidden`}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${cat.percentage}%` }}
                  transition={{
                    duration: 0.8,
                    delay: index * 0.05,
                    ease: "circOut",
                  }}
                  className={`bg-gradient-to-r ${cat.color} h-full rounded-full transition-all duration-700`}
                />
              </div>
              <div
                className={`text-[10px] flex justify-between ${
                  darkMode
                    ? "text-gray-500 group-hover:text-gray-400"
                    : "text-gray-500 group-hover:text-gray-700"
                } transition-colors`}
              >
                <span>{formatCurrency(cat.amount)}</span>
                <span>{cat.count} campaigns</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={`text-center py-16 flex flex-col items-center justify-center border border-dashed rounded-xl ${darkMode ? "border-gray-800" : "border-gray-200"}`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${darkMode ? "bg-gray-800/50" : "bg-gray-50"}`}>
            <PieChart
              size={16}
              className={`${darkMode ? "text-gray-500" : "text-gray-400"}`}
            />
          </div>
          <p
            className={`text-xs ${
              darkMode ? "text-gray-500" : "text-gray-500"
            }`}
          >
            No category data available
          </p>
        </div>
      )}
    </div>
  );
};

export default CategoryDistributionChart;
