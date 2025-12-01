import api from "./api";
import { store } from "@/store";
import { forceLogout } from "@/features/auth/authSlice";
import { toast } from "sonner";

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.request.use(
  (config) => {
    try {
      const tokens = JSON.parse(localStorage.getItem("caresync_tokens") || "{}");
      const accessToken = tokens.accessToken;
      
      if (accessToken) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    } catch (error) {
      console.warn("Failed to parse tokens from localStorage", error);
    }

    config.withCredentials = true; // IMPORTANT: Send cookies
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const message = error.response?.data?.message;

    // If error is 401 and not a login/refresh attempt
    if (status === 401 && !originalRequest._retry) {
      // Skip if it's login or refresh token endpoint
      if (originalRequest.url.includes('/login') || 
          originalRequest.url.includes('/refresh-token') ||
          originalRequest.url.includes('/logout')) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Refresh token
        const result = await store.dispatch(refreshAccessToken()).unwrap();
        const newAccessToken = result.accessToken;
        
        // Update localStorage
        const tokens = JSON.parse(localStorage.getItem("caresync_tokens") || "{}");
        tokens.accessToken = newAccessToken;
        localStorage.setItem("caresync_tokens", JSON.stringify(tokens));
        
        // Update header
        api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        
        processQueue(null, newAccessToken);
        isRefreshing = false;
        
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;
        
        store.dispatch(forceLogout());
        toast.error("Session expired. Please log in again.");
        
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    if (status === 403) {
      toast.error("You don't have permission to perform this action.");
    } else if (status === 404) {
      toast.error("Resource not found.");
    } else if (status >= 500) {
      toast.error("Server error. Please try again later.");
    } else if (message) {
      toast.error(message);
    }

    // Force logout for token errors
    const shouldForceLogout = 
      message?.includes("Invalid access token") ||
      message?.includes("Token expired") ||
      message?.includes("Not authenticated");

    if (shouldForceLogout) {
      store.dispatch(forceLogout());
      toast.error("Session expired. Please log in again.");
    }

    return Promise.reject(error);
  }
);

export default api;