import { SelectedOption, SelectedOption1 } from "interfaces/applicant.interface";
import { FilterState } from "../hooks/useApplicantFilters";

export const buildApiParams = (filters: FilterState, chartParams?: Record<string, string>) => {
  const params: any = {};

  // Range filters
  if (filters.experienceRange[0] !== 0 || filters.experienceRange[1] !== 25) {
    params.totalExperience = `${filters.experienceRange[0]}-${filters.experienceRange[1]}`;
  }
  if (filters.filterNoticePeriod[0] !== 0 || filters.filterNoticePeriod[1] !== 90) {
    params.noticePeriod = `${filters.filterNoticePeriod[0]}-${filters.filterNoticePeriod[1]}`;
  }
  if (filters.filterRating[0] !== 0 || filters.filterRating[1] !== 10) {
    params.rating = `${filters.filterRating[0]}-${filters.filterRating[1]}`;
  }
  if (filters.filterEngRating[0] !== 0 || filters.filterEngRating[1] !== 10) {
    params.communicationSkill = `${filters.filterEngRating[0]}-${filters.filterEngRating[1]}`;
  }
  if (filters.filterExpectedPkg[0] !== 0 || filters.filterExpectedPkg[1] !== 100) {
    params.expectedPkg = `${filters.filterExpectedPkg[0]}-${filters.filterExpectedPkg[1]}`;
  }
  if (filters.filterCurrentPkg[0] !== 0 || filters.filterCurrentPkg[1] !== 100) {
    params.currentPkg = `${filters.filterCurrentPkg[0]}-${filters.filterCurrentPkg[1]}`;
  }

  // Single select filters
  if (filters.filterWorkPreference) {
    params.workPreference = filters.filterWorkPreference.value;
  }
  if (filters.filterAnyHandOnOffers) {
    params.anyHandOnOffers = filters.filterAnyHandOnOffers.value;
  }
  if (filters.filterState) {
    params.state = encodeURIComponent(filters.filterState.label);
  }
  if (filters.startDate) params.startDate = filters.startDate;
  if (filters.endDate) params.endDate = filters.endDate;
  if (filters.updatedStartDate) params.updatedStartDate = filters.updatedStartDate;
  if (filters.updatedEndDate) params.updatedEndDate = filters.updatedEndDate;
  if (filters.filterStatus) params.status = filters.filterStatus.value;
  if (filters.filterDesignation) params.currentCompanyDesignation = filters.filterDesignation.value;
  if (filters.filterInterviewStage) params.interviewStage = filters.filterInterviewStage.value;
  if (filters.filterGender) params.gender = filters.filterGender.value;
  if (filters.filterActiveStatus && filters.filterActiveStatus.value !== "") {
    params.isActive = filters.filterActiveStatus.value;
  }
  if (filters.filterFavorite) {
    params.isFavorite = filters.filterFavorite.value;
  }

  // Multi-select filters
  if (filters.filterCity.length > 0) {
    params.currentCity = filters.filterCity.map((city) => city.label).join(",");
  }
  if (filters.appliedSkills.length > 0) {
    params.appliedSkills = filters.appliedSkills.map((skill) => skill.label).join(",");
  }
  if (filters.multipleSkills.length > 0) {
    params.appliedSkillsOR = filters.multipleSkills.map((skill) => skill.label).join(",");
  }
  if (filters.addedBy.length > 0) {
    params.addedBy = filters.addedBy.map((role: any) => role.value).join(",");
  }
  if (filters.filterAppliedRole.length > 0) {
    params.appliedRole = filters.filterAppliedRole.map((role) => role.label).join(",");
  }

  // Search
  if (filters.searchAll?.trim()) {
    params.search = filters.searchAll.trim();
  }

  // Chart params
  if (chartParams) {
    Object.assign(params, chartParams);
  }

  return params;
};

export const formatApplicantName = (nameObj: any) => {
  const firstName = nameObj?.firstName || "";
  const middleName = nameObj?.middleName || "";
  const lastName = nameObj?.lastName || "";
  return `${firstName} ${middleName} ${lastName}`.trim();
};

export const createSliderHandlers = (
  updateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void
) => ({
  handleExperienceChange: (e: React.ChangeEvent<any>) => {
    updateFilter('experienceRange', e.target.value as number[]);
  },
  handleNoticePeriodChange: (e: React.ChangeEvent<any>) => {
    updateFilter('filterNoticePeriod', e.target.value as number[]);
  },
  handleRatingChange: (e: React.ChangeEvent<any>) => {
    updateFilter('filterRating', e.target.value as number[]);
  },
  handleEngRatingChange: (e: React.ChangeEvent<any>) => {
    updateFilter('filterEngRating', e.target.value as number[]);
  },
  handleExpectedPkgChange: (e: React.ChangeEvent<any>) => {
    updateFilter('filterExpectedPkg', e.target.value as number[]);
  },
  handleCurrentPkgChange: (e: React.ChangeEvent<any>) => {
    updateFilter('filterCurrentPkg', e.target.value as number[]);
  },
});

