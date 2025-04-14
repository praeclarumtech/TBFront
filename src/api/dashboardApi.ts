import { TOTAL_APPLICANTS,RECENT_APPLICANTS,APPLICANTS_DETAILS, REPORT_ON_SKILL } from "./apiRoutes";
import { authServices } from "./apiServices";

export const getTotalApplicants = async () => {
  const response = await authServices.get(`${TOTAL_APPLICANTS}`);
  return response?.data;
};

export const getRecentApplications = async (appliedSkills = "") => {
  const response = await authServices.get(`${RECENT_APPLICANTS}${appliedSkills || ""}`);
  return response?.data;
};

export const getApplicantsDetails = async (selectedFilter = "") => {
    const response = await authServices.get(`${APPLICANTS_DETAILS}${selectedFilter || "Frontend"}`);
    return response?.data;
  };



export const getChartDetails = async (ids: string[]) => {
  const response = await authServices.post(`${REPORT_ON_SKILL}`, {"skillIds" : ids});
  return response?.data;
};

