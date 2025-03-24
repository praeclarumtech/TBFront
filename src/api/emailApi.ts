import {
  DELETE_EMAIL,
  VIEW_ALL_EMAIL,
  SEND_EMAIL,
  VIEW_EMAIL,
  DELETE_MULTIPLE_EMAIL,
} from "./apiRoutes";
import { authServices } from "./apiServices";

export const sendEmail = async (data?: object) => {
  const response = await authServices.post(`${SEND_EMAIL}`, data);
  return response?.data;
};

export const viewAllEmail = async (params: {
  page: number;
  pageSize: number;
  startDate?: string;
  endDate?: string;
  limit?:number;
  search?: string;
  appliedSkills?:string;
}) => {
  const response = await authServices.get(`${VIEW_ALL_EMAIL}`, { params });
  return response?.data;
};

export const deleteEmail = async (ids: string[]) => {
  const response = await authServices.delete(`${DELETE_EMAIL}`, {
    data: { ids },
  });
  return response?.data;
};

export const getEmailDetails = async (id: string | undefined | null) => {
  const response = await authServices.get(`${VIEW_EMAIL}/${id}`);
  return response?.data;
};

export const deleteMultipleEmail = async (ids: string[]) => {
  const response = await authServices.delete(`${DELETE_MULTIPLE_EMAIL}`, {
    data: { ids },
  });
  return response?.data;
};