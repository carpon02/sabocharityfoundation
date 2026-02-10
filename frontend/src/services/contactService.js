import apiClient from "../config/apiConfig";

/**
 * Submit contact form (public)
 */
const submitContactForm = async (contactData) => {
  const response = await apiClient.post("/contact/submit-form", contactData);
  return response.data;
};

/**
 * Get all contact messages (admin only)
 */
const getAllContacts = async (params = {}) => {
  const response = await apiClient.get("/contact", { params });
  return response.data;
};

/**
 * Get single contact message by ID (admin only)
 */
const getContactById = async (id) => {
  const response = await apiClient.get(`/contact/${id}`);
  return response.data;
};

/**
 * Mark contact as read (admin only)
 */
const markAsRead = async (id) => {
  const response = await apiClient.patch(`/contact/${id}/read`, {});
  return response.data;
};

/**
 * Reply to contact (admin only)
 */
const replyToContact = async (id, replyData) => {
  const response = await apiClient.patch(`/contact/${id}/reply`, replyData);
  return response.data;
};

/**
 * Delete contact message (admin only)
 */
const deleteContact = async (id) => {
  const response = await apiClient.delete(`/contact/${id}`);
  return response.data;
};

export default {
  submitContactForm,
  getAllContacts,
  getContactById,
  markAsRead,
  replyToContact,
  deleteContact,
};
