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

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showActiveModal, setShowActiveModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null);
  const [dataActive, SetDataActive] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [tableLoader, setTableLoader] = useState(false);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 50,
  });
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
      const response = await getAllUsers();
      setUsers(response?.data?.item || []);
      setTotalRecords(response?.data?.totalRecords || 0);
    } catch (error) {
      console.error("Error fetching total applicants:", error);
    } finally {
      setTableLoader(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

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

  // const handleRowClick = (role: string) => {
  //   switch (role) {
  //     case "admin":
  //       return "purple";
  //     case "user":
  //       return "volcano";
  //     case "vendor":
  //       return "cyan";
  //     case "guest":
  //       return "magenta";
  //     case "hr":
  //       return "green";
  //     default:
  //       return "default";
  //   }
  // };

  const columns = useMemo(
    () => [
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

  return (
    <>
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
            <Row className="fw-bold text-dark d-flex align-items-center">
              <Col
                sm={12}
                lg={12}
                className="flex-wrap mt-4 mb-2 d-flex justify-content-between align-items-center "
              >
                <div className="ml-6 text-2xl font-bold">User Management</div>
              </Col>
            </Row>
            {users.length === 0 ? (
              <div className="m-3">
                <Skeleton count={10} />
              </div>
            ) : (
              // <div className="grid grid-cols-1 gap-6 p-4 sm:grid-cols-2 xl:grid-cols-3">
              //   {users.map((user: any) => (
              //     <Badge.Ribbon
              //       text={user?.role}
              //       color={handleRowClick(user?.role)}
              //     >
              //       <div
              //         key={user?._id}
              //         className="p-6 transition-all duration-200 bg-white border border-gray-100 shadow-xl rounded-2xl hover:shadow-2xl"
              //       >
              //         <h2 className="text-lg font-semibold text-gray-800 truncate">
              //           {user?.userName}
              //         </h2>
              //         <p className="mb-2 text-sm text-gray-500 break-all">
              //           {user?.email}
              //         </p>
              //         <p
              //           className={`text-sm font-semibold ${
              //             user.isActive ? "text-green-600" : "text-red-500"
              //           }`}
              //         >
              //           {user.isActive ? "Active" : "Deactive"}
              //         </p>

              //         <div className="flex flex-wrap gap-3 mt-4">
              //           <button
              //             onClick={() =>
              //               handleUpdateUserStatusModal(user._id, user.isActive)
              //             }
              //             className={`flex items-center gap-2 px-4 py-2 rounded-md text-white text-sm ${
              //               user.isActive
              //                 ? "bg-gray-600 hover:bg-gray-700"
              //                 : "bg-green-600 hover:bg-green-700"
              //             }`}
              //           >
              //             <i
              //               className={`ri-${
              //                 user.isActive ? "close-circle" : "check-line"
              //               }`}
              //             ></i>
              //             {user.isActive ? "Deactivate" : "Activate"}
              //           </button>

              //           <button
              //             onClick={() => handleDeleteUser(user._id)}
              //             disabled={isLoading}
              //             className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700"
              //           >
              //             <i className="ri-delete-bin-6-line"></i> Delete
              //           </button>
              //         </div>
              //       </div>
              //     </Badge.Ribbon>
              //   ))}
              // </div>
              <div className="pt-4 bg-white">
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
              </div>
            )}
          </Card>
        </div>
      </Container>
    </>
  );
};

export default UserManagement;
