// features/auth/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import apiClient from "../../config/apiConfig";

// =============== LOGIN ===============
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/auth/login", {
        email: email.toLowerCase(),
        password,
      });

      const { token, user } = response.data.data;

      // Store in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      toast.success("Login successful!");
      return { token, user };
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Login failed";
      return rejectWithValue(message);
    }
  }
);

// =============== REGISTER ===============
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

      const { token, user } = response.data.data;

      // Store in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      toast.success("Registration successful! Please verify your email.");
      return { token, user };
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Registration failed";
      return rejectWithValue(message);
    }
  }
);

// =============== LOAD USER FROM STORAGE ===============
export const loadUserFromStorage = createAsyncThunk(
  "auth/loadUserFromStorage",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");

      if (!token || !user) {
        return rejectWithValue("No user data found");
      }

      return { token, user: JSON.parse(user) };
    } catch {
      localStorage.clear();
      return rejectWithValue("Failed to load user");
    }
  }
);

// =============== VERIFY EMAIL (via token in URL) ===============
export const verifyEmail = createAsyncThunk(
  "auth/verifyEmail",
  async (token, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/auth/verify-email/${token}`);
      const { user, token: sessionToken } = response.data.data;

      // Update in localStorage
      localStorage.setItem("token", sessionToken);
      localStorage.setItem("user", JSON.stringify(user));

      toast.success(response.data.message || "Email verified successfully!");
      return { user, token: sessionToken };
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Verification failed";
      return rejectWithValue(message);
    }
  }
);

// =============== RESEND VERIFICATION ===============
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
  }
);

// =============== GET CURRENT USER ===============
export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/auth/me");

      // Update localStorage
      localStorage.setItem("user", JSON.stringify(response.data.data.user));

      return response.data.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch user";
      return rejectWithValue(message);
    }
  }
);

// =============== LOGOUT ===============
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/auth/logout");

      localStorage.clear();
      toast.success("Logged out successfully");
      return response.data;
    } catch (error) {
      // Clear localStorage even if API call fails
      localStorage.clear();
      const message =
        error.response?.data?.message || error.message || "Logout failed";
      return rejectWithValue(message);
    }
  }
);

// =============== FORGOT PASSWORD ===============
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
  }
);

// =============== RESET PASSWORD ===============
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, password }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/auth/reset-password/${token}`, {
        password,
      });

      const { token: newToken, user } = response.data.data;

      // Store new token and user
      localStorage.setItem("token", newToken);
      localStorage.setItem("user", JSON.stringify(user));

      toast.success(response.data.message || "Password reset successful!");
      return { token: newToken, user };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Password reset failed";
      return rejectWithValue(message);
    }
  }
);

// =============== CLEAR ERROR ===============
export const clearError = createAsyncThunk("auth/clearError", async () => null);

// =============== INITIAL STATE ===============
const initialState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

// =============== SLICE ===============
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.clear();
      toast("Logged out successfully");
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })

      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })

      // LOAD USER FROM STORAGE
      .addCase(loadUserFromStorage.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true;
        }
      })
      .addCase(loadUserFromStorage.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })

      // VERIFY EMAIL
      .addCase(verifyEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })

      // RESEND VERIFICATION
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

      // GET CURRENT USER
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        localStorage.clear();
      })

      // LOGOUT
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })

      // RESET PASSWORD
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })

      // CLEAR ERROR
      .addCase(clearError.fulfilled, (state) => {
        state.error = null;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
