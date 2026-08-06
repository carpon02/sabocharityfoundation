import React from "react";
import { Loader } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

/**
 * Consistent LoadingSpinner component for the entire admin app
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
  const { darkMode } = useTheme();

  // Color variants
  const getSpinnerColor = () => {
    switch (variant) {
      case "success":
        return darkMode ? "text-emerald-500" : "text-emerald-600";
      case "warning":
        return darkMode ? "text-amber-500" : "text-amber-600";
      case "danger":
        return darkMode ? "text-red-500" : "text-red-600";
      case "primary":
      default:
        return darkMode ? "text-purple-500" : "text-purple-600";
    }
  };

  // Map string sizes to pixels for Lucide icons
  let resolvedSize = size;
  if (size === "small") resolvedSize = 16;
  else if (size === "medium") resolvedSize = 24;
  else if (size === "large") resolvedSize = 32;
  else if (size === "xlarge") resolvedSize = 48;

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
        size={resolvedSize}
        aria-hidden="true"
      />
      {message && (
        <p
          className={`mt-4 text-sm font-medium ${
            darkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {message}
        </p>
      )}
      <span className="sr-only">{message || "Loading..."}</span>
    </div>
  );

  if (fullScreen) {
    return (
      <div
        className={`fixed inset-0 z-50 ${
          darkMode ? "bg-gray-900" : "bg-gray-50"
        } flex items-center justify-center`}
      >
        {spinnerContent}
      </div>
    );
  }

  return spinnerContent;
};

export default LoadingSpinner;
