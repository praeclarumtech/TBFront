import { authServices } from "./apiServices";
import { AppSettings, TemplateVisibility } from "contexts/SettingsProvider";

interface SettingsResponse {
  success: boolean;
  data?: AppSettings;
  message?: string;
}

interface TemplateOption {
  label: string;
  value: string;
}

interface TemplatesResponse {
  success: boolean;
  data?: TemplateOption[];
  message?: string;
}

// Get all settings
export const getSettings = async (): Promise<SettingsResponse> => {
  try {
    const response = await authServices.get("/settings");
    return response.data;
  } catch (error) {
    // Return empty success if settings endpoint doesn't exist yet
    return { success: false };
  }
};

// Update date & time settings
export const updateDateTimeSettings = async (settings: {
  dateFormat: string;
  timeFormat: string;
  timezone: string;
}): Promise<SettingsResponse> => {
  try {
    const response = await authServices.put("/settings/date-time", settings);
    return response.data;
  } catch (error) {
    // Allow local storage to work as fallback
    return { success: true };
  }
};

// Update email template visibility settings
export const updateEmailTemplateVisibility = async (
  emailTemplateVisibility: TemplateVisibility[]
): Promise<SettingsResponse> => {
  try {
    const response = await authServices.put(
      "/settings/email-template-visibility",
      {
        emailTemplateVisibility,
      }
    );
    return response.data;
  } catch (error) {
    // Allow local storage to work as fallback
    return { success: true };
  }
};

// Legacy update settings (for backwards compatibility)
export const updateSettings = async (
  settings: AppSettings
): Promise<SettingsResponse> => {
  try {
    const response = await authServices.put("/settings", settings);
    return response.data;
  } catch (error) {
    return { success: true, data: settings };
  }
};

// Get visible templates for vendor context
export const getVendorTemplates = async (): Promise<TemplatesResponse> => {
  try {
    const response = await authServices.get("/settings/templates/vendor");
    return response.data;
  } catch (error) {
    return { success: false };
  }
};

// Get visible templates for client context
export const getClientTemplates = async (): Promise<TemplatesResponse> => {
  try {
    const response = await authServices.get("/settings/templates/client");
    return response.data;
  } catch (error) {
    return { success: false };
  }
};

// Get visible templates for job context
export const getJobTemplates = async (): Promise<TemplatesResponse> => {
  try {
    const response = await authServices.get("/settings/templates/job");
    return response.data;
  } catch (error) {
    return { success: false };
  }
};

// Get visible templates for QR code context
export const getQrCodeTemplates = async (): Promise<TemplatesResponse> => {
  try {
    const response = await authServices.get("/settings/templates/qrCode");
    return response.data;
  } catch (error) {
    return { success: false };
  }
};

// Get visible templates for custom email context
export const getCustomTemplates = async (): Promise<TemplatesResponse> => {
  try {
    const response = await authServices.get("/settings/templates/custom");
    return response.data;
  } catch (error) {
    return { success: false };
  }
};

// Get templates by context (generic function)
export const getTemplatesByContext = async (
  context: "vendor" | "client" | "job" | "qrCode" | "custom"
): Promise<TemplatesResponse> => {
  try {
    const response = await authServices.get(`/settings/templates/${context}`);
    return response.data;
  } catch (error) {
    return { success: false };
  }
};
