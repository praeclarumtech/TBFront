import {
  LIST_APPLICANT,
  CREATE_APPLICANT,
  DELETE_APPLICANT,
  VIEW_APPLICANT,
  UPDATE_APPLICANT,
  UPDATE_APPLICANT_STAGE,
  UPDATE_APPLICANT_STATUS,
  FILTER_APPLICANT,
  CITY,
} from "./apiRoutes";
import { authServices } from "./apiServices";

export const listOfApplicants = async (params: {
  page: number;
  pageSize: number;
  totalExperience?: string;
  city?: string;
  appliedSkills?: string;
  startDate?: string;
  endDate?: string;
  currentCity?: string;
  noticePeriod?: string;
  status?: string;
  interviewStage?: string;
  gender?: string;
  expectedPkg?: string;
  currentCompanyDesignation?: string;
  state?: string;
  currentPkg?: string;
  anyHandOnOffers?: string;
  rating?: string;
  workPreference?: string;
}) => {
  const response = await authServices.get(`${LIST_APPLICANT}`, { params });
  return response?.data;
};

export const createApplicant = async (data?: object) => {
  const response = await authServices.post(`${CREATE_APPLICANT}`, data);
  return response?.data;
};

export const updateApplicant = async (
  data: object,
  id: string | undefined | null
) => {
  const response = await authServices.put(`${UPDATE_APPLICANT}/${id}`, data);
  return response?.data;
};

export const getApplicantDetails = async (id: string | undefined | null) => {
  const response = await authServices.get(`${VIEW_APPLICANT}/${id}`);
  return response?.data;
};

export const deleteApplicant = async (_id: string | undefined | null) => {
  const response = await authServices.delete(`${DELETE_APPLICANT}/${_id}`);
  return response?.data;
};

export const updateStatus = async (data: { status: string }, id: string) => {
  const response = await authServices.put(
    `${UPDATE_APPLICANT_STATUS}/${id}`,
    data
  );

  return response?.data;
};

export const updateStage = async (
  data: { interviewStage: string },
  id: string
) => {
  const response = await authServices.put(
    `${UPDATE_APPLICANT_STAGE}/${id}`,
    data
  );

  return response?.data;
};
export const filterApplicants = async () => {
  const response = await authServices.get(`${FILTER_APPLICANT}`);
  return response?.data;
};

export const city = async () => {
  const response = await authServices.get(`${CITY}`);
  return response?.data;
};