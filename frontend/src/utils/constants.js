/**
 * Application-wide Constants
 * Centralized constants for consistent usage across the application
 */

/**
 * Campaign Status Constants
 */
export const CAMPAIGN_STATUS = {
  DRAFT: "draft",
  PENDING: "pending",
  ACTIVE: "active",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  REJECTED: "rejected",
};

/**
 * User Role Constants
 */
export const USER_ROLES = {
  ADMIN: "admin",
  DONOR: "donor",
  VOLUNTEER: "volunteer",
};

/**
 * Event Status Constants
 */
export const EVENT_STATUS = {
  UPCOMING: "upcoming",
  ONGOING: "ongoing",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

/**
 * Donation Status Constants
 */
export const DONATION_STATUS = {
  PENDING: "pending",
  COMPLETED: "completed",
  FAILED: "failed",
  REFUNDED: "refunded",
};

/**
 * Payment Status Constants
 */
export const PAYMENT_STATUS = {
  PENDING: "pending",
  SUCCESS: "success",
  FAILED: "failed",
};

/**
 * Pagination Constants
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

/**
 * Date Format Constants
 */
export const DATE_FORMATS = {
  DISPLAY: "MMM dd, yyyy",
  FULL: "MMMM dd, yyyy",
  WITH_TIME: "MMM dd, yyyy HH:mm",
  ISO: "yyyy-MM-dd",
};

/**
 * API Endpoints (relative to base URL)
 */
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
    VERIFY_EMAIL: "/auth/verify-email",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
  },
  // Campaigns
  CAMPAIGNS: "/campaigns",
  // Donations
  DONATIONS: "/donations",
  // Events
  EVENTS: "/events",
  // Blogs
  BLOGS: "/blogs",
  // Analytics
  ANALYTICS: "/analytics",
  // Volunteers
  VOLUNTEERS: "/volunteers",
  // Contact
  CONTACT: "/contact",
  // Newsletter
  NEWSLETTER: "/newsletter",
};
