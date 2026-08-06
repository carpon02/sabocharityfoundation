import axios from "axios";

/**
 * Centralized API Configuration for Admin Panel
 * Single source of truth for API base URL and axios instance
 */

// Get API base URL from environment variable or use default
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

/**
 * Configured axios instance with interceptors
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request interceptor to add auth token to requests
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken"); // Changed from "token" to "adminToken"
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

/**
 * Response interceptor for global error handling
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized globally
    if (error.response?.status === 401 && !error.config.url.includes("/auth/login")) {
      localStorage.removeItem("adminToken"); // Changed from "token" to "adminToken"
      localStorage.removeItem("adminUser"); // Also remove admin user data
      // Redirect to login
      if (window.location.pathname !== "/admin-login") {
        window.location.href = "/admin-login";
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;
