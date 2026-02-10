import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

/**
 * Reusable Pagination component
 *
 * @param {object} props
 * @param {number} props.currentPage - Current page number
 * @param {number} props.totalPages - Total number of pages
 * @param {number} props.totalItems - Total number of items
 * @param {number} props.itemsPerPage - Items per page
 * @param {function} props.onPageChange - Page change handler
 * @param {boolean} props.loading - Loading state
 */
const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  loading = false,
}) => {
  const { darkMode } = useTheme();

  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <nav
      className="flex items-center justify-between mt-6"
      role="navigation"
      aria-label="Pagination"
    >
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage <= 1 || loading}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1 ${
          currentPage <= 1 || loading
            ? `${
                darkMode
                  ? "bg-gray-800 text-gray-500"
                  : "bg-gray-200 text-gray-500"
              } cursor-not-allowed`
            : darkMode
            ? "bg-gray-800 hover:bg-gray-700 text-white"
            : "bg-white hover:bg-gray-100 text-gray-900 border border-gray-300"
        } disabled:opacity-50`}
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
        Previous
      </button>

      <span
        className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
      >
        Showing {startItem} to {endItem} of {totalItems.toLocaleString()} items
        {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
      </span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages || loading}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1 ${
          currentPage >= totalPages || loading
            ? `${
                darkMode
                  ? "bg-gray-800 text-gray-500"
                  : "bg-gray-200 text-gray-500"
              } cursor-not-allowed`
            : darkMode
            ? "bg-gray-800 hover:bg-gray-700 text-white"
            : "bg-white hover:bg-gray-100 text-gray-900 border border-gray-300"
        } disabled:opacity-50`}
        aria-label="Next page"
      >
        Next
        <ChevronRight size={16} />
      </button>
    </nav>
  );
};

export default Pagination;
