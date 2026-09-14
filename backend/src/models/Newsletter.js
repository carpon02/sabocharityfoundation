import mongoose from 'mongoose';
import slugify from 'slugify';

const newsletterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email address is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/,
      'Please enter a valid email address'
    ]
  },
  name: {
    type: String,
    trim: true,
    maxlength: [80, 'Name cannot exceed 80 characters']
  },
  status: {
    type: String,
    enum: ['subscribed', 'unsubscribed', 'bounced'],
    default: 'subscribed'
  },
  source: {
    type: String,
    enum: ['website', 'campaign', 'manual', 'other'],
    default: 'website'
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  unsubscribedAt: { type: Date },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// === Hooks ===
// Generate slug before saving
newsletterSchema.pre('save', function(next) {
  if (this.isModified('email')) {
    this.slug = slugify(this.email.split('@')[0], { lower: true, strict: true });
  }
  next();
});

// Auto mark inactive if unsubscribed
newsletterSchema.pre('save', function(next) {
  if (this.status === 'unsubscribed') {
    this.isActive = false;
    this.unsubscribedAt = new Date();
  }
  next();
});

// === Indexes ===
newsletterSchema.index({ status: 1 });
newsletterSchema.index({ createdAt: -1 });

// === Virtuals ===
newsletterSchema.virtual('subscriptionDuration').get(function() {
  const end = this.unsubscribedAt || new Date();
  const diff = end - this.createdAt;
  return Math.ceil(diff / (1000 * 60 * 60 * 24)); // days subscribed
});

const Newsletter = mongoose.models.Newsletter || mongoose.model('Newsletter', newsletterSchema);
export default Newsletter;
