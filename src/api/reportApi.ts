import axios from "axios";

const API_BASE_URL = "https://tbapi-jtu7.onrender.com/api/reports/applicants";

export const getSkillStatistics = async () => {
    try{
        const response = await axios.get(`${API_BASE_URL}/technologyStatistics`);
        return response.data
    }catch (error){
        console.log("Error fetching Api :- ",error);
        throw error
    }
}

export const getApplicationOnProcess = async () => {
    try{
        const response = await axios.get(`${API_BASE_URL}/applicationOnProcessCount`)
        return response.data
    }catch (error){
        console.log("Error fetching Api :-",error);
        throw error
    }
}

export const getStatusOfApplication = async () => {
    try{
        const response = await axios.get(`${API_BASE_URL}/statusByPercentage`)
        return response.data
    }catch (error){
        console.log("Error fetching Api :-",error);
        throw error
    }
}
export const getApplication = async (cType: string) => {
    try{
        const response = await axios.get(`${API_BASE_URL}/getApplicationsByDate?calendarType=${cType}`)
        return response.data
    }catch (error){
        console.log("Error fetching Api :-",error);
        throw error
    }
}