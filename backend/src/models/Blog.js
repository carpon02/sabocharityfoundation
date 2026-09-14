import mongoose from 'mongoose';
import slugify from 'slugify';

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Blog title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    index: true
  },
  excerpt: {
    type: String,
    required: [true, 'Excerpt is required'],
    maxlength: [500, 'Excerpt cannot exceed 500 characters']
  },
  content: {
    type: String,
    required: [true, 'Blog content is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Success Stories',
      'Campaign Updates',
      'Community News',
      'Events',
      'Announcements',
      'Volunteer Stories',
      'Impact Reports'
    ]
  },
  tags: [{
    type: String,
    trim: true
  }],
  featuredImage: {
    url: String,
    publicId: String
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'scheduled'],
    default: 'draft'
  },
  publishDate: {
    type: Date
  },
  // SEO Fields
  metaTitle: {
    type: String,
    maxlength: [60, 'Meta title cannot exceed 60 characters']
  },
  metaDescription: {
    type: String,
    maxlength: [160, 'Meta description cannot exceed 160 characters']
  },
  metaKeywords: {
    type: String
  },
  // Engagement Metrics
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  likedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  // Comments
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    name: String,
    email: String,
    content: String,
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Featured/Pinned
  featured: {
    type: Boolean,
    default: false
  },
  pinned: {
    type: Boolean,
    default: false
  },
  // Reading Time
  readingTime: {
    type: Number, // in minutes
    default: 0
  },
  // Related Posts
  relatedPosts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog'
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
blogSchema.index({ status: 1, publishDate: -1 });
blogSchema.index({ category: 1, status: 1 });
blogSchema.index({ tags: 1 });
blogSchema.index({ createdAt: -1 });
blogSchema.index({ featured: -1, publishDate: -1 });

// Virtual for comment count
blogSchema.virtual('commentCount').get(function() {
  return this.comments?.filter(c => c.status === 'approved').length || 0;
});

// Generate slug from title
blogSchema.pre('save', function(next) {
  if (this.isModified('title') || !this.slug) {
    this.slug = slugify(this.title, { 
      lower: true, 
      strict: true,
      remove: /[*+~.()'"!:@]/g 
    });
  }
  next();
});

// Calculate reading time based on content
blogSchema.pre('save', function(next) {
  if (this.isModified('content')) {
    // Strip HTML tags and count words
    const text = this.content.replace(/<[^>]*>/g, '');
    const words = text.trim().split(/\s+/).length;
    // Average reading speed: 200 words per minute
    this.readingTime = Math.ceil(words / 200);
  }
  next();
});

// Auto-set publish date for published posts
blogSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'published' && !this.publishDate) {
    this.publishDate = new Date();
  }
  next();
});

// Method to increment views
blogSchema.methods.incrementViews = async function() {
  this.views += 1;
  await this.save({ validateBeforeSave: false });
};

// Method to toggle like
blogSchema.methods.toggleLike = async function(userId) {
  const index = this.likedBy.indexOf(userId);
  
  if (index > -1) {
    // Unlike
    this.likedBy.splice(index, 1);
    this.likes -= 1;
  } else {
    // Like
    this.likedBy.push(userId);
    this.likes += 1;
  }
  
  await this.save({ validateBeforeSave: false });
  return index === -1; // Return true if liked, false if unliked
};

const Blog = mongoose.models.Blog || mongoose.model('Blog', blogSchema);

export default Blog;