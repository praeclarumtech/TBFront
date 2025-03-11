/* eslint-disable @typescript-eslint/no-explicit-any */
import { Row, Col, Card, Container, CardBody } from "react-bootstrap";
import React, { Fragment, useEffect, useState, useMemo } from "react";
import BaseButton from "components/BaseComponents/BaseButton";
import { BaseSelect, MultiSelect } from "components/BaseComponents/BaseSelect";
import TableContainer from "components/BaseComponents/TableContainer";
import { useNavigate } from "react-router-dom";
import { Tooltip as ReactTooltip } from "react-tooltip";

import {
  deleteApplicant,
  listOfApplicants,
  updateStage,
  updateStatus,
} from "api/applicantApi";

import ViewModal from "./ViewApplicant";
import BaseInput from "components/BaseComponents/BaseInput";
import DeleteModal from "components/BaseComponents/DeleteModal";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";

import { SelectedOption } from "interfaces/applicant.interface";
import {
  dynamicFind,
  errorHandle,
  InputPlaceHolder,
} from "utils/commonFunctions";
import appConstants from "constants/constant";
import BaseSlider from "components/BaseComponents/BaseSlider";

const {
  projectTitle,
  Modules,
  skillOptions,
  interviewStageOptions,
  cityOptions,
  statusOptions,
  gendersType,
  stateType,
  anyHandOnOffers,
  maritalStatusType,
  workPreferenceType,
  designationType,
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
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [recordIdToDelete, setRecordIdToDelete] = useState<string | undefined>(
    undefined
  );
  const [experienceRange, setExperienceRange] = useState<number[]>([0, 20]);
  const [filterNoticePeriod, setFilterNoticePeriod] = useState<number[]>([
    0, 50,
  ]);

  const [filterStatus, setFilterStatus] = useState<SelectedOption | null>(null);
  const [filterInterviewStage, setFilterInterviewStage] =
    useState<SelectedOption | null>(null);
  const [filterEngRating, setFilterEngRating] = useState<number[]>([0, 11]);

  const [filterAnyHandOnOffers, setFilterAnyHandOnOffers] =
    useState<SelectedOption | null>(null);
  const [filterGender, setFilterGender] = useState<SelectedOption | null>(null);
  const [filterRating, setFilterRating] = useState<number[]>([0,11]);
  const [filterWorkPreference, setFilterWorkPreference] =
    useState<SelectedOption | null>(null);
  const [filterExpectedPkg, setFilterExpectedPkg] = useState<number[]>([0, 100]);
  const [filterCurrentPkg, setFilterCurrentPkg] = useState<number[]>([0, 1000]);
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
  const [selectedApplicants, setSelectedApplicants] = useState<string[]>([]); // Array to store selected applicants
  const [state, setState] = React.useState({
    right: false,
  });

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
        currentPkg?:string;
      } = {
        page: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
      };

      if (filterRating) {
        params.rating = `${filterRating[0]}-${filterRating[1]}`;
      }
      if (filterEngRating) {
        params.communicationSkill = `${filterEngRating[0]}-${filterEngRating[1]}`;
      }
      if (experienceRange) {
        params.totalExperience = `${experienceRange[0]}-${experienceRange[1]}`;
      }

      if (filterNoticePeriod) {
        params.noticePeriod = `${filterNoticePeriod[0]}-${filterNoticePeriod[1]}`;
      }
      
      if (filterExpectedPkg) {
        params.expectedPkg = `${filterExpectedPkg[0]}-${filterExpectedPkg[1]}`;
      }
       if (filterCurrentPkg) {
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
          .map((skill: SelectedOption) => skill.value)
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

      const res = await listOfApplicants(params);
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
    fetchApplicants();
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
    filterNoticePeriod,
    filterExpectedPkg,
    filterCurrentPkg,
    filterDesignation,
    experienceRange,
    filterDesignation,
    filterAnyHandOnOffers,
    filterState,
    filterRating,
    filterEngRating,
    filterWorkPreference,
  ]);

  const handleAppliedSkillsChange = (selectedOptions: SelectedOption[]) => {
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
    setFilterNoticePeriod([]);
    setFilterExpectedPkg([]);
    setFilterCurrentPkg([]);
    SetFilterDesignation(null);
    setExperienceRange([]);
    setFilterAnyHandOnOffers(null);
  
    setFilterWorkPreference(null);
    setFilterRating([]);
    setFilterEngRating([]);
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

  const openDeleteModal = (id: string) => {
    setRecordIdToDelete(id);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const handleDelete = () => {
    if (recordIdToDelete) {
      deleteApplicantDetails(recordIdToDelete);
    }
  };

  const deleteApplicantDetails = (_id: string | undefined | null) => {
    setLoader(true);
    deleteApplicant(_id)
      .then(() => {
        fetchApplicants();
      })
      .catch((error: any) => {
        errorHandle(error);
      })
      .finally(() => {
        setLoader(false);
        setShowDeleteModal(false);
      });
  };

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

  const handleSendWhatsApp = () => {
    const message = applicant
      .filter((app) => selectedApplicants.includes(app._id))
      .map((app) => `Name: ${app.name}, Email: ${app.email}`)
      .join("\n");

    // Send WhatsApp message (example: using a WhatsApp API)
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
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
          className="select-border mb-1 "
          placeholder="Applied Skills"
          value={appliedSkills || null}
          isMulti={true}
          onChange={handleAppliedSkillsChange}
          options={skillOptions}
        />

        <BaseSlider
          label="Experience (in years)"
          name="experience"
          className="select-border mx-5 mb-1 "
          value={experienceRange}
          handleChange={(_event: any, newValue: number[]) => {
            setExperienceRange(newValue as number[]);
          }}
          min={0}
          max={50}
          step={1}
          valueLabelDisplay="auto"
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
          handleChange={(_event: any, newValue: number[]) => {
            setFilterExpectedPkg(newValue as number[]);
          }}
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
          handleChange={(_event: any, newValue: number[]) => {
            setFilterCurrentPkg(newValue as number[]);
          }}
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
          handleChange={(_event: any, newValue: number[]) => {
            setFilterNoticePeriod(newValue as number[]);
          }}
          min={0}
          max={90}
          step={1}
          valueLabelDisplay="auto"
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
          handleChange={(_event: any, newValue: number[]) => {
            setFilterRating(newValue as number[]);
          }}
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
          handleChange={(_event: any, newValue: number[]) => {
            setFilterEngRating(newValue as number[]);
          }}
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
                  .then(() => {})
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
                  .then(() => {})
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
                anchorId={`editMode-${cell?.row?.original?.id}`} // ensure unique ID
              />
            </BaseButton>

            <BaseButton
              id={`delete-${cell?.row?.original?.id}`}
              className="btn btn-sm btn-soft-danger remove-list"
              color="danger"
              onClick={() => openDeleteModal(cell.row.original._id)}
            >
              <i className="ri-delete-bin-5-fill align-bottom" />
              <ReactTooltip
                place="bottom"
                variant="error"
                content="Delete"
                anchorId={`delete-${cell?.row?.original?.id}`} // ensure unique ID
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

  const handleNavigate = () => {
    navigate("/applicants/add-applicant");
  };

  return (
    <Fragment>
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
        onDeleteClick={handleDelete}
        recordId={recordIdToDelete}
        loader={loader}
      />
      <Container fluid>
        <Row>
          <div>
            <Card className="mb-3 my-3">
              <CardBody>
                <div className="container">
                  <div className="row justify-content-between align-items-center">
                    {/* Left: Show Filters Button */}
                    <div className="col-auto d-flex justify-content-start mx-0">
                      <Button
                        onClick={toggleDrawer("right", true)}
                        // color="primary"
                        className="bg-primary text-white "
                        style={{ textTransform: "none" }}
                      >
                        <i className="fa fa-filter mx-1 "></i> Filters
                      </Button>
                      <Drawer
                        className="!mt-16 "
                        anchor="right"
                        open={state["right"]}
                        onClose={toggleDrawer("right", false)}
                      >
                        {drawerList("right")}
                      </Drawer>
                    </div>

                    {/* Right: WhatsApp, Email, and New Applicant Buttons */}
                    <div className="col-auto d-flex justify-content-end mx-0 flex-wrap">
                      {selectedApplicants.length > 0 && (
                        <>
                          <BaseButton
                            className="btn btn-lg btn-soft-secondary bg-green-900 edit-list mx-1 px-3"
                            onClick={handleSendWhatsApp}
                          >
                            <i className="ri-whatsapp-line align-bottom" />
                            <ReactTooltip
                              place="bottom"
                              variant="info"
                              content="WhatsApp"
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

                      <BaseButton
                        color="success"
                        // disabled={loader}
                        onClick={handleNavigate}
                        // loader={loader}
                      >
                        Add New Applicant
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
              <div className="card-body pt-0">
                {applicant.length > 0 ? (
                  <TableContainer
                    isHeaderTitle="Applicants"
                    columns={columns}
                    data={applicant}
                    isGlobalFilter
                    customPageSize={10}
                    theadClass="table-light text-muted"
                    SearchPlaceholder="Search..."
                    tableClass="!text-nowrap !mb-0 !responsive !table-responsive-sm !table-hover !table-outline-none !mb-0"
                    totalRecords={totalRecords}
                    pagination={pagination}
                    setPagination={setPagination}
                    loader={tableLoader}
                  />
                ) : (
                  <div className="py-4 text-center">
                    <i className="ri-search-line d-block fs-1 text-success"></i>
                    No applicants found.
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
};

const toolipComponents = {
  backgroundColor: "blue !important",
  color: "white !important",
  "border-radius": "5px !important",
  padding: "8px 12px !important",
  "font-size": "14px !important",
  border: "1px solid white !important",
};

export default Applicant;
