import axios from 'axios';

const API_URL = 'http://localhost:3000/api/applicants';

export const fetchApplicants = async (params = {}) => {
  const response = await axios.get(`${API_URL}/viewAllApplicant`, { params });
  return response.data;
};

export const deleteApplicant = async (id: string) => {
  const response = await axios.delete(`${API_URL}/deleteApplicant/${id}`);
  return response.data;
};

export const viewApplicant = async (id: string) => {
  const response = await axios.get(`${API_URL}/viewApplicant/${id}`);
  return response.data;
};

export const updateApplicantStatus = async (id: string, data: { status: string }) => {
  const response = await axios.put(`${API_URL}/updateApplicant/${id}`, data);
  return response.data;
};

export const updateApplicantInterviewStage = async (id: string, data: { interviewStage: string }) => {
  const response = await axios.put(`${API_URL}/updateApplicant/${id}`, data);
  return response.data;
};