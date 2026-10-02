export const DURATION_OPTIONS = [
  { label: "15 Days", value: "15 Days" },
  { label: "1 Month", value: "1 Month" },
  { label: "3 Month", value: "3 Month" },
  { label: "4 - 6 Month", value: "4 - 6 Month" },
];

export const GENDER_OPTIONS = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" },
];

export const APPLICANT_TYPE_OPTIONS = [
  { label: "Student", value: "student" },
  { label: "Employee", value: "employee" },
  { label: "Other", value: "other" },
];

export const SEMESTER_OPTIONS = Array.from({ length: 8 }, (_, index) => ({
  label: `Semester ${index + 1}`,
  value: `Semester ${index + 1}`,
}));

export const INTEREST_OPTIONS = [
  { label: "Online", value: "online" },
  { label: "Offline", value: "offline" },
  { label: "Hybrid", value: "hybrid" },
];

export const trainingFormPath = "/application-form";

export const publicTrainingFormUrl = () => {
  const base = import.meta.env.BASE_URL || "/";
  const normalized = base.endsWith("/") ? base : `${base}/`;
  return `${window.location.origin}${normalized}application-form`;
};

export const applicantFullName = (name?: {
  firstName?: string;
  middleName?: string;
  lastName?: string;
}) =>
  [name?.firstName, name?.middleName, name?.lastName].filter(Boolean).join(" ");

export const technologyValues = (value?: string | string[] | null) => {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  if (typeof value === "string" && value.trim()) return [value.trim()];
  return [];
};

export const technologyText = (value?: string | string[] | null) =>
  technologyValues(value).join(", ") || "-";

export const labelFor = (
  options: { label: string; value: string }[],
  value?: string
) => options.find((option) => option.value === value)?.label || value || "-";
