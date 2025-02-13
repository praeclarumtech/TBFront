// src/services/applicantService.ts
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/applicant';

export const fetchApplicants = async () => {
  return await axios.get(`${API_URL}/view`);
};

export const updateApplicant = async (id: string, data: any) => {
  return await axios.put(`${API_URL}/update/${id}`, data);
};

export const deleteApplicant = async (id: string) => {
  return await axios.delete(`${API_URL}/delete/${id}`);
};

export const getApplicantById = async (id: string) => {
  return await axios.get(`${API_URL}/view/${id}`);
};