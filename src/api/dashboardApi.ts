import axios from "axios";

const API_BASE_URL = "https://tbapi-jtu7.onrender.com/api/dashboard";

export const getTotalApplicants = async () => {
    try{
        const response = await axios.get(`${API_BASE_URL}/applicant/count`);
        return response.data
    }catch (error){
        console.log("Error fetching total applicants :- ",error);
        throw error
    }
}

export const getRecentApplications = async () => {
    try{
        const response = await axios.get(`${API_BASE_URL}/applicant/recentApplicant`)
        return response.data;
    }catch (error){
        console.log("Error fetching reccent application:-",error)
        throw error
    }
}

export const getApplicantsDetails = async () => {
    try{
        const response = await axios.get(`${API_BASE_URL}/applicant/applicantDetails`)
        return response.data
    }catch  (error){
        console.log("Error fetching Applicant Details:-",error)
        throw error
    }
}