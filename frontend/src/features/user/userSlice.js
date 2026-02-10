// 📁 userSlice.js
// ============================================
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// 🔹 Utility to simulate API delay
const mockApi = (fn, timeout = 800) =>
  new Promise((resolve, reject) =>
    setTimeout(() => {
      try {
        resolve(fn());
      } catch (err) {
        reject(err);
      }
    }, timeout)
  );

// Mock user profile storage
let MOCK_USER_PROFILE = null;

// 🔹 Fetch User Profile
export const fetchUserProfile = createAsyncThunk(
  "user/fetchUserProfile",
  async (_, { rejectWithValue, getState }) => {
    try {
      return await mockApi(() => {
        const { auth } = getState();
        if (!auth.user) throw new Error("User not authenticated");
        
        if (!MOCK_USER_PROFILE) {
          MOCK_USER_PROFILE = {
            name: auth.user.name,
            email: auth.user.email,
            phone: "+234 803 123 4567",
            location: "Sabo, Ibadan",
            joinedDate: new Date().toISOString(),
            totalDonations: 0,
            campaignsSupported: 0,
            avatar: null
          };
        }
        
        return MOCK_USER_PROFILE;
      });
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch profile");
    }
  }
);

// 🔹 Update User Profile
export const updateUserProfile = createAsyncThunk(
  "user/updateUserProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      return await mockApi(() => {
        if (!MOCK_USER_PROFILE) throw new Error("Profile not found");
        
        MOCK_USER_PROFILE = {
          ...MOCK_USER_PROFILE,
          ...profileData,
          updatedAt: new Date().toISOString()
        };
        
        return MOCK_USER_PROFILE;
      });
    } catch (error) {
      return rejectWithValue(error.message || "Failed to update profile");
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    profile: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearProfile: (state) => {
      state.profile = null;
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
      // Fetch Profile
      .addCase(fetchUserProfile.pending, handlePending)
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, handleRejected)
      
      // Update Profile
      .addCase(updateUserProfile.pending, handlePending)
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(updateUserProfile.rejected, handleRejected);
  },
});

export const { clearError: clearUserError, clearProfile } = userSlice.actions;
export default userSlice.reducer;
