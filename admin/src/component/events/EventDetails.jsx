import React from "react";
import { MapPin, Globe } from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";

const EventDetails = ({ formData, handleChange }) => {
  const { darkMode } = useTheme();

  return (
    <div
      className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg border ${
        darkMode ? "border-gray-700" : "border-gray-200"
      } p-6 space-y-6`}
    >
      {/* Date & Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Event Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="eventDate"
            value={formData.eventDate}
            onChange={handleChange}
            required
            className={`w-full px-4 py-2 rounded-lg ${
              darkMode
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300 text-gray-900"
            } border focus:outline-none focus:ring-2 focus:ring-purple-500`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            End Date (Optional)
          </label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-lg ${
              darkMode
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300 text-gray-900"
            } border focus:outline-none focus:ring-2 focus:ring-purple-500`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Start Time <span className="text-red-500">*</span>
          </label>
          <input
            type="time"
            name="eventTime.start"
            value={formData.eventTime.start}
            onChange={handleChange}
            required
            className={`w-full px-4 py-2 rounded-lg ${
              darkMode
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300 text-gray-900"
            } border focus:outline-none focus:ring-2 focus:ring-purple-500`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            End Time (Optional)
          </label>
          <input
            type="time"
            name="eventTime.end"
            value={formData.eventTime.end}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-lg ${
              darkMode
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300 text-gray-900"
            } border focus:outline-none focus:ring-2 focus:ring-purple-500`}
          />
        </div>
      </div>

      {/* Online Event Toggle */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="isOnline"
          checked={formData.isOnline}
          onChange={handleChange}
          className="w-5 h-5 rounded border-gray-300 text-accent-600 focus:ring-purple-500"
        />
        <label className="text-sm font-medium flex items-center gap-2">
          <Globe size={18} />
          This is an online event
        </label>
      </div>

      {/* Online Details */}
      {formData.isOnline && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-500/10 rounded-lg">
          <div>
            <label className="block text-sm font-medium mb-2">Platform</label>
            <input
              type="text"
              name="onlineDetails.platform"
              value={formData.onlineDetails.platform}
              onChange={handleChange}
              placeholder="e.g., Zoom, Google Meet"
              className={`w-full px-4 py-2 rounded-lg ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              } border focus:outline-none focus:ring-2 focus:ring-purple-500`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Meeting Link
            </label>
            <input
              type="url"
              name="onlineDetails.meetingLink"
              value={formData.onlineDetails.meetingLink}
              onChange={handleChange}
              placeholder="https://..."
              className={`w-full px-4 py-2 rounded-lg ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              } border focus:outline-none focus:ring-2 focus:ring-purple-500`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Meeting ID</label>
            <input
              type="text"
              name="onlineDetails.meetingId"
              value={formData.onlineDetails.meetingId}
              onChange={handleChange}
              placeholder="Enter meeting ID"
              className={`w-full px-4 py-2 rounded-lg ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              } border focus:outline-none focus:ring-2 focus:ring-purple-500`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Passcode</label>
            <input
              type="text"
              name="onlineDetails.passcode"
              value={formData.onlineDetails.passcode}
              onChange={handleChange}
              placeholder="Enter passcode"
              className={`w-full px-4 py-2 rounded-lg ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              } border focus:outline-none focus:ring-2 focus:ring-purple-500`}
            />
          </div>
        </div>
      )}

      {/* Location (if not online) */}
      {!formData.isOnline && (
        <div className="space-y-4">
          <h3 className="font-medium flex items-center gap-2">
            <MapPin size={18} />
            Event Location
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">
                Venue <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="location.venue"
                value={formData.location.venue}
                onChange={handleChange}
                required={!formData.isOnline}
                placeholder="Enter venue name"
                className={`w-full px-4 py-2 rounded-lg ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } border focus:outline-none focus:ring-2 focus:ring-purple-500`}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Address</label>
              <input
                type="text"
                name="location.address"
                value={formData.location.address}
                onChange={handleChange}
                placeholder="Street address"
                className={`w-full px-4 py-2 rounded-lg ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } border focus:outline-none focus:ring-2 focus:ring-purple-500`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">City</label>
              <input
                type="text"
                name="location.city"
                value={formData.location.city}
                onChange={handleChange}
                placeholder="City"
                className={`w-full px-4 py-2 rounded-lg ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } border focus:outline-none focus:ring-2 focus:ring-purple-500`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">State</label>
              <input
                type="text"
                name="location.state"
                value={formData.location.state}
                onChange={handleChange}
                placeholder="State"
                className={`w-full px-4 py-2 rounded-lg ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } border focus:outline-none focus:ring-2 focus:ring-purple-500`}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetails;
