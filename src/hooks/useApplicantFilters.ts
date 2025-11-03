/**
 * Custom Hook for Managing Applicant Filters
 * Centralizes all filter state and handlers
 */

import { useState, useCallback } from "react";
import {
  SelectedOption,
  SelectedOption1,
} from "interfaces/applicant.interface";

export interface FilterState {
  // Multi-select filters
  appliedSkills: SelectedOption1[];
  multipleSkills: SelectedOption1[];
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
}

const initialFilterState: FilterState = {
  appliedSkills: [],
  multipleSkills: [],
  addedBy: [],
  filterState: null,
  filterGender: null,
  filterInterviewStage: null,
  filterStatus: null,
  filterWorkPreference: null,
  filterAnyHandOnOffers: null,
  filterDesignation: null,
  filterActiveStatus: null,
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
};

export const useApplicantFilters = () => {
  const [filters, setFilters] = useState<FilterState>(initialFilterState);

  // Multi-select handlers
  const handleAppliedSkillsChange = useCallback(
    (selectedOptions: SelectedOption1[]) => {
      setFilters((prev) => ({ ...prev, appliedSkills: selectedOptions }));
    },
    []
  );

  const handleMultipleSkillsChange = useCallback(
    (selectedOptions: SelectedOption1[]) => {
      setFilters((prev) => ({ ...prev, multipleSkills: selectedOptions }));
    },
    []
  );

  const handleAppliedRoleChange = useCallback(
    (selectedOptions: SelectedOption[]) => {
      setFilters((prev) => ({ ...prev, addedBy: selectedOptions }));
    },
    []
  );

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
    handlers: {
      handleAppliedSkillsChange,
      handleMultipleSkillsChange,
      handleAppliedRoleChange,
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
    },
    resetFilters,
    clearFilter,
  };
};

export default useApplicantFilters;
