/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import TableContainer from "../../components/BaseComponents/TableContainer";
import BaseInput from "../../components/BaseComponents/BaseInput";

import BaseButton from "components/BaseComponents/BaseButton";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { errorHandle, InputPlaceHolder } from "utils/commonFunctions";
import appConstants from "constants/constant";
import ViewEmail from "./ViewEmail";
import "react-loading-skeleton/dist/skeleton.css";
import { deleteEmail, viewAllEmail } from "api/emailApi";
import DeleteModal from "components/BaseComponents/DeleteModal";
import Skeleton from "react-loading-skeleton";

const { projectTitle, Modules } = appConstants;

const EmailTable = () => {
  document.title = Modules.Email + " | " + projectTitle;
  const navigate = useNavigate();

  interface Email {
    _id: string;
    email_to: string;
    subject: string;
    createdAt: string;
  }

  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalRecords, setTotalRecords] = useState(0);
  const [selectedApplicantId, setSelectedApplicantId] = useState<string | null>(
    null
  );

  const [showModal, setShowModal] = useState(false);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [emailToDelete, setEmailToDelete] = useState<string | null>(null);
  const [deleteLoader, setDeleteLoader] = useState(false);

  const handleView = (id: string) => {
    setSelectedApplicantId(id);
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };
  const columns = [
    {
      header: "Email",
      accessorKey: "email_to",
      enableColumnFilter: false,
    },

    {
      header: "Name",
      accessorKey: "applicantDetails.name.firstName",
      enableColumnFilter: false,
    },
    {
      header: "appliedSkills",
      accessorKey: "applicantDetails.appliedSkills",
      cell: (cell: any) => (
        <div
          className="truncated-text"
          style={truncateText}
          title={cell.row.original.applicantDetails.appliedSkills}
        >
          {cell.row.original.applicantDetails.appliedSkills}
        </div>
      ),
      enableColumnFilter: false,
    },
    {
      header: "Subject",
      accessorKey: "subject",
      enableColumnFilter: false,
    },
    {
      header: "Date",
      accessorKey: "createdAt",
      enableColumnFilter: false,
      cell: ({ row }: { row: any }) =>
        moment(row.original.createdAt).format("YYYY-MM-DD"),
    },
    {
      header: "Action",
      cell: (cell: { row: { original: any } }) => (
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
            color="danger"
            id={`delete-${cell?.row?.original?._id}`}
            className="btn btn-sm btn-soft-danger bg-danger"
            onClick={() => handleDelete(cell?.row?.original?._id)}
          >
            <i className="ri-delete-bin-fill align-bottom" />
            <ReactTooltip
              place="bottom"
              variant="error"
              content="Delete"
              anchorId={`delete-${cell?.row?.original?._id}`}
            />
          </BaseButton>
        </div>
      ),
    },
  ];

  const fetchEmails = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
        startDate,
        endDate,
      };

      if (startDate) {
        params.startDate = startDate;
      }
      if (endDate) {
        params.endDate = endDate;
      }

      const response = await viewAllEmail(params);

      const emailData = Array.isArray(response.data?.emails)
        ? response.data.emails
        : [];

      setEmails(emailData);
      setTotalRecords(response.data?.totalRecords || 0);
    } catch (error) {
      errorHandle(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, [pagination.pageIndex, pagination.pageSize, startDate, endDate]);

  const handleDelete = (id: string) => {
    setEmailToDelete(id);
    setShowDeleteModal(true);
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
  const confirmDelete = async () => {
    if (!emailToDelete) return;

    setDeleteLoader(true);
    try {
      await deleteEmail([emailToDelete]);
      fetchEmails();
      setShowDeleteModal(false);
      setEmailToDelete(null);
    } catch (error) {
      errorHandle(error);
    } finally {
      setDeleteLoader(false);
    }
  };

  const resetFilters = () => {
    setStartDate("");
    setEndDate("");
    fetchEmails();
  };

  return (
    <div className="container mx-auto">
      <DeleteModal
        show={showDeleteModal}
        onCloseClick={() => {
          setShowDeleteModal(false);
          setEmailToDelete(null);
        }}
        onDeleteClick={confirmDelete}
        loader={deleteLoader}
      />

      {showModal && selectedApplicantId && (
        <ViewEmail
          show={showModal}
          onHide={handleCloseModal}
          applicantId={selectedApplicantId}
        />
      )}
      {/* Header Section with Filter and Compose Button */}
      <div className="mt-3 mb-4">
        <div className="card mb-3">
          <div className="card-body">
            <div className="container">
              <div className="row justify-content-between">
                <div className="col-auto d-flex justify-content-start">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setFiltersVisible(!filtersVisible);
                    }}
                    className="btn btn-primary"
                  >
                    {filtersVisible ? (
                      "Hide Filters"
                    ) : (
                      <>
                        <i className="fa fa-filter mx-1 "></i> Filters
                      </>
                    )}
                  </button>
                </div>

                <div className="col-auto d-flex justify-content-end gap-2">
                  <button
                    onClick={() => navigate("/email/compose")}
                    className="btn btn-success"
                  >
                    Compose Email
                  </button>
                </div>
              </div>
            </div>

            {filtersVisible && (
              <div className="mt-3 w-100">
                <div className="row g-3">
                  <div className="col-xl-2 col-sm-6 col-md-4 col-lg-2">
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
                  </div>
                  <div className="col-xl-2 col-sm-6 col-md-4 col-lg-2">
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
                  </div>
                  <div className="col-xl-2 col-sm-6 col-md-6 col-lg-2">
                    <label className="form-label">&nbsp;</label>
                    <button
                      onClick={resetFilters}
                      className="btn btn-primary w-100"
                      disabled={loading}
                    >
                      Reset Filters
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          {loading ? (
            <div className="text-center py-4">
              <Skeleton count={5} />
            </div>
          ) : (
            <TableContainer
              isHeaderTitle="Email"
              columns={columns}
              data={emails}
              // isGlobalFilter
              customPageSize={10}
              theadClass="table-light text-muted"
              tableClass="!text-nowrap !mb-0 !responsive !table-responsive-sm !table-hover !table-outline-none !mb-0"
              // SearchPlaceholder="Search..."
              totalRecords={totalRecords}
              pagination={pagination}
              setPagination={setPagination}
              loader={loading}
              customPadding="0.3rem 1.75rem"
            />
          )}
        </div>
      </div>
    </div>
  );
};
const truncateText = {
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  padding: "2px",
  maxWidth: "150px",
};
export default EmailTable;
