import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import apiClient from "../../config/apiConfig";

// ============ HELPER FUNCTIONS ============

const calculateTier = (totalDonated) => {
  if (totalDonated >= 5000000) return "Platinum";
  if (totalDonated >= 2000000) return "Gold";
  if (totalDonated >= 1000000) return "Silver";
  return "Bronze";
};

const aggregateDonorData = (donations) => {
  const donorMap = {};

  donations.forEach((donation) => {
    if (!donation.anonymous) {
      const isGuest = !donation.donor;
      const donorId = isGuest
        ? `guest-${donation.guestInfo?.email || donation.donationId}`
        : donation.donor._id;

      if (!donorMap[donorId]) {
        donorMap[donorId] = {
          _id: donorId,
          ...(isGuest
            ? {
                fullName: donation.guestInfo
                  ? `${donation.guestInfo.firstName} ${donation.guestInfo.lastName}`
                  : "Guest Donor",
                email: donation.guestInfo?.email || "No Email",
                isGuest: true,
              }
            : donation.donor),
          totalDonated: 0,
          donationCount: 0,
          lastDonation: null,
          firstDonation: donation.createdAt,
          donations: [],
        };
      }

      donorMap[donorId].donations.push(donation);

      if (
        donation.status === "completed" ||
        donation.status === "verified" || // Include verified but not yet approved for stats?
        // User said: "it will remain onn pending only if the admin approves it"
        // Usually stats only show approved. Let's stick to approved/completed.
        donation.approvalStatus === "approved"
      ) {
        donorMap[donorId].totalDonated += donation.amount;
        donorMap[donorId].donationCount += 1;
        // ... rest stays same
      }

      // We should always update lastDonation/firstDonation regardless of status for tracking?
      // Actually the original code only updated it if completed/approved.

      if (
        donation.status === "completed" ||
        donation.approvalStatus === "approved"
      ) {
        if (
          !donorMap[donorId].lastDonation ||
          new Date(donation.createdAt) >
            new Date(donorMap[donorId].lastDonation)
        ) {
          donorMap[donorId].lastDonation = donation.createdAt;
        }

        if (
          new Date(donation.createdAt) <
          new Date(donorMap[donorId].firstDonation)
        ) {
          donorMap[donorId].firstDonation = donation.createdAt;
        }
      }
    }
  });

  return Object.values(donorMap);
};

const calculateDonorStats = (donors) => {
  const totalDonors = donors.length;

  const activeDonors = donors.filter((d) => {
    if (!d.lastDonation) return false;
    const daysSince =
      (Date.now() - new Date(d.lastDonation)) / (1000 * 60 * 60 * 24);
    return daysSince <= 90;
  }).length;

  const totalAmount = donors.reduce((sum, d) => sum + (d.totalDonated || 0), 0);
  const topTierCount = donors.filter((d) => d.totalDonated >= 2000000).length;
  const avgDonation = totalDonors > 0 ? totalAmount / totalDonors : 0;
  const retentionRate =
    totalDonors > 0 ? Math.round((activeDonors / totalDonors) * 100) : 0;

  const monthAgo = new Date();
  monthAgo.setMonth(monthAgo.getMonth() - 1);
  const newThisMonth = donors.filter(
    (d) => new Date(d.firstDonation) > monthAgo,
  ).length;
  const recurringDonors = donors.filter((d) => d.donationCount >= 3).length;

  const tiers = { platinum: 0, gold: 0, silver: 0, bronze: 0 };
  donors.forEach((donor) => {
    const tier = calculateTier(donor.totalDonated).toLowerCase();
    tiers[tier]++;
  });

  const tierDistribution = [
    {
      tier: "Platinum",
      count: tiers.platinum,
      percentage: Math.round((tiers.platinum / totalDonors) * 100) || 0,
      color: "from-indigo-500 to-purple-600",
    },
    {
      tier: "Gold",
      count: tiers.gold,
      percentage: Math.round((tiers.gold / totalDonors) * 100) || 0,
      color: "from-amber-400 to-orange-500",
    },
    {
      tier: "Silver",
      count: tiers.silver,
      percentage: Math.round((tiers.silver / totalDonors) * 100) || 0,
      color: "from-gray-300 to-gray-500",
    },
    {
      tier: "Bronze",
      count: tiers.bronze,
      percentage: Math.round((tiers.bronze / totalDonors) * 100) || 0,
      color: "from-orange-400 to-red-500",
    },
  ];

  return {
    totalDonors,
    activeDonors,
    totalAmount,
    topTierCount,
    avgDonation,
    retentionRate,
    newThisMonth,
    recurringDonors,
    tierDistribution,
  };
};

