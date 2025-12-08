import { CREATE_VENDOR_QR, UPDATE_VENDOR_QR, VIEW_VENDOR } from "./apiRoutes";
import { authServices } from "./apiServices";

export const createVendorQR = async (data?: object, isFormData = false) => {
  if (isFormData && data instanceof FormData) {
    const response = await authServices.post(`${CREATE_VENDOR_QR}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response?.data;
  } else {
    const response = await authServices.post(`${CREATE_VENDOR_QR}`, data);
    return response?.data;
  }
};

export const updateVendorQR = async (
  data: object,
  id: string | undefined | null,
  isFormData = false
) => {
  if (isFormData && data instanceof FormData) {
    const response = await authServices.put(`${UPDATE_VENDOR_QR}/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response?.data;
  } else {
    const response = await authServices.put(`${UPDATE_VENDOR_QR}/${id}`, data);
    return response?.data;
  }
};

export const getVendorDetails = (id: string | undefined | null) => {
  return authServices
    .get(`${VIEW_VENDOR}/${id}`)
    .then((res: any) => {
      return res.data;
    })
    .catch((error) => {
      throw error;
    });
};
