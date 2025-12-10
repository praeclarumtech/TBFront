import { useState, useEffect, useRef } from "react";
import { getSavedFilters, saveFilters } from "api/applicantApi";
import { SelectedOption1 } from "interfaces/applicant.interface";
import { FilterState } from "utils/applicantUtils";

export const useSavedFilters = (
  userId: string | null,
  onFiltersRestored: (filters: Partial<FilterState>) => void,
  skipBackendRestore: boolean = false // Skip backend restore when filters restored from sessionStorage
) => {
  const [isInitializing, setIsInitializing] = useState(true);
  const isInitializingRef = useRef(true);
  useEffect(() => {
    if (!userId) {
      setIsInitializing(false);
      isInitializingRef.current = false;
      return;
    }

    // Skip backend restore if filters are already restored from sessionStorage (navigation)
    if (skipBackendRestore) {
      setIsInitializing(false);
      isInitializingRef.current = false;
      return;
    }

    const loadSavedFilters = async () => {
      try {
        const saved = await getSavedFilters(userId);
        if (saved?.data) {
          const filters = saved.data;
          const restoredFilters: Partial<FilterState> = {};

          // City
          if (filters.currentCity) {
            const selectedOptions: SelectedOption1[] = filters.currentCity
              .split(",")
              .map((city: string) => ({ label: city, value: city }));
            restoredFilters.filterCity = selectedOptions;
          }

          // State
          if (filters.state) {
            restoredFilters.filterState = {
              label: filters.state,
              value: filters.state,
            };
          }
          // Skills (AND)
          if (
            filters.appliedSkills !== undefined &&
            filters.appliedSkills !== null
          ) {
            if (
              typeof filters.appliedSkills === "string" &&
              filters.appliedSkills.trim() !== ""
            ) {
              const skillOptions: SelectedOption1[] = filters.appliedSkills
                .split(",")
                .filter((s: string) => s.trim() !== "")
                .map((s: string) => ({ label: s.trim(), value: s.trim() }));
              restoredFilters.appliedSkills = skillOptions;
            } else {
              restoredFilters.appliedSkills = [];
            }
          } else {
            restoredFilters.appliedSkills = [];
          }

          // Skills (OR)
          if (
            filters.appliedSkillsOR !== undefined &&
            filters.appliedSkillsOR !== null
          ) {
            let skillOptions: SelectedOption1[] = [];
            if (typeof filters.appliedSkillsOR === "string") {
              if (filters.appliedSkillsOR.trim() !== "") {
                skillOptions = filters.appliedSkillsOR
                  .split(",")
                  .filter((s: string) => s.trim() !== "")
                  .map((s: string) => ({ label: s.trim(), value: s.trim() }));
              }
            } else if (Array.isArray(filters.appliedSkillsOR)) {
              skillOptions = filters.appliedSkillsOR
                .map((s: any) => ({
                  label: typeof s === "string" ? s : s?.label || s?.value || "",
                  value: typeof s === "string" ? s : s?.value || s?.label || "",
                }))
                .filter((s: any) => s.label && s.value);
            }
            restoredFilters.multipleSkills = skillOptions;
          } else {
            restoredFilters.multipleSkills = [];
          }

          // Added By
          if (filters.addedBy) {
            const addedByOptions: SelectedOption1[] = filters.addedBy
              .split(",")
              .map((a: string) => ({ label: a, value: a }));
            restoredFilters.addedBy = addedByOptions;
          }

          // Roles
          if (filters.appliedRole) {
            const roleOptions: SelectedOption1[] = filters.appliedRole
              .split(",")
              .map((r: string) => ({ label: r, value: r }));
            restoredFilters.filterAppliedRole = roleOptions;
          }

          // Status
          if (filters.status) {
            restoredFilters.filterStatus = {
              label: filters.status,
              value: filters.status,
            };
          }

          // Interview Stage
          if (filters.interviewStage) {
            restoredFilters.filterInterviewStage = {
              label: filters.interviewStage,
              value: filters.interviewStage,
            };
          }

          // Gender
          if (filters.gender) {
            restoredFilters.filterGender = {
              label: filters.gender,
              value: filters.gender,
            };
          }

          // Designation
          if (filters.currentCompanyDesignation) {
            restoredFilters.filterDesignation = {
              label: filters.currentCompanyDesignation,
              value: filters.currentCompanyDesignation,
            };
          }

          // Any Hands-on Offers
          if (filters.anyHandOnOffers) {
            restoredFilters.filterAnyHandOnOffers = {
              label: filters.anyHandOnOffers,
              value: filters.anyHandOnOffers,
            };
          }

          // Work Preference
          if (filters.workPreference) {
            restoredFilters.filterWorkPreference = {
              label: filters.workPreference,
              value: filters.workPreference,
            };
          }

          // Rating
          if (filters.rating) {
            const [min, max] = filters.rating.split("-");
            restoredFilters.filterRating = [+min, +max];
          }

          // Notice Period (there's a bug in original code - it uses rating instead of noticePeriod)
          if (filters.noticePeriod) {
            const [min, max] = filters.noticePeriod.split("-");
            restoredFilters.filterNoticePeriod = [+min, +max];
          }

          // Communication Skill
          if (filters.communicationSkill) {
            const [min, max] = filters.communicationSkill.split("-");
            restoredFilters.filterEngRating = [+min, +max];
          }

          // Expected Package
          if (filters.expectedPkg) {
            const [min, max] = filters.expectedPkg.split("-");
            restoredFilters.filterExpectedPkg = [+min, +max];
          }

          // Current Package
          if (filters.currentPkg) {
            const [min, max] = filters.currentPkg.split("-");
            restoredFilters.filterCurrentPkg = [+min, +max];
          }

          // Total Experience
          if (filters.totalExperience) {
            const [min, max] = filters.totalExperience.split("-");
            restoredFilters.experienceRange = [+min, +max];
          }

          // Dates
          if (filters.startDate) restoredFilters.startDate = filters.startDate;
          if (filters.endDate) restoredFilters.endDate = filters.endDate;
          if (filters.updatedStartDate)
            restoredFilters.updatedStartDate = filters.updatedStartDate;
          if (filters.updatedEndDate)
            restoredFilters.updatedEndDate = filters.updatedEndDate;

          // Active Status
          if (filters.isActive !== undefined) {
            restoredFilters.filterActiveStatus = {
              label: filters.isActive === "true" ? "Active" : "Inactive",
              value: filters.isActive,
            };
          }

          // Favorite - Only restore if user has explicitly selected a value
          if (
            filters.isFavorite !== undefined &&
            filters.isFavorite !== "" &&
            (filters.isFavorite === "true" || filters.isFavorite === "false")
          ) {
            const isFavoriteValue =
              filters.isFavorite === "true" || filters.isFavorite === true;
            restoredFilters.filterFavorite = {
              label: isFavoriteValue ? "Favorite" : "Not Favorite",
              value: String(isFavoriteValue),
            };
          }
          // Search
          if (filters.search) restoredFilters.searchAll = filters.search;

          // Ensure appliedSkills and multipleSkills are always arrays
          if (!restoredFilters.appliedSkills) {
            restoredFilters.appliedSkills = [];
          }
          if (!restoredFilters.multipleSkills) {
            restoredFilters.multipleSkills = [];
          }

          onFiltersRestored(restoredFilters);
        } else {
          // If no saved data, ensure skills are still set to empty arrays
          onFiltersRestored({
            appliedSkills: [],
            multipleSkills: [],
          });
        }
      } catch (err) {
        console.error("Error loading saved filters", err);
      } finally {
        setIsInitializing(false);
        isInitializingRef.current = false;
      }
    };

    loadSavedFilters();
  }, [userId, onFiltersRestored]);

  const saveFiltersToBackend = async (
    filters: FilterState,
    isInitializing?: boolean
  ) => {
    if (!userId || isInitializing || isInitializingRef.current) {
      return;
    }

    try {
      // Ensure appliedSkills and multipleSkills are arrays
      const appliedSkillsArray = Array.isArray(filters.appliedSkills)
        ? filters.appliedSkills
        : filters.appliedSkills
        ? [filters.appliedSkills]
        : [];
      const multipleSkillsArray = Array.isArray(filters.multipleSkills)
        ? filters.multipleSkills
        : filters.multipleSkills
        ? [filters.multipleSkills]
        : [];

      const params: any = {
        ...filters,
        currentCity:
          filters.filterCity.length > 0
            ? filters.filterCity.map((c) => c.label).join(",")
            : "",
        appliedSkills:
          appliedSkillsArray.length > 0
            ? appliedSkillsArray
                .map((s) => s?.label || s?.value || "")
                .filter(Boolean)
                .join(",")
            : "",
        appliedSkillsOR:
          multipleSkillsArray.length > 0
            ? multipleSkillsArray
                .map((s) => s?.label || s?.value || "")
                .filter(Boolean)
                .join(",")
            : "",
        appliedRole:
          filters.filterAppliedRole.length > 0
            ? filters.filterAppliedRole.map((r) => r.label).join(",")
            : "",
        state: filters.filterState?.label || "",
        status: filters.filterStatus?.value || "",
        interviewStage: filters.filterInterviewStage?.value || "",
        gender: filters.filterGender?.value || "",
        currentCompanyDesignation: filters.filterDesignation?.value || "",
        anyHandOnOffers: filters.filterAnyHandOnOffers?.value || "",
        workPreference: filters.filterWorkPreference?.value || "",
        rating: `${filters.filterRating[0]}-${filters.filterRating[1]}`,
        noticePeriod: `${filters.filterNoticePeriod[0]}-${filters.filterNoticePeriod[1]}`,
        communicationSkill: `${filters.filterEngRating[0]}-${filters.filterEngRating[1]}`,
        expectedPkg: `${filters.filterExpectedPkg[0]}-${filters.filterExpectedPkg[1]}`,
        currentPkg: `${filters.filterCurrentPkg[0]}-${filters.filterCurrentPkg[1]}`,
        totalExperience: `${filters.experienceRange[0]}-${filters.experienceRange[1]}`,
        search: filters.searchAll || "",
      };

      // Only include addedBy if user has explicitly selected values
      if (filters.addedBy && filters.addedBy.length > 0) {
        params.addedBy = filters.addedBy.map((a: any) => a.value).join(",");
      }

      // Only include isActive if user has explicitly selected a value
      if (
        filters.filterActiveStatus &&
        filters.filterActiveStatus.value !== ""
      ) {
        params.isActive = filters.filterActiveStatus.value;
      }

      // Only include isFavorite if user has explicitly selected a value
      if (
        filters.filterFavorite &&
        filters.filterFavorite.value !== "" &&
        (filters.filterFavorite.value === "true" ||
          filters.filterFavorite.value === "false")
      ) {
        params.isFavorite = filters.filterFavorite.value;
      }

      const save = await saveFilters(userId, params);
      if (save.success) {
        console.log("filters saved", save);
      }
    } catch (error) {
      console.error("Error saving filters", error);
    }
  };

  return {
    isInitializing,
    isInitializingRef,
    saveFiltersToBackend,
  };
};
