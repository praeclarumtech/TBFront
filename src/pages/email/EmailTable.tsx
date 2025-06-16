/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import TableContainer from "../../components/BaseComponents/TableContainer";
import BaseInput from "../../components/BaseComponents/BaseInput";

import BaseButton from "components/BaseComponents/BaseButton";
// import { Tooltip as ReactTooltip } from "react-tooltip";
import * as Tooltip from "@radix-ui/react-tooltip";
import { errorHandle, InputPlaceHolder } from "utils/commonFunctions";
import appConstants from "constants/constant";
import ViewEmail from "./ViewEmail";
import "react-loading-skeleton/dist/skeleton.css";
import {
  deleteEmail,
  viewAllEmail,
  deleteMultipleEmail,
  getEmailCount,
} from "api/emailApi";
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
import { toast } from "react-toastify";

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
    pageSize: 50,
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
  const [emailCount, setEmailCount] = useState<number>(0);

  const today = new Date().toISOString().split("T")[0];

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
       setPagination((prev) => ({
      ...prev,
      pageIndex: 0,
    }));
  };

  const columns = [
    {
      header: (
        <input
          type="checkbox"
          onChange={handleSelectAll}
          checked={
            emails.length > 0
              ? selectedApplicants.length === emails.length
              : false
          }
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
    // {
    //   header: "Action",
    //   cell: (cell: { row: { original: any } }) => (
    //     <div className="gap-2 hstack">
    //       <BaseButton
    //         id={`usage-${cell?.row?.original?.id}`}
    //         color="primary"
    //         className="btn btn-sm btn-soft-success usage-list"
    //         onClick={() => handleView(cell.row.original._id)}
    //       >
    //         <i className="align-bottom ri-eye-fill" />
    //         <ReactTooltip
    //           place="bottom"
    //           variant="success"
    //           content="View"
    //           anchorId={`usage-${cell?.row?.original?.id}`}
    //         />
    //       </BaseButton>
    //       <BaseButton
    //         color="danger"
    //         id={`delete-${cell?.row?.original?._id}`}
    //         className="btn btn-sm btn-soft-danger bg-danger"
    //         onClick={() => handleDelete(cell?.row?.original?._id)}
    //       >
    //         <i className="align-bottom ri-delete-bin-fill" />
    //         <ReactTooltip
    //           place="bottom"
    //           variant="error"
    //           content="Delete"
    //           anchorId={`delete-${cell?.row?.original?._id}`}
    //         />
    //       </BaseButton>
    //     </div>
    //   ),
    // },
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
                  onClick={() => handleView(row.original._id)}
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

            {/* Edit Button with Tooltip */}

            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <button
                  className="text-white btn btn-sm btn-soft-danger bg-danger"
                  onClick={() => handleDelete(row.original._id)}
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
          </Tooltip.Provider>
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
        email_to?: string;
        name?: string;
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
        // params.email_to = decodeURIComponent(searchValue);
        // params.appliedSkills = searchValue;
        params.search = searchValue;
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

  const fetchEmailCount = async () => {
    try {
      const params: { startDate?: string; endDate?: string } = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      else if (!startDate && !endDate) {
        // Default to today
        const today = new Date().toISOString().split("T")[0];
        params.startDate = today;
        params.endDate = today;
      }
      const data = await getEmailCount(params);
      setEmailCount(data?.data?.count || 0);
    } catch (error) {
      console.log("error========================", error);
      setEmailCount(0);
    }
  };

  useEffect(() => {
    const delayedSearch = debounce(() => {
      fetchEmails();
    }, 0);

    delayedSearch();

    return () => delayedSearch.cancel();
  }, [
    pagination.pageIndex,
    pagination.pageSize,
    startDate,
    endDate,
    searchAll,
  ]); // Runs when `searchAll` changes

  useEffect(() => {
    fetchEmailCount();
  }, [startDate, endDate]);

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
      toast.success("Emails Delete Successfully!.");
      fetchEmails(); // Refresh email list
      setShowDeleteModal(false);
      setEmailToDelete([]);
    } catch (error) {
      errorHandle(error);
      toast.error("Something went wrong!");
    } finally {
      setDeleteLoader(false);
    }
  };

  const confirmMultipleDelete = async (multipleEmailDelete: string[]) => {
    setDeleteLoader(true);
    try {
      await deleteMultipleEmail(multipleEmailDelete); // Pass the array of selected emails
      toast.success("Email Delete Successfully!.");
      fetchEmails(); // Refresh email list
      setShowDeleteModal(false);
      setSelectedApplicants([]); // Clear selection
    } catch (error) {
      errorHandle(error);
      toast.error("Something went wrong!");
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
        <Row className="flex items-center justify-between mb-4">
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
          className="mb-1 select-border"
          type="date"
          placeholder={InputPlaceHolder("Start Date")}
          handleChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleDateChange(e, true)
          }
          value={startDate || ""}
          max={today}
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
          max={today}
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

      <div className="mt-3 mb-4">
        <div className="mb-3 card">
          <div className="card-body">
            <div className="container">
              <div className="row gy-2 gx-2 align-items-center justify-content-between">
                {/* Email Count */}
                <div className="col-auto d-flex align-items-center">
                  <span className="inline-block px-5 py-2 mr-4 text-base font-medium tracking-wide text-white align-middle rounded-lg shadow-sm bg-primary">
                    Sent Emails: {emailCount}
                  </span>
                </div>
                {/* Filters Button */}
                <div className="col-3 col-xs-auto">
                  <button
                    onClick={toggleDrawer("right", true)}
                    className="btn btn-primary w-100 w-md-auto"
                  >
                    <i className="mx-1 fa fa-filter"></i> Filters
                  </button>
                  <Drawer
                    className="!mt-16"
                    anchor="right"
                    open={state["right"]}
                    onClose={toggleDrawer("right", false)}
                  >
                    {drawerList("right")}
                  </Drawer>
                </div>

                {/* Search Input & Buttons */}
                <div className="flex-wrap gap-2 col-8 col-md d-flex align-items-center justify-content-end">
                  {/* Search Bar */}
                  <input
                    id="search-bar-0"
                    className="form-control h-10 px-2 border rounded w-[150px] min-w-[150px] max-w-[250px]"
                    placeholder="Search..."
                    onChange={handleSearchChange}
                    value={searchAll}
                  />

                  {/* Delete Button (Visible when multiple applicants selected) */}
                  {selectedApplicants.length > 1 && (
                    <Tooltip.Provider delayDuration={100}>
                      {/* View Button with Tooltip */}
                      <Tooltip.Root>
                        <Tooltip.Trigger asChild>
                          <button
                            className="text-lg text-white border-0 btn bg-danger edit-list w-fit"
                            onClick={handleDeleteAll}
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
                    </Tooltip.Provider>
                  )}

                  {/* Compose Email Button */}
                  <button
                    onClick={() => navigate("/email/compose")}
                    className="btn btn-success"
                  >
                    Compose Email
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          {loading ? (
            <div className="py-4 text-center">
              <Skeleton count={1} className="mb-5 min-h-10" />

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
