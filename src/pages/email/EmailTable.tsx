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
import { deleteEmail, viewAllEmail, deleteMultipleEmail } from "api/emailApi";
import DeleteModal from "components/BaseComponents/DeleteModal";
import Skeleton from "react-loading-skeleton";
import debounce from "lodash.debounce";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import { Col, Row } from "react-bootstrap";
import React from "react";
import IconButton from "@mui/material/IconButton";
import { Close } from "@mui/icons-material";

const { projectTitle, Modules } = appConstants;

const EmailTable = () => {
  document.title = Modules.Email + " | " + projectTitle;
  const navigate = useNavigate();

  interface Email {
    [x: string]: any;
    _id: string;
    email_to: string;
    subject: string;
    createdAt: string;
  }

  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  // const [filtersVisible, setFiltersVisible] = useState(false);
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
  const [emailToDelete, setEmailToDelete] = useState<string[]>([]);
  const [deleteLoader, setDeleteLoader] = useState(false);
  const [selectedApplicants, setSelectedApplicants] = useState<string[]>([]);
  const [searchAll, setSearchAll] = useState<string>("");
  const [state, setState] = React.useState({
    right: false,
  });
  const [multipleEmailDelete, setMultipleEmailDelete] = useState<string[]>([]);

  const handleView = (id: string) => {
    setSelectedApplicantId(id);
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedApplicants(emails.map((app) => app._id));
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

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchAll(event.target.value);
  };

  const columns = [
    {
      header: (
        <input
          type="checkbox"
          onChange={handleSelectAll}
          checked={selectedApplicants.length === emails.length}
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
      header: "Applied Skills",
      accessorKey: "applicantDetails.appliedSkills",
      cell: (cell: any) => {
        const skills = cell.row.original.applicantDetails.appliedSkills;

        // Ensure it's an array, then join with ", "
        const formattedSkills = Array.isArray(skills)
          ? skills.join(", ")
          : skills;

        return (
          <div
            className="truncated-text"
            style={truncateText}
            title={formattedSkills}
          >
            {formattedSkills}
          </div>
        );
      },
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
      const params: {
        page: number;
        pageSize: number;
        startDate?: string;
        endDate?: string;
        search?: string;
        appliedSkills?: string;
      } = {
        page: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
      };
      if (startDate) {
        params.startDate = startDate;
      }
      if (endDate) {
        params.endDate = endDate;
      }
      const searchValue = searchAll?.trim();
      if (searchValue) {
        params.search = searchValue;
        params.appliedSkills = searchValue;
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
    const delayedSearch = debounce(() => {
      fetchEmails();
    }, 0);

    delayedSearch();

    return () => delayedSearch.cancel();
  }, [pagination.pageIndex, pagination.pageSize, startDate, endDate]); // Runs when `searchAll` changes

  const handleDelete = (id: string) => {
    setEmailToDelete([id]);
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
    setDeleteLoader(true);
    try {
      await deleteEmail(emailToDelete); // Pass the array of selected emails
      fetchEmails(); // Refresh email list
      setShowDeleteModal(false);
    } catch (error) {
      errorHandle(error);
    } finally {
      setDeleteLoader(false);
    }
  };

  const confirmMultipleDelete = async (multipleEmailDelete: string[]) => {
    setDeleteLoader(true);
    try {
      await deleteMultipleEmail(multipleEmailDelete); // Pass the array of selected emails
      fetchEmails(); // Refresh email list
      setShowDeleteModal(false);
      setSelectedApplicants([]); // Clear selection
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

  const handleDeleteAll = () => {
    if (selectedApplicants.length > 0) {
      console.log("Emails to Delete:-", multipleEmailDelete);
      setMultipleEmailDelete([...selectedApplicants]);
      setShowDeleteModal(true);
    }
  };

  const filteredEmails = emails.filter((email) => {
    const searchTerm = searchAll.toLowerCase();

    return (
      email.email_to?.toLowerCase().includes(searchTerm) ||
      email.subject?.toLowerCase().includes(searchTerm) ||
      email.applicantDetails?.name?.firstName
        ?.toLowerCase()
        .includes(searchTerm) ||
      (Array.isArray(email.applicantDetails?.appliedSkills) &&
        email.applicantDetails.appliedSkills.some((skill: string) =>
          skill.toLowerCase().includes(searchTerm)
        )) ||
      moment(email.createdAt).format("YYYY-MM-DD").includes(searchTerm)
    );
  });

  type Anchor = "top" | "right" | "bottom";

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

  const drawerList = (anchor: Anchor) => (
    <Box
      sx={{
        width: anchor === "top" || anchor === "bottom" ? "auto" : 400,
        padding: "16px",
        marginTop: anchor === "top" ? "64px" : 0,
      }}
      role="presentation"
    >
      <div className="mb-4">
        <IconButton
          onClick={toggleDrawer("right", false)}
          sx={{ position: "absolute", top: 8, left: 8, zIndex: 10 }}
        >
          <Close />
        </IconButton>
      </div>
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

  return (
    <div className="container mx-auto">
      <DeleteModal
        show={showDeleteModal}
        onCloseClick={() => {
          setShowDeleteModal(false);
          setEmailToDelete([]);
        }}
        onDeleteClick={() =>
          selectedApplicants.length > 1
            ? confirmMultipleDelete(selectedApplicants) // ✅ Wrap in an arrow function
            : confirmDelete()
        }
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
                  {/* <button
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
                  </button> */}
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

                <div className="col-auto d-flex justify-content-end">
                  <div>
                    <input
                      id="search-bar-0"
                      className="form-control search h-10"
                      placeholder="Search..."
                      onChange={handleSearchChange}
                      value={searchAll}
                    />
                  </div>
                  {selectedApplicants.length > 1 && (
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
                  )}

                  {/* Compose Email Button */}
                  <button
                    onClick={() => navigate("/email/compose")}
                    className="btn btn-success ml-2"
                  >
                    Compose Email
                  </button>
                </div>
              </div>
            </div>

            {/* {filtersVisible && (
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
            )} */}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          {loading ? (
            <div className="text-center py-4">
              <Skeleton count={1} className="min-h-10 mb-5" />

              <Skeleton count={5} />
            </div>
          ) : (
            <TableContainer
              isHeaderTitle="Email"
              columns={columns}
              data={filteredEmails}
              // isGlobalFilter
              customPageSize={10}
              theadClass="table-light text-muted"
              tableClass="!text-nowrap !mb-0 !responsive !table-responsive-sm !table-hover !table-outline-none !mb-0"
              // SearchPlaceholder="Search..."
              totalRecords={totalRecords}
              pagination={pagination}
              setPagination={setPagination}
              loader={loading}
              customPadding="0.3rem 1.5rem"
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
