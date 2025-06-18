import {
  CREATE_JOB,
  DELETE_JOB,
  UPDATE_JOB,
  VIEW_ALL_JOB,
  VIEW_JOB_ID,
} from "./apiRoutes";
import { authServices } from "./apiServices";

export const viewAllJob = async (params: {
  search?: string;
  page?: number;
  pageSize?: number;
  limit?: number;
}) => {
  const response = await authServices.get(`${VIEW_ALL_JOB}`, {
    params,
  });
  return response?.data;
};

export const createJob = async (data?: object) => {
  const response = await authServices.post(`${CREATE_JOB}`, data);
  return response?.data;
};

export const deleteJob = async (ids: string[] | undefined | null) => {
  const response = await authServices.delete(`${DELETE_JOB}`, {
    data: { ids },
  });
  return response?.data;
};

export const viewJobById = async (data: { _id: any } = { _id: "" }) => {
  const response = await authServices.get(`${VIEW_JOB_ID}/${data?._id}`);
  return response?.data;
};

export const updateJob = async (id: string, data: any) => {
  const response = await authServices.put(`${UPDATE_JOB}/${id}`, data);
  return response?.data;
};
