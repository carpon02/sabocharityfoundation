import React from "react";
import { Upload, X } from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";

const EventBasicInfo = ({
  formData,
  handleChange,
  handleImageChange,
  removeImage,
  imagePreviews,
}) => {
  const { darkMode } = useTheme();

  return (
    <div
      className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg border ${
        darkMode ? "border-gray-700" : "border-gray-200"
      } p-6 space-y-6`}
    >
      {/* Title */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Event Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          maxLength={150}
          placeholder="Enter event title"
          className={`w-full px-4 py-2 rounded-lg ${
            darkMode
              ? "bg-gray-700 border-gray-600 text-white"
              : "bg-white border-gray-300 text-gray-900"
          } border focus:outline-none focus:ring-2 focus:ring-purple-500`}
        />
        <p
          className={`text-xs mt-1 ${
            darkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          {formData.title.length}/150 characters
        </p>
      </div>

      {/* Short Description */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Short Description
        </label>
        <input
          type="text"
          name="shortDescription"
          value={formData.shortDescription}
          onChange={handleChange}
          maxLength={250}
          placeholder="Brief description for previews"
          className={`w-full px-4 py-2 rounded-lg ${
            darkMode
              ? "bg-gray-700 border-gray-600 text-white"
              : "bg-white border-gray-300 text-gray-900"
          } border focus:outline-none focus:ring-2 focus:ring-purple-500`}
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Full Description <span className="text-red-500">*</span>
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          maxLength={3000}
          rows={6}
          placeholder="Provide detailed information about the event"
          className={`w-full px-4 py-2 rounded-lg ${
            darkMode
              ? "bg-gray-700 border-gray-600 text-white"
              : "bg-white border-gray-300 text-gray-900"
          } border focus:outline-none focus:ring-2 focus:ring-purple-500`}
        />
        <p
          className={`text-xs mt-1 ${
            darkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          {formData.description.length}/3000 characters
        </p>
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Category <span className="text-red-500">*</span>
        </label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className={`w-full px-4 py-2 rounded-lg ${
            darkMode
              ? "bg-gray-700 border-gray-600 text-white"
              : "bg-white border-gray-300 text-gray-900"
          } border focus:outline-none focus:ring-2 focus:ring-purple-500`}
        >
          <option value="workshop">Workshop</option>
          <option value="seminar">Seminar</option>
          <option value="fundraiser">Fundraiser</option>
          <option value="community_outreach">Community Outreach</option>
          <option value="volunteer_drive">Volunteer Drive</option>
          <option value="awareness_campaign">Awareness Campaign</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Images Upload */}
      <div>
        <label className="block text-sm font-medium mb-2">Event Images</label>
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center ${
            darkMode
              ? "border-gray-600 bg-gray-700/50"
              : "border-gray-300 bg-gray-50"
          }`}
        >
          <Upload
            className={`mx-auto h-12 w-12 ${
              darkMode ? "text-gray-400" : "text-gray-400"
            }`}
          />
          <p
            className={`mt-2 text-sm ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Click to upload or drag and drop
          </p>
          <p
            className={`text-xs ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            PNG, JPG, WEBP up to 5MB (Max 5 images)
          </p>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="mt-4 inline-block px-4 py-2 bg-accent-600 text-white rounded-lg cursor-pointer hover:bg-accent-700 transition-colors"
          >
            Choose Files
          </label>
        </div>

        {/* Image Previews */}
        {imagePreviews.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-4">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative group">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={14} />
                </button>
                {index === 0 && (
                  <span className="absolute bottom-1 left-1 px-2 py-0.5 bg-accent-600 text-white text-xs rounded">
                    Primary
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Status & Featured */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-lg ${
              darkMode
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300 text-gray-900"
            } border focus:outline-none focus:ring-2 focus:ring-purple-500`}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        <div className="flex items-center">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="w-5 h-5 rounded border-gray-300 text-accent-600 focus:ring-purple-500"
            />
            <span className="text-sm font-medium">Featured Event</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default EventBasicInfo;
