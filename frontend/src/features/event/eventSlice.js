// src/redux/slices/eventSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../config/apiConfig";

// ============ ASYNC THUNKS ============

// Get all events (with filters)
export const getAllEvents = createAsyncThunk(
  "events/getAllEvents",
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await apiClient.get(`/events?${queryString}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch events",
      );
    }
  },
);

// Get upcoming events
export const getUpcomingEvents = createAsyncThunk(
  "events/getUpcomingEvents",
  async (limit = 10, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(
        `/events/upcoming?limit=${limit}`,
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch upcoming events",
      );
    }
  },
);

// Get past events
export const getPastEvents = createAsyncThunk(
  "events/getPastEvents",
  async (limit = 10, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/events/past?limit=${limit}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch past events",
      );
    }
  },
);

// Get single event by ID
export const getEventById = createAsyncThunk(
  "events/getEventById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/events/${id}`);
      return response.data.data.event;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch event details",
      );
    }
  },
);

// Get event by slug
export const getEventBySlug = createAsyncThunk(
  "events/getEventBySlug",
  async (slug, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/events/slug/${slug}`);
      return response.data.data.event;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Event not found",
      );
    }
  },
);

// Create new event (admin only)
export const createEvent = createAsyncThunk(
  "events/createEvent",
  async (eventData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`/events/create-event`, eventData);
      return response.data.data.event;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create event",
      );
    }
  },
);

// Update event (admin only)
export const updateEvent = createAsyncThunk(
  "events/updateEvent",
  async ({ id, eventData }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/events/${id}`, eventData);
      return response.data.data.event;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update event",
      );
    }
  },
);

// Delete event (admin only)
export const deleteEvent = createAsyncThunk(
  "events/deleteEvent",
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete(`/events/${id}`);
      return { id, message: response.data.message };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete event",
      );
    }
  },
);

// Add speaker to event (admin only)
export const addSpeaker = createAsyncThunk(
  "events/addSpeaker",
  async ({ id, speakerData }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(
        `/events/${id}/speakers`,
        speakerData,
      );
      return response.data.data.event;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add speaker",
      );
    }
  },
);

// Add agenda item to event (admin only)
export const addAgendaItem = createAsyncThunk(
  "events/addAgendaItem",
  async ({ id, agendaData }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(
        `/events/${id}/agenda`,
        agendaData,
      );
      return response.data.data.event;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add agenda item",
      );
    }
  },
);

// Register for event (authenticated or guest)
export const registerForEvent = createAsyncThunk(
  "events/registerForEvent",
  async ({ eventId, registrationData }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(
        `/events/${eventId}/register`,
        registrationData,
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to register for event",
      );
    }
  },
);

// Cancel event registration (authenticated users only)
export const cancelEventRegistration = createAsyncThunk(
  "events/cancelEventRegistration",
  async (eventId, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete(`/events/${eventId}/register`);
      return { eventId, message: response.data.message };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to cancel registration",
      );
    }
  },
);

