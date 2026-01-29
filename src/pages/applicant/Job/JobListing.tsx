/* eslint-disable @typescript-eslint/no-explicit-any */
import { Row, Col, Card, Container, CardBody } from "react-bootstrap";
import { Fragment, useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import BaseButton from "components/BaseComponents/BaseButton";
import TableContainer from "components/BaseComponents/TableContainer";
import EmptyState from "components/BaseComponents/EmptyState";
import { Tooltip as ReactTooltip } from "react-tooltip";

import DeleteModal from "components/BaseComponents/DeleteModal";
import appConstants from "constants/constant";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import * as Tooltip from "@radix-ui/react-tooltip";

import {
  deleteJob,
  updateJob,
  viewAllJob,
  notifyMatchingApplicants,
} from "api/apiJob";
import ViewJob from "pages/master/ViewJob";
import ViewJobApplicantsModal from "pages/Vendor/ViewJobApplicantsModal";
import SendEmailModal from "components/Job/SendEmailModal";
import MatchingApplicantsModal from "components/Job/MatchingApplicantsModal";

import { ContentCopyOutlined } from "@mui/icons-material";
import { Switch, Modal as AntModal } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { useLocation } from "react-router-dom";
import ActiveModal from "components/BaseComponents/ActiveModal";
import { capitalizeWords, getCurrentUserRole } from "utils/commonFunctions";
import toastify from "utils/toastify";

const { projectTitle, Modules, handleResponse } = appConstants;

const JobListing = () => {
  document.title = Modules.Jobs + " | " + projectTitle;
  const [job, setJob] = useState<any[]>([]);
  const location = useLocation();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<any>([]);
  const [modelLoading, setModelLoading] = useState<boolean>(false);
  const currentRole = getCurrentUserRole();
  const [totalRecords, setTotalRecords] = useState(0);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 50,
    limit: 50,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [isActiveStatus, setIsActiveStatus] = useState(false);
  const [selectedStatusId, setSelectedStatusId] = useState<string>("");
  const [selectedJob, setSelectedJob] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState<string[]>([]);
  const [searchAll, setSearchAll] = useState<string>("");
  const [showViewModal, setShowViewModal] = useState<boolean>(false);
  const [showApplicantsModal, setShowApplicantsModal] =
    useState<boolean>(false);
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [selectedJobTitle, setSelectedJobTitle] = useState<string>("");
  const [currentLocation, setCurrentLocation] = useState<string>("");
  const [showSendEmailModal, setShowSendEmailModal] = useState<boolean>(false);
  const [selectedJobForEmail, setSelectedJobForEmail] = useState<any>(null);
  const [notifyingJobId, setNotifyingJobId] = useState<string>("");
  const [showMatchingModal, setShowMatchingModal] = useState<boolean>(false);
  const [selectedJobForMatching, setSelectedJobForMatching] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [showNotifyConfirmModal, setShowNotifyConfirmModal] =
    useState<boolean>(false);
  const [jobToNotify, setJobToNotify] = useState<any>(null);

  useEffect(() => {
    setCurrentLocation(location.pathname);
  }, [location.pathname]);

  const fetchJob = async () => {
    setIsLoading(true);
    try {
      const params: {
        page: number;
        pageSize: number;
        limit: number;
        search?: string;
        job_subject?: string;
        job_type?: string;
        filterBy?: string;
      } = {
        page: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
        limit: 50,
      };

      if (searchAll) {
        params.search = searchAll;
      }

      if (currentRole === "admin") {
        if (currentLocation === "/job-listingClient") {
          params.filterBy = "client";
        }
      }
      if (currentRole === "admin") {
        if (currentLocation === "/job-listing") {
          params.filterBy = "vendor";
        }
      }
      const res = await viewAllJob(params);
      if (res?.success) {
        setJob(res?.data?.item || []);
        setTotalRecords(res.data?.totalRecords || 0);
      } else {
        toast.error(res?.message || "Failed to fetch jobs.");
      }
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJob();
  }, [pagination.pageIndex, pagination.pageSize, searchAll, currentLocation]);

  const handleDelete = (job: any) => {
    setJobToDelete(job);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!jobToDelete || jobToDelete.length === 0) {
      toastify("No job selected for deletion.", { type: "error" });
      return;
    }

    setIsLoading(true);

    try {
      if (jobToDelete.length >= 1) {
        const res = await deleteJob(jobToDelete);
        if (res?.success) {
          toastify(res?.message, { type: "success" });
        } else {
          toastify(res?.message, { type: "error" });
        }
      }
      // If deleting a single
      else if (jobToDelete._id) {
        const res = await deleteJob([jobToDelete._id]);
        if (res?.success) {
          toastify(res?.message, { type: "success" });
        } else {
          toastify(res?.message, { type: "error" });
        }
      }
      fetchJob();
    } catch (error) {
      toastify("Something went wrong!", { type: "error" });
    } finally {
      setIsLoading(false);
      setShowDeleteModal(false);
      setJobToDelete([]);
      setSelectedJob([]);
    }
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedJob(job.map((job) => job._id)); // Select all
    } else {
      setSelectedJob([]); // Unselect all
    }
  };

  const handleSelectApplicant = (jobId: string) => {
    setSelectedJob(
      (prev) =>
        prev.includes(jobId)
          ? prev.filter((id) => id !== jobId) // Unselect if already selected
          : [...prev, jobId], // Add to selected list
    );
  };

  const handleDeleteAll = () => {
    if (selectedJob.length > 1) {
      setJobToDelete([...selectedJob]);
      setShowDeleteModal(true);
    }
  };

  const handleCopyLink = (id: string) => {
    const url = `${window.location.origin}/talent/master/job3/${id}`;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        toastify("Link copied to clipboard!", { type: "success" });
      })
      .catch(() => {
        toastify("Failed to copy link.", { type: "error" });
      });
  };

  const columns = useMemo(
    () => [
      {
        header: (
          <input
            type="checkbox"
            onChange={handleSelectAll}
            checked={selectedJob.length === job.length && job.length > 0}
          />
        ),
        accessorKey: "select",
        cell: (info: any) => (
          <input
            type="checkbox"
            checked={selectedJob.includes(info.row.original._id)}
            onChange={() => handleSelectApplicant(info.row.original._id)}
          />
        ),
        enableColumnFilter: false,
      },
      {
        header: "ID",
        accessorKey: "job_id",
        enableColumnFilter: false,
      },
      {
        header: "Title",
        accessorKey: "job_subject",
        enableColumnFilter: false,
      },
      {
        header: "Job Type",
        accessorKey: "job_type",
        enableColumnFilter: false,
        cell: (cell: any) => {
          return cell.row.original.job_type
            ? capitalizeWords(cell.row.original.job_type)
            : "-";
        },
      },

      {
        header: "Duration",
        accessorKey: "contract_duration",
        enableColumnFilter: false,
        cell: (cell: any) => {
          return (
            <div className="text-center">
              {cell.row.original.contract_duration || "-"}
            </div>
          );
        },
      },
      ...(currentRole === "vendor"
        ? [
            {
              header: "Client Name",
              accessorKey: "clientName",
              enableColumnFilter: false,
              cell: (cell: any) => {
                return (
                  <div className="text-center">
                    {cell.row.original.clientName || "-"}
                  </div>
                );
              },
            },
          ]
        : []),
      {
        header: "Action",
        cell: (cell: { row: { original: any } }) => (
          <div className="gap-2 hstack">
            <Tooltip.Provider delayDuration={100}>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <button
                    className="btn btn-sm btn-soft-success bg-primary"
                    onClick={() => handleView(cell?.row?.original)}
                    disabled={!cell?.row?.original.isActive}
                  >
                    <i className="text-white ri-eye-fill" />
                  </button>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    side="bottom"
                    sideOffset={4}
                    className="px-2 py-1 text-xs text-white rounded shadow-lg bg-primary"
                  >
                    View
                    <Tooltip.Arrow style={{ fill: "#624bff" }} />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
              {!cell?.row?.original?.isClientJob && (
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <button
                      className="btn btn-sm btn-soft-success bg-secondary"
                      onClick={() => handleEdit(cell?.row?.original?._id)}
                      disabled={!cell?.row?.original.isActive}
                    >
                      <i className="text-white align-bottom ri-pencil-fill" />
                    </button>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      side="bottom"
                      sideOffset={4}
                      className="px-2 py-1 text-xs text-white rounded shadow-lg bg-secondary"
                    >
                      Edit
                      <Tooltip.Arrow style={{ fill: "#637381" }} />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              )}

              {!cell?.row?.original?.isClientJob && (
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <button
                      className="text-white btn btn-sm btn-soft-danger bg-danger"
                      onClick={() => handleDelete(cell?.row?.original)}
                      disabled={!cell?.row?.original.isActive}
                    >
                      <i className="align-bottom ri-delete-bin-5-fill" />
                    </button>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      side="bottom"
                      sideOffset={4}
                      className="px-2 py-1 text-xs text-white rounded shadow-lg bg-danger"
                    >
                      Delete
                      <Tooltip.Arrow style={{ fill: "#dc3545" }} />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              )}
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <button
                    className="text-white btn btn-sm btn-soft-danger bg-info"
                    // onClick={() => handleopen(cell?.row?.original?._id)}
                    onClick={() => handleCopyLink(cell?.row?.original?._id)}
                    disabled={!cell?.row?.original.isActive}
                  >
                    <ContentCopyOutlined fontSize="inherit" />
                  </button>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    side="bottom"
                    sideOffset={4}
                    className="px-2 py-1 text-xs text-white rounded shadow-lg bg-info"
                  >
                    Copy Link
                    <Tooltip.Arrow style={{ fill: "#0ea5e9" }} />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <button
                    className="btn btn-sm btn-soft-success bg-warning"
                    onClick={() => handleViewApplicants(cell?.row?.original)}
                    disabled={!cell?.row?.original.isActive}
                  >
                    <i className="text-white ri-group-fill" />
                  </button>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    side="bottom"
                    sideOffset={4}
                    className="px-2 py-1 text-xs text-white rounded shadow-lg bg-warning"
                  >
                    View Applicants
                    <Tooltip.Arrow style={{ fill: "#f59e0b" }} />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
              {(currentRole === "client" ||
                currentRole === "vendor" ||
                currentRole === "admin") && (
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <button
                      className="btn btn-sm btn-soft-success bg-success"
                      onClick={() => handleSendEmail(cell?.row?.original)}
                      disabled={!cell?.row?.original.isActive}
                    >
                      <i className="text-white ri-mail-send-fill" />
                    </button>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      side="bottom"
                      sideOffset={4}
                      className="px-2 py-1 text-xs text-white rounded shadow-lg bg-success"
                    >
                      Send Email
                      <Tooltip.Arrow style={{ fill: "#10b981" }} />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              )}
              {(currentRole === "vendor" ||
                currentRole === "admin" ||
                currentRole === "client") && (
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <button
                      className="btn btn-sm"
                      style={{ backgroundColor: "#8b5cf6" }}
                      onClick={() => {
                        setSelectedJobForMatching({
                          id: cell?.row?.original._id,
                          title: cell?.row?.original.job_subject,
                        });
                        setShowMatchingModal(true);
                      }}
                      disabled={!cell?.row?.original.isActive}
                    >
                      <i className="text-white ri-user-search-fill" />
                    </button>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      side="bottom"
                      sideOffset={4}
                      className="px-2 py-1 text-xs text-white rounded shadow-lg"
                      style={{ backgroundColor: "#8b5cf6" }}
                    >
                      Find Matching Candidates
                      <Tooltip.Arrow style={{ fill: "#8b5cf6" }} />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              )}
              {(currentRole === "vendor" || currentRole === "admin") && (
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <button
                      className="btn btn-sm btn-soft-success bg-info"
                      onClick={() => {
                        setJobToNotify(cell?.row?.original);
                        setShowNotifyConfirmModal(true);
                      }}
                      disabled={
                        !cell?.row?.original.isActive ||
                        (isLoading &&
                          notifyingJobId === cell?.row?.original._id)
                      }
                    >
                      <i className="text-white ri-notification-3-fill" />
                    </button>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      side="bottom"
                      sideOffset={4}
                      className="px-2 py-1 text-xs text-white rounded shadow-lg bg-info"
                    >
                      Notify Matching Applicants
                      <Tooltip.Arrow style={{ fill: "#0ea5e9" }} />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              )}
            </Tooltip.Provider>
          </div>
        ),
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
              onClick={() => handleConfirmStatus(isActive, id)}
              checkedChildren={<CheckOutlined />}
              unCheckedChildren={<CloseOutlined />}
            />
          );
        },
        enableColumnFilter: false,
      },
    ],
    [selectedJob, job],
  );

  const handleConfirmStatus = (isActive: boolean, id: string) => {
    setShowStatusModal(true);
    setIsActiveStatus(isActive);
    setSelectedStatusId(id);
  };
  const updateStatusData = (isActive: boolean, id: string) => {
    setModelLoading(true);
    updateJob(id, { isActive: !isActive })
      .then((res: any) => {
        if (res.success) {
          toastify(res.message || "Status updated successfully", {
            type: "success",
          });
          setShowStatusModal(false);
          fetchJob();
        }
      })
      .catch((error) => {
        const errorMessages = error?.response?.data?.details;
        if (errorMessages && Array.isArray(errorMessages)) {
          errorMessages.forEach((errorMessage) => {
            toastify(errorMessage, { type: "error" });
          });
        } else {
          toastify("An error occurred while updating the applicant.", {
            type: "error",
          });
        }
      })
      .finally(() => {
        setModelLoading(false);
      });
  };

  const handleView = (id: string[]) => {
    setSelectedId(id);
    setShowViewModal(true);
  };

  const handleCloseModal = () => {
    setShowViewModal(false);
  };

  const handleEdit = (jobId: string) => {
    const jobModule =
      currentLocation === "/job-listingClient" ? "client" : "vendor";
    navigate(`/master/edit-job/${jobId}?mode=edit`, {
      state: { jobModule },
    });
  };

  const handleViewApplicants = (job: any) => {
    setSelectedJobId(job._id);
    setSelectedJobTitle(job.job_subject || "");
    setShowApplicantsModal(true);
  };

  const handleCloseApplicantsModal = () => {
    setShowApplicantsModal(false);
    setSelectedJobId("");
    setSelectedJobTitle("");
  };

  const handleSendEmail = (job: any) => {
    setSelectedJobForEmail(job);
    setShowSendEmailModal(true);
  };

  const handleCloseSendEmailModal = () => {
    setShowSendEmailModal(false);
    setSelectedJobForEmail(null);
  };

  const handleNotifyMatchingApplicants = async (job: any) => {
    if (!job?._id) {
      toastify("Invalid job selected.", { type: "error" });
      return;
    }

    setNotifyingJobId(job._id);
    setIsLoading(true);

    try {
      const res = await notifyMatchingApplicants(job._id);
      if (res?.success) {
        toastify(res?.message || "Matching applicants notified successfully!", {
          type: "success",
        });
      } else {
        toastify(res?.message || "Failed to notify matching applicants.", {
          type: "error",
        });
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        "Something went wrong while notifying matching applicants.";
      toastify(errorMessage, { type: "error" });
    } finally {
      setIsLoading(false);
      setNotifyingJobId("");
    }
  };

  const formTitle =
    currentLocation === "/job-listingClient"
      ? "Client Job Listing"
      : "Vendor Job Listing";
  const submitButtonText = "Add";

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchAll(event.target.value);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedJob([]);
  };

  const navigate = useNavigate();

  const handleRedirect = () => {
    const jobModule =
      currentLocation === "/job-listingClient" ? "client" : "vendor";
    navigate("/master/job", {
      state: { source: "jobListing", jobModule },
    });
  };

  return (
    <Fragment>
      {showStatusModal ? (
        <ActiveModal
          show={showStatusModal}
          loader={modelLoading}
          onYesClick={() => updateStatusData(isActiveStatus, selectedStatusId)}
          onCloseClick={() => setShowStatusModal(false)}
          flag={isActiveStatus}
        />
      ) : (
        <></>
      )}
      {showViewModal && selectedId && (
        <ViewJob
          show={showViewModal}
          onHide={handleCloseModal}
          jobId={selectedId}
        />
      )}
      {showApplicantsModal && selectedJobId && (
        <ViewJobApplicantsModal
          show={showApplicantsModal}
          onHide={handleCloseApplicantsModal}
          jobId={selectedJobId}
          jobTitle={selectedJobTitle}
        />
      )}
      {showSendEmailModal && selectedJobForEmail && (
        <SendEmailModal
          show={showSendEmailModal}
          onHide={handleCloseSendEmailModal}
          jobId={selectedJobForEmail._id}
          jobTitle={selectedJobForEmail.job_subject}
        />
      )}
      {showMatchingModal && selectedJobForMatching && (
        <MatchingApplicantsModal
          show={showMatchingModal}
          onHide={() => {
            setShowMatchingModal(false);
            setSelectedJobForMatching(null);
          }}
          jobId={selectedJobForMatching.id}
          jobTitle={selectedJobForMatching.title}
        />
      )}
      {/* Notify Matching Applicants Confirmation Modal */}
      <AntModal
        open={showNotifyConfirmModal}
        onCancel={() => {
          setShowNotifyConfirmModal(false);
          setJobToNotify(null);
        }}
        footer={null}
        centered
        width={420}
      >
        <div className="text-center py-4">
          <i
            className="ri-notification-3-line text-info"
            style={{ fontSize: "48px" }}
          ></i>
          <h5 className="text-dark mt-4 mb-2">Notify Matching Applicants</h5>
          <p className="text-muted mb-4">
            Are you sure you want to notify all matching applicants for{" "}
            <strong>"{jobToNotify?.job_subject}"</strong>?
          </p>
          <div className="d-flex justify-content-center gap-2">
            <button
              className="btn btn-info px-4 text-white"
              onClick={() => {
                handleNotifyMatchingApplicants(jobToNotify);
                setShowNotifyConfirmModal(false);
                setJobToNotify(null);
              }}
              disabled={isLoading && notifyingJobId === jobToNotify?._id}
            >
              {isLoading && notifyingJobId === jobToNotify?._id ? (
                <>
                  <i className="ri-loader-4-line animate-spin me-1"></i>
                  Sending...
                </>
              ) : (
                "Yes, Notify"
              )}
            </button>
            <button
              className="btn btn-light px-4"
              onClick={() => {
                setShowNotifyConfirmModal(false);
                setJobToNotify(null);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </AntModal>
      <DeleteModal
        show={showDeleteModal}
        onCloseClick={closeDeleteModal}
        onDeleteClick={confirmDelete}
        loader={isLoading}
      />
      <div className="pt-1 page-content"></div>
      <Container fluid>
        <Row>
          <div>
            <Card className="my-3 mb-3">
              <CardBody>
                <Row className="flex">
                  <Row className="mt-1 fw-bold text-dark d-flex align-items-center">
                    <Col
                      sm={12}
                      lg={12}
                      className="flex-wrap mb-2 ml-2 d-flex justify-content-between align-items-center"
                    >
                      <div className="justify-content-start h4 fw-bold">
                        {formTitle}
                      </div>
                      {/* Right Section (Search + Buttons) */}
                      <div className="flex-wrap mr-2 d-flex justify-content-end gap-2">
                        {/* Search Bar */}
                        <div className="col-sm-auto col-12">
                          <input
                            id="search-bar-0"
                            className="h-10 form-control search"
                            placeholder="Search..."
                            onChange={handleSearchChange}
                            value={searchAll}
                          />
                        </div>

                        {/* Delete Button (Only if cities are selected) */}
                        {selectedJob.length > 1 && (
                          <BaseButton
                            className="ml-2 text-lg border-0 btn bg-danger edit-list w-fit"
                            onClick={handleDeleteAll}
                          >
                            <i className="align-bottom ri-delete-bin-fill" />
                            <ReactTooltip
                              place="bottom"
                              variant="error"
                              content="Delete"
                              anchorId={`Delete ${selectedJob.length} Emails`}
                            />
                          </BaseButton>
                        )}

                        {/* Import & Submit Buttons (Stack only on smaller screens) */}
                        <div className="flex-wrap gap-2 d-flex align-items-center">
                          <BaseButton
                            color="success"
                            type="submit"
                            onClick={handleRedirect}
                            className="ml-2"
                          >
                            <i className="align-bottom ri-add-line me-1" />
                            {submitButtonText}
                          </BaseButton>
                        </div>
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
                              loader={isLoading}
                              customPadding="0.3rem 1.5rem"
                              rowHeight="10px !important"
                            />
                          ) : (
                            <EmptyState />
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

export default JobListing;
