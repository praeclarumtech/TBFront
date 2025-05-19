import { ACTIVE, IN_ACTIVE } from "./apiRoutes";
import { authServices } from "./apiServices";

export const activeApplicant = async (data?: string) => {
  const response = await authServices.patch(`${ACTIVE}/${data}`);
  return response?.data;
};

export const inActiveApplicant = async (data?: string) => {
  const response = await authServices.patch(`${IN_ACTIVE}/${data}`);
  return response?.data;
};
