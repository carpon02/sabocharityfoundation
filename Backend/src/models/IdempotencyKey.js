import mongoose from "mongoose";

const idempotencyKeySchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,   // Unique index — makes atomic upsert possible at DB level
    index: true,    // Explicit index declaration for clarity
  },
  processedAt: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400 * 7, // TTL index: auto-delete after 7 days
  },
});

// Ensure the unique index is created (extra safety for ESM hot-reload scenarios)
idempotencyKeySchema.index({ key: 1 }, { unique: true });

export default mongoose.model("IdempotencyKey", idempotencyKeySchema);
