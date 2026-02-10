import Blog from "../models/Blog.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Pagination from "../utils/pagination.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../services/uploadService.js";
import logger from "../config/logger.js";

// @desc    Get all blogs (Public - with filters)
// @route   GET /api/v1/blogs
// @access  Public
export const getAllBlogs = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const skip = (page - 1) * limit;

  // Build query
  const queryObj = { ...req.query };
  const excludedFields = ["page", "sort", "limit", "fields", "search"];
  excludedFields.forEach((el) => delete queryObj[el]);

  // Filter by status (default: published for public)
  if (!req.user || !["admin", "super_admin"].includes(req.user.role)) {
    queryObj.status = "published";
    queryObj.publishDate = { $lte: new Date() };
  } else if (req.query.status) {
    queryObj.status = req.query.status;
  }

  // Search functionality
  if (req.query.search) {
    queryObj.$or = [
      { title: { $regex: req.query.search, $options: "i" } },
      { excerpt: { $regex: req.query.search, $options: "i" } },
      { content: { $regex: req.query.search, $options: "i" } },
      { tags: { $in: [new RegExp(req.query.search, "i")] } },
    ];
  }

  // Category filter
  if (req.query.category) {
    queryObj.category = req.query.category;
  }

  // Featured filter
  if (req.query.featured) {
    queryObj.featured = req.query.featured === "true";
  }

  // Tags filter
  if (req.query.tag) {
    queryObj.tags = { $in: [req.query.tag] };
  }

  // Build query
  let query = Blog.find(queryObj);

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-pinned -featured -publishDate -createdAt");
  }

  // Field limiting
  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");
    query = query.select(fields);
  }

  // Pagination
  query = query.skip(skip).limit(limit);

  // Populate author
  query = query.populate("author", "firstName lastName email avatar");

  // Execute query
  const blogs = await query;
  const total = await Blog.countDocuments(queryObj);

  const pagination = new Pagination(page, limit, total);

  ApiResponse.success(res, "Blogs fetched successfully", {
    blogs,
    pagination: pagination.toJSON(),
  });
});

// @desc    Get single blog by ID
// @route   GET /api/v1/blogs/:id
// @access  Public
export const getBlogById = asyncHandler(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id)
    .populate("author", "firstName lastName email avatar")
    .populate(
      "relatedPosts",
      "title slug excerpt featuredImage publishDate category"
    )
    .populate("comments.user", "firstName lastName avatar");

  if (!blog) {
    return next(new ApiError("Blog post not found", 404));
  }

  // Check if user can view unpublished posts
  if (blog.status !== "published") {
    if (!req.user || !["admin", "super_admin"].includes(req.user.role)) {
      return next(new ApiError("Blog post not found", 404));
    }
  }

  // Increment views (don't await, fire and forget)
  blog.incrementViews().catch((err) =>
    logger.warn("Failed to increment blog views:", {
      error: err.message,
      blogId: blog._id,
    })
  );

  ApiResponse.success(res, "Blog fetched successfully", { blog });
});

// @desc    Get blog by slug
// @route   GET /api/v1/blogs/slug/:slug
// @access  Public
export const getBlogBySlug = asyncHandler(async (req, res, next) => {
  const blog = await Blog.findOne({ slug: req.params.slug })
    .populate("author", "firstName lastName email avatar")
    .populate(
      "relatedPosts",
      "title slug excerpt featuredImage publishDate category"
    )
    .populate("comments.user", "firstName lastName avatar");

  if (!blog) {
    return next(new ApiError("Blog post not found", 404));
  }

  // Check if user can view unpublished posts
  if (blog.status !== "published") {
    if (!req.user || !["admin", "super_admin"].includes(req.user.role)) {
      return next(new ApiError("Blog post not found", 404));
    }
  }

  // Increment views
  blog.incrementViews().catch((err) =>
    logger.warn("Failed to increment blog views:", {
      error: err.message,
      blogId: blog._id,
    })
  );

  ApiResponse.success(res, "Blog fetched successfully", { blog });
});

