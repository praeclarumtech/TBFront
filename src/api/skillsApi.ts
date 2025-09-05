/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  VIEW_ALL_SKILL,
  CREATE_SKILL,
  VIEW_SKILL,
  UPDATE_SKILL,
  DELETE_SKILL,
  IMPORT_SKILLS,
} from "./apiRoutes";
import { authServices } from "./apiServices";

export const createSkill = async (data?: object) => {
  const response = await authServices.post(`${CREATE_SKILL}`, data);
  return response?.data;
};

export const viewAllSkill = async (
  params: {
    page?: number;
    pageSize?: number;
    limit?: number;
    search?: string;
  } = {}
) => {
  // If searchS is provided, exclude pagination parameters
  // if (params.search) {
  //   // Only keep searchS, remove pagination parameters
  //   const { page, pageSize, limit, ...searchParams } = params;
  //   params = { ...searchParams };
  // }

  const response = await authServices.get(`${VIEW_ALL_SKILL}`, { params });
  return response?.data;
};

export const viewSkillById = async (data: { _id: string } = { _id: "" }) => {
  const response = await authServices.get(`${VIEW_SKILL}/${data?._id}`);
  return response?.data;
};

export const updateSkill = async (data: { _id: string; skills: string }) => {
  const { _id, skills } = data;
  const response = await authServices.put(`${UPDATE_SKILL}/${_id}`, { skills });
  return response?.data;
};

export const deleteSkill = async (data: { _id: string } = { _id: "" }) => {
  const response = await authServices.delete(`${DELETE_SKILL}/${data?._id}`);
  return response?.data;
};

export const ViewAppliedSkills = async (
  params: { page?: number; pageSize?: number; limit?: number } = {}
) => {
  const response = await authServices.get(`${VIEW_ALL_SKILL}`, { params });
  return response?.data;
};

export const importSkills = async (
  formData: FormData,
  config?: {
    onUploadProgress?: (progressEvent: any) => void;
  }
) => {
  const response = await authServices.post(`${IMPORT_SKILLS}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    ...config,
    timeout: 300000, // 5 minutes
  });
  return response?.data;
};
