import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import volunteerService from "../../services/volunteerService";

// Submit volunteer application
export const submitVolunteerApplication = createAsyncThunk(
  "volunteer/submit",
  async (applicationData, { rejectWithValue }) => {
    try {
      const data = await volunteerService.submitApplication(applicationData);
      return data.data || data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to submit application"
      );
    }
  }
);

// Fetch all volunteers (admin)
export const fetchAllVolunteers = createAsyncThunk(
  "volunteer/fetchAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await volunteerService.getAllVolunteers(params);
      return data.data || data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch volunteers"
      );
    }
  }
);

// Fetch volunteer by ID (admin)
export const fetchVolunteerById = createAsyncThunk(
  "volunteer/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const data = await volunteerService.getVolunteerById(id);
      return data.data || data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch volunteer"
      );
    }
  }
);

// Update volunteer (admin)
export const updateVolunteer = createAsyncThunk(
  "volunteer/update",
  async ({ id, updateData }, { rejectWithValue }) => {
    try {
      const data = await volunteerService.updateVolunteer(id, updateData);
      return data.data || data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to update volunteer"
      );
    }
  }
);

// Delete volunteer (admin)
export const deleteVolunteer = createAsyncThunk(
  "volunteer/delete",
  async (id, { rejectWithValue }) => {
    try {
      await volunteerService.deleteVolunteer(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to delete volunteer"
      );
    }
  }
);

// Approve volunteer (admin)
export const approveVolunteer = createAsyncThunk(
  "volunteer/approve",
  async (id, { rejectWithValue }) => {
    try {
      const data = await volunteerService.approveVolunteer(id);
      return data.data || data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to approve volunteer"
      );
    }
  }
);

// Reject volunteer (admin)
export const rejectVolunteer = createAsyncThunk(
  "volunteer/reject",
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      const data = await volunteerService.rejectVolunteer(id, reason);
      return data.data || data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to reject volunteer"
      );
    }
  }
);

// Log volunteer activity (admin)
export const logVolunteerActivity = createAsyncThunk(
  "volunteer/logActivity",
  async ({ id, activityData }, { rejectWithValue }) => {
    try {
      const data = await volunteerService.logActivity(id, activityData);
      return { id, activity: data.data || data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to log activity"
      );
    }
  }
);

const initialState = {
  volunteers: [],
  selectedVolunteer: null,
  applicationSubmitted: false,
  loading: false,
  error: null,
};

const volunteerSlice = createSlice({
  name: "volunteer",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedVolunteer: (state) => {
      state.selectedVolunteer = null;
    },
    resetApplicationStatus: (state) => {
      state.applicationSubmitted = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Submit application
      .addCase(submitVolunteerApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.applicationSubmitted = false;
      })
      .addCase(submitVolunteerApplication.fulfilled, (state) => {
        state.loading = false;
        state.applicationSubmitted = true;
      })
      .addCase(submitVolunteerApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.applicationSubmitted = false;
      })
      // Fetch all volunteers
      .addCase(fetchAllVolunteers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllVolunteers.fulfilled, (state, action) => {
        state.loading = false;
        state.volunteers = action.payload.volunteers || action.payload;
      })
      .addCase(fetchAllVolunteers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch volunteer by ID
      .addCase(fetchVolunteerById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVolunteerById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedVolunteer = action.payload.volunteer || action.payload;
      })
      .addCase(fetchVolunteerById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update volunteer
      .addCase(updateVolunteer.fulfilled, (state, action) => {
        const updated = action.payload.volunteer || action.payload;
        const index = state.volunteers.findIndex(
          (v) => v._id === updated._id || v.id === updated.id
        );
        if (index !== -1) {
          state.volunteers[index] = updated;
        }
        if (state.selectedVolunteer) {
          state.selectedVolunteer = updated;
        }
      })
      // Delete volunteer
      .addCase(deleteVolunteer.fulfilled, (state, action) => {
        state.volunteers = state.volunteers.filter(
          (v) => v._id !== action.payload && v.id !== action.payload
        );
      })
      // Approve volunteer
      .addCase(approveVolunteer.fulfilled, (state, action) => {
        const approved = action.payload.volunteer || action.payload;
        const index = state.volunteers.findIndex(
          (v) => v._id === approved._id || v.id === approved.id
        );
        if (index !== -1) {
          state.volunteers[index] = approved;
        }
      })
      // Reject volunteer
      .addCase(rejectVolunteer.fulfilled, (state, action) => {
        const rejected = action.payload.volunteer || action.payload;
        const index = state.volunteers.findIndex(
          (v) => v._id === rejected._id || v.id === rejected.id
        );
        if (index !== -1) {
          state.volunteers[index] = rejected;
        }
      })
      // Log activity
      .addCase(logVolunteerActivity.fulfilled, (state, action) => {
        const { id, activity } = action.payload;
        const volunteer = state.volunteers.find(
          (v) => v._id === id || v.id === id
        );
        if (volunteer && volunteer.activities) {
          volunteer.activities.push(activity);
        }
      });
  },
});

export const { clearError, clearSelectedVolunteer, resetApplicationStatus } =
  volunteerSlice.actions;
export default volunteerSlice.reducer;
