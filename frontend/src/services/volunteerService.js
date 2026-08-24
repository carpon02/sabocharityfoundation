import apiClient from "../config/apiConfig";

/**
 * Submit a volunteer application.
 * Sends JSON when no file is attached; multipart/form-data when a resume is included.
 */
const submitApplication = async (applicationData) => {
  const { resume, ...payload } = applicationData;

  if (!resume) {
    const response = await apiClient.post("/volunteers", payload);
    return response.data;
  }

  // Resume present — wrap the JSON payload in a single "data" field so multer
  // can coexist with the nested application object.
  const formData = new FormData();
  formData.append("resume", resume);
  formData.append("data", JSON.stringify(payload));

  const response = await apiClient.post("/volunteers", formData);
  return response.data;
};

const getAllVolunteers    = async (params = {}) =>
  (await apiClient.get("/volunteers", { params })).data;

const getVolunteerById   = async (id) =>
  (await apiClient.get(`/volunteers/${id}`)).data;

const updateVolunteer    = async (id, data) =>
  (await apiClient.put(`/volunteers/${id}`, data)).data;

const deleteVolunteer    = async (id) =>
  (await apiClient.delete(`/volunteers/${id}`)).data;

const approveVolunteer   = async (id) =>
  (await apiClient.post(`/volunteers/${id}/approve`, {})).data;

const rejectVolunteer    = async (id, reason) =>
  (await apiClient.post(`/volunteers/${id}/reject`, { reason })).data;

const logActivity        = async (id, activityData) =>
  (await apiClient.post(`/volunteers/${id}/log-activity`, activityData)).data;

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
