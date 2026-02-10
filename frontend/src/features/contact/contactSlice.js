import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import contactService from "../../services/contactService";

// Submit contact form
export const submitContactForm = createAsyncThunk(
  "contact/submit",
  async (contactData, { rejectWithValue }) => {
    try {
      const data = await contactService.submitContactForm(contactData);
      return data.data || data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to submit contact form"
      );
    }
  }
);

// Fetch all contacts (admin)
export const fetchAllContacts = createAsyncThunk(
  "contact/fetchAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await contactService.getAllContacts(params);
      return data.data || data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch contacts"
      );
    }
  }
);

// Fetch contact by ID (admin)
export const fetchContactById = createAsyncThunk(
  "contact/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const data = await contactService.getContactById(id);
      return data.data || data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch contact"
      );
    }
  }
);

// Mark contact as read (admin)
export const markContactAsRead = createAsyncThunk(
  "contact/markAsRead",
  async (id, { rejectWithValue }) => {
    try {
      const data = await contactService.markAsRead(id);
      return data.data || data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to mark as read"
      );
    }
  }
);

// Reply to contact (admin)
export const replyToContact = createAsyncThunk(
  "contact/reply",
  async ({ id, replyData }, { rejectWithValue }) => {
    try {
      const data = await contactService.replyToContact(id, replyData);
      return data.data || data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to reply to contact"
      );
    }
  }
);

// Delete contact (admin)
export const deleteContact = createAsyncThunk(
  "contact/delete",
  async (id, { rejectWithValue }) => {
    try {
      await contactService.deleteContact(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to delete contact"
      );
    }
  }
);

const initialState = {
  contacts: [],
  selectedContact: null,
  formSubmitted: false,
  loading: false,
  error: null,
};

const contactSlice = createSlice({
  name: "contact",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedContact: (state) => {
      state.selectedContact = null;
    },
    resetFormStatus: (state) => {
      state.formSubmitted = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Submit contact form
      .addCase(submitContactForm.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.formSubmitted = false;
      })
      .addCase(submitContactForm.fulfilled, (state) => {
        state.loading = false;
        state.formSubmitted = true;
      })
      .addCase(submitContactForm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.formSubmitted = false;
      })
      // Fetch all contacts
      .addCase(fetchAllContacts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllContacts.fulfilled, (state, action) => {
        state.loading = false;
        state.contacts = action.payload.contacts || action.payload;
      })
      .addCase(fetchAllContacts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch contact by ID
      .addCase(fetchContactById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContactById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedContact = action.payload.contact || action.payload;
      })
      .addCase(fetchContactById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Mark as read
      .addCase(markContactAsRead.fulfilled, (state, action) => {
        const updated = action.payload.contact || action.payload;
        const index = state.contacts.findIndex(
          (c) => c._id === updated._id || c.id === updated.id
        );
        if (index !== -1) {
          state.contacts[index] = updated;
        }
        if (state.selectedContact) {
          state.selectedContact = updated;
        }
      })
      // Reply to contact
      .addCase(replyToContact.fulfilled, (state, action) => {
        const updated = action.payload.contact || action.payload;
        const index = state.contacts.findIndex(
          (c) => c._id === updated._id || c.id === updated.id
        );
        if (index !== -1) {
          state.contacts[index] = updated;
        }
        if (state.selectedContact) {
          state.selectedContact = updated;
        }
      })
      // Delete contact
      .addCase(deleteContact.fulfilled, (state, action) => {
        state.contacts = state.contacts.filter(
          (c) => c._id !== action.payload && c.id !== action.payload
        );
      });
  },
});

export const { clearError, clearSelectedContact, resetFormStatus } =
  contactSlice.actions;
export default contactSlice.reducer;
