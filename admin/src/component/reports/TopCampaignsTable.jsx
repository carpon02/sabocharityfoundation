import React from "react";
import { Target } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { formatCurrency } from "../../utils/formatters";

const TopCampaignsTable = ({ campaigns, isRefreshing }) => {
  const { darkMode } = useTheme();

  return (
    <div
      className={`${
        darkMode ? "bg-dark-lighter border-gray-800/70" : "bg-white border-gray-200/80 shadow-sm"
      } border rounded-xl p-5 ${isRefreshing ? "animate-pulse" : ""}`}
    >
      <div className="mb-5">
        <h3 className={`text-sm font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
          Top Campaigns
        </h3>
      </div>
      {campaigns.length > 0 ? (
        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
          {campaigns.map((campaign, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg border transition-colors ${
                darkMode ? "bg-gray-800/40 border-gray-800 hover:bg-gray-800/70" : "bg-gray-50 border-gray-100 hover:bg-gray-100"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <h4
                  className={`font-semibold text-sm flex-1 min-w-0 truncate pr-2 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {campaign.title}
                </h4>
                <span
                  className={`text-[11px] flex-shrink-0 font-medium ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {campaign.donorCount} donors
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`flex-1 ${
                    darkMode ? "bg-gray-800" : "bg-gray-200"
                  } rounded-full h-1.5`}
                >
                  <div
                    className="bg-emerald-500 h-1.5 rounded-full transition-all duration-1000"
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
                  className={`text-[10px] font-semibold flex-shrink-0 ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {Math.round(
                    (campaign.raisedAmount / campaign.targetAmount) * 100,
                  )}
                  %
                </span>
              </div>
              <p
                className={`text-[11px] mt-1.5 font-medium ${
                  darkMode ? "text-emerald-400" : "text-emerald-600"
                }`}
              >
                {formatCurrency(campaign.raisedAmount)} <span className={`font-normal ${darkMode ? "text-gray-500" : "text-gray-400"}`}>raised</span>
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className={`text-center py-16 flex flex-col items-center justify-center border border-dashed rounded-xl ${darkMode ? "border-gray-800" : "border-gray-200"}`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${darkMode ? "bg-gray-800/50" : "bg-gray-50"}`}>
            <Target size={16} className={darkMode ? "text-gray-500" : "text-gray-400"} />
          </div>
          <p className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-500"}`}>
            No campaigns found
          </p>
        </div>
      )}
    </div>
  );
};

export default TopCampaignsTable;
