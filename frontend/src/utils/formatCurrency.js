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
