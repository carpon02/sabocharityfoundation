// features/payment/paymentSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../config/apiConfig";

// =============== INITIALIZE PAYMENT ===============
export const initializePayment = createAsyncThunk(
  "payments/initializePayment",
  async (donationData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/initialize", donationData);
      return response.data.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to initialize payment";
      return rejectWithValue(message);
    }
  }
);

// =============== VERIFY PAYMENT ===============
export const verifyPayment = createAsyncThunk(
  "payments/verifyPayment",
  async (reference, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`/verify/${reference}`, {});
      return response.data.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Payment verification failed";
      return rejectWithValue(message);
    }
  }
);

// =============== FETCH MY PAYMENTS ===============
export const fetchMyPayments = createAsyncThunk(
  "payments/fetchMyPayments",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/my-donations", {
        params: filters,
      });
      return response.data.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch payments";
      return rejectWithValue(message);
    }
  }
);

// =============== FETCH PAYMENT DETAILS ===============
export const fetchPaymentDetails = createAsyncThunk(
  "payments/fetchPaymentDetails",
  async (paymentId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/${paymentId}`);
      return response.data.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch payment details";
      return rejectWithValue(message);
    }
  }
);

// =============== DOWNLOAD RECEIPT ===============
export const downloadReceipt = createAsyncThunk(
  "payments/downloadReceipt",
  async (paymentId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/${paymentId}/receipt`, {
        responseType: "blob",
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `receipt-${paymentId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return { success: true, paymentId };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to download receipt";
      return rejectWithValue(message);
    }
  }
);

// =============== INITIAL STATE ===============
const initialState = {
  myPayments: [],
  currentPayment: null,
  paymentDetails: null,
  stats: {
    totalDonated: 0,
    totalPayments: 0,
    pendingCount: 0,
    completedCount: 0,
    approvedCount: 0,
  },
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  },
  loading: false,
  detailsLoading: false,
  verifying: false,
  downloading: false,
  error: null,
};

// =============== SLICE ===============
const paymentsSlice = createSlice({
  name: "payments",
  initialState,
  reducers: {
    clearCurrentPayment: (state) => {
      state.currentPayment = null;
    },
    clearPaymentDetails: (state) => {
      state.paymentDetails = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      // INITIALIZE PAYMENT
      .addCase(initializePayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initializePayment.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPayment = action.payload;
      })
      .addCase(initializePayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // VERIFY PAYMENT
      .addCase(verifyPayment.pending, (state) => {
        state.verifying = true;
        state.error = null;
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.verifying = false;
        state.currentPayment = action.payload;

        // Add to myPayments if not already there
        const exists = state.myPayments.find(
          (p) => p._id === action.payload._id
        );
        if (!exists) {
          state.myPayments.unshift(action.payload);
        }

        // Update stats
        if (action.payload.status === "completed") {
          state.stats.completedCount += 1;
          state.stats.totalDonated += action.payload.amount;
        }
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.verifying = false;
        state.error = action.payload;
      })

      // FETCH MY PAYMENTS
      .addCase(fetchMyPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.myPayments = action.payload.donations || action.payload;

        // Calculate stats
        const payments = action.payload.donations || action.payload;
        state.stats = {
          totalPayments: payments.length,
          totalDonated: payments
            .filter((p) => p.status === "completed" || p.status === "approved")
            .reduce((sum, p) => sum + p.amount, 0),
          pendingCount: payments.filter((p) => p.approvalStatus === "pending")
            .length,
          completedCount: payments.filter((p) => p.status === "completed")
            .length,
          approvedCount: payments.filter((p) => p.status === "approved").length,
        };

        // Update pagination if provided
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(fetchMyPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // FETCH PAYMENT DETAILS
      .addCase(fetchPaymentDetails.pending, (state) => {
        state.detailsLoading = true;
        state.error = null;
      })
      .addCase(fetchPaymentDetails.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.paymentDetails = action.payload;
      })
      .addCase(fetchPaymentDetails.rejected, (state, action) => {
        state.detailsLoading = false;
        state.error = action.payload;
      })

      // DOWNLOAD RECEIPT
      .addCase(downloadReceipt.pending, (state) => {
        state.downloading = true;
        state.error = null;
      })
      .addCase(downloadReceipt.fulfilled, (state) => {
        state.downloading = false;
      })
      .addCase(downloadReceipt.rejected, (state, action) => {
        state.downloading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearCurrentPayment,
  clearPaymentDetails,
  clearError: clearPaymentsError,
  updateFilters,
} = paymentsSlice.actions;

export default paymentsSlice.reducer;
