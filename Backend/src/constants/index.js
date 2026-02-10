/**
 * Application-wide Constants
 * Centralized constants to avoid magic numbers and strings
 */

// Payment Constants
export const PAYMENT = {
  MIN_AMOUNT: 100, // Minimum donation in NGN
  KOBO_MULTIPLIER: 100, // Convert NGN to kobo
  CURRENCY: {
    NGN: 'NGN',
    USD: 'USD'
  }
};

// Payment Methods
export const PAYMENT_METHODS = {
  BANK_TRANSFER: 'bank_transfer',
  CARD: 'card',
  MOBILE_MONEY: 'mobile_money',
  USSD: 'ussd'
};

// Donation Status
export const DONATION_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  VERIFIED: 'verified',
  APPROVED: 'approved',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
  REJECTED: 'rejected'
};

// Approval Status
export const APPROVAL_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
};

// Campaign Status
export const CAMPAIGN_STATUS = {
  DRAFT: 'draft',
  PENDING: 'pending',
  ACTIVE: 'active',
  PAUSED: 'paused',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  REJECTED: 'rejected'
};

// User Roles
export const USER_ROLES = {
  GUEST: 'guest',
  DONOR: 'donor',
  ADMIN: 'admin'
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100
};

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
};

// JWT
export const JWT = {
  COOKIE_EXPIRE_DAYS: 30
};

// Email Templates
export const EMAIL_TEMPLATES = {
  DONATION_INITIATED: 'donation-initiated',
  DONATION_COMPLETED: 'donation-completed',
  DONATION_APPROVED: 'donation-approved',
  DONATION_REJECTED: 'donation-rejected',
  RECEIPT: 'receipt'
};

// Error Messages
export const ERROR_MESSAGES = {
  CAMPAIGN_NOT_FOUND: 'Campaign not found',
  CAMPAIGN_NOT_ACTIVE: 'Campaign is not currently accepting donations',
  CAMPAIGN_ENDED: 'Campaign has ended',
  DONATION_NOT_FOUND: 'Donation not found',
  INVALID_AMOUNT: 'Minimum donation amount is ₦100',
  PAYMENT_INIT_FAILED: 'Failed to initialize payment. Please try again.',
  PAYMENT_VERIFY_FAILED: 'Payment verification failed',
  UNAUTHORIZED: 'Not authorized to access this resource',
  VALIDATION_FAILED: 'Validation failed'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  DONATION_INITIATED: 'Donation initialized successfully',
  DONATION_VERIFIED: 'Donation verified successfully',
  DONATION_APPROVED: 'Donation approved successfully',
  DONATION_REJECTED: 'Donation rejected successfully',
  PAYMENT_PROCESSED: 'Payment processed successfully'
};




