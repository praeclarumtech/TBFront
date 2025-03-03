/* eslint-disable @typescript-eslint/no-explicit-any */
import { Row, Col, Card, Container, CardBody } from "react-bootstrap";
import { Fragment, useEffect, useState, useMemo, SetStateAction } from "react";
import { dynamicFind, errorHandle } from "components/helpers/service";
import BaseButton from "components/BaseComponents/BaseButton";
import { BaseSelect, MultiSelect } from "components/BaseComponents/BaseSelect";
import TableContainer from "components/BaseComponents/TableContainer";
import { Link, useNavigate } from "react-router-dom";
import { Tooltip as ReactTooltip } from "react-tooltip";
import {
  deleteApplicant,
  listOfApplicants,
  updateStage,
  updateStatus,
} from "api/applicantApi";
import { FaWhatsapp, FaEnvelope, FaCommentDots } from "react-icons/fa";
import ViewModal from "./ViewApplicant";
import BaseInput from "components/BaseComponents/BaseInput";
import Loader from "components/BaseComponents/Loader";
import DeleteModal from "components/BaseComponents/DeleteModal";
import axios from "axios";
import { InputPlaceHolder } from "components/constants/common";
// import { FILTER_APPLICANT } from "api/apiRoutes";

type SelectedOption = { label: string; value: string };

