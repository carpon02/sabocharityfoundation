import React from "react";
import { Plus, X, Tag } from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";

const EventAdditionalInfo = ({
  formData,
  addTag,
  removeTag,
  addRequirement,
  removeRequirement,
  addBenefit,
  removeBenefit,
  newTag,
  setNewTag,
  newRequirement,
  setNewRequirement,
  newBenefit,
  setNewBenefit,
}) => {
  const { darkMode } = useTheme();

  return (
    <div
      className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg border ${
        darkMode ? "border-gray-700" : "border-gray-200"
      } p-6 space-y-6`}
    >
      {/* Tags */}
      <div>
        <label className="block text-sm font-medium mb-2">Tags</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) =>
              e.key === "Enter" && (e.preventDefault(), addTag())
            }
            placeholder="Add a tag"
            className={`flex-1 px-4 py-2 rounded-lg ${
              darkMode
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300 text-gray-900"
            } border focus:outline-none focus:ring-2 focus:ring-purple-500`}
          />
          <button
            type="button"
            onClick={addTag}
            className="px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors"
          >
            <Plus size={20} />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.tags.map((tag, index) => (
            <span
              key={index}
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                darkMode
                  ? "bg-gray-700 text-gray-300"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              <Tag size={14} />
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="hover:text-red-500 transition-colors"
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Requirements */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Event Requirements
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newRequirement}
            onChange={(e) => setNewRequirement(e.target.value)}
            onKeyPress={(e) =>
              e.key === "Enter" && (e.preventDefault(), addRequirement())
            }
            placeholder="Add a requirement"
            className={`flex-1 px-4 py-2 rounded-lg ${
              darkMode
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300 text-gray-900"
            } border focus:outline-none focus:ring-2 focus:ring-purple-500`}
          />
          <button
            type="button"
            onClick={addRequirement}
            className="px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors"
          >
            <Plus size={20} />
          </button>
        </div>
        <ul className="space-y-2">
          {formData.requirements.map((req, index) => (
            <li
              key={index}
              className={`flex items-center justify-between px-4 py-2 rounded-lg ${
                darkMode ? "bg-gray-700" : "bg-gray-50"
              }`}
            >
              <span className={darkMode ? "text-gray-300" : "text-gray-700"}>
                {req}
              </span>
              <button
                type="button"
                onClick={() => removeRequirement(index)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <X size={16} />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Benefits */}
      <div>
        <label className="block text-sm font-medium mb-2">Event Benefits</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newBenefit}
            onChange={(e) => setNewBenefit(e.target.value)}
            onKeyPress={(e) =>
              e.key === "Enter" && (e.preventDefault(), addBenefit())
            }
            placeholder="Add a benefit"
            className={`flex-1 px-4 py-2 rounded-lg ${
              darkMode
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300 text-gray-900"
            } border focus:outline-none focus:ring-2 focus:ring-purple-500`}
          />
          <button
            type="button"
            onClick={addBenefit}
            className="px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors"
          >
            <Plus size={20} />
          </button>
        </div>
        <ul className="space-y-2">
          {formData.benefits.map((benefit, index) => (
            <li
              key={index}
              className={`flex items-center justify-between px-4 py-2 rounded-lg ${
                darkMode ? "bg-gray-700" : "bg-gray-50"
              }`}
            >
              <span className={darkMode ? "text-gray-300" : "text-gray-700"}>
                {benefit}
              </span>
              <button
                type="button"
                onClick={() => removeBenefit(index)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <X size={16} />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EventAdditionalInfo;
