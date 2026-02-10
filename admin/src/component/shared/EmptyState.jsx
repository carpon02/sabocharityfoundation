import React from "react";
import { useTheme } from "../../context/ThemeContext";

/**
 * Reusable EmptyState component for displaying when no data is available
 *
 * @param {object} props
 * @param {React.Component} props.icon - Lucide icon component
 * @param {string} props.title - Main title text
 * @param {string} props.message - Descriptive message
 * @param {React.ReactNode} props.action - Optional action button/element
 */
const EmptyState = ({ icon: Icon, title, message, action }) => {
  const { darkMode } = useTheme();

  return (
    <div
      className={`text-center py-12 ${
        darkMode ? "text-gray-400" : "text-gray-500"
      }`}
    >
      {Icon && <Icon size={48} className="mx-auto mb-4 opacity-50" />}
      <p
        className={`text-lg font-medium ${
          darkMode ? "text-gray-300" : "text-gray-900"
        }`}
      >
        {title}
      </p>
      {message && <p className="mt-2">{message}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};

export default EmptyState;
