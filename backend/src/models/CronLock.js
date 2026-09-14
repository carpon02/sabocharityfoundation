// ============================================
// FILE: models/CronLock.js
// MongoDB-based distributed lock for cron jobs.
// Prevents multiple replicas from running the
// same job simultaneously (e.g. recurring donations).
// ============================================
import mongoose from 'mongoose';

const cronLockSchema = new mongoose.Schema({
  /** Unique name for the cron job (e.g. "recurring-donations") */
  jobName: {
    type: String,
    required: true,
    unique: true,
  },
  /** Which instance currently holds the lock */
  lockedBy: {
    type: String,
    required: true,
  },
  /** When the lock was acquired */
  lockedAt: {
    type: Date,
    default: Date.now,
  },
  /** Auto-expire so a crashed replica doesn't hold the lock forever */
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 }, // TTL index — MongoDB removes the doc automatically
  },
});

const CronLock = mongoose.model('CronLock', cronLockSchema);

/**
 * Try to acquire a lock for the given job name.
 * Returns true if the lock was acquired, false if another instance holds it.
 *
 * @param {string} jobName - Unique identifier for the cron job
 * @param {string} instanceId - Identifier for this server instance
 * @param {number} ttlMs - How long the lock should live (default: 30 min)
 */
export async function acquireLock(jobName, instanceId, ttlMs = 30 * 60 * 1000) {
  try {
    await CronLock.create({
      jobName,
      lockedBy: instanceId,
      lockedAt: new Date(),
      expiresAt: new Date(Date.now() + ttlMs),
    });
    return true;
  } catch (error) {
    // Duplicate key → another instance holds the lock
    if (error.code === 11000) return false;
    throw error;
  }
}

/**
 * Release the lock after the job finishes.
 */
export async function releaseLock(jobName) {
  await CronLock.deleteOne({ jobName });
}

export default CronLock;
