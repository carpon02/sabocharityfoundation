// src/features/campaigns/CampaignsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import campaignService from "../../../../admin/services/campaignService";

// =============== FETCH ALL CAMPAIGNS (Public + User's) ===============
export const fetchUserCampaigns = createAsyncThunk(
  "userCampaigns/fetchUserCampaigns",
  async (
    { category, search, featured, showOnlyMine = false } = {},
    { rejectWithValue, getState }
  ) => {
    try {
      const params = {
        limit: 100,
        category:
          category && category !== "All" ? category.toLowerCase() : undefined,
        featured: featured === true ? true : undefined,
      };

      if (search) {
        params.search = search;
      }

      // Filter out undefined params
      Object.keys(params).forEach((key) => {
        if (params[key] === undefined) delete params[key];
      });

      const data = await campaignService.getAllCampaigns(params);

      // Get userId from auth state
      const state = getState();
      const userId = state.auth?.user?.id || state.auth?.user?._id;

      return {
        campaigns: data.data?.campaigns || data.campaigns || [],
        userId, // Pass userId to payload
        showOnlyMine,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch campaigns"
      );
    }
  }
);

// =============== FETCH SINGLE CAMPAIGN ===============
export const fetchCampaignById = createAsyncThunk(
  "userCampaigns/fetchCampaignById",
  async (id, { rejectWithValue }) => {
    try {
      const data = await campaignService.getCampaign(id);
      return data.data?.campaign || data.campaign;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch campaign"
      );
    }
  }
);

