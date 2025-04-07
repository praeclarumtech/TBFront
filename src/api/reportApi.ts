
import { SKILL_STATISTICS, APPLICATION_ON_PROCESS, STATUS_OF_APPLICATION, APPLICATION } from "./apiRoutes";
import { authServices } from "./apiServices";

export const getSkillStatistics = async (selectedFilter = "") => {
    const response = await authServices.get(`${SKILL_STATISTICS}${selectedFilter || "frontend"}`);
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
  
// import axios from "axios";
// const API_BASE_URL = "https://tbapi-jtu7.onrender.com/api/reports/applicants";

// export const getSkillStatistics = async () => {
//     try{
//         const response = await axios.get(`${API_BASE_URL}/technologyStatistics`);
//         return response.data
//     }catch (error){
//         console.log("Error fetching Api :- ",error);
//         throw error
//     }
// }

// export const getApplicationOnProcess = async () => {
//     try{
//         const response = await axios.get(`${API_BASE_URL}/applicationOnProcessCount`)
//         return response.data
//     }catch (error){
//         console.log("Error fetching Api :-",error);
//         throw error
//     }
// }

// export const getStatusOfApplication = async () => {
//     try{
//         const response = await axios.get(`${API_BASE_URL}/statusByPercentage`)
//         return response.data
//     }catch (error){
//         console.log("Error fetching Api :-",error);
//         throw error
//     }
// }
// export const getApplication = async (cType: string) => {
//     try{
//         const response = await axios.get(`${API_BASE_URL}/getApplicationsByDate?calendarType=${cType}`)
//         return response.data
//     }catch (error){
//         console.log("Error fetching Api :-",error);
//         throw error
//     }
// }