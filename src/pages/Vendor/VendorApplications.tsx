/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment, useEffect, useState, useMemo, useCallback } from "react";
import { Row, Col, Card, Container } from "react-bootstrap";
import { Drawer, Select, Button, Badge } from "antd";
import { FilterOutlined, ReloadOutlined } from "@ant-design/icons";
import TableContainer from "components/BaseComponents/TableContainer";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-loading-skeleton/dist/skeleton.css";
import Skeleton from "react-loading-skeleton";
import appConstants from "constants/constant";
import { capitalizeWords, getCurrentUserRole } from "utils/commonFunctions";
import { getApplicationsByRole } from "api/applicationApi";
import { getAllUsers } from "api/usersApi";
import { viewAllJob, getJobEmailRecipients } from "api/apiJob";
import BaseButton from "components/BaseComponents/BaseButton";

const { projectTitle, handleResponse, statusOptions } = appConstants;

interface Application {
  _id: string;
  job_id: string;
  job_subject: string;
  applicant_name: string;
  applicant_email: string;
  state?: string;
  status: string;
  client?: {
    name: string;
    company_name: string;
  };
  createdAt: string;
}

interface Filters {
  job_id: string;
  client_id: string;
  vendor_id: string;
  status: string;
  search: string;
}

interface DropdownOption {
  value: string;
  label: string;
}

