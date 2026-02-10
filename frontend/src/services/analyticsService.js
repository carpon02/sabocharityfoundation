import apiClient from "../config/apiConfig";

/**
 * Get platform analytics/statistics
 */
const getPlatformAnalytics = async () => {
  const response = await apiClient.get("/analytics");
  return response.data;
};

export default {
  getPlatformAnalytics,
};
