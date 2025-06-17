/* eslint-disable @typescript-eslint/no-explicit-any */
import { Row, Col, Card, Container, CardBody } from "react-bootstrap";
import React, { Fragment, useEffect, useState, useMemo } from "react";
import BaseButton from "components/BaseComponents/BaseButton";
import { BaseSelect, MultiSelect } from "components/BaseComponents/BaseSelect";
import TableContainer from "components/BaseComponents/TableContainer";
import { useNavigate } from "react-router-dom";
import { Tooltip as ReactTooltip } from "react-tooltip";
import * as Tooltip from "@radix-ui/react-tooltip";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-loading-skeleton/dist/skeleton.css";
import {
  listOfApplicants,
  updateStage,
  updateStatus,
  ExportApplicant,
  deleteMultipleApplicant,
  updateApplicant,
} from "api/applicantApi";

import ViewModal from "./ViewApplicant";
import BaseInput from "components/BaseComponents/BaseInput";
import DeleteModal from "components/BaseComponents/DeleteModal";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import {
  city as fetchCities,
  state as fetchState,
} from "../../api/applicantApi";
import {
  City,
  SelectedOption,
  SelectedOption1,
} from "interfaces/applicant.interface";
import {
  dynamicFind,
  errorHandle,
  InputPlaceHolder,
} from "utils/commonFunctions";
import appConstants from "constants/constant";
import BaseSlider from "components/BaseComponents/BaseSlider";
import Skeleton from "react-loading-skeleton";
import saveAs from "file-saver";

import debounce from "lodash.debounce";

import { ViewAppliedSkills } from "api/skillsApi";
import { IconButton, useMediaQuery } from "@mui/material";
import { Close } from "@mui/icons-material";
import BaseModal from "components/BaseComponents/BaseModal";
import CheckboxMultiSelect from "components/BaseComponents/CheckboxMultiSelect";
import { Switch } from "antd";

import ActiveModal from "components/BaseComponents/ActiveModal";
import { activeApplicant, inActiveApplicant } from "api/apiActive";
import { viewRoleSkill } from "api/roleApi";
import ConfirmModal from "components/BaseComponents/BaseConfirmModal";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import BaseFav from "components/BaseComponents/BaseFav";

const {
  exportableFieldOption,
  projectTitle,
  Modules,
  interviewStageOptions,
  statusOptions,
  gendersType,
  anyHandOnOffers,
  workPreferenceType,
  designationType,
  addedByOptions,
  activeStatusOptions,
} = appConstants;

