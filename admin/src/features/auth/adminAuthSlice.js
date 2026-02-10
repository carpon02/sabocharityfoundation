import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import apiClient from "../../config/apiConfig";

// =============== ADMIN LOGIN ===============
export const loginAdmin = createAsyncThunk(
  "adminAuth/loginAdmin",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/auth/login", {
        email: email.toLowerCase(),
        password,
      });

      const data = response.data;

      // ✅ CHECK IF USER IS ADMIN
      if (data.data.user.role !== "admin") {
        return rejectWithValue(
          `Access denied. Admin credentials required to steward our shared mission.`,
        );
      }

      // Store in localStorage with admin prefix
      localStorage.setItem("adminToken", data.data.token);
      localStorage.setItem("adminUser", JSON.stringify(data.data.user));

      toast.success(
        `Welcome back, ${data.data.user.fullName}! Together, we uplift the underprivileged.`,
      );
      return data.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        `Network hiccup—our connection to impact persists.`;
      return rejectWithValue(message);
    }
  },
);

// =============== LOAD ADMIN FROM STORAGE ===============
export const loadAdminFromStorage = createAsyncThunk(
  "adminAuth/loadAdminFromStorage",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("adminToken");
      const user = localStorage.getItem("adminUser");

      if (!token || !user) {
        return rejectWithValue(
          "No admin data found—log in to continue our work.",
        );
      }

      const parsedUser = JSON.parse(user);

      // Verify user is still admin
      if (parsedUser.role !== "admin") {
        localStorage.clear();
        return rejectWithValue("Invalid admin session—renew your stewardship.");
      }

      return { token, user: parsedUser };
    } catch (error) {
      localStorage.clear();
      return rejectWithValue(
        `Failed to load admin—let's reconnect with purpose.`,
      );
    }
  },
);

// =============== LOGOUT ADMIN ===============
export const logoutAdmin = createAsyncThunk(
  "adminAuth/logoutAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/auth/logout");

      // Clear localStorage
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");
      localStorage.removeItem("persist:adminAuth");

      toast.success("Logged out with grace—rest, then return to empower.");
      return response.data;
    } catch (error) {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");
      localStorage.removeItem("persist:adminAuth");
      const message =
        error.response?.data?.message ||
        error.message ||
        "Network farewell—safe journeys.";
      return rejectWithValue(message);
    }
  },
);

// =============== GET CURRENT ADMIN ===============
export const getCurrentAdmin = createAsyncThunk(
  "adminAuth/getCurrentAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/auth/me");
      const data = response.data;

      // Verify still admin
      if (data.data.user.role !== "admin") {
        localStorage.clear();
        return rejectWithValue(
          "Admin access renewed—welcome back to stewardship.",
        );
      }

      localStorage.setItem("adminUser", JSON.stringify(data.data.user));
      return data.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Connection to mission paused—retry with heart.";
      return rejectWithValue(message);
    }
  },
);

// =============== INITIAL STATE ===============
const initialState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

// =============== SLICE ===============
const adminAuthSlice = createSlice({
  name: "adminAuth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })

      // LOAD FROM STORAGE
      .addCase(loadAdminFromStorage.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true;
        }
      })
      .addCase(loadAdminFromStorage.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })

      // LOGOUT
      .addCase(logoutAdmin.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })

      // GET CURRENT ADMIN
      .addCase(getCurrentAdmin.fulfilled, (state, action) => {
        state.user = action.payload.user;
      })
      .addCase(getCurrentAdmin.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        localStorage.clear();
      });
  },
});

export const { clearError } = adminAuthSlice.actions;

// ✅ Export selector for token access
export const selectAdminToken = (state) => state.adminAuth.token;

export default adminAuthSlice.reducer;
