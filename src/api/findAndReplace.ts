import { FIND, FIND_AND_REPLACE_ALL } from "./apiRoutes";
import { authServices } from "./apiServices";

export const findAndReplaceAll = async (data: object) => {
  const response = await authServices.put(`${FIND_AND_REPLACE_ALL}`, data );
  return response?.data;
};

export const find = async (data: object) => {
    const response = await authServices.post(`${FIND}`, data );
    return response?.data;
  };