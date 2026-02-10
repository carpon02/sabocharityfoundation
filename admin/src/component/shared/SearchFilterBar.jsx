import React from "react";
import { Search } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

/**
 * Reusable SearchFilterBar component
 *
 * @param {object} props
 * @param {string} props.searchValue - Current search value
 * @param {function} props.onSearchChange - Search change handler
 * @param {function} props.onSearch - Search submit handler
 * @param {string} props.searchPlaceholder - Search input placeholder
 * @param {Array} props.filters - Array of filter configurations
 * @param {React.ReactNode} props.actions - Additional action buttons
 */
const SearchFilterBar = ({
  searchValue = "",
  onSearchChange,
  onSearch,
  searchPlaceholder = "Search...",
  filters = [],
  actions,
}) => {
  const { darkMode } = useTheme();

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && onSearch) {
      onSearch();
    }
  };

  return (
    <div
      className={`${
        darkMode ? "bg-gray-950 border-gray-800" : "bg-white border-gray-200"
      } border rounded-xl p-6`}
    >
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        {onSearchChange && (
          <div className="flex-1 relative">
            <Search
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
              size={20}
            />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyPress={handleKeyPress}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none ${
                darkMode
                  ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
              }`}
            />
          </div>
        )}

        {/* Filter Dropdowns */}
        {filters.map((filter, index) => (
          <select
            key={index}
            value={filter.value}
            onChange={(e) => filter.onChange(e.target.value)}
            className={`px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none ${
              darkMode
                ? "bg-gray-800 border-gray-700 text-white"
                : "bg-white border-gray-300 text-gray-900"
            }`}
            aria-label={filter.label}
          >
            {filter.options.map((option, optIndex) => (
              <option key={optIndex} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ))}

        {/* Action Buttons */}
        {actions}
      </div>
    </div>
  );
};

export default SearchFilterBar;