export const createSelectHandlers = (
  updateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void
) => ({
  handleAppliedSkillsChange: (selectedOptions: SelectedOption1[]) => {
    updateFilter('appliedSkills', selectedOptions);
  },
  handleMultipleSkillsChange: (selectedOptions: SelectedOption1[]) => {
    updateFilter('multipleSkills', selectedOptions);
  },
  handleStateChange: (selectedOption: SelectedOption1 | null) => {
    updateFilter('filterState', selectedOption);
  },
  handleGenderChange: (selectedOption: SelectedOption) => {
    updateFilter('filterGender', selectedOption);
  },
  handleInterviewStageChange: (selectedOption: SelectedOption) => {
    updateFilter('filterInterviewStage', selectedOption);
  },
  handleStatusChange: (selectedOption: SelectedOption) => {
    updateFilter('filterStatus', selectedOption);
  },
  handleWorkPreferenceChange: (selectedOption: SelectedOption) => {
    updateFilter('filterWorkPreference', selectedOption);
  },
  handleAnyHandOnOffersChange: (selectedOption: SelectedOption) => {
    updateFilter('filterAnyHandOnOffers', selectedOption);
  },
  handleDesignationChange: (selectedOption: SelectedOption) => {
    updateFilter('filterDesignation', selectedOption);
  },
  handleAppliedRoleChange: (selectedOption: SelectedOption[]) => {
    updateFilter('addedBy', selectedOption);
  },
  handleActiveStatusChange: (selectedOption: SelectedOption) => {
    updateFilter('filterActiveStatus', selectedOption);
  },
  handleFavoriteChange: (selectedOption: SelectedOption) => {
    updateFilter('filterFavorite', selectedOption);
  },
});

export const createDateHandlers = (
  updateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void
) => ({
  handleDateChange: (e: React.ChangeEvent<HTMLInputElement>, isStartDate: boolean) => {
    if (isStartDate) {
      updateFilter('startDate', e.target.value);
    } else {
      updateFilter('endDate', e.target.value);
    }
  },
  handleUpdateDateChange: (e: React.ChangeEvent<HTMLInputElement>, isStartDate: boolean) => {
    if (isStartDate) {
      updateFilter('updatedStartDate', e.target.value);
    } else {
      updateFilter('updatedEndDate', e.target.value);
    }
  },
});

export const createSearchHandler = (
  updateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void,
  setPagination: React.Dispatch<React.SetStateAction<{ pageIndex: number; pageSize: number }>>
) => ({
  handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => {
    updateFilter('searchAll', event.target.value);
    setPagination((prev) => ({
      ...prev,
      pageIndex: 0,
    }));
  },
});

export const createMultiSelectHandlers = (
  updateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void
) => ({
  handleCityChange: (selectedOptions: SelectedOption1[]) => {
    updateFilter('filterCity', selectedOptions);
  },
  handleAppliedRoleChange: (selectedOptions: SelectedOption[]) => {
    updateFilter('filterAppliedRole', selectedOptions);
  },
});

export const getChartParams = (location: any) => {
  const params = new URLSearchParams(location.search);
  return {
    filterFromChart: params.get("filter"),
    filterTypeChart: params.get("type"),
    applicantStatusChart: params.get("applicantStatusChart"),
    addedByChart: params.get("addedByChart"),
    filterStatusDashboard: params.get("status"),
    progressChart: params.get("progress"),
    designationChart: params.get("designation"),
    piechartType: params.get("piechartType"),
    piechartSelected: params.get("selected"),
  };
};

export const buildChartParams = (chartParams: any) => {
  const params: any = {};

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
    params.gender = chartParams.piechartSelected === "Male" ? "male" : "female";
  }
  if (chartParams.piechartType === "work") {
    params.workPreference = chartParams.piechartSelected?.toLowerCase() || undefined;
  }
  if (chartParams.piechartType === "ActiveStatus") {
    params.isActive = chartParams.piechartSelected === "Active" ? "true" : "false";
  }
  if (chartParams.piechartType === "favorite") {
    params.isFavorite = chartParams.piechartSelected === "Favorited" ? "true" : "false";
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

  return params;
};
