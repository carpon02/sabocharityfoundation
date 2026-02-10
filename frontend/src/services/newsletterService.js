import apiClient from "../config/apiConfig";

/**
 * Subscribe to newsletter (public)
 */
const subscribe = async (email) => {
  const response = await apiClient.post("/newsletters/subscribe", { email });
  return response.data;
};

/**
 * Unsubscribe from newsletter (public)
 */
const unsubscribe = async (email) => {
  const response = await apiClient.patch("/newsletters/unsubscribe", { email });
  return response.data;
};

/**
 * Get all subscribers (admin only)
 */
const getAllSubscribers = async (params = {}) => {
  const response = await apiClient.get("/newsletters", { params });
  return response.data;
};

/**
 * Get subscriber by ID (admin only)
 */
const getSubscriberById = async (id) => {
  const response = await apiClient.get(`/newsletters/${id}`);
  return response.data;
};

/**
 * Delete subscriber (admin only)
 */
const deleteSubscriber = async (id) => {
  const response = await apiClient.delete(`/newsletters/${id}`);
  return response.data;
};

export default {
  subscribe,
  unsubscribe,
  getAllSubscribers,
  getSubscriberById,
  deleteSubscriber,
};
