import { ADD_ROLE_AND_SKILL, VIEW_ROLE_AND_SKILL, UPDATE_ROLE_AND_SKILL, DELETE_ROLE_AND_SKILL, VIEW_ROLE_AND_SKILL_ID } from "./apiRoutes";

import { authServices } from "./apiServices";


export const addRoleSkill = async (data?: object) => {
  const response = await authServices.post(`${ADD_ROLE_AND_SKILL}`, data);
  return response?.data;
};

export const viewRoleSkill = async (
  params: { page?: number; pageSize?: number; limit?: number } = {}
) => {
  const response = await authServices.get(`${VIEW_ROLE_AND_SKILL}`, { params });
  return response?.data;
};

export const updateRoleSkill = async (data: { _id: string; skill: string; appliedRole:string }) => {
  const { _id, skill, appliedRole} = data;
  const response = await authServices.put(`${UPDATE_ROLE_AND_SKILL}/${_id}`, { skill, appliedRole });
  return response?.data;
};

export const deleteRoleSkill = async (data: { _id: string } = { _id: "" }) => {
  const response = await authServices.delete(`${DELETE_ROLE_AND_SKILL}/${data?._id}`);
  return response?.data;
};

export const viewRoleSkillById = async (data: { _id: string } = { _id: "" }) => {
  const response = await authServices.get(`${VIEW_ROLE_AND_SKILL_ID}/${data?._id}`);
  return response?.data;
};
