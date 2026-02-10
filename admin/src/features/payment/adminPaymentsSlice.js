import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import apiClient from "../../config/apiConfig";

// ============ ASYNC THUNKS ============

// Fetch payment statistics
export const fetchPaymentStats = createAsyncThunk(
  "adminPayments/fetchStats",
  async ({ period = "30days" }, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(
        `/payments/admin/stats?period=${period}`,
      );
      return response.data.data || { overview: {} };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return rejectWithValue(message);
    }
  },
);

// Fetch all payments
export const fetchAllPayments = createAsyncThunk(
  "adminPayments/fetchAll",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams({
        page: filters.page || 1,
        limit: filters.limit || 20,
        sortBy: filters.sortBy || "createdAt",
        order: filters.order || "desc",
        ...(filters.search && { search: filters.search }),
        ...(filters.status && { status: filters.status }),
        ...(filters.approvalStatus && {
          approvalStatus: filters.approvalStatus,
        }),
        ...(filters.paymentMethod && { paymentMethod: filters.paymentMethod }),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
      });

      const response = await apiClient.get(
        `/payments/admin/all?${queryParams}`,
      );
      const data = response.data.data;
      return {
        payments: data.payments || [],
        pagination: data.pagination || {
          page: 1,
          pages: 1,
          total: 0,
          limit: 20,
        },
      };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return rejectWithValue(message);
    }
  },
);

// Fetch single payment details
export const fetchPaymentDetails = createAsyncThunk(
  "adminPayments/fetchDetails",
  async (paymentId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/payments/admin/${paymentId}`);
      return { payment: response.data || {} };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return rejectWithValue(message);
    }
  },
);

// Approve payment
export const approvePayment = createAsyncThunk(
  "adminPayments/approve",
  async (
    { paymentId, adminNotes = "", impactMessage = "" },
    { rejectWithValue },
  ) => {
    try {
      const response = await apiClient.put(
        `/payments/admin/${paymentId}/approve`,
        {
          adminNotes,
          impactMessage,
        },
      );
      toast.success("Payment approved successfully!");
      return { payment: response.data || {} };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return rejectWithValue(message);
    }
  },
);

// Reject payment
export const rejectPayment = createAsyncThunk(
  "adminPayments/reject",
  async (
    { paymentId, rejectionReason, initiateRefund = false },
    { rejectWithValue },
  ) => {
    try {
      const response = await apiClient.put(
        `/payments/admin/${paymentId}/reject`,
        {
          rejectionReason,
          initiateRefund,
        },
      );
      toast.success("Payment rejected");
      return { payment: response.data || {} };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return rejectWithValue(message);
    }
  },
);

// Bulk approve payments
export const bulkApprovePayments = createAsyncThunk(
  "adminPayments/bulkApprove",
  async ({ paymentIds, adminNotes = "" }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/payments/admin/bulk-approve", {
        paymentIds,
        adminNotes,
      });
      toast.success(
        `Approved ${response.data.approved?.length || 0} payments!`,
      );
      return response.data || { approved: [] };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return rejectWithValue(message);
    }
  },
);

// Export payments
export const exportPayments = createAsyncThunk(
  "adminPayments/export",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams({
        format: "csv",
        ...(filters.status && { status: filters.status }),
        ...(filters.approvalStatus && {
          approvalStatus: filters.approvalStatus,
        }),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
        ...(Object.keys(filters).length === 0 && { all: true }),
      });

      const response = await apiClient.get(
        `/payments/admin/export?${queryParams}`,
        {
          responseType: "blob",
        },
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = `sabo-youth-payments-${
        new Date().toISOString().split("T")[0]
      }.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success("Payments exported successfully!");
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return rejectWithValue(message);
    }
  },
);

// ============ INITIAL STATE ============
const initialState = {
  payments: [],
  stats: { overview: {} },
  selectedPayment: null,
  pagination: {
    page: 1,
    pages: 1,
    total: 0,
    limit: 20,
  },
  filters: {
    search: "",
    status: "",
    approvalStatus: "",
    paymentMethod: "",
    startDate: "",
    endDate: "",
    page: 1,
    limit: 20,
    sortBy: "createdAt",
    order: "desc",
  },
  loading: false,
  statsLoading: false,
  actionLoading: false,
  error: null,
  successMessage: null,
  selectedPaymentIds: [],
};

