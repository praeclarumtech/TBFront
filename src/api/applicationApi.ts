import { GET_APPLICATIONS_BY_ROLE } from "./apiRoutes";
import { authServices } from "./apiServices";

export interface ApplicationFilters {
  role: "client" | "vendor";
  page?: number;
  limit?: number;
  job_id?: string;
  applicant_id?: string;
  vendor_id?: string;
  client_id?: string;
  status?: string;
  search?: string;
}

export const getApplicationsByRole = async (params: ApplicationFilters) => {
  const response = await authServices.get(`${GET_APPLICATIONS_BY_ROLE}`, {
    params,
  });
  return response?.data;
};
