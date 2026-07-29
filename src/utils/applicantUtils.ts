/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  SelectedOption,
  SelectedOption1,
} from "interfaces/applicant.interface";

export interface FilterState {
  appliedSkills: SelectedOption1[];
  multipleSkills: SelectedOption1[];
  filterCity: SelectedOption1[];
  filterAppliedRole: SelectedOption[];
  addedBy: SelectedOption[];
  filterState: SelectedOption | null;
  filterGender: SelectedOption | null;
  filterInterviewStage: SelectedOption | null;
  filterStatus: SelectedOption | null;
  filterAnyHandOnOffers: SelectedOption | null;
  filterDesignation: SelectedOption | null;
  filterActiveStatus: SelectedOption | null;
  filterFavorite: SelectedOption | null;
  startDate: string;
  endDate: string;
  updatedStartDate: string;
  updatedEndDate: string;
  experienceRange: number[];
  filterNoticePeriod: number[];
  filterRating: number[];
  filterEngRating: number[];
  filterExpectedPkg: number[];
  filterCurrentPkg: number[];
  searchAll: string;
}

export interface ChartParams {
  filterFromChart?: string | null;
  filterTypeChart?: string | null;
  applicantStatusChart?: string | null;
  addedByChart?: string | null;
  filterStatusDashboard?: string | null;
  progressChart?: string | null;
  designationChart?: string | null;
  piechartType?: string | null;
  piechartSelected?: string | null;
  startDate?: string | null;
  endDate?: string | null;
}

/**
 * Builds API parameters from filter state and chart params
 */
export const buildApplicantParams = (
  filters: FilterState,
  pagination: { pageIndex: number; pageSize: number },
  chartParams?: ChartParams
): any => {
  const params: any = {
    page: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
    limit: pagination.pageSize,
  };

  // Experience Range
  if (filters.experienceRange[0] !== 0 || filters.experienceRange[1] !== 25) {
    params.totalExperience = `${filters.experienceRange[0]}-${filters.experienceRange[1]}`;
  }

  // Notice Period
  if (
    filters.filterNoticePeriod[0] !== 0 ||
    filters.filterNoticePeriod[1] !== 90
  ) {
    params.noticePeriod = `${filters.filterNoticePeriod[0]}-${filters.filterNoticePeriod[1]}`;
  }

  // Rating
  if (filters.filterRating[0] !== 0 || filters.filterRating[1] !== 10) {
    params.rating = `${filters.filterRating[0]}-${filters.filterRating[1]}`;
  }

  // Communication Skill
  if (filters.filterEngRating[0] !== 0 || filters.filterEngRating[1] !== 10) {
    params.communicationSkill = `${filters.filterEngRating[0]}-${filters.filterEngRating[1]}`;
  }

  // Expected Package
  if (
    filters.filterExpectedPkg[0] !== 0 ||
    filters.filterExpectedPkg[1] !== 100
  ) {
    params.expectedPkg = `${filters.filterExpectedPkg[0]}-${filters.filterExpectedPkg[1]}`;
  }

  // Current Package
  if (
    filters.filterCurrentPkg[0] !== 0 ||
    filters.filterCurrentPkg[1] !== 100
  ) {
    params.currentPkg = `${filters.filterCurrentPkg[0]}-${filters.filterCurrentPkg[1]}`;
  }

  // Any Hand On Offers
  if (filters.filterAnyHandOnOffers) {
    params.anyHandOnOffers = filters.filterAnyHandOnOffers.value;
  }

  // City (Multi-select)
  if (filters.filterCity.length > 0) {
    params.currentCity = filters.filterCity.map((city) => city.label).join(",");
  }

  // State
  if (filters.filterState) {
    params.state = filters.filterState.value;
  }
  // Applied Skills (AND) - Ensure it's an array
  const appliedSkillsArray = Array.isArray(filters.appliedSkills)
    ? filters.appliedSkills
    : filters.appliedSkills
    ? [filters.appliedSkills]
    : [];
  if (appliedSkillsArray.length > 0) {
    params.appliedSkills = appliedSkillsArray
      .map((skill) => skill?.label || skill?.value || "")
      .filter(Boolean)
      .join(",");
  }

  const multipleSkillsArray = Array.isArray(filters.multipleSkills)
    ? filters.multipleSkills
    : filters.multipleSkills
    ? [filters.multipleSkills]
    : [];
  if (multipleSkillsArray.length > 0) {
    params.appliedSkillsOR = multipleSkillsArray
      .map((skill) => skill?.label || skill?.value || "")
      .filter(Boolean)
      .join(",");
  }

  // Added By - normalize to array (MultiSelect may pass single option or null)
  const addedByArray = Array.isArray(filters.addedBy)
    ? filters.addedBy
    : filters.addedBy
    ? [filters.addedBy]
    : [];
  if (addedByArray.length > 0) {
    params.addedBy = addedByArray
      .map((item: any) => item?.value || item?.label || "")
      .filter(Boolean)
      .join(",");
  }

  // Dates
  if (filters.startDate) params.startDate = filters.startDate;
  if (filters.endDate) params.endDate = filters.endDate;
  if (filters.updatedStartDate)
    params.updatedStartDate = filters.updatedStartDate;
  if (filters.updatedEndDate) params.updatedEndDate = filters.updatedEndDate;

  // Status
  if (filters.filterStatus) params.status = filters.filterStatus.value;

  // Designation
  if (filters.filterDesignation) {
    params.currentCompanyDesignation = filters.filterDesignation.value;
  }

  // Interview Stage
  if (filters.filterInterviewStage) {
    params.interviewStage = filters.filterInterviewStage.value;
  }

  // Gender
  if (filters.filterGender) params.gender = filters.filterGender.value;

  // Active Status
  if (filters.filterActiveStatus && filters.filterActiveStatus.value !== "") {
    params.isActive = filters.filterActiveStatus.value;
  }

  // Applied Role
  if (filters.filterAppliedRole.length > 0) {
    params.appliedRole = filters.filterAppliedRole
      .map((role) => role.label)
      .join(",");
  }

  // Search
  const searchValue = filters.searchAll?.trim();
  if (searchValue) {
    params.search = searchValue;
  }

  // Favorite - Only include if user has explicitly selected a value
  if (filters.filterFavorite && filters.filterFavorite.value !== "") {
    params.isFavorite = filters.filterFavorite.value;
  }

  // Chart params
  if (chartParams) {
    if (chartParams.addedByChart) {
      params.addedBy = chartParams.addedByChart;
    }
    if (chartParams.applicantStatusChart) {
      params.status = chartParams.applicantStatusChart;
    }
    if (chartParams.filterFromChart) {
      if (chartParams.filterTypeChart === "city") {
        params.currentCity = chartParams.filterFromChart;
      } else if (chartParams.filterTypeChart === "state") {
        params.state = chartParams.filterFromChart;
      }
    }
    if (chartParams.filterStatusDashboard) {
      params.status = chartParams.filterStatusDashboard;
    }
    if (chartParams.progressChart) {
      params.interviewStage = chartParams.progressChart;
    }
    if (chartParams.designationChart) {
      params.currentCompanyDesignation = chartParams.designationChart;
    }
    if (chartParams.piechartType === "gender") {
      params.gender =
        chartParams.piechartSelected === "Male" ? "male" : "female";
    }
    if (chartParams.piechartType === "ActiveStatus") {
      params.isActive =
        chartParams.piechartSelected === "Active" ? "true" : "false";
    }
    if (chartParams.piechartType === "favorite") {
      params.isFavorite =
        chartParams.piechartSelected === "Favorited" ? "true" : "false";
    }
    if (chartParams.piechartType === "notice") {
      const selectedValue = chartParams.piechartSelected
        ?.toLowerCase()
        .replace(" days", "")
        .trim();
      if (selectedValue) {
        params.noticePeriod = `${selectedValue}-${selectedValue}`;
      }
    }
    // Dashboard applied chart date range (fallback when filter dates not set yet)
    if (chartParams.startDate && !params.startDate) {
      params.startDate = chartParams.startDate;
    }
    if (chartParams.endDate && !params.endDate) {
      params.endDate = chartParams.endDate;
    }
  }

  return params;
};

