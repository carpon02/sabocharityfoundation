import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import apiClient from "../../config/apiConfig";

// Helper function to create FormData for campaigns
const createCampaignFormData = (campaignData) => {
  const formData = new FormData();

  // Add basic fields
  formData.append("title", campaignData.title);
  formData.append("description", campaignData.description);
  if (campaignData.shortDescription) {
    formData.append("shortDescription", campaignData.shortDescription);
  }

  // Category - convert to lowercase for backend
  formData.append("category", campaignData.category.toLowerCase());

  // Target amount - backend expects 'targetAmount' field
  formData.append(
    "targetAmount",
    campaignData.target || campaignData.targetAmount,
  );

  // Dates
  formData.append("startDate", campaignData.startDate);
  formData.append("endDate", campaignData.endDate);

  // Location - handle both string and object formats
  if (campaignData.location) {
    if (typeof campaignData.location === "string") {
      // If string like "Ibadan, Oyo", convert to object
      const parts = campaignData.location.split(",").map((p) => p.trim());
      const locationObj = {
        city: parts[0] || "",
        state: parts[1] || "",
        country: "Nigeria",
      };
      formData.append("location", JSON.stringify(locationObj));
    } else {
      // Already an object
      formData.append("location", JSON.stringify(campaignData.location));
    }
  }

  // Beneficiaries
  if (campaignData.beneficiariesTarget) {
    formData.append(
      "beneficiaries",
      JSON.stringify({
        target: parseInt(campaignData.beneficiariesTarget),
        reached: 0,
      }),
    );
  }

  // Tags - handle both string and array formats
  if (campaignData.tags) {
    if (typeof campaignData.tags === "string") {
      const tagsArray = campaignData.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      formData.append("tags", JSON.stringify(tagsArray));
    } else {
      formData.append("tags", JSON.stringify(campaignData.tags));
    }
  }

  // Boolean flags
  if (campaignData.featured !== undefined) {
    formData.append("featured", campaignData.featured);
  }
  if (campaignData.urgent !== undefined) {
    formData.append("urgent", campaignData.urgent);
  }

  // Currency
  if (campaignData.currency) {
    formData.append("currency", campaignData.currency);
  }

  // Images - append actual File objects
  if (campaignData.imageFiles && campaignData.imageFiles.length > 0) {
    campaignData.imageFiles.forEach((file) => {
      formData.append("images", file); // Must match multer field name
    });
  }

  return formData;
};

// Fetch all campaigns
export const fetchCampaigns = createAsyncThunk(
  "adminCampaigns/fetchCampaigns",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();

      if (filters.category) params.append("category", filters.category);
      if (filters.search) params.append("search", filters.search);
      if (filters.approval === "approved") params.append("status", "active");
      if (filters.approval === "pending") params.append("status", "pending");
      if (filters.page) params.append("page", filters.page);
      if (filters.limit) params.append("limit", filters.limit);

      const response = await apiClient.get(`/campaigns?${params.toString()}`);
      return {
        campaigns: response.data.data.campaigns || [],
        pagination: response.data.data.pagination || {
          page: 1,
          limit: 12,
          total: 0,
          totalPages: 0,
        },
      };
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch campaigns";
      toast.error(message);
      return rejectWithValue(message);
    }
  },
);

// Create campaign
export const createCampaign = createAsyncThunk(
  "adminCampaigns/createCampaign",
  async (campaignData, { rejectWithValue }) => {
    try {
      const formData = createCampaignFormData(campaignData);

      const response = await apiClient.post(
        "/campaigns/create-campaign",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      toast.success("Campaign created successfully!");
      return response.data.data.campaign;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to create campaign";
      toast.error(message);
      return rejectWithValue(message);
    }
  },
);

// Update campaign
export const updateCampaign = createAsyncThunk(
  "adminCampaigns/updateCampaign",
  async ({ id, campaignData }, { rejectWithValue }) => {
    try {
      const formData = createCampaignFormData(campaignData);

      const response = await apiClient.put(`/campaigns/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Campaign updated successfully!");
      return response.data.data.campaign;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to update campaign";
      toast.error(message);
      return rejectWithValue(message);
    }
  },
);

// Delete campaign
export const deleteCampaign = createAsyncThunk(
  "adminCampaigns/deleteCampaign",
  async (id, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/campaigns/${id}`);
      toast.success("Campaign deleted successfully!");
      return id;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to delete campaign";
      toast.error(message);
      return rejectWithValue(message);
    }
  },
);

// Approve/Reject campaign (Admin only)
export const approveCampaign = createAsyncThunk(
  "adminCampaigns/approveCampaign",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(`/campaigns/${id}/status`, {
        status,
      });

      const statusText = status === "active" ? "approved" : status;
      toast.success(`Campaign ${statusText} successfully!`);
      return response.data.data.campaign;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to update campaign status";
      toast.error(message);
      return rejectWithValue(message);
    }
  },
);

// Get campaign statistics
export const fetchCampaignStats = createAsyncThunk(
  "adminCampaigns/fetchCampaignStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/campaigns/stats");
      return response.data.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch statistics";
      return rejectWithValue(message);
    }
  },
);

// Initial state
const initialState = {
  campaigns: [],
  selectedCampaign: null,
  stats: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  },
};

// Slice
const adminCampaignSlice = createSlice({
  name: "adminCampaigns",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedCampaign: (state, action) => {
      state.selectedCampaign = action.payload;
    },
    clearSelectedCampaign: (state) => {
      state.selectedCampaign = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch campaigns
      .addCase(fetchCampaigns.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCampaigns.fulfilled, (state, action) => {
        state.loading = false;
        state.campaigns = action.payload.campaigns || [];
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchCampaigns.rejected, (state, action) => {
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
        state.campaigns.unshift(action.payload);
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
        const index = state.campaigns.findIndex(
          (c) => c._id === action.payload._id || c.id === action.payload._id,
        );
        if (index !== -1) {
          state.campaigns[index] = action.payload;
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
          (c) => c._id !== action.payload && c.id !== action.payload,
        );
      })
      .addCase(deleteCampaign.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Approve campaign
      .addCase(approveCampaign.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(approveCampaign.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.campaigns.findIndex(
          (c) => c._id === action.payload._id || c.id === action.payload._id,
        );
        if (index !== -1) {
          state.campaigns[index] = action.payload;
        }
      })
      .addCase(approveCampaign.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch stats
      .addCase(fetchCampaignStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCampaignStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchCampaignStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setSelectedCampaign, clearSelectedCampaign } =
  adminCampaignSlice.actions;
export default adminCampaignSlice.reducer;
