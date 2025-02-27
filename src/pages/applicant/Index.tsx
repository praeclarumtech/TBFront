/* eslint-disable @typescript-eslint/no-explicit-any */
import { Row, Col, Card, Container, CardBody, Collapse } from "react-bootstrap";
import { Fragment, useEffect, useState, useMemo } from "react";
import { dynamicFind, errorHandle } from "components/helpers/service";
import BaseButton from "components/BaseComponents/BaseButton";
import { BaseSelect } from "components/BaseComponents/BaseSelect";
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
import { InputPlaceHolder } from "components/constants/common";
import Loader from "components/BaseComponents/Loader";

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

  const listOfApplicant = () => {
    setLoader(true);
    listOfApplicants()
      .then((res) => {
        setApplicant(res?.data?.item);
      })
      .catch((error) => errorHandle(error))
      .finally(() => {
        setLoader(false);
      });
  };

  useEffect(() => {
    listOfApplicant();
  }, []);

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
                  .then(() => {
                   
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
                  .then(() => {
                    
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
        header: "Comments",
        cell: () => (
          <div className="d-flex align-items-center hstack gap-2">
            <Link to="" className="btn btn-sm btn-soft-primary">
              <FaCommentDots />
            </Link>
            <Link
              to=""
              className=""
              // onClick={() =>
              //   window.open(
              //     `/applicant`
              //   )
              // }
              // aria-disabled
            >
              <FaWhatsapp />
            </Link>
            <Link
              to=""
              className="btn btn-sm btn-soft-info"
              // onClick={() =>
              //   window.open(
              //     `/applicant`
              //   )}
            >
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
              onClick={() => deleteApplicantDetails(cell.row.original._id)}
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
      <Container fluid>
        <Row>
          <div>
            <Card className="mb-3 my-3">
              <CardBody>
                <div className="container">
                  <div className="row justify-content-between">
                    <div className="col-auto d-flex justify-content-start">
                      <BaseButton
                        onClick={() => setFiltersVisible(!filtersVisible)}
                        color="primary"
                      >
                        {filtersVisible ? "Hide Filters" : "Show Filters"}
                      </BaseButton>
                    </div>

                    <div className="col-auto d-flex justify-content-end gap-2">
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
                <Collapse in={filtersVisible} className="mt-3">
                  <div>
                    <Row className="flex">
                      <Col xl={3} sm={6} md={4} lg={2}>
                        <BaseSelect
                          name="appliedSkills"
                          options={statusOptions}
                          placeholder="Technology"
                        />
                      </Col>
                      <Col xl={3} sm={6} md={4} lg={2}>
                        <BaseSelect
                          name="interviewStage"
                          options={interviewStageOptions}
                          placeholder="Experience"
                        />
                      </Col>
                      <Col xl={2} sm={6} md={4} lg={2}>
                        <BaseInput
                          name="startDate"
                          type="date"
                          placeholder={InputPlaceHolder("Start Date")}
                          // handleChange={validation.handleChange}
                          // handleBlur={validation.handleBlur}
                          // value={validation.values.dateOfBirth}
                          // touched={validation.touched.dateOfBirth}
                          // error={validation.errors.dateOfBirth}
                          passwordToggle={false}
                        />
                      </Col>
                      <Col xl={2} sm={6} md={4} lg={2}>
                        <BaseInput
                          name="endDate"
                          type="date"
                          placeholder={InputPlaceHolder("End Date")}
                          // handleChange={validation.handleChange}
                          // handleBlur={validation.handleBlur}
                          // value={validation.values.dateOfBirth}
                          // touched={validation.touched.dateOfBirth}
                          // error={validation.errors.dateOfBirth}
                          passwordToggle={false}
                        />
                      </Col>
                      <Col xl={2} sm={6} md={6} lg={2}>
                        <BaseButton
                          color="primary"
                          disabled={loader}
                          type="submit"
                          loader={loader}
                        >
                          Reset Filters
                        </BaseButton>
                      </Col>
                    </Row>
                  </div>
                </Collapse>
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
                  <div>
                    {applicant?.length > 0 ? (
                      <TableContainer
                        isHeaderTitle="Applicants"
                        columns={columns}
                        data={applicant || []}
                        isGlobalFilter
                        customPageSize={5}
                        theadClass="table-light text-muted"
                        SearchPlaceholder="Search..."
                      />
                    ) : (
                      <div className="py-4 text-center">
                        <i className="ri-search-line d-block fs-1 text-success"></i>
                        No applicants found.
                      </div>
                    )}
                  </div>
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
