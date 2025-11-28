import { authServices } from "./apiServices";

export const checkEmailType = async (email: string) => {
  try {
    const response = await authServices.get("/qr-code/check-email-type", {
      params: { email },
    });
    return response?.data;
  } catch (error) {
    console.error("Error checking email type:", error);
    throw error;
  }
};

