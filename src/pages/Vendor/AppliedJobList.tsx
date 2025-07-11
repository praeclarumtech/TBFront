/* eslint-disable @typescript-eslint/no-explicit-any */
import { Row, Col, Card, Container, CardBody } from "react-bootstrap";
import { Fragment, useMemo, useState, useEffect } from "react";
import { toast } from "react-toastify";
// import BaseButton from "components/BaseComponents/BaseButton";
import TableContainer from "components/BaseComponents/TableContainer";
// import { Tooltip as ReactTooltip } from "react-tooltip";

import DeleteModal from "components/BaseComponents/DeleteModal";
import appConstants from "constants/constant";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { deleteJob } from "api/apiJob";
// import ViewJob from "pages/master/ViewJob";

import { viewAppliedJob } from "api/apiVendor";
import { useNavigate } from "react-router";
import { ArrowLeftOutlined } from "@ant-design/icons";

const { projectTitle, Modules, handleResponse } = appConstants;

const AppliedJobList = () => {
  document.title = Modules.Jobs + " | " + projectTitle;
  const [job, setJob] = useState<any[]>([]);
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<any>([]);

  const [totalRecords, setTotalRecords] = useState(0);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 50,
    limit: 50,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedJob, setSelectedJob] = useState<string[]>([]);

  // const [showViewModal, setShowViewModal] = useState<boolean>(false);
  const fetchJob = async () => {
    setIsLoading(true);
    try {
      const res = await viewAppliedJob();

      if (res?.success) {
        // const allApplications = res?.data?.applications;
        // console.log("array:", allApplications);
        const allApplications =
          res.data?.flatMap((applicant: any) => applicant.applications) || [];
        setJob(allApplications);
        setTotalRecords(allApplications.length);
      } else {
        toast.error(res?.message || "Failed to fetch Jobs");
      }
    } catch (error) {
      toast.error("Something went wrong! ");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJob();
  }, [pagination.pageIndex, pagination.pageSize]);

  const confirmDelete = async () => {
    if (!jobToDelete || jobToDelete.length === 0) {
      toast.error("No job selected for deletion.");
      return;
    }

    setLoader(true);

    try {
      if (jobToDelete.length >= 1) {
        const res = await deleteJob(jobToDelete);
        if (res?.success) {
          toast.success(res?.message);
        } else {
          toast.error(res?.message);
        }
      }
      // If deleting a single
      else if (jobToDelete._id) {
        const res = await deleteJob([jobToDelete._id]);
        if (res?.success) {
          toast.success(res?.message);
        } else {
          toast.error(res?.message);
        }
      }
      fetchJob();
    } catch (error) {
      toast.error("Something went wrong!");
      console.error(error);
    } finally {
      setLoader(false);
      setShowDeleteModal(false);
      setJobToDelete([]);
      setSelectedJob([]);
    }
  };

  const columns = useMemo(
    () => [
      {
        header: "Job Title",
        accessorKey: "job_subject",
        enableColumnFilter: false,
        cell: (cell: any) => {
          // You can’t use hooks inside config, so handle it outside
          const name = cell.row.original.job_subject;
          return (
            <span
              style={{
                color: "blue",
                cursor: "pointer",
                textDecoration: "underline",
              }}
              onClick={() => handleView(cell.row.original._id)}
            >
              {name}
            </span>
          );
        },
      },

      {
        header: "Job Score",
        accessorKey: "score",
        cell: ({ getValue }: any) => `${getValue()}%`,
        enableColumnFilter: false,
      },
      {
        header: "Application Status",
        accessorKey: "status",
        cell: ({ getValue }: any) => {
          const status = getValue();
          return status === "Submitted"
            ? "Stage 1 - Submitted"
            : "Stage 2 - interview";
        },
        enableColumnFilter: false,
      },
    ],
    [selectedJob, job]
  );

  const [loader, setLoader] = useState(false);

  // const handleCloseModal = () => {
  //   setShowViewModal(false);
  // };

  const formTitle =
    //  editingState ? "Update Jobs" :
    "Your Submitted Applications";

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedJob([]);
  };

  const handleView = (id: string) => {
    navigate(`/Vendor/detailed-job/${id}`);
  };
  return (
    <Fragment>
      <DeleteModal
        show={showDeleteModal}
        onCloseClick={closeDeleteModal}
        onDeleteClick={confirmDelete}
        loader={loader}
      />
      <div className="pt-1 page-content"></div>
      <Container fluid>
        <Row>
          <div>
            <Card className="my-3 mb-3">
              <CardBody>
                <Row className="flex h-full">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="text-start text-sm font-medium text-blue-600 underline"
                  >
                    <ArrowLeftOutlined /> Back
                  </button>
                  <Row className="mt-1 fw-bold text-dark d-flex align-items-center">
                    <Col
                      sm={12}
                      lg={12}
                      className="flex-wrap mb-2 ml-2 d-flex justify-content-center align-items-center"
                    >
                      <div className="flex justify-content-center h1 text-primary fw-bold">
                        {formTitle}
                      </div>
                    </Col>
                  </Row>

                  <Row>
                    <Col lg={12}>
                      {isLoading ? (
                        <div className="py-4 text-center">
                          <Skeleton count={1} className="mb-5 min-h-10" />
                          <Skeleton count={5} />
                        </div>
                      ) : (
                        <>
                          {job?.length > 0 ? (
                            <TableContainer
                              columns={columns}
                              data={job}
                              customPageSize={50}
                              theadClass="table-light text-muted"
                              totalRecords={totalRecords}
                              pagination={pagination}
                              setPagination={setPagination}
                              loader={loader}
                              customPadding="0.3rem 1.5rem"
                              rowHeight="10px !important"
                            />
                          ) : (
                            <div className="py-4 text-center">
                              <i className="ri-search-line d-block fs-1 text-success"></i>
                              {handleResponse?.dataNotFound}
                            </div>
                          )}
                        </>
                      )}
                    </Col>
                  </Row>
                </Row>
              </CardBody>
            </Card>
          </div>
        </Row>
      </Container>
    </Fragment>
  );
};

export default AppliedJobList;
