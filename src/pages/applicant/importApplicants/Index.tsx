/* eslint-disable @typescript-eslint/no-explicit-any */
import { Row, Col, Card, Container, CardBody, Spinner } from "react-bootstrap";
import React, { Fragment, useEffect, useState, useMemo, useRef } from "react";
import BaseButton from "components/BaseComponents/BaseButton";
import { BaseSelect, MultiSelect } from "components/BaseComponents/BaseSelect";
import TableContainer from "components/BaseComponents/TableContainer";
import { useNavigate } from "react-router-dom";
import { Tooltip as ReactTooltip } from "react-tooltip";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "react-loading-skeleton/dist/skeleton.css";
import {
  // deleteApplicant,
  // listOfApplicants,
  listOfImportApplicants,
  updateStage,
  updateStatus,
  importApplicant,
  ExportApplicant,
  resumeUpload,
  deleteMultipleApplicant,
} from "api/applicantApi";

import ViewModal from "../ViewApplicant";
import BaseInput from "components/BaseComponents/BaseInput";
import DeleteModal from "components/BaseComponents/DeleteModal";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";

import {
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
import { XSquare } from "react-bootstrap-icons";
import saveAs from "file-saver";
import BasePopUpModal from "components/BaseComponents/BasePopUpModal";
import { ViewAppliedSkills } from "api/skillsApi";
import { FaExclamationTriangle } from "react-icons/fa";
import debounce from "lodash.debounce";
// import toast from "react-hot-toast";
const {
  projectTitle,
  Modules,
  // skillOptions,
  interviewStageOptions,
  cityOptions,
  statusOptions,
  gendersType,
  stateType,
  anyHandOnOffers,

  workPreferenceType,
  designationType,
} = appConstants;

type Anchor = "top" | "right" | "bottom";
function ImportApplicant() {
  document.title = Modules.Applicant + " | " + projectTitle;
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
  // const [recordIdToDelete, setRecordIdToDelete] = useState<string | undefined>(
  //   undefined
  // );
  const [experienceRange, setExperienceRange] = useState<number[]>([0, 25]);

  const [filterNoticePeriod, setFilterNoticePeriod] = useState<number[]>([
    0, 90,
  ]);
  const [searchAll, setSearchAll] = useState<string>("");
  // const [uploadedFile, setUploadedFile] = useState<FormData | null>(null);
  const [uploadedFile, setUploadedFile] = useState<FormData | null>(null);
  // const [uploadedFile, setUploadedFile] = useState<File | null>(null);
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
  const [appliedSkills, setAppliedSkills] = useState<SelectedOption[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalRecords, setTotalRecords] = useState(0);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [tableLoader, setTableLoader] = useState(false);
  const [selectedApplicants, setSelectedApplicants] = useState<string[]>([]);
  const [state, setState] = React.useState({
    right: false,
  });

  const [skillOptions, setSkillOptions] = useState<any[]>([]);
  // const [showDropdown, setShowDropdown] = useState(false);
  const [importLoader, setImportLoader] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [showPopupModal, setShowPopupModal] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

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
    setLoader(true);

    try {
      const params: {
        page: number;
        pageSize: number;
        limit: number;
        totalExperience?: string;
        currentCity?: string;
        appliedSkills?: string;
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
        searchS?: string;
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
        params.currentCity = filterCity.value;
      }
      if (filterState) {
        params.state = filterState.value;
      }
      if (appliedSkills.length > 0) {
        params.appliedSkills = appliedSkills
          .map((skill) => skill.label)
          .join(",");
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
      const searchValue = searchAll?.trim();
      if (searchValue) {
        params.searchS = searchValue;
        params.appliedSkills = searchValue;
      }

      const res = await listOfImportApplicants(params);
      setApplicant(res?.data?.item || []);
      setTotalRecords(res?.data?.totalRecords || 0);
    } catch (error) {
      errorHandle(error);
    } finally {
      setTableLoader(false);
      setLoader(false);
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
  ]);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setLoading(true);
        //  const allSkills: any[] = [];
        const page = 1;
        const pageSize = 50;
        const limit = 200;
        const response = await ViewAppliedSkills({
          page,
          pageSize,
          limit,
        });

        const skillData = response?.data?.data || [];

        setSkillOptions(
          skillData.map((item: any) => ({
            label: item.skills,
            value: item._id,
          }))
        );
      } catch (error) {
        console.error("Error fetching skills", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
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

  //   const handleSearchFilterChange = (e: React.ChangeEvent<any>) =>{
  //   setSearchFilter(e.target.value as string[]);
  // }

  // const handleAppliedSkillsChange = (selectedOptions: SelectedOption[]) => {
  //   setAppliedSkills(selectedOptions);
  // };
  const handleAppliedSkillsChange = (selectedOptions: SelectedOption1[]) => {
    setAppliedSkills(selectedOptions);
  };

  const handleCityChange = (selectedOption: SelectedOption) => {
    setFilterCity(selectedOption);
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
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchAll(event.target.value);
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

  const resetFilters = () => {
    setAppliedSkills([]);
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

    fetchApplicants();
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
  setMultipleApplicantsDelete([applicantId]); // Set the array with the single applicant ID
  setShowDeleteModal(true); // Show the modal for confirmation
};


  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };

 
  const handleDeleteAll = () => {
    if (selectedApplicants.length > 0) {
      setMultipleApplicantsDelete(selectedApplicants);
      setShowDeleteModal(true);
    }
  };



  // const handleDelete = (recordIdToDelete: any) => {
  //   if (recordIdToDelete) {
  //     deleteApplicantDetails(recordIdToDelete);
  //   } else if (selectedApplicants.length > 0) {
  //     deleteMultipleApplicantDetails(selectedApplicants);
  //   }
  // };

 const deleteMultipleApplicantDetails = (
   multipleApplicantDelete: string[] | undefined | null
 ) => {
   setLoader(true);
   deleteMultipleApplicant(multipleApplicantDelete)
     .then(() => {
       fetchApplicants(); // Refetch applicants after deletion
       setSelectedApplicants([]); // Clear the selected applicants
     })
     .catch((error: any) => {
       errorHandle(error); // Handle any errors
     })
     .finally(() => {
       setLoader(false); // Hide loader
       setShowDeleteModal(false); // Close the delete modal
     });
  };
  
  // const deleteApplicantDetails = (_id: string | undefined | null) => {
  //   setLoader(true);
  //   deleteApplicant(_id)
  //     .then(() => {
  //       fetchApplicants();
  //     })
  //     .catch((error: any) => {
  //       errorHandle(error);
  //     })
  //     .finally(() => {
  //       setLoader(false);
  //       setShowDeleteModal(false);
  //     });
  // };

  const handleView = (id: string) => {
    setSelectedApplicantId(id);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
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
        state: { email_to: selectedApplicant.email },
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
      },
    });
  };

  // const handleSendWhatsApp = () => {
  //   const message = applicant
  //     .filter((app) => selectedApplicants.includes(app._id))
  //     .map((app) => `Name: ${app.name}, Email: ${app.email}`)
  //     .join("\n");

  //   // Send WhatsApp message (example: using a WhatsApp API)
  //   window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  // };
  // const handleFileChange = (e) => {
  //   const file = e.target.files[0];
  //   const fileExtension = file.name.split(".").pop()?.toLowerCase();
  //   if (["csv", "xlsx", "xls"].includes(fileExtension)) {
  //     handleFileImport(e);
  //   } else if (["doc", "pdf"].includes(fileExtension)) {
  //     // handleResumeUpload(file);

  //   }
  // };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //  const file = e.target.files[0];
    const file = e.target.files && e.target.files[0];
    //  const fileExtension = file.name.split(".").pop()?.toLowerCase();
    //  const fileExtension = file && file.name.split(".").pop()?.toLowerCase();
    const fileExtension = file?.name?.split(".").pop()?.toLowerCase() ?? "";
    if (["csv", "xlsx", "xls"].includes(fileExtension ?? "")) {
      console.log("my functin csv called");
      handleFileImport(e);
    } else if (["doc", "pdf","docx"].includes(fileExtension ?? "")) {
      const newEvent = {
        target: {
          files: [file],
        },
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleResumeUpload(newEvent as React.ChangeEvent<HTMLInputElement>);
    }
  };

  const handleResumeUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    if (!["doc", "pdf","docx"].includes(fileExtension || "")) {
      toast.error("Please upload a valid Pdf or doc file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB
      toast(
        "Large file detected. Import may take a few minutes."
        // , {
        // icon: "⚠️",
        // duration: 4000,
        // }
      );
    }

    setImportLoader(true);
    setIsImporting(true);
    setImportProgress(0);

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const response = await resumeUpload(formData, {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 100)
          );
          setImportProgress(progress);
        },
      });
      // console.log(response);
      if (response?.success) {
        toast.success(response?.message || "File imported successfully!");
        await fetchApplicants();
      } else {
        throw new Error(response?.message || "Import failed");
      }
    } catch (error: any) {
      console.error("Import error:", error);
      errorHandle(error);

      if (error.response?.data) {
        // Handle structured API errors
        const errorMessage =
          error.response.data.message || error.response.data.error;
        toast.error(errorMessage || "Failed to import file");
      } else if (error.message) {
        // Handle other errors with messages
        toast.error(error.message);
      } else {
        // Generic error
        toast.error("An unexpected error occurred during import");
      }
    } finally {
      // Reset states
      setImportLoader(false);
      setIsImporting(false);
      setImportProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };
  const filteredApplicant = applicant.filter((applicants) => {
    const searchTerm = searchAll.toLowerCase();
    // Construct full name
    // const nameObj = applicants.name || {};
    // const firstName = nameObj.firstName || "";
    // const middleName = nameObj.middleName || "";
    // const lastName = nameObj.lastName || "";
    // const fullName = `${firstName} ${middleName} ${lastName}`
    // .trim()
    // .toLowerCase();
    return (
      // fullName.includes(searchTerm) || // ✅ Search by full name
      applicants?.name?.firstName?.toLowerCase().includes(searchTerm) ||
      applicants?.name?.middleName?.toLowerCase().includes(searchTerm) ||
      applicants?.name?.lastName?.toLowerCase().includes(searchTerm) ||
      applicants.subject?.toLowerCase().includes(searchTerm) ||
      applicants.interviewStage?.toLowerCase().includes(searchTerm) ||
      applicants.status?.toLowerCase().includes(searchTerm) ||
      applicants.totalExperience?.toString().includes(searchTerm) ||
      applicants.totalExperience?.toString().includes(searchTerm) ||
      (Array.isArray(applicants.appliedSkills) &&
        applicants.appliedSkills.some((skill: string) =>
          skill.toLowerCase().includes(searchTerm)
        ))
    );
  });

  const handleFileImport = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    if (!["csv", "xlsx", "xls"].includes(fileExtension || "")) {
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
      // console.log("Uploaded file:", formData.get("csvFile"));

      const response = await importApplicant(formData, {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 100)
          );
          setImportProgress(progress);
        },
      });

      console.log("API Response:", response);

      if (response?.success) {
        toast.success(response?.message || "File imported successfully!");
      } else if (!response?.success && response.statusCode === 409) {
        setShowPopupModal(true);

        toast.error(response.message || "Import failed");
      } else {
        toast.error("Unknown error occurred during import");
      }
    } catch (error: any) {
      // console.error("Import error:", error);

      toast.error(error?.message || "Failed to import file");
    } finally {
      fetchApplicants();
      setImportLoader(false);
      setIsImporting(false);
      setImportProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleModalConfirm = async () => {
    console.log("calling confim modal");

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
        toast.success("Existing applicants updated successfully!");
        setShowPopupModal(false);
        await fetchApplicants();
      } else {
        throw new Error(response?.message || "Update failed");
      }
    } catch (error: any) {
      console.error("Update error:", error);
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

  const handleExportExcel = async () => {
    try {
      toast.info("Preparing file for download...");

      const response = await ExportApplicant();

      if (!response) {
        toast.error("Failed to download file");
        return;
      }

      const blob = new Blob([response], { type: "text/csv" });

      saveAs(blob, "applicants.csv");

      toast.success("File downloaded successfully!");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export file");
    }
  };

  const drawerList = (anchor: Anchor) => (
    <Box
      sx={{
        width: anchor === "top" || anchor === "bottom" ? "auto" : 400,
        padding: "16px",
        marginTop: anchor === "top" ? "64px" : 0,
      }}
      role="presentation"
    >
      <button type="button" onClick={toggleDrawer("right", false)}>
        <XSquare size={25} />
      </button>
      <List>
        <Row className="flex justify-between items-center mb-4">
          <Col>
            <h3>Apply Filters</h3>
          </Col>
          <Col className="text-end">
            <BaseButton
              color="primary"
              onClick={resetFilters}
              variant="outlined"
              sx={{ width: "auto" }}
            >
              Reset Filters
            </BaseButton>
          </Col>
        </Row>

        <MultiSelect
          label="Applied Skills"
          name="appliedSkills"
          className="select-border mb-1"
          placeholder="Applied Skills"
          value={appliedSkills}
          isMulti={true}
          onChange={handleAppliedSkillsChange}
          options={skillOptions}
        />
        {loading && (
          <div style={{ marginTop: "10px" }}>
            <Spinner animation="border" size="sm" />
            <span style={{ marginLeft: "5px" }}>Loading skills...</span>
          </div>
        )}
        <BaseSlider
          label="Experience (in years)"
          name="experience"
          className="select-border mx-5 mb-1 "
          value={experienceRange}
          // onChange={handleExperienceChange}
          handleChange={handleExperienceChange}
          min={0}
          max={25}
          step={1}
          valueLabelDisplay="auto"
          disabled={false}
        />

        <BaseSelect
          label="City"
          name="city"
          className="select-border mb-1 "
          options={cityOptions}
          placeholder="City"
          handleChange={handleCityChange}
          value={filterCity}
        />
        <BaseSelect
          label="State"
          name="state"
          className="select-border mb-1 "
          options={stateType}
          placeholder="State"
          handleChange={handleStateChange}
          value={filterState}
        />
        <BaseSelect
          label="Interview Stage"
          name="interviewStage"
          className="select-border mb-1"
          options={interviewStageOptions}
          placeholder="Interview Stage"
          handleChange={handleInterviewStageChange}
          value={filterInterviewStage}
        />
        <BaseSelect
          label="Status"
          name="status"
          className="select-border mb-1"
          options={statusOptions}
          placeholder="Status"
          handleChange={handleStatusChange}
          value={filterStatus}
        />

        <BaseSelect
          label="Gender"
          name="gender"
          className="select-border mb-1"
          options={gendersType}
          placeholder="Gender"
          handleChange={handleGenderChange}
          value={filterGender}
        />

        <BaseSlider
          label="Expected Pkg(LPA)"
          name="expectedPkg"
          className="select-border mx-5 mb-1  "
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
          className="select-border mx-5 mb-1  "
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
          className="select-border mb-1"
          options={designationType}
          placeholder="Designation"
          handleChange={handleDesignationChange}
          value={filterDesignation}
        />

        <BaseSlider
          label="Notice Period (in Days)"
          name="noticePeriod"
          className="select-border mx-5 mb-1  "
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
          className="select-border mb-1"
          options={workPreferenceType}
          placeholder="Work Preference"
          handleChange={handleWorkPreferenceChange}
          value={filterWorkPreference}
        />

        <BaseSlider
          label="JavaScript Rating"
          name="rating"
          value={filterRating}
          className="select-border mx-5 mb-1  "
          handleChange={handleRatingChange}
          min={0}
          max={10}
          step={1}
          valueLabelDisplay="auto"
        />

        <BaseSlider
          label="Eng.Communication Rating"
          name="communication"
          className="select-border mx-5 mb-1  "
          value={filterEngRating}
          handleChange={handleEngRatingChange}
          min={0}
          max={10}
          step={1}
          valueLabelDisplay="auto"
        />
        <BaseSelect
          label="Any Hand On Offers"
          name="anyHandOnOffers"
          className="select-border mb-1"
          options={anyHandOnOffers}
          placeholder="Any Hand On Offers"
          handleChange={handleAnyHandOnOffersChange}
          value={filterAnyHandOnOffers}
        />

        <BaseInput
          label="Start Date"
          name="startDate"
          className="select-border mb-1"
          type="date"
          placeholder={InputPlaceHolder("Start Date")}
          handleChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleDateChange(e, true)
          }
          value={startDate || ""}
        />
        <BaseInput
          label="End Date"
          name="endDate"
          type="date"
          placeholder={InputPlaceHolder("End Date")}
          handleChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleDateChange(e, false)
          }
          value={endDate || ""}
        />
      </List>

      <Divider />
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
        header: "appliedSkills",
        accessorKey: "appliedSkills",
        cell: (cell: any) => (
          <div
            className="truncated-text"
            style={truncateText}
            title={cell.row.original.appliedSkills}
          >
            {cell.row.original.appliedSkills}
          </div>
        ),
        enableColumnFilter: false,
      },
      {
        header: "Experience",
        accessorKey: "totalExperience",
        enableColumnFilter: false,
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
          />
        ),
        enableColumnFilter: false,
      },

      {
        header: "Action",
        cell: (cell: any) => (
          <div className="hstack gap-2">
            <BaseButton
              id={`usage-${cell?.row?.original?.id}`}
              color="primary"
              className="btn btn-sm btn-soft-success usage-list"
              onClick={() => handleView(cell.row.original._id)}
            >
              <i className="ri-eye-fill align-bottom" />
              <ReactTooltip
                place="bottom"
                variant="success"
                content="View"
                anchorId={`usage-${cell?.row?.original?.id}`}
              />
            </BaseButton>

            <BaseButton
              id={`editMode-${cell?.row?.original?.id}`}
              className="btn btn-sm btn-soft-secondary edit-list"
              onClick={() => handleEdit(cell?.row?.original._id)}
            >
              <i className="ri-pencil-fill align-bottom" />
              <ReactTooltip
                place="bottom"
                variant="info"
                content="Edit"
                anchorId={`editMode-${cell?.row?.original?.id}`}
              />
            </BaseButton>

            <BaseButton
              id={`delete-${cell?.row?.original?.id}`}
              className="btn btn-sm btn-soft-danger remove-list"
              color="danger"
              onClick={() => handleDeleteSingle(cell.row.original._id)} // Call the single delete function
            >
              <i className="ri-delete-bin-5-fill align-bottom" />
              <ReactTooltip
                place="bottom"
                variant="error"
                content="Delete"
                anchorId={`delete-${cell?.row?.original?._id}`}
              />
            </BaseButton>

            <BaseButton
              id={`email-${cell?.row?.original?.id}`}
              className="btn btn-sm btn-soft-secondary edit-list"
              // onClick={() => handleEmail(cell?.row?.original._id)}
              onClick={() => handleEmail(cell?.row?.original._id)}
            >
              <i className="ri-mail-close-line align-bottom" />
              <ReactTooltip
                place="bottom"
                variant="info"
                content="Email"
                anchorId={`email-${cell?.row?.original?.id}`}
              />
            </BaseButton>
          </div>
        ),
      },
    ],
    [applicant, selectedApplicants]
  );

  // const handleNavigate = () => {
  //   navigate("/applicants/add-applicant");
  // };

  return (
    <Fragment>
      <BasePopUpModal
        isOpen={showPopupModal}
        onRequestClose={() => setShowPopupModal(false)} // Close the modal
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
            <Card className="mb-3 my-3">
              <CardBody>
                <div className="container">
                  <div className="row justify-content-between align-items-center">
                    <div className="col-auto d-flex justify-content-start mx-0">
                      <button
                        onClick={toggleDrawer("right", true)}
                        // color="primary"
                        className="btn btn-primary"
                      >
                        <i className="fa fa-filter mx-1 "></i> Filters
                      </button>
                      <Drawer
                        className="!mt-16 "
                        anchor="right"
                        open={state["right"]}
                        onClose={toggleDrawer("right", false)}
                      >
                        {drawerList("right")}
                      </Drawer>
                    </div>
                    <div className="col-auto d-flex justify-content-end flex-wrap mr-2">
                      <div>
                        <input
                          id="search-bar-0"
                          className="form-control search h-10"
                          placeholder="Search..."
                          onChange={handleSearchChange}
                          value={searchAll}
                        />
                      </div>

                      <div className="col-auto d-flex justify-content-end mx-0 flex-wrap">
                        {selectedApplicants.length > 0 && (
                          <>
                            {/* <BaseButton
                             className="btn btn-lg btn-soft-secondary bg-green-900 edit-list mx-1 px-3"
                             onClick={handleSendWhatsApp}
                           >
                             <i className="ri-whatsapp-line align-bottom" />
                             <ReactTooltip
                               place="bottom"
                               variant="info"
                               content="WhatsApp"
                             />
                           </BaseButton> */}

                            <BaseButton
                              className="btn text-lg bg-danger edit-list ml-2 w-fit border-0"
                              onClick={handleDeleteAll}
                            >
                              <i className="ri-delete-bin-fill align-bottom" />
                              <ReactTooltip
                                place="bottom"
                                variant="error"
                                content="Delete"
                                anchorId={`Delete ${selectedApplicants.length} Emails`}
                              />
                            </BaseButton>

                            <BaseButton
                              className="btn text-lg btn-soft-secondary bg-primary edit-list mx-1 "
                              onClick={handleSendEmail}
                            >
                              <i className="ri-mail-close-line align-bottom" />
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
                          accept=".csv,.xlsx,.xls,.xls,.doc,.pdf,.docx"
                          style={{ display: "none" }}
                          onChange={handleFileChange}
                          disabled={isImporting}
                        />
                        <BaseButton
                          color="primary"
                          className="mx-2 position-relative"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={importLoader}
                        >
                          {importLoader ? (
                            <>
                              <i className="ri-loader-4-line animate-spin align-bottom me-1" />
                              {isImporting
                                ? `Importing... ${importProgress}%`
                                : "Processing..."}
                            </>
                          ) : (
                            <>
                              <i className="ri-download-2-line align-bottom me-1" />
                              Import
                            </>
                          )}
                          {isImporting && (
                            <div
                              className="progress position-absolute bottom-0 start-0"
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
                        <BaseButton
                          color="primary"
                          className="btn btn-soft-secondary bg-green-900 edit-list "
                          onClick={handleExportExcel}
                          // disabled={exportLoader}
                        >
                          <i className="ri-upload-2-line align-bottom me-1" />
                          Export
                        </BaseButton>

                        {/* <BaseButton color="success" onClick={handleNavigate}>
                        <i className="ri-add-line align-bottom me-1" />
                        Add
                      </BaseButton> */}
                      </div>
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
              <div className="card-body pt-0">
                {tableLoader ? (
                  <div className="text-center py-4">
                    <Skeleton count={5} />
                  </div>
                ) : (
                  <div className="card-body pt-4">
                    {applicant.length > 0 ? (
                      // />
                      <TableContainer
                        isHeaderTitle="Import Applicants"
                        columns={columns}
                        data={filteredApplicant}
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
                      // <<div className="py-4 text-center">
                      //   <i className="ri-search-line d-block fs-1 text-success"></i>
                      //   No applicants found.
                      // </div>>
                      <></>
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
    color: "#007bff",
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