// @desc    Create new blog
// @route   POST /api/v1/blogs
// @access  Private/Admin
export const createBlog = asyncHandler(async (req, res, next) => {
  // Add author
  req.body.author = req.user.id;

  // Handle image upload
  if (req.file) {
    const imageUpload = await uploadToCloudinary(req.file, "blogs");
    req.body.featuredImage = {
      url: imageUpload.url,
      publicId: imageUpload.publicId,
    };
  }

  // Parse tags if string
  if (typeof req.body.tags === "string") {
    req.body.tags = req.body.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);
  }

  const blog = await Blog.create(req.body);

  ApiResponse.created(res, "Blog created successfully", { blog });
});

// @desc    Update blog
// @route   PUT /api/v1/blogs/:id
// @access  Private/Admin
export const updateBlog = asyncHandler(async (req, res, next) => {
  let blog = await Blog.findById(req.params.id);

  if (!blog) {
    return next(new ApiError("Blog post not found", 404));
  }

  // Check ownership
  if (
    blog.author.toString() !== req.user.id &&
    req.user.role !== "admin" &&
    req.user.role !== "super_admin"
  ) {
    return next(new ApiError("Not authorized to update this blog", 403));
  }

  // Handle new image upload
  if (req.file) {
    // Delete old image if exists
    if (blog.featuredImage?.publicId) {
      await deleteFromCloudinary(blog.featuredImage.publicId).catch((err) =>
        logger.warn("Failed to delete old blog image:", {
          error: err.message,
          blogId: blog._id,
          publicId: blog.featuredImage.publicId,
        })
      );
    }

    const imageUpload = await uploadToCloudinary(req.file, "blogs");
    req.body.featuredImage = {
      url: imageUpload.url,
      publicId: imageUpload.publicId,
    };
  }

  // Parse tags if string
  if (typeof req.body.tags === "string") {
    req.body.tags = req.body.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);
  }

  blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  ApiResponse.success(res, "Blog updated successfully", { blog });
});

// @desc    Delete blog
// @route   DELETE /api/v1/blogs/:id
// @access  Private/Admin
export const deleteBlog = asyncHandler(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    return next(new ApiError("Blog post not found", 404));
  }

  // Check ownership
  if (blog.author.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ApiError("Not authorized to delete this blog", 403));
  }

  // Delete featured image from Cloudinary
  if (blog.featuredImage?.publicId) {
    await deleteFromCloudinary(blog.featuredImage.publicId).catch((err) =>
      logger.warn("Failed to delete blog image:", {
        error: err.message,
        blogId: blog._id,
        publicId: blog.featuredImage.publicId,
      })
    );
  }

  await blog.deleteOne();

  ApiResponse.success(res, "Blog deleted successfully");
});

// @desc    Like/Unlike blog
// @route   POST /api/v1/blogs/:id/like
// @access  Private
export const toggleLike = asyncHandler(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    return next(new ApiError("Blog post not found", 404));
  }

  const liked = await blog.toggleLike(req.user.id);

  ApiResponse.success(res, liked ? "Blog liked" : "Blog unliked", {
    liked,
    likes: blog.likes,
  });
});

// @desc    Add comment to blog
// @route   POST /api/v1/blogs/:id/comments
// @access  Private (or Public with name/email)
export const addComment = asyncHandler(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    return next(new ApiError("Blog post not found", 404));
  }

  // Only allow comments on published blogs
  if (blog.status !== "published") {
    return next(new ApiError("Cannot comment on unpublished blog", 400));
  }

  const commentData = {
    content: req.body.content,
    createdAt: Date.now(),
  };

  if (req.user) {
    commentData.user = req.user.id;
  } else {
    // Guest comment
    const { name, email } = req.body;
    if (!name || !email) {
      return next(
        new ApiError("Name and email are required for guest comments", 400)
      );
    }
    commentData.name = name;
    commentData.email = email;
  }

  blog.comments.push(commentData);
  await blog.save();

  ApiResponse.created(res, "Comment added successfully", { blog });
});

