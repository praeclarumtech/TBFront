import axios from "axios";
import config from "../config";
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
 
authServices.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
 
      // Redirect to login
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);
 
export {authServices, authInstanceMultipart};
 
 