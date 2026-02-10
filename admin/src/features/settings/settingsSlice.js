// ============================================
// FILE: store/slices/settingsSlice.js
// ============================================
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with token interceptor
const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Async Thunks for Settings API Calls
export const fetchSettings = createAsyncThunk(
  'settings/fetchSettings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/settings');
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch settings');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'settings/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await api.put('/settings/profile', profileData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
    }
  }
);

export const uploadAvatar = createAsyncThunk(
  'settings/uploadAvatar',
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const response = await api.post('/settings/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to upload avatar');
    }
  }
);

export const removeAvatar = createAsyncThunk(
  'settings/removeAvatar',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.delete('/settings/avatar');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove avatar');
    }
  }
);

export const changePassword = createAsyncThunk(
  'settings/changePassword',
  async (passwordData, { rejectWithValue }) => {
    try {
      const response = await api.put('/settings/password', passwordData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to change password');
    }
  }
);

export const updateNotifications = createAsyncThunk(
  'settings/updateNotifications',
  async (notificationData, { rejectWithValue }) => {
    try {
      const response = await api.put('/settings/notifications', notificationData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update notifications');
    }
  }
);

export const updatePrivacy = createAsyncThunk(
  'settings/updatePrivacy',
  async (privacyData, { rejectWithValue }) => {
    try {
      const response = await api.put('/settings/privacy', privacyData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update privacy');
    }
  }
);

export const updatePreferences = createAsyncThunk(
  'settings/updatePreferences',
  async (preferencesData, { rejectWithValue }) => {
    try {
      const response = await api.put('/settings/preferences', preferencesData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update preferences');
    }
  }
);

export const updateSecurity = createAsyncThunk(
  'settings/updateSecurity',
  async (securityData, { rejectWithValue }) => {
    try {
      const response = await api.put('/settings/security', securityData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update security');
    }
  }
);

export const fetchActivityLog = createAsyncThunk(
  'settings/fetchActivityLog',
  async ({ page = 1, limit = 20 }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/settings/activity?page=${page}&limit=${limit}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch activity log');
    }
  }
);

export const deleteAccount = createAsyncThunk(
  'settings/deleteAccount',
  async (deleteData, { rejectWithValue }) => {
    try {
      const response = await api.delete('/settings/account', { data: deleteData });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete account');
    }
  }
);

// Initial State
const initialState = {
  settings: null,
  activityLog: { activities: [], pagination: {} },
  loading: false,
  uploading: false,
  error: null,
  saveStatus: '',
  usingMockData: false,
  mockData: {
    name: 'Sabo Ibadan Youth Charity Foundation',
    email: 'admin@saboyouthfoundation.org',
    phone: '+234 801 234 5678',
    bio: 'Empowering underprivileged youth in Sabo, Ibadan through education, health, and community programs.',
    avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&h=150&fit=crop&crop=face',
    verified: true,
    twoFactorEnabled: true,
    dateJoined: '2023-01-15T10:00:00Z',
    lastLogin: '2025-10-25T08:30:00Z',
    location: {
      address: 'Sabo Road, Mokola',
      city: 'Ibadan',
      state: 'Oyo',
      country: 'Nigeria'
    },
    preferences: {
      emailNotifications: {
        campaignUpdates: true,
        donationReceipts: true,
        eventReminders: true,
        weeklyDigest: true,
        marketingEmails: false
      },
      smsNotifications: {
        urgentAlerts: true,
        eventReminders: true,
        campaignMilestones: true
      },
      privacy: {
        profileVisibility: 'private',
        showDonations: false,
        showLocation: true,
        allowContact: false
      },
      language: 'en',
      currency: 'NGN',
      timezone: 'Africa/Lagos',
      theme: 'system'
    }
  }
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSaveStatus: (state, action) => {
      state.saveStatus = action.payload;
    },
    clearSaveStatus: (state) => {
      state.saveStatus = '';
    },
    setUsingMockData: (state, action) => {
      state.usingMockData = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Settings
      .addCase(fetchSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = action.payload;
        state.usingMockData = false;
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.usingMockData = true;
        state.settings = state.mockData; // Fallback to mock
      })
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        if (state.settings) {
          state.settings = { ...state.settings, ...action.payload };
        }
        state.saveStatus = 'success';
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.saveStatus = 'error';
      })
      // Upload Avatar
      .addCase(uploadAvatar.pending, (state) => {
        state.uploading = true;
        state.error = null;
      })
      .addCase(uploadAvatar.fulfilled, (state, action) => {
        state.uploading = false;
        if (state.settings) {
          state.settings.avatar = action.payload.avatar;
        }
        state.saveStatus = 'success';
      })
      .addCase(uploadAvatar.rejected, (state, action) => {
        state.uploading = false;
        state.error = action.payload;
        state.saveStatus = 'error';
      })
      // Remove Avatar
      .addCase(removeAvatar.pending, (state) => {
        state.uploading = true;
        state.error = null;
      })
      .addCase(removeAvatar.fulfilled, (state) => {
        state.uploading = false;
        if (state.settings) {
          state.settings.avatar = '';
        }
        state.saveStatus = 'success';
      })
      .addCase(removeAvatar.rejected, (state, action) => {
        state.uploading = false;
        state.error = action.payload;
        state.saveStatus = 'error';
      })
      // Change Password
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
        state.saveStatus = 'success';
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.saveStatus = 'error';
      })
      // Update Notifications
      .addCase(updateNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateNotifications.fulfilled, (state, action) => {
        state.loading = false;
        if (state.settings) {
          state.settings.preferences.emailNotifications = { ...state.settings.preferences.emailNotifications, ...action.payload.emailNotifications };
          state.settings.preferences.smsNotifications = { ...state.settings.preferences.smsNotifications, ...action.payload.smsNotifications };
        }
        state.saveStatus = 'success';
      })
      .addCase(updateNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.saveStatus = 'error';
      })
      // Update Privacy
      .addCase(updatePrivacy.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePrivacy.fulfilled, (state, action) => {
        state.loading = false;
        if (state.settings) {
          state.settings.privacy = { ...state.settings.privacy, ...action.payload };
        }
        state.saveStatus = 'success';
      })
      .addCase(updatePrivacy.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.saveStatus = 'error';
      })
      // Update Preferences
      .addCase(updatePreferences.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePreferences.fulfilled, (state, action) => {
        state.loading = false;
        if (state.settings) {
          state.settings.preferences = { ...state.settings.preferences, ...action.payload };
        }
        state.saveStatus = 'success';
      })
      .addCase(updatePreferences.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.saveStatus = 'error';
      })
      // Update Security
      .addCase(updateSecurity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSecurity.fulfilled, (state, action) => {
        state.loading = false;
        if (state.settings) {
          state.settings.twoFactorEnabled = action.payload.twoFactorEnabled;
        }
        state.saveStatus = 'success';
      })
      .addCase(updateSecurity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.saveStatus = 'error';
      })
      // Fetch Activity Log
      .addCase(fetchActivityLog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActivityLog.fulfilled, (state, action) => {
        state.loading = false;
        state.activityLog = action.payload;
      })
      .addCase(fetchActivityLog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Account
      .addCase(deleteAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAccount.fulfilled, (state) => {
        state.loading = false;
        state.saveStatus = 'success';
      })
      .addCase(deleteAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.saveStatus = 'error';
      });
  }
});

export const { clearError, setSaveStatus, clearSaveStatus, setUsingMockData } = settingsSlice.actions;
export default settingsSlice.reducer;