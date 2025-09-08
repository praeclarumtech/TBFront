import {
  SKILL_STATISTICS,
  APPLICATION_ON_PROCESS,
  STATUS_OF_APPLICATION,
  APPLICATION,
  CITY_STATE,
  ADDEDBY_REPORT,
  VENDOR_JOB_APPLICANTS,
  APPLICANTS_GENDER_WORKPREF_NOTICE,
  ROLE_APPLICANTS,
} from "./apiRoutes";
import { authServices } from "./apiServices";

export const getSkillStatistics = async (selectedFilter = "") => {
  const response = await authServices.get(
    `${SKILL_STATISTICS}${selectedFilter || "Frontend"}`
  );
  return response?.data;
};

export const getApplicationOnProcess = async () => {
  const response = await authServices.get(`${APPLICATION_ON_PROCESS}`);
  return response?.data;
};

export const getStatusOfApplication = async () => {
  const response = await authServices.get(`${STATUS_OF_APPLICATION}`);
  return response?.data;
};

export const getApplication = async (cType: string) => {
  const response = await authServices.get(`${APPLICATION}${cType}`);
  return response?.data;
};

export const getCityState = async (type = "") => {
  const response = await authServices.get(`${CITY_STATE}${type || "city"}`);
  return response?.data;
};

export const getaddedbyReport = async (startDate: string, endDate: string) => {
  const response = await authServices.get(
    `${ADDEDBY_REPORT}?startDate=${decodeURIComponent(
      startDate
    )}&endDate=${decodeURIComponent(endDate)}`
  );
  return response?.data;
};

export const getVendorJobApplicats = async () => {
  const response = await authServices.get(`${VENDOR_JOB_APPLICANTS}`);
  return response?.data;
};

export const getApplicationsByGenderWorkNotice = async (params: {
  gender?: string;
  workPreference?: string;
  search?: string;
  noticePeriod?: string;
}) => {
  const response = await authServices.get(
    `${APPLICANTS_GENDER_WORKPREF_NOTICE}`,
    {
      params,
    }
  );
  return response?.data;
};

export const getRoleWiseReport = async () => {
  const response = await authServices.get(`${ROLE_APPLICANTS}`);
  return response?.data;
};
