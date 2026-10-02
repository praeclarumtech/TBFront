import { authServices, authServicesNoAuth } from "./apiServices";

const PATH = "training-technology";

export const listTrainingTechnologies = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  const response = await authServicesNoAuth.get(PATH, { params });
  return response?.data;
};

export const addTrainingTechnology = async (data: { name: string }) => {
  const response = await authServices.post(PATH, data);
  return response?.data;
};

export const updateTrainingTechnology = async (id: string, data: { name: string }) => {
  const response = await authServices.put(`${PATH}/${id}`, data);
  return response?.data;
};

export const deleteTrainingTechnology = async (id: string) => {
  const response = await authServices.delete(`${PATH}/${id}`);
  return response?.data;
};
