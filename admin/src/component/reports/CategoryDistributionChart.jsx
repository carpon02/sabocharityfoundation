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
          ? "bg-gray-950 border-gray-800"
          : "bg-white border-gray-100 shadow-xl"
      } border rounded-[2.5rem] p-6 lg:p-8 ${isRefreshing ? "animate-pulse" : ""}`}
    >
      <div className="mb-8">
        <h3
          className={`text-lg font-black tracking-tight ${
            darkMode ? "text-white" : "text-gray-950"
          }`}
        >
          By Category
        </h3>
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mt-1">
          Impact Distribution
        </p>
      </div>

      {dataArray.length > 0 ? (
        <div className="space-y-6 max-h-[22rem] overflow-y-auto pr-2 custom-scrollbar">
          {dataArray.map((cat, index) => (
            <div key={index} className="space-y-2 group">
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div
                    className={`w-2 h-2 rounded-full bg-gradient-to-r ${cat.color} flex-shrink-0 shadow-[0_0_8px_currentColor]`}
                  ></div>
                  <span
                    className={`font-black uppercase tracking-widest truncate ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {cat.category}
                  </span>
                </div>
                <span
                  className={`font-black ml-2 flex-shrink-0 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {cat.percentage}%
                </span>
              </div>
              <div
                className={`w-full ${
                  darkMode ? "bg-gray-900" : "bg-gray-100"
                } rounded-full h-1.5 overflow-hidden`}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${cat.percentage}%` }}
                  transition={{
                    duration: 1,
                    delay: index * 0.1,
                    ease: "circOut",
                  }}
                  className={`bg-gradient-to-r ${cat.color} h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_currentColor]`}
                />
              </div>
              <div
                className={`text-[9px] font-bold uppercase tracking-widest flex justify-between ${
                  darkMode
                    ? "text-gray-600 group-hover:text-gray-400"
                    : "text-gray-400 group-hover:text-gray-600"
                } transition-colors`}
              >
                <span>{formatCurrency(cat.amount)}</span>
                <span>{cat.count} campaigns</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-900 rounded-full flex items-center justify-center mb-4">
            <PieChart
              size={24}
              className={`${darkMode ? "text-gray-600" : "text-gray-400"}`}
            />
          </div>
          <p
            className={`text-xs font-black uppercase tracking-widest ${
              darkMode ? "text-gray-500" : "text-gray-400"
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
