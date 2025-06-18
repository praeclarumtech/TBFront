/* eslint-disable @typescript-eslint/no-explicit-any */
import { Row, Col, Card, Container, CardBody } from "react-bootstrap";
import React, { Fragment, useEffect, useState, useMemo, useRef } from "react";
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
  listOfImportApplicants,
  importApplicant,
  ExportImportedApplicant,
  resumeUpload,
  updateManyApplicants,
  deleteImportedMultipleApplicant,
  updateImportedApplicantsStage,
  updateImportedApplicantsStatus,
  duplicateApplicants,
} from "api/applicantApi";

import ViewModal from "../ViewApplicant";
import BaseInput from "components/BaseComponents/BaseInput";
import DeleteModal from "components/BaseComponents/DeleteModal";

import { SelectedOption } from "interfaces/applicant.interface";
import {
  dynamicFind,
  errorHandle,
  InputPlaceHolder,
} from "utils/commonFunctions";
import appConstants from "constants/constant";
import Skeleton from "react-loading-skeleton";
import saveAs from "file-saver";
import BasePopUpModal from "components/BaseComponents/BasePopUpModal";
import { FaExclamationTriangle } from "react-icons/fa";
import debounce from "lodash.debounce";

import BaseModal from "components/BaseComponents/BaseModal";
import CheckboxMultiSelect from "components/BaseComponents/CheckboxMultiSelect";
import ConfirmModal from "components/BaseComponents/BaseConfirmModal";
import DrawerData from "./Drawer";
import { ViewAppliedSkills } from "api/skillsApi";

interface ValueToEdit {
  label: string;
  value: string;
}

const {
  projectTitle,
  Modules,
  exportableFieldOption,
  interviewStageOptions,
  statusOptions,
  designationType,
} = appConstants;

