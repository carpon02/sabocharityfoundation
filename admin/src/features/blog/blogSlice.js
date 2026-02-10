import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../config/apiConfig";

// ============ ASYNC THUNKS ============

// Get all blogs with filters
export const fetchBlogs = createAsyncThunk(
  "blog/fetchBlogs",
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await apiClient.get(`/blogs?${queryString}`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return rejectWithValue(message);
    }
  }
);

// Get single blog by ID
export const fetchBlogById = createAsyncThunk(
  "blog/fetchBlogById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/blogs/${id}`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return rejectWithValue(message);
    }
  }
);

// Get blog by slug
export const fetchBlogBySlug = createAsyncThunk(
  "blog/fetchBlogBySlug",
  async (slug, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/blogs/slug/${slug}`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return rejectWithValue(message);
    }
  }
);

// Create new blog
export const createBlog = createAsyncThunk(
  "blog/createBlog",
  async (blogData, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      // Append all fields to FormData
      Object.keys(blogData).forEach((key) => {
        if (key === "tags" && Array.isArray(blogData[key])) {
          formData.append("tags", blogData[key].join(","));
        } else if (key === "featuredImage" && blogData[key] instanceof File) {
          formData.append("featuredImage", blogData[key]);
        } else if (blogData[key] !== null && blogData[key] !== undefined) {
          formData.append(key, blogData[key]);
        }
      });

      const response = await apiClient.post("/blogs/create-blog", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to create blog";
      return rejectWithValue(message);
    }
  }
);

// Update blog
export const updateBlog = createAsyncThunk(
  "blog/updateBlog",
  async ({ id, blogData }, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      Object.keys(blogData).forEach((key) => {
        if (key === "tags" && Array.isArray(blogData[key])) {
          formData.append("tags", blogData[key].join(","));
        } else if (key === "featuredImage" && blogData[key] instanceof File) {
          formData.append("featuredImage", blogData[key]);
        } else if (blogData[key] !== null && blogData[key] !== undefined) {
          formData.append(key, blogData[key]);
        }
      });

      const response = await apiClient.put(`/blogs/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to update blog";
      return rejectWithValue(message);
    }
  }
);

// Delete blog
export const deleteBlog = createAsyncThunk(
  "blog/deleteBlog",
  async (id, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/blogs/${id}`);
      return id;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return rejectWithValue(message);
    }
  }
);

// Toggle like
export const toggleBlogLike = createAsyncThunk(
  "blog/toggleLike",
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`/blogs/${id}/like`);
      return { id, ...response.data };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return rejectWithValue(message);
    }
  }
);

// Add comment
export const addBlogComment = createAsyncThunk(
  "blog/addComment",
  async ({ id, commentData }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(
        `/blogs/${id}/comments`,
        commentData
      );
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return rejectWithValue(message);
    }
  }
);

// Moderate comment
export const moderateBlogComment = createAsyncThunk(
  "blog/moderateComment",
  async ({ blogId, commentId, status }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(
        `/blogs/${blogId}/comments/${commentId}`,
        { status }
      );
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return rejectWithValue(message);
    }
  }
);

// Delete comment
export const deleteBlogComment = createAsyncThunk(
  "blog/deleteComment",
  async ({ blogId, commentId }, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/blogs/${blogId}/comments/${commentId}`);
      return { blogId, commentId };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return rejectWithValue(message);
    }
  }
);

// Get blog stats
export const fetchBlogStats = createAsyncThunk(
  "blog/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/blogs/stats");
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return rejectWithValue(message);
    }
  }
);

// Get trending blogs
export const fetchTrendingBlogs = createAsyncThunk(
  "blog/fetchTrending",
  async (limit = 5, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/blogs/trending?limit=${limit}`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return rejectWithValue(message);
    }
  }
);

// Get related blogs
export const fetchRelatedBlogs = createAsyncThunk(
  "blog/fetchRelated",
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/blogs/${id}/related`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return rejectWithValue(message);
    }
  }
);

// ============ INITIAL STATE ============
const initialState = {
  blogs: [],
  currentBlog: null,
  relatedBlogs: [],
  trendingBlogs: [],
  stats: null,
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  },
  filters: {
    search: "",
    status: "all",
    category: "all",
    tag: "",
    featured: null,
  },
  loading: false,
  error: null,
  success: false,
};

// ============ SLICE ============
const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setPage: (state, action) => {
      state.pagination.page = action.payload;
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.pagination.page = initialState.pagination.page;
    },
    clearCurrentBlog: (state) => {
      state.currentBlog = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all blogs
      .addCase(fetchBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = action.payload.data?.blogs || [];
        state.pagination = action.payload.data?.pagination || state.pagination;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch blog by ID
      .addCase(fetchBlogById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBlog = action.payload.data?.blog || null;
      })
      .addCase(fetchBlogById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch blog by slug
      .addCase(fetchBlogBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBlog = action.payload.data?.blog || null;
      })
      .addCase(fetchBlogBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create blog
      .addCase(createBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.blogs = [action.payload.data?.blog, ...state.blogs];
      })
      .addCase(createBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // Update blog
      .addCase(updateBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const updatedBlog = action.payload.data?.blog;
        state.blogs = state.blogs.map((blog) =>
          blog._id === updatedBlog._id ? updatedBlog : blog
        );
        if (state.currentBlog?._id === updatedBlog._id) {
          state.currentBlog = updatedBlog;
        }
      })
      .addCase(updateBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // Delete blog
      .addCase(deleteBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.blogs = state.blogs.filter((blog) => blog._id !== action.payload);
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Toggle like
      .addCase(toggleBlogLike.fulfilled, (state, action) => {
        const { id, data } = action.payload;
        state.blogs = state.blogs.map((blog) =>
          blog._id === id
            ? { ...blog, likes: data.likes, liked: data.liked }
            : blog
        );
        if (state.currentBlog?._id === id) {
          state.currentBlog.likes = data.likes;
          state.currentBlog.liked = data.liked;
        }
      })

      // Add comment
      .addCase(addBlogComment.fulfilled, (state, action) => {
        const updatedBlog = action.payload.data?.blog;
        if (state.currentBlog?._id === updatedBlog._id) {
          state.currentBlog = updatedBlog;
        }
      })

      // Moderate comment
      .addCase(moderateBlogComment.fulfilled, (state, action) => {
        const updatedBlog = action.payload.data?.blog;
        if (state.currentBlog?._id === updatedBlog._id) {
          state.currentBlog = updatedBlog;
        }
      })

      // Delete comment
      .addCase(deleteBlogComment.fulfilled, (state, action) => {
        const { blogId, commentId } = action.payload;
        if (state.currentBlog?._id === blogId) {
          state.currentBlog.comments = state.currentBlog.comments.filter(
            (comment) => comment._id !== commentId
          );
        }
      })

      // Fetch stats
      .addCase(fetchBlogStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.data;
      })
      .addCase(fetchBlogStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch trending
      .addCase(fetchTrendingBlogs.fulfilled, (state, action) => {
        state.trendingBlogs = action.payload.data?.blogs || [];
      })

      // Fetch related
      .addCase(fetchRelatedBlogs.fulfilled, (state, action) => {
        state.relatedBlogs = action.payload.data?.blogs || [];
      });
  },
});

export const {
  setFilters,
  setPage,
  clearFilters,
  clearCurrentBlog,
  clearError,
  clearSuccess,
} = blogSlice.actions;

export default blogSlice.reducer;
