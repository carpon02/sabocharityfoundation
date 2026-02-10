import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import campaignsService from "../../services/campaignsService";

// Fetch all campaigns
export const fetchAllCampaigns = createAsyncThunk(
  "campaigns/fetchAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await campaignsService.getAllCampaigns(params);
      // Backend returns: { success, statusCode, message, data: { campaigns, pagination } }
      // Service returns response.data, which is the entire response object
      // So we need to access response.data.campaigns
      if (response && response.data && response.data.campaigns) {
        return response.data;
      }
      // Fallback: if data is directly on response
      if (response && response.campaigns) {
        return response;
      }
      // Fallback: if it's already the campaigns array
      if (Array.isArray(response)) {
        return { campaigns: response };
      }
      // Default: return empty campaigns array
      console.warn("Unexpected response structure:", response);
      return { campaigns: [] };
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch campaigns"
      );
    }
  }
);

// Fetch campaign by ID
export const fetchCampaignById = createAsyncThunk(
  "campaigns/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const data = await campaignsService.getCampaignById(id);
      return data.data || data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch campaign"
      );
    }
  }
);

// Fetch campaign by slug
export const fetchCampaignBySlug = createAsyncThunk(
  "campaigns/fetchBySlug",
  async (slug, { rejectWithValue }) => {
    try {
      const data = await campaignsService.getCampaignBySlug(slug);
      return data.data || data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch campaign"
      );
    }
  }
);

// Fetch campaign stats
export const fetchCampaignStats = createAsyncThunk(
  "campaigns/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const data = await campaignsService.getCampaignStats();
      return data.data || data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch campaign stats"
      );
    }
  }
);

// Create campaign
export const createCampaign = createAsyncThunk(
  "campaigns/create",
  async (campaignData, { rejectWithValue }) => {
    try {
      const data = await campaignsService.createCampaign(campaignData);
      return data.data || data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to create campaign"
      );
    }
  }
);

// Update campaign
export const updateCampaign = createAsyncThunk(
  "campaigns/update",
  async ({ id, campaignData }, { rejectWithValue }) => {
    try {
      const data = await campaignsService.updateCampaign(id, campaignData);
      return data.data || data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to update campaign"
      );
    }
  }
);

// Delete campaign
export const deleteCampaign = createAsyncThunk(
  "campaigns/delete",
  async (id, { rejectWithValue }) => {
    try {
      await campaignsService.deleteCampaign(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to delete campaign"
      );
    }
  }
);

// Add campaign update
export const addCampaignUpdate = createAsyncThunk(
  "campaigns/addUpdate",
  async ({ id, updateData }, { rejectWithValue }) => {
    try {
      const data = await campaignsService.addCampaignUpdate(id, updateData);
      return { id, update: data.data || data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to add campaign update"
      );
    }
  }
);

// Approve campaign
export const approveCampaign = createAsyncThunk(
  "campaigns/approve",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const data = await campaignsService.approveCampaign(id, status);
      return data.data || data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to approve campaign"
      );
    }
  }
);

const initialState = {
  campaigns: [],
  selectedCampaign: null,
  stats: null,
  loading: false,
  error: null,
};

const campaignsSlice = createSlice({
  name: "campaigns",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedCampaign: (state) => {
      state.selectedCampaign = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all campaigns
      .addCase(fetchAllCampaigns.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllCampaigns.fulfilled, (state, action) => {
        state.loading = false;
        // Handle different response structures
        if (action.payload.campaigns) {
          state.campaigns = Array.isArray(action.payload.campaigns) 
            ? action.payload.campaigns 
            : [];
        } else if (Array.isArray(action.payload)) {
          state.campaigns = action.payload;
        } else {
          state.campaigns = [];
        }
      })
      .addCase(fetchAllCampaigns.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch campaign by ID
      .addCase(fetchCampaignById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCampaignById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCampaign = action.payload.campaign || action.payload;
      })
      .addCase(fetchCampaignById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch campaign by slug
      .addCase(fetchCampaignBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCampaignBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCampaign = action.payload.campaign || action.payload;
      })
      .addCase(fetchCampaignBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch campaign stats
      .addCase(fetchCampaignStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCampaignStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchCampaignStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create campaign
      .addCase(createCampaign.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCampaign.fulfilled, (state, action) => {
        state.loading = false;
        state.campaigns.unshift(action.payload.campaign || action.payload);
      })
      .addCase(createCampaign.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update campaign
      .addCase(updateCampaign.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCampaign.fulfilled, (state, action) => {
        state.loading = false;
        const updatedCampaign = action.payload.campaign || action.payload;
        const index = state.campaigns.findIndex(
          (c) => c._id === updatedCampaign._id || c.id === updatedCampaign.id
        );
        if (index !== -1) {
          state.campaigns[index] = updatedCampaign;
        }
        if (state.selectedCampaign) {
          state.selectedCampaign = updatedCampaign;
        }
      })
      .addCase(updateCampaign.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete campaign
      .addCase(deleteCampaign.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCampaign.fulfilled, (state, action) => {
        state.loading = false;
        state.campaigns = state.campaigns.filter(
          (c) => c._id !== action.payload && c.id !== action.payload
        );
      })
      .addCase(deleteCampaign.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add campaign update
      .addCase(addCampaignUpdate.fulfilled, (state, action) => {
        const { id, update } = action.payload;
        const campaign = state.campaigns.find(
          (c) => c._id === id || c.id === id
        );
        if (campaign && campaign.updates) {
          campaign.updates.push(update);
        }
        if (
          state.selectedCampaign &&
          (state.selectedCampaign._id === id ||
            state.selectedCampaign.id === id)
        ) {
          if (!state.selectedCampaign.updates) {
            state.selectedCampaign.updates = [];
          }
          state.selectedCampaign.updates.push(update);
        }
      })
      // Approve campaign
      .addCase(approveCampaign.fulfilled, (state, action) => {
        const updatedCampaign = action.payload.campaign || action.payload;
        const index = state.campaigns.findIndex(
          (c) => c._id === updatedCampaign._id || c.id === updatedCampaign.id
        );
        if (index !== -1) {
          state.campaigns[index] = updatedCampaign;
        }
      });
  },
});

export const { clearError, clearSelectedCampaign } = campaignsSlice.actions;
export default campaignsSlice.reducer;
