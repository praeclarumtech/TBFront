import {
  CREATE_DEGREE,
  VIEW_DEGREE,
  VIEW_ALL_DEGREE,
  UPDATE_DEGREE,
  // DELETE_DEGREE,
  DELETE_MANY_DEGREE,
} from "./apiRoutes";
import { authServices } from "./apiServices";

export const createDegree = async (data?: object) => {
  const response = await authServices.post(`${CREATE_DEGREE}`, data);
  return response?.data;
};

export const viewAllDegree = async (
  params: { page?: number; pageSize?: number; limit?: number } = {}
) => {
  const response = await authServices.get(`${VIEW_ALL_DEGREE}`, { params });
  return response?.data;
};

export const viewDegreeById = async (data: { _id: string } = { _id: "" }) => {
  const response = await authServices.get(`${VIEW_DEGREE}/${data?._id}`);
  return response?.data;
};

export const updateDegree = async (data: { _id: string; degree: string }) => {
  const { _id, degree } = data;
  const response = await authServices.put(`${UPDATE_DEGREE}/${_id}`, {
    degree,
  });
  return response?.data;
};

// export const deleteDegree = async (data: { _id: string } = { _id: "" }) => {
//   const response = await authServices.delete(`${DELETE_DEGREE}/${data?._id}`);
//   return response?.data;
// };

export const deleteMultipleDegree = async ( ids: string[] | undefined | null) => {
  if (!ids || ids.length === 0) return;
  const response = await authServices.delete(
    DELETE_MANY_DEGREE, {data:{ids},}
  );
  return response.data;
};

