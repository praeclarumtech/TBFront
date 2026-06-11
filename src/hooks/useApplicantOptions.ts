import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "react-toastify";
import { ViewAppliedSkills } from "api/skillsApi";
import { viewRoleSkill } from "api/roleApi";
import { viewAllCity } from "api/cityApis";
import { viewAllState } from "api/stateApi";
import { viewAllDesignation } from "api/designation";
import {
  SelectedOption,
  SelectedOption1,
  City,
} from "interfaces/applicant.interface";

export interface ApplicantOptions {
  skillOptions: SelectedOption1[];
  appliedRoleOptions: SelectedOption[];
  designationOptions: SelectedOption[];
  cities: City[];
  states: City[];
}

const OPTION_PAGE_SIZE = 20;
const SEARCH_DEBOUNCE_MS = 300;

export const useApplicantOptions = () => {
  const [skillOptions, setSkillOptions] = useState<SelectedOption1[]>([]);
  const [skillPage, setSkillPage] = useState(1);
  const [hasMoreSkills, setHasMoreSkills] = useState(true);
  const [loadingMoreSkills, setLoadingMoreSkills] = useState(false);
  const [loadingSkills, setLoadingSkills] = useState(false);
  const [appliedRoleOptions, setAppliedRoleOptions] = useState<
    SelectedOption[]
  >([]);
  const [rolePage, setRolePage] = useState(1);
  const [hasMoreRoles, setHasMoreRoles] = useState(true);
  const [loadingMoreRoles, setLoadingMoreRoles] = useState(false);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [cities, setCities] = useState<City[]>([]);
  const [cityPage, setCityPage] = useState(1);
  const [hasMoreCities, setHasMoreCities] = useState(true);
  const [loadingMoreCities, setLoadingMoreCities] = useState(false);
  const [states, setStates] = useState<City[]>([]);
  const [statePage, setStatePage] = useState(1);
  const [hasMoreStates, setHasMoreStates] = useState(true);
  const [loadingMoreStates, setLoadingMoreStates] = useState(false);
  const [designationOptions, setDesignationOptions] = useState<
    SelectedOption[]
  >([]);
  const [designationPage, setDesignationPage] = useState(1);
  const [hasMoreDesignations, setHasMoreDesignations] = useState(true);
  const [loadingMoreDesignations, setLoadingMoreDesignations] = useState(false);
  const [loadingDesignations, setLoadingDesignations] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const skillSearchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const roleSearchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const designationSearchTimeoutRef = useRef<ReturnType<
    typeof setTimeout
  > | null>(null);

  const fetchSkills = useCallback(
    async (page: number = 1, append: boolean = false, search?: string) => {
      try {
        if (append) setLoadingMoreSkills(true);
        if (!append) {
          setLoading(true);
          setLoadingSkills(true);
        }
        const params: any = {
          page,
          pageSize: OPTION_PAGE_SIZE,
          limit: OPTION_PAGE_SIZE,
        };
        if (search) params.search = search;
        const response = await ViewAppliedSkills(params);

        const rawData = response?.data?.data;
        const skillData = Array.isArray(rawData) ? rawData : [];
        const options = skillData.map((item: any) => ({
          label: item.skills,
          value: item.skills,
          id: item._id,
        }));

        if (append && !search) {
          setSkillOptions((prev) => {
            const existingValues = new Set(prev.map((option) => option.value));
            const newOptions = options.filter(
              (option: SelectedOption1) => !existingValues.has(option.value),
            );
            return [...prev, ...newOptions];
          });
          setHasMoreSkills(options.length >= OPTION_PAGE_SIZE);
          setSkillPage((currentPage) => currentPage + 1);
        } else {
          setSkillOptions(options);
          setHasMoreSkills(options.length >= OPTION_PAGE_SIZE);
          setSkillPage(2);
        }
      } catch (error: any) {
        const details = error?.response?.data?.details;
        if (Array.isArray(details)) {
          details.forEach((msg: string) => {
            toast.error(msg, {
              closeOnClick: true,
              autoClose: 5000,
            });
          });
        } else {
          toast.error("Failed to fetch skills. Please try again.", {
            closeOnClick: true,
            autoClose: 5000,
          });
        }
      } finally {
        if (append) setLoadingMoreSkills(false);
        if (!append) {
          setLoading(false);
          setLoadingSkills(false);
        }
      }
    },
    [],
  );

  const loadMoreSkills = useCallback(() => {
    if (!loadingMoreSkills && hasMoreSkills) {
      fetchSkills(skillPage, true);
    }
  }, [fetchSkills, hasMoreSkills, loadingMoreSkills, skillPage]);

  const onSkillInputChange = useCallback(
    (value: string) => {
      if (skillSearchTimeoutRef.current) {
        clearTimeout(skillSearchTimeoutRef.current);
      }
      skillSearchTimeoutRef.current = setTimeout(() => {
        fetchSkills(1, false, value.trim() || undefined);
        skillSearchTimeoutRef.current = null;
      }, SEARCH_DEBOUNCE_MS);
    },
    [fetchSkills],
  );

  const fetchAppliedRole = useCallback(
    async (page: number = 1, append: boolean = false, search?: string) => {
      try {
        if (append) setLoadingMoreRoles(true);
        if (!append) setLoadingRoles(true);
        const params: any = {
          page,
          pageSize: OPTION_PAGE_SIZE,
          limit: OPTION_PAGE_SIZE,
        };
        if (search) params.search = search;
        const roleData = await viewRoleSkill(params);
        const rawData = roleData?.data?.data;
        const appliedRoleData = Array.isArray(rawData) ? rawData : [];
        const options = appliedRoleData.map((item: any) => ({
          label: item.appliedRole,
          value: item.appliedRole,
        }));

        if (append && !search) {
          setAppliedRoleOptions((prev) => {
            const existingValues = new Set(prev.map((option) => option.value));
            const newOptions = options.filter(
              (option: SelectedOption) => !existingValues.has(option.value),
            );
            return [...prev, ...newOptions];
          });
          setHasMoreRoles(options.length >= OPTION_PAGE_SIZE);
          setRolePage((currentPage) => currentPage + 1);
        } else {
          setAppliedRoleOptions(options);
          setHasMoreRoles(options.length >= OPTION_PAGE_SIZE);
          setRolePage(2);
        }
      } catch (error: any) {
        const details = error?.response?.data?.details;
        if (Array.isArray(details)) {
          details.forEach((msg: string) => {
            toast.error(msg, {
              closeOnClick: true,
              autoClose: 5000,
            });
          });
        } else {
          toast.error("Failed to fetch roles. Please try again.", {
            closeOnClick: true,
            autoClose: 5000,
          });
        }
      } finally {
        if (append) setLoadingMoreRoles(false);
        if (!append) setLoadingRoles(false);
      }
    },
    [],
  );

  const loadMoreAppliedRoles = useCallback(() => {
    if (!loadingMoreRoles && hasMoreRoles) {
      fetchAppliedRole(rolePage, true);
    }
  }, [fetchAppliedRole, hasMoreRoles, loadingMoreRoles, rolePage]);

  const onAppliedRoleInputChange = useCallback(
    (value: string) => {
      if (roleSearchTimeoutRef.current) {
        clearTimeout(roleSearchTimeoutRef.current);
      }
      roleSearchTimeoutRef.current = setTimeout(() => {
        fetchAppliedRole(1, false, value.trim() || undefined);
        roleSearchTimeoutRef.current = null;
      }, SEARCH_DEBOUNCE_MS);
    },
    [fetchAppliedRole],
  );

  const getCities = useCallback(
    async (page: number = 1, append: boolean = false) => {
      try {
        if (append) setLoadingMoreCities(true);
        const cityData = await viewAllCity({
          page,
          pageSize: OPTION_PAGE_SIZE,
          limit: OPTION_PAGE_SIZE,
        });
        const cityItemsRaw = cityData?.data?.item ?? cityData?.item;
        const cityItems = Array.isArray(cityItemsRaw) ? cityItemsRaw : [];
        const options = cityItems.map(
          (city: { city_name: string; _id: string }) => ({
            label: city.city_name,
            value: city._id,
          }),
        );

        if (append) {
          setCities((prev) => {
            const existingValues = new Set(prev.map((option) => option.value));
            const newOptions = options.filter(
              (option: City) => !existingValues.has(option.value),
            );
            return [...prev, ...newOptions];
          });
          setHasMoreCities(options.length >= OPTION_PAGE_SIZE);
          setCityPage((currentPage) => currentPage + 1);
        } else {
          setCities(options);
          setHasMoreCities(options.length >= OPTION_PAGE_SIZE);
          setCityPage(2);
        }
      } catch (error: any) {
        const details = error?.response?.data?.details;
        if (Array.isArray(details)) {
          details.forEach((msg: string) => {
            toast.error(msg, {
              closeOnClick: true,
              autoClose: 5000,
            });
          });
        } else {
          toast.error("Failed to fetch cities. Please try again.", {
            closeOnClick: true,
            autoClose: 5000,
          });
        }
      } finally {
        if (append) setLoadingMoreCities(false);
      }
    },
    [],
  );

  const loadMoreCities = useCallback(() => {
    if (!loadingMoreCities && hasMoreCities) {
      getCities(cityPage, true);
    }
  }, [cityPage, getCities, hasMoreCities, loadingMoreCities]);

  const getStates = useCallback(
    async (page: number = 1, append: boolean = false) => {
      try {
        if (append) setLoadingMoreStates(true);
        const stateData = await viewAllState({
          page,
          pageSize: OPTION_PAGE_SIZE,
          limit: OPTION_PAGE_SIZE,
        });
        const stateItemsRaw = stateData?.data?.item ?? stateData?.item;
        const stateItems = Array.isArray(stateItemsRaw) ? stateItemsRaw : [];
        const options = stateItems.map(
          (state: {
            state_name: string;
            _id: string;
            country_id: string;
          }) => ({
            label: state.state_name,
            value: state._id,
            country_id: state.country_id,
          }),
        );

        if (append) {
          setStates((prev) => {
            const existingValues = new Set(prev.map((option) => option.value));
            const newOptions = options.filter(
              (option: City) => !existingValues.has(option.value),
            );
            return [...prev, ...newOptions];
          });
          setHasMoreStates(options.length >= OPTION_PAGE_SIZE);
          setStatePage((currentPage) => currentPage + 1);
        } else {
          setStates(options);
          setHasMoreStates(options.length >= OPTION_PAGE_SIZE);
          setStatePage(2);
        }
      } catch (error: any) {
        const details = error?.response?.data?.details;
        if (Array.isArray(details)) {
          details.forEach((msg: string) => {
            toast.error(msg, {
              closeOnClick: true,
              autoClose: 5000,
            });
          });
        } else {
          toast.error("Failed to fetch states. Please try again.", {
            closeOnClick: true,
            autoClose: 5000,
          });
        }
      } finally {
        if (append) setLoadingMoreStates(false);
      }
    },
    [],
  );

  const loadMoreStates = useCallback(() => {
    if (!loadingMoreStates && hasMoreStates) {
      getStates(statePage, true);
    }
  }, [getStates, hasMoreStates, loadingMoreStates, statePage]);

  const fetchDesignations = useCallback(
    async (page: number = 1, append: boolean = false, search?: string) => {
      try {
        if (append) setLoadingMoreDesignations(true);
        if (!append) setLoadingDesignations(true);
        const params: any = {
          page,
          pageSize: OPTION_PAGE_SIZE,
          limit: OPTION_PAGE_SIZE,
        };
        if (search) params.search = search;
        const response = await viewAllDesignation(params);
        const rawData = response?.data?.data;
        const designationData = Array.isArray(rawData) ? rawData : [];
        const options = designationData.map((item: any) => ({
          label: item.designation,
          value: item.designation,
        }));

        if (append && !search) {
          setDesignationOptions((prev) => {
            const existingValues = new Set(prev.map((option) => option.value));
            const newOptions = options.filter(
              (option: SelectedOption) => !existingValues.has(option.value),
            );
            return [...prev, ...newOptions];
          });
          setHasMoreDesignations(options.length >= OPTION_PAGE_SIZE);
          setDesignationPage((currentPage) => currentPage + 1);
        } else {
          setDesignationOptions(options);
          setHasMoreDesignations(options.length >= OPTION_PAGE_SIZE);
          setDesignationPage(2);
        }
      } catch (error: any) {
        const details = error?.response?.data?.details;
        if (Array.isArray(details)) {
          details.forEach((msg: string) => {
            toast.error(msg, {
              closeOnClick: true,
              autoClose: 5000,
            });
          });
        } else {
          toast.error("Failed to fetch designations. Please try again.", {
            closeOnClick: true,
            autoClose: 5000,
          });
        }
      } finally {
        if (append) setLoadingMoreDesignations(false);
        if (!append) setLoadingDesignations(false);
      }
    },
    [],
  );

  const loadMoreDesignations = useCallback(() => {
    if (!loadingMoreDesignations && hasMoreDesignations) {
      fetchDesignations(designationPage, true);
    }
  }, [
    designationPage,
    fetchDesignations,
    hasMoreDesignations,
    loadingMoreDesignations,
  ]);

  const onDesignationInputChange = useCallback(
    (value: string) => {
      if (designationSearchTimeoutRef.current) {
        clearTimeout(designationSearchTimeoutRef.current);
      }
      designationSearchTimeoutRef.current = setTimeout(() => {
        fetchDesignations(1, false, value.trim() || undefined);
        designationSearchTimeoutRef.current = null;
      }, SEARCH_DEBOUNCE_MS);
    },
    [fetchDesignations],
  );

  useEffect(() => {
    fetchAppliedRole();
    fetchSkills();
    getCities();
    getStates();
    fetchDesignations();
  }, [fetchAppliedRole, fetchDesignations, fetchSkills, getCities, getStates]);

  useEffect(() => {
    return () => {
      if (skillSearchTimeoutRef.current) {
        clearTimeout(skillSearchTimeoutRef.current);
      }
      if (roleSearchTimeoutRef.current) {
        clearTimeout(roleSearchTimeoutRef.current);
      }
      if (designationSearchTimeoutRef.current) {
        clearTimeout(designationSearchTimeoutRef.current);
      }
    };
  }, []);

  return {
    skillOptions,
    loadMoreSkills,
    hasMoreSkills,
    loadingMoreSkills,
    onSkillInputChange,
    loadingSkills,
    appliedRoleOptions,
    loadMoreAppliedRoles,
    hasMoreRoles,
    loadingMoreRoles,
    onAppliedRoleInputChange,
    loadingRoles,
    cities,
    loadMoreCities,
    hasMoreCities,
    loadingMoreCities,
    states,
    loadMoreStates,
    hasMoreStates,
    loadingMoreStates,
    designationOptions,
    loadMoreDesignations,
    hasMoreDesignations,
    loadingMoreDesignations,
    onDesignationInputChange,
    loadingDesignations,
    loading,
    refetch: {
      fetchSkills,
      fetchAppliedRole,
      getCities,
      getStates,
    },
  };
};
