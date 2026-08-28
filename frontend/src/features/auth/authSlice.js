import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import apiClient from "../../config/apiConfig";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/auth/login", {
        email: email.toLowerCase(),
        password,
      });
      toast.success("Login successful!");
      return response.data.data;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Login failed";
      return rejectWithValue(message);
    }
  },
);

export const loginWithGoogle = createAsyncThunk(
  "auth/loginWithGoogle",
  async (credential, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/auth/google", { credential });
      toast.success("Login with Google successful!");
      return response.data.data;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Google login failed";
      return rejectWithValue(message);
    }
  },
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ fullName, email, password, phone }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/auth/register", {
        fullName,
        email,
        password,
        phone,
      });
      toast.success("Registration successful! Please verify your email.");
      return response.data.data;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Registration failed";
      return rejectWithValue(message);
    }
  },
);

export const restoreSession = createAsyncThunk(
  "auth/restoreSession",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/auth/me");
      return response.data.data;
    } catch {
      return rejectWithValue("No session");
    }
  },
);

export const loadUserFromStorage = restoreSession;

export const verifyEmail = createAsyncThunk(
  "auth/verifyEmail",
  async (token, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/auth/verify-email/${token}`);
      toast.success(response.data.message || "Email verified successfully!");
      return response.data.data;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Verification failed";
      return rejectWithValue(message);
    }
  },
);

export const resendVerification = createAsyncThunk(
  "auth/resendVerification",
  async (email, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/auth/resend-verification", {
        email,
      });
      toast.success(response.data.message || "Verification link sent!");
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to resend link";
      return rejectWithValue(message);
    }
  },
);

export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/auth/me");
      return response.data.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch user";
      return rejectWithValue(message);
    }
  },
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/auth/logout");
      toast.success("Logged out successfully");
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Logout failed";
      return rejectWithValue(message);
    }
  },
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/auth/forgot-password", { email });
      toast.success(response.data.message || "Password reset email sent!");
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to send reset email";
      return rejectWithValue(message);
    }
  },
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, password }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/auth/reset-password/${token}`, {
        password,
      });
      toast.success(response.data.message || "Password reset successful!");
      return response.data.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Password reset failed";
      return rejectWithValue(message);
    }
  },
);

export const clearError = createAsyncThunk("auth/clearError", async () => null);

const initialState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  sessionChecked: false,
};

const applyUser = (state, user) => {
  state.user = user;
  state.isAuthenticated = Boolean(user);
  state.sessionChecked = true;
  state.loading = false;
  state.error = null;
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.sessionChecked = true;
      toast("Logged out successfully");
    },
    clearSession: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.sessionChecked = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        applyUser(state, action.payload.user);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      .addCase(loginWithGoogle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        applyUser(state, action.payload.user);
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        applyUser(state, action.payload.user);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        applyUser(state, action.payload.user);
      })
      .addCase(restoreSession.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.sessionChecked = true;
      })
      .addCase(verifyEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        applyUser(state, action.payload.user);
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      .addCase(resendVerification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resendVerification.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resendVerification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        applyUser(state, action.payload.user);
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.sessionChecked = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.sessionChecked = true;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.sessionChecked = true;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        applyUser(state, action.payload.user);
      })
      .addCase(clearError.fulfilled, (state) => {
        state.error = null;
      });
  },
});

export const { logout, clearSession } = authSlice.actions;
export default authSlice.reducer;