const VendorApplications = () => {
  document.title = `Vendor Applications | ${projectTitle}`;

  const currentUserRole = getCurrentUserRole()?.toLowerCase();
  const isAdmin = currentUserRole === "admin" || currentUserRole === "hr";
  const isVendor = currentUserRole === "vendor";
  const isClient = currentUserRole === "client";

  const [applications, setApplications] = useState<Application[]>([]);
  const [tableLoader, setTableLoader] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 50,
  });
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [searchAll, setSearchAll] = useState("");
  const [filters, setFilters] = useState<Filters>({
    job_id: "",
    client_id: "",
    vendor_id: "",
    status: "",
    search: "",
  });

  // Dropdown options
  const [clientOptions, setClientOptions] = useState<DropdownOption[]>([]);
  const [vendorOptions, setVendorOptions] = useState<DropdownOption[]>([]);
  const [jobOptions, setJobOptions] = useState<DropdownOption[]>([]);
  const [dropdownLoading, setDropdownLoading] = useState(false);

  const activeFilterCount = useMemo(() => {
    return Object.values(filters).filter((v) => v !== "").length;
  }, [filters]);

  const hasActiveFilters = useMemo(() => {
    return activeFilterCount > 0 || searchAll !== "";
  }, [activeFilterCount, searchAll]);

  // Fetch dropdown options
  const fetchDropdownOptions = async () => {
    setDropdownLoading(true);
    try {
      // For Admin - use getAllUsers API
      if (isAdmin) {
        // Fetch clients
        const clientsResponse = await getAllUsers({
          role: "client",
          limit: 100,
        });
        const clients =
          clientsResponse?.data?.item || clientsResponse?.data?.results || [];
        setClientOptions(
          clients.map((client: any) => ({
            value: client._id,
            label:
              `${client.firstName || ""} ${client.lastName || ""}`.trim() ||
              client.email,
          }))
        );

        // Fetch vendors
        const vendorsResponse = await getAllUsers({
          role: "vendor",
          limit: 100,
        });
        const vendors =
          vendorsResponse?.data?.item || vendorsResponse?.data?.results || [];
        setVendorOptions(
          vendors.map((vendor: any) => ({
            value: vendor._id,
            label:
              `${vendor.firstName || ""} ${vendor.lastName || ""}`.trim() ||
              vendor.email,
          }))
        );
      } else {
        // For Vendor/Client - use getJobEmailRecipients API
        if (isVendor) {
          // Fetch clients using email recipients API
          try {
            const clientsResponse = await getJobEmailRecipients("client", {
              limit: 100,
            });
            const clients =
              clientsResponse?.data?.clients || clientsResponse?.data || [];
            setClientOptions(
              (Array.isArray(clients) ? clients : []).map((client: any) => ({
                value: client._id || client.id,
                label:
                  client.name ||
                  `${client.firstName || ""} ${client.lastName || ""}`.trim() ||
                  client.email,
              }))
            );
          } catch (error) {
            console.error("Failed to fetch clients:", error);
          }
        }

        if (isClient) {
          // Fetch vendors using email recipients API
          try {
            const vendorsResponse = await getJobEmailRecipients("vendor", {
              limit: 100,
            });
            const vendors =
              vendorsResponse?.data?.vendors ||
              vendorsResponse?.data?.results ||
              vendorsResponse?.data ||
              [];
            setVendorOptions(
              (Array.isArray(vendors) ? vendors : []).map((vendor: any) => ({
                value: vendor._id || vendor.id,
                label:
                  vendor.name ||
                  `${vendor.firstName || ""} ${vendor.lastName || ""}`.trim() ||
                  vendor.email,
              }))
            );
          } catch (error) {
            console.error("Failed to fetch vendors:", error);
          }
        }
      }

      // Fetch jobs
      const jobsResponse = await viewAllJob({ limit: 100 });
      const jobs =
        jobsResponse?.data?.item ||
        jobsResponse?.data?.results ||
        jobsResponse?.data ||
        [];
      setJobOptions(
        (Array.isArray(jobs) ? jobs : []).map((job: any) => ({
          value: job._id,
          label: `${job.job_id || ""} - ${job.job_subject || ""}`.trim(),
        }))
      );
    } catch (error: any) {
      console.error("Failed to fetch dropdown options:", error);
    } finally {
      setDropdownLoading(false);
    }
  };

  const fetchApplications = useCallback(async () => {
    setTableLoader(true);
    try {
      const params: any = {
        role: "vendor",
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
      };

      if (filters.job_id) params.job_id = filters.job_id;
      if (filters.client_id) params.client_id = filters.client_id;
      if (filters.vendor_id) params.vendor_id = filters.vendor_id;
      if (filters.status) params.status = filters.status;
      if (searchAll) params.search = searchAll;

      const response = await getApplicationsByRole(params);
      setApplications(response?.data?.applications || []);
      setTotalRecords(
        response?.data?.pagination?.totalCount ||
          response?.data?.pagination?.total ||
          0
      );
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to fetch applications"
      );
    } finally {
      setTableLoader(false);
    }
  }, [pagination.pageIndex, pagination.pageSize, filters, searchAll]);

  useEffect(() => {
    fetchDropdownOptions();
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  // Handle filter change - immediately apply
  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const handleResetFilters = () => {
    setFilters({
      job_id: "",
      client_id: "",
      vendor_id: "",
      status: "",
      search: "",
    });
    setSearchAll("");
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    setDrawerVisible(false);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchAll(event.target.value);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const getStatusColor = (status: string) => {
    const normalizedStatus = status?.toLowerCase();
    const colors: Record<string, string> = {
      applied: "info",
      "in progress": "warning",
      shortlisted: "primary",
      rejected: "danger",
      selected: "success",
      "on hold": "warning",
      onboarded: "success",
      leaved: "secondary",
    };
    return colors[normalizedStatus] || "secondary";
  };

  const columns = useMemo(
    () => [
      {
        header: "Sr. No.",
        accessorKey: "serialNumber",
        id: "serialNumber",
        cell: ({ row }: any) =>
          pagination.pageIndex * pagination.pageSize + row.index + 1,
        enableColumnFilter: false,
      },
      {
        header: "Job ID",
        accessorKey: "job_id",
        id: "job_id",
        cell: ({ row }: any) => (
          <span className="font-medium text-primary">
            {row.original.job_id || "-"}
          </span>
        ),
        enableColumnFilter: false,
      },
      {
        header: "Job Title",
        accessorKey: "job_subject",
        id: "job_subject",
        cell: ({ row }: any) => (
          <div
            className="max-w-[200px] truncate"
            title={row.original.job_subject}
          >
            {row.original.job_subject || "-"}
          </div>
        ),
        enableColumnFilter: false,
      },
      {
        header: "Applicant Name",
        accessorKey: "applicant_name",
        id: "applicant_name",
        cell: ({ row }: any) => row.original.applicant_name || "-",
        enableColumnFilter: false,
      },
      ...(isAdmin
        ? [
            {
              header: "Applicant Email",
              accessorKey: "applicant_email",
              id: "applicant_email",
              cell: ({ row }: any) => (
                <a
                  href={`mailto:${row.original.applicant_email}`}
                  className="text-primary hover:underline"
                >
                  {row.original.applicant_email || "-"}
                </a>
              ),
              enableColumnFilter: false,
            },
          ]
        : []),
      {
        header: "Client",
        accessorKey: "client",
        id: "client",
        cell: ({ row }: any) => {
          const client = row.original.client;
          if (!client || (!client.name && !client.company_name)) return "-";
          return (
            <div>
              <div className="font-medium">{client.name || "-"}</div>
              {client.company_name && (
                <div className="text-xs text-gray-500">
                  {client.company_name}
                </div>
              )}
            </div>
          );
        },
        enableColumnFilter: false,
      },
      {
        header: "Status",
        accessorKey: "status",
        id: "status",
        cell: ({ row }: any) => {
          const status = row.original.status;
          return status ? (
            <span className={`badge bg-${getStatusColor(status)}`}>
              {capitalizeWords(status)}
            </span>
          ) : (
            "-"
          );
        },
        enableColumnFilter: false,
      },
      {
        header: "Applied Date",
        accessorKey: "createdAt",
        id: "createdAt",
        cell: ({ row }: any) => {
          const date = row.original.createdAt;
          return date ? new Date(date).toLocaleDateString() : "-";
        },
        enableColumnFilter: false,
      },
    ],
    [pagination.pageIndex, pagination.pageSize]
  );

  return (
    <Fragment>
      <Drawer
        title="Filter Applications"
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={360}
        footer={
          <div className="flex justify-end gap-2">
            <Button onClick={handleResetFilters} icon={<ReloadOutlined />}>
              Reset All
            </Button>
            <Button type="primary" onClick={() => setDrawerVisible(false)}>
              Close
            </Button>
          </div>
        }
      >
        <div className="flex flex-col gap-4">
          {/* Job Dropdown */}
          <div>
            <label className="block mb-1 text-sm font-medium">Job</label>
            <Select
              className="w-full"
              placeholder="Select Job"
              value={filters.job_id || undefined}
              onChange={(value) => handleFilterChange("job_id", value || "")}
              options={[{ value: "", label: "All Jobs" }, ...jobOptions]}
              loading={dropdownLoading}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              allowClear
            />
          </div>

          {/* Client Dropdown - Show for Vendor and Admin */}
          {(isVendor || isAdmin) && (
            <div>
              <label className="block mb-1 text-sm font-medium">Client</label>
              <Select
                className="w-full"
                placeholder="Select Client"
                value={filters.client_id || undefined}
                onChange={(value) =>
                  handleFilterChange("client_id", value || "")
                }
                options={[
                  { value: "", label: "All Clients" },
                  ...clientOptions,
                ]}
                loading={dropdownLoading}
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                allowClear
              />
            </div>
          )}

          {/* Vendor Dropdown - Show for Admin and Client */}
          {(isAdmin || isClient) && (
            <div>
              <label className="block mb-1 text-sm font-medium">Vendor</label>
              <Select
                className="w-full"
                placeholder="Select Vendor"
                value={filters.vendor_id || undefined}
                onChange={(value) =>
                  handleFilterChange("vendor_id", value || "")
                }
                options={[
                  { value: "", label: "All Vendors" },
                  ...vendorOptions,
                ]}
                loading={dropdownLoading}
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                allowClear
              />
            </div>
          )}

          {/* Status Dropdown */}
          <div>
            <label className="block mb-1 text-sm font-medium">Status</label>
            <Select
              className="w-full"
              placeholder="Select Status"
              value={filters.status || undefined}
              onChange={(value) => handleFilterChange("status", value || "")}
              options={statusOptions}
              allowClear
            />
          </div>
        </div>
      </Drawer>

      <Container fluid>
        <div className="mt-2 mb-2">
          <Card>
            <Row className="fw-bold text-dark d-flex">
              <Col
                sm={6}
                lg={6}
                md={6}
                className="flex-wrap mt-4 d-flex align-items-center"
              >
                <div className="ml-6 text-2xl font-bold">
                  Vendor Applications
                </div>
              </Col>
              <Col sm={6} lg={6} md={6} className="mt-4">
                <div className="items-end justify-end mr-6 d-flex gap-3 flex-nowrap">
                  {/* Search Bar */}
                  <div
                    className="flex-shrink-0"
                    style={{ minWidth: "200px", width: "200px" }}
                  >
                    <input
                      id="search-bar-0"
                      className="h-10 form-control search w-100"
                      placeholder="Search..."
                      onChange={handleSearchChange}
                      value={searchAll}
                    />
                  </div>

                  {/* Filter Button */}
                  <Badge count={activeFilterCount} size="small">
                    <BaseButton
                      color="primary"
                      className="flex items-center gap-2"
                      onClick={() => setDrawerVisible(true)}
                    >
                      <FilterOutlined />
                      Filters
                    </BaseButton>
                  </Badge>

                  {/* Reset Filter Button - Show when filters are active */}
                  {hasActiveFilters && (
                    <BaseButton
                      color="danger"
                      className="flex items-center gap-2"
                      onClick={handleResetFilters}
                    >
                      <ReloadOutlined />
                      Reset
                    </BaseButton>
                  )}
                </div>
              </Col>
            </Row>
            {tableLoader ? (
              <div className="m-3">
                <Skeleton count={10} />
              </div>
            ) : (
              <div className="pt-2 bg-white">
                {applications?.length > 0 ? (
                  <Card.Body>
                    <TableContainer
                      columns={columns}
                      data={applications}
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
                    {handleResponse?.dataNotFound || "No applications found"}
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>
      </Container>
    </Fragment>
  );
};

export default VendorApplications;