function ImportApplicant() {
  document.title = Modules.ImportApplicant + " | " + projectTitle;
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [applicant, setApplicant] = useState<any[]>([]);
  const [selectedApplicantId, setSelectedApplicantId] = useState<string | null>(
    null
  );
  const [multipleApplicantDelete, setMultipleApplicantsDelete] = useState<
    string[]
  >([]);

  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [searchAll, setSearchAll] = useState<string>("");
  const [uploadedFile, setUploadedFile] = useState<FormData | null>(null);
  const [exportableFields, setExportableFields] = useState<SelectedOption[]>(
    []
  );
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalRecords, setTotalRecords] = useState(0);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 50,
  });
  const [tableLoader, setTableLoader] = useState(true);
  const [selectedApplicants, setSelectedApplicants] = useState<string[]>([]);
  const [importLoader, setImportLoader] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [showPopupModal, setShowPopupModal] = useState(false);
  const [showBaseModal, setShowBaseModal] = useState(false);
  const [valueToEdit, setValueToEdit] = useState<ValueToEdit[]>([]);
  const [sourcePage, setSourcePage] = useState("import");
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportOption, setExportOption] = useState<string>("");
  const [multiEditInterViewStage, setMultiEditInterViewStage] =
    useState<SelectedOption | null>(null);
  const [multiEditStatus, setMultiEditStatus] = useState<SelectedOption | null>(
    null
  );
  const [multiEditRole, setMultiEditRole] = useState<SelectedOption | null>(
    null
  );
  const [multiEditSkills, setMultiEditSkills] = useState<SelectedOption | null>(
    null
  );
  const [multiEditDate, setMultiEditDate] = useState<string | null>(null);
  const [modelLoading, setModelLoading] = useState<boolean>(false);
  const [showConfirmExportModal, setShowConfirmExportModal] = useState(false);
  const [selectedFlag, setSelectedFlag] = useState<boolean | null>(null);
  const [duplicateRecords, setDuplicateRecords] = useState<any>([]);
  const [skillOptions, setSkillOptions] = useState<any[]>([]);
  const fetchDuplicateData = async () => {
    const params: {
      page: number;
      pageSize: number;
      limit: number;
    } = {
      page: 1,
      pageSize: 1,
      limit: 50,
    };

    duplicateApplicants(params)
      .then((res) => {
        if (res?.statusCode === 200 || res?.success === true) {
          setDuplicateRecords(res?.data?.item);
        }
      })
      .catch((error) => {
        console.log("error", error);
      })
      .finally(() => {});
  };

  useEffect(() => {
    fetchDuplicateData();
  }, []);

  const fetchApplicants = async () => {
    setTableLoader(true);
    setLoader(true);
    try {
      const params: {
        page: number;
        pageSize: number;
        limit: number;
        totalExperience?: string;
        noticePeriod?: string;
        rating?: string;
        communicationSkill?: string;
        expectedPkg?: string;
        currentPkg?: string;
        workPreference?: string;
        anyHandOnOffers?: string;
        currentCity?: string;
        state?: string;
        appliedSkills?: string;
        startDate?: string;
        endDate?: string;
        status?: string;
        currentCompanyDesignation?: string;
        interviewStage?: string;
        gender?: string;
        applicantName?: string;
        searchSkills?: string;
        search?: string;
      } = {
        page: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
        limit: 50,
      };
      const searchValue = searchAll?.trim();
      if (searchValue) {
        params.search = searchValue;
      }

      const res = await listOfImportApplicants(params);
      setApplicant(res?.data?.item || res?.data?.results || []);
      setTotalRecords(res?.data?.totalRecords || 0);
      setShowConfirmExportModal(false);
      setModelLoading(false);
    } catch (error) {
      errorHandle(error);
      setModelLoading(false);
    } finally {
      setTableLoader(false);
      setLoader(false);
      setShowConfirmExportModal(false);
      setModelLoading(false);
    }
  };

  useEffect(() => {
    const fetchApplicantsDebounced = debounce(fetchApplicants, 300);

    const fetchData = async () => {
      try {
        setTableLoader(true);
        setLoader(true);
        await Promise.all([fetchApplicantsDebounced()]);
      } catch (error) {
        errorHandle(error);
      } finally {
        setTableLoader(false);
        setLoader(false);
      }
    };

    const delayedSearch = debounce(fetchData, 300);
    delayedSearch();
    return () => delayedSearch.cancel();
  }, [
    pagination.pageIndex,
    pagination.pageSize,
    startDate,
    endDate,
    searchAll,
  ]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchAll(event.target.value);
    setPagination((prev) => ({
      ...prev,
      pageIndex: 0,
    }));
  };
  const handleDateChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    isStartDate: boolean
  ) => {
    if (isStartDate) {
      setStartDate(e.target.value);
    } else {
      setMultiEditDate(e.target.value);
      setEndDate(e.target.value);
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

  const handleDeleteAll = () => {
    if (selectedApplicants.length > 0) {
      setMultipleApplicantsDelete(selectedApplicants);
      setShowDeleteModal(true);
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
      setExportableFields(selectedOptions);
      setExportOption("");
    }
  };

  const deleteMultipleApplicantDetails = (
    multipleApplicantDelete: string[] | undefined | null
  ) => {
    setLoader(true);
    deleteImportedMultipleApplicant(multipleApplicantDelete)
      .then(() => {
        toast.success("Applicants Delete Successfully!.");
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

  const handleView = (id: string, source: "import") => {
    setSelectedApplicantId(id);
    setSourcePage(source);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleEdit = (applicantId: string) => {
    navigate(`/applicants/edit-applicant/${applicantId}?from=import-applicant`);
  };

  const handleEmail = (applicantId: string) => {
    const selectedApplicant = applicant.find(
      (applicant) => applicant._id === applicantId
    );
    if (selectedApplicant) {
      navigate("/email/compose", {
        state: {
          email_to: selectedApplicant.email,
          fromPage: location.pathname,
        },
      });
    }
  };

  const handleSendEmail = () => {
    const emails = applicant
      .filter((app) => selectedApplicants.includes(app._id))
      .map((app) => app.email);
    navigate("/email/compose", {
      state: {
        email_to: emails.join(", "),
        email_bcc: "",
        subject: "",
        description: "",
        fromPage: location.pathname,
      },
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const validExtensions = ["csv", "xlsx", "xls", "xltx"];
    const resumeExtensions = ["doc", "pdf", "docx"];

    const firstExtension = files[0].name.split(".").pop()?.toLowerCase() ?? "";

    if (validExtensions.includes(firstExtension)) {
      handleFileImport(e);
    } else if (
      [...files].every((file) =>
        resumeExtensions.includes(
          file.name.split(".").pop()?.toLowerCase() || ""
        )
      )
    ) {
      const newEvent = {
        target: { files },
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleResumeUpload(newEvent);
    } else {
      toast.error(
        "Unsupported file type. Please upload a CSV, Excel, Word, or PDF file."
      );
    }
  };

  const handleResumeUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const allowedExtensions = ["doc", "pdf", "docx"];
    const validFiles = Array.from(files).filter((file) =>
      allowedExtensions.includes(
        file.name.split(".").pop()?.toLowerCase() || ""
      )
    );

    if (validFiles.length === 0) {
      toast.error("Please upload valid PDF or DOC/DOCX files.");
      return;
    }

    const largeFiles = validFiles.filter((file) => file.size > 5 * 1024 * 1024);
    if (largeFiles.length > 0) {
      toast("One or more large files detected. Import may take a few minutes.");
    }

    setImportLoader(true);
    setIsImporting(true);
    setImportProgress(0);

    try {
      const formData = new FormData();
      validFiles.forEach((file) => {
        formData.append("resume", file); // Ensure backend expects 'resumes'
      });

      const response = await resumeUpload(formData, {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 100)
          );
          setImportProgress(progress);
        },
      });

      if (response?.success) {
        if (response?.data?.summary?.insertedApplicants > 0) {
          toast.success(response.message);
        }
        await fetchApplicants();
      } else {
        throw new Error(response?.message || "Upload failed");
      }
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Unexpected error during upload";
      toast.error(message);
    } finally {
      setImportLoader(false);
      setIsImporting(false);
      setImportProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      fetchDuplicateData();
    }
  };

  const handleFileImport = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    if (!["csv", "xlsx", "xls", ".xltx"].includes(fileExtension || "")) {
      toast.error("Please upload a valid CSV or Excel file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      // 5MB
      toast("Large file detected. Import may take a few minutes.", {
        icon: <FaExclamationTriangle />,
        autoClose: 4000,
      });
    }

    setImportLoader(true);
    setIsImporting(true);
    setImportProgress(0);

    try {
      const formData = new FormData();
      formData.append("csvFile", file);
      setUploadedFile(formData);
      const updateFlag = "false";
      const response = await importApplicant(formData, {
        params: { updateFlag },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 100)
          );
          setImportProgress(progress);
        },
      });

      if (response?.success) {
        toast.success(response?.message || "File imported successfully!");
      } else if (!response?.success && response.statusCode === 400) {
        // setShowPopupModal(true);
        const messages = response?.message;
        if (messages && Array.isArray(messages)) {
          messages.forEach((messages) => {
            toast.error(messages);
          });
        }
        toast.error(response.message || "Import failed");
      } else if (!response?.success && response.statusCode === 409) {
        setShowPopupModal(true);
        toast.error(response.message || "Import failed");
        fetchDuplicateData();
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to import file");
    } finally {
      fetchApplicants();
      setImportLoader(false);
      setIsImporting(false);
      setImportProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      fetchDuplicateData();
    }
  };

  const handleModalConfirm = async () => {
    if (!uploadedFile) return;

    setImportLoader(true);
    setIsImporting(true);
    setImportProgress(0);

    try {
      const formData = new FormData();
      formData.append("csvFile", uploadedFile.get("csvFile") as Blob);
      const updateFlag = "true";

      const response = await importApplicant(formData, {
        params: { updateFlag },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 100)
          );
          setImportProgress(progress);
        },
      });

      if (response?.success) {
        toast.success(
          response?.message || "Existing applicants updated successfully!"
        );
        setShowPopupModal(false);
        await fetchApplicants();
      } else {
        throw new Error(response?.message || "Update failed");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update applicants");
    } finally {
      setImportLoader(false);
      setIsImporting(false);
      setImportProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleModalCancel = () => {
    setShowPopupModal(false);
  };

  const handleSelectedRowToExport = async (filtered: string) => {
    const resetExportState = () => {
      setShowExportModal(false);
      setSelectedApplicants([]);
      setExportOption("");
    };

    const handleJsonResponse = (parsed: any) => {
      if (parsed?.statusCode === 409 && parsed?.success === false) {
        resetExportState();
        toast.error(parsed.message);
        return true;
      }

      if (
        [404, 500].includes(parsed?.statusCode) ||
        parsed?.success === false
      ) {
        resetExportState();
        toast.error(parsed?.message || "No data available to export");
        return true;
      }

      if (parsed?.success === true && parsed?.statusCode === 410) {
        resetExportState();
        toast.success(parsed.message);
        return true;
      }

      if (parsed?.success === true && parsed?.statusCode === 206) {
        resetExportState();
        toast.success(parsed.message);
        return true;
      }

      toast.error("Unexpected JSON response during export.");
      return false;
    };

    try {
      toast.info(
        selectedFlag
          ? "Verify the records for move..."
          : "Preparing file for download..."
      );

      const selectedColumns = exportableFields.map((field) => field.value);
      const payload = {
        ids: selectedApplicants,
        fields: selectedColumns,
        flag: selectedFlag,
      };

      await new Promise((resolve) => setTimeout(resolve, 3500));
      const response = await ExportImportedApplicant({ filtered }, payload);
      const text = await response.text();

      try {
        const parsed = JSON.parse(text);
        if (handleJsonResponse(parsed)) return;
      } catch {
        const blob = new Blob([text], { type: "text/csv" });
        saveAs(blob, "Export_Applicants_data.csv");
        resetExportState();
        toast.success("File downloaded successfully!");
        return;
      }
    } catch (error) {
      resetExportState();
      errorHandle(error);
    } finally {
      fetchApplicants();
    }
  };

  const handleExportModalShow = () => {
    setShowExportModal(true);
  };

  const handleExportOptionChange = (option: string) => {
    setExportOption(option);
    setExportableFields([]);
  };

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
                className="truncated-text"
                title={fullName}
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
        header: "applied Skills",
        accessorKey: "appliedSkills",
        cell: (cell: any) => (
          <div
            className="truncated-text"
            style={truncateText}
            // title={cell.row.original.appliedSkills}
            title={cell.row.original.appliedSkills?.join(", ")}
          >
            {/* {cell.row.original.appliedSkills} */}
            {cell.row.original.appliedSkills?.join(", ")}
          </div>
        ),
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
            <Tooltip.Provider delayDuration={100}>
              {/* View Button with Tooltip */}
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <button
                    className="btn btn-sm btn-soft-success bg-primary"
                    onClick={() => handleView(row.original._id, "import")}
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
                updateImportedApplicantsStage(
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
            // className="custom-select"
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
                updateImportedApplicantsStatus(
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
          />
        ),
        enableColumnFilter: false,
      },
    ],
    [applicant, selectedApplicants]
  );

  const handleCloseClick = () => {
    setShowBaseModal(false);

    setSelectedApplicants([]);
    setValueToEdit([]);
    setMultiEditInterViewStage(null);
    setMultiEditRole(null);
    setMultiEditStatus(null);
    setMultiEditSkills(null);
  };

  const handleSubmit = async () => {
    if (selectedApplicants.length === 0) {
      toast.error("Please select applicants to update.");
      return;
    }

    const applicantIds = selectedApplicants.filter(
      (id) => typeof id === "string" && id.trim() !== ""
    );

    const updateData: any = {};

    if (multiEditStatus) {
      updateData.status = multiEditStatus.value;
    }
    if (multiEditInterViewStage) {
      updateData.interviewStage = multiEditInterViewStage.value;
    }
    if (multiEditDate) {
      updateData.lastFollowUpDate = multiEditDate;
    }
    if (multiEditRole) {
      updateData.appliedRole = multiEditRole.value;
    }
    if (multiEditSkills) {
      updateData.appliedSkills = Array.isArray(multiEditSkills)
        ? multiEditSkills.map((opt) => opt.label)
        : [multiEditSkills.label];
    }

    try {
      await updateManyApplicants(applicantIds, updateData);
      toast.success("Applicants updated successfully!");
      setShowBaseModal(false);
    } catch (error) {
      errorHandle(error);
    } finally {
      fetchApplicants();
      setSelectedApplicants([]);
      setValueToEdit([]);
      setMultiEditInterViewStage(null);
      setMultiEditRole(null);
      setMultiEditStatus(null);
      setMultiEditSkills(null);
    }
  };

  const handleOpenBaseModal = () => {
    setShowBaseModal(true);
  };

  const optionToEdit = [
    { label: "Status", value: "Status" },
    { label: "Interview Stage", value: "Interview Stage" },
    { label: "Last FollowUp Update", value: "Last FollowUp Update" },
    { label: "Applied Role", value: "Applied Role" },
    { label: "Applied Skills", value: "Applied Skills" },
  ];

  const ModalTitle = () => (
    <div className="flex items-center">
      <i className="mr-2 fas fa-file-export" style={{ fontSize: 24 }}></i>
      <span style={{ fontSize: 24, fontWeight: 600 }}>Export Applicants</span>
    </div>
  );

  const handleConfirmExportModalShow = (value: boolean) => {
    setShowConfirmExportModal(true);
    setSelectedFlag(value);
  };

  const closeConfirmExportModal = () => {
    setShowConfirmExportModal(false);
  };

  const handlecancelClose = () => {
    setShowExportModal(false);
    setExportOption("");
    setExportableFields([]);
  };

  useEffect(() => {
    setLoader(true);
    const fetchSkills = async () => {
      try {
        const page = 1;
        const pageSize = 50;
        const limit = 1000;
        const response = await ViewAppliedSkills({ page, pageSize, limit });
        const skillData = response?.data.data || [];

        setSkillOptions(
          skillData.map((item: any) => ({
            label: item.skills,
            value: item._id,
          }))
        );
      } catch (error) {
        errorHandle(error);
      } finally {
        setLoader(false);
      }
    };

    fetchSkills();
  }, []);

  return (
    <Fragment>
      <ConfirmModal
        show={showConfirmExportModal}
        loader={modelLoading}
        onYesClick={() => handleSelectedRowToExport(exportOption)}
        onCloseClick={closeConfirmExportModal}
        flag={selectedFlag}
      />

      <BaseModal
        show={showExportModal}
        onSubmitClick={() => handleConfirmExportModalShow(false)}
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
                {["Resume", "Csv", "both"].map((option) => (
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

      <BasePopUpModal
        isOpen={showPopupModal}
        onRequestClose={() => setShowPopupModal(false)}
        title="Duplicate Records Found"
        message="Do you want to update the existing applicants?"
        confirmAction={handleModalConfirm}
        cancelAction={handleModalCancel}
        confirmText="Yes, Update"
        cancelText="No, Don't Update"
      />

      {showModal && selectedApplicantId && (
        <ViewModal
          show={showModal}
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
        // recordId={recordIdToDelete}
        loader={loader}
      />

      <Container fluid>
        <Row>
          <div>
            <Card className="my-3 mb-3">
              <CardBody>
                <div className="container">
                  <div
                    className={
                      duplicateRecords?.length > 0
                        ? "d-flex justify-content-between align-items-center"
                        : "row align-items-end"
                    }
                  >
                    {duplicateRecords?.length > 0 && (
                      <DrawerData
                        duplicateRecords={duplicateRecords}
                        fetchDuplicateData={fetchDuplicateData}
                      />
                    )}

                    <div className="flex-wrap gap-2 d-flex justify-content-end">
                      {/* <div> */}
                      <input
                        id="search-bar-0"
                        // className="h-10 form-control search"
                        className="h-10 form-control search w-100 w-md-auto"
                        placeholder="Search..."
                        onChange={handleSearchChange}
                        value={searchAll}
                      />

                      {selectedApplicants.length > 0 && (
                        <>
                          <BaseButton
                            className="ml-2 btn btn-soft-secondary edit-list"
                            onClick={handleOpenBaseModal}
                          >
                            <i className="align-bottom ri-pencil-fill" /> Edit
                            <ReactTooltip
                              place="bottom"
                              variant="info"
                              content="Edit"
                            />
                          </BaseButton>

                          <BaseButton
                            className="text-lg border-0 me-1 btn bg-danger edit-list w-fit"
                            onClick={handleDeleteAll}
                          >
                            <i className="align-bottom ri-delete-bin-fill" />
                          </BaseButton>
                          <ReactTooltip
                            anchorId="delete-button-tooltip"
                            content="Delete"
                            place="bottom"
                            variant="error"
                          />

                          <BaseButton
                            className="ml-2 text-lg btn btn-soft-secondary bg-primary edit-list "
                            onClick={handleSendEmail}
                          >
                            <i className="align-bottom ri-mail-close-line" />
                            <ReactTooltip
                              place="bottom"
                              variant="info"
                              content="Email"
                            />
                          </BaseButton>
                        </>
                      )}

                      <input
                        type="file"
                        ref={fileInputRef}
                        multiple
                        accept=".csv,.xlsx,.xls,.xls,.doc,.pdf,.xltx,.docx"
                        style={{ display: "none" }}
                        onChange={handleFileChange}
                        disabled={isImporting}
                      />

                      <BaseButton
                        color="primary"
                        className="ml-2 bg-green-900 btn btn-soft-secondary edit-list"
                        onClick={() => handleConfirmExportModalShow(true)}
                        disabled={applicant?.length === 0}
                      >
                        <i className="ri-drag-move-line me-1" />
                        Move to Applicant
                      </BaseButton>

                      <BaseButton
                        color="primary"
                        className="ml-2 bg-green-900 btn btn-soft-secondary edit-list"
                        onClick={() => handleExportModalShow()}
                        disabled={applicant?.length === 0}
                      >
                        <i className="ri-upload-2-line me-1" />
                        Export
                      </BaseButton>
                      <BaseButton
                        color="primary"
                        className="ml-2 position-relative"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={importLoader}
                      >
                        {importLoader ? (
                          <>
                            <i className="align-bottom ri-loader-4-line animate-spin me-1" />
                            {isImporting
                              ? `Importing... ${importProgress}%`
                              : "Processing..."}
                          </>
                        ) : (
                          <>
                            <i className="align-bottom ri-download-2-line me-1" />
                            Import
                          </>
                        )}
                        {isImporting && (
                          <div
                            className="bottom-0 progress position-absolute start-0"
                            style={{
                              height: "4px",
                              width: "100%",
                              borderRadius: "0 0 4px 4px",
                            }}
                          >
                            <div
                              className="progress-bar"
                              role="progressbar"
                              style={{ width: `${importProgress}%` }}
                              aria-valuenow={importProgress}
                              aria-valuemin={0}
                              aria-valuemax={100}
                            />
                          </div>
                        )}
                      </BaseButton>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </Row>
        <BaseModal
          show={showBaseModal}
          onCloseClick={handleCloseClick}
          setShowBaseModal={setShowBaseModal}
          onSubmitClick={handleSubmit}
          submitButtonText="Apply All"
          closeButtonText="Close"
          modalTitle="Multi Edit"
        >
          <Row>
            <Col xs={12} md={12} lg={12}>
              {/* MultiSelect for choosing fields */}
              <MultiSelect
                label="Select Field To Edit"
                name="editMany"
                className="mb-2 select-border"
                placeholder="Fields..."
                value={valueToEdit}
                isMulti={true}
                onChange={setValueToEdit}
                options={optionToEdit}
              />

              {/* Interview Stage Selection */}
              {valueToEdit.some((item) => item.value === "Interview Stage") && (
                <BaseSelect
                  label="Interview Stage"
                  name="interviewStage"
                  className="mb-2 select-border"
                  options={interviewStageOptions}
                  placeholder="Interview Stage"
                  handleChange={(selectedOption: SelectedOption) =>
                    setMultiEditInterViewStage(selectedOption)
                  }
                  value={multiEditInterViewStage}
                />
              )}

              {/* Status Selection */}
              {valueToEdit.some((item) => item.value === "Status") && (
                <BaseSelect
                  label="Applicant Status"
                  name="status"
                  className="mb-2 select-border"
                  options={statusOptions}
                  placeholder="Select Status"
                  handleChange={(selectedOption: SelectedOption) =>
                    setMultiEditStatus(selectedOption)
                  }
                  value={multiEditStatus}
                />
              )}
              {valueToEdit.some((item) => item.value === "Applied Role") && (
                <BaseSelect
                  label="Applied Role"
                  name="appliedRole"
                  className="select-border"
                  options={designationType}
                  placeholder={InputPlaceHolder("Applied Role")}
                  handleChange={(selectedOption: SelectedOption) =>
                    setMultiEditRole(selectedOption)
                  }
                  value={multiEditRole}
                />
              )}
              {/* Last FollowUp Date Selection */}
              {valueToEdit.some(
                (item) => item.value === "Last FollowUp Update"
              ) && (
                <BaseInput
                  label="Last FollowUp Date"
                  name="multiEditDate"
                  type="date"
                  placeholder={InputPlaceHolder("Last FollowUp Date")}
                  handleChange={(e) => handleDateChange(e, false)}
                  value={multiEditDate || ""}
                />
              )}
              {valueToEdit.some((item) => item.value === "Applied Skills") && (
                <MultiSelect
                  label="Applied Skills"
                  name="appliedSkills"
                  className="select-border"
                  options={skillOptions}
                  placeholder={InputPlaceHolder("Applied Skills")}
                  handleChange={(selectedOption: SelectedOption) =>
                    setMultiEditSkills(selectedOption)
                  }
                  onChange={(selectedOption: SelectedOption) => {
                    // forward to handleChange logic, or just reuse
                    setMultiEditSkills(selectedOption);
                  }}
                  isMulti={true}
                  value={multiEditSkills}
                />
              )}
            </Col>
          </Row>
        </BaseModal>

        <Row>
          <Col lg={12}>
            <Card>
              <div className="pt-0 card-body">
                {tableLoader ? (
                  <div className="py-4 text-center">
                    <Skeleton count={1} className="mb-5 min-h-10" />

                    <Skeleton count={5} />
                  </div>
                ) : (
                  <div className="pt-4 card-body">
                    {applicant.length > 0 ? (
                      // />
                      <TableContainer
                        isHeaderTitle="Import Applicants"
                        columns={columns}
                        data={applicant}
                        // isGlobalFilter
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
                    ) : (
                      <>
                        <div className="text-center">
                          <i className="ri-search-line d-block fs-1 text-success"></i>
                          {"Total Record: " + totalRecords}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
}

const truncateText = {
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  maxWidth: "150px",
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
    // padding: "0.25rem 0.5rem",
    minHeight: "25px",
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

export default ImportApplicant;
