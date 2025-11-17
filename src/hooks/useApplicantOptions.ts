import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { ViewAppliedSkills } from "api/skillsApi";
import { viewRoleSkill } from "api/roleApi";
import { city as fetchCities, state as fetchState } from "api/applicantApi";
import { SelectedOption, SelectedOption1, City } from "interfaces/applicant.interface";

export interface ApplicantOptions {
  skillOptions: SelectedOption1[];
  appliedRoleOptions: SelectedOption[];
  cities: City[];
  states: City[];
}

export const useApplicantOptions = () => {
  const [skillOptions, setSkillOptions] = useState<SelectedOption1[]>([]);
  const [appliedRoleOptions, setAppliedRoleOptions] = useState<SelectedOption[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [states, setStates] = useState<City[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const response = await ViewAppliedSkills({
        page: 1,
        pageSize: 50,
        limit: 500,
      });

      const skillData = response?.data?.data || [];
      setSkillOptions(
        skillData.map((item: any) => ({
          label: item.skills,
          value: item._id,
        }))
      );
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
        toast.error("Failed to fetch skills.. Please try again.", {
          closeOnClick: true,
          autoClose: 5000,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchAppliedRole = async () => {
    try {
      const roleData = await viewRoleSkill({
        page: 1,
        pageSize: 50,
        limit: 500,
      });
      const appliedRoleData = roleData?.data?.data || [];
      setAppliedRoleOptions(
        appliedRoleData.map((item: any) => ({
          label: item.appliedRole,
          value: item.appliedRole,
        }))
      );
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
        toast.error("Failed to fetch roles... Please try again.", {
          closeOnClick: true,
          autoClose: 5000,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const getCities = async () => {
    try {
      const cityData = await fetchCities();
      if (cityData?.data?.item) {
        setCities(
          cityData.data.item.map(
            (city: { city_name: string; _id: string }) => ({
              label: city.city_name,
              value: city._id,
            })
          )
        );
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
        toast.error("Failed to fetch cities.. Please try again.", {
          closeOnClick: true,
          autoClose: 5000,
        });
      }
    }
  };

  const getStates = async () => {
    try {
      setLoading(true);
      const stateData = await fetchState();
      if (stateData?.data) {
        setStates(
          stateData.data.item.map(
            (state: {
              state_name: string;
              _id: string;
              country_id: string;
            }) => ({
              label: state.state_name,
              value: state._id,
              country_id: state.country_id,
            })
          )
        );
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
        toast.error("Failed to fetch State.. Please try again.", {
          closeOnClick: true,
          autoClose: 5000,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppliedRole();
    fetchSkills();
    getCities();
    getStates();
  }, []);

  return {
    skillOptions,
    appliedRoleOptions,
    cities,
    states,
    loading,
    refetch: {
      fetchSkills,
      fetchAppliedRole,
      getCities,
      getStates,
    },
  };
};

