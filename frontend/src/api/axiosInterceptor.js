import api from "./api";
import { store } from "@/store";
import { forceLogout, refreshAccessToken } from "@/features/auth/authSlice";
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
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    config.headers = {
      ...config.headers,
      'Content-Type': config.headers['Content-Type'] || 'application/json',
      'Accept': 'application/json',
    };

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

    if (status === 401 && !originalRequest._retry) {
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
        const result = await store.dispatch(refreshAccessToken()).unwrap();
        const newAccessToken = result.accessToken;
        
        localStorage.setItem("accessToken", newAccessToken);
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
        return Promise.reject(refreshError);
      }
    }

    if (status === 403) {
      toast.error("You don't have permission to perform this action.");
    } else if (status === 404) {
      toast.error("Resource not found.");
    } else if (status >= 500) {
      toast.error("Server error. Please try again later.");
    } else if (message) {
      toast.error(message);
    }

    const shouldForceLogout = 
      message?.includes("Invalid access token") ||
      message?.includes("Token expired") ||
      message?.includes("Not authenticated") ||
      (status === 401 && message !== "Invalid credentials");

    if (shouldForceLogout) {
      store.dispatch(forceLogout());
      toast.error("Session expired. Please log in again.");
    }

    return Promise.reject(error);
  }
);

export default api;