import { DELETE_EMAIL, VIEW_ALL_EMAIL, SEND_EMAIL } from "./apiRoutes";
import { authServices } from "./apiServices";

export const sendEmail = async (data?: object) => {
  const response = await authServices.post(`${SEND_EMAIL}`, data);
  return response?.data;
};

export const viewAllEmail = async (data?: object) => {
  const response = await authServices.get(`${VIEW_ALL_EMAIL}`, data);
  return response?.data;
};

export const deleteEmail = async (data?: object) => {
  const response = await authServices.delete(`${DELETE_EMAIL}`, data);
  return response?.data;
};
