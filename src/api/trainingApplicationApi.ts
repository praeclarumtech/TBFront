import {
  VIEW_ALL_STATE,
  VIEW_CITY,
} from "./apiRoutes";
import { authServices, authServicesNoAuth } from "./apiServices";

const LIST_PATH = "training-application";

export const submitTrainingApplication = async (data: object) => {
  const response = await authServicesNoAuth.post(LIST_PATH, data);
  return response?.data;
};

export const listTrainingApplications = async (params: {
  page?: number;
  limit?: number;
  search?: string;
  technology?: string;
  semester?: string;
  duration?: string;
  interestedFor?: string;
  gender?: string;
  applicantType?: string;
  state?: string;
  city?: string;
  startDate?: string;
  endDate?: string;
}) => {
  const response = await authServices.get(LIST_PATH, { params });
  return response?.data;
};

export const viewTrainingApplication = async (id: string) => {
  const response = await authServices.get(`${LIST_PATH}/${id}`);
  return response?.data;
};

export const updateTrainingApplication = async (id: string, data: object) => {
  const response = await authServices.put(`${LIST_PATH}/${id}`, data);
  return response?.data;
};

export const deleteTrainingApplication = async (id: string) => {
  const response = await authServices.delete(`${LIST_PATH}/${id}`);
  return response?.data;
};

export const getPublicQualifications = async () => {
  const response = await authServicesNoAuth.get("degree/public", {
    params: { page: 1, limit: 1000 },
  });
  return response?.data;
};

export const getPublicStates = async () => {
  const response = await authServicesNoAuth.get(VIEW_ALL_STATE, {
    params: { page: 1, limit: 1000 },
  });
  return response?.data;
};

export const getPublicCities = async (stateId?: string) => {
  const response = await authServicesNoAuth.get(VIEW_CITY, {
    params: { page: 1, limit: 1000, state_id: stateId || undefined },
  });
  return response?.data;
};
