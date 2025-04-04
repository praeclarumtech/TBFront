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

export const getApplicantsDetails = async () => {
    const response = await authServices.get(`${APPLICANTS_DETAILS}`);
    return response?.data;
  };



// const API_BASE_URL = "https://tbapi-jtu7.onrender.com/api/dashboard";

// export const getTotalApplicants = async () => {
//     try{
//         const response = await axios.get(`${API_BASE_URL}/applicant/count`);
//         return response.data
//     }catch (error){
//         console.log("Error fetching total applicants :- ",error);
//         throw error
//     }
// }
// export const getRecentApplications = async (appliedSkills = "") => {
//     try {
//         const response = await axios.get(
//             `https://tbapi-jtu7.onrender.com/api/applicants/viewAllApplicant?appliedSkills=${appliedSkills || ""}`
//         );
//         return response.data;
//     } catch (error) {
//         console.error("Error fetching recent applications:", error);
//         throw error;
//     }
// };


// export const getApplicantsDetails = async () => {
//     try{
//         const response = await axios.get(`https://tbapi-jtu7.onrender.com/api/reports/applicants/technologyStatistics`)
//         return response.data
//     }catch  (error){
//         console.log("Error fetching Applicant Details:-",error)
//         throw error
//     }
// }