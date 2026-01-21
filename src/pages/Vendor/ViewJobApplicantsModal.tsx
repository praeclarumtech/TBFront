/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useMemo } from "react";
import { Modal, Skeleton, Tabs } from "antd";
import TableContainer from "components/BaseComponents/TableContainer";
import { Tooltip as ReactTooltip } from "react-tooltip";
import * as Tooltip from "@radix-ui/react-tooltip";
import ViewModal from "../applicant/ViewApplicant";
import SendEmailModal from "components/Job/SendEmailModal";
import {
  errorHandle,
  getCurrentUserRole,
  dynamicFind,
} from "utils/commonFunctions";
import { getJobApplicants, getJobInvitedApplicants } from "api/apiJob";
import { BaseSelect } from "components/BaseComponents/BaseSelect";
import { SelectedOption } from "interfaces/applicant.interface";
import appConstants from "constants/constant";
import { updateStageVendor, updateStatusVendor } from "api/apiVendor";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ViewJobApplicantsModalProps {
  show: boolean;
  onHide: () => void;
  jobId: string;
  jobTitle?: string;
}

const ViewJobApplicantsModal: React.FC<ViewJobApplicantsModalProps> = ({
  show,
  onHide,
  jobId,
  jobTitle,
}) => {
  const [applicant, setApplicant] = useState<any[]>([]);
  const [tableLoader, setTableLoader] = useState(false);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [activeTab, setActiveTab] = useState<"applied" | "invited">("applied");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 50,
    limit: 50,
  });
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedApplicantId, setSelectedApplicantId] = useState<string>("");
  const [selectedApplicantForEmail, setSelectedApplicantForEmail] = useState<{
    id: string;
    name: string;
    email: string;
    status?: string;
  } | null>(null);
  const [sourcePage, setSourcePage] = useState<string>("vendor");
  const [jobTitleState, setJobTitleState] = useState<string>("");
  const [jobDetails, setJobDetails] = useState<{
    job_id?: string;
    job_subject?: string;
    job_type?: string;
    job_location?: string;
  } | null>(null);
  const currentRole = getCurrentUserRole();
  const isAdmin = currentRole === "admin";
  const isClient = currentRole === "client";

  const { interviewStageOptions, statusOptions } = appConstants;

  const truncateText = {
    maxWidth: "200px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  };

  const toolipComponents = {
    backgroundColor: "#624bff",
    color: "white",
    padding: "5px 10px",
    borderRadius: "4px",
    fontSize: "12px",
  };

  const customStyles = {
    control: (base: any) => ({
      ...base,
      minHeight: "38px",
      width: "100%",
    }),
  };

  useEffect(() => {
    if (show && jobId) {
      fetchApplicants();
    }
    if (!show) {
      // Reset to applied tab when modal closes
      setActiveTab("applied");
      setPagination({ pageIndex: 0, pageSize: 50, limit: 50 });
    }
  }, [show, jobId, pagination, activeTab]);

  const handleTabChange = (key: string) => {
    setActiveTab(key as "applied" | "invited");
    setPagination({ pageIndex: 0, pageSize: 50, limit: 50 });
  };

  const fetchApplicants = async () => {
    if (!jobId) return;

    setTableLoader(true);
    setApplicant([]);
    setLoading(true);

    try {
      const params = {
        page: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
        limit: pagination.limit,
      };

      const res = activeTab === "invited" 
        ? await getJobInvitedApplicants(jobId, params)
        : await getJobApplicants(jobId, params);

      if (res?.success && res?.data) {
        // Set job details from response
        if (res.data.job) {
          setJobDetails(res.data.job);
          setJobTitleState(res.data.job.job_subject || "");
        } else if (jobTitle) {
          setJobTitleState(jobTitle);
        }

        // Set applicants array - handle different response formats
        if (activeTab === "invited") {
          // Normalize invited applicants data to match applied applicants structure
          const normalizedApplicants = (res.data.applicants || []).map((app: any) => ({
            ...app,
            status: app.applicationStatus?.status || null,
            interviewStage: app.applicationStatus?.interviewStage || null,
            score: app.applicationStatus?.score ?? null,
            appliedRole: app.currentCompanyDesignation || "",
            isActive: app.hasApplied, // Only allow editing if they've applied
          }));
          setApplicant(normalizedApplicants);
          setTotalRecords(res.data.totalRecords || 0);
        } else {
          setApplicant(res.data.applications || []);
          setTotalRecords(res.data.pagination?.totalCount || 0);
        }
      }
    } catch (error: any) {
      errorHandle(error);
    } finally {
      setTableLoader(false);
      setLoading(false);
    }
  };

  const handleView = (id: string, source: string) => {
    setSelectedApplicantId(id);
    setSourcePage(source);
    setShowViewModal(true);
  };

  const handleCloseModal = () => {
    setShowViewModal(false);
  };

  const columns = useMemo(() => {
    const baseColumns: any[] = [
      {
        header: "Applicant Name",
        accessorKey: "name",
        cell: (info: any) => {
          const nameObj = info.row.original?.name || {};
          const firstName = nameObj.firstName || "";
          const middleName = nameObj.middleName || "";
          const lastName = nameObj.lastName || "";
          const fullName = `${firstName} ${middleName} ${lastName}`.trim();

          if (isAdmin) {
            return (
              <>
                <div
                  style={truncateText}
                  className="text-[#624bff] underline cursor-pointer truncated-text hover:text-[#3f3481]"
                  title={fullName}
                  onClick={() => handleView(info.row.original._id, "vendor")}
                >
                  {fullName}
                </div>
                <ReactTooltip
                  place="top"
                  variant="info"
                  content={fullName}
                  style={toolipComponents}
                />
              </>
            );
          }

          return (
            <div style={truncateText} title={fullName}>
              {fullName}
            </div>
          );
        },
        filterFn: "fuzzy",
        enableColumnFilter: false,
      },
    ];

    if (isAdmin) {
      baseColumns.push({
        header: "Email",
        accessorKey: "email",
        cell: (info: any) => {
          const email = info.row.original?.email || "-";
          return (
            <div style={truncateText} title={email}>
              {email}
            </div>
          );
        },
        enableColumnFilter: false,
      });
    }

    baseColumns.push(
      {
        header: "Skills",
        accessorKey: "appliedSkills",
        cell: (cell: any) => (
          <div
            className="truncated-text"
            style={truncateText}
            title={cell.row.original.appliedSkills?.join(", ")}
          >
            {cell.row.original.appliedSkills?.join(", ") || "-"}
          </div>
        ),
        enableColumnFilter: false,
      },
      {
        header: "Role",
        accessorKey: "appliedRole",
        enableColumnFilter: false,
      },
      {
        header: "Total Exp",
        accessorKey: "totalExperience",
        enableColumnFilter: false,
        cell: (cell: any) => {
          return cell.row.original.totalExperience
            ? `${cell.row.original.totalExperience} years`
            : "-";
        },
      },
      {
        header: "Applicant Status",
        accessorKey: "status",
        cell: (cell: any) => (
          <div style={{ maxWidth: 250, minWidth: 180 }}>
            <BaseSelect
              name="status"
              styles={customStyles}
              options={statusOptions}
              value={dynamicFind(statusOptions, cell.row.original.status)}
              handleChange={(selectedOption: SelectedOption) => {
                const updatedApplicant = [...applicant];
                const applicantIndex = updatedApplicant.findIndex(
                  (item) => item._id === cell.row.original._id
                );
                if (applicantIndex > -1) {
                  const originalStatus =
                    updatedApplicant[applicantIndex].status;
                  updatedApplicant[applicantIndex].status =
                    selectedOption.value;
                  setApplicant(updatedApplicant);
                  updateStatusVendor(
                    { status: selectedOption.value },
                    cell.row.original._id
                  )
                    .then(() => {
                      toast.success("Applicant status updated successfully!");
                    })
                    .catch((error: any) => {
                      errorHandle(error);
                      // Revert the change on error using functional update
                      setApplicant((prevApplicant) => {
                        const revertedApplicant = [...prevApplicant];
                        const revertIndex = revertedApplicant.findIndex(
                          (item) => item._id === cell.row.original._id
                        );
                        if (revertIndex > -1) {
                          revertedApplicant[revertIndex].status =
                            originalStatus;
                        }
                        return revertedApplicant;
                      });
                    });
                }
              }}
              isDisabled={!cell?.row?.original?.isActive}
            />
          </div>
        ),
        enableColumnFilter: false,
      },
      {
        header: "Interview Stage",
        accessorKey: "interviewStage",
        cell: (cell: any) => (
          <div style={{ maxWidth: 250, minWidth: 180 }}>
            <BaseSelect
              name="interviewStage"
              styles={customStyles}
              options={interviewStageOptions}
              value={dynamicFind(
                interviewStageOptions,
                cell.row.original.interviewStage
              )}
              handleChange={(selectedOption: SelectedOption) => {
                const updatedApplicant = [...applicant];
                const applicantIndex = updatedApplicant.findIndex(
                  (item) => item._id === cell.row.original._id
                );
                if (applicantIndex > -1) {
                  const originalStage =
                    updatedApplicant[applicantIndex].interviewStage;
                  updatedApplicant[applicantIndex].interviewStage =
                    selectedOption.value;
                  setApplicant(updatedApplicant);
                  updateStageVendor(
                    { interviewStage: selectedOption.value },
                    cell.row.original._id
                  )
                    .then(() => {
                      toast.success(
                        "Applicant Interview Stage updated successfully!"
                      );
                    })
                    .catch((error: any) => {
                      errorHandle(error);
                      setApplicant((prevApplicant) => {
                        const revertedApplicant = [...prevApplicant];
                        const revertIndex = revertedApplicant.findIndex(
                          (item) => item._id === cell.row.original._id
                        );
                        if (revertIndex > -1) {
                          revertedApplicant[revertIndex].interviewStage =
                            originalStage;
                        }
                        return revertedApplicant;
                      });
                    });
                }
              }}
              isDisabled={!cell?.row?.original?.isActive}
            />
          </div>
        ),
        enableColumnFilter: false,
      },
      {
        header: "Score",
        accessorKey: "score",
        cell: (info: any) => {
          const score = info.row.original?.score;
          return score !== undefined && score !== null ? score : "-";
        },
        enableColumnFilter: false,
      }
    );

    if (isClient) {
      baseColumns.push({
        header: "Vendor",
        accessorKey: "vendor_id",
        cell: (info: any) => {
          const vendor = info.row.original?.vendor_id;
          if (!vendor) return "-";

          const vendorName = `${vendor.firstName || ""} ${
            vendor.lastName || ""
          }`.trim();
          const companyName = vendor.vendorProfileId?.company_name;

          return (
            <div className="flex items-center gap-2">
              <div style={truncateText}>
                <span title={vendorName}>{vendorName || "-"}</span>
                {companyName && (
                  <span
                    className="block text-xs text-gray-500"
                    title={companyName}
                  >
                    ({companyName})
                  </span>
                )}
              </div>
            </div>
          );
        },
        enableColumnFilter: false,
      });
    }

    baseColumns.push({
      header: "Action",
      cell: ({ row }: any) => {
        const handleEmailClick = () => {
          const nameObj = row.original?.name || {};
          const firstName = nameObj.firstName || "";
          const middleName = nameObj.middleName || "";
          const lastName = nameObj.lastName || "";
          const fullName = `${firstName} ${middleName} ${lastName}`.trim();
          const email = row.original?.email || "";
          const status = row.original?.status || "";

          setSelectedApplicantForEmail({
            id: row.original._id,
            name: fullName || "Applicant",
            email: email,
            status: status,
          });
          setShowEmailModal(true);
        };

        return (
          <div className="flex gap-2">
            {isAdmin && (
              <Tooltip.Provider delayDuration={50}>
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <button
                      className="btn btn-sm btn-soft-success bg-primary"
                      onClick={() => handleView(row.original._id, "vendor")}
                      disabled={!row.original.isActive}
                    >
                      <i className="text-white ri-eye-fill" />
                    </button>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      side="bottom"
                      sideOffset={4}
                      className="px-2 py-1 text-sm text-white rounded shadow-lg bg-primary"
                    >
                      View Details
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              </Tooltip.Provider>
            )}

            <Tooltip.Provider delayDuration={50}>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <button
                    className="btn btn-sm btn-soft-success bg-primary"
                    onClick={handleEmailClick}
                  >
                    <i className="text-white ri-mail-line" />
                  </button>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    side="bottom"
                    sideOffset={4}
                    className="px-2 py-1 text-sm text-white rounded shadow-lg bg-blue-500"
                  >
                    Send Email
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </Tooltip.Provider>
          </div>
        );
      },
    });

    // Add "Has Applied" column for invited tab
    if (activeTab === "invited") {
      // Insert after Skills column (index 2 or 3 depending on admin)
      const hasAppliedColumn = {
        header: "Applied",
        accessorKey: "hasApplied",
        cell: (info: any) => {
          const hasApplied = info.row.original?.hasApplied;
          return (
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${
                hasApplied
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {hasApplied ? "Yes" : "No"}
            </span>
          );
        },
        enableColumnFilter: false,
      };
      // Insert before "Applicant Status" column
      const statusIndex = baseColumns.findIndex(
        (col) => col.header === "Applicant Status"
      );
      if (statusIndex > -1) {
        baseColumns.splice(statusIndex, 0, hasAppliedColumn);
      }
    }

    return baseColumns;
  }, [isAdmin, isClient, applicant, activeTab]);

  if (!show) return null;

  return (
    <>
      {showViewModal && selectedApplicantId && (
        <ViewModal
          show={showViewModal}
          onHide={handleCloseModal}
          applicantId={selectedApplicantId}
          source={sourcePage}
        />
      )}

      <SendEmailModal
        show={showEmailModal}
        onHide={() => {
          setShowEmailModal(false);
          setSelectedApplicantForEmail(null);
        }}
        jobId={jobId}
        jobTitle={jobTitleState || jobTitle}
        excludeJobTemplates={true}
        singleApplicant={selectedApplicantForEmail || undefined}
      />

      <Modal
        open={show}
        onCancel={onHide}
        footer={null}
        width="95vw"
        style={{ maxWidth: 1200 }}
        centered
        title={
          <span className="text-base sm:text-lg font-bold">
            {jobTitleState
              ? `Applicants for ${jobTitleState}`
              : "Job Applicants"}
          </span>
        }
      >
        {jobDetails && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <span className="text-xs text-gray-500 uppercase font-semibold">
                  Job ID
                </span>
                <p className="text-sm font-medium text-gray-800">
                  {jobDetails.job_id || "-"}
                </p>
              </div>
              <div>
                <span className="text-xs text-gray-500 uppercase font-semibold">
                  Job Title
                </span>
                <p className="text-sm font-medium text-gray-800">
                  {jobDetails.job_subject || "-"}
                </p>
              </div>
              <div>
                <span className="text-xs text-gray-500 uppercase font-semibold">
                  Job Type
                </span>
                <p className="text-sm font-medium text-gray-800 capitalize">
                  {jobDetails.job_type || "-"}
                </p>
              </div>
              <div>
                <span className="text-xs text-gray-500 uppercase font-semibold">
                  Location
                </span>
                <p className="text-sm font-medium text-gray-800">
                  {jobDetails.job_location || "-"}
                </p>
              </div>
            </div>
          </div>
        )}

        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          className="mb-4"
          items={[
            {
              key: "applied",
              label: "Applied Applicants",
            },
            {
              key: "invited",
              label: "Invited Applicants",
            },
          ]}
        />

        {tableLoader || loading ? (
          <div className="py-4 text-center">
            <Skeleton className="mb-5 min-h-10" />
            <Skeleton />
          </div>
        ) : applicant.length > 0 ? (
          <div className="pt-4">
            <TableContainer
              isHeaderTitle={activeTab === "invited" ? "Invited Applicants" : "Applicants"}
              columns={columns}
              data={applicant}
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
          </div>
        ) : (
          <div className="pt-4 text-center">
            <i className="ri-search-line d-block fs-1 text-success"></i>
            <p className="mt-2">
              No {activeTab === "invited" ? "invited" : ""} applicants found for this job. Total Records: {totalRecords}
            </p>
          </div>
        )}
      </Modal>
    </>
  );
};

export default ViewJobApplicantsModal;
