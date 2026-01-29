/* eslint-disable @typescript-eslint/no-explicit-any */
import { Row, Col, Card, Container } from "react-bootstrap";
import { Fragment, useEffect, useState, useMemo } from "react";
import TableContainer from "components/BaseComponents/TableContainer";
import EmptyState from "components/BaseComponents/EmptyState";
import { Tooltip as ReactTooltip } from "react-tooltip";
import * as Tooltip from "@radix-ui/react-tooltip";
import { useParams, useNavigate } from "react-router-dom";
import ViewModal from "../applicant/ViewApplicant";
import { errorHandle } from "utils/commonFunctions";
import appConstants from "constants/constant";
import Skeleton from "react-loading-skeleton";
import { getJobApplicants } from "api/apiJob";

const { projectTitle } = appConstants;

const JobApplicants = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  document.title = `Job Applicants | ${projectTitle}`;

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
  const [jobTitle, setJobTitle] = useState<string>("");

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
    if (jobId) {
      fetchApplicants();
    }
  }, [jobId, pagination]);

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
        // Set job title from response
        if (res.data.job?.job_subject) {
          setJobTitle(res.data.job.job_subject);
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

  const columns = useMemo(
    () => [
      {
        header: "Applicant Name",
        accessorKey: "name",
        cell: (info: any) => {
          const nameObj = info.row.original?.name || {};
          const firstName = nameObj.firstName || "";
          const middleName = nameObj.middleName || "";
          const lastName = nameObj.lastName || "";
          const fullName = `${firstName} ${middleName} ${lastName}`.trim();

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
        },
        filterFn: "fuzzy",
        enableColumnFilter: false,
      },
      {
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
      },
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
      },
      {
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
      },
    ],
    []
  );

  return (
    <Fragment>
      {showViewModal && selectedApplicantId && (
        <ViewModal
          show={showViewModal}
          onHide={handleCloseModal}
          applicantId={selectedApplicantId}
          source={sourcePage}
        />
      )}

      <Container fluid>
        <Row className="my-3">
          <Col lg={12}>
            <Card>
              <div className="pt-0 card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="mb-0">
                    {jobTitle ? `Applicants for ${jobTitle}` : "Job Applicants"}
                  </h4>
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => navigate(-1)}
                  >
                    <i className="ri-arrow-left-line me-1"></i> Back
                  </button>
                </div>
                {tableLoader || loading ? (
                  <div className="py-4 text-center">
                    <Skeleton count={1} className="mb-5 min-h-10" />
                    <Skeleton count={5} />
                  </div>
                ) : applicant.length > 0 ? (
                  <div className="pt-4 card-body">
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
                  <EmptyState />
                )}
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};

export default JobApplicants;
