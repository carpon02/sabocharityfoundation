/**
 * Application-wide constants and configuration values
 * Centralized to maintain consistency across the admin application
 */

/**
 * Campaign categories
 */
export const CAMPAIGN_CATEGORIES = [
  { value: "all", label: "All Categories" },
  { value: "education", label: "Education", emoji: "📚" },
  { value: "health", label: "Health", emoji: "🏥" },
  { value: "poverty", label: "Poverty", emoji: "🤝" },
  { value: "infrastructure", label: "Infrastructure", emoji: "🏗️" },
  { value: "emergency", label: "Emergency", emoji: "🚨" },
  { value: "other", label: "Other", emoji: "📌" },
];

/**
 * Event categories
 */
export const EVENT_CATEGORIES = [
  { value: "all", label: "All Categories" },
  { value: "workshop", label: "Workshop" },
  { value: "seminar", label: "Seminar" },
  { value: "fundraiser", label: "Fundraiser" },
  { value: "community_outreach", label: "Community Outreach" },
  { value: "volunteer_drive", label: "Volunteer Drive" },
  { value: "awareness_campaign", label: "Awareness Campaign" },
];

/**
 * Event status options
 */
export const EVENT_STATUSES = [
  { value: "all", label: "All Status" },
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "ongoing", label: "Ongoing" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "postponed", label: "Postponed" },
];

/**
 * Payment approval statuses
 */
export const PAYMENT_APPROVAL_STATUSES = [
  { value: "", label: "All Journeys" },
  { value: "pending", label: "Awaiting Embrace" },
  { value: "approved", label: "Embraced" },
  { value: "rejected", label: "Reflected" },
];

/**
 * Payment statuses
 */
export const PAYMENT_STATUSES = [
  { value: "", label: "All Paths" },
  { value: "pending", label: "In Motion" },
  { value: "verified", label: "Verified" },
  { value: "completed", label: "Fulfilled" },
  { value: "failed", label: "Paused" },
];

/**
 * Payment methods
 */
export const PAYMENT_METHODS = [
  { value: "", label: "All Channels" },
  { value: "card", label: "Card" },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "mobile_money", label: "Mobile Money" },
];

/**
 * Donor tiers configuration
 */
export const DONOR_TIERS = [
  { value: "", label: "All Tiers" },
  { value: "Platinum", label: "Platinum Kin", minAmount: 1000000 },
  { value: "Gold", label: "Gold Hearts", minAmount: 500000 },
  { value: "Silver", label: "Silver Sparks", minAmount: 100000 },
  { value: "Bronze", label: "Bronze Beacons", minAmount: 0 },
];

/**
 * Campaign approval statuses
 */
export const CAMPAIGN_APPROVAL_STATUSES = [
  { value: "all", label: "All Status" },
  { value: "approved", label: "Approved" },
  { value: "pending", label: "Pending Approval" },
];

/**
 * Blog statuses
 */
export const BLOG_STATUSES = [
  { value: "all", label: "All Status" },
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
];

/**
 * Pagination defaults
 */
export const PAGINATION_DEFAULTS = {
  page: 1,
  limit: 20,
  total: 0,
  pages: 0,
};

/**
 * Currency settings
 */
export const CURRENCY = {
  code: "NGN",
  symbol: "₦",
  locale: "en-NG",
};

/**
 * Date format options
 */
export const DATE_FORMATS = {
  short: { month: "short", day: "numeric", year: "numeric" },
  long: { month: "long", day: "numeric", year: "numeric" },
  withTime: {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  },
};

/**
 * File upload limits
 */
export const FILE_LIMITS = {
  maxImages: 3,
  maxImageSize: 5 * 1024 * 1024, // 5MB
  acceptedImageTypes: ["image/jpeg", "image/png", "image/webp"],
};