/**
 * Checks if any filter is applied
 */
export const isAnyFilterApplied = (
  filters: FilterState,
  chartParams?: ChartParams
): boolean => {
  const hasFilter =
    filters.experienceRange[0] !== 0 ||
    filters.experienceRange[1] !== 25 ||
    filters.filterNoticePeriod[0] !== 0 ||
    filters.filterNoticePeriod[1] !== 90 ||
    filters.filterRating[0] !== 0 ||
    filters.filterRating[1] !== 10 ||
    filters.filterEngRating[0] !== 0 ||
    filters.filterEngRating[1] !== 10 ||
    filters.filterExpectedPkg[0] !== 0 ||
    filters.filterExpectedPkg[1] !== 100 ||
    filters.filterCurrentPkg[0] !== 0 ||
    filters.filterCurrentPkg[1] !== 100 ||
    !!filters.filterAnyHandOnOffers ||
    filters.filterCity.length > 0 ||
    !!filters.filterState ||
    (filters.appliedSkills &&
      (Array.isArray(filters.appliedSkills)
        ? filters.appliedSkills.length > 0
        : true)) ||
    (filters.multipleSkills &&
      (Array.isArray(filters.multipleSkills)
        ? filters.multipleSkills.length > 0
        : true)) ||
    (filters.addedBy && filters.addedBy.length > 0) ||
    !!filters.startDate ||
    !!filters.endDate ||
    !!filters.filterStatus ||
    !!filters.filterDesignation ||
    !!filters.filterInterviewStage ||
    !!filters.filterGender ||
    filters.filterAppliedRole.length > 0 ||
    !!filters.filterFavorite ||
    (filters.searchAll && filters.searchAll.trim() !== "");

  const hasChartParam =
    chartParams && Object.values(chartParams).some((val) => val);

  return hasFilter || !!hasChartParam;
};

/** Full URL to standalone applicant details page (respects Vite `base`, e.g. `/talent/`). */
export function buildApplicantDetailsFullUrl(
  applicantId: string,
  source: string = "main",
): string {
  const base = (import.meta.env.BASE_URL || "/").replace(/\/?$/, "");
  const pathname = `${base}/applicants/view-applicant/${encodeURIComponent(applicantId)}`;
  const url = new URL(pathname, window.location.origin);
  url.searchParams.set("source", source);
  return url.href;
}
