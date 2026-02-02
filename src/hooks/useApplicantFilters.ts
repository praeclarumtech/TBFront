/**
 * Custom Hook for Managing Applicant Filters
 * Centralizes all filter state and handlers
 * Uses sessionStorage for persistence across navigation (resets on page refresh)
 */

import { useState, useCallback, useEffect } from "react";
import {
  SelectedOption,
  SelectedOption1,
} from "interfaces/applicant.interface";

export interface FilterState {
  // Multi-select filters
  appliedSkills: SelectedOption1[];
  multipleSkills: SelectedOption1[];
  filterCity: SelectedOption1[];
  filterAppliedRole: SelectedOption[];
  addedBy: SelectedOption[];

  // Single-select filters
  filterState: SelectedOption | null;
  filterGender: SelectedOption | null;
  filterInterviewStage: SelectedOption | null;
  filterStatus: SelectedOption | null;
  filterWorkPreference: SelectedOption | null;
  filterAnyHandOnOffers: SelectedOption | null;
  filterDesignation: SelectedOption | null;
  filterActiveStatus: SelectedOption | null;
  filterFavorite: SelectedOption | null;

  // Date filters
  startDate: string;
  endDate: string;
  updatedStartDate: string;
  updatedEndDate: string;

  // Range filters
  experienceRange: number[];
  filterNoticePeriod: number[];
  filterRating: number[];
  filterEngRating: number[];
  filterExpectedPkg: number[];
  filterCurrentPkg: number[];

  // Search
  searchAll: string;
}

const initialFilterState: FilterState = {
  appliedSkills: [],
  multipleSkills: [],
  filterCity: [],
  filterAppliedRole: [],
  addedBy: [],
  filterState: null,
  filterGender: null,
  filterInterviewStage: null,
  filterStatus: null,
  filterWorkPreference: null,
  filterAnyHandOnOffers: null,
  filterDesignation: null,
  filterActiveStatus: {
    value: "true",
    label: "Active",
  },
  filterFavorite: null,
  startDate: "",
  endDate: "",
  updatedStartDate: "",
  updatedEndDate: "",
  experienceRange: [0, 25],
  filterNoticePeriod: [0, 90],
  filterRating: [0, 10],
  filterEngRating: [0, 10],
  filterExpectedPkg: [0, 100],
  filterCurrentPkg: [0, 100],
  searchAll: "",
};

const FILTER_STORAGE_KEY = "applicant_filters";
const SESSION_ACTIVE_KEY = "applicant_session_active";
const REFRESH_HANDLED_KEY = "applicant_refresh_handled";

// Check if this is a page refresh - only run ONCE on initial module load
const checkAndHandlePageRefresh = (): boolean => {
  // If we've already handled the refresh check this session, don't check again
  if (sessionStorage.getItem(REFRESH_HANDLED_KEY) === "true") {
    return false; // Not a fresh refresh, we already handled it
  }

  let isRefresh = false;

  // Check using Performance Navigation Timing API
  const navEntries = performance.getEntriesByType(
    "navigation"
  ) as PerformanceNavigationTiming[];
  if (navEntries.length > 0) {
    isRefresh = navEntries[0].type === "reload";
  } else if (performance.navigation) {
    // Fallback for older browsers
    isRefresh = performance.navigation.type === 1; // TYPE_RELOAD
  }

  // If it's a refresh, clear stored filters
  if (isRefresh) {
    sessionStorage.removeItem(FILTER_STORAGE_KEY);
    sessionStorage.removeItem(SESSION_ACTIVE_KEY);
  }

  // Mark that we've handled the refresh check
  sessionStorage.setItem(REFRESH_HANDLED_KEY, "true");

  return isRefresh;
};

// Run the refresh check once when module loads
const wasPageRefreshed = checkAndHandlePageRefresh();

