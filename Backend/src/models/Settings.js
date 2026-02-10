// ============================================
// FILE: models/User.js
// ============================================
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  // Basic Profile Information
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    maxlength: [100, 'Full name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    trim: true,
    match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number'],
    default: ''
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't include in queries by default
  },
  avatar: {
    type: String,
    default: ''
  },
  avatarPublicId: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    trim: true,
    maxlength: [500, 'Bio cannot exceed 500 characters'],
    default: ''
  },
  location: {
    address: {
      type: String,
      trim: true,
      maxlength: [200, 'Address cannot exceed 200 characters'],
      default: ''
    },
    city: {
      type: String,
      trim: true,
      maxlength: [100, 'City cannot exceed 100 characters'],
      default: ''
    },
    state: {
      type: String,
      trim: true,
      maxlength: [100, 'State cannot exceed 100 characters'],
      default: ''
    },
    country: {
      type: String,
      trim: true,
      default: 'Nigeria',
      maxlength: [100, 'Country cannot exceed 100 characters']
    }
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'],
    default: 'user'
  },

  // Verification and Security
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  twoFactorSecret: {
    type: String,
    default: ''
  },
  backupCodes: [{
    code: {
      type: String,
      required: true
    },
    used: {
      type: Boolean,
      default: false
    }
  }],
  isTwoFactorSetupComplete: {
    type: Boolean,
    default: false
  },
  lastPasswordChange: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date
  },

  // Notification Preferences
  notifications: {
    campaignUpdates: {
      type: Boolean,
      default: true
    },
    donationReceipts: {
      type: Boolean,
      default: true
    },
    eventReminders: {
      type: Boolean,
      default: true
    },
    weeklyDigest: {
      type: Boolean,
      default: true
    },
    marketingEmails: {
      type: Boolean,
      default: false
    },
    urgentAlerts: {
      type: Boolean,
      default: true
    },
    smsEventReminders: {
      type: Boolean,
      default: false
    },
    campaignMilestones: {
      type: Boolean,
      default: true
    }
  },

  // Privacy Settings
  privacy: {
    profileVisibility: {
      type: String,
      enum: ['public', 'private', 'friends'],
      default: 'public'
    },
    showDonations: {
      type: Boolean,
      default: true
    },
    showLocation: {
      type: Boolean,
      default: true
    },
    allowContact: {
      type: Boolean,
      default: true
    }
  },

  // App Preferences
  preferences: {
    language: {
      type: String,
      default: 'en',
      enum: ['en', 'yo', 'ig', 'ha']
    },
    currency: {
      type: String,
      default: 'NGN',
      enum: ['NGN', 'USD', 'GBP', 'EUR']
    },
    timezone: {
      type: String,
      default: 'Africa/Lagos'
    },
    theme: {
      type: String,
      default: 'system',
      enum: ['system', 'light', 'dark']
    }
  },

  // Activity and Status
  activityLog: [{
    action: {
      type: String,
      required: true,
      maxlength: [200, 'Action description too long']
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    ipAddress: {
      type: String,
      maxlength: [45, 'IP address too long']
    },
    userAgent: {
      type: String,
      maxlength: [500, 'User agent too long']
    }
  }],

  isActive: {
    type: Boolean,
    default: true
  },
  deletedAt: {
    type: Date
  }
}, {
  timestamps: true // Adds createdAt and updatedAt
});

// Index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ deletedAt: 1 });
userSchema.index({ twoFactorSecret: 1 }); // For 2FA queries

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to add activity log entry
userSchema.methods.addActivity = function(action, ipAddress = '', userAgent = '') {
  this.activityLog.unshift({
    action,
    timestamp: new Date(),
    ipAddress,
    userAgent
  });

  // Keep only last 1000 activities to prevent bloat
  if (this.activityLog.length > 1000) {
    this.activityLog = this.activityLog.slice(0, 1000);
  }

  return this.save();
};

// New method: Generate and verify 2FA token (for login use)
userSchema.methods.verify2FAToken = function(token) {
  const speakeasy = require('speakeasy');
  return speakeasy.totp.verify({
    secret: this.twoFactorSecret,
    encoding: 'base32',
    token,
    window: 1 // Allow 30s drift
  });
};

const User = mongoose.model('User', userSchema);

export default User;