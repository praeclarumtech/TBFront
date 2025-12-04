import {
  CREATE_JOB,
  DELETE_JOB,
  UPDATE_JOB,
  VIEW_ALL_JOB,
  VIEW_JOB_ID,
  VIEW_JOB_PUBLIC,
  CHECK_EMAIL_FOR_JOB,
  APPLY_JOB,
  VIEW_JOB_APPLICANTS,
  JOB_EMAIL_RECIPIENTS,
  JOB_SEND_EMAIL,
  NOTIFY_MATCHING_APPLICANTS,
} from "./apiRoutes";
import { authServices } from "./apiServices";

export const viewAllJob = async (params: {
  search?: string;
  page?: number;
  pageSize?: number;
  limit?: number;
  filterBy?: string;
}) => {
  const response = await authServices.get(`${VIEW_ALL_JOB}`, {
    params,
  });
  return response?.data;
};

export const createJob = async (data?: object) => {
  const response = await authServices.post(`${CREATE_JOB}`, data);
  return response?.data;
};

export const deleteJob = async (ids: string[] | undefined | null) => {
  const response = await authServices.delete(`${DELETE_JOB}`, {
    data: { ids },
  });
  return response?.data;
};

export const viewJobById = async (data: { _id: any } = { _id: "" }) => {
  const response = await authServices.get(`${VIEW_JOB_ID}/${data?._id}`);
  return response?.data;
};

export const updateJob = async (id: string, data: any) => {
  const response = await authServices.put(`${UPDATE_JOB}/${id}`, data);
  return response?.data;
};

export const viewAllJobPublic = async (params: {
  search?: string;
  page?: number;
  pageSize?: number;
  limit?: number;
  salary_frequency?: string;
  required_skills?: string;
  min_experience?: string;
  work_preference?: string;
  min_salary?: number;
  job_subject?: string;
  job_description?: string;
  job_location?: string;
}) => {
  const response = await authServices.get(`${VIEW_JOB_PUBLIC}`, {
    params,
  });
  return response?.data;
};

export const checkEmailForJob = async (jobId: string, email: string) => {
  const response = await authServices.post(
    `${CHECK_EMAIL_FOR_JOB}/${jobId}/check-email`,
    {
      email,
    }
  );
  return response?.data;
};

export const applyJob = async (
  jobId: string,
  email: string,
  resume?: File | null
) => {
  const response = await authServices.post(`${APPLY_JOB}/${jobId}`, {
    email,
    resume,
  });
  return response?.data;
};

export const getJobApplicants = async (
  jobId: string,
  params?: {
    page?: number;
    pageSize?: number;
    limit?: number;
  }
) => {
  const response = await authServices.get(
    `${VIEW_JOB_APPLICANTS}/${jobId}/applicants`,
    {
      params,
    }
  );
  return response?.data;
};

export const getJobEmailRecipients = async (
  type: string,
  params?: { limit?: number },
  jobId?: string
) => {
  const response = await authServices.get(
    `${JOB_EMAIL_RECIPIENTS}?type=${type}${jobId ? `&jobId=${jobId}` : ""}`,
    {
      params,
    }
  );
  return response?.data;
};

export const sendJobEmail = async (
  jobId: string,
  data: {
    vendorIds?: string[];
    applicantIds?: string[];
    customMessage?: string;
    emailTemplateId?: string;
  }
) => {
  const response = await authServices.post(
    `${JOB_SEND_EMAIL}/${jobId}/send-email`,
    data
  );
  return response?.data;
};

export const notifyMatchingApplicants = async (jobId: string) => {
  const response = await authServices.post(
    `${NOTIFY_MATCHING_APPLICANTS}/${jobId}/notify-matching-applicants`
  );
  return response?.data;
};
