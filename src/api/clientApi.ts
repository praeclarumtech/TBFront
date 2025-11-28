import {
  CREATE_CLIENT_QR,
  UPDATE_CLIENT_QR,
  VIEW_CLIENT,
} from "./apiRoutes";
import { authServices } from "./apiServices";

export const createClientQR = async (data?: object, isFormData = false) => {
  if (isFormData && data instanceof FormData) {
    const response = await authServices.post(`${CREATE_CLIENT_QR}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response?.data;
  } else {
    const response = await authServices.post(`${CREATE_CLIENT_QR}`, data);
    return response?.data;
  }
};

export const updateClientQR = async (
  data: object,
  id: string | undefined | null,
  isFormData = false
) => {
  if (isFormData && data instanceof FormData) {
    const response = await authServices.put(
      `${UPDATE_CLIENT_QR}/${id}`,
      data,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response?.data;
  } else {
    const response = await authServices.put(
      `${UPDATE_CLIENT_QR}/${id}`,
      data
    );
    return response?.data;
  }
};

export const getClientDetails = (id: string | undefined | null) => {
  return authServices
    .get(`${VIEW_CLIENT}/${id}`)
    .then((res: any) => {
      return res.data;
    })
    .catch((error) => {
      throw error;
    });
};