// Check if filters should be restored from sessionStorage
const shouldUseSessionStorage = (): boolean => {
  // If page was just refreshed, don't use stored filters
  if (wasPageRefreshed) {
    return false;
  }
  // If session is active (user has already visited the page), use sessionStorage
  return sessionStorage.getItem(SESSION_ACTIVE_KEY) === "true";
};

// Get initial filters from sessionStorage
const getFiltersFromStorage = (): FilterState | null => {
  try {
    const stored = sessionStorage.getItem(FILTER_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...initialFilterState, ...parsed };
    }
  } catch (error) {
    console.error("Error reading filters from sessionStorage:", error);
  }
  return null;
};

// Get initial filters - from sessionStorage if navigating, or default if refreshing
const getInitialFilters = (): FilterState => {
  if (shouldUseSessionStorage()) {
    const storedFilters = getFiltersFromStorage();
    if (storedFilters) {
      return storedFilters;
    }
  }
  return initialFilterState;
};

export const useApplicantFilters = () => {
  const [filters, setFilters] = useState<FilterState>(getInitialFilters);
  // Track if filters were restored from sessionStorage (during navigation, not refresh)
  const [restoredFromSession] = useState<boolean>(
    shouldUseSessionStorage() && getFiltersFromStorage() !== null
  );

  // Save filters to sessionStorage whenever they change
  useEffect(() => {
    try {
      sessionStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(filters));
      sessionStorage.setItem(SESSION_ACTIVE_KEY, "true");
    } catch (error) {
      console.error("Error saving filters to sessionStorage:", error);
    }
  }, [filters]);

  // Multi-select handlers
  const handleAppliedSkillsChange = useCallback(
    (selectedOptions: SelectedOption1[] | SelectedOption1 | null) => {
      // Ensure it's always an array
      const optionsArray = Array.isArray(selectedOptions)
        ? selectedOptions
        : selectedOptions
        ? [selectedOptions]
        : [];
      setFilters((prev) => ({ ...prev, appliedSkills: optionsArray }));
    },
    []
  );

  const handleMultipleSkillsChange = useCallback(
    (selectedOptions: SelectedOption1[] | SelectedOption1 | null) => {
      // Ensure it's always an array
      const optionsArray = Array.isArray(selectedOptions)
        ? selectedOptions
        : selectedOptions
        ? [selectedOptions]
        : [];
      setFilters((prev) => ({ ...prev, multipleSkills: optionsArray }));
    },
    []
  );

  const handleAppliedRoleChange = useCallback(
    (selectedOptions: SelectedOption[]) => {
      setFilters((prev) => ({ ...prev, filterAppliedRole: selectedOptions }));
    },
    []
  );

  const handleAddedByChange = useCallback(
    (selectedOptions: SelectedOption[] | SelectedOption | null) => {
      const optionsArray = Array.isArray(selectedOptions)
        ? selectedOptions
        : selectedOptions
        ? [selectedOptions]
        : [];
      setFilters((prev) => ({ ...prev, addedBy: optionsArray }));
    },
    []
  );

  const handleCityChange = useCallback((selectedOptions: SelectedOption1[]) => {
    setFilters((prev) => ({ ...prev, filterCity: selectedOptions }));
  }, []);

  const handleAppliedRoleFilterChange = useCallback(
    (selectedOptions: SelectedOption[]) => {
      setFilters((prev) => ({ ...prev, filterAppliedRole: selectedOptions }));
    },
    []
  );

  const handleSearchChange = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, searchAll: value }));
  }, []);

  // Single-select handlers
  const handleStateChange = useCallback(
    (selectedOption: SelectedOption | null) => {
      setFilters((prev) => ({ ...prev, filterState: selectedOption }));
    },
    []
  );

  const handleGenderChange = useCallback(
    (selectedOption: SelectedOption | null) => {
      setFilters((prev) => ({ ...prev, filterGender: selectedOption }));
    },
    []
  );

  const handleInterviewStageChange = useCallback(
    (selectedOption: SelectedOption | null) => {
      setFilters((prev) => ({ ...prev, filterInterviewStage: selectedOption }));
    },
    []
  );

  const handleStatusChange = useCallback(
    (selectedOption: SelectedOption | null) => {
      setFilters((prev) => ({ ...prev, filterStatus: selectedOption }));
    },
    []
  );

  const handleWorkPreferenceChange = useCallback(
    (selectedOption: SelectedOption | null) => {
      setFilters((prev) => ({ ...prev, filterWorkPreference: selectedOption }));
    },
    []
  );

  const handleAnyHandOnOffersChange = useCallback(
    (selectedOption: SelectedOption | null) => {
      setFilters((prev) => ({
        ...prev,
        filterAnyHandOnOffers: selectedOption,
      }));
    },
    []
  );

  const handleDesignationChange = useCallback(
    (selectedOption: SelectedOption | null) => {
      setFilters((prev) => ({ ...prev, filterDesignation: selectedOption }));
    },
    []
  );

  const handleActiveStatusChange = useCallback(
    (selectedOption: SelectedOption | null) => {
      setFilters((prev) => ({ ...prev, filterActiveStatus: selectedOption }));
    },
    []
  );

  const handleFavoriteChange = useCallback(
    (selectedOption: SelectedOption | null) => {
      setFilters((prev) => ({ ...prev, filterFavorite: selectedOption }));
    },
    []
  );

  // Date handlers
  const handleStartDateChange = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, startDate: value }));
  }, []);

  const handleEndDateChange = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, endDate: value }));
  }, []);

  const handleUpdatedStartDateChange = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, updatedStartDate: value }));
  }, []);

  const handleUpdatedEndDateChange = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, updatedEndDate: value }));
  }, []);

  // Range handlers
  const handleExperienceChange = useCallback((value: number[]) => {
    setFilters((prev) => ({ ...prev, experienceRange: value }));
  }, []);

  const handleNoticePeriodChange = useCallback((value: number[]) => {
    setFilters((prev) => ({ ...prev, filterNoticePeriod: value }));
  }, []);

  const handleRatingChange = useCallback((value: number[]) => {
    setFilters((prev) => ({ ...prev, filterRating: value }));
  }, []);

  const handleEngRatingChange = useCallback((value: number[]) => {
    setFilters((prev) => ({ ...prev, filterEngRating: value }));
  }, []);

  const handleExpectedPkgChange = useCallback((value: number[]) => {
    setFilters((prev) => ({ ...prev, filterExpectedPkg: value }));
  }, []);

  const handleCurrentPkgChange = useCallback((value: number[]) => {
    setFilters((prev) => ({ ...prev, filterCurrentPkg: value }));
  }, []);

  // Reset all filters
  const resetFilters = useCallback(() => {
    setFilters(initialFilterState);
  }, []);

  // Clear specific filter
  const clearFilter = useCallback((filterName: keyof FilterState) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: initialFilterState[filterName],
    }));
  }, []);

  return {
    filters,
    setFilters,
    restoredFromSession, // Flag to indicate filters were restored from sessionStorage (navigation)
    handlers: {
      handleAppliedSkillsChange,
      handleMultipleSkillsChange,
      handleAppliedRoleChange,
      handleAddedByChange,
      handleCityChange,
      handleAppliedRoleFilterChange,
      handleStateChange,
      handleGenderChange,
      handleInterviewStageChange,
      handleStatusChange,
      handleWorkPreferenceChange,
      handleAnyHandOnOffersChange,
      handleDesignationChange,
      handleActiveStatusChange,
      handleFavoriteChange,
      handleStartDateChange,
      handleEndDateChange,
      handleUpdatedStartDateChange,
      handleUpdatedEndDateChange,
      handleExperienceChange,
      handleNoticePeriodChange,
      handleRatingChange,
      handleEngRatingChange,
      handleExpectedPkgChange,
      handleCurrentPkgChange,
      handleSearchChange,
    },
    resetFilters,
    clearFilter,
  };
};

export default useApplicantFilters;
