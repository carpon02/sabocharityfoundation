import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import apiClient from "../../config/apiConfig";

// ============ ASYNC THUNKS ============

export const fetchAllVolunteers = createAsyncThunk(
  "adminVolunteers/fetchAll",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams({
        limit: 1000,
        ...(filters.status && { status: filters.status }),
        ...(filters.search && { search: filters.search }),
      });

      const response = await apiClient.get(`/volunteers?${queryParams}`);
      let volunteers = response.data.data.volunteers || response.data.data || [];

      // Sort
      const sortBy = filters.sortBy || "createdAt";
      const order = filters.order || "desc";
      volunteers.sort((a, b) => {
        const multiplier = order === "desc" ? -1 : 1;
        return multiplier * (new Date(a[sortBy]) - new Date(b[sortBy]));
      });

      // Pagination
      const page = filters.page || 1;
      const limit = filters.limit || 20;
      const total = volunteers.length;
      const pages = Math.ceil(total / limit);
      const start = (page - 1) * limit;
      const end = start + limit;
      const paginatedVolunteers = volunteers.slice(start, end);

      return {
        volunteers: paginatedVolunteers,
        allVolunteers: volunteers,
        pagination: { page, pages, total, limit },
      };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const approveVolunteer = createAsyncThunk(
  "adminVolunteers/approve",
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`/volunteers/${id}/approve`);
      toast.success("Volunteer approved successfully");
      return response.data.data.volunteer || response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const rejectVolunteer = createAsyncThunk(
  "adminVolunteers/reject",
  async ({ id, rejectionReason }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`/volunteers/${id}/reject`, { rejectionReason });
      toast.success("Volunteer rejected successfully");
      return response.data.data.volunteer || response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// ============ INITIAL STATE ============
const initialState = {
  volunteers: [],
  allVolunteers: [],
  selectedVolunteer: null,
  pagination: {
    page: 1,
    pages: 1,
    total: 0,
    limit: 20,
  },
  filters: {
    search: "",
    status: "",
    page: 1,
    limit: 20,
    sortBy: "createdAt",
    order: "desc",
  },
  loading: false,
  actionLoading: false,
  error: null,
};

// ============ SLICE ============
const adminVolunteersSlice = createSlice({
  name: "adminVolunteers",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearError: (state) => {
      state.error = null;
    },
    setSelectedVolunteer: (state, action) => {
      state.selectedVolunteer = action.payload;
    },
    clearSelectedVolunteer: (state) => {
      state.selectedVolunteer = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // All Volunteers
      .addCase(fetchAllVolunteers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllVolunteers.fulfilled, (state, action) => {
        state.loading = false;
        state.volunteers = action.payload.volunteers;
        state.allVolunteers = action.payload.allVolunteers;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchAllVolunteers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Approve
      .addCase(approveVolunteer.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(approveVolunteer.fulfilled, (state, action) => {
        state.actionLoading = false;
        const updated = action.payload;
        state.volunteers = state.volunteers.map(v => v._id === updated._id ? { ...v, ...updated } : v);
        state.allVolunteers = state.allVolunteers.map(v => v._id === updated._id ? { ...v, ...updated } : v);
        if (state.selectedVolunteer?._id === updated._id) {
          state.selectedVolunteer = { ...state.selectedVolunteer, ...updated };
        }
      })
      .addCase(approveVolunteer.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // Reject
      .addCase(rejectVolunteer.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(rejectVolunteer.fulfilled, (state, action) => {
        state.actionLoading = false;
        const updated = action.payload;
        state.volunteers = state.volunteers.map(v => v._id === updated._id ? { ...v, ...updated } : v);
        state.allVolunteers = state.allVolunteers.map(v => v._id === updated._id ? { ...v, ...updated } : v);
        if (state.selectedVolunteer?._id === updated._id) {
          state.selectedVolunteer = { ...state.selectedVolunteer, ...updated };
        }
      })
      .addCase(rejectVolunteer.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setFilters,
  resetFilters,
  clearError,
  setSelectedVolunteer,
  clearSelectedVolunteer,
} = adminVolunteersSlice.actions;

// Selectors
export const selectVolunteers = (state) => state.adminVolunteers.volunteers;
export const selectAllVolunteers = (state) => state.adminVolunteers.allVolunteers;
export const selectSelectedVolunteer = (state) => state.adminVolunteers.selectedVolunteer;
export const selectPagination = (state) => state.adminVolunteers.pagination;
export const selectFilters = (state) => state.adminVolunteers.filters;
export const selectLoading = (state) => state.adminVolunteers.loading;
export const selectActionLoading = (state) => state.adminVolunteers.actionLoading;
export const selectError = (state) => state.adminVolunteers.error;

export default adminVolunteersSlice.reducer;
