// features/analytics/analyticsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../config/apiConfig";

// =============== FETCH USER ANALYTICS ===============
export const fetchUserAnalytics = createAsyncThunk(
  "analytics/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/analytics/user");
      return response.data.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to load analytics";
      return rejectWithValue(message);
    }
  }
);

// =============== FETCH PLATFORM ANALYTICS (Admin) ===============
export const fetchPlatformAnalytics = createAsyncThunk(
  "analytics/fetchPlatform",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/analytics");
      return response.data.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to load platform analytics";
      return rejectWithValue(message);
    }
  }
);

// =============== FETCH CAMPAIGN ANALYTICS (Admin) ===============
export const fetchCampaignAnalytics = createAsyncThunk(
  "analytics/fetchCampaigns",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/analytics/campaigns");
      return response.data.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to load campaign analytics";
      return rejectWithValue(message);
    }
  }
);

// =============== FETCH DONATION TRENDS (Admin) ===============
export const fetchDonationTrends = createAsyncThunk(
  "analytics/fetchDonationTrends",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/analytics/donations");
      return response.data.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to load donation trends";
      return rejectWithValue(message);
    }
  }
);

// =============== FETCH EVENT ANALYTICS (Admin) ===============
export const fetchEventAnalytics = createAsyncThunk(
  "analytics/fetchEvent",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/analytics/events");
      return response.data.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to load event analytics";
      return rejectWithValue(message);
    }
  }
);

// fetching public overview analytics
export const fetchOverviewAnalytics = createAsyncThunk(
  "analytics/fetchOverview",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/analytics/overview");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch overview analytics"
      );
    }
  }
);

// =============== INITIAL STATE ===============
const initialState = {
  userAnalytics: null,
  platformAnalytics: null,
  campaignAnalytics: null,
  donationTrends: null,
  eventAnalytics: null,
  overviewStats: null, // Added overviewStats
  loading: false,
  error: null,
};

// =============== SLICE ===============
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
      state.overviewStats = null; // Added overviewStats to clear
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // USER ANALYTICS
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

      // PLATFORM ANALYTICS
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

      // CAMPAIGN ANALYTICS
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

      // DONATION TRENDS
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

      // EVENT ANALYTICS
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
      })
      // OVERVIEW ANALYTICS
      .addCase(fetchOverviewAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOverviewAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.overviewStats = action.payload;
      })
      .addCase(fetchOverviewAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAnalytics } = analyticsSlice.actions;
export default analyticsSlice.reducer;
