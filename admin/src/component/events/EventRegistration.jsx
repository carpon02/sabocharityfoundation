import React from "react";
import { useTheme } from "../../../context/ThemeContext";

const EventRegistration = ({ formData, handleChange }) => {
  const { darkMode } = useTheme();

  return (
    <div
      className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg border ${
        darkMode ? "border-gray-700" : "border-gray-200"
      } p-6 space-y-6`}
    >
      {/* Registration Required */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="registrationRequired"
          checked={formData.registrationRequired}
          onChange={handleChange}
          className="w-5 h-5 rounded border-gray-300 text-accent-600 focus:ring-purple-500"
        />
        <label className="text-sm font-medium">
          Require registration for this event
        </label>
      </div>

      {formData.registrationRequired && (
        <div className="space-y-4">
          {/* Capacity */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Maximum Capacity
            </label>
            <input
              type="number"
              name="capacity.max"
              value={formData.capacity.max}
              onChange={handleChange}
              min="1"
              placeholder="Leave empty for unlimited"
              className={`w-full px-4 py-2 rounded-lg ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              } border focus:outline-none focus:ring-2 focus:ring-purple-500`}
            />
          </div>

          {/* Registration Deadline */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Registration Deadline
            </label>
            <input
              type="date"
              name="registrationDeadline"
              value={formData.registrationDeadline}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-lg ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              } border focus:outline-none focus:ring-2 focus:ring-purple-500`}
            />
          </div>

          {/* Registration Fee */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">
                Registration Fee
              </label>
              <input
                type="number"
                name="registrationFee.amount"
                value={formData.registrationFee.amount}
                onChange={handleChange}
                min="0"
                placeholder="0 for free event"
                className={`w-full px-4 py-2 rounded-lg ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } border focus:outline-none focus:ring-2 focus:ring-purple-500`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Currency</label>
              <select
                name="registrationFee.currency"
                value={formData.registrationFee.currency}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } border focus:outline-none focus:ring-2 focus:ring-purple-500`}
              >
                <option value="NGN">NGN</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventRegistration;
