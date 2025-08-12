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
import ViewProfile from "../UserProfile/ViewProfile";
import BaseButton from "components/BaseComponents/BaseButton";
import appConstants from "constants/constant";
import { ColumnConfig } from "interfaces/global.interface";
import { FaGlobe, FaLinkedin } from "react-icons/fa";

const { handleResponse } = appConstants;

const VendorList = () => {
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
  // const [tableLoader, setTableLoader] = useState(false);
  const [availableColumns, setAvailableColumns] = useState<ColumnConfig[]>([
    { id: "serialNumber", header: "Sr. No.", isVisible: true },
    { id: "name", header: "Name", isVisible: true },
    // { id: "lastName", header: "Last Name", isVisible: true },
    { id: "userName", header: "Username", isVisible: false },
    { id: "role", header: "Role", isVisible: false },
    { id: "email", header: "Email", isVisible: true },
    { id: "designation", header: "Designation", isVisible: true },
    { id: "phoneNumber", header: "Phone No.", isVisible: true },
    { id: "dateOfBirth", header: "Date of Birth", isVisible: false },
    {
      id: "vendorProfileId.whatsapp_number",
      header: "Whats-app no.",
      isVisible: false,
    },
    {
      id: "vendorProfileId.company_name",
      header: "Company Name",
      isVisible: true,
    },
    {
      id: "vendorProfileId.company_email",
      header: "Company Email",
      isVisible: true,
    },
    {
      id: "vendorProfileId.company_phone_number",
      header: "Company Phone No.",
      isVisible: true,
    },
    {
      id: "vendorProfileId.company_strength",
      header: "Company Strength",
      isVisible: true,
    },
    {
      id: "vendorProfileId.company_type",
      header: "Company Type",
      isVisible: true,
    },
    {
      id: "vendorProfileId.company_location",
      header: "Company Location",
      isVisible: true,
    },
    {
      id: "vendorProfileId.company_website",
      header: "Company Website",
      isVisible: false,
    },
    {
      id: "vendorProfileId.company_linkedin_profile",
      header: "Company LinkedIn",
      isVisible: false,
    },
    {
      id: "vendorProfileId.hire_resources",
      header: "Hire Resources",
      isVisible: false,
    },
    { id: "isActive", header: "Status", isVisible: true },
    { id: "createdAt", header: "Created Date", isVisible: false },
    { id: "updatedAt", header: "Updated Date", isVisible: false },
  ]);

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
      if (searchValue) {
        params.search = searchValue;
      }

      params.role = "vendor";

      const response = await getAllUsers(params);
      setUsers(response?.data?.item || response?.data?.results || []);
      setTotalRecords(response?.data?.totalRecords || 0);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error.message ||
        "Unexpected error.";
      toast.error(message);
      console.error("Error fetching total applicants:", error);
    } finally {
      setTableLoader(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [pagination.pageIndex, pagination.pageSize, searchAll]);

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

  const columns = useMemo(() => {
    const baseColumns = [
      {
        header: "Sr. No.",
        accessorKey: "serialNumber",
        id: "serialNumber",
        cell: ({ row }: any) => row.index + 1,
        enableColumnFilter: false,
      },
      {
        header: "Username",
        accessorKey: "userName",
        id: "userName",
        filterFn: "fuzzy",
        enableColumnFilter: false,
      },
      {
        header: "Role",
        accessorKey: "role",
        id: "role",
        enableColumnFilter: false,
      },
      {
        header: "Name",
        accessorKey: "firstName", // or any real field; just so TanStack maps it
        id: "name",

        cell: (info: any) => {
          const firstName = info.row.original?.firstName?.trim() || "";
          const lastName = info.row.original?.lastName?.trim() || "";
          const fullName = `${firstName} ${lastName}`.trim();

          return (
            <div
              className="text-[#624bff] underline cursor-pointer truncated-text hover:text-[#3f3481]"
              title={fullName}
              onClick={() => handleView(info?.row?.original?._id)}
            >
              {fullName || "-"}
            </div>
          );
        },
        enableColumnFilter: false,
      },
      {
        header: "Email",
        accessorKey: "email",
        id: "email",
        enableColumnFilter: false,
      },
      {
        header: "Designation",
        accessorKey: "designation",
        id: "designation",
        enableColumnFilter: false,
      },
      {
        header: "Phone no.",
        accessorKey: "phoneNumber",
        id: "phoneNumber",
        enableColumnFilter: false,
      },
      {
        header: "Whats-app no.",
        accessorKey: "vendorProfileId.whatsapp_number",
        id: "vendorProfileId.whatsapp_number",
        enableColumnFilter: false,
      },
      {
        header: "Date of brith",
        accessorKey: "dateOfBirth",
        id: "dateOfBirth",
        enableColumnFilter: false,
        cell: ({ getValue }: { getValue: () => any }) => {
          const date = getValue();
          return date ? new Date(date).toLocaleDateString() : "";
        },
      },
      {
        header: "Comapany name",
        accessorKey: "vendorProfileId.company_name",
        id: "vendorProfileId.company_name",
        enableColumnFilter: false,
      },
      {
        header: "Comapany email",
        accessorKey: "vendorProfileId.company_email",
        id: "vendorProfileId.company_email",
        enableColumnFilter: false,
      },
      {
        header: "Comapany phone no.",
        accessorKey: "vendorProfileId.company_phone_number",
        id: "vendorProfileId.company_phone_number",
        enableColumnFilter: false,
      },
      {
        header: "Comapany Type",
        accessorKey: "vendorProfileId.company_type",
        id: "vendorProfileId.company_type",
        enableColumnFilter: false,
      },
      {
        header: "Comapany Location",
        accessorKey: "vendorProfileId.company_location",
        id: "vendorProfileId.company_location",
        enableColumnFilter: false,
      },

      {
        header: "Comapany strength",
        accessorKey: "vendorProfileId.company_strength",
        id: "vendorProfileId.company_strength",
        enableColumnFilter: false,
      },
      {
        header: "Comapany Website",
        accessorKey: "vendorProfileId.company_website",
        id: "vendorProfileId.company_website",
        enableColumnFilter: false,
        cell: ({ getValue }: { getValue: () => any }) => {
          const url = getValue();
          return url ? (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline flex items-center gap-1"
            >
              <FaGlobe size={16} />
              Website
            </a>
          ) : (
            ""
          );
        },
      },
      {
        header: "Comapany LinkedIn Profile",
        accessorKey: "vendorProfileId.company_linkedin_profile",
        id: "vendorProfileId.company_linkedin_profile",
        enableColumnFilter: false,
        cell: ({ getValue }: { getValue: () => any }) => {
          const url = getValue();
          return url ? (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline flex items-center gap-1"
            >
              <FaLinkedin size={16} />
              LinkedIn
            </a>
          ) : (
            ""
          );
        },
      },
      {
        header: "Hire Resource",
        accessorKey: "vendorProfileId.hire_resources",
        id: "vendorProfileId.hire_resources",
        enableColumnFilter: false,
      },
      {
        header: "Created At.",
        accessorKey: "createdAt",
        id: "createdAt",
        enableColumnFilter: false,
        cell: ({ getValue }: { getValue: () => any }) => {
          const date = getValue();
          return date ? new Date(date).toLocaleDateString() : "";
        },
      },
      {
        header: "Updated At.",
        accessorKey: "updatedAt",
        id: "updatedAt",
        enableColumnFilter: false,
        cell: ({ getValue }: { getValue: () => any }) => {
          const date = getValue();
          return date ? new Date(date).toLocaleDateString() : "";
        },
      },
      {
        header: "Status",
        accessorKey: "isActive",
        id: "isActive",
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
    ];
    return baseColumns.filter((column) => {
      const columnConfig = availableColumns.find((c) => c.id === column.id);
      return columnConfig?.isVisible !== false;
    });
  }, [users, availableColumns]);

  const handleColumnsChange = (visibleColumns: string[]) => {
    setAvailableColumns((prev) =>
      prev.map((col) => ({
        ...col,
        isVisible: visibleColumns.includes(col.id),
      }))
    );
  };
  const handleView = (_id: string) => {
    setSelectedId(_id);
    setShowViewModal(true);
  };
  const handleCloseModal = () => {
    setShowViewModal(false);
  };

  const handleAdd = () => {
    navigate("/userprofileAdd", {
      state: {
        from: "Vendor",
      },
    });
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchAll(event.target.value);
    setPagination((prev) => ({
      ...prev,
      pageIndex: 0,
    }));
  };

  return (
    <>
      {showViewModal && selectedId && (
        <ViewProfile
          show={showViewModal}
          onHide={handleCloseModal}
          _id={selectedId}
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
                className="flex-wrap mt-4 d-flex align-items-center "
              >
                <div className="ml-6 text-2xl font-bold">Vendors</div>
              </Col>
              <Col sm={6} lg={6} md={6} className="mt-4">
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
            {tableLoader ? (
              <div className="m-3">
                <Skeleton count={10} />
              </div>
            ) : (
              <div className="pt-4 bg-white">
                {users?.length > 0 ? (
                  <Card.Body>
                    <TableContainer
                      // isHeaderTitle="Users"
                      columns={columns}
                      availableColumns={availableColumns}
                      onColumnsChange={handleColumnsChange}
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

export default VendorList;
