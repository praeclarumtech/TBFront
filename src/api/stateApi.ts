import {
  CREATE_STATE,
  DELETE_STATE,
  UPDATE_STATE,
  VIEW_ALL_STATE,
} from "./apiRoutes";
import { authServices } from "./apiServices";

export const viewAllState = async (
  params: {
    page?: number;
    pageSize?: number;
    limit?: number;
    country_id?: string;
  } = {}
) => {
  const response = await authServices.get(`${VIEW_ALL_STATE}`, { params });
  return response?.data;
};

export const createState = async (data: {
  country_id: string;
  state_name: string; // Depending on whether it accepts single or multiple skills
}) => {
  const { country_id, state_name } = data;
  const response = await authServices.post(`${CREATE_STATE}`, {
    country_id,
    state_name,
  });
  return response?.data;
};

export const updateState = async (data: {
  _id: string;

  country_id: string;
  state_name: string; // Depending on whether it accepts single or multiple skills
}) => {
  const { _id, country_id, state_name } = data;
  const response = await authServices.put(`${UPDATE_STATE}/${_id}`, {
    country_id,
    state_name,
  });
  return response?.data;
};

export const deleteState = async (data: { _id: string } = { _id: "" }) => {
  const response = await authServices.delete(`${DELETE_STATE}/${data?._id}`);
  return response?.data;
};
