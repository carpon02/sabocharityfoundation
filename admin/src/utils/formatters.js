/**
 * Utility functions for formatting data across the admin application
 * Centralized to maintain consistency and follow DRY principles
 */

/**
 * Format a number as Nigerian Naira currency
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency string (e.g., "₦1,000,000")
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount || 0);
};

/**
 * Format a date to a readable string
 * @param {string|Date} date - The date to format
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export const formatDate = (date, options = {}) => {
  const defaultOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  };

  return new Date(date).toLocaleDateString("en-US", {
    ...defaultOptions,
    ...options,
  });
};

/**
 * Format a date with time
 * @param {string|Date} date - The date to format
 * @returns {string} Formatted date and time string
 */
export const formatDateTime = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Calculate percentage of raised amount vs target
 * @param {number} raised - Amount raised
 * @param {number} target - Target amount
 * @returns {number} Percentage (0-100), capped at 100
 */
export const calculatePercentage = (raised, target) => {
  if (!target || target === 0) return 0;
  return Math.min(Math.round((raised / target) * 100), 100);
};

/**
 * Format a number with locale-specific thousand separators
 * @param {number} num - The number to format
 * @returns {string} Formatted number string
 */
export const formatNumber = (num) => {
  return (num || 0).toLocaleString();
};

/**
 * Truncate text to a specified length with ellipsis
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

/**
 * Format file size in bytes to human-readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size (e.g., "1.5 MB")
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};
