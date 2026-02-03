import { ColumnConfig } from "interfaces/global.interface";

export const COLUMN_CONFIGURATIONS: ColumnConfig[] = [
  { id: "select", header: "Select", isVisible: true },
  { id: "name", header: "Applicant Name", isVisible: true },
  { id: "appliedSkills", header: "Skills", isVisible: true },
  { id: "appliedRole", header: "Role", isVisible: true },
  { id: "totalExperience", header: "Total Exp", isVisible: true },
  { id: "action", header: "Action", isVisible: true },
  { id: "interviewStage", header: "Interview Stage", isVisible: false },
  { id: "status", header: "Applicant Status", isVisible: false },
  { id: "isActive", header: "Status", isVisible: true },
  { id: "currentCity", header: "City", isVisible: false },
  { id: "gender", header: "Gender", isVisible: false },
  { id: "qualification", header: "Qualification", isVisible: false },
  { id: "currentPkg", header: "Current Pkg", isVisible: false },
  { id: "expectedPkg", header: "Expected Pkg", isVisible: false },
  { id: "noticePeriod", header: "Notice Period", isVisible: false },
  { id: "updatedAt", header: "Update Date", isVisible: false },
  { id: "createdAt", header: "Create Date", isVisible: false },
  {
    id: "relevantSkillExperience",
    header: "Relevant Skill Exp",
    isVisible: false,
  },
  { id: "communicationSkill", header: "Communication Skill", isVisible: false },
  { id: "lastFollowUpDate", header: "Last-Followup Date", isVisible: false },
];

export const SLIDER_CONFIGS = {
  experience: {
    min: 0,
    max: 25,
    step: 0.1,
    label: "Experience (in years)",
  },
  noticePeriod: {
    min: 0,
    max: 90,
    step: 1,
    label: "Notice Period (in Days)",
  },
  rating: {
    min: 0,
    max: 10,
    step: 1,
    label: "JavaScript Rating",
  },
  engRating: {
    min: 0,
    max: 10,
    step: 1,
    label: "Eng.Communication Rating",
  },
  expectedPkg: {
    min: 0,
    max: 100,
    step: 1,
    label: "Expected Pkg(LPA)",
  },
  currentPkg: {
    min: 0,
    max: 100,
    step: 1,
    label: "Current Pkg(LPA)",
  },
};

export const DRAWER_STYLES = {
  box: {
    padding: "16px",
    marginTop: 0,
    width: "400px", // Will be responsive
  },
  stickyHeader: {
    position: "sticky" as const,
    top: 0,
    background: "#fff",
    zIndex: 100,
    paddingBottom: "8px",
    paddingTop: "8px",
  },
  stickyFooter: {
    position: "sticky" as const,
    bottom: 0,
    background: "#fff",
    zIndex: 100,
    paddingTop: "8px",
    paddingBottom: "8px",
  },
};

export const TABLE_STYLES = {
  truncateText: {
    whiteSpace: "nowrap" as const,
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "150px",
    fontSize: "14px",
  },
  tooltipComponents: {
    backgroundColor: "blue !important",
    color: "white !important",
    borderRadius: "5px !important",
    padding: "8px 12px !important",
    fontSize: "14px !important",
    border: "1px solid white !important",
  },
  customSelectStyles: {
    control: (provided: any) => ({
      ...provided,
      fontSize: "12px",
      backgroundColor: "#f0f0f0",
      borderRadius: "8px",
      borderColor: "transparent",
      minHeight: "20px",
      outline: "none",
      boxShadow: "none",
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      fontSize: "12px",
      backgroundColor: state.isSelected ? "#007bff" : "transparent",
      color: state.isSelected ? "#fff" : "#000",
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: "#333",
    }),
    dropdownIndicator: (provided: any) => ({
      ...provided,
      color: "#secondary",
    }),
    clearIndicator: (provided: any) => ({
      ...provided,
      display: "none",
      color: "#dc3545",
    }),
    menu: (provided: any) => ({
      ...provided,
      borderRadius: "8px",
    }),
  },
};

