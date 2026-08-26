import mongoose from "mongoose";

const donationSchema = new mongoose.Schema(
  {
    donationId: {
      type: String,
      required: true,
      unique: true,
      default: () =>
        `DON-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}`,
    },
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [100, "Minimum donation amount is ₦100"],
    },
    paymentMethod: {
      type: String,
      enum: ["bank_transfer", "card", "mobile_money", "ussd"],
      required: true,
    },
    paymentReference: {
      type: String,
      required: true,
      unique: true,
    },
    paystackReference: {
      type: String,
      unique: true,
      sparse: true, // <-- CRUCIAL: allows multiple documents with null value!
    },
    transactionId: {
      type: String,
      unique: true,
      sparse: true, // <-- CRUCIAL: allows multiple documents with null value!
    },
    status: {
      type: String,
      enum: [
        "pending",
        "processing",
        "verified",
        "approved",
        "completed",
        "failed",
        "refunded",
        "rejected",
      ],
      default: "pending",
    },
    requiresApproval: {
      type: Boolean,
      default: true,
    },
    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    approvedAt: Date,
    rejectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    rejectedAt: Date,
    rejectionReason: String,
    paymentVerified: {
      type: Boolean,
      default: false,
    },
    verifiedAt: Date,
    verificationDetails: {
      method: String,
      verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      notes: String,
    },
    isRecurring: {
      type: Boolean,
      default: false,
    },
    recurringFrequency: {
      type: String,
      enum: ["daily", "weekly", "monthly", "yearly"],
    },
    recurringPlanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RecurringPlan",
    },
    nextRecurringDate: Date,
    authorizationCode: {
      type: String,
      select: false, // Hide from default queries for security
    },
    lastRecurringChargeAt: Date,
    anonymous: {
      type: Boolean,
      default: false,
    },
    impactMessage: String,
    receiptUrl: String,
    receiptNumber: String,
    receiptGenerated: {
      type: Boolean,
      default: false,
    },
    donorNote: String,
    guestInfo: {
      firstName: String,
      lastName: String,
      email: String,
    },
    adminNotes: String,
    metadata: {
      ipAddress: String,
      userAgent: String,
      platform: String,
      location: {
        city: String,
        state: String,
        country: String,
      },
    },
    initiatedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: Date,
    failureReason: String,
    refundedAt: Date,
    refundReason: String,
    refundStatus: {
      type: String,
      enum: ["pending", "processed", "failed"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// ---- Compound/multifield indexes only ----
donationSchema.index({ donor: 1, createdAt: -1 });
donationSchema.index({ campaign: 1, status: 1 });
donationSchema.index({ status: 1, approvalStatus: 1 });
donationSchema.index({ approvalStatus: 1, paymentVerified: 1 });
// DO NOT add index({ paymentReference: 1 }) or index({ paystackReference: 1 }) here

donationSchema.virtual("formattedAmount").get(function () {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(this.amount);
});

donationSchema.methods.canBeApproved = function () {
  return (
    this.paymentVerified &&
    this.approvalStatus === "pending" &&
    (this.status === "verified" || this.status === "processing")
  );
};

const Donation =
  mongoose.models.Donation || mongoose.model("Donation", donationSchema);
export default Donation;
