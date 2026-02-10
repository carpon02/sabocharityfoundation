// 📁 notificationsSlice.js
// ============================================
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// 🔹 Utility to simulate API delay
const mockApi = (fn, timeout = 500) =>
  new Promise((resolve, reject) =>
    setTimeout(() => {
      try {
        resolve(fn());
      } catch (err) {
        reject(err);
      }
    }, timeout)
  );

// Mock notifications storage
let MOCK_NOTIFICATIONS = [
  {
    id: "NOT-001",
    type: "campaign_update",
    title: "New Update on Clean Water Project",
    message: "Site survey has been completed for the Clean Water for Sabo Community campaign.",
    campaignId: "CAM-2024-001",
    read: false,
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "NOT-002",
    type: "donation_success",
    title: "Donation Successful",
    message: "Your donation was processed successfully. Thank you for your support!",
    campaignId: null,
    read: false,
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// 🔹 Fetch Notifications
export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (_, { rejectWithValue }) => {
    try {
      return await mockApi(() => {
        return [...MOCK_NOTIFICATIONS].sort((a, b) => new Date(b.date) - new Date(a.date));
      });
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch notifications");
    }
  }
);

// 🔹 Mark as Read
export const markAsRead = createAsyncThunk(
  "notifications/markAsRead",
  async (notificationId, { rejectWithValue }) => {
    try {
      return await mockApi(() => {
        const notification = MOCK_NOTIFICATIONS.find(n => n.id === notificationId);
        if (!notification) throw new Error("Notification not found");
        notification.read = true;
        return notificationId;
      });
    } catch (error) {
      return rejectWithValue(error.message || "Failed to mark as read");
    }
  }
);

// 🔹 Mark All as Read
export const markAllAsRead = createAsyncThunk(
  "notifications/markAllAsRead",
  async (_, { rejectWithValue }) => {
    try {
      return await mockApi(() => {
        MOCK_NOTIFICATIONS.forEach(n => n.read = true);
        return true;
      });
    } catch (error) {
      return rejectWithValue(error.message || "Failed to mark all as read");
    }
  }
);

// 🔹 Add Notification (for internal use)
export const addNotificationThunk = createAsyncThunk(
  "notifications/addNotification",
  async (notificationData, { rejectWithValue }) => {
    try {
      return await mockApi(() => {
        const newNotification = {
          id: `NOT-${String(MOCK_NOTIFICATIONS.length + 1).padStart(3, '0')}`,
          ...notificationData,
          read: false,
          date: new Date().toISOString()
        };
        MOCK_NOTIFICATIONS.unshift(newNotification);
        return newNotification;
      }, 200);
    } catch (error) {
      return rejectWithValue(error.message || "Failed to add notification");
    }
  }
);

const notificationsSlice = createSlice({
  name: "notifications",
  initialState: {
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null,
  },
  reducers: {
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      if (!action.payload.read) {
        state.unreadCount += 1;
      }
    },
    clearError: (state) => {
      state.error = null;
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
      // Fetch Notifications
      .addCase(fetchNotifications.pending, handlePending)
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
        state.unreadCount = action.payload.filter(n => !n.read).length;
      })
      .addCase(fetchNotifications.rejected, handleRejected)
      
      // Mark as Read
      .addCase(markAsRead.pending, handlePending)
      .addCase(markAsRead.fulfilled, (state, action) => {
        state.loading = false;
        const notification = state.notifications.find(n => n.id === action.payload);
        if (notification && !notification.read) {
          notification.read = true;
          state.unreadCount -= 1;
        }
      })
      .addCase(markAsRead.rejected, handleRejected)
      
      // Mark All as Read
      .addCase(markAllAsRead.pending, handlePending)
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.loading = false;
        state.notifications.forEach(n => n.read = true);
        state.unreadCount = 0;
      })
      .addCase(markAllAsRead.rejected, handleRejected)
      
      // Add Notification
      .addCase(addNotificationThunk.fulfilled, (state, action) => {
        state.notifications.unshift(action.payload);
        state.unreadCount += 1;
      });
  },
});

export const { addNotification, clearError: clearNotificationsError } = notificationsSlice.actions;
export default notificationsSlice.reducer;
