import {
  LOGIN,
  FORGOT_PASSWORD,
  REGISTER,
  UPDATEPROFILE,
  VIEWPROFILE,
  CHANGEPASSWORD,
  VERIFY_OTP,
  SEND_OTP,
  GET_PROFILE,
  GET_ALL_USERS,
  UPDATE_USER_STATUS,
  USERADD,
  IMPORT_VENDOR_CSV,
  EXPORT_VENDOR_CSV,
  SAMPLE_CSV,
} from "./apiRoutes";
import { authServices } from "./apiServices";
import qs from "qs";

export const login = async (data: object) => {
  const response = await authServices.post(`${LOGIN}`, data);
  return response?.data;
};

export const getProfile = async (data: object) => {
  const response = await authServices.get(`${GET_PROFILE}`, data);
  return response?.data;
};

export const register = async (data: object) => {
  const response = await authServices.post(`${REGISTER}`, data);
  return response?.data;
};

export const userAdd = async (data: object) => {
  const response = await authServices.post(`${USERADD}`, data);
  return response?.data;
};

export const updateProfile = async (id?: string, data?: object) => {
  const response = await authServices.put(`${UPDATEPROFILE}/${id}`, data);
  return response?.data;
};

export const viewProfile = async (id?: string) => {
  const response = await authServices.get(`${VIEWPROFILE}/${id}`);
  return response?.data;
};

export const changePassword = async (
  id: string,
  data: { oldPassword: string; newPassword: string; confirmPassword: string }
) => {
  const response = await authServices.post(`${CHANGEPASSWORD}/${id}`, data);
  return response?.data;
};

export const sendOtp = async (data: object) => {
  const response = await authServices.post(`${SEND_OTP}`, data);
  return response?.data;
};

export const verifyOtp = async (data: object) => {
  const response = await authServices.post(`${VERIFY_OTP}`, data);
  return response?.data;
};

export const forgotPassword = async (data: object) => {
  const response = await authServices.put(`${FORGOT_PASSWORD}`, data);
  return response?.data;
};

export const getAllUsers = async (
  params: {
    page?: number;
    pageSize?: number;
    limit?: number;
    search?: string;
    role?: string;
  } = {}
) => {
  const response = await authServices.get(`${GET_ALL_USERS}`, { params });
  return response?.data;
};

export const updateUserStatus = async (id?: string, data?: object) => {
  const response = await authServices.put(`${UPDATE_USER_STATUS}/${id}`, data);
  return response?.data;
};

export const importVendorCsv = async (
  formData: FormData,
  config?: { onUploadProgress?: (progressEvent: any) => void; params?: any }
) => {
  const url = `${IMPORT_VENDOR_CSV}`;

  const response = await authServices.post(url, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    params: config?.params,
    ...config,
    timeout: 300000,
  });

  return response.data;
};

export const exportVendorCsv = async (
  queryParams: {
    source?: string;
    page?: number;
    pageSize?: number;
    limit?: number;
    search?: string;
    role?: string;
    startDate?: string;
    endDate?: string;
  } = {},
  payload?: { ids: string[]; fields: string[]; main: boolean }
) => {
  const queryString = qs.stringify(queryParams, { arrayFormat: "repeat" });

  const response = await authServices.post(
    `${EXPORT_VENDOR_CSV}?${queryString}`,
    payload,
    {
      headers: {
        "Content-Type": "application/json",
      },
      responseType: "blob",
      timeout: 300000,
    }
  );

  return response.data;
};

// Download sample CSV for vendor or client
export const downloadSampleCsv = async (type: "vendor" | "client") => {
  const response = await authServices.get(`${SAMPLE_CSV}`, {
    params: { type },
    responseType: "blob",
    timeout: 60000,
  });

  return response.data;
};