type Anchor = "top" | "right" | "bottom";
const Applicant = () => {
  document.title = Modules.Applicant + " | " + projectTitle;
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [applicant, setApplicant] = useState<any[]>([]);
  const [selectedApplicantId, setSelectedApplicantId] = useState<string | null>(
    null
  );
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [experienceRange, setExperienceRange] = useState<number[]>([0, 25]);

  const [filterNoticePeriod, setFilterNoticePeriod] = useState<number[]>([
    0, 90,
  ]);

  const [filterStatus, setFilterStatus] = useState<SelectedOption | null>(null);
  const [filterInterviewStage, setFilterInterviewStage] =
    useState<SelectedOption | null>(null);
  const [filterEngRating, setFilterEngRating] = useState<number[]>([0, 10]);

  const [filterAnyHandOnOffers, setFilterAnyHandOnOffers] =
    useState<SelectedOption | null>(null);
  const [filterGender, setFilterGender] = useState<SelectedOption | null>(null);
  const [filterRating, setFilterRating] = useState<number[]>([0, 10]);
  const [filterWorkPreference, setFilterWorkPreference] =
    useState<SelectedOption | null>(null);
  const [filterExpectedPkg, setFilterExpectedPkg] = useState<number[]>([
    0, 100,
  ]);
  const [filterCurrentPkg, setFilterCurrentPkg] = useState<number[]>([0, 100]);
  const [filterDesignation, SetFilterDesignation] =
    useState<SelectedOption | null>(null);
  const [filterCity, setFilterCity] = useState<SelectedOption | null>(null);
  const [filterState, setFilterState] = useState<SelectedOption | null>(null);
  const [appliedSkills, setAppliedSkills] = useState<SelectedOption1[]>([]);
  const [multipleSkills, setMultipleSkills] = useState<SelectedOption1[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalRecords, setTotalRecords] = useState(0);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 50,
  });
  const [tableLoader, setTableLoader] = useState(false);
  const [selectedApplicants, setSelectedApplicants] = useState<string[]>([]);
  const [state, setState] = React.useState({
    right: false,
  });

  const [skillOptions, setSkillOptions] = useState<SelectedOption1[]>([]);
  const [appliedRoleOptions, setAppliedRoleOptions] = useState<
    SelectedOption[]
  >([]);
  const [sourcePage, setSourcePage] = useState("main");

  const [loading, setLoading] = useState<boolean>(false);
  const [modelLoading, setModelLoading] = useState<boolean>(false);
  const [cities, setCities] = useState<City[]>([]);
  const [searchAll, setSearchAll] = useState<string>("");
  const [multipleApplicantDelete, setMultipleApplicantsDelete] = useState<
    string[]
  >([]);
  const [addedBy, setAddedBy] = useState<SelectedOption[]>([]);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showConfirmExportModal, setShowConfirmExportModal] = useState(false);
  const [exportOption, setExportOption] = useState("");
  const [exportableFields, setExportableFields] = useState<SelectedOption[]>(
    []
  );
  const [states, setStates] = useState<City[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null);
  const [dataActive, SetDataActive] = useState(true);
  const [showActiveModal, setShowActiveModal] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [filterActiveStatus, setFilterActiveStatus] =
    useState<SelectedOption | null>(null);
  const [filterAppliedRole, setFilterAppliedRole] = useState<SelectedOption[]>(
    []
  );
  const [filterFavorite, setFilterFavorite] = useState<SelectedOption | null>(
    null
  );

  const today = new Date().toISOString().split("T")[0];

  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setState({ ...state, [anchor]: open });
    };

  const fetchApplicants = async () => {
    setTableLoader(true);
    setApplicant([]);
    setTableLoader(true);

    try {
      const params: {
        page: number;
        pageSize: number;
        limit: number;
        totalExperience?: string;
        currentCity?: string;
        appliedSkills?: string;
        appliedSkillsOR?: string;
        startDate?: string;
        endDate?: string;
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
      } = {
        page: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
        limit: 50,
      };

      if (experienceRange[0] !== 0 || experienceRange[1] !== 25) {
        params.totalExperience = `${experienceRange[0]}-${experienceRange[1]}`;
      }
      if (filterNoticePeriod[0] !== 0 || filterNoticePeriod[1] !== 90) {
        params.noticePeriod = `${filterNoticePeriod[0]}-${filterNoticePeriod[1]}`;
      }
      if (filterRating[0] !== 0 || filterRating[1] !== 10) {
        params.rating = `${filterRating[0]}-${filterRating[1]}`;
      }

      if (filterEngRating[0] !== 0 || filterEngRating[1] !== 10) {
        params.communicationSkill = `${filterEngRating[0]}-${filterEngRating[1]}`;
      }
      if (filterExpectedPkg[0] !== 0 || filterExpectedPkg[1] !== 100) {
        params.expectedPkg = `${filterExpectedPkg[0]}-${filterExpectedPkg[1]}`;
      }

      if (filterCurrentPkg[0] !== 0 || filterCurrentPkg[1] !== 100) {
        params.currentPkg = `${filterCurrentPkg[0]}-${filterCurrentPkg[1]}`;
      }

      if (filterWorkPreference) {
        params.workPreference = filterWorkPreference.value;
      }
      if (filterAnyHandOnOffers) {
        params.anyHandOnOffers = filterAnyHandOnOffers.value;
      }
      if (filterCity) {
        // params.currentCity = filterCity.label;
        params.currentCity = encodeURIComponent(filterCity.label);
      }
      if (filterState) {
        // params.state = filterState.label;
        params.state = encodeURIComponent(filterState.label);
      }

      if (appliedSkills.length > 0) {
        params.appliedSkills = appliedSkills
          .map((skill) => skill.label)
          .join(",");
      }
      if (multipleSkills.length > 0) {
        params.appliedSkillsOR = multipleSkills
          .map((skill) => skill.label)
          .join(",");
      }
      if (addedBy) {
        params.addedBy = addedBy.map((role: any) => role.value).join(",");
      }

      if (startDate) {
        params.startDate = startDate;
      }
      if (endDate) {
        params.endDate = endDate;
      }
      if (filterStatus) {
        params.status = filterStatus.value;
      }

      if (filterDesignation) {
        params.currentCompanyDesignation = filterDesignation.value;
      }
      if (filterInterviewStage) {
        params.interviewStage = filterInterviewStage.value;
      }
      if (filterGender) {
        params.gender = filterGender.value;
      }
      if (filterActiveStatus && filterActiveStatus.value !== "") {
        params.isActive = filterActiveStatus.value;
      }
      if (filterAppliedRole.length > 0) {
        params.appliedRole = filterAppliedRole
          .map((role) => role.label)
          .join(",");
      }
      const searchValue = searchAll?.trim();
      if (searchValue) {
        params.search = searchValue;
      }

      if (filterFavorite) {
        params.isFavorite = filterFavorite.value;
      }

      const res = await listOfApplicants(params);
      setApplicant(res?.data?.item || res?.data?.results || []);
      setTotalRecords(res?.data?.totalRecords || 0);
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
        toast.error("Failed to fetch applicants.. Please try again.", {
          closeOnClick: true,
          autoClose: 5000,
        });
      }
    } finally {
      setTableLoader(false);
    }
  };

  useEffect(() => {
    const delayedSearch = debounce(() => {
      fetchApplicants();
    }, 0);

    delayedSearch();
    return () => delayedSearch.cancel();
  }, [
    pagination.pageIndex,
    pagination.pageSize,
    appliedSkills,
    multipleSkills,
    startDate,
    endDate,
    filterCity,
    filterGender,
    filterInterviewStage,
    filterStatus,
    experienceRange,
    filterNoticePeriod,
    filterExpectedPkg,
    filterCurrentPkg,
    filterDesignation,
    filterAnyHandOnOffers,
    filterState,
    filterRating,
    filterEngRating,
    filterWorkPreference,
    addedBy,
    searchAll,
    filterActiveStatus,
    filterAppliedRole,
    filterFavorite,
  ]);

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
    }
  };

  const handleConfirm = async () => {
    if (!selectedRecord) {
      console.warn("No record selected");
      return;
    }
    setModelLoading(true);
    try {
      switch (dataActive) {
        case true: {
          // console.log("Deactivating user...");
          const res = await inActiveApplicant(selectedRecord);
          if (res.success) {
            setModelLoading(false);
            setShowActiveModal(false);
            toast.success(res.message);
          }
          break;
        }
        case false: {
          // console.log("Activating user...");
          const res = await activeApplicant(selectedRecord);
          if (res.success) {
            setModelLoading(false);
            setShowActiveModal(false);
            toast.success(res.message);
          }
          break;
        }
        default:
          console.warn("Unknown status value:", dataActive);
      }
    } catch (error) {
      console.error("Failed to toggle status:", error);
    } finally {
      setModelLoading(false);
      setShowActiveModal(false);
      fetchApplicants();
    }
  };

  useEffect(() => {
    fetchAppliedRole();
    fetchSkills();
    getCities();
    getStates();
    handleConfirm();
  }, []);

  const handleExperienceChange = (e: React.ChangeEvent<any>) => {
    setExperienceRange(e.target.value as number[]);
  };
  const handleNoticePeriodChange = (e: React.ChangeEvent<any>) => {
    setFilterNoticePeriod(e.target.value as number[]);
  };
  const handleRatingChange = (e: React.ChangeEvent<any>) => {
    setFilterRating(e.target.value as number[]);
  };

  const handleEngRatingChange = (e: React.ChangeEvent<any>) => {
    setFilterEngRating(e.target.value as number[]);
  };

  const handleExpectedPkgChange = (e: React.ChangeEvent<any>) => {
    setFilterExpectedPkg(e.target.value as number[]);
  };
  const handleCurrentPkgChange = (e: React.ChangeEvent<any>) => {
    setFilterCurrentPkg(e.target.value as number[]);
  };

  const handleAppliedSkillsChange = (selectedOptions: SelectedOption1[]) => {
    setAppliedSkills(selectedOptions);
  };
  const handleMultipleSkillsChange = (selectedOptions: SelectedOption1[]) => {
    setMultipleSkills(selectedOptions);
  };

  const handleStateChange = (selectedOption: SelectedOption) => {
    setFilterState(selectedOption);
  };

  const handleGenderChange = (selectedOption: SelectedOption) => {
    setFilterGender(selectedOption);
  };

  const handleInterviewStageChange = (selectedOption: SelectedOption) => {
    setFilterInterviewStage(selectedOption);
  };

  const handleStatusChange = (selectedOption: SelectedOption) => {
    setFilterStatus(selectedOption);
  };

  const handleWorkPreferenceChange = (selectedOption: SelectedOption) => {
    setFilterWorkPreference(selectedOption);
  };

  const handleAnyHandOnOffersChange = (selectedOption: SelectedOption) => {
    setFilterAnyHandOnOffers(selectedOption);
  };

  const handleDesignationChange = (selectedOption: SelectedOption) => {
    SetFilterDesignation(selectedOption);
  };
  const handleDateChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    isStartDate: boolean
  ) => {
    if (isStartDate) {
      setStartDate(e.target.value);
    } else {
      setEndDate(e.target.value);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchAll(event.target.value);
    setPagination((prev) => ({
      ...prev,
      pageIndex: 0,
    }));
  };

  const handleAppliedRoleChange = (selectedOption: SelectedOption[]) => {
    setAddedBy(selectedOption);
  };

  const resetFilters = () => {
    setAppliedSkills([]);
    setMultipleSkills([]);
    setStartDate("");
    setEndDate("");
    setFilterCity(null);
    setFilterGender(null);
    setFilterInterviewStage(null);
    setFilterStatus(null);
    setFilterNoticePeriod([0, 90]);
    setFilterExpectedPkg([0, 100]);
    setFilterCurrentPkg([0, 100]);
    SetFilterDesignation(null);
    setExperienceRange([0, 25]);
    setFilterAnyHandOnOffers(null);
    setFilterWorkPreference(null);
    setFilterRating([0, 10]);
    setFilterEngRating([0, 10]);
    setFilterState(null);
    setAddedBy([]);
    setFilterActiveStatus(null);
    setFilterAppliedRole([]);
    setFilterFavorite(null);
    fetchApplicants();
  };

  const handleCityChange = (selectedOption: SelectedOption) => {
    setFilterCity(selectedOption);

    if (selectedOption) {
      const selectedCityId = selectedOption.value;
      const selectedCity = cities.find((city) => city.value === selectedCityId);

      if (selectedCity) {
        // console.log("Selected city name:", selectedCity.label);
      }
    }
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedApplicants(applicant.map((app) => app._id));
    } else {
      setSelectedApplicants([]);
    }
  };

  const handleSelectApplicant = (applicantId: string) => {
    setSelectedApplicants((prev) =>
      prev.includes(applicantId)
        ? prev.filter((id) => id !== applicantId)
        : [...prev, applicantId]
    );
  };

  const handleDeleteSingle = (applicantId: string) => {
    setMultipleApplicantsDelete([applicantId]);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedApplicants([]);
  };

  const closeActiveModal = () => {
    setShowActiveModal(false);
  };

  const handleDeleteAll = () => {
    if (selectedApplicants.length > 0) {
      setMultipleApplicantsDelete(selectedApplicants);
      setShowDeleteModal(true);
    }
  };

  const deleteMultipleApplicantDetails = (
    multipleApplicantDelete: string[] | undefined | null
  ) => {
    setLoader(true);
    deleteMultipleApplicant(multipleApplicantDelete)
      .then((res) => {
        toast.success(res?.message);
        fetchApplicants();
        setSelectedApplicants([]);
      })
      .catch((error: any) => {
        errorHandle(error);
      })
      .finally(() => {
        setLoader(false);
        setShowDeleteModal(false);
      });
  };

  const handleView = (id: string, source: string) => {
    setSelectedApplicantId(id);
    setSourcePage(source);
    setShowViewModal(true);
  };

  const handleCloseModal = () => {
    setShowViewModal(false);
  };

  const handleEdit = (applicantId: string) => {
    navigate(`/applicants/edit-applicant/${applicantId}`);
  };

  const handleEmail = (applicantId: string) => {
    const selectedApplicant = applicant.find(
      (applicant) => applicant._id === applicantId
    );
    if (selectedApplicant) {
      navigate("/email/compose", {
        state: {
          email_to: selectedApplicant.email,
          name: selectedApplicant.name,
          fromPage: location.pathname,
        },
      });
    }
  };

  const handleSendEmail = () => {
    const emails = applicant
      .filter((app) => selectedApplicants.includes(app._id))
      .map((app) => ({ email: app.email, name: app.name }));
    navigate("/email/compose", {
      state: {
        email_to: "",
        email_bcc: emails.map((app) => app.email).join(", "),
        subject: "",
        description: "",
        name: emails.map((app) => app.name),
        fromPage: location.pathname,
      },
    });
  };

  const handleExportExcel = async (source: string) => {
    try {
      toast.info("Preparing file for download...");
      setModelLoading(true);

      const selectedColumns = exportableFields.map((field) => field.value);
      const payload = {
        ids: selectedApplicants,
        fields: selectedColumns,
        flag: false,
        main: true,
      };

      const queryParams: any = {
        source,
      };

      // Apply filters (copied from fetchApplicants, only relevant filter logic)
      if (experienceRange[0] !== 0 || experienceRange[1] !== 25) {
        queryParams.totalExperience = `${experienceRange[0]}-${experienceRange[1]}`;
      }
      if (filterNoticePeriod[0] !== 0 || filterNoticePeriod[1] !== 90) {
        queryParams.noticePeriod = `${filterNoticePeriod[0]}-${filterNoticePeriod[1]}`;
      }
      if (filterRating[0] !== 0 || filterRating[1] !== 10) {
        queryParams.rating = `${filterRating[0]}-${filterRating[1]}`;
      }
      if (filterEngRating[0] !== 0 || filterEngRating[1] !== 10) {
        queryParams.communicationSkill = `${filterEngRating[0]}-${filterEngRating[1]}`;
      }
      if (filterExpectedPkg[0] !== 0 || filterExpectedPkg[1] !== 100) {
        queryParams.expectedPkg = `${filterExpectedPkg[0]}-${filterExpectedPkg[1]}`;
      }
      if (filterCurrentPkg[0] !== 0 || filterCurrentPkg[1] !== 100) {
        queryParams.currentPkg = `${filterCurrentPkg[0]}-${filterCurrentPkg[1]}`;
      }

      if (filterWorkPreference) {
        queryParams.workPreference = filterWorkPreference.value;
      }
      if (filterAnyHandOnOffers) {
        queryParams.anyHandOnOffers = filterAnyHandOnOffers.value;
      }
      if (filterCity) {
        queryParams.currentCity = encodeURIComponent(filterCity.label);
      }
      if (filterState) {
        queryParams.state = encodeURIComponent(filterState.label);
      }
      if (appliedSkills.length > 0) {
        queryParams.appliedSkills = appliedSkills
          .map((skill) => skill.label)
          .join(",");
      }
      if (multipleSkills.length > 0) {
        queryParams.appliedSkillsOR = multipleSkills
          .map((skill) => skill.label)
          .join(",");
      }
      if (addedBy.length > 0) {
        queryParams.addedBy = addedBy.map((role) => role.value).join(",");
      }

      if (startDate) queryParams.startDate = startDate;
      if (endDate) queryParams.endDate = endDate;
      if (filterStatus) queryParams.status = filterStatus.value;
      if (filterDesignation)
        queryParams.currentCompanyDesignation = filterDesignation.value;
      if (filterInterviewStage)
        queryParams.interviewStage = filterInterviewStage.value;
      if (filterGender) queryParams.gender = filterGender.value;

      if (filterActiveStatus && filterActiveStatus.value !== "") {
        queryParams.isActive = filterActiveStatus.value;
      }

      if (filterAppliedRole.length > 0) {
        queryParams.appliedRole = filterAppliedRole
          .map((role) => role.label)
          .join(",");
      }

      if (searchAll?.trim()) {
        queryParams.search = searchAll.trim();
      }

      if (filterFavorite) {
        queryParams.isFavorite = filterFavorite.value;
      }

      // Wait (if needed)
      await new Promise((resolve) => setTimeout(resolve, 3500));

      const responseBlob = await ExportApplicant(queryParams, payload);

      const text = await responseBlob.text();
      let parsed;

      try {
        parsed = JSON.parse(text);
      } catch {
        const blob = new Blob([text], { type: "text/csv" });
        saveAs(blob, "Main_Applicants_Data.csv");
        setShowExportModal(false);
        setSelectedApplicants([]);
        setShowConfirmExportModal(false);
        setModelLoading(false);
        toast.success("File downloaded successfully!");
        return;
      }

      // If parsed JSON, check for errors
      if (
        parsed?.statusCode === 404 ||
        parsed?.statuscode === 500 ||
        parsed?.success === false
      ) {
        toast.error(parsed?.message || "No data available to export");
      } else {
        toast.error("Unexpected JSON response during export.");
      }

      setShowExportModal(false);
      setSelectedApplicants([]);
      setExportOption("");
    } catch (error) {
      console.log("Export error", error);
      setShowExportModal(false);
      setModelLoading(false);
      setSelectedApplicants([]);
      setExportOption("");
      errorHandle(error);
    } finally {
      setShowConfirmExportModal(false);
      setModelLoading(false);
      fetchApplicants(); // optional refresh
    }
  };

  const handleColumnSelected = (
    selectedOptions: any[] | ((prevState: SelectedOption[]) => SelectedOption[])
  ) => {
    if (!selectedApplicants || selectedApplicants.length === 0) {
      toast.error("Please select applicants before choosing columns.");
      return;
    }

    setExportableFields(selectedOptions);

    if (Array.isArray(selectedOptions)) {
      console.log(
        "Selected values:",
        selectedOptions.map((opt: { value: any }) => opt.value)
      );

      setExportableFields(selectedOptions);
      setExportOption("");
    }
  };

  const handleExportModalShow = () => {
    setShowExportModal(true);
  };

  const handleConfirmExportModalShow = () => {
    setShowConfirmExportModal(true);
  };

  const closeConfirmExportModal = () => {
    setShowConfirmExportModal(false);
  };

  const favoriteOptions = [
    { label: "Favorite", value: true },
    { label: "Not Favorite", value: false },
  ];

  const drawerList = (anchor: Anchor) => (
    <Box
      sx={{
        // width: anchor === "top" || anchor === "bottom" ? "auto" : 400,
        padding: "16px",
        marginTop: anchor === "top" ? "64px" : 0,
        width: isDesktop ? 400 : 250,
      }}
      role="presentation"
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          background: "#fff",
          zIndex: 100,
          paddingBottom: "8px",
          paddingTop: "8px",
        }}
      >
        <Row className="flex items-center justify-between">
          <Col>
            <h3>Apply Filters</h3>
          </Col>
          <Col className="text-end">
            <IconButton
              onClick={toggleDrawer("right", false)}
              sx={{ position: "absolute", top: 0, right: 0, zIndex: 10 }}
            >
              <Close />
            </IconButton>
          </Col>
        </Row>
      </div>
      <List>
        <MultiSelect
          label="Applied Skills"
          name="appliedSkills"
          className="mb-1 select-border"
          placeholder="Applied Skills"
          value={appliedSkills}
          isMulti={true}
          onChange={handleAppliedSkillsChange}
          options={skillOptions}
        />
        <MultiSelect
          label="Multiple Skills"
          name="multipleSkills"
          className="mb-1 select-border"
          placeholder="Multiple Skills"
          value={multipleSkills}
          isMulti={true}
          onChange={handleMultipleSkillsChange}
          options={skillOptions}
        />
        <MultiSelect
          label="Applied Role"
          name="appliedRole"
          className="mb-1 select-border"
          options={appliedRoleOptions}
          placeholder="Applied Role"
          value={filterAppliedRole}
          isMulti={true}
          onChange={(selectedOptions: SelectedOption[]) =>
            setFilterAppliedRole(selectedOptions)
          }
        />

        <BaseSlider
          label="Experience (in years)"
          name="experience"
          className="mx-5 mb-1 select-border "
          value={experienceRange}
          // onChange={handleExperienceChange}
          handleChange={handleExperienceChange}
          min={0}
          max={25}
          step={0.1}
          valueLabelDisplay="auto"
          disabled={false}
        />
        <BaseSelect
          label="City"
          name="city"
          className="mb-1 select-border "
          options={cities}
          placeholder="City"
          handleChange={handleCityChange}
          value={filterCity}
        />
        <BaseSelect
          label="State"
          name="state"
          className="mb-1 select-border "
          options={states}
          placeholder="State"
          handleChange={handleStateChange}
          value={filterState}
        />
        <BaseSelect
          label="Interview Stage"
          name="interviewStage"
          className="mb-1 select-border"
          options={interviewStageOptions}
          placeholder="Interview Stage"
          handleChange={handleInterviewStageChange}
          value={filterInterviewStage}
        />
        <BaseSelect
          label="Applicant Status"
          name="applicantStatus"
          className="mb-1 select-border"
          options={statusOptions}
          placeholder="Applicant Status"
          handleChange={handleStatusChange}
          value={filterStatus}
        />
        <BaseSelect
          label="Gender"
          name="gender"
          className="mb-1 select-border"
          options={gendersType}
          placeholder="Gender"
          handleChange={handleGenderChange}
          value={filterGender}
        />
        <BaseSlider
          label="Expected Pkg(LPA)"
          name="expectedPkg"
          className="mx-5 mb-1 select-border "
          value={filterExpectedPkg}
          handleChange={handleExpectedPkgChange}
          min={0}
          max={100}
          step={1}
          valueLabelDisplay="auto"
        />
        <BaseSlider
          label="Current Pkg(LPA)"
          name="currentPkg"
          className="mx-5 mb-1 select-border "
          value={filterCurrentPkg}
          handleChange={handleCurrentPkgChange}
          min={0}
          max={100}
          step={1}
          valueLabelDisplay="auto"
        />
        <BaseSelect
          label="Designation"
          name="designation"
          className="mb-1 select-border"
          options={designationType}
          placeholder="Designation"
          handleChange={handleDesignationChange}
          value={filterDesignation}
        />
        <BaseSlider
          label="Notice Period (in Days)"
          name="noticePeriod"
          className="mx-5 mb-1 select-border "
          value={filterNoticePeriod}
          handleChange={handleNoticePeriodChange}
          min={0}
          max={90}
          step={1}
          valueLabelDisplay="auto"
          disabled={false}
        />
        <BaseSelect
          label="Work Preference"
          name="workPreference"
          className="mb-1 select-border"
          options={workPreferenceType}
          placeholder="Work Preference"
          handleChange={handleWorkPreferenceChange}
          value={filterWorkPreference}
        />
        <BaseSlider
          label="JavaScript Rating"
          name="rating"
          value={filterRating}
          className="mx-5 mb-1 select-border "
          handleChange={handleRatingChange}
          min={0}
          max={10}
          step={1}
          valueLabelDisplay="auto"
        />
        <BaseSlider
          label="Eng.Communication Rating"
          name="communication"
          className="mx-5 mb-1 select-border "
          value={filterEngRating}
          handleChange={handleEngRatingChange}
          min={0}
          max={10}
          step={1}
          valueLabelDisplay="auto"
        />
        <MultiSelect
          key="addedBy"
          label="Added By"
          name="addedBy"
          className="mb-3 select-border"
          options={addedByOptions}
          isMulti={true}
          placeholder="Added By"
          onChange={handleAppliedRoleChange}
          value={addedBy}
        />
        <BaseSelect
          label="Status"
          name="Status"
          className="mb-1 select-border"
          options={activeStatusOptions}
          placeholder="Status"
          handleChange={(selectedOption: SelectedOption) =>
            setFilterActiveStatus(selectedOption)
          }
          value={filterActiveStatus}
        />
        <BaseSelect
          label="Any Hand On Offers"
          name="anyHandOnOffers"
          className="mb-1 select-border"
          options={anyHandOnOffers}
          placeholder="Any Hand On Offers"
          handleChange={handleAnyHandOnOffersChange}
          value={filterAnyHandOnOffers}
        />
        <BaseSelect
          label="Favorite"
          name="favorite"
          className="mb-1 select-border"
          options={favoriteOptions}
          placeholder="Favorite"
          handleChange={(selectedOption: SelectedOption) =>
            setFilterFavorite(selectedOption)
          }
          value={filterFavorite}
        />

        <Row className="mb-3">
          <Col xs={6}>
            <BaseInput
              label="Start Date"
              name="startDate"
              className="mb-1 select-border"
              type="date"
              placeholder={InputPlaceHolder("Start Date")}
              handleChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleDateChange(e, true)
              }
              value={startDate || ""}
              max={today}
            />
          </Col>
          <Col xs={6}>
            <BaseInput
              label="End Date"
              name="endDate"
              type="date"
              placeholder={InputPlaceHolder("End Date")}
              handleChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleDateChange(e, false)
              }
              value={endDate || ""}
              max={today}
            />
          </Col>
        </Row>
      </List>

      <Divider />
      <div
        style={{
          position: "sticky",
          bottom: 0,
          background: "#fff",
          zIndex: 100,
          paddingTop: "8px",
          paddingBottom: "8px",
        }}
      >
        <Row>
          <Col className="text-end">
            <BaseButton
              color="primary"
              onClick={resetFilters}
              sx={{ width: "auto" }}
            >
              Reset Filters
            </BaseButton>
          </Col>
        </Row>
      </div>
    </Box>
  );

  const columns = useMemo(
    () => [
      {
        header: (
          <input
            type="checkbox"
            onChange={handleSelectAll}
            checked={selectedApplicants.length === applicant.length}
          />
        ),
        accessorKey: "select",
        cell: (info: any) => (
          <input
            type="checkbox"
            checked={selectedApplicants.includes(info.row.original._id)}
            onChange={() => handleSelectApplicant(info.row.original._id)}
          />
        ),
        enableColumnFilter: false,
      },
      {
        header: "Applicant Name",
        accessorKey: "name",
        cell: (info: any) => {
          const nameObj = info.row.original?.name || {};
          const firstName = nameObj.firstName || "";
          const middleName = nameObj.middleName || "";
          const lastName = nameObj.lastName || "";
          const fullName = `${firstName} ${middleName} ${lastName}`.trim();

          return (
            <>
              <div
                style={truncateText}
                className="text-blue-600 underline cursor-pointer truncated-text hover:text-blue-800"
                title={fullName}
                onClick={() => handleView(info.row.original._id, "main")}
              >
                {fullName}
              </div>
              <ReactTooltip
                place="top"
                variant="info"
                content={fullName}
                style={toolipComponents}
              />
            </>
          );
        },
        filterFn: "fuzzy",
        enableColumnFilter: false,
      },
      {
        header: "Skills",
        accessorKey: "appliedSkills",
        cell: (cell: any) => (
          <div
            className="truncated-text"
            style={truncateText}
            title={cell.row.original.appliedSkills?.join(", ")}
          >
            {cell.row.original.appliedSkills?.join(", ")}
          </div>
        ),
        enableColumnFilter: false,
      },
      {
        header: "Role",
        accessorKey: "appliedRole",
        enableColumnFilter: false,
      },
      {
        header: "Total Exp",
        accessorKey: "totalExperience",
        enableColumnFilter: false,
      },
      {
        header: "Action",
        cell: ({ row }: any) => (
          <div className="flex gap-2">
            <Tooltip.Provider delayDuration={50}>
              {/* View Button with Tooltip */}
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <button
                    className="btn btn-sm btn-soft-success bg-primary"
                    onClick={() => handleView(row.original._id, "main")}
                    disabled={!row.original.isActive}
                  >
                    <i className="text-white ri-eye-fill" />
                  </button>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    side="bottom"
                    sideOffset={4}
                    className="px-2 py-1 text-sm text-white rounded shadow-lg bg-primary"
                  >
                    View
                    <Tooltip.Arrow style={{ fill: "#624bff" }} />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>

              {/* Edit Button with Tooltip */}
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <button
                    className="text-white btn btn-sm btn-soft-secondary bg-secondary"
                    onClick={() => handleEdit(row.original._id)}
                    disabled={!row.original.isActive}
                  >
                    <i className="ri-pencil-fill" />
                  </button>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    side="bottom"
                    sideOffset={4}
                    className="px-2 py-1 text-sm text-white rounded shadow-lg bg-secondary"
                  >
                    Edit
                    <Tooltip.Arrow style={{ fill: "#637381" }} />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>

              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <button
                    className="text-white btn btn-sm btn-soft-danger bg-danger"
                    onClick={() => handleDeleteSingle(row.original._id)}
                    disabled={!row.original.isActive}
                  >
                    <i className="align-bottom ri-delete-bin-5-fill" />
                  </button>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    side="bottom"
                    sideOffset={4}
                    className="px-2 py-1 text-sm text-white rounded shadow-lg bg-danger"
                  >
                    Delete
                    <Tooltip.Arrow style={{ fill: "#dc3545" }} />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>

              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <button
                    className="text-white btn btn-sm btn-soft-success bg-success"
                    onClick={() => handleEmail(row.original._id)}
                    disabled={!row.original.isActive}
                  >
                    <i className="align-bottom ri-mail-close-line" />
                  </button>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    side="bottom"
                    sideOffset={4}
                    className="px-2 py-1 text-sm text-white rounded shadow-lg bg-success"
                  >
                    Mail
                    <Tooltip.Arrow style={{ fill: "#198754" }} />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  {row?.original?.isFavorite ? (
                    <i
                      className="align-bottom ri-heart-fill text-danger"
                      style={{ fontSize: "20px", cursor: "pointer" }}
                      onClick={() =>
                        handleConfirmFav(
                          row?.original?.isFavorite,
                          row?.original?._id
                        )
                      }
                    />
                  ) : (
                    <i
                      className="align-bottom ri-heart-line"
                      style={{ fontSize: "20px", cursor: "pointer" }}
                      onClick={() =>
                        handleConfirmFav(
                          row?.original?.isFavorite,
                          row?.original?._id
                        )
                      }
                    />
                  )}
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    side="bottom"
                    sideOffset={4}
                    className="px-2 py-1 text-sm text-white bg-gray-700 rounded shadow-lg"
                  >
                    {row?.original?.isFavorite
                      ? "Remove from Favorites"
                      : "Add to Favorites"}
                    <Tooltip.Arrow style={{ fill: "#454f5b" }} />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </Tooltip.Provider>
          </div>
        ),
      },
      {
        header: "Interview Stage",
        accessorKey: "interviewStage",
        cell: (cell: any) => (
          <BaseSelect
            name="interviewStage"
            // className="custom-select"
            styles={customStyles}
            options={interviewStageOptions}
            value={dynamicFind(
              interviewStageOptions,
              cell.row.original.interviewStage
            )}
            handleChange={(selectedOption: SelectedOption) => {
              const updatedApplicant = [...applicant];
              const applicantIndex = updatedApplicant.findIndex(
                (item) => item._id === cell.row.original._id
              );
              if (applicantIndex > -1) {
                updatedApplicant[applicantIndex].interviewStage =
                  selectedOption.value;
                setApplicant(updatedApplicant);
                updateStage(
                  { interviewStage: selectedOption.value },
                  cell.row.original._id
                )
                  .then(() => {
                    toast.success(
                      "Applicant Interview Stage updated successfully!"
                    );
                  })
                  .catch((error: any) => {
                    errorHandle(error);
                  });
              }
            }}
            isDisabled={!cell?.row?.original?.isActive}
          />
        ),
        enableColumnFilter: false,
      },
      {
        header: "Applicant Status",
        accessorKey: "status",

        cell: (cell: any) => (
          <BaseSelect
            name="status"
            styles={customStyles}
            options={statusOptions}
            value={dynamicFind(statusOptions, cell.row.original.status)}
            handleChange={(selectedOption: SelectedOption) => {
              const updatedApplicant = [...applicant];
              const applicantIndex = updatedApplicant.findIndex(
                (item) => item._id === cell.row.original._id
              );
              if (applicantIndex > -1) {
                updatedApplicant[applicantIndex].status = selectedOption.value;
                setApplicant(updatedApplicant);
                updateStatus(
                  { status: selectedOption.value },
                  cell.row.original._id
                )
                  .then(() => {
                    toast.success("Applicant status updated successfully!");
                  })
                  .catch((error: any) => {
                    errorHandle(error);
                  });
              }
            }}
            isDisabled={!cell?.row?.original?.isActive}
          />
        ),
        enableColumnFilter: false,
      },
      {
        header: "Status",
        accessorKey: "isActive",
        cell: (cell: any) => {
          const id = cell.row.original._id;
          const isActive = cell.getValue();

          return (
            <Switch
              size="small"
              checked={isActive}
              onClick={() => handleToggleSwitch(id, isActive)} // ✅ Handler only runs on user interaction
              checkedChildren={<CheckOutlined />}
              unCheckedChildren={<CloseOutlined />}
            />
          );
        },
        enableColumnFilter: false,
      },
    ],
    [applicant, selectedApplicants]
  );

  const handleToggleSwitch = (id: any, isActive: any) => {
    setSelectedRecord(id);
    SetDataActive(isActive);
    // setPendingChecked(checked);
    setShowActiveModal(true);
  };

  const handleNavigate = () => {
    navigate("/applicants/add-applicant");
  };

  const isMobile = window.innerWidth <= 767;
  const ModalTitle = () => (
    <div className="flex items-center">
      <i className="mr-2 fas fa-file-export" style={{ fontSize: 24 }}></i>
      <span style={{ fontSize: 24, fontWeight: 600 }}>Export Applicants</span>
    </div>
  );
  const handleExportOptionChange = (option: string) => {
    setExportOption(option);
    setExportableFields([]);
  };

  const handlecancelClose = () => {
    setShowExportModal(false);
    setExportOption("");
    setExportableFields([]);
  };

  const [showFavModal, setShowFavModal] = useState(false);
  const [isFav, setIsFav] = useState(false);

  const handleConfirmFav = (isFav: boolean = false, id: string | null) => {
    setShowFavModal(true);
    setIsFav(isFav);
    setSelectedApplicantId(id);
  };

  const updateApplicantData = (isFav: boolean, id: string | null) => {
    updateApplicant({ isFavorite: !isFav }, id)
      .then((res: any) => {
        if (res.success) {
          toast.success("Applicant added to favorite list");
          setShowFavModal(false);
          fetchApplicants();
        }
      })
      .catch((error) => {
        const errorMessages = error?.response?.data?.details;
        if (errorMessages && Array.isArray(errorMessages)) {
          errorMessages.forEach((errorMessage) => {
            toast.error(errorMessage);
          });
        } else {
          toast.error("An error occurred while updating the applicant.");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Fragment>
      <ConfirmModal
        show={showConfirmExportModal}
        loader={modelLoading}
        onYesClick={() => handleExportExcel(exportOption)}
        onCloseClick={closeConfirmExportModal}
        flag={false}
      />
      <BaseModal
        show={showExportModal}
        onSubmitClick={() => handleConfirmExportModalShow()}
        onCloseClick={handlecancelClose}
        loader={false}
        submitButtonText="Export"
        closeButtonText="Close"
        setShowBaseModal={setShowExportModal}
        modalTitle={<ModalTitle />}
        children={
          <div>
            <Row>
              <div>
                <h5>Choose the columns you want to export:</h5>
                <CheckboxMultiSelect
                  label="Select columns"
                  name="selectedColumns"
                  className="mb-2 select-border"
                  placeholder="Fields..."
                  value={exportableFields}
                  isMulti={true}
                  showSelectAll={false}
                  onChange={handleColumnSelected}
                  options={exportableFieldOption}
                  isDisabled={exportOption !== ""}
                />
                {exportableFields.length > 0 && exportOption === "" && (
                  <button
                    className="mt-2 btn btn-sm btn-outline-secondary"
                    onClick={() => setExportableFields([])}
                  >
                    Reset Column Selection
                  </button>
                )}
              </div>
            </Row>

            <Row className="mt-4">
              <div>
                <h5>Select export option:</h5>
                {["Manual", "Resume", "Csv", "both"].map((option) => (
                  <div key={option}>
                    <input
                      className="m-2"
                      type="radio"
                      id={option}
                      name="exportOption"
                      disabled={
                        exportableFields.length > 0 ||
                        selectedApplicants.length > 0
                      }
                      checked={exportOption === option}
                      onChange={() => handleExportOptionChange(option)}
                    />
                    <label htmlFor={option}>{option}</label>
                  </div>
                ))}
                {exportOption && exportableFields.length === 0 && (
                  <button
                    className="mt-2 btn btn-sm btn-outline-secondary"
                    onClick={() => setExportOption("")}
                  >
                    Reset Export Option
                  </button>
                )}
              </div>
            </Row>
          </div>
        }
      />
      {showActiveModal ? (
        <ActiveModal
          show={showActiveModal}
          loader={modelLoading}
          onYesClick={() => handleConfirm()}
          onCloseClick={closeActiveModal}
          flag={dataActive}
        />
      ) : (
        <></>
      )}

      {showViewModal && selectedApplicantId && (
        <ViewModal
          show={showViewModal}
          onHide={handleCloseModal}
          applicantId={selectedApplicantId}
          source={sourcePage}
        />
      )}

      <DeleteModal
        show={showDeleteModal}
        onCloseClick={closeDeleteModal}
        onDeleteClick={() =>
          multipleApplicantDelete.length >= 1
            ? deleteMultipleApplicantDetails(multipleApplicantDelete)
            : null
        }
        loader={loader}
      />

      <BaseFav
        show={showFavModal}
        onCloseClick={() => setShowFavModal(false)}
        onYesClick={() => updateApplicantData(isFav, selectedApplicantId)}
        flag={isFav}
      />

      <Container fluid>
        <Row>
          <div>
            <Card className="my-3 mb-3">
              <CardBody>
                <div className="container">
                  <div className="row align-items-center">
                    {/* Filter Button */}
                    <div className="mb-2 col-12 col-md-3 mb-md-0 d-flex justify-content-start">
                      <button
                        onClick={toggleDrawer("right", true)}
                        className="btn btn-primary d-block d-md-inline-block"
                        style={{
                          width: isMobile ? "150px" : "auto",
                        }}
                      >
                        <i className="mx-1 fa fa-filter"></i> Filters
                      </button>
                      <Drawer
                        className="!mt-16"
                        anchor="right"
                        open={state["right"]}
                        onClose={toggleDrawer("right", false)}
                      >
                        {drawerList("right")}
                      </Drawer>
                    </div>

                    {/* Search & Buttons */}
                    <div className="flex-wrap gap-2 col-12 col-md-9 d-flex justify-content-end">
                      <input
                        id="search-bar-0"
                        className="h-10 form-control search w-100 w-md-auto"
                        placeholder="Search..."
                        onChange={handleSearchChange}
                        value={searchAll}
                      />

                      {selectedApplicants.length > 0 && (
                        <>
                          <BaseButton
                            className="border-0 btn bg-danger"
                            onClick={handleDeleteAll}
                          >
                            <i className="ri-delete-bin-fill" />
                          </BaseButton>

                          <BaseButton
                            className="btn bg-primary"
                            onClick={handleSendEmail}
                          >
                            <i className="ri-mail-close-line" />
                          </BaseButton>
                        </>
                      )}

                      <BaseButton
                        color="primary"
                        className="ml-2 bg-green-900 btn btn-soft-secondary edit-list"
                        onClick={() => handleExportModalShow()}
                      >
                        <i className="ri-upload-2-line me-1" />
                        Export
                      </BaseButton>

                      <BaseButton color="success" onClick={handleNavigate}>
                        <i className="ri-add-line me-1" />
                        Add
                      </BaseButton>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </Row>

        <Row>
          <Col lg={12}>
            <Card>
              <div className="pt-0 card-body">
                {tableLoader || loading ? (
                  <div className="py-4 text-center">
                    <Skeleton count={1} className="mb-5 min-h-10" />
                    <Skeleton count={5} />
                  </div>
                ) : applicant.length > 0 ? (
                  <div className="pt-4 card-body">
                    <TableContainer
                      isHeaderTitle="Applicants"
                      columns={columns}
                      data={applicant}
                      customPageSize={50}
                      theadClass="table-light text-muted"
                      SearchPlaceholder="Search..."
                      tableClass="!text-nowrap !mb-0 !responsive !table-responsive-sm !table-hover !table-outline-none !mb-0"
                      totalRecords={totalRecords}
                      pagination={pagination}
                      setPagination={setPagination}
                      loader={tableLoader}
                      customPadding="0.3rem 1.5rem"
                      rowHeight="10px !important"
                    />
                  </div>
                ) : (
                  <div className="pt-4 text-center">
                    <i className="ri-search-line d-block fs-1 text-success"></i>
                    {"Total Record: " + totalRecords}
                  </div>
                )}
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};

const truncateText = {
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  maxWidth: "150px",
  fontSize: "14px",
};

const toolipComponents = {
  backgroundColor: "blue !important",
  color: "white !important",
  "border-radius": "5px !important",
  padding: "8px 12px !important",
  "font-size": "14px !important",
  border: "1px solid white !important",
};

const customStyles = {
  control: (provided: any) => ({
    ...provided,
    fontSize: "12px",
    backgroundColor: "#f0f0f0",
    borderRadius: "8px",
    borderColor: "transparent",
    // padding: "0.25rem 0.6rem",
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
};

export default Applicant;
