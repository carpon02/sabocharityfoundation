import apiClient from "../config/apiConfig";

/**
 * Get all blogs with optional filters
 */
const getAllBlogs = async (params = {}) => {
  const response = await apiClient.get("/blogs", { params });
  return response.data;
};

/**
 * Get trending/featured blogs
 */
const getTrendingBlogs = async () => {
  const response = await apiClient.get("/blogs/trending");
  return response.data;
};

/**
 * Get single blog by slug
 */
const getBlogBySlug = async (slug) => {
  const response = await apiClient.get(`/blogs/slug/${slug}`);
  return response.data;
};

/**
 * Get single blog by ID
 */
const getBlogById = async (id) => {
  const response = await apiClient.get(`/blogs/${id}`);
  return response.data;
};

/**
 * Toggle like on a blog post
 */
const toggleLike = async (id) => {
  const response = await apiClient.post(`/blogs/${id}/like`, {});
  return response.data;
};

/**
 * Add comment to a blog post
 */
const addComment = async (id, commentData) => {
  const response = await apiClient.post(`/blogs/${id}/comments`, commentData);
  return response.data;
};

export default {
  getAllBlogs,
  getTrendingBlogs,
  getBlogBySlug,
  getBlogById,
  toggleLike,
  addComment,
};
