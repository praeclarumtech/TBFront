import {
  ADD_PASSING_YEAR,
  DELETE_PASSING_YEAR,
  EDIT_PASSING_YEAR,
  VIEW_ALL_PASSING_YEAR,
  VIEW_PASSING_YEAR_BY_ID,
} from "./apiRoutes";
import { authServices } from "./apiServices";

export const addPassingYear = async (data: object = {}) => {
  const response = await authServices.post(`${ADD_PASSING_YEAR}`, data);
  return response?.data;
};

export const viewAllPassingYear = async (data: object = {}) => {
  const response = await authServices.get(`${VIEW_ALL_PASSING_YEAR}`, {
    params: data,
  });
  return response?.data;
};

export const deletePassingYear = async (
  data: { _id: string } = { _id: "" }
) => {
  const response = await authServices.delete(
    `${DELETE_PASSING_YEAR}/${data._id}`,
    { data }
  );
  return response?.data;
};

export const editPassingYear = async (
  data: { _id: string; year: number } = {
    _id: "",
    year: 0,
  }
) => {
  const response = await authServices.put(`${EDIT_PASSING_YEAR}/${data._id}`, {
    year: Number(data.year),
  });
  return response?.data;
};

export const viewByIdPassingYear = async (
  data: { _id: string } = { _id: "" }
) => {
  const response = await authServices.get(
    `${VIEW_PASSING_YEAR_BY_ID}/${data._id}`
  );
  return response?.data;
};
