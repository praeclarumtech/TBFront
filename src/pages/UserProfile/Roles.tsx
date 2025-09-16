/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useMemo, useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";

import Skeleton from "react-loading-skeleton";
import TableContainer from "components/BaseComponents/TableContainer";
import * as Tooltip from "@radix-ui/react-tooltip";
import { useNavigate } from "react-router-dom";
import BaseButton from "components/BaseComponents/BaseButton";
import appConstants from "constants/constant";

import { deleteRole, getRole, updateRole } from "api/roleApi";
import AddRole from "./AddRole";
import { capitalizeWords, getCurrentUserRole } from "utils/commonFunctions";
import ViewProfile from "./ViewProfile";
import { UserRole } from "interfaces/role.interface";
import { Switch } from "antd";
import CheckOutlined from "@ant-design/icons/lib/icons/CheckOutlined";
import { CloseOutlined } from "@ant-design/icons";
import ActiveModal from "components/BaseComponents/ActiveModal";
import { toast } from "react-toastify";
import { AnyObject } from "yup";
import DeleteModal from "components/BaseComponents/DeleteModal";

const { Modules, projectTitle, handleResponse } = appConstants;
// type Anchor = "top" | "right" | "bottom";
const Roles = () => {
  document.title = Modules.Role + " | " + projectTitle;
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);
  const [dataActive, SetDataActive] = useState(true);
  const [showActiveModal, setShowActiveModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [roles, setRoles] = useState<UserRole | null>(null);
  const [tableLoader, setTableLoader] = useState(false);
  const navigate = useNavigate();
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 50,
  });
  // const [searchAll, setSearchAll] = useState<string>("");
  // const [state, setState] = React.useState({
  //   right: false,
  // });
  // const isMobile = window.innerWidth <= 767;
  const [showAddRoleModal, setShowAddRoleModal] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [totalRecords, setTotalRecords] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const currentRole = getCurrentUserRole();
  // const toggleDrawer =
  //   (anchor: Anchor, open: boolean) =>
  //   (event: React.KeyboardEvent | React.MouseEvent) => {
  //     if (
  //       event.type === "keydown" &&
  //       ((event as React.KeyboardEvent).key === "Tab" ||
  //         (event as React.KeyboardEvent).key === "Shift")
  //     ) {
  //       return;
  //     }

  //     setState({ ...state, [anchor]: open });
  //   };

  const fetchRoles = async () => {
    setTableLoader(true);
    try {
      const res = await getRole();
      setRoles(res?.data);
      setTotalRecords(res?.data?.length || 0);
    } catch (error) {
      console.error("Error fetching roles", error);
    } finally {
      setTableLoader(false);
    }
  };
  const handleDeleteRole = async (_id: any) => {
    setTableLoader(true);
    try {
      const res = await deleteRole({ _id });
      if (res.success === true) {
        toast.success(res?.message);
      }
    } catch (error: any) {
      console.log("error in delete", error);
      toast.error(error?.response?.data?.message);
    } finally {
      setTableLoader(false);
      setShowDeleteModal(false);
      fetchRoles();
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleAssign = (
    roleId: string,
    roleName: string,
    accessModules: string[]
  ) => {
    navigate("/permission", {
      state: { _id: roleId, roleName, accessModules },
    });
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
        header: "Role Name",
        accessorKey: "name",
        cell: ({ cell }: any) => {
          const name = cell.getValue();
          const finalName = capitalizeWords(name);
          return finalName;
        },

        enableColumnFilter: false,
      },
      {
        header: "Assign Functionality to Permission",
        enableColumnFilter: false,
        cell: ({ row }: { row: any }) => (
          <span
            onClick={() =>
              handleAssign(
                row.original._id,
                row.original.name,
                row.original.accessModules
              )
            }
            className="flex items-center gap-2 text-blue-500 hover:text-blue-600 transition-colors text-sm font-medium cursor-pointer "
          >
            <span className="text-lg">+</span>
            Assign
          </span>
        ),
      },
      {
        header: "Status",
        accessorKey: "status",
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
                    onClick={() => handleUpdate(row?.original?._id)}
                    disabled={!row.original.status || currentRole !== "admin"}
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
                    onClick={() => handleDelete(row?.original?._id)}
                    disabled={!row.original.status || currentRole !== "admin"}
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
    [roles]
  );

  const handleView = (_id: any) => {
    setSelectedId(_id);
    setShowViewModal(true);
  };
  const handleDelete = (_id: any) => {
    setSelectedId(_id);
    setShowDeleteModal(true);
  };
  const handleCloseModal = () => {
    setShowViewModal(false);
  };

  // const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setSearchAll(event.target.value);
  //   setPagination((prev) => ({
  //     ...prev,
  //     pageIndex: 0,
  //   }));
  // };

  const handleUpdateUserStatusModal = (id: any, isActive: any) => {
    setSelectedRecord(id);
    console.log("first", id);
    SetDataActive(!isActive);
    setShowActiveModal(true);
  };

  const handleUpdateUserStatus = async (id: any, value: AnyObject) => {
    setIsLoading(true);
    await updateRole(id, value)
      .then((res) => {
        if (res?.success === true && res.statusCode === 200) {
          toast.success(res?.message);
          setShowActiveModal(false);
          fetchRoles();
        } else {
          toast.error(res?.message);
        }
      })
      .catch((err) => {
        toast.error(err?.message);
        setShowActiveModal(false);
      })
      .finally(() => {
        setIsLoading(false);
        setShowActiveModal(false);
      });
  };
  const handleAdd = () => {
    setEditingRoleId(null); // Clear any editing ID for "Add" mode
    setShowAddRoleModal(true); // Show the modal
  };

  const handleUpdate = (_id: any) => {
    setEditingRoleId(_id);
    setShowAddRoleModal(true);
  };

  const handleHideModal = () => {
    setShowAddRoleModal(false);
    setEditingRoleId(null); // Clear editing ID when closing
  };
  const closeActiveModal = () => {
    setShowActiveModal(false);
  };
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };

  return (
    <>
      {showViewModal && selectedId && (
        <ViewProfile
          show={showViewModal}
          onHide={handleCloseModal}
          _id={selectedId}
          module={"roles"}
        />
      )}
      <ActiveModal
        show={showActiveModal}
        loader={isLoading}
        onYesClick={() =>
          handleUpdateUserStatus(selectedRecord || "", {
            status: dataActive,
          })
        }
        onCloseClick={closeActiveModal}
        flag={!dataActive}
      />

      <DeleteModal
        show={showDeleteModal}
        onCloseClick={closeDeleteModal}
        onDeleteClick={() => handleDeleteRole(selectedId)}
        loader={tableLoader}
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
                {/* <div className="ml-6">
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
                </div> */}
              </Col>
              <Col sm={6} lg={6} md={6} className="mt-4 mb-4">
                <div className="items-end justify-end mr-6 d-flex">
                  {/* <div className="mr-3">
                    <input
                      id="search-bar-0"
                      className="h-10 form-control search"
                      placeholder="Search..."
                      onChange={handleSearchChange}
                      value={searchAll}
                    />
                  </div> */}
                  <BaseButton color="primary" onClick={handleAdd}>
                    + Add
                  </BaseButton>
                  <AddRole
                    show={showAddRoleModal}
                    onHide={handleHideModal}
                    _id={editingRoleId}
                  />
                </div>
              </Col>
            </Row>
          </Card>

          <Card className="mt-3">
            <div className="pt-5 pl-5 text-2xl font-bold">Roles</div>
            {tableLoader ? (
              <div className="m-3">
                <Skeleton count={10} />
              </div>
            ) : (
              <div className="bg-white ">
                {roles ? (
                  <Card.Body>
                    <TableContainer
                      // isHeaderTitle="Users"
                      columns={columns}
                      data={roles}
                      totalRecords={totalRecords}
                      customPageSize={50}
                      theadClass="table-light text-muted"
                      SearchPlaceholder="Search..."
                      tableClass="!text-nowrap !mb-0 !responsive !table-responsive-sm !table-hover !table-outline-none !mb-0"
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

export default Roles;