// ============ SLICE ============
const adminPaymentsSlice = createSlice({
  name: "adminPayments",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    togglePaymentSelection: (state, action) => {
      const paymentId = action.payload;
      const index = state.selectedPaymentIds.indexOf(paymentId);
      if (index > -1) {
        state.selectedPaymentIds.splice(index, 1);
      } else {
        state.selectedPaymentIds.push(paymentId);
      }
    },
    selectAllPayments: (state) => {
      state.selectedPaymentIds = state.payments
        .filter((p) => p.approvalStatus === "pending" && p.paymentVerified)
        .map((p) => p._id);
    },
    clearPaymentSelection: (state) => {
      state.selectedPaymentIds = [];
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
    setSelectedPayment: (state, action) => {
      state.selectedPayment = action.payload || null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Stats
      .addCase(fetchPaymentStats.pending, (state) => {
        state.statsLoading = true;
        state.error = null;
      })
      .addCase(fetchPaymentStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.stats = action.payload;
      })
      .addCase(fetchPaymentStats.rejected, (state, action) => {
        state.statsLoading = false;
        state.error = action.payload;
      })

      // All payments
      .addCase(fetchAllPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = action.payload.payments;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchAllPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Details
      .addCase(fetchPaymentDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaymentDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedPayment = action.payload.payment;
      })
      .addCase(fetchPaymentDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Approve
      .addCase(approvePayment.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(approvePayment.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.successMessage = "Payment approved successfully!";

        const index = state.payments.findIndex(
          (p) => p._id === action.payload.payment._id,
        );
        if (index > -1) {
          state.payments[index] = {
            ...state.payments[index],
            ...action.payload.payment,
          };
        }

        if (state.selectedPayment?._id === action.payload.payment._id) {
          state.selectedPayment = {
            ...state.selectedPayment,
            ...action.payload.payment,
          };
        }
      })
      .addCase(approvePayment.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // Reject
      .addCase(rejectPayment.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(rejectPayment.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.successMessage = "Payment rejected";

        const index = state.payments.findIndex(
          (p) => p._id === action.payload.payment._id,
        );
        if (index > -1) {
          state.payments[index] = {
            ...state.payments[index],
            ...action.payload.payment,
          };
        }

        if (state.selectedPayment?._id === action.payload.payment._id) {
          state.selectedPayment = {
            ...state.selectedPayment,
            ...action.payload.payment,
          };
        }
      })
      .addCase(rejectPayment.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // Bulk approve
      .addCase(bulkApprovePayments.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(bulkApprovePayments.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.successMessage = `Approved ${
          action.payload.approved?.length || 0
        } payments!`;
        state.selectedPaymentIds = [];

        action.payload.approved?.forEach((approvedId) => {
          const index = state.payments.findIndex((p) => p._id === approvedId);
          if (index > -1) state.payments[index].approvalStatus = "approved";
        });
      })
      .addCase(bulkApprovePayments.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // Export
      .addCase(exportPayments.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(exportPayments.fulfilled, (state) => {
        state.actionLoading = false;
        state.successMessage = "Payments exported successfully!";
      })
      .addCase(exportPayments.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setFilters,
  resetFilters,
  togglePaymentSelection,
  selectAllPayments,
  clearPaymentSelection,
  clearError,
  clearSuccessMessage,
  setSelectedPayment,
} = adminPaymentsSlice.actions;

// Selectors
export const selectPayments = (state) => state.adminPayments.payments;
export const selectStats = (state) => state.adminPayments.stats;
export const selectPagination = (state) => state.adminPayments.pagination;
export const selectFilters = (state) => state.adminPayments.filters;
export const selectLoading = (state) => state.adminPayments.loading;
export const selectStatsLoading = (state) => state.adminPayments.statsLoading;
export const selectActionLoading = (state) => state.adminPayments.actionLoading;
export const selectError = (state) => state.adminPayments.error;
export const selectSuccessMessage = (state) =>
  state.adminPayments.successMessage;
export const selectSelectedPaymentIds = (state) =>
  state.adminPayments.selectedPaymentIds;
export const selectSelectedPayment = (state) =>
  state.adminPayments.selectedPayment;

export default adminPaymentsSlice.reducer;
