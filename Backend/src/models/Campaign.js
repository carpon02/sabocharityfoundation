import mongoose from "mongoose";
import slugify from "slugify";

const campaignSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Campaign title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    slug: {
      type: String,
      unique: true, // unique automatically creates an index, no need for extra .index()
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Campaign description is required"],
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    shortDescription: {
      type: String,
      maxlength: [200, "Short description cannot exceed 200 characters"],
    },
    category: {
      type: String,
      required: [true, "Campaign category is required"],
      enum: [
        "education",
        "health",
        "poverty",
        "infrastructure",
        "emergency",
        "basic needs",
        "empowerment",
        "food relief",
        "sports",
        "welfare",
        "emergency relief",
        "healthcare",
        "other",
      ],
    },
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
        isPrimary: { type: Boolean, default: false },
      },
    ],
    targetAmount: {
      type: Number,
      required: [true, "Target amount is required"],
      min: [1000, "Target amount must be at least ₦1,000"],
    },
    raisedAmount: { type: Number, default: 0 },
    currency: {
      type: String,
      default: "NGN",
      enum: ["NGN", "USD"],
    },
    startDate: { type: Date, required: [true, "Start date is required"] },
    endDate: { type: Date, required: [true, "End date is required"] },
    status: {
      type: String,
      enum: [
        "draft",
        "pending",
        "active",
        "paused",
        "completed",
        "cancelled",
        "rejected",
      ],
      default: "pending",
    },
    location: {
      address: String,
      city: String,
      state: String,
      country: { type: String, default: "Nigeria" },
    },
    beneficiaries: {
      target: Number,
      reached: { type: Number, default: 0 },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    donorCount: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    urgent: { type: Boolean, default: false },
    approved: { type: Boolean, default: false },
    tags: [String],
    gallery: [
      {
        url: String,
        publicId: String,
        caption: String,
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    updates: [
      {
        title: String,
        content: String,
        images: [String],
        postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// === Virtuals ===
campaignSchema.virtual("progressPercentage").get(function () {
  return Math.min(
    Math.round((this.raisedAmount / this.targetAmount) * 100),
    100
  );
});

campaignSchema.virtual("remainingAmount").get(function () {
  return Math.max(this.targetAmount - this.raisedAmount, 0);
});

campaignSchema.virtual("daysRemaining").get(function () {
  const now = new Date();
  const end = new Date(this.endDate);
  const diff = end - now;
  return Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)), 0);
});

campaignSchema.virtual("donations", {
  ref: "Donation",
  localField: "_id",
  foreignField: "campaign",
});

// === Indexes (clean, no duplicate slug index) ===
campaignSchema.index({ status: 1, featured: -1 });
campaignSchema.index({ category: 1 });
campaignSchema.index({ startDate: -1, endDate: -1 });
campaignSchema.index({ createdAt: -1 });

// === Hooks ===
// Generate slug before saving
campaignSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

// Auto-activate campaign when startDate is reached
campaignSchema.pre("save", function (next) {
  const now = new Date();

  // Only move from 'pending' to 'active' when start date arrives
  if (this.status === "pending" && this.startDate <= now) {
    this.status = "active";
  }

  next();
});

// Auto-complete campaign if target reached or date passed
campaignSchema.pre("save", function (next) {
  if (this.raisedAmount >= this.targetAmount && this.status === "active") {
    this.status = "completed";
  }

  const now = new Date();
  if (this.endDate < now && this.status === "active") {
    this.status = "completed";
  }

  next();
});

// === Methods ===
/**
 * Update campaign donation statistics from completed donations
 * @returns {Promise<void>}
 */
campaignSchema.methods.updateDonationStats = async function () {
  const Donation = mongoose.model("Donation");

  try {
    const stats = await Donation.aggregate([
      {
        $match: {
          campaign: this._id,
          status: { $in: ["completed", "approved"] },
          approvalStatus: "approved",
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
          uniqueDonors: { $addToSet: "$donor" },
        },
      },
      {
        $project: {
          totalAmount: 1,
          donorCount: { $size: "$uniqueDonors" },
        },
      },
    ]);

    if (stats.length > 0) {
      this.raisedAmount = stats[0].totalAmount || 0;
      this.donorCount = stats[0].donorCount || 0;
      await this.save();
    } else {
      // No donations yet
      this.raisedAmount = 0;
      this.donorCount = 0;
      await this.save();
    }
  } catch (error) {
    // Log error and rethrow - this is a critical operation
    logger.error("Error updating donation stats:", {
      error: error.message,
      stack: error.stack,
      campaignId: this._id,
    });
    throw error;
  }
};
const Campaign =
  mongoose.models.Campaign || mongoose.model("Campaign", campaignSchema);
export default Campaign;
