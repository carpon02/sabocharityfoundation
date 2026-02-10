/**
 * Utility functions for handling status colors, backgrounds, and badges
 * Supports multiple entity types: payments, campaigns, events, donors
 */

/**
 * Status configurations for different entity types
 */
const STATUS_CONFIGS = {
  payment: {
    pending: {
      textColor: "text-amber-500",
      bgLight: "bg-amber-100",
      bgDark: "bg-amber-900/30",
      borderLight: "border-amber-200/50",
      borderDark: "border-amber-800/50",
    },
    approved: {
      textColor: "text-emerald-500",
      bgLight: "bg-emerald-100",
      bgDark: "bg-emerald-900/30",
      borderLight: "border-emerald-200/50",
      borderDark: "border-emerald-800/50",
    },
    completed: {
      textColor: "text-emerald-500",
      bgLight: "bg-emerald-100",
      bgDark: "bg-emerald-900/30",
      borderLight: "border-emerald-200/50",
      borderDark: "border-emerald-800/50",
    },
    rejected: {
      textColor: "text-red-500",
      bgLight: "bg-red-100",
      bgDark: "bg-red-900/30",
      borderLight: "border-red-200/50",
      borderDark: "border-red-800/50",
    },
    failed: {
      textColor: "text-red-500",
      bgLight: "bg-red-100",
      bgDark: "bg-red-900/30",
      borderLight: "border-red-200/50",
      borderDark: "border-red-800/50",
    },
  },
  campaign: {
    active: {
      textColor: "text-emerald-500",
      bgLight: "bg-emerald-100",
      bgDark: "bg-emerald-900/30",
    },
    pending: {
      textColor: "text-amber-500",
      bgLight: "bg-amber-100",
      bgDark: "bg-amber-900/30",
    },
    completed: {
      textColor: "text-blue-500",
      bgLight: "bg-blue-100",
      bgDark: "bg-blue-900/30",
    },
    rejected: {
      textColor: "text-red-500",
      bgLight: "bg-red-100",
      bgDark: "bg-red-900/30",
    },
  },
  donor: {
    Success: {
      textColor: "text-emerald-500",
      bgLight: "bg-emerald-100",
      bgDark: "bg-emerald-900/30",
    },
    Waiting: {
      textColor: "text-amber-500",
      bgLight: "bg-amber-100",
      bgDark: "bg-amber-900/30",
    },
    "Due Date": {
      textColor: "text-red-500",
      bgLight: "bg-red-100",
      bgDark: "bg-red-900/30",
    },
    Disputed: {
      textColor: "text-gray-500",
      bgLight: "bg-gray-100",
      bgDark: "bg-gray-800",
    },
  },
};

/**
 * Tier color configurations for donors
 */
const TIER_COLORS = {
  Platinum: "from-indigo-500 to-purple-600",
  Gold: "from-amber-400 to-orange-500",
  Silver: "from-gray-300 to-gray-500",
  Bronze: "from-orange-400 to-red-500",
};

/**
 * Get text color class for a status
 * @param {string} status - The status value
 * @param {string} type - Entity type (payment, campaign, donor)
 * @returns {string} Tailwind text color class
 */
export const getStatusColor = (status, type = "payment") => {
  const config = STATUS_CONFIGS[type]?.[status];
  return config?.textColor || "text-gray-500";
};

/**
 * Get background color class for a status (with dark mode support)
 * @param {string} status - The status value
 * @param {boolean} darkMode - Whether dark mode is active
 * @param {string} type - Entity type (payment, campaign, donor)
 * @returns {string} Tailwind background color class
 */
export const getStatusBg = (status, darkMode = false, type = "payment") => {
  const config = STATUS_CONFIGS[type]?.[status];
  if (!config) return darkMode ? "bg-gray-800" : "bg-gray-100";
  return darkMode ? config.bgDark : config.bgLight;
};

/**
 * Get border color class for a status (with dark mode support)
 * @param {string} status - The status value
 * @param {boolean} darkMode - Whether dark mode is active
 * @param {string} type - Entity type
 * @returns {string} Tailwind border color class
 */
export const getStatusBorder = (status, darkMode = false, type = "payment") => {
  const config = STATUS_CONFIGS[type]?.[status];
  if (!config) return darkMode ? "border-gray-700" : "border-gray-200";
  return darkMode ? config.borderDark : config.borderLight;
};

/**
 * Get gradient color classes for donor tiers
 * @param {string} tier - The tier name (Platinum, Gold, Silver, Bronze)
 * @returns {string} Tailwind gradient classes
 */
export const getTierColor = (tier) => {
  return TIER_COLORS[tier] || "from-gray-400 to-gray-600";
};

/**
 * Calculate donor tier based on total donated amount
 * @param {number} amount - Total donated amount
 * @returns {string} Tier name
 */
export const calculateTier = (amount) => {
  if (!amount) return "Bronze";
  if (amount >= 1000000) return "Platinum";
  if (amount >= 500000) return "Gold";
  if (amount >= 100000) return "Silver";
  return "Bronze";
};

/**
 * Get complete status badge classes
 * @param {string} status - The status value
 * @param {boolean} darkMode - Whether dark mode is active
 * @param {string} type - Entity type
 * @returns {object} Object with textColor, bgColor, and borderColor
 */
export const getStatusClasses = (
  status,
  darkMode = false,
  type = "payment"
) => {
  return {
    textColor: getStatusColor(status, type),
    bgColor: getStatusBg(status, darkMode, type),
    borderColor: getStatusBorder(status, darkMode, type),
  };
};

/**
 * Capitalize first letter of a string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export const capitalizeStatus = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};
