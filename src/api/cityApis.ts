import {
  CREATE_CITY,
  DELETE_CITY,
  UPDATE_CITY,
  VIEW_BY_ID_CITY,
  VIEW_CITY,
} from "./apiRoutes";
import { authServices } from "./apiServices";

export const viewAllCity = async (
  params: {
    page?: number;
    pageSize?: number;
    limit?: number;
    state_id?: string;
  } = {}
) => {
  const response = await authServices.get(`${VIEW_CITY}`, { params });
  return response?.data;
};

export const createCity = async (data: {
  state_id: string;
  city_name: string; // Depending on whether it accepts single or multiple skills
}) => {
  const { state_id, city_name } = data;
  const response = await authServices.post(`${CREATE_CITY}`, {
    state_id,
    city_name,
  });
  return response?.data;
};

export const updateCity = async (data: {
  _id: string;
  state_id: string;
  city_name: string; // Depending on whether it accepts single or multiple skills
}) => {
  const { _id, state_id, city_name } = data;
  const response = await authServices.put(`${UPDATE_CITY}/${_id}`, {
    state_id,
    city_name,
  });
  return response?.data;
};

export const deleteCity = async (data: { _id: string } = { _id: "" }) => {
  const response = await authServices.delete(`${DELETE_CITY}/${data?._id}`);
  return response?.data;
};

export const viewCityById = async (data: { _id: string } = { _id: "" }) => {
  const response = await authServices.delete(`${VIEW_BY_ID_CITY}/${data?._id}`);
  return response?.data;
};