const Applicant = () => {
  document.title = "Applicant | Project Title";
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [applicant, setApplicant] = useState<any[]>([]);
  const [selectedApplicantId, setSelectedApplicantId] = useState<string | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [recordIdToDelete, setRecordIdToDelete] = useState<string | null>(null);
  const [filterExperience, setFilterExperience] =
    useState<SelectedOption | null>(null);
  const [filterCity, setFilterCity] = useState<SelectedOption | null>(null);
  const [appliedSkills, setAppliedSkills] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");

  const statusOptions = [
    { label: "Hold", value: "Hold" },
    { label: "Processing", value: "Processing" },
    { label: "Selected", value: "Selected" },
    { label: "Rejected", value: "Rejected" },
    { label: "Pending", value: "Pending" },
  ];

  const interviewStageOptions = [
    { label: "1st Interview", value: "1st Interview" },
    { label: "2nd Interview", value: "2nd Interview" },
    { label: "HR", value: "HR" },
    { label: "Technical", value: "Technical" },
    { label: "Final", value: "Final" },
  ];

  const experienceOptions = [
    { value: 0, label: "0 Years" },
    { value: 1, label: "1 Year" },
    { value: 2, label: "2 Years" },
    { value: 3, label: "3 Years" },
    { value: 4, label: "4 Years" },
    { value: 5, label: "5 Years" },
    { value: 6, label: "6 Years" },
    { value: 7, label: "7 Years" },
  ];

  const cityOptions = [
    { value: "Ahmedabad", label: "Ahemdabad" },
    { value: "Delhi", label: "Delhi" },
    { value: "Gandhi Nagar", label: "Gandhi Nagar" },
    { value: "Banglore", label: "Banglore" },
  ];

  const skillOptions = [
    { value: "JavaScript", label: "JavaScript" },
    { value: "Node.js", label: "Node.js" },
    { value: "Python", label: "Python" },
    { value: "MongoDB", label: "MongoDB" },
    { value: "Java", label: "Java" },
  ];

  const listOfApplicant = () => {
    setLoader(true);
    listOfApplicants()
      .then((res) => {
        setApplicant(res?.data?.item || []);
      })
      .catch((error) => errorHandle(error))
      .finally(() => {
        setLoader(false);
      });
  };

  useEffect(() => {
    listOfApplicant();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoader(true);
      setError("");
      try {
        let url =
          "https://tbapi-jtu7.onrender.com/api/applicants/viewAllApplicant/?";

        if (filterExperience) {
          url += `totalExperience=${filterExperience.value}&`;
        }
        if (filterCity) {
          url += `city=${filterCity.value}&`;
        }
        if (appliedSkills.length > 0) {
          url += `appliedSkills=${appliedSkills
            .map((skill:any) => skill?.value)
            .join(",")}&`;
        }

        if (startDate) {
          url += `createdAt=${startDate}&`;
        }

        if (endDate) {
          url += `createdAt=${endDate}&`;
        }

        url = url.endsWith("&") ? url.slice(0, -1) : url;

        const response = await axios.get(url);
        setApplicant(response.data.data.item || []);
      } catch (error) {
        setError("Error fetching data.");
      } finally {
        setLoader(false);
      }
    };

    if (
      !filterExperience &&
      appliedSkills.length === 0 &&
      !startDate &&
      !endDate &&
      !filterCity
    ) {
      listOfApplicant();
    } else {
      fetchData();
    }
  }, [filterExperience, appliedSkills, startDate, endDate, filterCity]);

  const handleExperienceChange = (selectedOption: SelectedOption) => {
    setFilterExperience(selectedOption);
  };
  const handleCityChange = (selectedOption: SelectedOption) => {
    setFilterCity(selectedOption);
  };

  const resetFilters = () => {
    setFilterExperience(null);
    setAppliedSkills([]);
    setStartDate("");
    setEndDate("");
    setFilterCity(null);
    listOfApplicant();
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
        listOfApplicant();
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

  const columns = useMemo(
    () => [
      {
        header: "Applicant Name",
        accessorKey: "name.firstName",
        enableColumnFilter: false,
      },
      {
        header: "Technology",
        accessorKey: "appliedSkills",
        enableColumnFilter: false,
      },
      {
        header: "Interview Stage",
        accessorKey: "interviewStage",
        cell: (cell: any) => (
          <BaseSelect
            name="interviewStage"
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
        header: "Status",
        accessorKey: "status",
        cell: (cell: any) => (
          <BaseSelect
            name="status"
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
        header: "Comments",
        cell: () => (
          <div className="d-flex align-items-center hstack gap-2">
            <Link to="" className="btn btn-sm btn-soft-primary">
              <FaCommentDots />
            </Link>
            <Link to="">
              <FaWhatsapp />
            </Link>
            <Link to="" className="btn btn-sm btn-soft-info">
              <FaEnvelope />
            </Link>
          </div>
        ),
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
                anchorId={`editMode-${cell.row.original._id}`}
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
                anchorId={`delete-${cell?.row?.original?.id}`}
              />
            </BaseButton>
          </div>
        ),
      },
    ],
    [applicant]
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
                  <div className="row">
                    <div className="col-auto !d-flex !justify-content-start !mx-0 ">
                      <BaseButton
                        onClick={() => setFiltersVisible(!filtersVisible)}
                        color="primary"
                      >
                        {filtersVisible ? "Hide Filters" : "Show Filters"}
                      </BaseButton>
                    </div>

                    <div className="col-auto !d-flex !justify-content-end mx-0 ">
                      <BaseButton
                        color="success"
                        disabled={loader}
                        onClick={handleNavigate}
                        loader={loader}
                      >
                        Add New Applicant
                      </BaseButton>
                    </div>
                  </div>
                </div>

                {filtersVisible && (
                  <Row className="flex mt-3">
                    <Col xl={2} sm={6} md={4} lg={2}>
                      <MultiSelect
                        label="Applied Skills"
                        name="appliedSkills"
                        className="select-border"
                        value={appliedSkills || null}
                        isMulti={true}
                        onChange={setAppliedSkills}
                        options={skillOptions}
                      />
                    </Col>
                    <Col xl={2} sm={6} md={4} lg={2}>
                      <BaseSelect
                        label="Experience"
                        name="Experience"
                        className="select-border"
                        options={experienceOptions}
                        placeholder="Experience"
                        handleChange={handleExperienceChange}
                        value={filterExperience}
                      />
                    </Col>
                    <Col xl={2} sm={6} md={4} lg={2}>
                      <BaseSelect
                        label="City"
                        name="city"
                        className="select-border"
                        options={cityOptions}
                        placeholder="City"
                        handleChange={handleCityChange}
                        value={filterCity}
                      />
                    </Col>
                    <Col xl={2} sm={6} md={4} lg={2}>
                      <BaseInput
                        label="Start Date"
                        name="startDate"
                        type="date"
                        placeholder={InputPlaceHolder("Start Date")}
                        handleChange={(e: { target: { value: SetStateAction<string>; }; }) => setStartDate(e.target.value)}
                        value={startDate || ""}
                      />
                    </Col>

                    <Col xl={2} sm={6} md={4} lg={2}>
                      <BaseInput
                        label="End Date"
                        name="endDate"
                        type="date"
                        placeholder={InputPlaceHolder("End Date")}
                        handleChange={(e: { target: { value: SetStateAction<string>; }; }) => setEndDate(e.target.value)}
                        value={endDate || ""}
                      />
                    </Col>
                    <Col xl={2} sm={6} md={4} lg={2}>
                      <BaseButton
                        color="primary"
                        onClick={resetFilters}
                        disabled={loader}
                      >
                        Reset Filters
                      </BaseButton>
                    </Col>
                  </Row>
                )}
              </CardBody>
            </Card>
          </div>
        </Row>

        <Row>
          <Col lg={12}>
            <Card>
              {loader ? (
                <Loader />
              ) : (
                <div className="card-body pt-0">
                  {applicant.length > 0 ? (
                    <TableContainer
                      isHeaderTitle="Applicants"
                      columns={columns}
                      data={applicant}
                      isGlobalFilter
                      customPageSize={5}
                      theadClass="table-light text-muted"
                      SearchPlaceholder="Search..."
                      tableClass="!text-nowrap !mb-0 !responsive !table-responsive-sm !table-hover !table-outline-none !mb-0"
                    />
                  ) : (
                    <div className="py-4 text-center">
                      <i className="ri-search-line d-block fs-1 text-success"></i>
                      No applicants found.
                    </div>
                  )}
                </div>
              )}
            </Card>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};

export default Applicant;
