import {
  DELETE_EMAIL,
  VIEW_ALL_EMAIL,
  SEND_EMAIL,
  VIEW_EMAIL,
  DELETE_MULTIPLE_EMAIL,
  VIEW_EMAIL_TEMPLATE,
  DELETE_EMAIL_TEMPLATE,
  UPDATE_EMAIL_TEMPLATE,
  CREATE_EMAIL_TEMPLATE,
  GET_EMAIL_TEMPLATE_BY_ID,
  GET_EMAIL_TEMPLATE_BY_TYPE,
} from "./apiRoutes";
import { authServices } from "./apiServices";

export const sendEmail = async (data?: object) => {
  const response = await authServices.post(`${SEND_EMAIL}`, data);
  return response?.data;
};

// export const viewAllEmail = async (params: {
//   page: number;
//   pageSize: number;
//   startDate?: string;
//   endDate?: string;
//   limit?: number;
//   search?: string;
//   appliedSkills?: string;
//   email_To?: string;
// }) => {
  
//   const response = await authServices.get(`${VIEW_ALL_EMAIL}`, { params });
//   return response?.data;
// };



export const viewAllEmail = async (params: {
  page?: number;
  pageSize?: number;
  startDate?: string;
  endDate?: string;
  limit?: number;
  search?: string;
  appliedSkills?: string;
  email_to?: string;
  name?: string
}) => {
  let finalParams = { ...params };

  if (params.email_to || params.appliedSkills || params.name) {
    const {  limit, ...rest } = params;
    finalParams = { ...rest };
  }

  const response = await authServices.get(`${VIEW_ALL_EMAIL}`, { params: finalParams });
  console.log("res",response)
  return response?.data;
};






export const deleteEmail = async (ids: string[]) => {
  const response = await authServices.delete(`${DELETE_EMAIL}`, {
    data: { ids },
  });
  return response?.data;
};

export const getEmailDetails = async (id: string | undefined | null) => {
  const response = await authServices.get(`${VIEW_EMAIL}/${id}`);
  return response?.data;
};

export const deleteMultipleEmail = async (ids: string[]) => {
  const response = await authServices.delete(`${DELETE_MULTIPLE_EMAIL}`, {
    data: { ids },
  });
  return response?.data;
};

export const createEmailTemplate = async (data: any) => {
  const response = await authServices.post(
    `/email/template/${CREATE_EMAIL_TEMPLATE}`,
    data
  );
  return response?.data;
};

export const updateEmailTemplate = async (data: any) => {
  const response = await authServices.put(
    `/email/template/${UPDATE_EMAIL_TEMPLATE}/${data._id}`,
    data
  );
  return response?.data;
};

export const deleteEmailTemplate = async (id: string) => {
  const response = await authServices.delete(
    `/email/template/${DELETE_EMAIL_TEMPLATE}/${id}`
  );
  return response?.data;
};

export const viewEmailTemplate = async (params?: {
  page?: number;
  pageSize?: number;
  limit?: number;
}) => {
  const response = await authServices.get(
    `/email/template/${VIEW_EMAIL_TEMPLATE}`,
    { params }
  );
  return response?.data;
};

export const getEmailTemplateById = async (id: string) => {
  const response = await authServices.get(
    `/email/template/${GET_EMAIL_TEMPLATE_BY_ID}/${id}`
  );
  return response?.data;
};

export const getEmailTemplateByType = async (type: string) => {
  const response = await authServices.get(
    `/email/template/${GET_EMAIL_TEMPLATE_BY_TYPE}/${type}`
  );
  return response?.data;
};
