import {
  VIEW_ALL_SKILL,
  CREATE_SKILL,
  VIEW_SKILL,
  UPDATE_SKILL,
  DELETE_SKILL,
} from "./apiRoutes";
import { authServices } from "./apiServices";

export const createSkill = async (data?: object) => {
  const response = await authServices.post(`${CREATE_SKILL}`, data);
  return response?.data;
};

export const viewAllSkill = async (data?: object) => {
  const response = await authServices.get(`${VIEW_ALL_SKILL}`, data);
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
