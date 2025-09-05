import { authServices } from "./apiServices";
import {
  CREATE_DESIGNATION,
  VIEW_DESIGNATION,
  VIEW_ALL_DESIGNATION,
  UPDATE_DESIGNATION,
  DELETE_DESIGNATION,
  DELETE_MULTIPLE_DESIGNATION,
} from "./apiRoutes";

export const createDesignation = async (designation: any) => {
  const response = await authServices.post(CREATE_DESIGNATION, designation);
  return response.data;
};

export const viewDesignation = async (designationId: string) => {
  const response = await authServices.get(
    `${VIEW_DESIGNATION}/${designationId}`
  );
  return response.data;
};

export const viewAllDesignation = async (params: { page?: number; pageSize?: number; limit?: number; search?:string }) => {
  if (params.search ) {
    const {  limit, ...searchParams } = params;
    params = { ...searchParams };
  }


  const response = await authServices.get(VIEW_ALL_DESIGNATION, { params });
  return response.data;
};

export const updateDesignation = async (
  designationId: string,
  designation: any
) => {
  const response = await authServices.put(
    `${UPDATE_DESIGNATION}/${designationId}`,
    designation
  );
  return response.data;
};

export const deleteDesignation = async (designationId: string) => {
  const response = await authServices.delete(
    `${DELETE_DESIGNATION}/${designationId}`
  );
  return response.data;
};

export const deleteMultipleDesignation = async ( ids: string[] | undefined | null) => {
  if (!ids || ids.length === 0) return;
  const response = await authServices.delete(
    DELETE_MULTIPLE_DESIGNATION, {data:{ids},}
  );
  return response.data;
};


