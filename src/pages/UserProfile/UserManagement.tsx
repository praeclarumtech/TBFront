/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAllUsers, updateUserStatus } from "api/usersApi";
import ActiveModal from "components/BaseComponents/ActiveModal";
import DeleteModal from "components/BaseComponents/DeleteModal";
import { useEffect, useMemo, useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { AnyObject } from "yup";
import { Switch } from "antd";
import Skeleton from "react-loading-skeleton";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import TableContainer from "components/BaseComponents/TableContainer";
import * as Tooltip from "@radix-ui/react-tooltip";
import { useNavigate } from "react-router-dom";
import ViewProfile from "./ViewProfile";
import BaseButton from "components/BaseComponents/BaseButton";
import appConstants from "constants/constant";
import Box from "@mui/material/Box";
import {
  Divider,
  Drawer,
  IconButton,
  List,
  useMediaQuery,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { BaseSelect } from "components/BaseComponents/BaseSelect";
import React from "react";
import { SelectedOption } from "interfaces/applicant.interface";

const { handleResponse, roleType } = appConstants;
type Anchor = "top" | "right" | "bottom";
const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showActiveModal, setShowActiveModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null);
  const [dataActive, SetDataActive] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [tableLoader, setTableLoader] = useState(false);
  const navigate = useNavigate();
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 50,
  });
  const [searchAll, setSearchAll] = useState<string>("");
  const [state, setState] = React.useState({
    right: false,
  });
  const isMobile = window.innerWidth <= 767;
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [roleFilter, setRoleFilter] = useState<SelectedOption | null>(null);

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

  // const [tableLoader, setTableLoader] = useState(false);
  const handleUpdateUserStatus = async (id: string, value: AnyObject) => {
    setIsLoading(true);
    await updateUserStatus(id, value)
      .then((res) => {
        if (res?.success === true && res.statusCode === 202) {
          toast.success(res?.message);
          setShowActiveModal(false);
          setShowDeleteModal(false);
          fetchUsers();
        } else {
          toast.error(res?.message);
        }
      })
      .catch((err) => {
        toast.error(err?.message);
        setShowActiveModal(false);
        setShowDeleteModal(false);
      })
      .finally(() => {
        setIsLoading(false);
        setShowActiveModal(false);
        setShowDeleteModal(false);
      });
  };

  const fetchUsers = async () => {
    setTableLoader(true);

    try {
      const params: {
        search?: string;
        page?: number;
        pageSize?: number;
        limit?: number;
        role?: string;
      } = {
        page: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
        limit: 50,
      };
      const searchValue = searchAll?.trim();
      if (roleFilter) {
        params.role = encodeURIComponent(roleFilter.value);
      }
      if (searchValue) {
        params.search = searchValue;
      }
      const response = await getAllUsers(params);
      setUsers(response?.data?.item || response?.data?.results || []);
      setTotalRecords(response?.data?.totalRecords || 0);
    } catch (error) {
      console.error("Error fetching total applicants:", error);
    } finally {
      setTableLoader(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [pagination.pageIndex, pagination.pageSize, searchAll, roleFilter]);

  const closeActiveModal = () => {
    setShowActiveModal(false);
  };

  const handleUpdateUserStatusModal = (id: any, isActive: any) => {
    setSelectedRecord(id);
    SetDataActive(!isActive);
    setShowActiveModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const handleDeleteUser = (id: string) => {
    setSelectedRecord(id);
    setShowDeleteModal(true);
  };

  const columns = useMemo(
    () => [
      {
        header: "Sr. No.",
        accessorKey: "serialNumber",
        cell: ({ row }: any) => row.index + 1,
        enableColumnFilter: false,
      },
      {
        header: "User Name",
        accessorKey: "userName",

        filterFn: "fuzzy",
        enableColumnFilter: false,
      },
      {
        header: "Role",
        accessorKey: "role",

        enableColumnFilter: false,
      },
      {
        header: "Email",
        accessorKey: "email",
        enableColumnFilter: false,
      },
      // {
      //   header: "Total Exp",
      //   accessorKey: "totalExperience",
      //   enableColumnFilter: false,
      // },

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
              onClick={() => handleUpdateUserStatusModal(id, isActive)} // ✅ Handler only runs on user interaction
              checkedChildren={<CheckOutlined />}
              unCheckedChildren={<CloseOutlined />}
            />
          );
        },
        enableColumnFilter: false,
      },
      {
        header: "Action",
        cell: ({ row }: any) => (
          <div className="flex gap-2">
            <Tooltip.Provider delayDuration={50}>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <button
                    className="text-white btn btn-sm btn-soft-secondary bg-secondary"
                    onClick={() =>
                      navigate(`/userprofileEdit/${row?.original?._id}`)
                    }
                    disabled={!row.original.isActive}
                  >
                    <i className="ri-pencil-fill" />
                  </button>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    side="bottom"
                    sideOffset={4}
                    className="px-2 py-1 text-sm text-white rounded shadow-lg bg-secondary"
                  >
                    Edit
                    <Tooltip.Arrow style={{ fill: "#637381" }} />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <button
                    className="btn btn-sm btn-soft-success bg-primary"
                    onClick={() => handleView(row?.original?._id)}
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

              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <button
                    className="text-white btn btn-sm btn-soft-danger bg-danger"
                    onClick={() => handleDeleteUser(row.original._id)}
                    disabled={!row.original.isActive}
                  >
                    <i className="align-bottom ri-delete-bin-5-fill" />
                  </button>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    side="bottom"
                    sideOffset={4}
                    className="px-2 py-1 text-sm text-white rounded shadow-lg bg-danger"
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
    ],
    [users]
  );

  const handleView = (_id: string) => {
    setSelectedId(_id);
    setShowViewModal(true);
  };
  const handleCloseModal = () => {
    setShowViewModal(false);
  };

  const handleAdd = () => {
    navigate("/userprofileAdd");
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchAll(event.target.value);
    setPagination((prev) => ({
      ...prev,
      pageIndex: 0,
    }));
  };

  const handleRoleChange = (selectedOption: SelectedOption) => {
    setRoleFilter(selectedOption);
  };

  const drawerList = (anchor: Anchor) => (
    <Box
      sx={{
        // width: anchor === "top" || anchor === "bottom" ? "auto" : 400,
        padding: "16px",
        marginTop: anchor === "top" ? "64px" : 0,
        width: isDesktop ? 400 : 250,
      }}
      role="presentation"
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          background: "#fff",
          zIndex: 100,
          paddingBottom: "8px",
          paddingTop: "8px",
        }}
      >
        <Row className="flex items-center justify-between">
          <Col>
            <h3>Apply Filters</h3>
          </Col>
          <Col className="text-end">
            <IconButton
              onClick={toggleDrawer("right", false)}
              sx={{ position: "absolute", top: 0, right: 0, zIndex: 10 }}
            >
              <Close />
            </IconButton>
          </Col>
        </Row>
      </div>
      <List>
        <BaseSelect
          label="Role"
          name="role"
          className="mb-1 select-border "
          options={roleType}
          placeholder="Role"
          handleChange={handleRoleChange}
          value={roleFilter}
        />
      </List>

      <Divider />
      <div
        style={{
          position: "sticky",
          bottom: 0,
          background: "#fff",
          zIndex: 100,
          paddingTop: "8px",
          paddingBottom: "8px",
        }}
      >
        <Row>
          <Col className="text-end">
            <BaseButton
              color="primary"
              onClick={resetFilters}
              sx={{ width: "auto" }}
            >
              Reset Filters
            </BaseButton>
          </Col>
        </Row>
      </div>
    </Box>
  );
  const resetFilters = () => {
    setRoleFilter(null);
    fetchUsers();
  };

  return (
    <>
      {showViewModal && selectedId && (
        <ViewProfile
          show={showViewModal}
          onHide={handleCloseModal}
          _id={selectedId}
          module ={"user"}
        />
      )}
      <ActiveModal
        show={showActiveModal}
        loader={isLoading}
        onYesClick={() =>
          handleUpdateUserStatus(selectedRecord || "", { isActive: dataActive })
        }
        onCloseClick={closeActiveModal}
        flag={!dataActive}
      />

      <DeleteModal
        show={showDeleteModal}
        onCloseClick={closeDeleteModal}
        onDeleteClick={() =>
          handleUpdateUserStatus(selectedRecord || "", { isDeleted: true })
        }
        loader={isLoading}
      />
      <Container fluid>
        <div className="mt-2">
          <Card>
            <Row className="fw-bold text-dark d-flex ">
              <Col
                sm={6}
                lg={6}
                md={6}
                className="flex-wrap mt-4 mb-4 d-flex align-items-center "
              >
                <div className="ml-6">
                  <button
                    // className="primary"
                    onClick={toggleDrawer("right", true)}
                    className={`btn btn-primary d-block d-md-inline-block ${
                      isMobile ? "w-[150px]" : "w-auto"
                    }`}
                  >
                    {" "}
                    <i className="mx-1 fa fa-filter"></i>Filters
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
              </Col>
              <Col sm={6} lg={6} md={6} className="mt-4 mb-4">
                <div className="items-end justify-end mr-6 d-flex">
                  <div className="mr-3">
                    <input
                      id="search-bar-0"
                      className="h-10 form-control search"
                      placeholder="Search..."
                      onChange={handleSearchChange}
                      value={searchAll}
                    />
                  </div>
                  <BaseButton color="primary" onClick={handleAdd}>
                    + Add
                  </BaseButton>
                </div>
              </Col>
            </Row>
          </Card>
          <Card className="mt-3">
            <div className="pt-5 pl-5 text-2xl font-bold">User Management</div>
            {tableLoader ? (
              <div className="m-3">
                <Skeleton count={10} />
              </div>
            ) : (
              <div className="bg-white ">
                {users?.length > 0 ? (
                  <Card.Body>
                    <TableContainer
                      // isHeaderTitle="Users"
                      columns={columns}
                      data={users}
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
                  </Card.Body>
                ) : (
                  <div className="py-4 text-center">
                    <i className="ri-search-line d-block fs-1 text-success"></i>
                    {handleResponse?.dataNotFound}
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>
      </Container>
    </>
  );
};

export default UserManagement;
