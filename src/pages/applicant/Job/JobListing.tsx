/* eslint-disable @typescript-eslint/no-explicit-any */
import { Row, Col, Card, Container, CardBody } from "react-bootstrap";
import { Fragment, useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import BaseButton from "components/BaseComponents/BaseButton";
import TableContainer from "components/BaseComponents/TableContainer";
import { Tooltip as ReactTooltip } from "react-tooltip";

import DeleteModal from "components/BaseComponents/DeleteModal";
import appConstants from "constants/constant";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import * as Tooltip from "@radix-ui/react-tooltip";

import { deleteJob, updateJob, viewAllJob } from "api/apiJob";
import ViewJob from "pages/master/ViewJob";

import { ContentCopyOutlined } from "@mui/icons-material";
import { Switch } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import BaseFav from "components/BaseComponents/BaseFav";

const { projectTitle, Modules, handleResponse } = appConstants;

const JobListing = () => {
  document.title = Modules.Jobs + " | " + projectTitle;
  const [job, setJob] = useState<any[]>([]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<any>([]);

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
      } = {
        page: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
        limit: 50,
      };

      if (searchAll) {
        params.search = searchAll;
      }
      const res = await viewAllJob(params);
      if (res?.success) {
        setJob(res?.data?.item || []);
        setTotalRecords(res.data?.totalRecords || 0);
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
  }, [pagination.pageIndex, pagination.pageSize, searchAll]);

  const handleDelete = (job: any) => {
    setJobToDelete(job);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!jobToDelete || jobToDelete.length === 0) {
      toast.error("No job selected for deletion.");
      return;
    }

    setIsLoading(true);

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
          : [...prev, jobId] // Add to selected list
    );
  };

  const handleDeleteAll = () => {
    if (selectedJob.length > 1) {
      setJobToDelete([...selectedJob]);
      setShowDeleteModal(true);
    }
  };

  const handleCopyLink = (id: string) => {
    const url = `${window.location.origin}/master/job3/${id}`;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        toast.success("Link copied to clipboard!");
      })
      .catch(() => {
        toast.error("Failed to copy link.");
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
      },

      {
        header: "Duration",
        accessorKey: "contract_duration",
        enableColumnFilter: false,
      },

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
              {/* View Button with Tooltip */}
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

              {/* Edit Button with Tooltip */}

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
    [selectedJob, job]
  );

  const handleConfirmStatus = (isActive: boolean, id: string) => {
    setShowStatusModal(true);
    setIsActiveStatus(isActive);
    setSelectedStatusId(id);
  };
  const updateStatusData = (isActive: boolean, id: string) => {
    updateJob(id, { isActive: !isActive })
      .then((res: any) => {
        if (res.success) {
          toast.success(res.message || "Status updated successfully");
          setShowStatusModal(false);
          fetchJob();
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
        setIsLoading(false);
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
    navigate(`/master/edit-job/${jobId}?mode=edit`);
  };

  const formTitle =
    //  editingState ? "Update Jobs" :
    "Add Jobs";
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
    navigate("/master/job", {
      state: { source: "jobListing" },
    });
  };

  return (
    <Fragment>
      <BaseFav
        show={showStatusModal}
        onCloseClick={() => setShowStatusModal(false)}
        onYesClick={() => updateStatusData(isActiveStatus, selectedStatusId)}
        flag={isActiveStatus}
      />

      {showViewModal && selectedId && (
        <ViewJob
          show={showViewModal}
          onHide={handleCloseModal}
          jobId={selectedId}
        />
      )}
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
                      <div className="flex-wrap mr-2 d-flex justify-content-end ">
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

export default JobListing;