// =============== CREATE CAMPAIGN (Donor) ===============
export const createUserCampaign = createAsyncThunk(
  "userCampaigns/createUserCampaign",
  async (campaignData, { rejectWithValue, getState }) => {
    try {
      const formData = new FormData();

      // Add basic fields
      formData.append("title", campaignData.title);
      formData.append("description", campaignData.description);

      if (campaignData.shortDescription) {
        formData.append("shortDescription", campaignData.shortDescription);
      }

      // Category - lowercase
      formData.append("category", campaignData.category.toLowerCase());

      // Target amount
      formData.append(
        "targetAmount",
        campaignData.target || campaignData.targetAmount
      );

      // Dates
      formData.append("startDate", campaignData.startDate);
      formData.append("endDate", campaignData.endDate);

      // Location - convert to proper structure
      if (campaignData.location) {
        if (typeof campaignData.location === "string") {
          const locationParts = campaignData.location
            .split(",")
            .map((s) => s.trim());
          const locationObj = {
            city: locationParts[0] || "",
            state: locationParts[1] || "",
            country: "Nigeria",
          };
          formData.append("location", JSON.stringify(locationObj));
        } else {
          formData.append("location", JSON.stringify(campaignData.location));
        }
      }

      // Tags
      if (campaignData.tags) {
        let tagsArray;
        if (typeof campaignData.tags === "string") {
          tagsArray = campaignData.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean);
        } else if (Array.isArray(campaignData.tags)) {
          tagsArray = campaignData.tags;
        }
        if (tagsArray && tagsArray.length > 0) {
          formData.append("tags", JSON.stringify(tagsArray));
        }
      }

      // Image files - append actual files if present
      if (campaignData.imageFiles && campaignData.imageFiles.length > 0) {
        campaignData.imageFiles.forEach((file) => {
          formData.append("images", file);
        });
      }

      const data = await campaignService.createCampaign(formData);
      const createdCampaign = data.data?.campaign || data.campaign;

      // Get userId from auth state
      const state = getState();
      const userId = state.auth?.user?.id || state.auth?.user?._id;

      toast.success(
        "Campaign created successfully! It's pending admin approval and will appear on the public page once approved.",
        { duration: 5000 }
      );

      return { campaign: createdCampaign, userId };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to create campaign";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// =============== UPDATE CAMPAIGN ===============
export const updateUserCampaign = createAsyncThunk(
  "userCampaigns/updateUserCampaign",
  async ({ id, campaignData }, { rejectWithValue, getState }) => {
    try {
      const formData = new FormData();

      formData.append("title", campaignData.title);
      formData.append("description", campaignData.description);

      if (campaignData.shortDescription) {
        formData.append("shortDescription", campaignData.shortDescription);
      }

      formData.append("category", campaignData.category.toLowerCase());
      formData.append(
        "targetAmount",
        campaignData.target || campaignData.targetAmount
      );
      formData.append("startDate", campaignData.startDate);
      formData.append("endDate", campaignData.endDate);

      // Location
      if (campaignData.location) {
        if (typeof campaignData.location === "string") {
          const locationParts = campaignData.location
            .split(",")
            .map((s) => s.trim());
          const locationObj = {
            city: locationParts[0] || "",
            state: locationParts[1] || "",
            country: "Nigeria",
          };
          formData.append("location", JSON.stringify(locationObj));
        } else {
          formData.append("location", JSON.stringify(campaignData.location));
        }
      }

      // Tags
      if (campaignData.tags) {
        let tagsArray;
        if (typeof campaignData.tags === "string") {
          tagsArray = campaignData.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean);
        } else if (Array.isArray(campaignData.tags)) {
          tagsArray = campaignData.tags;
        }
        if (tagsArray && tagsArray.length > 0) {
          formData.append("tags", JSON.stringify(tagsArray));
        }
      }

      // Image files
      if (campaignData.imageFiles && campaignData.imageFiles.length > 0) {
        campaignData.imageFiles.forEach((file) => {
          formData.append("images", file);
        });
      }

      const data = await campaignService.updateCampaign(id, formData);
      const updatedCampaign = data.data?.campaign || data.campaign;

      // Get userId from auth state
      const state = getState();
      const userId = state.auth?.user?.id || state.auth?.user?._id;

      toast.success("Campaign updated successfully!");

      return { id, campaign: updatedCampaign, userId };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to update campaign";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// =============== DELETE CAMPAIGN ===============
export const deleteUserCampaign = createAsyncThunk(
  "userCampaigns/deleteUserCampaign",
  async (id, { rejectWithValue }) => {
    try {
      await campaignService.deleteCampaign(id);
      toast.success("Campaign deleted successfully");
      return id;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete campaign";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// =============== GET CAMPAIGN STATS ===============
export const fetchUserCampaignStats = createAsyncThunk(
  "userCampaigns/fetchUserCampaignStats",
  async (_, { rejectWithValue }) => {
    try {
      const data = await campaignService.getCampaignStats();
      return data.data || data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch stats"
      );
    }
  }
);

// =============== INITIAL STATE ===============
const initialState = {
  allCampaigns: [], // All public campaigns
  myCampaigns: [], // User's created campaigns
  otherCampaigns: [], // Other users' campaigns
  selectedCampaign: null,
  stats: null,
  categories: [
    "All",
    "Education",
    "Health",
    "Poverty",
    "Infrastructure",
    "Emergency",
    "Basic Needs",
    "Empowerment",
    "Food Relief",
    "Sports",
    "Welfare",
    "Emergency Relief",
    "Healthcare",
    "Other",
  ],
  loading: false,
  error: null,
};

// Helper function to separate campaigns
const separateCampaignsHelper = (state, userId) => {
  if (!userId) {
    return;
  }

  // Create NEW arrays to trigger React re-render
  const myCampaignsList = [];
  const otherCampaignsList = [];

  state.allCampaigns.forEach((c) => {
    const creatorId = c.createdBy?._id || c.createdBy;
    const userIdStr = userId?.toString();
    const creatorIdStr = creatorId?.toString();

    if (creatorIdStr === userIdStr) {
      myCampaignsList.push(c);
    } else {
      otherCampaignsList.push(c);
    }
  });

  state.myCampaigns = myCampaignsList;
  state.otherCampaigns = otherCampaignsList;
};

// =============== SLICE ===============
const userCampaignsSlice = createSlice({
  name: "userCampaigns",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedCampaign: (state) => {
      state.selectedCampaign = null;
    },
    clearCampaigns: (state) => {
      state.allCampaigns = [];
      state.myCampaigns = [];
      state.otherCampaigns = [];
    },
    // Separate user's campaigns from others
    separateCampaigns: (state, action) => {
      const userId = action.payload;
      separateCampaignsHelper(state, userId);
    },
  },
  extraReducers: (builder) => {
    const handlePending = (state) => {
      state.loading = true;
      state.error = null;
    };
    const handleRejected = (state, action) => {
      state.loading = false;
      state.error = action.payload;
    };

    builder
      // FETCH ALL CAMPAIGNS
      .addCase(fetchUserCampaigns.pending, handlePending)
      .addCase(fetchUserCampaigns.fulfilled, (state, action) => {
        state.loading = false;
        state.allCampaigns = action.payload.campaigns;

        console.log(
          "fetchUserCampaigns fulfilled, campaigns:",
          action.payload.campaigns.length
        );

        // Automatically separate campaigns if userId is available
        if (action.payload.userId) {
          separateCampaignsHelper(state, action.payload.userId);
        }

        console.log(
          "After separation - myCampaigns:",
          state.myCampaigns.length
        );
        console.log(
          "After separation - allCampaigns:",
          state.allCampaigns.length
        );
      })
      .addCase(fetchUserCampaigns.rejected, handleRejected)

      // FETCH CAMPAIGN BY ID
      .addCase(fetchCampaignById.pending, handlePending)
      .addCase(fetchCampaignById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCampaign = action.payload;
      })
      .addCase(fetchCampaignById.rejected, handleRejected)

      // FETCH STATS
      .addCase(fetchUserCampaignStats.pending, handlePending)
      .addCase(fetchUserCampaignStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchUserCampaignStats.rejected, handleRejected)

      // CREATE
      .addCase(createUserCampaign.pending, handlePending)
      .addCase(createUserCampaign.fulfilled, (state, action) => {
        state.loading = false;
        const { campaign } = action.payload;

        // Add to allCampaigns
        state.allCampaigns.unshift(campaign);

        // Add to myCampaigns
        state.myCampaigns.unshift(campaign);

        // Campaign added to state
      })
      .addCase(createUserCampaign.rejected, handleRejected)

      // UPDATE
      .addCase(updateUserCampaign.pending, handlePending)
      .addCase(updateUserCampaign.fulfilled, (state, action) => {
        state.loading = false;
        const { id, campaign } = action.payload;

        // Update in allCampaigns
        const allIndex = state.allCampaigns.findIndex(
          (c) => c._id === id || c.id === id
        );
        if (allIndex !== -1) {
          state.allCampaigns[allIndex] = campaign;
        }

        // Update in myCampaigns
        const myIndex = state.myCampaigns.findIndex(
          (c) => c._id === id || c.id === id
        );
        if (myIndex !== -1) {
          state.myCampaigns[myIndex] = campaign;
        }

        // Update selected campaign
        if (
          state.selectedCampaign?._id === id ||
          state.selectedCampaign?.id === id
        ) {
          state.selectedCampaign = campaign;
        }

        // Campaign updated in state
      })
      .addCase(updateUserCampaign.rejected, handleRejected)

      // DELETE
      .addCase(deleteUserCampaign.pending, handlePending)
      .addCase(deleteUserCampaign.fulfilled, (state, action) => {
        state.loading = false;
        state.allCampaigns = state.allCampaigns.filter(
          (c) => c._id !== action.payload && c.id !== action.payload
        );
        state.myCampaigns = state.myCampaigns.filter(
          (c) => c._id !== action.payload && c.id !== action.payload
        );
        if (
          state.selectedCampaign?._id === action.payload ||
          state.selectedCampaign?.id === action.payload
        ) {
          state.selectedCampaign = null;
        }
        // Campaign deleted from state
      })
      .addCase(deleteUserCampaign.rejected, handleRejected);
  },
});

export const {
  clearError,
  clearSelectedCampaign,
  clearCampaigns,
  separateCampaigns,
} = userCampaignsSlice.actions;
export default userCampaignsSlice.reducer;