export const EXPORT_OPTIONS = ["Manual", "Resume", "Csv", "both"];

export const DEFAULT_PAGINATION = {
  pageIndex: 0,
  pageSize: 50,
};

export const INITIAL_FILTER_RANGES = {
  experience: [0, 25],
  noticePeriod: [0, 90],
  rating: [0, 10],
  engRating: [0, 10],
  expectedPkg: [0, 100],
  currentPkg: [0, 100],
};

export const INITIAL_ACTIVE_STATUS = {
  value: "true",
  label: "Active",
};

// API Parameters Interface
export interface ApplicantApiParams {
  page: number;
  pageSize: number;
  limit: number;
  totalExperience?: string;
  currentCity?: string;
  appliedSkills?: string;
  appliedSkillsOR?: string;
  startDate?: string;
  endDate?: string;
  updatedStartDate?: string;
  updatedEndDate?: string;
  noticePeriod?: string;
  status?: string;
  interviewStage?: string;
  gender?: string;
  expectedPkg?: string;
  currentCompanyDesignation?: string;
  state?: string;
  maritalStatus?: string;
  anyHandOnOffers?: string;
  rating?: string;
  workPreference?: string;
  communicationSkill?: string;
  currentPkg?: string;
  applicantName?: string;
  searchSkills?: string;
  search?: string;
  addedBy?: string;
  isActive?: string;
  appliedRole?: string;
  isFavorite?: string;
}

// API Parameter Keys
export const API_PARAM_KEYS = {
  PAGE: "page",
  PAGE_SIZE: "pageSize",
  LIMIT: "limit",
  TOTAL_EXPERIENCE: "totalExperience",
  CURRENT_CITY: "currentCity",
  APPLIED_SKILLS: "appliedSkills",
  APPLIED_SKILLS_OR: "appliedSkillsOR",
  START_DATE: "startDate",
  END_DATE: "endDate",
  UPDATED_START_DATE: "updatedStartDate",
  UPDATED_END_DATE: "updatedEndDate",
  NOTICE_PERIOD: "noticePeriod",
  STATUS: "status",
  INTERVIEW_STAGE: "interviewStage",
  GENDER: "gender",
  EXPECTED_PKG: "expectedPkg",
  CURRENT_COMPANY_DESIGNATION: "currentCompanyDesignation",
  STATE: "state",
  MARITAL_STATUS: "maritalStatus",
  ANY_HAND_ON_OFFERS: "anyHandOnOffers",
  RATING: "rating",
  WORK_PREFERENCE: "workPreference",
  COMMUNICATION_SKILL: "communicationSkill",
  CURRENT_PKG: "currentPkg",
  APPLICANT_NAME: "applicantName",
  SEARCH_SKILLS: "searchSkills",
  SEARCH: "search",
  ADDED_BY: "addedBy",
  IS_ACTIVE: "isActive",
  APPLIED_ROLE: "appliedRole",
  IS_FAVORITE: "isFavorite",
} as const;

// Default API Parameters
export const DEFAULT_API_PARAMS = {
  page: 1,
  pageSize: 50,
  limit: 50,
} as const;


export const FILTER_PARAMS = {
  FILTER: 'filter',
  TYPE: 'type',
  APPLICANT_STATUS_CHART: 'applicantStatusChart',
  ADDED_BY_CHART: 'addedByChart',
  FILTER_STATUS_DASHBOARD: 'status',
  PROGRESS_CHART: 'progress',
  DESIGNATION_CHART: 'designation',
  PIECHART_TYPE: 'piechartType',
  PIECHART_SELECTED: 'selected',
} as const;


export const COMMON_BOOLEAN_STRING_VALUES = {
  TRUE: 'true',
  FALSE: 'false',
} as const;

export const COMMON_BOOLEAN_BOOLEAN_VALUES = {
  TRUE: true,
  FALSE: false,
} as const;