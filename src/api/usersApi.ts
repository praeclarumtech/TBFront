import { LOGIN, FORGOT_PASSWORD, REGISTER, UPDATEPROFILE, VIEWPROFILE, CHANGEPASSWORD } from "./apiRoutes";
import { authServices } from "./apiServices";

export const login = async (data: object) => {
  const response = await authServices.post(`${LOGIN}`, data);
  return response?.data;
};

export const register = async (data: object) => {
  const response = await authServices.post(`${REGISTER}`, data);
  return response?.data;
};

export const forgotPassword = async (data: object) => {
  const response = await authServices.post(`${FORGOT_PASSWORD}`, data);
  return response?.data;
};

export const updateProfile = async (id?: number, data?: object) => {
  const response = await authServices.put(`${UPDATEPROFILE}/${id}`, data);
  return response?.data;
};

export const viewProfile = async (id?: number, data?: object) => {
  const response = await authServices.get(`${VIEWPROFILE}/${id}`, data);
  return response?.data;
};

export const changePassword = async(id?: number ,data?: object) =>{
  const response = await authServices.post(`${CHANGEPASSWORD}/${id}`, data);
  return response?.data;
};