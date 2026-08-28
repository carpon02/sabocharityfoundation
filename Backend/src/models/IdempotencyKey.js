import mongoose from "mongoose";

const PROCESSING_STALE_MS = 5 * 60 * 1000;

const idempotencyKeySchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    enum: ["processing", "completed"],
    default: "processing",
  },
  processedAt: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400 * 7,
  },
});

/**
 * Claim a webhook event. Returns:
 * - { action: 'process' } — caller should handle the event
 * - { action: 'skip' } — already completed (or still in flight)
 */
export async function claimWebhookEvent(key) {
  try {
    await mongoose.model("IdempotencyKey").create({
      key,
      status: "processing",
    });
    return { action: "process" };
  } catch (error) {
    if (error.code !== 11000) throw error;

    const existing = await mongoose.model("IdempotencyKey").findOne({ key });
    if (!existing) {
      return { action: "process" };
    }

    if (existing.status === "completed") {
      return { action: "skip", reason: "completed" };
    }

    const age = Date.now() - new Date(existing.processedAt || existing.createdAt).getTime();
    if (existing.status === "processing" && age < PROCESSING_STALE_MS) {
      return { action: "skip", reason: "in_flight" };
    }

    existing.status = "processing";
    existing.processedAt = new Date();
    await existing.save();
    return { action: "process" };
  }
}

export async function completeWebhookEvent(key) {
  await mongoose.model("IdempotencyKey").updateOne(
    { key },
    { $set: { status: "completed", processedAt: new Date() } },
  );
}

export async function releaseWebhookEvent(key) {
  await mongoose.model("IdempotencyKey").deleteOne({ key });
}

export default mongoose.model("IdempotencyKey", idempotencyKeySchema);
