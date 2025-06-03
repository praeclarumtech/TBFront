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
  EMAIL_COUNT
} from "./apiRoutes";
import { authServices } from "./apiServices";
import { AxiosRequestConfig } from 'axios';
 
export const sendEmail = async (data: FormData, config?: AxiosRequestConfig) => {
  const response = await authServices.post(`${SEND_EMAIL}`, data, config);
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

  if (params.search) {
    const {  page,pageSize, limit, ...rest } = params;
    finalParams = { ...rest };
  }

  const response = await authServices.get(`${VIEW_ALL_EMAIL}`, { params: finalParams });
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

export const viewEmailTemplate = async (params : {
  page?: number;
  pageSize?: number;
  limit?: number;
  search? :string;
}) => {
  let finalParams = { ...params };

  if (params.search) {
    const {  page,pageSize, limit, ...rest } = params;
    finalParams = { ...rest };
  }

  const response = await authServices.get(
    `/email/template/${VIEW_EMAIL_TEMPLATE}`,
    { params: finalParams  }
  );
  return response?.data;
};

// export const viewEmailTemplate = async (params: {
//   page?: number;
//   pageSize?: number;
//   limit?: number;
//   search?: string;
// }) => {
//   // If search is provided and not just whitespace
//   const isSearching = params.search && params.search.trim().length > 0;

//   const finalParams = isSearching
//     ? { search: params.search?.trim() } // search-only mode
//     : params; // include page/limit normally

//   const response = await authServices.get(
//     `/email/template/${VIEW_EMAIL_TEMPLATE}`,
//     { params: finalParams }
//   );

//   return response?.data;
// };




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

export const getEmailCount = async (params?: {
  startDate?: string;
  endDate?: string;
}) => {
  const response = await authServices.get(`${EMAIL_COUNT}`, { params });
  return response?.data;
};
