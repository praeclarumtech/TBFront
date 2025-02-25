import { CREATE_APPLICANT } from "./apiRoutes";
import { authServices } from "./apiServices";

export const listOfApplicants = async (data?: object) => {
  const response = await authServices.get(`${CREATE_APPLICANT}`, data);
  return response?.data;
};