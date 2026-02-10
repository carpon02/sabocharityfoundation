import apiClient from "../config/apiConfig";

/**
 * Submit volunteer application (public)
 */
const submitApplication = async (applicationData) => {
  const formData = new FormData();

  // Append all application data to FormData
  Object.keys(applicationData).forEach((key) => {
    if (key === "resume" && applicationData[key]) {
      formData.append("resume", applicationData[key]);
    } else {
      formData.append(key, applicationData[key]);
    }
  });

  const response = await apiClient.post("/volunteers", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

/**
 * Get all volunteers (admin only)
 */
const getAllVolunteers = async (params = {}) => {
  const response = await apiClient.get("/volunteers", { params });
  return response.data;
};

/**
 * Get volunteer by ID (admin only)
 */
const getVolunteerById = async (id) => {
  const response = await apiClient.get(`/volunteers/${id}`);
  return response.data;
};

/**
 * Update volunteer application (admin only)
 */
const updateVolunteer = async (id, updateData) => {
  const response = await apiClient.put(`/volunteers/${id}`, updateData);
  return response.data;
};

/**
 * Delete volunteer application (admin only)
 */
const deleteVolunteer = async (id) => {
  const response = await apiClient.delete(`/volunteers/${id}`);
  return response.data;
};

/**
 * Approve volunteer (admin only)
 */
const approveVolunteer = async (id) => {
  const response = await apiClient.post(`/volunteers/${id}/approve`, {});
  return response.data;
};

/**
 * Reject volunteer (admin only)
 */
const rejectVolunteer = async (id, reason) => {
  const response = await apiClient.post(`/volunteers/${id}/reject`, { reason });
  return response.data;
};

/**
 * Log volunteer activity (admin only)
 */
const logActivity = async (id, activityData) => {
  const response = await apiClient.post(
    `/volunteers/${id}/log-activity`,
    activityData
  );
  return response.data;
};

export default {
  submitApplication,
  getAllVolunteers,
  getVolunteerById,
  updateVolunteer,
  deleteVolunteer,
  approveVolunteer,
  rejectVolunteer,
  logActivity,
};
