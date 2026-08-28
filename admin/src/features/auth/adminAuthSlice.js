import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import apiClient from "../../config/apiConfig";

export const loginAdmin = createAsyncThunk(
  "adminAuth/loginAdmin",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/auth/login", {
        email: email.toLowerCase(),
        password,
      });

      const user = response.data.data.user;
      if (user.role !== "admin") {
        await apiClient.post("/auth/logout").catch(() => {});
        return rejectWithValue(
          "Access denied. Admin credentials required to steward our shared mission.",
        );
      }

      toast.success(
        `Welcome back, ${user.fullName}! Together, we uplift the underprivileged.`,
      );
      return response.data.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Network hiccup—our connection to impact persists.";
      return rejectWithValue(message);
    }
  },
);

export const restoreAdminSession = createAsyncThunk(
  "adminAuth/restoreAdminSession",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/auth/me");
      const user = response.data.data.user;
      if (user.role !== "admin") {
        return rejectWithValue("Not an admin session");
      }
      return response.data.data;
    } catch {
      return rejectWithValue("No admin session");
    }
  },
);

export const loadAdminFromStorage = restoreAdminSession;

export const logoutAdmin = createAsyncThunk(
  "adminAuth/logoutAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/auth/logout");
      toast.success("Logged out with grace—rest, then return to empower.");
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Network farewell—safe journeys.";
      return rejectWithValue(message);
    }
  },
);

export const getCurrentAdmin = createAsyncThunk(
  "adminAuth/getCurrentAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/auth/me");
      if (response.data.data.user.role !== "admin") {
        return rejectWithValue("Admin access required");
      }
      return response.data.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Connection to mission paused—retry with heart.";
      return rejectWithValue(message);
    }
  },
);

const initialState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  sessionChecked: false,
};

const applyAdmin = (state, user) => {
  state.user = user;
  state.isAuthenticated = user?.role === "admin";
  state.sessionChecked = true;
  state.loading = false;
  state.error = null;
};

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
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        applyAdmin(state, action.payload.user);
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.sessionChecked = true;
        state.error = action.payload;
        toast.error(action.payload);
      })
      .addCase(restoreAdminSession.fulfilled, (state, action) => {
        applyAdmin(state, action.payload.user);
      })
      .addCase(restoreAdminSession.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.sessionChecked = true;
      })
      .addCase(logoutAdmin.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.sessionChecked = true;
      })
      .addCase(logoutAdmin.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.sessionChecked = true;
      })
      .addCase(getCurrentAdmin.fulfilled, (state, action) => {
        applyAdmin(state, action.payload.user);
      })
      .addCase(getCurrentAdmin.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.sessionChecked = true;
      });
  },
});

export const { clearError } = adminAuthSlice.actions;
export const selectAdminToken = () => null;
export default adminAuthSlice.reducer;
