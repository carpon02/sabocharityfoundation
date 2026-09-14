// admin/src/component/shared/StatsCard.jsx — Clerk-Style
import React from "react";
import { useTheme } from "../../context/ThemeContext";
import { TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";

/**
 * Clerk-style StatsCard — clean, minimal, no heavy gradients or animations.
 *
 * Props:
 *  label      string   — card title
 *  value      string   — primary metric
 *  subtitle   string   — secondary text below value
 *  icon       Component — lucide icon
 *  bgColor    string   — gradient used for the icon bg (e.g. "from-primary-600 to-primary-700")
 *  trend      string   — "+12%" or "-3%" (optional)
 *  trendUp    boolean  — true = green, false = red
 *  index      number   — stagger delay
 *  loading    boolean  — skeleton mode
 *  onClick    function — optional click handler
 */
const StatsCard = ({
  label,
  value,
  subtitle,
  icon: Icon,
  bgColor = "from-primary-600 to-primary-700",
  trend,
  trendUp,
  index = 0,
  loading = false,
  onClick,
}) => {
  const { darkMode } = useTheme();

  if (loading) {
    return (
      <div className={`rounded-xl border p-4 animate-pulse ${darkMode ? "bg-dark-lighter border-gray-800/70" : "bg-white border-gray-200/80"}`}>
        <div className="flex items-center justify-between mb-4">
          <div className={`w-9 h-9 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-100"}`} />
          <div className={`w-12 h-4 rounded ${darkMode ? "bg-gray-700" : "bg-gray-100"}`} />
        </div>
        <div className={`h-6 w-2/3 rounded mb-2 ${darkMode ? "bg-gray-700" : "bg-gray-100"}`} />
        <div className={`h-3 w-1/2 rounded ${darkMode ? "bg-gray-800" : "bg-gray-50"}`} />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.25 }}
      onClick={onClick}
      className={`rounded-xl border p-4 flex flex-col gap-3 transition-all ${
        onClick ? "cursor-pointer" : ""
      } ${
        darkMode
          ? "bg-dark-lighter border-gray-800/70 hover:border-gray-700"
          : "bg-white border-gray-200/80 shadow-sm hover:border-gray-300"
      }`}
    >
      {/* Top row: icon + trend */}
      <div className="flex items-start justify-between">
        <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${bgColor} flex items-center justify-center flex-shrink-0`}>
          {Icon && <Icon size={17} className="text-white" />}
        </div>
        {trend && (
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
              trendUp
                ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400"
                : "bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400"
            }`}
          >
            {trendUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            {trend}
          </span>
        )}
      </div>

      {/* Value + label */}
      <div>
        <p className={`text-xl font-bold leading-none mb-1 ${darkMode ? "text-white" : "text-gray-900"}`}>
          {value}
        </p>
        <p className={`text-xs font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
          {label}
        </p>
        {subtitle && (
          <p className={`text-[11px] mt-0.5 ${darkMode ? "text-gray-600" : "text-gray-400"}`}>
            {subtitle}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default StatsCard;
