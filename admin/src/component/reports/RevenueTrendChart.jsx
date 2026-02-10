import { PieChart, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import { formatCurrency } from "../../utils/formatters";

const RevenueTrendChart = ({ monthlyData, isRefreshing }) => {
  const { darkMode } = useTheme();

  const dataArray = Array.isArray(monthlyData) ? monthlyData : [];
  const maxRevenue =
    dataArray.length > 0
      ? Math.max(...dataArray.map((d) => d.amount || d.revenue || 0))
      : 1;

  return (
    <div
      className={`lg:col-span-2 ${
        darkMode
          ? "bg-gray-950 border-gray-800"
          : "bg-white border-gray-100 shadow-xl"
      } border rounded-[2.5rem] p-6 lg:p-10 ${isRefreshing ? "animate-pulse" : ""}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-6">
        <div>
          <h3
            className={`text-xl font-black tracking-tight ${
              darkMode ? "text-white" : "text-gray-950"
            }`}
          >
            Donation Trends
          </h3>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mt-1">
            Giving Activity Over Time
          </p>
        </div>
        <div className="flex bg-gray-100 dark:bg-gray-900 p-1.5 rounded-xl">
          <button
            className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
              darkMode
                ? "bg-gray-800 text-white shadow-lg"
                : "bg-white text-gray-900 shadow-sm"
            }`}
          >
            Revenue
          </button>
          <button className="px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
            Donations
          </button>
        </div>
      </div>

      {dataArray.length > 0 ? (
        <div className="flex items-end justify-between h-64 gap-3 overflow-x-auto pb-2">
          {dataArray.map((data, index) => {
            const amount = data.amount || data.revenue || 0;
            const heightPercentage = (amount / maxRevenue) * 100;

            return (
              <div
                key={index}
                className="flex-1 min-w-[40px] flex flex-col items-center gap-3 group relative"
              >
                <div className="w-full flex items-end justify-center h-full relative">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${heightPercentage}%` }}
                    transition={{
                      duration: 1,
                      delay: index * 0.1,
                      ease: "circOut",
                    }}
                    className="w-full bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-2xl relative group-hover:from-emerald-500 group-hover:to-emerald-300 transition-all cursor-pointer shadow-lg group-hover:shadow-emerald-500/30"
                    style={{
                      minHeight: amount > 0 ? "8px" : "0px",
                    }}
                  >
                    <div
                      className={`absolute -top-12 left-1/2 transform -translate-x-1/2 ${
                        darkMode
                          ? "bg-gray-800 border-gray-700"
                          : "bg-white border-gray-100"
                      } border px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap z-20 shadow-xl pointer-events-none`}
                    >
                      <div
                        className={`text-xs font-black ${darkMode ? "text-white" : "text-gray-900"}`}
                      >
                        {formatCurrency(amount)}
                      </div>
                      <div className="text-[9px] font-bold uppercase tracking-widest text-gray-500 mt-0.5">
                        {data.count || 0} donations
                      </div>
                    </div>
                  </motion.div>
                </div>
                <span
                  className={`text-[9px] font-black uppercase tracking-widest ${
                    darkMode
                      ? "text-gray-500 group-hover:text-white"
                      : "text-gray-400 group-hover:text-gray-900"
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
            <TrendingUp
              size={24}
              className={`${darkMode ? "text-gray-600" : "text-gray-400"}`}
            />
          </div>
          <p
            className={`text-xs font-black uppercase tracking-widest ${
              darkMode ? "text-gray-500" : "text-gray-400"
            }`}
          >
            No giving activity detected
          </p>
        </div>
      )}
    </div>
  );
};

export default RevenueTrendChart;
