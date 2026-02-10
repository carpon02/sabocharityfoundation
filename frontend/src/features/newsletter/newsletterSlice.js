import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import newsletterService from "../../services/newsletterService";

// Subscribe to newsletter
export const subscribeNewsletter = createAsyncThunk(
  "newsletter/subscribe",
  async (email, { rejectWithValue }) => {
    try {
      const data = await newsletterService.subscribe(email);
      return data.data || data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to subscribe to newsletter"
      );
    }
  }
);

// Unsubscribe from newsletter
export const unsubscribeNewsletter = createAsyncThunk(
  "newsletter/unsubscribe",
  async (email, { rejectWithValue }) => {
    try {
      const data = await newsletterService.unsubscribe(email);
      return data.data || data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to unsubscribe from newsletter"
      );
    }
  }
);

// Fetch all subscribers (admin)
export const fetchAllSubscribers = createAsyncThunk(
  "newsletter/fetchAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await newsletterService.getAllSubscribers(params);
      return data.data || data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch subscribers"
      );
    }
  }
);

// Fetch subscriber by ID (admin)
export const fetchSubscriberById = createAsyncThunk(
  "newsletter/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const data = await newsletterService.getSubscriberById(id);
      return data.data || data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch subscriber"
      );
    }
  }
);

// Delete subscriber (admin)
export const deleteSubscriber = createAsyncThunk(
  "newsletter/delete",
  async (id, { rejectWithValue }) => {
    try {
      await newsletterService.deleteSubscriber(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to delete subscriber"
      );
    }
  }
);

const initialState = {
  subscribers: [],
  selectedSubscriber: null,
  subscribed: false,
  loading: false,
  error: null,
};

const newsletterSlice = createSlice({
  name: "newsletter",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedSubscriber: (state) => {
      state.selectedSubscriber = null;
    },
    resetSubscriptionStatus: (state) => {
      state.subscribed = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Subscribe
      .addCase(subscribeNewsletter.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.subscribed = false;
      })
      .addCase(subscribeNewsletter.fulfilled, (state) => {
        state.loading = false;
        state.subscribed = true;
      })
      .addCase(subscribeNewsletter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.subscribed = false;
      })
      // Unsubscribe
      .addCase(unsubscribeNewsletter.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(unsubscribeNewsletter.fulfilled, (state) => {
        state.loading = false;
        state.subscribed = false;
      })
      .addCase(unsubscribeNewsletter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch all subscribers
      .addCase(fetchAllSubscribers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllSubscribers.fulfilled, (state, action) => {
        state.loading = false;
        state.subscribers = action.payload.subscribers || action.payload;
      })
      .addCase(fetchAllSubscribers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch subscriber by ID
      .addCase(fetchSubscriberById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubscriberById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedSubscriber = action.payload.subscriber || action.payload;
      })
      .addCase(fetchSubscriberById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete subscriber
      .addCase(deleteSubscriber.fulfilled, (state, action) => {
        state.subscribers = state.subscribers.filter(
          (s) => s._id !== action.payload && s.id !== action.payload
        );
      });
  },
});

export const { clearError, clearSelectedSubscriber, resetSubscriptionStatus } =
  newsletterSlice.actions;
export default newsletterSlice.reducer;
