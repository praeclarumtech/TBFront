/* eslint-disable @typescript-eslint/no-explicit-any */
import { Row, Card, Container, CardBody } from "react-bootstrap";
import React, {
  Fragment,
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
} from "react";
import TableContainer from "components/BaseComponents/TableContainer";
import EmptyState from "components/BaseComponents/EmptyState";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-loading-skeleton/dist/skeleton.css";
import { ExportApplicant } from "api/applicantApi";

import ViewModal from "./ViewApplicant";
import DeleteModal from "components/BaseComponents/DeleteModal";
import { SelectedOption } from "interfaces/applicant.interface";
import { errorHandle, getCurrentUserRole } from "utils/commonFunctions";
import appConstants from "constants/constant";
import Skeleton from "react-loading-skeleton";
import saveAs from "file-saver";
import { useMediaQuery } from "@mui/material";
import BaseModal from "components/BaseComponents/BaseModal";
import CheckboxMultiSelect from "components/BaseComponents/CheckboxMultiSelect";
import ActiveModal from "components/BaseComponents/ActiveModal";
import ConfirmModal from "components/BaseComponents/BaseConfirmModal";
import BaseFav from "components/BaseComponents/BaseFav";
import { ColumnConfig } from "interfaces/global.interface";

import { useApplicantFilters } from "hooks/useApplicantFilters";
import { useApplicantOptions } from "hooks/useApplicantOptions";
import { useSavedFilters } from "hooks/useSavedFilters";
import {
  buildApplicantParams,
  isAnyFilterApplied,
  ChartParams,
  FilterState,
} from "utils/applicantUtils";
import FilterDrawer from "components/applicant/FilterDrawer";
import { COLUMN_CONFIGURATIONS } from "constants/applicantConstants";
import useApplicant from "./hooks/useApplicant";
import ColumnsDropdown from "components/BaseComponents/ColumnsDropdown";
import * as Tooltip from "@radix-ui/react-tooltip";

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
  favoriteOptions,
} = appConstants;

