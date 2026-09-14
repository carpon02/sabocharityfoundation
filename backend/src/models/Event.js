import mongoose from 'mongoose';
import slugify from 'slugify';

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters']
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true
    },
    description: {
      type: String,
      required: [true, 'Event description is required'],
      maxlength: [3000, 'Description cannot exceed 3000 characters']
    },
    shortDescription: {
      type: String,
      maxlength: [250, 'Short description cannot exceed 250 characters']
    },
    category: {
      type: String,
      required: [true, 'Event category is required'],
      enum: [
        'workshop',
        'seminar',
        'fundraiser',
        'community_outreach',
        'volunteer_drive',
        'awareness_campaign',
        'other'
      ]
    },
    images: [
      {
        url: { type: String },
        publicId: String,
        isPrimary: { type: Boolean, default: false }
      }
    ],
    eventDate: {
      type: Date,
      required: [true, 'Event date is required']
    },
    endDate: Date,
    eventTime: {
      start: {
        type: String,
        required: [true, 'Start time is required']
      },
      end: String
    },
    location: {
      venue: {
        type: String,
        required: [true, 'Venue is required']
      },
      address: String,
      city: String,
      state: String,
      country: { type: String, default: 'Nigeria' },
      coordinates: {
        lat: Number,
        lng: Number
      }
    },
    isOnline: {
      type: Boolean,
      default: false
    },
    onlineDetails: {
      platform: String, // e.g., Zoom, Google Meet, etc.
      meetingLink: String,
      meetingId: String,
      passcode: String
    },
    capacity: {
      max: Number,
      registered: { type: Number, default: 0 },
      attended: { type: Number, default: 0 }
    },
    registrationRequired: {
      type: Boolean,
      default: true
    },
    registrationDeadline: Date,
    registrationFee: {
      amount: { type: Number, default: 0 },
      currency: { type: String, default: 'NGN' }
    },
    status: {
      type: String,
      enum: [
        'draft',
        'published',
        'ongoing',
        'completed',
        'cancelled',
        'postponed'
      ],
      default: 'draft'
    },
    organizers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    speakers: [
      {
        name: String,
        title: String,
        bio: String,
        image: String,
        socialLinks: {
          linkedin: String,
          twitter: String,
          website: String
        }
      }
    ],
    agenda: [
      {
        time: String,
        activity: String,
        speaker: String,
        duration: String
      }
    ],
    attendees: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        registeredAt: { type: Date, default: Date.now },
        attended: { type: Boolean, default: false },
        checkInTime: Date,
        guestInfo: {
          firstName: String,
          lastName: String,
          email: String,
          phone: String
        }
      }
    ],
    tags: [String],
    featured: {
      type: Boolean,
      default: false
    },
    gallery: [
      {
        url: String,
        publicId: String,
        caption: String
      }
    ],
    requirements: [String],
    benefits: [String],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

//
// 🔹 Virtual fields
//
eventSchema.virtual('isUpcoming').get(function () {
  return new Date(this.eventDate) > new Date();
});

eventSchema.virtual('isPast').get(function () {
  return new Date(this.eventDate) < new Date();
});

eventSchema.virtual('availableSlots').get(function () {
  if (!this.capacity.max) return null;
  return Math.max(this.capacity.max - this.capacity.registered, 0);
});

eventSchema.virtual('isFull').get(function () {
  if (!this.capacity.max) return false;
  return this.capacity.registered >= this.capacity.max;
});

//
// 🔹 Indexes
//
eventSchema.index({ eventDate: -1 });
eventSchema.index({ status: 1, featured: -1 });
eventSchema.index({ category: 1 });
eventSchema.index({ 'location.city': 1, 'location.state': 1 });

//
// 🔹 Middleware
//

// Generate slug automatically
eventSchema.pre('save', function (next) {
  if (this.isModified('title') || !this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

// Auto-update event status based on date
eventSchema.pre('save', function (next) {
  const now = new Date();
  const eventDate = new Date(this.eventDate);

  if (this.status === 'published') {
    if (eventDate < now && this.endDate && this.endDate < now) {
      this.status = 'completed';
    } else if (eventDate <= now && (!this.endDate || this.endDate > now)) {
      this.status = 'ongoing';
    }
  }

  next();
});
const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);
export default Event;
