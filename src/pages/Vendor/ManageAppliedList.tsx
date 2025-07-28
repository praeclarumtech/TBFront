/* eslint-disable @typescript-eslint/no-explicit-any */
import { Row, Col, Card, Container } from "react-bootstrap";
import { Fragment, useEffect, useState, useMemo } from "react";
import { BaseSelect } from "components/BaseComponents/BaseSelect";
import TableContainer from "components/BaseComponents/TableContainer";
import { Tooltip as ReactTooltip } from "react-tooltip";
import * as Tooltip from "@radix-ui/react-tooltip";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-loading-skeleton/dist/skeleton.css";
import { ExportApplicant } from "api/applicantApi";

import ViewModal from "../applicant/ViewApplicant";

import DeleteModal from "components/BaseComponents/DeleteModal";

import { SelectedOption } from "interfaces/applicant.interface";
import { dynamicFind, errorHandle } from "utils/commonFunctions";
import appConstants from "constants/constant";
import Skeleton from "react-loading-skeleton";
import saveAs from "file-saver";

import debounce from "lodash.debounce";

import BaseModal from "components/BaseComponents/BaseModal";
import CheckboxMultiSelect from "components/BaseComponents/CheckboxMultiSelect";

import ConfirmModal from "components/BaseComponents/BaseConfirmModal";
import { useLocation } from "react-router-dom";
import {
  deleteApplicantVendor,
  updateStageVendor,
  updateStatusVendor,
  viewAllJobApplicants,
} from "api/apiVendor";

const {
  exportableFieldOption,
  projectTitle,
  Modules,
  interviewStageOptions,
  statusOptions,
} = appConstants;

const ManageAppliedList = () => {
  document.title = Modules.Applicant + " | " + projectTitle;

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const filterFromChart = params.get("filter");
  const filterTypeChart = params.get("type");
  const applicantStatusChart = params.get("applicantStatusChart");
  // const addedByChart = params.get("addedByChart");
  const filterStatusDashboard = params.get("status");

  const [loader, setLoader] = useState(false);
  const [applicant, setApplicant] = useState<any[]>([]);
  const [selectedApplicantId, setSelectedApplicantId] = useState<string | null>(
    null
  );
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 50,
  });
  const [tableLoader, setTableLoader] = useState(false);
  const [selectedApplicants, setSelectedApplicants] = useState<string[]>([]);

  const [sourcePage, setSourcePage] = useState("vendor");

  const [loading, setLoading] = useState<boolean>(false);
  const [modelLoading, setModelLoading] = useState<boolean>(false);

  const [multipleApplicantDelete, setMultipleApplicantsDelete] = useState<
    string[]
  >([]);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showConfirmExportModal, setShowConfirmExportModal] = useState(false);
  const [exportOption, setExportOption] = useState("");
  const [exportableFields, setExportableFields] = useState<SelectedOption[]>(
    []
  );

  const fetchApplicants = async () => {
    setTableLoader(true);
    setApplicant([]);
    setTableLoader(true);
    setLoading(true);

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
        filterBy?: string;
      } = {
        page: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
        limit: 50,
      };

      if (filterFromChart) {
        if (filterTypeChart === "city") {
          params.currentCity = filterFromChart;
        } else if (filterTypeChart === "state") {
          params.state = filterFromChart;
        }
      }
      if (filterStatusDashboard) {
        params.status = filterStatusDashboard;
      }

      params.filterBy = "vendor";

      const res = await viewAllJobApplicants(params);
      setApplicant(res?.data?.applications || res?.data?.results || []);
      setTotalRecords(res?.data?.pagination?.totalCount || 0);
    } catch (error: any) {
      if (error) {
        toast.error(error?.response?.data?.message);
      } else {
        toast.error("Failed to fetch applicants.. Please try again.", {
          closeOnClick: true,
          autoClose: 5000,
        });
      }
    } finally {
      setTableLoader(false);
      setLoading(false);
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

    filterFromChart,
    applicantStatusChart,
    filterStatusDashboard,
  ]);

  const handleDeleteSingle = (applicantId: string) => {
    setMultipleApplicantsDelete([applicantId]);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedApplicants([]);
  };

  //   const closeActiveModal = () => {
  //     setShowActiveModal(false);
  //   };

  const deleteMultipleApplicantDetails = (
    multipleApplicantDelete: string[] | undefined | null
  ) => {
    setLoader(true);
    deleteApplicantVendor(multipleApplicantDelete)
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

  const handleConfirmExportModalShow = () => {
    setShowConfirmExportModal(true);
  };

  const closeConfirmExportModal = () => {
    setShowConfirmExportModal(false);
  };

  const columns = useMemo(
    () => [
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
                className="text-[#624bff] underline cursor-pointer truncated-text hover:text-[#3f3481]"
                title={fullName}
                onClick={() => handleView(info.row.original._id, "vendor")}
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
        header: "Job ID",
        accessorKey: "job_id.job_id",
        cell: (cell: any) => {
          const job = cell.row.original.job_id;
          return job?.job_id || "-";
        },
        enableColumnFilter: false,
      },
      {
        header: "Job Title",
        accessorKey: "job_id.job_subject",
        cell: (cell: any) => {
          const job = cell.row.original.job_id;
          return job?.job_subject || "-";
        },
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
                    onClick={() => handleView(row.original._id, "vendor")}
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
                updateStageVendor(
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
                updateStatusVendor(
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
    ],
    [applicant, selectedApplicants]
  );

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

      <Container fluid>
        <Row className="my-3">
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

export default ManageAppliedList;
