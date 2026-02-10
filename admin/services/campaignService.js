// src/services/campaignService.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests - handles both admin and user tokens
api.interceptors.request.use(
  (config) => {
    // Check for admin token first (for admin dashboard)
    let token = localStorage.getItem('adminToken');
    
    // If no admin token, check for regular user token
    if (!token) {
      token = localStorage.getItem('token');
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      // Clear tokens
      localStorage.removeItem('token');
      localStorage.removeItem('adminToken');
      localStorage.removeItem('user');
      
      // Redirect to login based on current app type
      const appType = import.meta.env.VITE_APP_TYPE;
      if (appType === 'admin') {
        window.location.href = '/admin/login';
      } else {
        window.location.href = '/login';
      }
    }
    
    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error('Access forbidden:', error.response.data?.message);
    }
    
    return Promise.reject(error);
  }
);

const campaignService = {
  /**
   * Get all campaigns with optional filters
   * @param {Object} params - Query parameters (category, search, status, etc.)
   * @returns {Promise} Campaign list with pagination
   */
  getAllCampaigns: async (params = {}) => {
    try {
      const response = await api.get('/campaigns', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching campaigns:', error.response?.data || error);
      throw error;
    }
  },

  /**
   * Get single campaign by ID
   * @param {string} id - Campaign ID
   * @returns {Promise} Campaign details
   */
  getCampaign: async (id) => {
    try {
      const response = await api.get(`/campaigns/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching campaign:', error.response?.data || error);
      throw error;
    }
  },

  /**
   * Get campaign by slug
   * @param {string} slug - Campaign slug
   * @returns {Promise} Campaign details
   */
  getCampaignBySlug: async (slug) => {
    try {
      const response = await api.get(`/campaigns/slug/${slug}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching campaign by slug:', error.response?.data || error);
      throw error;
    }
  },

  /**
   * Get campaign statistics
   * Requires authentication (donor or admin)
   * @returns {Promise} Campaign statistics
   */
  getCampaignStats: async () => {
    try {
      const response = await api.get('/campaigns/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching campaign stats:', error.response?.data || error);
      throw error;
    }
  },

  /**
   * Create new campaign
   * Requires authentication (donor or admin)
   * @param {FormData} formData - Campaign data with images
   * @returns {Promise} Created campaign
   */
  createCampaign: async (formData) => {
    try {
      const response = await api.post('/campaigns/create-campaign', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating campaign:', error.response?.data || error);
      throw error;
    }
  },

  /**
   * Update existing campaign
   * Requires authentication (campaign owner or admin)
   * @param {string} id - Campaign ID
   * @param {FormData} formData - Updated campaign data
   * @returns {Promise} Updated campaign
   */
  updateCampaign: async (id, formData) => {
    try {
      const response = await api.put(`/campaigns/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating campaign:', error.response?.data || error);
      throw error;
    }
  },

  /**
   * Delete campaign
   * Requires authentication (campaign owner or admin)
   * @param {string} id - Campaign ID
   * @returns {Promise} Deletion confirmation
   */
  deleteCampaign: async (id) => {
    try {
      const response = await api.delete(`/campaigns/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting campaign:', error.response?.data || error);
      throw error;
    }
  },

  /**
   * Add update to campaign
   * Requires authentication (campaign owner or admin)
   * @param {string} id - Campaign ID
   * @param {FormData} formData - Update data with optional images
   * @returns {Promise} Updated campaign with new update
   */
  addCampaignUpdate: async (id, formData) => {
    try {
      const response = await api.post(`/campaigns/${id}/updates`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      console.error('Error adding campaign update:', error.response?.data || error);
      throw error;
    }
  },

  /**
   * Approve or reject campaign (Admin only)
   * @param {string} id - Campaign ID
   * @param {string} status - New status (active, rejected, etc.)
   * @returns {Promise} Updated campaign
   */
  approveCampaign: async (id, status) => {
    try {
      const response = await api.patch(`/campaigns/${id}/approve`, { status });
      return response.data;
    } catch (error) {
      console.error('Error approving/rejecting campaign:', error.response?.data || error);
      throw error;
    }
  },
};

export default campaignService;