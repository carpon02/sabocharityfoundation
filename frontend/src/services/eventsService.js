import apiClient from "../config/apiConfig";

/**
 * Get all events with optional filters
 */
const getAllEvents = async (params = {}) => {
  const response = await apiClient.get("/events", { params });
  return response.data;
};

/**
 * Get upcoming events
 */
const getUpcomingEvents = async () => {
  const response = await apiClient.get("/events/upcoming");
  return response.data;
};

/**
 * Get past events
 */
const getPastEvents = async () => {
  const response = await apiClient.get("/events/past");
  return response.data;
};

/**
 * Get single event by ID
 */
const getEventById = async (id) => {
  const response = await apiClient.get(`/events/${id}`);
  return response.data;
};

/**
 * Get event by slug
 */
const getEventBySlug = async (slug) => {
  const response = await apiClient.get(`/events/slug/${slug}`);
  return response.data;
};

/**
 * Register for an event
 */
const registerForEvent = async (id, registrationData) => {
  const response = await apiClient.post(
    `/events/${id}/register`,
    registrationData
  );
  return response.data;
};

/**
 * Cancel event registration
 */
const cancelRegistration = async (id) => {
  const response = await apiClient.delete(`/events/${id}/register`);
  return response.data;
};

export default {
  getAllEvents,
  getUpcomingEvents,
  getPastEvents,
  getEventById,
  getEventBySlug,
  registerForEvent,
  cancelRegistration,
};
