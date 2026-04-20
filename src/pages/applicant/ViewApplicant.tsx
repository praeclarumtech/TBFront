/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useMemo } from "react";
import { Modal, Spin, Badge, Card, Row, Col, Tag } from "antd";
import {
  getApplicantDetails,
  getImportedApplicantDetails,
  updateApplicant,
} from "api/applicantApi";
import { errorHandle } from "utils/commonFunctions";
import { UserOutlined } from "@ant-design/icons";
import appConstants from "constants/constant";
import { CloseOutlined } from "@ant-design/icons";
import BaseFav from "components/BaseComponents/BaseFav";
import { getApplicantDetailsInVendor } from "api/apiVendor";
import {
  ApplicantDetails,
  ViewModalProps,
} from "interfaces/applicant.interface";
import toastify from "utils/toastify";
import { buildApplicantDetailsFullUrl } from "utils/applicantUtils";
import { ArrowLeftOutlined } from "@ant-design/icons";

const { projectTitle, Modules, employmentWorkPreferenceOptions, workPreferenceType } =
  appConstants;

const WORK_PREFERENCE_LABEL_MAP: Record<string, string> = Object.fromEntries([
  ...employmentWorkPreferenceOptions.map((o) => [o.value, o.label]),
  ...workPreferenceType.map((o) => [o.value, o.label]),
]);

const parseWorkPreferenceTokens = (raw: unknown): string[] => {
  if (Array.isArray(raw)) {
    return raw.map((v) => String(v).trim()).filter(Boolean);
  }
  if (typeof raw === "string" && raw.trim()) {
    return raw.split(",").map((s) => s.trim()).filter(Boolean);
  }
  return [];
};

const capitalizeWords = (str?: string) => {
  return (
    str
      ?.split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ") ?? ""
  );
};

const DetailsRow = ({
  label,
  value,
  icon,
}: // className,
{
  label: string;
  value?: string | number | JSX.Element;
  icon?: JSX.Element;
  // className?: string;
}) => (
  <p className="mb-[0.8rem]">
    {icon}
    <strong>{label}:</strong> {value || "-"}
  </p>
);

const DetailsCard = ({
  title,
  icon,
  children,
}: {
  title: string;
  icon: JSX.Element;
  children: React.ReactNode;
}) => (
  <Card
    title={
      <div className="flex items-center">
        {icon}
        <span className="ml-2 text-blue-600">{title}</span>
      </div>
    }
    // bordered={false}
    variant="outlined"
    className="custom-card"
  >
    {children}
  </Card>
);

