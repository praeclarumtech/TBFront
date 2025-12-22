import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  getSettings,
  updateDateTimeSettings,
  updateEmailTemplateVisibility,
  getTemplatesByContext,
} from "api/settingsApi";
import toastify from "utils/toastify";
import MESSAGES from "constants/messageConstants";

// Types for settings
export interface DateFormatOption {
  label: string;
  value: string;
  example: string;
}

export interface TemplateVisibility {
  templateType: string;
  templateName: string;
  vendor: boolean;
  client: boolean;
  job: boolean;
  qrCode: boolean;
  custom: boolean;
}

export interface AppSettings {
  dateFormat: string;
  timeFormat: string;
  timezone: string;
  emailTemplateVisibility: TemplateVisibility[];
}

// Template context types for filtering
export type TemplateContext = "vendor" | "client" | "job" | "qrcode" | "custom";

// Default settings
export const defaultSettings: AppSettings = {
  dateFormat: "DD/MM/YYYY",
  timeFormat: "12h",
  timezone: "IST",
  emailTemplateVisibility: [],
};

// Available date format options
export const dateFormatOptions: DateFormatOption[] = [
  { label: "DD/MM/YYYY", value: "DD/MM/YYYY", example: "25/12/2024" },
  { label: "MM/DD/YYYY", value: "MM/DD/YYYY", example: "12/25/2024" },
  { label: "YYYY-MM-DD", value: "YYYY-MM-DD", example: "2024-12-25" },
  { label: "DD-MM-YYYY", value: "DD-MM-YYYY", example: "25-12-2024" },
  { label: "DD MMM YYYY", value: "DD MMM YYYY", example: "25 Dec 2024" },
  { label: "MMM DD, YYYY", value: "MMM DD, YYYY", example: "Dec 25, 2024" },
  {
    label: "MMMM DD, YYYY",
    value: "MMMM DD, YYYY",
    example: "December 25, 2024",
  },
  { label: "DD MMMM YYYY", value: "DD MMMM YYYY", example: "25 December 2024" },
];

export const timeFormatOptions = [
  { label: "12 Hour (AM/PM)", value: "12h" },
  { label: "24 Hour", value: "24h" },
];

type SettingsContextType = {
  settings: AppSettings;
  isLoading: boolean;
  updateSetting: <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ) => void;
  updateTemplateVisibility: (
    templateType: string,
    context: keyof Omit<TemplateVisibility, "templateType" | "templateName">,
    enabled: boolean
  ) => void;
  toggleAllTemplatesForContext: (
    context: keyof Omit<TemplateVisibility, "templateType" | "templateName">,
    enabled: boolean
  ) => void;
  refetchTemplates: () => Promise<void>;
  resetSettings: () => void;
  saveDateTimeSettings: () => Promise<void>;
  saveTemplateVisibilitySettings: () => Promise<void>;
  saveSettings: () => Promise<void>;
  fetchTemplatesForContext: (
    context: TemplateContext
  ) => Promise<{ label: string; value: string }[]>;
  fetchAllEmailTemplates: () => Promise<{ label: string; value: string }[]>;
  formatDate: (date: Date | string) => string;
  getVisibleTemplates: (context: TemplateContext) => string[];
  isTemplateVisibleInContext: (
    templateType: string,
    context: TemplateContext
  ) => boolean;
  filterTemplatesByContext: <T extends { value: string; label: string }>(
    templates: T[],
    context: TemplateContext
  ) => T[];
};

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};

// Storage key for local persistence
const SETTINGS_STORAGE_KEY = "app_settings";

