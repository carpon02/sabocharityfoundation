import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["donation", "volunteer", "campaign", "system"],
      default: "system",
    },
    link: {
      type: String,
      required: false,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    recipientRole: {
      type: String,
      enum: ["super_admin", "finance_admin", "content_editor", "all"],
      default: "all",
    },
  },
  { timestamps: true }
);

// Index for fetching unread notifications efficiently
notificationSchema.index({ isRead: 1, createdAt: -1 });

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
