/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  LIST_APPLICANT,
  CREATE_APPLICANT,
  DELETE_APPLICANT,
  VIEW_APPLICANT,
  UPDATE_APPLICANT,
  UPDATE_APPLICANT_STAGE,
  UPDATE_APPLICANT_STATUS,
  FILTER_APPLICANT,
  CITY,
  IMPORT_APPLICANT,
  EXPORT_APPLICANT,
  IMPORT_RESUME,
  IMPORT_APPLICANT_LIST,
  DELETE_MULTIPLE_APPLICANT,
} from "./apiRoutes";
import { authServices } from "./apiServices";

export const listOfApplicants = async (params: {
  page: number;
  pageSize: number;
  totalExperience?: string;
  city?: string;
  appliedSkills?: string;
  startDate?: string;
  endDate?: string;
  currentCity?: string;
  noticePeriod?: string;
  status?: string;
  interviewStage?: string;
  gender?: string;
  expectedPkg?: string;
  currentCompanyDesignation?: string;
  state?: string;
  currentPkg?: string;
  anyHandOnOffers?: string;
  rating?: string;
  workPreference?: string;
  searchS?: string;
}) => {
  const response = await authServices.get(`${LIST_APPLICANT}`, { params });
  return response?.data;
};

export const createApplicant = async (data?: object) => {
  const response = await authServices.post(`${CREATE_APPLICANT}`, data);
  return response?.data;
};

export const updateApplicant = async (
  data: object,
  id: string | undefined | null
) => {
  const response = await authServices.put(`${UPDATE_APPLICANT}/${id}`, data);
  return response?.data;
};

export const getApplicantDetails = async (id: string | undefined | null) => {
  const response = await authServices.get(`${VIEW_APPLICANT}/${id}`);
  return response?.data;
};

export const deleteApplicant = async (_id: string | undefined | null) => {
  const response = await authServices.delete(`${DELETE_APPLICANT}/${_id}`);
  return response?.data;
};

export const updateStatus = async (data: { status: string }, id: string) => {
  const response = await authServices.put(
    `${UPDATE_APPLICANT_STATUS}/${id}`,
    data
  );

  return response?.data;
};

export const updateStage = async (
  data: { interviewStage: string },
  id: string
) => {
  const response = await authServices.put(
    `${UPDATE_APPLICANT_STAGE}/${id}`,
    data
  );

  return response?.data;
};
export const filterApplicants = async () => {
  const response = await authServices.get(`${FILTER_APPLICANT}`);
  return response?.data;
};

export const city = async () => {
  const response = await authServices.get(`${CITY}`);
  return response?.data;
};

export const importApplicant = async (
  formData: FormData,
  config?: {
    onUploadProgress?: (progressEvent: any) => void;
    params?: any;
  }
) => {
  const url = `${IMPORT_APPLICANT}`;

  const response = await authServices.post(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    params: config?.params,
    ...config,
    timeout: 300000,
  });
  return response?.data;
};

export const ExportApplicant = async (config?: {
  onDownloadProgress?: (progressEvent: any) => void;
}) => {
  const response = await authServices.get(`${EXPORT_APPLICANT}`, {
    responseType: "blob",
    timeout: 300000,
    ...config,
  });
  return response?.data;
};

export const deleteMultipleApplicant = async (
  ids: string[] | undefined | null
) => {
  if (!ids || ids.length === 0) return;

  const response = await authServices.delete(DELETE_MULTIPLE_APPLICANT, {
    data: { ids }, // Send IDs inside request body
  });
  return response?.data;
};

export const resumeUpload = async (
  formData: FormData,
  config?: {
    onUploadProgress?: (progressEvent: any) => void;
  }
) => {
  const response = await authServices.post(`${IMPORT_RESUME}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    ...config,
    timeout: 300000,
  });
  return response?.data;
};

export const listOfImportApplicants = async (params: {
  page: number;
  pageSize: number;
  totalExperience?: string;
  city?: string;
  appliedSkills?: string;
  startDate?: string;
  endDate?: string;
  currentCity?: string;
  noticePeriod?: string;
  status?: string;
  interviewStage?: string;
  gender?: string;
  expectedPkg?: string;
  currentCompanyDesignation?: string;
  state?: string;
  currentPkg?: string;
  anyHandOnOffers?: string;
  rating?: string;
  workPreference?: string;
}) => {
  const response = await authServices.get(`${IMPORT_APPLICANT_LIST}`, {
    params,
  });
  return response?.data;
};
