import axios from "axios";
import config from "../config";
import { logout } from "../utils/commonFunctions";
import { toast } from "react-toastify";
// import { getItem } from "components/constants/enum";
const { api } = config;
// const token = getItem('token')

const authServices = axios.create({
  baseURL: api.API_URL,
  headers: {
    Accept: "application/json",
  },
});

const authInstanceMultipart = axios.create({
  baseURL: api.API_URL,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

authServices.interceptors.request.use(async (config) => {
  // const token = sessionStorage.getItem("authUser");
  const token = localStorage.getItem("authUser");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

authInstanceMultipart.interceptors.request.use(async (config) => {
  // const token = sessionStorage.getItem("authUser");
  const token = localStorage.getItem("authUser");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// Helper function to check if session is expired based on backend response
const isSessionExpired = (response: any): boolean => {
  if (!response?.data) return false;

  // Option 1: Check the flag
  if (response.data?.sessionExpired === true) {
    return true;
  }

  // Option 2: Check the error code
  if (response.data?.code === "SESSION_EXPIRED") {
    return true;
  }

  // Option 3: Check status code and message
  if (
    response.status === 401 &&
    response.data?.message?.includes("Session expired")
  ) {
    return true;
  }

  return false;
};

// Helper function to handle session expiration
const handleSessionExpiration = () => {
  // Show toast notification
  toast.error("🔒 Session expired. Please log in again.", {
    toastId: "session-expired",
    closeOnClick: true,
    autoClose: 5000,
  });

  // Call logout to clear all auth data
  logout();

  // Clear session data
  localStorage.clear();
  sessionStorage.clear();

  // Redirect to login (use app base path so it works with basename /talent/)
  const baseUrl = import.meta.env.BASE_URL ?? "/";
  window.location.href = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
};

authServices.interceptors.response.use(
  (response) => {
    // Check for session expiration in successful responses
    if (isSessionExpired(response)) {
      handleSessionExpiration();
      return Promise.reject(new Error("Session expired"));
    }
    return response;
  },
  (error) => {
    // Check for session expiration in error responses
    if (error.response && isSessionExpired(error.response)) {
      handleSessionExpiration();
      return Promise.reject(error);
    }

    // Handle 401 unauthorized (legacy support)
    if (error.response?.status === 401) {
      handleSessionExpiration();
      return Promise.reject(error);
    }

    return Promise.reject(error);
  },
);

// Add the same interceptor to authInstanceMultipart
authInstanceMultipart.interceptors.response.use(
  (response) => {
    // Check for session expiration in successful responses
    if (isSessionExpired(response)) {
      handleSessionExpiration();
      return Promise.reject(new Error("Session expired"));
    }
    return response;
  },
  (error) => {
    // Check for session expiration in error responses
    if (error.response && isSessionExpired(error.response)) {
      handleSessionExpiration();
      return Promise.reject(error);
    }

    // Handle 401 unauthorized (legacy support)
    if (error.response?.status === 401) {
      handleSessionExpiration();
      return Promise.reject(error);
    }

    return Promise.reject(error);
  },
);

export { authServices, authInstanceMultipart };
