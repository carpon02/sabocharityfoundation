import { memo } from "react";
import { calculateProgress } from "../utils/calculateProgress";
import { getDaysLeft } from "../utils/getdaysLeft";
import { getCampaignStatus } from "../utils/getCampaignstatus";
import { Link } from "react-router-dom";
import { formatCurrency } from "../utils/formatCurrency";
import StatusBadge from "./StatusBadge";

export const CampaignCard = memo(({ campaign }) => {
  const progress = calculateProgress(
    campaign.raisedAmount || campaign.raised, 
    campaign.targetAmount || campaign.target
  );
  const daysLeft = getDaysLeft(campaign.endDate);
  const status = getCampaignStatus(campaign);
  
  const imageUrl = campaign.images?.[0]?.url || 
                   campaign.image || 
                   "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&h=600&fit=crop";
  
  return (
    <Link
      to={`/campaigns/${campaign._id || campaign.id}`}
      className="block max-w- bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
    >
      <div className="relative">
        <img
          src={imageUrl}
          alt={campaign.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {campaign.featured && (
          <div className="absolute top-3 left-3 bg-amber-400 text-amber-900 px-2 py-1 rounded-full text-xs font-semibold">
            Featured
          </div>
        )}
        <div className="absolute top-3 right-3">
          <StatusBadge status={status} />
        </div>
        {daysLeft <= 7 && daysLeft > 0 && (
          <div className="absolute bottom-3 left-3 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-semibold">
            {daysLeft} days left
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 px-2 py-1 rounded-lg text-xs font-medium">
            {campaign.category}
          </span>
        </div>

        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
          {campaign.title}
        </h3>

        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
          {campaign.description}
        </p>

        <div className="space-y-3 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Raised</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {formatCurrency(campaign.raisedAmount || campaign.raised)} of {formatCurrency(campaign.targetAmount || campaign.target)}
            </span>
          </div>

          <div 
            className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2"
            role="progressbar"
            aria-valuenow={Math.round(progress)}
            aria-valuemin="0"
            aria-valuemax="100"
            aria-label={`Campaign progress: ${Math.round(progress)}%`}
          >
            <div 
              className="bg-gradient-to-r from-emerald-500 to-amber-500 h-2 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>{campaign.donorCount || campaign.donors || 0} donors</span>
            <span>{Math.round(progress)}% funded</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            <span className="truncate">{campaign.location}</span>
          </div>

          <span className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            status === 'completed' || status === 'ended'
              ? 'bg-gray-100 text-gray-500'
              : status === 'funded'
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200'
              : 'bg-emerald-600 group-hover:bg-emerald-700 text-white'
          }`}>
            {status === 'completed' ? 'Completed' : 
             status === 'ended' ? 'Ended' :
             status === 'funded' ? 'Funded' : 'Donate'}
          </span>
        </div>
      </div>
    </Link>
  );
});
