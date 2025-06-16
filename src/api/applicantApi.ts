/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// // @ts-ignore
import {
  LIST_APPLICANT,
  CREATE_APPLICANT,
  DELETE_APPLICANT,
  VIEW_APPLICANT,
  UPDATE_APPLICANT,
  UPDATE_APPLICANT_STAGE,
  UPDATE_APPLICANT_STATUS,
  FILTER_APPLICANT,
  VIEW_CITY,
  IMPORT_APPLICANT,
  EXPORT_APPLICANT,
  IMPORT_RESUME,
  IMPORT_APPLICANT_LIST,
  DELETE_MULTIPLE_APPLICANT,
  EXISTING_APPLICANT,
  UPDATE_APPLICANT_MANY,
  EXPORT_IMPORT_APPLICANT,
  VIEW_IMPORTED_APPLICANT,
  DELETE_IMPORTED_MULTIPLE_APPLICANT,
  DELETE_IMPORTED_APPLICANT,
  DELETE_DUPLICATE_RECORDS,
  DUPLICATE_RECORDS,
  STATE,
  UPDATE_IMPORTED_APPLICANT,
  UPDATE_IMPORTED_APPLICANTS_STATUS,
  CREATE_APPLICANT_QR,
  UPDATE_APPLICANT_QR,
  DOWNLOAD_APPLICANT,
} from "./apiRoutes";
import { authServices } from "./apiServices";

export const listOfApplicants = async (params: {
  page?: number;
  pageSize?: number;
  limit?: number;
  totalExperience?: string;
  city?: string;
  appliedSkills?: string;
  appliedSkillsOR?: string;
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
  search?: string;
  appliedRole?: string;
  applicantName?: string;
  searchSkills?: string;
  isAcrive?: boolean;
}) => {
  const response = await authServices.get(`${LIST_APPLICANT}`, {
    params,
  });

  return response?.data;
};

export const createApplicant = async (data?: object) => {
  const response = await authServices.post(`${CREATE_APPLICANT}`, data);
  return response?.data;
};

export const CheckExistingApplicant = async (params: {
  email?: string;
  phoneNumber?: number;
  whatsappNumber?: number;
}) => {
  const response = await authServices.get(`${EXISTING_APPLICANT}`, {
    params,
  });
  return response?.data;
};

export const updateApplicant = async (
  data: object,
  id: string | undefined | null
) => {
  const response = await authServices.put(`${UPDATE_APPLICANT}/${id}`, data);
  return response?.data;
};

export const updateImportedApplicant = async (
  data: object,
  id: string | undefined | null
) => {
  const response = await authServices.put(
    `${UPDATE_IMPORTED_APPLICANT}/${id}`,
    data
  );
  return response?.data;
};

export const getApplicantDetails = async (id: string | undefined | null) => {
  const response = await authServices.get(`${VIEW_APPLICANT}/${id}`);
  return response?.data;
};

export const getImportedApplicantDetails = async (
  id: string | undefined | null
) => {
  const response = await authServices.get(`${VIEW_IMPORTED_APPLICANT}/${id}`);
  return response?.data;
};

export const deleteApplicant = async (_id: string | undefined | null) => {
  const response = await authServices.delete(`${DELETE_APPLICANT}/${_id}`);
  return response?.data;
};

export const deleteImportedApplicant = async (
  _id: string | undefined | null
) => {
  const response = await authServices.delete(
    `${DELETE_IMPORTED_APPLICANT}/${_id}`
  );
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

export const updateImportedApplicantsStatus = async (
  data: { status: string },
  id: string
) => {
  const response = await authServices.put(
    `${UPDATE_IMPORTED_APPLICANTS_STATUS}/${id}`,
    data
  );

  return response?.data;
};

export const updateImportedApplicantsStage = async (
  data: { interviewStage: string },
  id: string
) => {
  const response = await authServices.put(
    `${UPDATE_IMPORTED_APPLICANTS_STATUS}/${id}`,
    data
  );

  return response?.data;
};

export const filterApplicants = async () => {
  const response = await authServices.get(`${FILTER_APPLICANT}`);
  return response?.data;
};

export const city = async () => {
  const response = await authServices.get(`${VIEW_CITY}`);
  return response?.data;
};
export const state = async () => {
  const response = await authServices.get(`${STATE}`);
  return response?.data;
};

export const importApplicant = async (
  formData: FormData,
  config?: { onUploadProgress?: (progressEvent: any) => void; params?: any }
) => {
  const url = `${IMPORT_APPLICANT}`;

  const response = await authServices.post(url, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    params: config?.params,
    ...config,
    timeout: 300000,
  });

  return response.data;
};

