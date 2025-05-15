import { CREATE_COUNTRY, DELETE_COUNTRY, UPDATE_COUNTRY, VIEW_ALL_COUNTRY } from "./apiRoutes";
import { authServices } from "./apiServices";

export const viewAllCountry = async (
  params: { page?: number; pageSize?: number; limit?: number } = {}
) => {
  const response = await authServices.get(`${VIEW_ALL_COUNTRY}`, { params });
  return response?.data;
};

export const createCountry = async (data: {
  country_name: string; // Depending on whether it accepts single or multiple skills
}) => {
  const { country_name } = data;
  const response = await authServices.post(`${CREATE_COUNTRY}`, {
    country_name,
  });
  return response?.data;
};

export const updateCountry = async (data: {
  _id: string;

  country_name: string[]; // Depending on whether it accepts single or multiple skills
}) => {
  const { _id, country_name } = data;
  const response = await authServices.put(`${UPDATE_COUNTRY}/${_id}`, {
    country_name,
  });
  return response?.data;
};

export const deleteCountry = async (data: { _id: string } = { _id: "" }) => {
  const response = await authServices.delete(`${DELETE_COUNTRY}/${data?._id}`);
  return response?.data;
};