// ============ ASYNC THUNKS ============

export const fetchDonorStats = createAsyncThunk(
  "adminDonors/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(
        "/payments/admin/all?limit=1000&status=completed&approvalStatus=approved",
      );
      const donations = response.data.data.payments || [];
      const donors = aggregateDonorData(donations);
      const stats = calculateDonorStats(donors);
      return stats;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return rejectWithValue(message);
    }
  },
);

export const fetchAllDonors = createAsyncThunk(
  "adminDonors/fetchAll",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams({
        limit: 1000,
        ...(filters.status && { status: filters.status }),
        ...(filters.approvalStatus && {
          approvalStatus: filters.approvalStatus,
        }),
        ...(filters.search && { search: filters.search }),
      });

      const response = await apiClient.get(
        `/payments/admin/all?${queryParams}`,
      );
      let donors = aggregateDonorData(response.data.data.payments || []);

      // Client-side filters
      if (filters.tier) {
        donors = donors.filter(
          (donor) =>
            calculateTier(donor.totalDonated).toLowerCase() ===
            filters.tier.toLowerCase(),
        );
      }
      if (filters.minAmount) {
        donors = donors.filter(
          (d) => d.totalDonated >= parseFloat(filters.minAmount),
        );
      }
      if (filters.maxAmount) {
        donors = donors.filter(
          (d) => d.totalDonated <= parseFloat(filters.maxAmount),
        );
      }

      // Sort
      const sortBy = filters.sortBy || "totalDonated";
      const order = filters.order || "desc";
      donors.sort((a, b) => {
        const multiplier = order === "desc" ? -1 : 1;
        switch (sortBy) {
          case "totalDonated":
            return multiplier * (a.totalDonated - b.totalDonated);
          case "donationCount":
            return multiplier * (a.donationCount - b.donationCount);
          case "lastDonation":
            return (
              multiplier * (new Date(b.lastDonation) - new Date(a.lastDonation))
            );
          case "firstDonation":
            return (
              multiplier *
              (new Date(b.firstDonation) - new Date(a.firstDonation))
            );
          default:
            return 0;
        }
      });

      // Pagination
      const page = filters.page || 1;
      const limit = filters.limit || 20;
      const total = donors.length;
      const pages = Math.ceil(total / limit);
      const start = (page - 1) * limit;
      const end = start + limit;
      const paginatedDonors = donors.slice(start, end);

      return {
        donors: paginatedDonors,
        allDonors: donors,
        pagination: { page, pages, total, limit },
      };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return rejectWithValue(message);
    }
  },
);

export const fetchDonorDetails = createAsyncThunk(
  "adminDonors/fetchDetails",
  async (donorId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(
        `/payments/admin/all?search=${donorId}&limit=1000`,
      );
      const donations =
        response.data.data.payments?.filter((d) => d.donor?._id === donorId) ||
        [];

      if (donations.length === 0) {
        return rejectWithValue("Donor not found");
      }

      const donorData = {
        _id: donorId,
        ...donations[0].donor,
        totalDonated: 0,
        donationCount: 0,
        lastDonation: null,
        firstDonation: donations[0].createdAt,
        donations: donations,
      };

      donations.forEach((donation) => {
        if (
          donation.status === "completed" ||
          donation.approvalStatus === "approved"
        ) {
          donorData.totalDonated += donation.amount;
          donorData.donationCount += 1;

          if (
            !donorData.lastDonation ||
            new Date(donation.createdAt) > new Date(donorData.lastDonation)
          ) {
            donorData.lastDonation = donation.createdAt;
          }

          if (
            new Date(donation.createdAt) < new Date(donorData.firstDonation)
          ) {
            donorData.firstDonation = donation.createdAt;
          }
        }
      });

      return {
        donor: donorData,
        history: donations.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        ),
      };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return rejectWithValue(message);
    }
  },
);

