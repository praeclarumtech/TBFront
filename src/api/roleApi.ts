import { ADD_ROLE_AND_SKILL, VIEW_ROLE_AND_SKILL, UPDATE_ROLE_AND_SKILL, DELETE_ROLE_AND_SKILL, VIEW_ROLE_AND_SKILL_ID, VIEW_SKILLS_BY_APPLIED_ROLE } from "./apiRoutes";

import { authServices } from "./apiServices";


export const addRoleSkill = async (data:{ 

  appliedRole: string;
  skillIds: string[]; // Depending on whether it accepts single or multiple skills
}) => {
  const { appliedRole, skillIds } = data;
  const response = await authServices.post(`${ADD_ROLE_AND_SKILL}`, {appliedRole, skillIds});
  return response?.data;
};



export const viewRoleSkill = async (
  params: { page?: number; pageSize?: number; limit?: number; search?:string } = {}
) => {
  // if (params.search ) {
  //   const {  limit, ...searchParams } = params;
  //   params = { ...searchParams };
  // }

  const response = await authServices.get(`${VIEW_ROLE_AND_SKILL}`, { params });
  return response?.data;
};

// Update the API function to match the endpoint requirements
export const updateRoleSkill = async (data: { 
  _id: string;
  appliedRole: string;
  skillIds: string[]; // Depending on whether it accepts single or multiple skills
}) => {
  const { _id, appliedRole, skillIds } = data;
  const response = await authServices.put(
    `${UPDATE_ROLE_AND_SKILL}/${_id}`, 
    { appliedRole, skillIds }
  );
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

export const getSkillsByAppliedRole = async (appliedRole: string) => {
  const response = await authServices.get(`${VIEW_SKILLS_BY_APPLIED_ROLE}`, {
    params: { appliedRole },
  });
  return response?.data;
};
