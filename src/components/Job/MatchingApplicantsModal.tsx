/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Modal, Skeleton, Empty, Pagination, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { errorHandle, getCurrentUserRole } from "utils/commonFunctions";
import { viewJobById, sendJobEmail } from "api/apiJob";
import { getMatchingApplicants } from "api/apiVendor";
import { getEmailTemplateByType } from "api/emailApi";
import ViewModal from "pages/applicant/ViewApplicant";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface MatchingApplicantsModalProps {
  show: boolean;
  onHide: () => void;
  jobId: string;
  jobTitle?: string;
}

// Get initials from name
const getInitials = (name: any): string => {
  if (!name) return "?";
  const firstName = name.firstName || "";
  const lastName = name.lastName || "";
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "?";
};

// Get full name from name object
const getFullName = (name: any): string => {
  if (!name) return "Unknown";
  const firstName = name.firstName || "";
  const middleName = name.middleName || "";
  const lastName = name.lastName || "";
  return `${firstName} ${middleName} ${lastName}`.trim() || "Unknown";
};

// Generate avatar background color based on name
const getAvatarColor = (name: string): string => {
  const colors = [
    "#8b5cf6",
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ec4899",
    "#6366f1",
    "#14b8a6",
    "#ef4444",
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

const MatchingApplicantsModal: React.FC<MatchingApplicantsModalProps> = ({
  show,
  onHide,
  jobId,
  jobTitle,
}) => {
  const [applicants, setApplicants] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [jobDetails, setJobDetails] = useState<{
    job_id?: string;
    job_subject?: string;
    required_skills?: string[];
    addedBy?: {
      _id?: string;
      firstName?: string;
      lastName?: string;
      email?: string;
      role?: string;
    };
  } | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedApplicantId, setSelectedApplicantId] = useState<string>("");
  const [invitingApplicantId, setInvitingApplicantId] = useState<string>("");

  const currentRole = getCurrentUserRole();
  const isAdmin = currentRole === "admin";
  const isClient = currentRole === "client";
  const isVendor = currentRole === "vendor";

  useEffect(() => {
    if (show && jobId) {
      setCurrentPage(1);
      fetchJobDetails();
      fetchMatchingApplicants();
    }
  }, [show, jobId]);

  useEffect(() => {
    if (show && jobId && currentPage > 1) {
      fetchMatchingApplicants();
    }
  }, [currentPage]);

  const fetchJobDetails = async () => {
    if (!jobId) return;
    try {
      const res = await viewJobById({ _id: jobId });
      if (res?.success && res?.data) {
        setJobDetails(res.data);
      }
    } catch (error: any) {
      errorHandle(error);
    }
  };

  const fetchMatchingApplicants = async () => {
    if (!jobId) return;

    setLoading(true);
    setApplicants([]);

    try {
      const params = {
        page: currentPage,
        limit: pageSize,
      };

      const res = await getMatchingApplicants(jobId, params);

      if (res?.success || res?.data) {
        setApplicants(
          res?.data?.applicants || res?.data?.results || res?.data || []
        );
        setTotalRecords(
          res?.data?.pagination?.totalCount || res?.pagination?.totalCount || 0
        );
      }
    } catch (error: any) {
      errorHandle(error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewResume = (id: string) => {
    setSelectedApplicantId(id);
    setShowViewModal(true);
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setSelectedApplicantId("");
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle Invite to Job - sends email based on role
  const handleInviteToJob = async (applicant: any) => {
    if (!jobId || !applicant?._id) return;

    setInvitingApplicantId(applicant._id);

    try {
      let templateType = "JOB_NOTIFICATION";
      if (isAdmin) {
        const addedByRole = jobDetails?.addedBy?.role;
        templateType =
          addedByRole === "client" ? "CLIENT_JOB_EMAIL" : "JOB_NOTIFICATION";
      } else if (isClient) {
        templateType = "CLIENT_JOB_EMAIL";
      }

      const templateRes = await getEmailTemplateByType(templateType);

      if (!templateRes?.success && !templateRes?.data) {
        toast.error(
          "Email template not found. Please configure the template first."
        );
        return;
      }

      const requestData: {
        applicantIds: string[];
        emailTemplateId?: string;
        customMessage?: string;
      } = {
        applicantIds: [applicant._id],
      };

      if (templateRes?.data?._id) {
        requestData.emailTemplateId = templateRes.data._id;
      }

      const res = await sendJobEmail(jobId, requestData);

      if (res?.success) {
        toast.success(res?.message || "Job invite sent successfully!");
      } else {
        toast.error(res?.message || "Failed to send job invite.");
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || "Failed to send job invite.";
      toast.error(errorMessage);
      errorHandle(error);
    } finally {
      setInvitingApplicantId("");
    }
  };

  // Table columns matching the image design
  const columns: ColumnsType<any> = [
    {
      title: "CANDIDATE",
      key: "candidate",
      width: 250,
      render: (_, record) => {
        const name = record?.name;
        const fullName = getFullName(name);
        const initials = getInitials(name);
        const avatarColor = getAvatarColor(fullName);
        const companyName = record?.currentCompanyName || "-";
        const designation =
          record?.currentCompanyDesignation || record?.appliedRole || "-";

        return (
          <div className="flex items-start gap-3">
            {/* Avatar */}
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
              style={{ backgroundColor: avatarColor }}
            >
              {initials}
            </div>
            {/* Info */}
            <div className="min-w-0">
              <div className="font-semibold text-gray-900 truncate">
                {fullName}
              </div>
              <div className="text-sm text-gray-600 truncate">
                {companyName}
              </div>
              <div className="text-sm text-purple-600 italic truncate">
                {designation}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      title: "STATUS",
      key: "status",
      width: 130,
      render: (_, record) => {
        const status = record?.status || "Open to Work";

        // Define status colors
        const getStatusStyle = (s: string) => {
          const statusLower = s.toLowerCase();
          if (statusLower === "applied") {
            return "bg-blue-100 text-blue-700 border-blue-200";
          }
          if (statusLower === "shortlisted" || statusLower === "selected") {
            return "bg-green-100 text-green-700 border-green-200";
          }
          if (statusLower === "rejected") {
            return "bg-red-100 text-red-700 border-red-200";
          }
          if (statusLower === "on hold" || statusLower === "pending") {
            return "bg-yellow-100 text-yellow-700 border-yellow-200";
          }
          if (statusLower === "interviewed") {
            return "bg-purple-100 text-purple-700 border-purple-200";
          }
          // Default: Open to Work
          return "bg-emerald-100 text-emerald-700 border-emerald-200";
        };

        const getDotColor = (s: string) => {
          const statusLower = s.toLowerCase();
          if (statusLower === "applied") return "bg-blue-500";
          if (statusLower === "shortlisted" || statusLower === "selected")
            return "bg-green-500";
          if (statusLower === "rejected") return "bg-red-500";
          if (statusLower === "on hold" || statusLower === "pending")
            return "bg-yellow-500";
          if (statusLower === "interviewed") return "bg-purple-500";
          return "bg-emerald-500";
        };

        return (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border whitespace-nowrap capitalize ${getStatusStyle(
              status
            )}`}
          >
            <span
              className={`w-2 h-2 rounded-full ${getDotColor(status)}`}
            ></span>
            {status}
          </span>
        );
      },
    },
    {
      title: "LOCATION",
      key: "location",
      width: 150,
      render: (_, record) => {
        const city = record?.currentCity || "-";
        const state = record?.state || "";

        return (
          <div className="flex items-center gap-1 text-sm text-gray-700">
            <i className="ri-map-pin-line text-gray-400"></i>
            <span
              className="truncate max-w-[120px]"
              title={`${city}${state ? `, ${state}` : ""}`}
            >
              {city}
            </span>
          </div>
        );
      },
    },
    {
      title: "EXPERIENCE & NOTICE",
      key: "experience",
      width: 140,
      render: (_, record) => {
        const experience = record?.totalExperience
          ? `${record.totalExperience} years`
          : "-";
        const noticePeriod =
          record?.noticePeriod === 0
            ? "Immediate"
            : record?.noticePeriod
            ? `${record.noticePeriod} days`
            : "-";

        return (
          <div>
            <div className="flex items-center gap-1 text-sm text-gray-700">
              <i className="ri-briefcase-line text-gray-400"></i>
              <span>{experience}</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-700 mt-1">
              <i className="ri-time-line text-gray-400"></i>
              <span>{noticePeriod}</span>
            </div>
          </div>
        );
      },
    },
    {
      title: "SKILLS",
      key: "skills",
      width: 200,
      render: (_, record) => {
        const skills = record?.appliedSkills || [];
        const matchingSkills = record?.skillsMatch?.matchingSkills || [];

        if (!skills || skills.length === 0) {
          return <span className="text-gray-400 text-sm">-</span>;
        }

        return (
          <div className="flex flex-wrap gap-1">
            {skills.slice(0, 3).map((skill: string, index: number) => {
              const isMatching = matchingSkills.some(
                (ms: string) => ms.toLowerCase() === skill.toLowerCase()
              );
              return (
                <span
                  key={index}
                  className={`px-2 py-0.5 text-xs rounded-full whitespace-nowrap ${
                    isMatching
                      ? "bg-green-100 text-green-700 border border-green-300"
                      : "bg-purple-50 text-purple-700 border border-purple-200"
                  }`}
                >
                  {skill}
                </span>
              );
            })}
            {skills.length > 3 && (
              <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">
                +{skills.length - 3}
              </span>
            )}
          </div>
        );
      },
    },
    {
      title: "ACTIONS",
      key: "actions",
      width: 160,
      fixed: "right",
      render: (_, record) => {
        const isActive = record?.isActive !== false;
        const hasApplied = record?.jobApplicationStatus?.hasApplied === true;
        const status = record?.jobApplicationStatus?.status || "";
        const interviewStage = record?.jobApplicationStatus?.interviewStage || "";
        const isInviting = invitingApplicantId === record._id;

        // Get status badge style
        const getAppliedStatusStyle = (s: string) => {
          const statusLower = s.toLowerCase();
          if (statusLower === "applied")
            return "bg-blue-100 text-blue-700 border-blue-200";
          if (statusLower === "shortlisted" || statusLower === "selected")
            return "bg-green-100 text-green-700 border-green-200";
          if (statusLower === "rejected")
            return "bg-red-100 text-red-700 border-red-200";
          if (statusLower === "on hold" || statusLower === "pending")
            return "bg-yellow-100 text-yellow-700 border-yellow-200";
          if (statusLower === "interviewed")
            return "bg-purple-100 text-purple-700 border-purple-200";
          return "bg-gray-100 text-gray-700 border-gray-200";
        };

        return (
          <div className="flex flex-col gap-2">
            {(isAdmin || isClient || isVendor) && (
              <button
                onClick={() => handleViewResume(record._id)}
                disabled={!isActive}
                className="px-3 py-1.5 text-white text-xs font-medium rounded-lg hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                style={{ backgroundColor: "#8b5cf6" }}
              >
                <i className="ri-file-text-line"></i>
                View Resume
              </button>
            )}

            {/* Show Applied Status when hasApplied is true */}
            {hasApplied ? (
              <div className="flex flex-col gap-1">
                <span
                  className={`inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border capitalize ${getAppliedStatusStyle(
                    status
                  )}`}
                >
                  <i className="ri-check-line"></i>
                  {status || "Applied"}
                </span>
                {interviewStage && (
                  <span className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded text-center capitalize">
                    {interviewStage}
                  </span>
                )}
              </div>
            ) : (
              <button
                onClick={() => handleInviteToJob(record)}
                disabled={!isActive || isInviting}
                className="px-3 py-1.5 bg-white text-gray-700 text-xs font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
              >
                {isInviting ? (
                  <>
                    <i className="ri-loader-4-line animate-spin"></i>
                    Sending...
                  </>
                ) : (
                  <>
                    <i className="ri-mail-send-line"></i>
                    Invite to Job
                  </>
                )}
              </button>
            )}
          </div>
        );
      },
    },
  ];

  if (!show) return null;

  return (
    <>
      {showViewModal && selectedApplicantId && (
        <ViewModal
          show={showViewModal}
          onHide={handleCloseViewModal}
          applicantId={selectedApplicantId}
          source="applicant"
        />
      )}

      <Modal
        open={show}
        onCancel={onHide}
        footer={null}
        width="95vw"
        style={{ maxWidth: 1200 }}
        centered
        title={
          <div className="flex items-center gap-2 sm:gap-3">
            <i className="ri-user-search-line text-purple-600 text-lg sm:text-xl"></i>
            <span className="text-base sm:text-lg font-bold">
              Matching Candidates
              {jobTitle && (
                <span className="text-gray-500 font-normal hidden sm:inline">
                  {" "}
                  for {jobTitle}
                </span>
              )}
            </span>
          </div>
        }
        className="matching-applicants-modal"
      >
        {/* Job Skills Info */}
        {jobDetails?.required_skills &&
          jobDetails.required_skills.length > 0 && (
            <div className="mb-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center gap-2 text-sm flex-wrap">
                <i className="ri-lightbulb-flash-line text-purple-600"></i>
                <span className="text-purple-700 font-medium">
                  Required skills:
                </span>
                <div className="flex flex-wrap gap-1">
                  {jobDetails.required_skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

        {/* Content */}
        {loading ? (
          <div className="space-y-4">
            <Skeleton active paragraph={{ rows: 5 }} />
          </div>
        ) : applicants.length > 0 ? (
          <>
            {/* Results Count Header */}
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Found{" "}
                <span className="font-semibold text-purple-600">
                  {totalRecords}
                </span>{" "}
                matching candidates
              </p>
            </div>

            {/* Table */}
            <Table
              columns={columns}
              dataSource={applicants}
              rowKey="_id"
              pagination={false}
              scroll={{ x: 1100 }}
              size="middle"
              className="matching-applicants-table"
              rowClassName="hover:bg-gray-50"
            />

            {/* Pagination */}
            {totalRecords > pageSize && (
              <div className="mt-4 pt-4 border-t border-gray-200 flex justify-center">
                <Pagination
                  current={currentPage}
                  total={totalRecords}
                  pageSize={pageSize}
                  onChange={handlePageChange}
                  showSizeChanger={false}
                  showTotal={(total, range) =>
                    `${range[0]}-${range[1]} of ${total} candidates`
                  }
                />
              </div>
            )}
          </>
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <div className="text-center">
                <p className="text-gray-600 font-medium">
                  No matching candidates found
                </p>
                <p className="text-gray-400 text-sm">
                  No applicants found matching the job requirements.
                </p>
              </div>
            }
          />
        )}
      </Modal>

      <style>{`
        .matching-applicants-table .ant-table-thead > tr > th {
          background-color: #f8fafc !important;
          color: #64748b !important;
          font-weight: 600 !important;
          font-size: 11px !important;
          text-transform: uppercase !important;
          letter-spacing: 0.05em !important;
          border-bottom: 1px solid #e2e8f0 !important;
        }
        .matching-applicants-table .ant-table-tbody > tr > td {
          padding: 16px 12px !important;
          vertical-align: top !important;
          border-bottom: 1px solid #f1f5f9 !important;
        }
        .matching-applicants-table .ant-table-tbody > tr:hover > td {
          background-color: #faf5ff !important;
        }
      `}</style>
    </>
  );
};

export default MatchingApplicantsModal;
