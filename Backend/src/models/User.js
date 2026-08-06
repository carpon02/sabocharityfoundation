// ============================================
// FILE: models/User.js - Complete User Schema
// ============================================
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    // Basic Information
    fullName: {
      type: String,
      required: [true, "Please provide your full name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: function () {
        return this.authMethod === "local";
      },
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ["guest", "donor", "admin"],
      default: "guest",
    },
    adminRole: {
      type: String,
      enum: ["super_admin", "finance_admin", "content_editor"],
      required: function () {
        return this.role === "admin";
      },
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    authMethod: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    // Profile Information
    phone: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
      maxlength: [500, "Bio cannot exceed 500 characters"],
    },
    avatar: {
      type: String,
      default: "",
    },
    avatarPublicId: {
      type: String,
    },
    location: {
      address: String,
      city: String,
      state: String,
      country: {
        type: String,
        default: "Nigeria",
      },
    },

    // Email Verification
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,
    emailVerificationExpires: Date,

    // Security
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    twoFactorSecret: {
      type: String,
    },
    lastPasswordChange: {
      type: Date,
    },
    lastLogin: {
      type: Date,
    },

    // Notification Preferences
    notifications: {
      // Email Notifications
      campaignUpdates: {
        type: Boolean,
        default: true,
      },
      donationReceipts: {
        type: Boolean,
        default: true,
      },
      eventReminders: {
        type: Boolean,
        default: true,
      },
      weeklyDigest: {
        type: Boolean,
        default: true,
      },
      marketingEmails: {
        type: Boolean,
        default: false,
      },
      // SMS Notifications
      urgentAlerts: {
        type: Boolean,
        default: true,
      },
      smsEventReminders: {
        type: Boolean,
        default: false,
      },
      campaignMilestones: {
        type: Boolean,
        default: true,
      },
    },

    // Privacy Settings
    privacy: {
      profileVisibility: {
        type: String,
        enum: ["public", "donors", "private"],
        default: "public",
      },
      showDonations: {
        type: Boolean,
        default: true,
      },
      showLocation: {
        type: Boolean,
        default: true,
      },
      allowContact: {
        type: Boolean,
        default: true,
      },
    },

    // App Preferences
    preferences: {
      language: {
        type: String,
        enum: ["en", "yo", "ha", "ig"],
        default: "en",
      },
      currency: {
        type: String,
        enum: ["NGN", "USD", "GBP", "EUR"],
        default: "NGN",
      },
      timezone: {
        type: String,
        default: "Africa/Lagos",
      },
      theme: {
        type: String,
        enum: ["light", "dark", "system"],
        default: "system",
      },
    },

    // Activity Tracking
    activityLog: [
      {
        action: String,
        description: String,
        ipAddress: String,
        userAgent: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Account Status
    isActive: {
      type: Boolean,
      default: true,
    },
    deletedAt: {
      type: Date,
    },

    // Password Reset
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Indexes
// userSchema.index({ email: 1 }); // Removed duplicate
// userSchema.index({ googleId: 1 }); // Removed to prevent duplicate index warning
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ createdAt: -1 });

// Virtual for donations count
userSchema.virtual("donationsCount", {
  ref: "Donation",
  localField: "_id",
  foreignField: "donor",
  count: true,
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  // Only hash if password is modified
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to log activity
userSchema.methods.logActivity = function (action, description, req) {
  if (!this.activityLog) {
    this.activityLog = [];
  }

  this.activityLog.unshift({
    action,
    description,
    ipAddress: req?.ip || "Unknown",
    userAgent: req?.get("user-agent") || "Unknown",
    timestamp: new Date(),
  });

  // Keep only last 100 activities
  if (this.activityLog.length > 100) {
    this.activityLog = this.activityLog.slice(0, 100);
  }

  return this.save();
};

// Method to check if user can be contacted
userSchema.methods.canBeContacted = function () {
  return this.privacy?.allowContact && this.isActive;
};

// Method to get public profile
userSchema.methods.getPublicProfile = function () {
  const profile = {
    id: this._id,
    name: this.fullName,
    avatar: this.avatar,
    bio: this.bio,
    verified: this.isEmailVerified,
  };

  // Add location if user allows it
  if (this.privacy?.showLocation) {
    profile.location = {
      city: this.location?.city,
      state: this.location?.state,
    };
  }

  return profile;
};

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
