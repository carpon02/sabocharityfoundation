import { calculateProgress } from "./calculateProgress";

export const getCampaignStatus = (campaign) => {
  const now = new Date();
  const end = new Date(campaign.endDate);
  const progress = calculateProgress(campaign.raised, campaign.target);
  
  if (!campaign.isActive) return 'paused';
  if (now > end) return progress >= 100 ? 'completed' : 'ended';
  if (progress >= 100) return 'funded';
  return 'active';
};