const Applicant = () => {
  document.title = Modules.Applicant + " | " + projectTitle;
  const currentRole = getCurrentUserRole();
  const location = useLocation();
  const navigate = useNavigate();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const userId = localStorage.getItem("id");

  const chartParams: ChartParams = useMemo(() => {
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
  }, [location.search]);

  const {
    filters,
    handlers,
    setFilters,
    resetFilters: resetFiltersHook,
    restoredFromSession,
  } = useApplicantFilters();
  const { skillOptions, appliedRoleOptions, cities, states } =
    useApplicantOptions();

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 50,
  });
  const [tableLoader, setTableLoader] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedApplicantId, setSelectedApplicantId] = useState<string | null>(
    null,
  );
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showConfirmExportModal, setShowConfirmExportModal] = useState(false);
  const [showActiveModal, setShowActiveModal] = useState(false);
  const [showFavModal, setShowFavModal] = useState(false);
  const [sourcePage, setSourcePage] = useState("main");
  const [loader, setLoader] = useState(false);
  const [modelLoading, setModelLoading] = useState<boolean>(false);
  const [multipleApplicantDelete, setMultipleApplicantsDelete] = useState<
    string[]
  >([]);
  const [exportOption, setExportOption] = useState("");
  const [exportableFields, setExportableFields] = useState<SelectedOption[]>(
    [],
  );
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null);
  const [dataActive, SetDataActive] = useState(true);
  const [isFav, setIsFav] = useState(false);

  const [availableColumns, setAvailableColumns] = useState<ColumnConfig[]>(
    COLUMN_CONFIGURATIONS,
  );

  const {
    isInitializing,
    isInitializingRef,
    saveFiltersToBackend,
  }: {
    isInitializing: boolean;
    isInitializingRef: React.MutableRefObject<boolean>;
    saveFiltersToBackend: (
      filters: FilterState,
      isInitializing?: boolean,
    ) => void;
  } = useSavedFilters(
    userId,
    useCallback(
      (restoredFilters: Partial<FilterState>) => {
        setFilters((prev) => ({ ...prev, ...restoredFilters }));
      },
      [setFilters],
    ),
    restoredFromSession, // Skip backend restore when filters restored from sessionStorage (navigation)
  );

  const {
    data: applicantData,
    columns,
    isDataLoading,
    selectedApplicants,
    setSelectedApplicants,
    refetchApplicants,
    updateApplicant: updateApplicantHook,
    deleteMultiple,
    toggleActiveStatus,
  } = useApplicant({
    filters,
    pagination,
    chartParams,
    availableColumns,
    onView: useCallback((id: string, source: string) => {
      setSelectedApplicantId(id);
      setSourcePage(source);
      setShowViewModal(true);
    }, []),
    onEdit: useCallback(
      (applicantId: string) => {
        navigate(`/applicants/edit-applicant/${applicantId}`);
      },
      [navigate],
    ),
    onDelete: useCallback((applicantId: string) => {
      setMultipleApplicantsDelete([applicantId]);
      setShowDeleteModal(true);
    }, []),
    onEmail: useCallback(
      (applicantId: string, applicantData?: any) => {
        if (applicantData) {
          navigate("/email/compose", {
            state: {
              email_bcc: applicantData.email,
              name: applicantData.name,
              fromPage: location.pathname,
            },
          });
        } else {
          navigate("/email/compose", {
            state: {
              applicantId,
              fromPage: location.pathname,
            },
          });
        }
      },
      [navigate, location.pathname],
    ),
    onToggleSwitch: useCallback((id: any, isActive: any) => {
      setSelectedRecord(id);
      SetDataActive(isActive);
      setShowActiveModal(true);
    }, []),
    onToggleFavorite: useCallback((isFav: boolean, id: string) => {
      setShowFavModal(true);
      setIsFav(isFav);
      setSelectedApplicantId(id);
    }, []),
  });

  const applicant = applicantData.items;
  const totalRecords = applicantData.totalRecords;

  useEffect(() => {
    setTableLoader(isDataLoading);
    setLoading(isDataLoading);
  }, [isDataLoading]);

  const filtersRestoredRef = useRef(false);
  useEffect(() => {
    if (!isInitializing) {
      filtersRestoredRef.current = true;
    }
  }, [isInitializing]);

  useEffect(() => {
    // Check if skills are selected (even if other filters aren't applied)
    // Handle both array and single object cases
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
    const hasSkills =
      appliedSkillsArray.length > 0 || multipleSkillsArray.length > 0;

    const shouldSave =
      (isAnyFilterApplied(filters, chartParams) || hasSkills) &&
      !isInitializingRef.current &&
      !chartParams.piechartType &&
      filtersRestoredRef.current;

    if (shouldSave) {
      const apiParams = buildApplicantParams(filters, pagination, chartParams);
      apiParams.isActive = "true";
      saveFiltersToBackend(filters, isInitializing);
    }
  }, [
    filters,
    chartParams,
    isInitializing,
    isInitializingRef,
    pagination,
    saveFiltersToBackend,
  ]);

  const handleConfirm = async () => {
    if (!selectedRecord) {
      return;
    }
    setModelLoading(true);
    try {
      await toggleActiveStatus({ id: selectedRecord, isActive: !dataActive });
      setShowActiveModal(false);
      refetchApplicants();
    } catch (error) {
    } finally {
      setModelLoading(false);
      setShowActiveModal(false);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handlers.handleSearchChange(event.target.value);
    setPagination((prev) => ({
      ...prev,
      pageIndex: 0,
    }));
  };

  const resetFilters = async () => {
    resetFiltersHook();
    refetchApplicants();
  };

  // Reset filters while preserving filterActiveStatus
  const resetFiltersWithoutActiveStatus = async () => {
    const currentActiveStatus = filters.filterActiveStatus;
    // Reset all filters to initial state while preserving filterActiveStatus
    setFilters({
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
      filterActiveStatus: currentActiveStatus, // Preserve current active status
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
    });
    refetchApplicants();
  };

  // Check if any filter (excluding filterActiveStatus) is applied
  const hasFiltersExcludingActiveStatus = useMemo(() => {
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
    const hasSkills =
      appliedSkillsArray.length > 0 || multipleSkillsArray.length > 0;

    return (
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
      !!filters.filterWorkPreference ||
      !!filters.filterAnyHandOnOffers ||
      filters.filterCity.length > 0 ||
      !!filters.filterState ||
      hasSkills ||
      (filters.addedBy && filters.addedBy.length > 0) ||
      !!filters.startDate ||
      !!filters.endDate ||
      !!filters.updatedStartDate ||
      !!filters.updatedEndDate ||
      !!filters.filterStatus ||
      !!filters.filterDesignation ||
      !!filters.filterInterviewStage ||
      !!filters.filterGender ||
      filters.filterAppliedRole.length > 0 ||
      !!filters.filterFavorite ||
      (filters.searchAll && filters.searchAll.trim() !== "") ||
      (chartParams &&
        Object.entries(chartParams).some(
          ([key, val]) => val && key !== "piechartType",
        ))
    );
  }, [filters, chartParams]);

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

  const deleteMultipleApplicantDetails = async (
    multipleApplicantDelete: string[] | undefined | null,
  ) => {
    if (!multipleApplicantDelete || multipleApplicantDelete.length === 0)
      return;
    setLoader(true);
    try {
      await deleteMultiple(multipleApplicantDelete);
      setShowDeleteModal(false);
    } catch (error: any) {
      errorHandle(error);
    } finally {
      setLoader(false);
      setShowDeleteModal(false);
    }
  };

  const handleCloseModal = () => {
    setShowViewModal(false);
  };

  const handleSendEmail = () => {
    const emails = applicant
      .filter((app: any) => selectedApplicants.includes(app._id))
      .map((app: any) => ({ email: app.email, name: app.name }));
    navigate("/email/compose", {
      state: {
        email_to: "",
        email_bcc: emails.map((app: any) => app.email).join(", "),
        subject: "",
        description: "",
        name: emails.map((app: any) => app.name),
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

      const queryParams = buildApplicantParams(
        filters,
        pagination,
        chartParams,
      );
      queryParams.source = source;

      await new Promise((resolve) => setTimeout(resolve, 3500));

      const responseBlob = await ExportApplicant(queryParams, payload);
      if (responseBlob.success === false) {
        toast.error(responseBlob.message);
        return;
      }

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
        toast.success("File downloaded successfully.");

        return;
      }

      if (
        parsed?.success === false ||
        parsed?.statusCode === 404 ||
        parsed?.statuscode === 500 ||
        parsed?.statuscode === 403
      ) {
        toast.error(parsed?.message || "No data available to export.");
      } else {
        toast.error("Unexpected JSON response during export.");
      }

      setShowExportModal(false);
      setSelectedApplicants([]);
      setExportOption("");
    } catch (error: any) {
      setShowExportModal(false);
      setModelLoading(false);
      setSelectedApplicants([]);
      setExportOption("");
      toast.error(error.response.data.message || error.response.statusText);
    } finally {
      setShowConfirmExportModal(false);
      setModelLoading(false);
      refetchApplicants();
    }
  };

  const handleColumnSelected = (
    selectedOptions:
      | any[]
      | ((prevState: SelectedOption[]) => SelectedOption[]),
  ) => {
    if (!selectedApplicants || selectedApplicants.length === 0) {
      toast.error("Please select applicants before choosing columns.");
      return;
    }

    setExportableFields(selectedOptions);

    if (Array.isArray(selectedOptions)) {
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

  const handleColumnsChange = (visibleColumns: string[]) => {
    setAvailableColumns((prev) =>
      prev.map((col) => ({
        ...col,
        isVisible: visibleColumns.includes(col.id),
      })),
    );
  };

  const handleNavigate = () => {
    navigate("/applicants/add-applicant");
  };

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

  const handlecancelClose: () => void = () => {
    setShowExportModal(false);
    setExportOption("");
    setExportableFields([]);
  };

  const updateApplicantData = async (isFav: boolean, id: string | null) => {
    if (!id) return;
    try {
      await updateApplicantHook({ id, data: { isFavorite: !isFav } });
      toast.success("Applicant added to favorite list.");
      setShowFavModal(false);
      refetchApplicants();
    } catch (error: any) {
      const errorMessages = error?.response?.data?.details;
      if (errorMessages && Array.isArray(errorMessages)) {
        errorMessages.forEach((errorMessage: string) => {
          toast.error(errorMessage);
        });
      } else {
        toast.error("An error occurred while updating the applicant.");
      }
    } finally {
      setLoading(false);
    }
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
                  zIndex={9999}
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
            <Card className="my-3 ">
              <CardBody>
                <div className="row align-items-center">
                  <div className="mb-2 col-12 col-md-3 mb-md-0 d-flex justify-content-start">
                    <h4 className="fw-bold text-dark">Applicants</h4>{" "}
                  </div>

                  <div className="col-12 col-md-9">
                    <div className="d-md-none">
                      <div className="flex gap-2 mb-2">
                        <input
                          id="search-bar-0"
                          className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 "
                          placeholder="Search..."
                          onChange={handleSearchChange}
                          value={filters.searchAll}
                        />
                        <Tooltip.Provider delayDuration={100}>
                          <Tooltip.Root>
                            <Tooltip.Trigger asChild>
                              <button
                                className="px-3 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
                                onClick={() =>
                                  currentRole === "admin"
                                    ? handleNavigate()
                                    : toast.error(
                                        "Access denied you do not have permission to access this resource.",
                                      )
                                }
                              >
                                <i className="ri-add-line" />
                              </button>
                            </Tooltip.Trigger>
                            <Tooltip.Portal>
                              <Tooltip.Content
                                side="bottom"
                                sideOffset={4}
                                className="px-2 py-1 text-xs text-white rounded shadow-lg bg-success"
                              >
                                Add Applicant
                                <Tooltip.Arrow style={{ fill: "#198754" }} />
                              </Tooltip.Content>
                            </Tooltip.Portal>
                          </Tooltip.Root>

                          {hasFiltersExcludingActiveStatus && (
                            <Tooltip.Root>
                              <Tooltip.Trigger asChild>
                                <button
                                  className="px-3 py-2 text-sm bg-orange-600 text-white rounded-md hover:bg-orange-700 whitespace-nowrap"
                                  onClick={resetFiltersWithoutActiveStatus}
                                >
                                  <i className="ri-refresh-line"></i>
                                </button>
                              </Tooltip.Trigger>
                              <Tooltip.Portal>
                                <Tooltip.Content
                                  side="bottom"
                                  sideOffset={4}
                                  className="px-2 py-1 text-xs text-white rounded shadow-lg bg-warning"
                                >
                                  Reset Filters
                                  <Tooltip.Arrow style={{ fill: "#ffc107" }} />
                                </Tooltip.Content>
                              </Tooltip.Portal>
                            </Tooltip.Root>
                          )}
                        </Tooltip.Provider>
                      </div>

                      {selectedApplicants.length > 0 && (
                        <div className="flex gap-2 mb-2">
                          <Tooltip.Provider delayDuration={100}>
                            <Tooltip.Root>
                              <Tooltip.Trigger asChild>
                                <button
                                  className="flex-1 px-3 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
                                  onClick={handleDeleteAll}
                                >
                                  <i className="ri-delete-bin-fill" />
                                </button>
                              </Tooltip.Trigger>
                              <Tooltip.Portal>
                                <Tooltip.Content
                                  side="bottom"
                                  sideOffset={4}
                                  className="px-2 py-1 text-xs text-white rounded shadow-lg bg-danger"
                                  style={{ zIndex: 9999 }}
                                >
                                  Delete Selected
                                  <Tooltip.Arrow style={{ fill: "#dc3545" }} />
                                </Tooltip.Content>
                              </Tooltip.Portal>
                            </Tooltip.Root>

                            <Tooltip.Root>
                              <Tooltip.Trigger asChild>
                                <button
                                  className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                  onClick={handleSendEmail}
                                >
                                  <i className="ri-mail-close-line" />
                                </button>
                              </Tooltip.Trigger>
                              <Tooltip.Portal>
                                <Tooltip.Content
                                  side="bottom"
                                  sideOffset={4}
                                  className="px-2 py-1 text-xs text-white rounded shadow-lg bg-primary"
                                  style={{ zIndex: 9999 }}
                                >
                                  Email Selected
                                  <Tooltip.Arrow style={{ fill: "#624bff" }} />
                                </Tooltip.Content>
                              </Tooltip.Portal>
                            </Tooltip.Root>
                          </Tooltip.Provider>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Tooltip.Provider delayDuration={100}>
                          <Tooltip.Root>
                            <Tooltip.Trigger asChild>
                              <button
                                className="px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 whitespace-nowrap"
                                onClick={() => {
                                  if (currentRole === "admin") {
                                    setDrawerOpen(true);
                                  } else {
                                    toast.error(
                                      "Access denied! You do not have permission to access this resource.",
                                    );
                                  }
                                }}
                              >
                                <i className="fa fa-filter"></i>
                              </button>
                            </Tooltip.Trigger>
                            <Tooltip.Portal>
                              <Tooltip.Content
                                side="bottom"
                                sideOffset={4}
                                className="px-2 py-1 text-xs text-white rounded shadow-lg bg-primary"
                              >
                                Filter Applicants
                                <Tooltip.Arrow style={{ fill: "#624bff" }} />
                              </Tooltip.Content>
                            </Tooltip.Portal>
                          </Tooltip.Root>

                          <Tooltip.Root>
                            <Tooltip.Trigger asChild>
                              <button
                                className="px-3 py-2 text-sm bg-green-700 text-white rounded-md hover:bg-green-800"
                                onClick={() =>
                                  currentRole === "admin"
                                    ? handleExportModalShow()
                                    : toast.error(
                                        "Access denied you do not have permission to access this resource.",
                                      )
                                }
                              >
                                <i className="ri-upload-2-line" />
                              </button>
                            </Tooltip.Trigger>
                            <Tooltip.Portal>
                              <Tooltip.Content
                                side="bottom"
                                sideOffset={4}
                                className="px-2 py-1 text-xs text-white rounded shadow-lg bg-success"
                              >
                                Export Data
                                <Tooltip.Arrow style={{ fill: "#198754" }} />
                              </Tooltip.Content>
                            </Tooltip.Portal>
                          </Tooltip.Root>
                        </Tooltip.Provider>

                        <Tooltip.Provider delayDuration={100}>
                          <Tooltip.Root>
                            <Tooltip.Trigger asChild>
                              <div>
                                <ColumnsDropdown
                                  availableColumns={availableColumns}
                                  onColumnsChange={handleColumnsChange}
                                />
                              </div>
                            </Tooltip.Trigger>
                            <Tooltip.Portal>
                              <Tooltip.Content
                                side="bottom"
                                sideOffset={4}
                                className="px-2 py-1 text-xs text-white rounded shadow-lg bg-primary"
                              >
                                Manage Columns
                                <Tooltip.Arrow style={{ fill: "#624bff" }} />
                              </Tooltip.Content>
                            </Tooltip.Portal>
                          </Tooltip.Root>
                        </Tooltip.Provider>
                      </div>
                    </div>

                    <div className="d-none d-md-flex justify-content-end align-items-center gap-2">
                      <input
                        id="search-bar-0"
                        className="form-control me-3"
                        style={{ width: "250px" }}
                        placeholder="Search..."
                        onChange={handleSearchChange}
                        value={filters.searchAll}
                      />
                      <Tooltip.Provider delayDuration={100}>
                        <Tooltip.Root>
                          <Tooltip.Trigger asChild>
                            <button
                              className="btn btn-success"
                              onClick={() =>
                                currentRole === "admin"
                                  ? handleNavigate()
                                  : toast.error(
                                      "Access denied you do not have permission to access this resource.",
                                    )
                              }
                            >
                              <i className="ri-add-line" />
                            </button>
                          </Tooltip.Trigger>
                          <Tooltip.Portal>
                            <Tooltip.Content
                              side="bottom"
                              sideOffset={4}
                              className="px-2 py-1 text-xs text-white rounded shadow-lg bg-success"
                              style={{ zIndex: 9999 }}
                            >
                              Add Applicant
                              <Tooltip.Arrow style={{ fill: "#198754" }} />
                            </Tooltip.Content>
                          </Tooltip.Portal>
                        </Tooltip.Root>

                        <Tooltip.Root>
                          <Tooltip.Trigger asChild>
                            <button
                              className="btn btn-primary"
                              onClick={() => {
                                if (currentRole === "admin") {
                                  setDrawerOpen(true);
                                } else {
                                  toast.error(
                                    "Access denied! You do not have permission to access this resource.",
                                  );
                                }
                              }}
                            >
                              <i className="fa fa-filter"></i>
                            </button>
                          </Tooltip.Trigger>
                          <Tooltip.Portal>
                            <Tooltip.Content
                              side="bottom"
                              sideOffset={4}
                              className="px-2 py-1 text-xs text-white rounded shadow-lg bg-primary"
                              style={{ zIndex: 9999 }}
                            >
                              Filter Applicants
                              <Tooltip.Arrow style={{ fill: "#624bff" }} />
                            </Tooltip.Content>
                          </Tooltip.Portal>
                        </Tooltip.Root>

                        {hasFiltersExcludingActiveStatus && (
                          <Tooltip.Root>
                            <Tooltip.Trigger asChild>
                              <button
                                className="btn btn-warning"
                                onClick={resetFiltersWithoutActiveStatus}
                              >
                                <i className="ri-refresh-line"></i>
                              </button>
                            </Tooltip.Trigger>
                            <Tooltip.Portal>
                              <Tooltip.Content
                                side="bottom"
                                sideOffset={4}
                                className="px-2 py-1 text-xs text-white rounded shadow-lg bg-warning"
                                style={{ zIndex: 9999 }}
                              >
                                Reset Filters
                                <Tooltip.Arrow style={{ fill: "#ffc107" }} />
                              </Tooltip.Content>
                            </Tooltip.Portal>
                          </Tooltip.Root>
                        )}

                        {selectedApplicants.length > 0 && (
                          <>
                            <Tooltip.Root>
                              <Tooltip.Trigger asChild>
                                <button
                                  className="btn btn-danger"
                                  onClick={handleDeleteAll}
                                >
                                  <i className="ri-delete-bin-fill" />
                                </button>
                              </Tooltip.Trigger>
                              <Tooltip.Portal>
                                <Tooltip.Content
                                  side="bottom"
                                  sideOffset={4}
                                  className="px-2 py-1 text-xs text-white rounded shadow-lg bg-danger"
                                  style={{ zIndex: 9999 }}
                                >
                                  Delete Selected
                                  <Tooltip.Arrow style={{ fill: "#dc3545" }} />
                                </Tooltip.Content>
                              </Tooltip.Portal>
                            </Tooltip.Root>

                            <Tooltip.Root>
                              <Tooltip.Trigger asChild>
                                <button
                                  className="btn btn-primary"
                                  onClick={handleSendEmail}
                                >
                                  <i className="ri-mail-close-line" />
                                </button>
                              </Tooltip.Trigger>
                              <Tooltip.Portal>
                                <Tooltip.Content
                                  side="bottom"
                                  sideOffset={4}
                                  className="px-2 py-1 text-xs text-white rounded shadow-lg bg-primary"
                                  style={{ zIndex: 9999 }}
                                >
                                  Email Selected
                                  <Tooltip.Arrow style={{ fill: "#624bff" }} />
                                </Tooltip.Content>
                              </Tooltip.Portal>
                            </Tooltip.Root>
                          </>
                        )}

                        <Tooltip.Root>
                          <Tooltip.Trigger asChild>
                            <button
                              className="btn btn-success"
                              onClick={() =>
                                currentRole === "admin"
                                  ? handleExportModalShow()
                                  : toast.error(
                                      "Access denied you do not have permission to access this resource.",
                                    )
                              }
                            >
                              <i className="ri-upload-2-line" />
                            </button>
                          </Tooltip.Trigger>
                          <Tooltip.Portal>
                            <Tooltip.Content
                              side="bottom"
                              sideOffset={4}
                              className="px-2 py-1 text-xs text-white rounded shadow-lg bg-success"
                              style={{ zIndex: 9999 }}
                            >
                              Export Data
                              <Tooltip.Arrow style={{ fill: "#198754" }} />
                            </Tooltip.Content>
                          </Tooltip.Portal>
                        </Tooltip.Root>
                      </Tooltip.Provider>

                      <Tooltip.Provider delayDuration={100}>
                        <Tooltip.Root>
                          <Tooltip.Trigger asChild>
                            <div>
                              <ColumnsDropdown
                                availableColumns={availableColumns}
                                onColumnsChange={handleColumnsChange}
                              />
                            </div>
                          </Tooltip.Trigger>
                          <Tooltip.Portal>
                            <Tooltip.Content
                              side="bottom"
                              sideOffset={4}
                              className="px-2 py-1 text-xs text-white rounded shadow-lg bg-primary"
                              style={{ zIndex: 9999 }}
                            >
                              Manage Columns
                              <Tooltip.Arrow style={{ fill: "#624bff" }} />
                            </Tooltip.Content>
                          </Tooltip.Portal>
                        </Tooltip.Root>
                      </Tooltip.Provider>
                    </div>

                    <FilterDrawer
                      open={drawerOpen}
                      onClose={() => setDrawerOpen(false)}
                      isDesktop={isDesktop}
                      appliedSkills={filters.appliedSkills}
                      multipleSkills={filters.multipleSkills}
                      filterCity={filters.filterCity}
                      filterAppliedRole={filters.filterAppliedRole}
                      filterState={filters.filterState}
                      filterGender={filters.filterGender}
                      filterInterviewStage={filters.filterInterviewStage}
                      filterStatus={filters.filterStatus}
                      filterWorkPreference={filters.filterWorkPreference}
                      filterAnyHandOnOffers={filters.filterAnyHandOnOffers}
                      filterDesignation={filters.filterDesignation}
                      addedBy={filters.addedBy}
                      filterActiveStatus={filters.filterActiveStatus}
                      filterFavorite={filters.filterFavorite}
                      startDate={filters.startDate}
                      endDate={filters.endDate}
                      updatedStartDate={filters.updatedStartDate}
                      updatedEndDate={filters.updatedEndDate}
                      experienceRange={filters.experienceRange}
                      filterNoticePeriod={filters.filterNoticePeriod}
                      filterRating={filters.filterRating}
                      filterEngRating={filters.filterEngRating}
                      filterExpectedPkg={filters.filterExpectedPkg}
                      filterCurrentPkg={filters.filterCurrentPkg}
                      skillsOptions={skillOptions}
                      citiesOptions={cities.map((city: any) => ({
                        label: city.label,
                        value: city.value,
                        id: city.value,
                      }))}
                      appliedRoleOptions={appliedRoleOptions}
                      statesOptions={states.map((state) => ({
                        label: state.label,
                        value: state.value,
                      }))}
                      interviewStageOptions={interviewStageOptions}
                      statusOptions={statusOptions}
                      gendersOptions={gendersType}
                      workPreferenceOptions={workPreferenceType}
                      anyHandOnOffersOptions={anyHandOnOffers.map(
                        (opt: any) => ({
                          label: opt.label,
                          value: String(opt.value),
                        }),
                      )}
                      designationOptions={designationType}
                      addedByOptions={addedByOptions}
                      activeStatusOptions={activeStatusOptions}
                      favoriteOptions={favoriteOptions.map((opt: any) => ({
                        label: opt.label,
                        value: String(opt.value),
                      }))}
                      onAppliedSkillsChange={handlers.handleAppliedSkillsChange}
                      onMultipleSkillsChange={
                        handlers.handleMultipleSkillsChange
                      }
                      onCityChange={handlers.handleCityChange}
                      onAppliedRoleFilterChange={
                        handlers.handleAppliedRoleFilterChange
                      }
                      onAddedByChange={handlers.handleAddedByChange}
                      onStateChange={handlers.handleStateChange}
                      onGenderChange={handlers.handleGenderChange}
                      onInterviewStageChange={
                        handlers.handleInterviewStageChange
                      }
                      onStatusChange={handlers.handleStatusChange}
                      onWorkPreferenceChange={
                        handlers.handleWorkPreferenceChange
                      }
                      onAnyHandOnOffersChange={
                        handlers.handleAnyHandOnOffersChange
                      }
                      onDesignationChange={handlers.handleDesignationChange}
                      onAppliedRoleChange={handlers.handleAppliedRoleChange}
                      onActiveStatusChange={handlers.handleActiveStatusChange}
                      onFavoriteChange={handlers.handleFavoriteChange}
                      onStartDateChange={handlers.handleStartDateChange}
                      onEndDateChange={handlers.handleEndDateChange}
                      onUpdatedStartDateChange={
                        handlers.handleUpdatedStartDateChange
                      }
                      onUpdatedEndDateChange={
                        handlers.handleUpdatedEndDateChange
                      }
                      onExperienceChange={handlers.handleExperienceChange}
                      onNoticePeriodChange={handlers.handleNoticePeriodChange}
                      onRatingChange={handlers.handleRatingChange}
                      onEngRatingChange={handlers.handleEngRatingChange}
                      onExpectedPkgChange={handlers.handleExpectedPkgChange}
                      onCurrentPkgChange={handlers.handleCurrentPkgChange}
                      onResetFilters={resetFilters}
                    />
                  </div>
                </div>
                <div className="pt-0 ">
                  {tableLoader || loading ? (
                    <div className="py-4 text-center">
                      <Skeleton count={1} className="mb-5 min-h-10" />
                      <Skeleton count={5} />
                    </div>
                  ) : applicant.length > 0 ? (
                    <div className="pt-[12px]">
                      <TableContainer
                        columns={columns}
                        data={applicant}
                        availableColumns={availableColumns}
                        onColumnsChange={handleColumnsChange}
                        hideColumnsDropdown={true}
                        customPageSize={50}
                        theadClass="table-light text-muted"
                        thClass="!pt-2 !pb-2"
                        SearchPlaceholder="Search..."
                        tableClass="!text-nowrap !mb-0 !responsive !table-responsive-sm !table-hover !table-outline-none !mb-0"
                        totalRecords={totalRecords}
                        pagination={pagination}
                        setPagination={setPagination}
                        loader={tableLoader}
                        customPadding="0.1rem 1.5rem"
                        rowHeight="6px !important"
                      />
                    </div>
                  ) : (
                    <EmptyState />
                  )}
                </div>
              </CardBody>
            </Card>
          </div>
        </Row>
      </Container>
    </Fragment>
  );
};

export default Applicant;
