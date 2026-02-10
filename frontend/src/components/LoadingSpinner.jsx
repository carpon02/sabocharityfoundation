import React from "react";
import { Loader } from "lucide-react";

/**
 * Consistent LoadingSpinner component for the frontend app
 *
 * @param {object} props
 * @param {number} props.size - Size of the spinner (default: 32)
 * @param {string} props.message - Optional loading message
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.fullScreen - Show as full screen overlay (default: false)
 * @param {string} props.variant - Spinner color variant: 'primary', 'success', 'warning', 'danger' (default: 'primary')
 */
const LoadingSpinner = ({
  size = 32,
  message,
  className = "",
  fullScreen = false,
  variant = "primary",
}) => {
  // Color variants
  const getSpinnerColor = () => {
    switch (variant) {
      case "success":
        return "text-emerald-500";
      case "warning":
        return "text-amber-500";
      case "danger":
        return "text-red-500";
      case "primary":
      default:
        return "text-purple-600";
    }
  };

  const spinnerContent = (
    <div
      className={`flex flex-col items-center justify-center ${
        fullScreen ? "min-h-screen" : "py-12"
      } ${className}`}
      role="status"
      aria-live="polite"
    >
      <Loader
        className={`animate-spin ${getSpinnerColor()}`}
        size={size}
        aria-hidden="true"
      />
      {message && (
        <p className="mt-4 text-sm font-medium text-gray-600 dark:text-gray-400">
          {message}
        </p>
      )}
      <span className="sr-only">{message || "Loading..."}</span>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 bg-white dark:bg-gray-900 flex items-center justify-center">
        {spinnerContent}
      </div>
    );
  }

  return spinnerContent;
};

export default LoadingSpinner;
