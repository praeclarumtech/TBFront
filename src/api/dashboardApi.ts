import { TOTAL_APPLICANTS,RECENT_APPLICANTS,APPLICANTS_DETAILS } from "./apiRoutes";
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