import qs from "qs"; // You can install this with `npm install qs` if not already

export const ExportApplicant = async (
  queryParams: {
    source?: string;
    page?: number;
    pageSize?: number;
    limit?: number;
    totalExperience?: string;
    city?: string;
    appliedSkills?: string;
    appliedSkillsOR?: string;
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
    search?: string;
    appliedRole?: string;
    applicantName?: string;
    searchSkills?: string;
    isAcrive?: boolean;
  },
  payload?: { ids: string[]; fields: string[]; main: boolean }
) => {
  const queryString = qs.stringify(queryParams, { arrayFormat: "repeat" });

  const response = await authServices.post(
    `${EXPORT_APPLICANT}?${queryString}`,
    payload,
    {
      headers: {
        "Content-Type": "application/json",
      },
      responseType: "blob", // This is correct for downloading files
      timeout: 300000,
    }
  );

  return response.data;
};

export const ExportImportedApplicant = async (
  queryParams: { filtered: string },
  payload: { ids: string[]; fields: string[] }
) => {
  const { filtered } = queryParams;

  const response = await authServices.post(
    `${EXPORT_IMPORT_APPLICANT}?filtered=${encodeURIComponent(filtered)}`,
    payload,
    {
      headers: {
        "Content-Type": "application/json",
      },
      responseType: "blob",
      timeout: 300000,
    }
  );

  return response.data;
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
  page?: number;
  pageSize?: number;
  limit?: number;
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
  search?: string;
  appliedRole?: string;
  applicantName?: string;
  searchSkills?: string;
}) => {
  // If applicantName or searchSkills are present, remove pagination and limit parameters
  if (params.search) {
    const { page, pageSize, limit, ...searchParams } = params;
    params = { ...searchParams };
  }

  const response = await authServices.get(`${IMPORT_APPLICANT_LIST}`, {
    params,
  });

  return response?.data;
};

export const updateManyApplicants = async (
  applicantIds: string[],
  updateData: object,
 
) => {
  const response = await authServices.put(UPDATE_APPLICANT_MANY, {
    applicantIds: applicantIds,
    updateData: updateData,
  
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

export const deleteImportedMultipleApplicant = async (
  ids: string[] | undefined | null
) => {
  if (!ids || ids.length === 0) return;

  const response = await authServices.delete(
    DELETE_IMPORTED_MULTIPLE_APPLICANT,
    {
      data: { ids }, // Send IDs inside request body
    }
  );
  return response?.data;
};

export const duplicateApplicants = async (data?: object) => {
  const response = await authServices.get(`${DUPLICATE_RECORDS}`, {
    data,
  });
  return response?.data;
};

export const deleteDuplicateApplicants = async (data?: object) => {
  const response = await authServices.delete(`${DELETE_DUPLICATE_RECORDS}`, {
    data,
  });
  return response?.data;
};

export const createApplicantQR = async (data?: object, isFormData = false) => {
  if (isFormData && data instanceof FormData) {
    const response = await authServices.post(`${CREATE_APPLICANT_QR}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response?.data;
  } else {
    const response = await authServices.post(`${CREATE_APPLICANT_QR}`, data);
    return response?.data;
  }
};

export const updateApplicantQR = async (
  data: object,
  id: string | undefined | null,
  isFormData = false
) => {
  if (isFormData && data instanceof FormData) {
    const response = await authServices.put(
      `${UPDATE_APPLICANT_QR}/${id}`,
      data,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response?.data;
  } else {
    const response = await authServices.put(
      `${UPDATE_APPLICANT_QR}/${id}`,
      data
    );
    return response?.data;
  }
};

export const downloadApplicant = async (data?: object) => {
  const response = await authServices.get(`${DOWNLOAD_APPLICANT}`, {
    data,
    headers: {
      "Content-Type": "application/json",
    },
    responseType: "blob", // This is correct for downloading files
    timeout: 300000,
  });
  return response?.data;
};
