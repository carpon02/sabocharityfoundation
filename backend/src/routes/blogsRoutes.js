import express from "express";
import {
  getAllBlogs,
  getBlogById,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  toggleLike,
  addComment,
  moderateComment,
  deleteComment,
  getBlogStats,
  getTrendingBlogs,
  getRelatedBlogs,
} from "../controllers/blogsController.js";
import {
  protect,
  restrictTo,
  optionalAuth,
} from "../middleware/auth.middleware.js";
import { uploadSingle } from "../middleware/upload.middleware.js";
import { validate } from "../middleware/validation.middleware.js";
import { createBlogValidation } from "../validators/blog.validator.js";

const router = express.Router();

// ============ PUBLIC ROUTES ============
// Get all blogs (with optional filters)
router.get("/", optionalAuth, getAllBlogs);

// Get trending/featured blogs
router.get("/trending", getTrendingBlogs);

// Get blog stats
router.get("/stats", protect, restrictTo("admin"), getBlogStats);

// Get blog by slug
router.get("/slug/:slug", optionalAuth, getBlogBySlug);

// Get single blog by ID
router.get("/:id", optionalAuth, getBlogById);

// Get related blogs
router.get("/:id/related", getRelatedBlogs);

// ============ PROTECTED ROUTES (Authenticated Users) ============
// Like/Unlike blog
router.post("/:id/like", protect, toggleLike);

// Add comment (authenticated or guest)
router.post("/:id/comments", optionalAuth, addComment);

// ============ ADMIN & DONOR ROUTES ============
// Create blog
router.post(
  "/create-blog",
  protect,
  restrictTo("donor", "admin"),
  uploadSingle("featuredImage"),
  validate(createBlogValidation),
  createBlog
);

// Update blog
router.put(
  "/:id",
  protect,
  restrictTo("donor", "admin"),
  uploadSingle("featuredImage"),
  updateBlog
);

// Delete blog
router.delete("/:id", protect, restrictTo("donor", "admin"), deleteBlog);

// Moderate comment
router.put(
  "/:id/comments/:commentId",
  protect,
  restrictTo("admin"),
  moderateComment
);

// Delete comment
router.delete(
  "/:id/comments/:commentId",
  protect,
  restrictTo("admin"),
  deleteComment
);

export default router;
