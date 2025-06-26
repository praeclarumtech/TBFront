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
} from "./apiRoutes";
import { authServices } from "./apiServices";

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

export const updateProfile = async (id?: string, data?: object) => {
  const response = await authServices.put(`${UPDATEPROFILE}/${id}`, data);
  return response?.data;
};

export const viewProfile = async (id?: string, data?: object) => {
  const response = await authServices.get(`${VIEWPROFILE}/${id}`, data);
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

export const getAllUsers = async (data?: object) => {
  const response = await authServices.get(`${GET_ALL_USERS}`, data);
  return response?.data;
};
 
export const updateUserStatus = async (id?: string, data?: object) => {
  const response = await authServices.put(`${UPDATE_USER_STATUS}/${id}`, data);
  return response?.data;
};
 