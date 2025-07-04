import {
  ADD_JOB_APPLICATION,
  JOB_SCORE,
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
``;
