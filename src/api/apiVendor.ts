import {
  ADD_JOB_APPLICATION,
  DELETE_APPLICANT_VENDOR,
  JOB_SCORE,
  UPDATE_APPLICANT_STAGE_VENDOR,
  VIEW_APPLICANT_BY_ID_VENDOR,
  VIEW_APPLIED_JOB_APPLICANTS,
  VIEW_APPLIED_JOB_USER,
} from "./apiRoutes";
import { authServices } from "./apiServices";

export const viewAppliedJob = async () =>
  //     params: {
  //   search?: string;
  //   page?: number;
  //   pageSize?: number;
  //   limit?: number;
  // }
  {
    const response = await authServices.get(
      `${VIEW_APPLIED_JOB_USER}`
      // , {
      // params,
      //   }
    );
    return response?.data;
  };

export const getJobScore = async (
  resume: File,
  jobDescriptionFile?: File,
  jobDescriptionText?: string
) => {
  const formData = new FormData();
  formData.append("resume", resume);

  if (jobDescriptionFile) {
    formData.append("jobDescriptionFile", jobDescriptionFile);
  }

  if (jobDescriptionText) {
    formData.append("jobDescription", jobDescriptionText);
  }

  const response = await authServices.post(JOB_SCORE, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response?.data;
};

export const addJobApplicant = async (resume: File, job_id?: string) => {
  const formData = new FormData();
  formData.append("resume", resume);

  if (job_id) {
    formData.append("job_id", job_id);
  }

  const response = await authServices.post(ADD_JOB_APPLICATION, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response?.data;
};

export const viewAllJobApplicants = async (
  params: {
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
    filterBy?: string;
  } = {}
) => {
  const response = await authServices.get(`${VIEW_APPLIED_JOB_APPLICANTS}`, {
    params,
  });
  return response?.data;
};

export const getApplicantDetailsInVendor = async (
  id: string | undefined | null
) => {
  const response = await authServices.get(
    `${VIEW_APPLICANT_BY_ID_VENDOR}/${id}`
  );
  return response?.data;
};

export const deleteApplicantVendor = async (
  ids: string[] | undefined | null
) => {
  const response = await authServices.delete(`${DELETE_APPLICANT_VENDOR}`, {
    data: { ids },
  });
  return response?.data;
};

export const updateStageVendor = async (
  data: { interviewStage: string },
  id: string
) => {
  const response = await authServices.put(
    `${UPDATE_APPLICANT_STAGE_VENDOR}/${id}`,
    data
  );

  return response?.data;
};

export const updateStatusVendor = async (
  data: { status: string },
  id: string
) => {
  const response = await authServices.put(
    `${UPDATE_APPLICANT_STAGE_VENDOR}/${id}`,
    data
  );

  return response?.data;
};
