import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../config/apiConfig";

// ============ ASYNC THUNKS ============

// Fetch user-specific analytics
export const fetchUserAnalytics = createAsyncThunk(
  "analytics/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/analytics/user");
      return response.data.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Unable to load your impact story—let's try again to keep the hope flowing.";
      return rejectWithValue(message);
    }
  }
);

// Admin platform analytics
export const fetchPlatformAnalytics = createAsyncThunk(
  "analytics/fetchPlatform",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/analytics");
      return response.data.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Platform insights temporarily unavailable—we're working to restore the full picture of progress.";
      return rejectWithValue(message);
    }
  }
);

export const fetchCampaignAnalytics = createAsyncThunk(
  "analytics/fetchCampaigns",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/analytics/campaigns");
      return response.data.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Campaign trends paused—your guidance helps us reach more families in need.";
      return rejectWithValue(message);
    }
  }
);

export const fetchDonationTrends = createAsyncThunk(
  "analytics/fetchDonationTrends",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/analytics/donations");
      return response.data.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Donation patterns hidden for now—together, we'll uncover the rhythm of giving.";
      return rejectWithValue(message);
    }
  }
);

export const fetchEventAnalytics = createAsyncThunk(
  "analytics/fetchEvent",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/analytics/events");
      return response.data.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Event stories on hold—events bring us together to serve the overlooked.";
      return rejectWithValue(message);
    }
  }
);

// ============ INITIAL STATE ============
const initialState = {
  userAnalytics: null,
  platformAnalytics: null,
  campaignAnalytics: null,
  donationTrends: null,
  eventAnalytics: null,
  loading: false,
  error: null,
};

// ============ SLICE ============
const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {
    clearAnalytics: (state) => {
      state.userAnalytics = null;
      state.platformAnalytics = null;
      state.campaignAnalytics = null;
      state.donationTrends = null;
      state.eventAnalytics = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // User analytics
      .addCase(fetchUserAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.userAnalytics = action.payload;
      })
      .addCase(fetchUserAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Platform analytics
      .addCase(fetchPlatformAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlatformAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.platformAnalytics = action.payload;
      })
      .addCase(fetchPlatformAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Campaign analytics
      .addCase(fetchCampaignAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCampaignAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.campaignAnalytics = action.payload;
      })
      .addCase(fetchCampaignAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Donation trends
      .addCase(fetchDonationTrends.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDonationTrends.fulfilled, (state, action) => {
        state.loading = false;
        state.donationTrends = action.payload;
      })
      .addCase(fetchDonationTrends.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Event analytics
      .addCase(fetchEventAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEventAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.eventAnalytics = action.payload;
      })
      .addCase(fetchEventAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAnalytics } = analyticsSlice.actions;
export default analyticsSlice.reducer;