const ViewModal: React.FC<ViewModalProps> = ({
  show,
  onHide,
  applicantId,
  source,
  variant = "modal",
}) => {
  const isPage = variant === "page";
  document.title = Modules.PreviewApplicantsDetails + " | " + projectTitle;
  const [formData, setFormData] = useState<ApplicantDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showFavModal, setShowFavModal] = useState(false);
  const [isFav, setIsFav] = useState(false);

  const getDetailsApplicants = () => {
    if (!applicantId) return;

    setLoading(true);
    let apiCall;

    if (source === "import") {
      apiCall = getImportedApplicantDetails(applicantId);
    } else if (source === "vendor") {
      apiCall = getApplicantDetailsInVendor(applicantId);
    } else {
      apiCall = getApplicantDetails(applicantId);
    }
    apiCall
      .then((res) => {
        if (res.success) {
          setFormData(res.data);
          setLoading(false);
        }
      })
      .catch((error) => errorHandle(error))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getDetailsApplicants();
  }, [applicantId, source]);

  if (!isPage && !show) return null;

  const handleOpenInNewTab = () => {
    if (!applicantId) return;
    const url = buildApplicantDetailsFullUrl(applicantId, source);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleConfirmFav = (isFav: boolean = false) => {
    setShowFavModal(true);
    setIsFav(isFav);
  };

  const updateApplicantData = (
    isFav: boolean,
    id: string | null | undefined
  ) => {
    updateApplicant({ isFavorite: !isFav }, id)
      .then((res: any) => {
        if (res.success) {
          if (isFav) {
            toastify("Applicant removed from favorite list", {
              type: "success",
            });
          } else {
            toastify("Applicant added to favorite list", { type: "success" });
          }
          getDetailsApplicants();
          setShowFavModal(false);
        }
      })
      .catch((error) => {
        const errorMessages = error?.response?.data?.details;
        if (errorMessages && Array.isArray(errorMessages)) {
          errorMessages.forEach((errorMessage) => {
            toastify(errorMessage, { type: "error" });
          });
        } else {
          toastify("An error occurred while updating the applicant.", {
            type: "error",
          });
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const detailsBlock = useMemo(() => {
    if (loading) {
      return (
        <Spin size="large" className="flex items-center justify-center" />
      );
    }
    if (!formData) return null;
    return (
      <div className="space-y-4">
                  {/* Personal Details */}
                  <DetailsCard
                    title="Personal Details"
                    icon={<UserOutlined className="text-blue-500" />}
                  >
                    <Row gutter={[16, 16]}>
                      <Col span={12}>
                        <DetailsRow
                          label="Full Name"
                          value={`${capitalizeWords(formData.name.firstName)} ${
                            formData.name.middleName
                              ? capitalizeWords(formData.name.middleName)
                              : ""
                          } ${capitalizeWords(formData.name.lastName)}`}
                        />
                        <DetailsRow
                          label="Phone Number"
                          value={
                            formData?.phone?.phoneNumber ? (
                              <Tag color="blue">{formData?.phone?.phoneNumber}</Tag>
                            ) : (
                              "-"
                            )
                          }
                        />
                        <DetailsRow
                          label="WhatsApp Number"
                          value={
                            formData?.phone?.whatsappNumber ? (
                              <Tag color="green">{formData?.phone?.whatsappNumber}</Tag>
                            ) : (
                              "-"
                            )
                          }
                        />

                        <DetailsRow
                          label="Email"
                          value={
                            formData?.email ? (
                              <a href={`mailto:${formData?.email}`}>
                                {formData?.email}
                              </a>
                            ) : (
                              "-"
                            )
                          }
                        />

                        <DetailsRow
                          label="Gender"
                          value={
                            formData.gender ? capitalizeWords(formData.gender) : "-"
                          }
                        />
                        <DetailsRow
                          label="Current Address"
                          value={
                            formData.currentAddress ? (
                              <div className="overflow-hidden break-words whitespace-normal text-ellipsis">
                                {capitalizeWords(formData.currentAddress)}
                              </div>
                            ) : (
                              "-"
                            )
                          }
                        />
                      </Col>
                      <Col span={12}>
                        <DetailsRow
                          label="Date of Birth"
                          value={
                            formData.dateOfBirth
                              ? new Date(formData.dateOfBirth).toLocaleDateString(
                                  "en-GB",
                                  {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                  }
                                )
                              : "-"
                          }
                        />
                        <DetailsRow
                          label="Marital Status"
                          value={
                            formData.maritalStatus
                              ? capitalizeWords(formData.maritalStatus)
                              : "-"
                          }
                        />
                        <DetailsRow
                          label="Current City"
                          value={
                            formData.currentCity
                              ? capitalizeWords(formData.currentCity)
                              : "-"
                          }
                        />
                        <DetailsRow
                          label="State"
                          value={
                            formData.state ? capitalizeWords(formData.state) : "-"
                          }
                        />
                        <DetailsRow
                          label="Country"
                          value={
                            formData.country ? capitalizeWords(formData.country) : "-"
                          }
                        />
                        <DetailsRow
                          label="Permanent Address"
                          value={
                            formData.permanentAddress ? (
                              <div className="overflow-hidden break-words whitespace-normal text-ellipsis">
                                {capitalizeWords(formData.permanentAddress)}
                              </div>
                            ) : (
                              "-"
                            )
                          }
                        />
                      </Col>
                    </Row>
                  </DetailsCard>

                  <DetailsCard title="Educational Details" icon={<span>🎓</span>}>
                    <Row gutter={[16, 16]}>
                      <Col span={12}>
                        <DetailsRow
                          label="Qualification"
                          value={
                            formData.qualification ? (
                              <Tag color="cyan">{formData.qualification}</Tag>
                            ) : (
                              "-"
                            )
                          }
                        />
                        <DetailsRow
                          label="Specialization"
                          value={
                            formData.specialization ? (
                              <Tag color="green">
                                {capitalizeWords(formData.specialization)}
                              </Tag>
                            ) : (
                              "-"
                            )
                          }
                        />
                      </Col>
                      <Col span={12}>
                        <DetailsRow
                          label="Passing Year"
                          value={formData.passingYear?.toString() || "-"}
                        />
                        <DetailsRow
                          label="College Name"
                          value={
                            formData.collegeName
                              ? capitalizeWords(formData.collegeName)
                              : "-"
                          }
                        />
                        <DetailsRow
                          label="CGPA"
                          value={
                            formData.cgpa !== null && formData.cgpa !== undefined ? (
                              <Badge
                                count={formData.cgpa}
                                style={{ backgroundColor: "#52c41a" }}
                              />
                            ) : (
                              "-"
                            )
                          }
                        />
                      </Col>
                    </Row>
                  </DetailsCard>

                  <DetailsCard title="Job Details" icon={<span>💼</span>}>
                    <Row gutter={[16, 16]}>
                      {/* Left Column */}
                      <Col span={12}>
                        <DetailsRow
                          label="Current Company"
                          value={formData.currentCompanyName || "-"}
                        />
                        <DetailsRow
                          label="Designation"
                          value={
                            <Tag color="blue">
                              {formData.currentCompanyDesignation || "-"}
                            </Tag>
                          }
                        />
                        <DetailsRow
                          label="Current Package"
                          value={
                            <Tag color="green">
                              {formData.currentPkg
                                ? `${formData.currentPkg} LPA`
                                : "-"}
                            </Tag>
                          }
                        />
                        <DetailsRow
                          label="Expected Package"
                          value={
                            <Tag color="purple">
                              {formData.expectedPkg
                                ? `${formData.expectedPkg} LPA`
                                : "-"}
                            </Tag>
                          }
                        />
                        <DetailsRow
                          label="Negotiation"
                          value={
                            <Tag color="gold">
                              {formData.negotiation ? `${formData.negotiation}` : "-"}
                            </Tag>
                          }
                        />
                        <DetailsRow
                          label="Notice Period"
                          value={`${formData.noticePeriod || "-"} days`}
                        />
                        <DetailsRow
                          label="Work preference"
                          value={(() => {
                            const tokens = parseWorkPreferenceTokens(
                              formData.workPreference,
                            );
                            if (tokens.length === 0) return "-";
                            return (
                              <div className="flex flex-wrap gap-2 py-1">
                                {tokens.map((token) => (
                                  <Tag key={token} color="magenta">
                                    {WORK_PREFERENCE_LABEL_MAP[token] ??
                                      capitalizeWords(token.replace(/-/g, " "))}
                                  </Tag>
                                ))}
                              </div>
                            );
                          })()}
                        />
                        <DetailsRow
                          label="Applied Role"
                          value={
                            formData.appliedRole ? (
                              <Tag color="cyan">{formData.appliedRole}</Tag>
                            ) : (
                              "-"
                            )
                          }
                        />
                        {formData.meta && Object.keys(formData.meta).length > 0 && (
                          <DetailsRow
                            label="Relevant Skills Experience"
                            value={
                              <div className="flex flex-wrap gap-2">
                                {Object.entries(formData.meta).map(([key, value]) => (
                                  <Tag key={key} color="geekblue">
                                    {`${key}: ${value || "-"} Yrs`}
                                  </Tag>
                                ))}
                              </div>
                            }
                          />
                        )}
                        <Row gutter={[16, 16]}>
                          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            <DetailsRow
                              label="Skills"
                              value={
                                formData.appliedSkills.length > 0 ? (
                                  <div
                                    className="flex flex-wrap gap-2 py-1"
                                    style={{
                                      rowGap: "8px",
                                      columnGap: "8px",
                                    }}
                                  >
                                    {formData?.appliedSkills.map((skill: string) => (
                                      <Tag
                                        color="cyan"
                                        key={skill}
                                        style={{
                                          fontSize: "0.85rem",
                                          padding: "2px 8px",
                                        }}
                                      >
                                        {skill}
                                      </Tag>
                                    ))}
                                  </div>
                                ) : (
                                  "-"
                                )
                              }
                            />
                          </Col>
                        </Row>
                        <Row gutter={[16, 16]}>
                          <Col span={24}>
                            <DetailsRow
                              label="Other Skills"
                              value={
                                formData.otherSkills.length > 0 ? (
                                  <div className="flex flex-wrap gap-1">
                                    {formData.otherSkills
                                      .split(",")
                                      .map((skill, index) => (
                                        <Tag key={index} color="purple">
                                          {skill.trim()}
                                        </Tag>
                                      ))}
                                  </div>
                                ) : (
                                  "-"
                                )
                              }
                            />
                          </Col>
                        </Row>
                        {/* </DetailsCard> */}
                      </Col>

                      <Col span={12}>
                        <DetailsRow
                          label="Preferred Locations"
                          value={
                            formData.preferredLocations ? (
                              <>
                                {formData.preferredLocations
                                  .split(",")
                                  .map((location) => (
                                    <Tag color="blue" key={location.trim()}>
                                      {location.trim()}
                                    </Tag>
                                  ))}
                              </>
                            ) : (
                              "-"
                            )
                          }
                        />
                        <DetailsRow
                          label="Hands-on Offers"
                          value={
                            formData.anyHandOnOffers ? (
                              <Tag color="green">Yes</Tag>
                            ) : (
                              <Tag color="red">No</Tag>
                            )
                          }
                        />
                        <DetailsRow
                          label="LinkedIn"
                          value={
                            formData.linkedinUrl ? (
                              <a
                                href={formData.linkedinUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 underline"
                              >
                                View LinkedIn
                              </a>
                            ) : (
                              "-"
                            )
                          }
                        />
                        <DetailsRow
                          label="Resume"
                          value={
                            formData.resumeUrl ? (
                              <a
                                href={formData.resumeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 underline"
                              >
                                View Resume
                              </a>
                            ) : (
                              "-"
                            )
                          }
                        />
                        <DetailsRow
                          label="Git-hub"
                          value={
                            formData.gitHubUrl ? (
                              <a
                                href={formData.gitHubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 underline"
                              >
                                Git-hub URL
                              </a>
                            ) : (
                              "-"
                            )
                          }
                        />
                        <DetailsRow
                          label="Portfolio"
                          value={
                            formData.portfolioUrl ? (
                              <a
                                href={formData.portfolioUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 underline"
                              >
                                View Portfolio
                              </a>
                            ) : (
                              "-"
                            )
                          }
                        />
                        <DetailsRow
                          label="Client CV"
                          value={
                            formData.clientCvUrl ? (
                              <a
                                href={formData.clientCvUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 underline"
                              >
                                View Client CV
                              </a>
                            ) : (
                              "-"
                            )
                          }
                        />
                        <DetailsRow
                          label="Practical Project"
                          value={
                            formData.practicalUrl ? (
                              <a
                                href={formData.practicalUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 underline"
                              >
                                View Project
                              </a>
                            ) : (
                              "-"
                            )
                          }
                        />
                        <DetailsRow
                          label="Total Experience"
                          value={`${formData.totalExperience || 0} ${
                            formData.totalExperience === 1 ? "year" : "years"
                          }`}
                        />
                        <DetailsRow
                          label="Relevant Skill Experience"
                          value={`${formData.relevantSkillExperience || 0} years`}
                        />
                        <DetailsRow
                          label="English Communication Skill"
                          value={`${formData.communicationSkill || "-"} / 10`}
                        />
                        <DetailsRow
                          label="JavaScript Rating"
                          value={
                            <Tag color="volcano">{`${
                              formData.rating || "-"
                            } / 10`}</Tag>
                          }
                        />
                        <DetailsRow
                          label="Referral"
                          value={formData.referral || "-"}
                        />
                      </Col>
                    </Row>
                  </DetailsCard>

                  <DetailsCard title="Interview Details" icon={<span>📅</span>}>
                    <Row gutter={[16, 16]}>
                      <Col span={12}>
                        <DetailsRow
                          label="Interview Stage"
                          value={
                            <Tag color="blue">
                              {capitalizeWords(formData.interviewStage)}
                            </Tag>
                          }
                        />
                        <DetailsRow
                          label="Interview Mode"
                          value={
                            formData.interviewMode ? (
                              <Tag color="purple">
                                {capitalizeWords(formData.interviewMode)}
                              </Tag>
                            ) : (
                              "-"
                            )
                          }
                        />
                        <DetailsRow
                          label="Status"
                          value={
                            <Tag
                              color={formData.status === "active" ? "green" : "red"}
                            >
                              {capitalizeWords(formData.status)}
                            </Tag>
                          }
                        />
                        <DetailsRow
                          label="Last Follow-up"
                          value={
                            formData.lastFollowUpDate
                              ? new Date(
                                  formData.lastFollowUpDate
                                ).toLocaleDateString()
                              : "-"
                          }
                        />

                        <DetailsRow
                          label="Comment"
                          value={capitalizeWords(formData.comment)}
                        />
                        <DetailsRow
                          label="Created At"
                          value={formData?.createdAt?.split("T")[0] || "-"}
                        />
                      </Col>
                      <Col span={12}>
                        <DetailsRow
                          label="Practical Feedback"
                          value={formData.practicalFeedback || "-"}
                        />
                        <DetailsRow
                          label="General Feedback"
                          value={formData.feedback || "-"}
                        />
                        <DetailsRow
                          label="Applicant Add By"
                          value={formData?.addedBy || "-"}
                        />
                        <DetailsRow
                          label="Client Feedback"
                          value={formData.clientFeedback || "-"}
                        />

                        <DetailsRow
                          label="Updated At"
                          value={formData?.updatedAt?.split("T")[0] || "-"}
                        />
                      </Col>
                    </Row>
                  </DetailsCard>
                </div>
    );
  }, [loading, formData]);

  const titleRow = (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
      }}
    >
      <span style={{ fontSize: "16px", fontWeight: "bold" }}>
        Applicant Details
      </span>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {source === "vendor" ? (
          <></>
        ) : (
          <>
            {formData?.isFavorite ? (
              <i
                className="align-bottom ri-heart-fill text-danger"
                style={{
                  fontSize: "20px",
                  cursor: "pointer",
                }}
                onClick={() => handleConfirmFav(formData?.isFavorite)}
              />
            ) : (
              <i
                className="align-bottom ri-heart-line"
                style={{
                  fontSize: "20px",
                  cursor: "pointer",
                }}
                onClick={() => handleConfirmFav(formData?.isFavorite)}
              />
            )}
          </>
        )}
        {!isPage && applicantId ? (
          <i
            className="ri-external-link-line"
            role="button"
            tabIndex={0}
            title="Open in new tab"
            aria-label="Open in new tab"
            onClick={handleOpenInNewTab}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleOpenInNewTab();
              }
            }}
            style={{ fontSize: "18px", color: "#000", cursor: "pointer" }}
          />
        ) : null}
        {isPage ? (
          <ArrowLeftOutlined
            onClick={onHide}
            style={{ fontSize: "18px", color: "#000", cursor: "pointer" }}
            title="Back to applicants"
          />
        ) : (
          <CloseOutlined
            onClick={onHide}
            style={{
              fontSize: "18px",
              color: "#000",
              cursor: "pointer",
            }}
          />
        )}
      </div>
    </div>
  );

  return (
    <>
      <BaseFav
        show={showFavModal}
        onCloseClick={() => setShowFavModal(false)}
        onYesClick={() => updateApplicantData(isFav, formData?._id)}
        flag={isFav}
      />
      {!isPage ? (
        <Modal
          open={show}
          onCancel={onHide}
          footer={null}
          width="95vw"
          style={{ maxWidth: 800 }}
          centered
          closeIcon={null}
          title={titleRow}
        >
          {detailsBlock}
        </Modal>
      ) : (
        <div
          className="container-fluid py-4"
          style={{ maxWidth: 800, margin: "0 auto" }}
        >
          <div className="mb-3 border-bottom pb-3">{titleRow}</div>
          {detailsBlock}
        </div>
      )}
    </>
  );
};

export default ViewModal;
