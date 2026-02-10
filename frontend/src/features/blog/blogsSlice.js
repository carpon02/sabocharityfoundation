import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import blogsService from "../../services/blogsService";

// Fetch all blogs
export const fetchAllBlogs = createAsyncThunk(
  "blogs/fetchAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await blogsService.getAllBlogs(params);
      return data.data || data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch blogs"
      );
    }
  }
);

// Fetch trending blogs
export const fetchTrendingBlogs = createAsyncThunk(
  "blogs/fetchTrending",
  async (_, { rejectWithValue }) => {
    try {
      const data = await blogsService.getTrendingBlogs();
      return data.data || data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch trending blogs"
      );
    }
  }
);

// Fetch single blog by slug
export const fetchBlogBySlug = createAsyncThunk(
  "blogs/fetchBySlug",
  async (slug, { rejectWithValue }) => {
    try {
      const data = await blogsService.getBlogBySlug(slug);
      return data.data || data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to fetch blog"
      );
    }
  }
);

// Toggle like on blog
export const toggleBlogLike = createAsyncThunk(
  "blogs/toggleLike",
  async (id, { rejectWithValue }) => {
    try {
      const data = await blogsService.toggleLike(id);
      return { id, data: data.data || data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to toggle like"
      );
    }
  }
);

// Add comment to blog
export const addBlogComment = createAsyncThunk(
  "blogs/addComment",
  async ({ id, commentData }, { rejectWithValue }) => {
    try {
      const data = await blogsService.addComment(id, commentData);
      return { id, comment: data.data || data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to add comment"
      );
    }
  }
);

const initialState = {
  blogs: [],
  trendingBlogs: [],
  selectedBlog: null,
  loading: false,
  error: null,
};

const blogsSlice = createSlice({
  name: "blogs",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedBlog: (state) => {
      state.selectedBlog = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all blogs
      .addCase(fetchAllBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = action.payload.blogs || action.payload;
      })
      .addCase(fetchAllBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch trending blogs
      .addCase(fetchTrendingBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrendingBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.trendingBlogs = action.payload.blogs || action.payload;
      })
      .addCase(fetchTrendingBlogs.rejected, (state, action) => {
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
        state.selectedBlog = action.payload.blog || action.payload;
      })
      .addCase(fetchBlogBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Toggle like
      .addCase(toggleBlogLike.fulfilled, (state, action) => {
        const { id, data } = action.payload;
        // Update the blog in the blogs array
        const blogIndex = state.blogs.findIndex(
          (b) => b._id === id || b.id === id
        );
        if (blogIndex !== -1) {
          state.blogs[blogIndex] = data.blog || data;
        }
        // Update selected blog if it's the same
        if (
          state.selectedBlog &&
          (state.selectedBlog._id === id || state.selectedBlog.id === id)
        ) {
          state.selectedBlog = data.blog || data;
        }
      })
      // Add comment
      .addCase(addBlogComment.fulfilled, (state, action) => {
        const { id, comment } = action.payload;
        // Update the blog in the blogs array
        const blogIndex = state.blogs.findIndex(
          (b) => b._id === id || b.id === id
        );
        if (blogIndex !== -1 && state.blogs[blogIndex].comments) {
          state.blogs[blogIndex].comments.push(comment);
        }
        // Update selected blog if it's the same
        if (
          state.selectedBlog &&
          (state.selectedBlog._id === id || state.selectedBlog.id === id)
        ) {
          if (!state.selectedBlog.comments) {
            state.selectedBlog.comments = [];
          }
          state.selectedBlog.comments.push(comment);
        }
      });
  },
});

export const { clearError, clearSelectedBlog } = blogsSlice.actions;
export default blogsSlice.reducer;