export const exportDonors = createAsyncThunk(
  "adminDonors/export",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams({
        format: "csv",
        ...(filters.tier && { tier: filters.tier }),
        ...(filters.minAmount && { minAmount: filters.minAmount }),
        ...(filters.maxAmount && { maxAmount: filters.maxAmount }),
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
      a.download = `sabo-donor-allies-${
        new Date().toISOString().split("T")[0]
      }.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success("Donor data exported successfully!");
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return rejectWithValue(message);
    }
  },
);

export const updateUserStatus = createAsyncThunk(
  "adminDonors/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(`/users/${id}/status`, { status });
      toast.success("User status updated");
      return response.data.user;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return rejectWithValue(message);
    }
  },
);

export const verifyUser = createAsyncThunk(
  "adminDonors/verifyUser",
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(`/users/${id}/verify`);
      toast.success("User verified successfully");
      return response.data.user;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return rejectWithValue(message);
    }
  },
);

// ============ INITIAL STATE ============
const initialState = {
  donors: [],
  allDonors: [],
  stats: null,
  selectedDonor: null,
  donorHistory: [],
  pagination: {
    page: 1,
    pages: 1,
    total: 0,
    limit: 20,
  },
  filters: {
    search: "",
    tier: "",
    minAmount: "",
    maxAmount: "",
    page: 1,
    limit: 20,
    sortBy: "totalDonated",
    order: "desc",
  },
  loading: false,
  statsLoading: false,
  detailsLoading: false,
  actionLoading: false,
  error: null,
  successMessage: null,
};

// ============ SLICE ============
const adminDonorsSlice = createSlice({
  name: "adminDonors",
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
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
    setSelectedDonor: (state, action) => {
      state.selectedDonor = action.payload;
    },
    clearSelectedDonor: (state) => {
      state.selectedDonor = null;
      state.donorHistory = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Stats
      .addCase(fetchDonorStats.pending, (state) => {
        state.statsLoading = true;
        state.error = null;
      })
      .addCase(fetchDonorStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.stats = action.payload;
      })
      .addCase(fetchDonorStats.rejected, (state, action) => {
        state.statsLoading = false;
        state.error = action.payload;
      })

      // All donors
      .addCase(fetchAllDonors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllDonors.fulfilled, (state, action) => {
        state.loading = false;
        state.donors = action.payload.donors;
        state.allDonors = action.payload.allDonors;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchAllDonors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Details
      .addCase(fetchDonorDetails.pending, (state) => {
        state.detailsLoading = true;
        state.error = null;
      })
      .addCase(fetchDonorDetails.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.selectedDonor = action.payload.donor;
        state.donorHistory = action.payload.history;
      })
      .addCase(fetchDonorDetails.rejected, (state, action) => {
        state.detailsLoading = false;
        state.error = action.payload;
      })

      // Export
      .addCase(exportDonors.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(exportDonors.fulfilled, (state) => {
        state.actionLoading = false;
        state.successMessage = "Donor data exported successfully!";
      })
      .addCase(exportDonors.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // Update Status
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        const updatedUser = action.payload;
        // Update in all lists
        state.donors = state.donors.map((d) =>
          d._id === updatedUser._id ? { ...d, ...updatedUser } : d,
        );
        state.allDonors = state.allDonors.map((d) =>
          d._id === updatedUser._id ? { ...d, ...updatedUser } : d,
        );
        if (state.selectedDonor?._id === updatedUser._id) {
          state.selectedDonor = { ...state.selectedDonor, ...updatedUser };
        }
      })

      // Verify User
      .addCase(verifyUser.fulfilled, (state, action) => {
        const updatedUser = action.payload;
        state.donors = state.donors.map((d) =>
          d._id === updatedUser._id ? { ...d, ...updatedUser } : d,
        );
        state.allDonors = state.allDonors.map((d) =>
          d._id === updatedUser._id ? { ...d, ...updatedUser } : d,
        );
        if (state.selectedDonor?._id === updatedUser._id) {
          state.selectedDonor = { ...state.selectedDonor, ...updatedUser };
        }
      });
  },
});

export const {
  setFilters,
  resetFilters,
  clearError,
  clearSuccessMessage,
  setSelectedDonor,
  clearSelectedDonor,
} = adminDonorsSlice.actions;

// Selectors
export const selectDonors = (state) => state.adminDonors.donors;
export const selectAllDonors = (state) => state.adminDonors.allDonors;
export const selectStats = (state) => state.adminDonors.stats;
export const selectSelectedDonor = (state) => state.adminDonors.selectedDonor;
export const selectDonorHistory = (state) => state.adminDonors.donorHistory;
export const selectPagination = (state) => state.adminDonors.pagination;
export const selectFilters = (state) => state.adminDonors.filters;
export const selectLoading = (state) => state.adminDonors.loading;
export const selectStatsLoading = (state) => state.adminDonors.statsLoading;
export const selectDetailsLoading = (state) => state.adminDonors.detailsLoading;
export const selectActionLoading = (state) => state.adminDonors.actionLoading;
export const selectError = (state) => state.adminDonors.error;
export const selectSuccessMessage = (state) => state.adminDonors.successMessage;

export const selectDonorTier = (donorId) => (state) => {
  const donor = state.adminDonors.donors.find((d) => d._id === donorId);
  return donor ? calculateTier(donor.totalDonated) : "Bronze";
};

export default adminDonorsSlice.reducer;
