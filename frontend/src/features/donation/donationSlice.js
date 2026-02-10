// features/donation/donationSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../config/apiConfig";

// =============== FETCH MY DONATIONS ===============
export const fetchMyDonations = createAsyncThunk(
  "donations/fetchMyDonations",
  async (
    {
      status,
      page = 1,
      limit = 5,
      sortBy = "createdAt",
      order = "desc",
      search,
    },
    { rejectWithValue },
  ) => {
    try {
      const params = {
        page,
        limit,
        sortBy,
        order,
        ...(status && { status }),
        ...(search && { search }),
      };

      const response = await apiClient.get("/donations/my-donations", {
        params,
      });
      return response.data.data; // { donations, stats, pagination }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch donations";
      return rejectWithValue(message);
    }
  },
);

// =============== FETCH DONATION DETAILS ===============
export const fetchDonationDetails = createAsyncThunk(
  "donations/fetchDonationDetails",
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/donations/${id}`);
      return response.data.data.donation;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch donation details";
      return rejectWithValue(message);
    }
  },
);

// =============== DOWNLOAD RECEIPT ===============
export const downloadReceipt = createAsyncThunk(
  "donations/downloadReceipt",
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/donations/${id}/receipt`, {
        responseType: "blob",
      });

      // Handle blob download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `receipt-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return { success: true, id };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to download receipt";
      return rejectWithValue(message);
    }
  },
);

// =============== SUBMIT DONATION ===============
export const submitDonation = createAsyncThunk(
  "donations/submitDonation",
  async (donationData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("campaignId", donationData.campaignId);
      formData.append("amount", donationData.amount);
      formData.append("fullName", donationData.fullName);
      formData.append("email", donationData.email);
      formData.append("phone", donationData.phone || "");
      formData.append("message", donationData.message || "");
      formData.append("paymentMethod", "manual-bank-transfer");
      formData.append("anonymous", donationData.anonymous || false);

      if (donationData.receipt) {
        formData.append("receipt", donationData.receipt);
      }

      const response = await apiClient.post(
        "/donations/submit-manual",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to submit donation";
      return rejectWithValue(message);
    }
  },
);

// =============== INITIAL STATE ===============
const initialState = {
  donations: [],
  stats: {
    totalDonated: 0,
    totalCount: 0,
    completedCount: 0,
    pendingCount: 0,
  },
  pagination: {
    page: 1,
    limit: 5,
    total: 0,
    pages: 0,
  },
  filters: {
    status: "all",
    search: "",
    sortBy: "createdAt",
    order: "desc",
  },
  currentPage: 1,
  loading: false,
  error: null,
  submitting: false,
  submitError: null,
  submitSuccess: false,
  editingDonation: null,
  impactData: {
    familiesHelped: 0,
    mealsProvided: 0,
    studentsSupported: 0,
  },
};

// =============== HELPER FUNCTION ===============
const recalculateStatsAndImpact = (state) => {
  const completedDonations = state.donations.filter(
    (d) => d.status === "completed",
  );
  if (!state.stats) {
    state.stats = {
      totalDonated: 0,
      totalCount: 0,
      completedCount: 0,
      pendingCount: 0,
    };
  }

  state.stats.totalDonated = completedDonations.reduce(
    (sum, d) => sum + d.amount,
    0,
  );
  state.stats.completedCount = completedDonations.length;
  state.stats.pendingCount = state.donations.filter(
    (d) => d.approvalStatus === "pending",
  ).length;

  // Impact calculation
  state.impactData.familiesHelped = completedDonations.reduce((sum, d) => {
    const match =
      d.impactMessage?.match(/(\d+) families?/i) ||
      d.metadata?.impact?.families ||
      0;
    return sum + parseInt(match, 10) || 0;
  }, 0);

  state.impactData.mealsProvided = completedDonations.reduce((sum, d) => {
    const match =
      d.impactMessage?.match(/(\d+) meals?/i) || d.metadata?.impact?.meals || 0;
    return sum + parseInt(match, 10) || 0;
  }, 0);

  state.impactData.studentsSupported = completedDonations.reduce((sum, d) => {
    const match =
      d.impactMessage?.match(/(\d+) students?/i) ||
      d.metadata?.impact?.students ||
      0;
    return sum + parseInt(match, 10) || 0;
  }, 0);
};

// =============== SLICE ===============
const donationsSlice = createSlice({
  name: "donations",
  initialState,
  reducers: {
    updateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.currentPage = 1;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.currentPage = 1;
    },
    setEditingDonation: (state, action) => {
      state.editingDonation = action.payload;
    },
    updateDonationStatus: (state, action) => {
      const { id, status } = action.payload;
      const donation = state.donations.find((d) => d._id === id);
      if (donation) {
        donation.status = status;
        recalculateStatsAndImpact(state);
      }
    },
    resetSubmitState: (state) => {
      state.submitting = false;
      state.submitError = null;
      state.submitSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH MY DONATIONS
      .addCase(fetchMyDonations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyDonations.fulfilled, (state, action) => {
        state.loading = false;
        state.donations = action.payload.donations || [];
        state.stats = action.payload.stats || state.stats || initialState.stats;
        state.pagination = action.payload.pagination || state.pagination;
        recalculateStatsAndImpact(state);
      })
      .addCase(fetchMyDonations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // FETCH DONATION DETAILS
      .addCase(fetchDonationDetails.fulfilled, (state, action) => {
        state.editingDonation = action.payload;
      })
      .addCase(fetchDonationDetails.rejected, (state, action) => {
        state.error = action.payload;
      })

      // DOWNLOAD RECEIPT
      .addCase(downloadReceipt.rejected, (state, action) => {
        state.error = action.payload;
      })

      // SUBMIT DONATION
      .addCase(submitDonation.pending, (state) => {
        state.submitting = true;
        state.submitError = null;
        state.submitSuccess = false;
      })
      .addCase(submitDonation.fulfilled, (state) => {
        state.submitting = false;
        state.submitSuccess = true;
      })
      .addCase(submitDonation.rejected, (state, action) => {
        state.submitting = false;
        state.submitError = action.payload;
      });
  },
});

export const {
  updateFilters,
  setCurrentPage,
  clearFilters,
  setEditingDonation,
  updateDonationStatus,
  resetSubmitState,
} = donationsSlice.actions;

export default donationsSlice.reducer;