// @desc    Approve/Reject comment
// @route   PUT /api/v1/blogs/:id/comments/:commentId
// @access  Private/Admin
export const moderateComment = asyncHandler(async (req, res, next) => {
  const { status } = req.body; // 'approved' or 'rejected'

  if (!["approved", "rejected"].includes(status)) {
    return next(new ApiError("Invalid status", 400));
  }

  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    return next(new ApiError("Blog post not found", 404));
  }

  const comment = blog.comments.id(req.params.commentId);

  if (!comment) {
    return next(new ApiError("Comment not found", 404));
  }

  comment.status = status;
  await blog.save();

  ApiResponse.success(res, `Comment ${status}`, { blog });
});

// @desc    Delete comment
// @route   DELETE /api/v1/blogs/:id/comments/:commentId
// @access  Private/Admin
export const deleteComment = asyncHandler(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    return next(new ApiError("Blog post not found", 404));
  }

  const comment = await Comment.findById(req.params.commentId);

  if (!comment) {
    return next(new ApiError("Comment not found", 404));
  }

  await Comment.findByIdAndDelete(req.params.commentId);

  // Optionally, remove the reference from the blog's comments array if you store references
  blog.comments.pull(req.params.commentId);
  await blog.save();

  ApiResponse.success(res, "Comment deleted successfully");
});

// @desc    Get blog statistics
// @route   GET /api/v1/blogs/stats
// @access  Private/Admin
export const getBlogStats = asyncHandler(async (req, res, next) => {
  const stats = await Blog.aggregate([
    {
      $facet: {
        total: [{ $count: "count" }],
        byStatus: [{ $group: { _id: "$status", count: { $sum: 1 } } }],
        byCategory: [{ $group: { _id: "$category", count: { $sum: 1 } } }],
        totalViews: [{ $group: { _id: null, total: { $sum: "$views" } } }],
        totalLikes: [{ $group: { _id: null, total: { $sum: "$likes" } } }],
        published: [{ $match: { status: "published" } }, { $count: "count" }],
        draft: [{ $match: { status: "draft" } }, { $count: "count" }],
      },
    },
  ]);

  // Most viewed blogs
  const mostViewed = await Blog.find({ status: "published" })
    .sort("-views")
    .limit(5)
    .select("title slug views likes commentCount")
    .populate("author", "firstName lastName");

  // Most liked blogs
  const mostLiked = await Blog.find({ status: "published" })
    .sort("-likes")
    .limit(5)
    .select("title slug views likes commentCount")
    .populate("author", "firstName lastName");

  ApiResponse.success(res, "Blog statistics fetched successfully", {
    stats: stats[0],
    mostViewed,
    mostLiked,
  });
});

// @desc    Get trending/featured blogs
// @route   GET /api/v1/blogs/trending
// @access  Public
export const getTrendingBlogs = asyncHandler(async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 5;

  const blogs = await Blog.find({
    status: "published",
    publishDate: { $lte: new Date() },
  })
    .sort("-featured -views -likes")
    .limit(limit)
    .select("title slug excerpt featuredImage publishDate category views likes")
    .populate("author", "firstName lastName avatar");

  ApiResponse.success(res, "Trending blogs fetched successfully", {
    blogs,
    count: blogs.length,
  });
});

// @desc    Get related blogs
// @route   GET /api/v1/blogs/:id/related
// @access  Public
export const getRelatedBlogs = asyncHandler(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    return next(new ApiError("Blog post not found", 404));
  }

  // Find blogs with similar tags or same category
  const relatedBlogs = await Blog.find({
    _id: { $ne: blog._id },
    status: "published",
    publishDate: { $lte: new Date() },
    $or: [{ category: blog.category }, { tags: { $in: blog.tags } }],
  })
    .limit(4)
    .select("title slug excerpt featuredImage publishDate category")
    .populate("author", "firstName lastName avatar");

  ApiResponse.success(res, "Related blogs fetched successfully", {
    blogs: relatedBlogs,
  });
});
