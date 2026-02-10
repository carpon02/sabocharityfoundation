import React from "react";
import { Search, Download, Loader } from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";

const PaymentFilters = ({
  filters,
  onFilterChange,
  onSearch,
  onExport,
  loading,
}) => {
  const { darkMode } = useTheme();

  return (
    <div
      className={`${
        darkMode ? "bg-gray-950 border-gray-800" : "bg-white border-gray-200"
      } border rounded-xl p-6`}
    >
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 relative">
          <Search
            className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
            size={20}
          />
          <input
            type="search"
            placeholder="Seek by donor name, reference, or story's whisper..."
            value={filters.search || ""}
            onChange={(e) => onFilterChange("search", e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && onSearch()}
            className={`w-full pl-10 pr-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all ${
              darkMode
                ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
            }`}
            aria-label="Compassionate search for gifts and stories"
          />
        </div>

        <select
          value={filters.approvalStatus || ""}
          onChange={(e) => onFilterChange("approvalStatus", e.target.value)}
          className={`px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all ${
            darkMode
              ? "bg-gray-800 border-gray-700 text-white"
              : "bg-white border-gray-300 text-gray-900"
          }`}
          aria-label="Journey through approval stages"
        >
          <option value="">All Journeys</option>
          <option value="pending">Awaiting Embrace</option>
          <option value="approved">Embraced</option>
          <option value="rejected">Reflected</option>
        </select>

        <select
          value={filters.status || ""}
          onChange={(e) => onFilterChange("status", e.target.value)}
          className={`px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all ${
            darkMode
              ? "bg-gray-800 border-gray-700 text-white"
              : "bg-white border-gray-300 text-gray-900"
          }`}
          aria-label="Paths of payment fulfillment"
        >
          <option value="">All Paths</option>
          <option value="pending">In Motion</option>
          <option value="verified">Verified</option>
          <option value="completed">Fulfilled</option>
          <option value="failed">Paused</option>
        </select>

        <input
          type="date"
          value={filters.startDate || ""}
          onChange={(e) => onFilterChange("startDate", e.target.value)}
          className={`px-3 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all ${
            darkMode
              ? "bg-gray-800 border-gray-700 text-white"
              : "bg-white border-gray-300 text-gray-900"
          }`}
          aria-label="Beginnings of generosity (start date)"
        />
        <input
          type="date"
          value={filters.endDate || ""}
          onChange={(e) => onFilterChange("endDate", e.target.value)}
          className={`px-3 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all ${
            darkMode
              ? "bg-gray-800 border-gray-700 text-white"
              : "bg-white border-gray-300 text-gray-900"
          }`}
          aria-label="Echoes of giving (end date)"
        />

        <select
          value={filters.paymentMethod || ""}
          onChange={(e) => onFilterChange("paymentMethod", e.target.value)}
          className={`px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all ${
            darkMode
              ? "bg-gray-800 border-gray-700 text-white"
              : "bg-white border-gray-300 text-gray-900"
          }`}
          aria-label="Channels of compassion"
        >
          <option value="">All Channels</option>
          <option value="card">Card</option>
          <option value="bank_transfer">Bank Transfer</option>
          <option value="mobile_money">Mobile Money</option>
        </select>

        <button
          onClick={onExport}
          disabled={loading}
          className={`bg-gradient-to-r from-emerald-600 to-amber-600 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-50 ${
            loading ? "animate-pulse" : ""
          }`}
          aria-label="Capture records to inspire further giving"
        >
          <Download size={20} />
          {loading ? "Weaving..." : "Export Stories"}
        </button>
      </div>
    </div>
  );
};

export default PaymentFilters;
