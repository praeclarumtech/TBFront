/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useMemo } from "react";
import { Modal, Skeleton } from "antd";
import TableContainer from "components/BaseComponents/TableContainer";
import { Tooltip as ReactTooltip } from "react-tooltip";
import * as Tooltip from "@radix-ui/react-tooltip";
import ViewModal from "../applicant/ViewApplicant";
import { errorHandle, getCurrentUserRole } from "utils/commonFunctions";
import { getJobApplicants } from "api/apiJob";

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
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 50,
    limit: 50,
  });
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedApplicantId, setSelectedApplicantId] = useState<string>("");
  const [sourcePage, setSourcePage] = useState<string>("vendor");
  const [jobTitleState, setJobTitleState] = useState<string>("");
  const currentRole = getCurrentUserRole();
  const isAdmin = currentRole === "admin";

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

  useEffect(() => {
    if (show && jobId) {
      fetchApplicants();
    }
  }, [show, jobId, pagination]);

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

      const res = await getJobApplicants(jobId, params);

      if (res?.success && res?.data) {
        // Set job title from response or prop
        if (res.data.job?.job_subject) {
          setJobTitleState(res.data.job.job_subject);
        } else if (jobTitle) {
          setJobTitleState(jobTitle);
        }

        // Set applicants array
        setApplicant(res.data.applications || []);

        // Set pagination info
        setTotalRecords(res.data.pagination?.totalCount || 0);
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

    // Add other columns
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
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: (info: any) => {
          const status = info.row.original?.status || "-";
          const statusColors: any = {
            active: "success",
            inactive: "danger",
            pending: "warning",
            applied: "info",
          };
          return (
            <span className={`badge bg-${statusColors[status] || "secondary"}`}>
              {status}
            </span>
          );
        },
        enableColumnFilter: false,
      },
      {
        header: "Interview Stage",
        accessorKey: "interviewStage",
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

    // Add Action column only for admin
    if (isAdmin) {
      baseColumns.push({
        header: "Action",
        cell: ({ row }: any) => (
          <div className="flex gap-2">
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
          </div>
        ),
      });
    }

    return baseColumns;
  }, [isAdmin]);

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

      <Modal
        open={show}
        onCancel={onHide}
        footer={null}
        width={1200}
        centered
        title={
          <span className="text-lg font-bold">
            {jobTitleState
              ? `Applicants for ${jobTitleState}`
              : "Job Applicants"}
          </span>
        }
      >
        {tableLoader || loading ? (
          <div className="py-4 text-center">
            <Skeleton className="mb-5 min-h-10" />
            <Skeleton />
          </div>
        ) : applicant.length > 0 ? (
          <div className="pt-4">
            <TableContainer
              isHeaderTitle="Applicants"
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
              No applicants found for this job. Total Records: {totalRecords}
            </p>
          </div>
        )}
      </Modal>
    </>
  );
};

export default ViewJobApplicantsModal;
