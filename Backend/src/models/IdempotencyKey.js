import mongoose from "mongoose";

const idempotencyKeySchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400 * 7 // automatically delete after 7 days
  }
});

export default mongoose.model("IdempotencyKey", idempotencyKeySchema);
