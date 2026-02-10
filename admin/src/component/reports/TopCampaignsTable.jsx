import React from "react";
import { Target } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { formatCurrency } from "../../utils/formatters";

const TopCampaignsTable = ({ campaigns, isRefreshing }) => {
  const { darkMode } = useTheme();

  return (
    <div
      className={`${
        darkMode ? "bg-gray-950 border-gray-800" : "bg-white border-gray-200"
      } border rounded-xl p-4 sm:p-6 ${isRefreshing ? "animate-pulse" : ""}`}
    >
      <h3
        className={`text-lg font-bold mb-4 ${
          darkMode ? "text-white" : "text-gray-900"
        }`}
      >
        Top Campaigns
      </h3>
      {campaigns.length > 0 ? (
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {campaigns.map((campaign, index) => (
            <div
              key={index}
              className={`p-3 sm:p-4 rounded-lg ${
                darkMode ? "bg-gray-900" : "bg-gray-50"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <h4
                  className={`font-semibold text-sm flex-1 min-w-0 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {campaign.title}
                </h4>
                <span
                  className={`text-xs ml-2 flex-shrink-0 ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {campaign.donorCount} donors
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`flex-1 ${
                    darkMode ? "bg-gray-800" : "bg-gray-200"
                  } rounded-full h-2`}
                >
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-amber-500 h-2 rounded-full transition-all duration-1000"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.round(
                          (campaign.raisedAmount / campaign.targetAmount) * 100,
                        ),
                      )}%`,
                    }}
                  />
                </div>
                <span
                  className={`text-xs font-semibold flex-shrink-0 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {Math.round(
                    (campaign.raisedAmount / campaign.targetAmount) * 100,
                  )}
                  %
                </span>
              </div>
              <p
                className={`text-xs mt-2 ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {formatCurrency(campaign.raisedAmount)} raised
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Target
            size={48}
            className={`mx-auto mb-4 ${
              darkMode ? "text-gray-600" : "text-gray-400"
            }`}
          />
          <p
            className={`text-sm ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            No campaigns found
          </p>
        </div>
      )}
    </div>
  );
};

export default TopCampaignsTable;
