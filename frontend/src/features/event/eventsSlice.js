import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import eventsService from "../../services/eventsService";

// Fetch all events
export const fetchAllEvents = createAsyncThunk(
  "events/fetchAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await eventsService.getAllEvents(params);
      return data.data || data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch events"
      );
    }
  }
);

// Fetch upcoming events
export const fetchUpcomingEvents = createAsyncThunk(
  "events/fetchUpcoming",
  async (_, { rejectWithValue }) => {
    try {
      const data = await eventsService.getUpcomingEvents();
      return data.data || data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch upcoming events"
      );
    }
  }
);

// Fetch past events
export const fetchPastEvents = createAsyncThunk(
  "events/fetchPast",
  async (_, { rejectWithValue }) => {
    try {
      const data = await eventsService.getPastEvents();
      return data.data || data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch past events"
      );
    }
  }
);

// Fetch single event by ID
export const fetchEventById = createAsyncThunk(
  "events/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const data = await eventsService.getEventById(id);
      return data.data || data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch event"
      );
    }
  }
);

// Fetch event by slug
export const fetchEventBySlug = createAsyncThunk(
  "events/fetchBySlug",
  async (slug, { rejectWithValue }) => {
    try {
      const data = await eventsService.getEventBySlug(slug);
      return data.data || data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch event"
      );
    }
  }
);

// Register for event
export const registerForEvent = createAsyncThunk(
  "events/register",
  async ({ id, registrationData }, { rejectWithValue }) => {
    try {
      const data = await eventsService.registerForEvent(id, registrationData);
      return { id, data: data.data || data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to register for event"
      );
    }
  }
);

// Cancel registration
export const cancelEventRegistration = createAsyncThunk(
  "events/cancelRegistration",
  async (id, { rejectWithValue }) => {
    try {
      await eventsService.cancelRegistration(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to cancel registration"
      );
    }
  }
);

const initialState = {
  events: [],
  upcomingEvents: [],
  pastEvents: [],
  selectedEvent: null,
  loading: false,
  error: null,
};

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedEvent: (state) => {
      state.selectedEvent = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all events
      .addCase(fetchAllEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload.events || action.payload;
      })
      .addCase(fetchAllEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch upcoming events
      .addCase(fetchUpcomingEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUpcomingEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.upcomingEvents = action.payload.events || action.payload;
      })
      .addCase(fetchUpcomingEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch past events
      .addCase(fetchPastEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPastEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.pastEvents = action.payload.events || action.payload;
      })
      .addCase(fetchPastEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch event by ID
      .addCase(fetchEventById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedEvent = action.payload.event || action.payload;
      })
      .addCase(fetchEventById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch event by slug
      .addCase(fetchEventBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEventBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedEvent = action.payload.event || action.payload;
      })
      .addCase(fetchEventBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register for event
      .addCase(registerForEvent.fulfilled, (state, action) => {
        const { id, data } = action.payload;
        // Update the event in the events array
        const eventIndex = state.events.findIndex(
          (e) => e._id === id || e.id === id
        );
        if (eventIndex !== -1) {
          state.events[eventIndex] = data.event || data;
        }
        // Update selected event if it's the same
        if (
          state.selectedEvent &&
          (state.selectedEvent._id === id || state.selectedEvent.id === id)
        ) {
          state.selectedEvent = data.event || data;
        }
      })
      // Cancel registration
      .addCase(cancelEventRegistration.fulfilled, (state, action) => {
        const id = action.payload;
        // Update the event in the events array
        const eventIndex = state.events.findIndex(
          (e) => e._id === id || e.id === id
        );
        if (eventIndex !== -1 && state.events[eventIndex].registrations) {
          // Remove user from registrations (this would need user ID from state)
          // For now, just mark as updated
          state.events[eventIndex].isRegistered = false;
        }
        // Update selected event if it's the same
        if (
          state.selectedEvent &&
          (state.selectedEvent._id === id || state.selectedEvent.id === id)
        ) {
          state.selectedEvent.isRegistered = false;
        }
      });
  },
});

export const { clearError, clearSelectedEvent } = eventsSlice.actions;
export default eventsSlice.reducer;
