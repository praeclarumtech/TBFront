
import { SKILL_STATISTICS, APPLICATION_ON_PROCESS, STATUS_OF_APPLICATION, APPLICATION } from "./apiRoutes";
import { authServices } from "./apiServices";

export const getSkillStatistics = async (selectedFilter = "") => {
    const response = await authServices.get(`${SKILL_STATISTICS}${selectedFilter || "Frontend"}`);
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
  