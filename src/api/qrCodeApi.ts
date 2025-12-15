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

export interface SendQrCodeInvitePayload {
  recipients: string[];
  templateType: string;
  message: string;
  recipientType: "vendor" | "client";
}

export const sendQrCodeInvite = async (data: SendQrCodeInvitePayload) => {
  try {
    const response = await authServices.post("/qr-code/send-invite", data);
    return response?.data;
  } catch (error) {
    console.error("Error sending QR code invite:", error);
    throw error;
  }
};