// Get user's registered events (authenticated users only)
export const getUserRegisteredEvents = createAsyncThunk(
  "events/getUserRegisteredEvents",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/events/user/registered`);
      return response.data.data.events || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch registered events",
      );
    }
  },
);

// ============ INITIAL STATE ============
const initialState = {
  events: [],
  upcomingEvents: [],
  pastEvents: [],
  userRegisteredEvents: [],
  selectedEvent: null,
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  },
  filters: {
    search: "",
    category: "",
    time: "", // 'upcoming', 'past', 'ongoing'
    featured: false,
    status: "published",
  },
  loading: false,
  error: null,
  registrationLoading: false,
  registrationSuccess: false,
  registrationError: null,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
  userEventsLoading: false,
};

// ============ SLICE ============
const eventSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    // Set filters
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },

    // Reset filters
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },

    // Clear selected event
    clearSelectedEvent: (state) => {
      state.selectedEvent = null;
    },

    // Clear registration status
    clearRegistrationStatus: (state) => {
      state.registrationSuccess = false;
      state.registrationError = null;
    },

    // Clear errors
    clearErrors: (state) => {
      state.error = null;
      state.registrationError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ============ GET ALL EVENTS ============
      .addCase(getAllEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload.events;
        state.pagination = action.payload.pagination;
      })
      .addCase(getAllEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ============ GET UPCOMING EVENTS ============
      .addCase(getUpcomingEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUpcomingEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.upcomingEvents = action.payload.events;
      })
      .addCase(getUpcomingEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ============ GET PAST EVENTS ============
      .addCase(getPastEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPastEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.pastEvents = action.payload.events;
      })
      .addCase(getPastEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ============ GET EVENT BY ID ============
      .addCase(getEventById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEventById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedEvent = action.payload;
      })
      .addCase(getEventById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ============ GET EVENT BY SLUG ============
      .addCase(getEventBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEventBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedEvent = action.payload;
      })
      .addCase(getEventBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ============ CREATE EVENT ============
      .addCase(createEvent.pending, (state) => {
        state.createLoading = true;
        state.error = null;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.createLoading = false;
        state.events.push(action.payload); // Add to list
        state.selectedEvent = action.payload;
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload;
      })

      // ============ UPDATE EVENT ============
      .addCase(updateEvent.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.selectedEvent = action.payload;
        const eventIndex = state.events.findIndex(
          (e) => e._id === action.payload._id,
        );
        if (eventIndex !== -1) {
          state.events[eventIndex] = action.payload;
        }
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
      })

      // ============ DELETE EVENT ============
      .addCase(deleteEvent.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.events = state.events.filter((e) => e._id !== action.payload.id);
        if (state.selectedEvent?._id === action.payload.id) {
          state.selectedEvent = null;
        }
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload;
      })

      // ============ ADD SPEAKER ============
      .addCase(addSpeaker.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addSpeaker.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedEvent = action.payload;
        const eventIndex = state.events.findIndex(
          (e) => e._id === action.payload._id,
        );
        if (eventIndex !== -1) {
          state.events[eventIndex] = action.payload;
        }
      })
      .addCase(addSpeaker.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ============ ADD AGENDA ITEM ============
      .addCase(addAgendaItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addAgendaItem.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedEvent = action.payload;
        const eventIndex = state.events.findIndex(
          (e) => e._id === action.payload._id,
        );
        if (eventIndex !== -1) {
          state.events[eventIndex] = action.payload;
        }
      })
      .addCase(addAgendaItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ============ REGISTER FOR EVENT ============
      .addCase(registerForEvent.pending, (state) => {
        state.registrationLoading = true;
        state.registrationError = null;
        state.registrationSuccess = false;
      })
      .addCase(registerForEvent.fulfilled, (state, action) => {
        state.registrationLoading = false;
        state.registrationSuccess = true;
        // Update selected event if it matches
        if (state.selectedEvent?._id === action.payload.event?._id) {
          state.selectedEvent = action.payload.event;
        }
        // Update event in events list
        const eventIndex = state.events.findIndex(
          (e) => e._id === action.payload.event?._id,
        );
        if (eventIndex !== -1) {
          state.events[eventIndex] = action.payload.event;
        }
      })
      .addCase(registerForEvent.rejected, (state, action) => {
        state.registrationLoading = false;
        state.registrationError = action.payload;
      })

      // ============ CANCEL EVENT REGISTRATION ============
      .addCase(cancelEventRegistration.pending, (state) => {
        state.registrationLoading = true;
        state.registrationError = null;
      })
      .addCase(cancelEventRegistration.fulfilled, (state, action) => {
        state.registrationLoading = false;
        state.registrationSuccess = true;
        // Clear selected event or refetch to update attendee list
        if (state.selectedEvent?._id === action.payload.eventId) {
          state.selectedEvent = null;
        }
      })
      .addCase(cancelEventRegistration.rejected, (state, action) => {
        state.registrationLoading = false;
        state.registrationError = action.payload;
      })
      // ============ GET USER REGISTERED EVENTS ============
      .addCase(getUserRegisteredEvents.pending, (state) => {
        state.userEventsLoading = true;
        state.error = null;
      })
      .addCase(getUserRegisteredEvents.fulfilled, (state, action) => {
        state.userEventsLoading = false;
        state.userRegisteredEvents = action.payload;
      })
      .addCase(getUserRegisteredEvents.rejected, (state, action) => {
        state.userEventsLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setFilters,
  resetFilters,
  clearSelectedEvent,
  clearRegistrationStatus,
  clearErrors,
} = eventSlice.actions;

export default eventSlice.reducer;
