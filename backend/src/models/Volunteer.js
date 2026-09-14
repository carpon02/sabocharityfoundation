import mongoose from "mongoose";

const volunteerSchema = new mongoose.Schema(
  {
    applicationType: {
      type: String,
      enum: ["volunteer", "ambassador"],
      default: "volunteer",
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    personalInfo: {
      firstName: {
        type: String,
        required: [true, "First name is required"],
      },
      lastName: {
        type: String,
        required: [true, "Last name is required"],
      },
      email: {
        type: String,
        required: [true, "Email is required"],
        lowercase: true,
        trim: true,
        unique: true, // ensures no duplicate volunteer emails
      },
      phone: {
        type: String,
        required: [true, "Phone number is required"],
      },
      dateOfBirth: Date,
      gender: {
        type: String,
        enum: ["male", "female", "other", "prefer_not_to_say"],
      },
      address: {
        street: String,
        city: String,
        state: String,
        postalCode: String,
        country: { type: String, default: "Nigeria" },
      },
    },

    professionalInfo: {
      occupation: String,
      employer: String,
      education: {
        level: {
          type: String,
          enum: [
            "high_school",
            "diploma",
            "bachelor",
            "master",
            "doctorate",
            "other",
          ],
        },
        fieldOfStudy: String,
        institution: String,
      },
      skills: [
        {
          name: String,
          proficiency: {
            type: String,
            enum: ["beginner", "intermediate", "advanced", "expert"],
          },
        },
      ],
      languages: [
        {
          language: String,
          proficiency: {
            type: String,
            enum: ["basic", "conversational", "fluent", "native"],
          },
        },
      ],
    },

    volunteerPreferences: {
      availability: {
        type: String,
        enum: ["weekdays", "weekends", "flexible", "specific_days"],
        required: true,
      },
      specificDays: [String],
      timeCommitment: {
        type: String,
        enum: ["1-5_hours", "5-10_hours", "10-20_hours", "20+_hours"],
        required: true,
      },
      preferredAreas: [
        {
          type: String,
          enum: [
            "education",
            "health",
            "poverty_alleviation",
            "infrastructure",
            "fundraising",
            "event_management",
            "social_media",
            "graphic_design",
            "photography",
            "teaching",
            "mentoring",
            "administrative",
            "technical",
            "other",
          ],
        },
      ],
      willingToTravel: { type: Boolean, default: false },
      hasTransportation: { type: Boolean, default: false },
    },

    emergencyContact: {
      name: String,
      relationship: String,
      phone: String,
      email: String,
    },

    experience: [
      {
        organization: String,
        role: String,
        startDate: Date,
        endDate: Date,
        description: String,
        isCurrentRole: { type: Boolean, default: false },
      },
    ],

    motivation: {
      type: String,
      maxlength: [1000, "Motivation cannot exceed 1000 characters"],
    },

    references: [
      {
        name: String,
        organization: String,
        position: String,
        email: String,
        phone: String,
        relationship: String,
      },
    ],

    documents: [
      {
        type: {
          type: String,
          enum: ["resume", "certificate", "identification", "other"],
        },
        name: String,
        url: String,
        publicId: String,
        uploadedAt: { type: Date, default: Date.now },
      },
    ],

    applicationStatus: {
      type: String,
      enum: ["pending", "under_review", "approved", "rejected", "on_hold"],
      default: "pending",
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    approvedAt: Date,
    rejectionReason: String,

    volunteerStatus: {
      type: String,
      enum: ["active", "inactive", "suspended", "alumni"],
      default: "inactive",
    },

    hoursLogged: { type: Number, default: 0 },
    tasksCompleted: { type: Number, default: 0 },

    activities: [
      {
        campaign: { type: mongoose.Schema.Types.ObjectId, ref: "Campaign" },
        event: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
        description: String,
        hoursWorked: Number,
        date: Date,
        supervisedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        notes: String,
        loggedAt: { type: Date, default: Date.now },
      },
    ],

    badges: [
      {
        name: String,
        description: String,
        icon: String,
        awardedAt: { type: Date, default: Date.now },
      },
    ],

    rating: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },

    notes: [
      {
        content: String,
        addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        createdAt: { type: Date, default: Date.now },
      },
    ],

    consentGiven: {
      dataProcessing: { type: Boolean, default: false },
      backgroundCheck: Boolean,
      photoRelease: Boolean,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ✅ Virtual field for full name
volunteerSchema.virtual("fullName").get(function () {
  return `${this.personalInfo.firstName} ${this.personalInfo.lastName}`;
});

// ✅ Indexes (safe, no duplicates)
// volunteerSchema.index({ 'personalInfo.email': 1 }, { unique: true }); // Removed duplicate
volunteerSchema.index({ applicationStatus: 1 });
volunteerSchema.index({ volunteerStatus: 1 });
volunteerSchema.index({ user: 1 });
volunteerSchema.index({ createdAt: -1 });

// ✅ Methods
volunteerSchema.methods.logActivity = async function (activityData) {
  this.activities.push(activityData);
  this.hoursLogged += activityData.hoursWorked || 0;
  this.tasksCompleted += 1;
  await this.save();
};

volunteerSchema.methods.approve = async function (approvedBy) {
  this.applicationStatus = "approved";
  this.volunteerStatus = "active";
  this.approvedBy = approvedBy;
  this.approvedAt = new Date();
  await this.save();
};

volunteerSchema.methods.reject = async function (reason) {
  this.applicationStatus = "rejected";
  this.rejectionReason = reason;
  await this.save();
};

// ✅ Prevent model recompilation error
const Volunteer =
  mongoose.models.Volunteer || mongoose.model("Volunteer", volunteerSchema);

export default Volunteer;
