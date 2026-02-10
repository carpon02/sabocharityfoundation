import { memo } from "react";
import { Link } from "react-router-dom";
import { 
  Heart, 
  MapPin, 
  Users, 
  Clock, 
  TrendingUp,
  Sparkles
} from "lucide-react";
import { calculateProgress } from "../utils/calculateProgress";
import { getDaysLeft } from "../utils/getDaysLeft";
import { getCampaignStatus } from "../utils/getCampaignstatus";
import { formatCurrency } from "../utils/formatCurrency";
import StatusBadge from "./StatusBadge";

/**
 * Modern, Sleek Campaign Card Component
 * Eye-catching design with smooth animations
 */
export const CampaignCardModern = memo(({ campaign }) => {
  const progress = calculateProgress(campaign.raisedAmount || campaign.raised, campaign.targetAmount || campaign.target);
  const daysLeft = getDaysLeft(campaign.endDate);
  const status = getCampaignStatus(campaign);
  const isUrgent = daysLeft <= 7 && daysLeft > 0;
  const isFeatured = campaign.featured;
  
  const imageUrl = campaign.images?.[0]?.url || 
                   campaign.image || 
                   "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&h=600&fit=crop";
  
  return (
    <Link
      to={`/campaigns/${campaign._id || campaign.id}`}
      className="group block relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100"
    >
      {/* Image Container with Overlay Effects */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={imageUrl}
          alt={campaign.title}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
          loading="lazy"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Featured Badge */}
        {isFeatured && (
          <div className="absolute top-4 left-4 z-10">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-full text-xs font-bold shadow-lg backdrop-blur-sm">
              <Sparkles className="w-3 h-3" />
              Featured
            </div>
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-4 right-4 z-10">
          <StatusBadge status={status} />
        </div>
        
        {/* Urgent Badge */}
        {isUrgent && (
          <div className="absolute bottom-4 left-4 z-10 animate-pulse">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500 text-white rounded-full text-xs font-bold shadow-lg backdrop-blur-sm">
              <Clock className="w-3 h-3" />
              {daysLeft} {daysLeft === 1 ? 'day' : 'days'} left
            </div>
          </div>
        )}
        
        {/* Progress Bar Overlay on Hover */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div 
            className="h-full bg-gradient-to-r from-emerald-400 to-amber-400 transition-all duration-1000"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 space-y-4">
        {/* Category Badge */}
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold">
            <span className="w-2 h-2 bg-emerald-500 rounded-full" />
            {campaign.category || 'General'}
          </span>
          {campaign.urgent && (
            <span className="px-2 py-1 bg-red-50 text-red-600 rounded-full text-xs font-semibold">
              Urgent
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-emerald-600 transition-colors duration-300 leading-tight">
          {campaign.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
          {campaign.shortDescription || campaign.description}
        </p>

        {/* Progress Section */}
        <div className="space-y-3 pt-2">
          {/* Amounts */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">Raised</p>
              <p className="text-lg font-bold text-emerald-600">
                {formatCurrency(campaign.raisedAmount || campaign.raised)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 mb-1">Target</p>
              <p className="text-lg font-bold text-gray-900">
                {formatCurrency(campaign.targetAmount || campaign.target)}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative">
            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-amber-400 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                style={{ width: `${Math.min(progress, 100)}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
              </div>
            </div>
            <div className="absolute -top-1 right-0 transform translate-x-1/2">
              <div className="w-5 h-5 bg-emerald-500 rounded-full border-2 border-white shadow-lg" />
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4 text-emerald-600" />
              <span className="font-semibold">{campaign.donorCount || campaign.donors || 0}</span>
              <span>donors</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-amber-500" />
              <span className="font-semibold">{Math.round(progress)}%</span>
              <span>funded</span>
            </div>
          </div>
        </div>

        {/* Location & CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span className="truncate max-w-[120px]">
              {campaign.location?.city || campaign.location || 'Ibadan'}
            </span>
          </div>

          <button 
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 transform group-hover:scale-105 ${
              status === 'completed' || status === 'ended'
                ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                : status === 'funded'
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md hover:shadow-lg'
            }`}
            onClick={(e) => {
              if (status === 'completed' || status === 'ended') {
                e.preventDefault();
              }
            }}
          >
            {status === 'completed' ? 'Completed' : 
             status === 'ended' ? 'Ended' :
             status === 'funded' ? 'Funded' : 'Donate Now'}
          </button>
        </div>
      </div>

      {/* Hover Effect Glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-amber-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </Link>
  );
});

CampaignCardModern.displayName = 'CampaignCardModern';

export default CampaignCardModern;




