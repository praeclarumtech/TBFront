import axios from "axios";
import config from "../config";
import { logout, setAuthData } from "../utils/commonFunctions";
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

// Plain axios instance for login/refresh API calls (no auth header)
const authServicesNoAuth = axios.create({
  baseURL: api.API_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
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
    response.data?.message?.includes("session expired")
  ) {
    return true;
  }

  return false;
};

// Helper function to handle session expiration (when refresh fails or is not available)
const handleSessionExpiration = () => {
  toast.error("🔒 Session expired. Please log in again.", {
    toastId: "session-expired",
    closeOnClick: true,
    autoClose: 5000,
  });

  logout();

  localStorage.clear();
  sessionStorage.clear();

  const baseUrl = import.meta.env.BASE_URL ?? "/";
  window.location.href = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
};

// Backend sends renewed token in header (X-New-Token) and/or body (response.data.accessToken). Update stored token when present.
// Check every API response and update stored token when present (sliding session).
const updateTokenFromResponse = (response: any) => {
  const fromBody = response?.data?.accessToken;
  const fromHeader =
    response?.headers?.["x-new-token"] ?? response?.headers?.["X-New-Token"];
  const accessToken = fromBody ?? fromHeader;
  if (accessToken) {
    setAuthData(accessToken);
  }
};

const createResponseInterceptor = (_instance: typeof authServices) => {
  const onSuccess = (response: any) => {
    updateTokenFromResponse(response);
    if (isSessionExpired(response)) {
      handleSessionExpiration();
      return Promise.reject(new Error("Session expired"));
    }
    return response;
  };
  const onError = (error: any) => {
    if (error.response && isSessionExpired(error.response)) {
      handleSessionExpiration();
    }
    return Promise.reject(error);
  };
  return [onSuccess, onError];
};

const [authOnSuccess, authOnError] = createResponseInterceptor(authServices);
authServices.interceptors.response.use(authOnSuccess, authOnError);

// Add the same interceptor to authInstanceMultipart
const [multipartOnSuccess, multipartOnError] = createResponseInterceptor(
  authInstanceMultipart,
);
authInstanceMultipart.interceptors.response.use(
  multipartOnSuccess,
  multipartOnError,
);

export {
  authServices,
  authInstanceMultipart,
  authServicesNoAuth,
  handleSessionExpiration,
};