function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(() => {
    // Try to load from localStorage first
    const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        return {
          ...defaultSettings,
          ...parsed,
        };
      } catch {
        return defaultSettings;
      }
    }
    return defaultSettings;
  });
  const [isLoading, setIsLoading] = useState(false);

  // Fetch settings from API on mount
  const fetchSettings = useCallback(async () => {
    // Check if user is authenticated before making API calls
    const authToken = localStorage.getItem("authUser");
    if (!authToken) {
      // User not logged in, use local settings only
      return;
    }

    setIsLoading(true);
    try {
      const settingsResponse = await getSettings().catch(() => ({
        success: false,
        data: null,
      }));

      if (settingsResponse?.data) {
        const mergedSettings: AppSettings = {
          ...defaultSettings,
          ...settingsResponse.data,
        };

        setSettings(mergedSettings);
        localStorage.setItem(
          SETTINGS_STORAGE_KEY,
          JSON.stringify(mergedSettings)
        );
      }
    } catch (error) {
      console.log("Using local settings", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update a single setting
  const updateSetting = useCallback(
    <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
      setSettings((prev) => {
        const newSettings = { ...prev, [key]: value };
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(newSettings));
        return newSettings;
      });
    },
    []
  );

  // Update template visibility for a specific template and context
  const updateTemplateVisibility = useCallback(
    (
      templateType: string,
      context: keyof Omit<TemplateVisibility, "templateType" | "templateName">,
      enabled: boolean
    ) => {
      setSettings((prev) => {
        const newVisibility = prev.emailTemplateVisibility.map((tpl) =>
          tpl.templateType === templateType
            ? { ...tpl, [context]: enabled }
            : tpl
        );
        const newSettings = { ...prev, emailTemplateVisibility: newVisibility };
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(newSettings));
        return newSettings;
      });
    },
    []
  );

  // Toggle all templates for a specific context
  const toggleAllTemplatesForContext = useCallback(
    (
      context: keyof Omit<TemplateVisibility, "templateType" | "templateName">,
      enabled: boolean
    ) => {
      setSettings((prev) => {
        const newVisibility = prev.emailTemplateVisibility.map((tpl) => ({
          ...tpl,
          [context]: enabled,
        }));
        const newSettings = { ...prev, emailTemplateVisibility: newVisibility };
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(newSettings));
        return newSettings;
      });
    },
    []
  );

  // Reset to default settings
  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(defaultSettings));
    toastify("Settings reset to defaults", { type: "success" });
  }, []);

  // Save date & time settings to API
  const saveDateTimeSettings = useCallback(async () => {
    setIsLoading(true);
    try {
      await updateDateTimeSettings({
        dateFormat: settings.dateFormat,
        timeFormat: settings.timeFormat,
        timezone: settings.timezone,
      });
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
      toastify("Date & Time settings saved successfully", { type: "success" });
    } catch (error) {
      toastify(MESSAGES.ERROR.SOMETHING_WRONG.toString(), { type: "error" });
    } finally {
      setIsLoading(false);
    }
  }, [settings]);

  // Save email template visibility settings to API
  const saveTemplateVisibilitySettings = useCallback(async () => {
    setIsLoading(true);
    try {
      await updateEmailTemplateVisibility(settings.emailTemplateVisibility);
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
      toastify("Email template settings saved successfully", {
        type: "success",
      });
    } catch (error) {
      toastify(MESSAGES.ERROR.SOMETHING_WRONG.toString(), { type: "error" });
    } finally {
      setIsLoading(false);
    }
  }, [settings]);

  // Save all settings (calls both APIs)
  const saveSettings = useCallback(async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        updateDateTimeSettings({
          dateFormat: settings.dateFormat,
          timeFormat: settings.timeFormat,
          timezone: settings.timezone,
        }),
        updateEmailTemplateVisibility(settings.emailTemplateVisibility),
      ]);
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
      toastify("Settings saved successfully", { type: "success" });
    } catch (error) {
      toastify(MESSAGES.ERROR.SOMETHING_WRONG.toString(), { type: "error" });
    } finally {
      setIsLoading(false);
    }
  }, [settings]);

  // Fetch templates for a specific context from API
  const fetchTemplatesForContext = useCallback(
    async (
      context: TemplateContext
    ): Promise<{ label: string; value: string }[]> => {
      try {
        const apiContext = context === "qrcode" ? "qrCode" : context;
        const response = await getTemplatesByContext(
          apiContext as "vendor" | "client" | "job" | "qrCode" | "custom"
        );
        if (response?.success && response?.data) {
          return response.data;
        }
        // Fallback to local filtering if API fails
        return getVisibleTemplates(context).map((type) => ({
          label: type,
          value: type,
        }));
      } catch (error) {
        // Fallback to local filtering
        return getVisibleTemplates(context).map((type) => ({
          label: type,
          value: type,
        }));
      }
    },
    []
  );

  // Format template type to readable label (e.g., "APPLICATION_RECEIVED" -> "Application Received")
  const formatTemplateLabel = (type: string): string => {
    return type
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  // Fetch all email templates for custom context from API
  const fetchAllEmailTemplates = useCallback(async (): Promise<
    { label: string; value: string }[]
  > => {
    try {
      const response = await getTemplatesByContext("custom");
      if (response?.success && response?.data) {
        // Format labels to be more readable
        return response.data.map((template) => ({
          label: formatTemplateLabel(template.value),
          value: template.value,
        }));
      }
      return [];
    } catch (error) {
      console.error("Error fetching email templates:", error);
      return [];
    }
  }, []);

  // Format date according to current settings
  const formatDate = useCallback(
    (date: Date | string): string => {
      const d = typeof date === "string" ? new Date(date) : date;
      if (isNaN(d.getTime())) return "-";

      const day = d.getDate().toString().padStart(2, "0");
      const month = (d.getMonth() + 1).toString().padStart(2, "0");
      const year = d.getFullYear().toString();

      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      const monthShort = monthNames[d.getMonth()].substring(0, 3);
      const monthFull = monthNames[d.getMonth()];

      switch (settings.dateFormat) {
        case "DD/MM/YYYY":
          return `${day}/${month}/${year}`;
        case "MM/DD/YYYY":
          return `${month}/${day}/${year}`;
        case "YYYY-MM-DD":
          return `${year}-${month}-${day}`;
        case "DD-MM-YYYY":
          return `${day}-${month}-${year}`;
        case "DD MMM YYYY":
          return `${day} ${monthShort} ${year}`;
        case "MMM DD, YYYY":
          return `${monthShort} ${day}, ${year}`;
        case "MMMM DD, YYYY":
          return `${monthFull} ${day}, ${year}`;
        case "DD MMMM YYYY":
          return `${day} ${monthFull} ${year}`;
        default:
          return `${day}/${month}/${year}`;
      }
    },
    [settings.dateFormat]
  );

  // Get context key from TemplateContext
  const getContextKey = (
    context: TemplateContext
  ): keyof Omit<TemplateVisibility, "templateType" | "templateName"> => {
    switch (context) {
      case "vendor":
        return "vendor";
      case "client":
        return "client";
      case "job":
        return "job";
      case "qrcode":
        return "qrCode";
      case "custom":
        return "custom";
      default:
        return "custom";
    }
  };

  // Get visible templates for a specific context
  const getVisibleTemplates = useCallback(
    (context: TemplateContext): string[] => {
      const contextKey = getContextKey(context);
      return settings.emailTemplateVisibility
        .filter((tpl) => tpl[contextKey])
        .map((tpl) => tpl.templateType);
    },
    [settings.emailTemplateVisibility]
  );

  // Check if a template is visible in a specific context
  const isTemplateVisibleInContext = useCallback(
    (templateType: string, context: TemplateContext): boolean => {
      const contextKey = getContextKey(context);
      const template = settings.emailTemplateVisibility.find(
        (tpl) =>
          tpl.templateType === templateType ||
          tpl.templateType.toLowerCase() === templateType.toLowerCase()
      );
      return template ? template[contextKey] : true; // Default to visible if not found
    },
    [settings.emailTemplateVisibility]
  );

  // Filter templates array by context
  const filterTemplatesByContext = useCallback(
    <T extends { value: string; label: string }>(
      templates: T[],
      context: TemplateContext
    ): T[] => {
      const visibleTemplates = getVisibleTemplates(context);
      return templates.filter(
        (tpl) =>
          visibleTemplates.some(
            (vt) => vt.toLowerCase() === tpl.value.toLowerCase()
          ) ||
          // If template not in settings, show it by default
          !settings.emailTemplateVisibility.some(
            (st) => st.templateType.toLowerCase() === tpl.value.toLowerCase()
          )
      );
    },
    [getVisibleTemplates, settings.emailTemplateVisibility]
  );

  const value: SettingsContextType = {
    settings,
    isLoading,
    updateSetting,
    updateTemplateVisibility,
    toggleAllTemplatesForContext,
    resetSettings,
    saveDateTimeSettings,
    saveTemplateVisibilitySettings,
    saveSettings,
    fetchTemplatesForContext,
    fetchAllEmailTemplates,
    formatDate,
    getVisibleTemplates,
    isTemplateVisibleInContext,
    filterTemplatesByContext,
    refetchTemplates: fetchSettings,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export default SettingsProvider;
