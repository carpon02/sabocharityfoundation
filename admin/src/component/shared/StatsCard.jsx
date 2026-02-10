import React from "react";
import { useTheme } from "../../context/ThemeContext";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { motion } from "framer-motion";

/**
 * Amazing Modern StatsCard Component with Motion
 *
 * @param {object} props
 * @param {string} props.label - Card label/title
 * @param {string|number} props.value - Value to display
 * @param {React.Component} props.icon - Lucide icon component
 * @param {string} props.bgColor - Tailwind gradient classes
 * @param {string} props.variant - 'default' | 'compact' | 'detailed' | 'minimal'
 * @param {string} props.trend - 'up' | 'down' | 'neutral'
 * @param {string} props.trendValue - Percentage change (e.g., '+12.5%')
 * @param {string} props.subtitle - Additional context text
 * @param {boolean} props.loading - Show loading skeleton
 * @param {function} props.onClick - Optional click handler
 * @param {boolean} props.hoverable - Enable hover effects (default: true)
 * @param {boolean} props.showGradientBg - Show full gradient background (default: false)
 */
const StatsCard = ({
  label,
  value,
  icon: Icon,
  bgColor = "from-purple-500 to-purple-600",
  variant = "default",
  trend,
  trendValue,
  subtitle,
  loading = false,
  onClick,
  hoverable = true,
  showGradientBg = false,
}) => {
  const { darkMode } = useTheme();

  // Trend icon and color
  const getTrendIcon = () => {
    if (trend === "up")
      return <TrendingUp size={16} className="text-emerald-300" />;
    if (trend === "down")
      return <TrendingDown size={16} className="text-red-300" />;
    if (trend === "neutral")
      return <Minus size={16} className="text-gray-300" />;
    return null;
  };

  const getTrendColor = () => {
    if (trend === "up")
      return showGradientBg ? "text-emerald-300" : "text-emerald-500";
    if (trend === "down")
      return showGradientBg ? "text-red-300" : "text-red-500";
    return showGradientBg ? "text-gray-300" : "text-gray-400";
  };

  // Loading skeleton
  if (loading) {
    return (
      <div
        className={`${
          darkMode
            ? "bg-gray-950 border-gray-800 shadow-2xl"
            : "bg-white border-gray-200"
        } border rounded-2xl p-6 min-h-[150px] animate-pulse`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-gray-300 dark:bg-gray-800" />
        </div>
        <div className="h-4 bg-gray-300 dark:bg-gray-800 rounded w-2/3 mb-2" />
        <div className="h-8 bg-gray-300 dark:bg-gray-800 rounded w-1/2" />
      </div>
    );
  }

  // Variant styles
  const variantStyles = {
    default: "min-h-[150px] p-6",
    compact: "min-h-[120px] p-4",
    detailed: "min-h-[180px] p-6",
    minimal: "min-h-[100px] p-4",
  };

  // Background styles - either gradient or solid with border
  const backgroundStyles = showGradientBg
    ? `bg-gradient-to-br ${bgColor} border-0 shadow-lg`
    : darkMode
    ? "bg-gray-950/80 border-gray-800/50 border backdrop-blur-md"
    : "bg-white/80 border-gray-100 border backdrop-blur-md shadow-xl shadow-gray-200/40";

  // Text colors for gradient background
  const textColor = showGradientBg
    ? "text-white"
    : darkMode
    ? "text-white"
    : "text-gray-900";
  const labelColor = showGradientBg
    ? "text-white/90"
    : darkMode
    ? "text-gray-400"
    : "text-gray-600";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={hoverable ? { y: -5, scale: 1.02 } : {}}
      transition={{ duration: 0.3 }}
      className={`${backgroundStyles} rounded-2xl ${
        variantStyles[variant]
      } transition-all duration-300 flex flex-col justify-between group relative overflow-hidden ${
        onClick ? "cursor-pointer" : ""
      }`}
      onClick={onClick}
    >
      {/* Animated background reflection */}
      {showGradientBg && (
        <motion.div
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
        />
      )}

      {/* Decorative Glow for non-gradient cards */}
      {!showGradientBg && (
        <div
          className={`absolute -right-10 -top-10 w-32 h-32 blur-3xl rounded-full opacity-10 bg-gradient-to-br ${bgColor}`}
        ></div>
      )}

      {/* Icon with gradient background or glass background */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div
          className={`w-12 h-12 rounded-xl ${
            showGradientBg
              ? "bg-white/20 backdrop-blur-sm border border-white/20"
              : `bg-gradient-to-br ${bgColor} shadow-lg`
          } flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:rotate-6`}
        >
          <Icon className="text-white" size={variant === "compact" ? 20 : 24} />
        </div>

        {/* Trend indicator */}
        {trend && trendValue && (
          <div
            className={`flex items-center gap-1 ${getTrendColor()} font-black text-xs px-2 py-1 rounded-full ${
              showGradientBg
                ? "bg-black/10"
                : darkMode
                ? "bg-gray-900"
                : "bg-gray-50"
            }`}
          >
            {getTrendIcon()}
            <span>{trendValue}</span>
          </div>
        )}
      </div>

      {/* Label & Value Wrapper */}
      <div className="relative z-10 mt-auto">
        <h3
          className={`text-xs font-black uppercase tracking-widest ${labelColor} mb-1 opacity-80`}
        >
          {label}
        </h3>
        <p
          className={`${
            variant === "compact" ? "text-2xl" : "text-3xl"
          } font-black ${textColor} tracking-tighter`}
        >
          {value}
        </p>
      </div>

      {/* Subtitle */}
      {subtitle && (
        <p
          className={`text-[10px] font-bold uppercase tracking-tight mt-1 ${
            showGradientBg ? "text-white/70" : "text-gray-500"
          } relative z-10`}
        >
          {subtitle}
        </p>
      )}

      {/* Bottom accent line */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-1 ${
          showGradientBg ? "bg-white/30" : `bg-gradient-to-r ${bgColor}`
        } transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}
      />
    </motion.div>
  );
};

export default StatsCard;
