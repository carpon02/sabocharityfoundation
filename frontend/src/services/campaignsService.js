import apiClient from "../config/apiConfig";

/**
 * Get all campaigns with optional filters
 */
const getAllCampaigns = async (params = {}) => {
  const response = await apiClient.get("/campaigns", { params });
  return response.data;
};

/**
 * Get campaign by ID
 */
const getCampaign = async (id) => {
  const response = await apiClient.get(`/campaigns/${id}`);
  return response.data;
};

const getCampaignById = getCampaign;

/**
 * Get campaign by slug
 */
const getCampaignBySlug = async (slug) => {
  const response = await apiClient.get(`/campaigns/slug/${slug}`);
  return response.data;
};

/**
 * Get campaign statistics (requires authentication)
 */
const getCampaignStats = async () => {
  const response = await apiClient.get("/campaigns/stats");
  return response.data;
};

/**
 * Create a new campaign (requires authentication)
 */
const createCampaign = async (campaignData) => {
  let payload;

  if (campaignData instanceof FormData) {
    // Slice already built the FormData — send it directly
    payload = campaignData;
  } else {
    // Fallback: build FormData from a plain object
    payload = new FormData();
    Object.keys(campaignData).forEach((key) => {
      if (key === "images" && Array.isArray(campaignData[key])) {
        campaignData[key].forEach((image) => payload.append("images", image));
      } else {
        payload.append(key, campaignData[key]);
      }
    });
  }

  const response = await apiClient.post("/campaigns/create-campaign", payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

/**
 * Update a campaign (requires authentication)
 */
const updateCampaign = async (id, campaignData) => {
  let payload;

  if (campaignData instanceof FormData) {
    // Slice already built the FormData — send it directly
    payload = campaignData;
  } else {
    // Fallback: build FormData from a plain object
    payload = new FormData();
    Object.keys(campaignData).forEach((key) => {
      if (key === "images" && Array.isArray(campaignData[key])) {
        campaignData[key].forEach((image) => payload.append("images", image));
      } else {
        payload.append(key, campaignData[key]);
      }
    });
  }

  const response = await apiClient.put(`/campaigns/${id}`, payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

/**
 * Delete a campaign (requires authentication)
 */
const deleteCampaign = async (id) => {
  const response = await apiClient.delete(`/campaigns/${id}`);
  return response.data;
};

/**
 * Add update to campaign (requires authentication)
 */
const addCampaignUpdate = async (id, updateData) => {
  const formData = new FormData();

  Object.keys(updateData).forEach((key) => {
    if (key === "images" && Array.isArray(updateData[key])) {
      updateData[key].forEach((image) => {
        formData.append("images", image);
      });
    } else {
      formData.append(key, updateData[key]);
    }
  });

  const response = await apiClient.post(`/campaigns/${id}/updates`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

/**
 * Approve campaign (admin only)
 */
const approveCampaign = async (id, status) => {
  const response = await apiClient.patch(`/campaigns/${id}/status`, { status });
  return response.data;
};

export default {
  getAllCampaigns,
  getCampaign,
  getCampaignById,
  getCampaignBySlug,
  getCampaignStats,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  addCampaignUpdate,
  approveCampaign,
};
