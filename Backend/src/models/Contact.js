import mongoose from 'mongoose';
import slugify from 'slugify';

const contactSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [
      /^[\d\s\-()+]+$/,
      'Please enter a valid phone number'
    ]
  },
  email: {
    type: String,
    required: [true, 'Email address is required'],
    lowercase: true,
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/,
      'Please enter a valid email address'
    ]
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    minlength: [10, 'Message must be at least 10 characters long'],
    maxlength: [2000, 'Message cannot exceed 2000 characters']
  },
  agreedToTerms: {
    type: Boolean,
    required: [true, 'You must agree to our terms and conditions']
  },
  status: {
    type: String,
    enum: ['unread', 'read', 'replied', 'archived'],
    default: 'unread'
  },
  repliedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  repliedAt: { type: Date },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// === Hooks ===
// Generate slug before saving (uses firstName and lastName now)
contactSchema.pre('save', function(next) {
  if (this.isModified('firstName') || this.isModified('lastName')) {
    this.slug = slugify(`${this.firstName}-${this.lastName}`.slice(0, 50), { lower: true, strict: true });
  }
  next();
});

contactSchema.pre('save', function(next) {
  if (this.status === 'archived') {
    this.isActive = false;
  }
  next();
});

// === Indexes ===
contactSchema.index({ status: 1 });
contactSchema.index({ createdAt: -1 });
contactSchema.index({ email: 1 });
contactSchema.index({ phone: 1 });

// === Virtuals ===
contactSchema.virtual('responseTime').get(function() {
  if (this.repliedAt && this.createdAt) {
    const diff = this.repliedAt - this.createdAt;
    return Math.round(diff / (1000 * 60)); // minutes between creation and reply
  }
  return null;
});

const Contact = mongoose.models.Contact || mongoose.model('Contact', contactSchema);
export default Contact;
