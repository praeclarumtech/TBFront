/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Modal, Spin, Badge, Card, Row, Col, Tag } from "antd";
import { getApplicantDetails } from "api/applicantApi";
import { errorHandle } from "utils/commonFunctions";
import { UserOutlined } from "@ant-design/icons";

interface ViewModalProps {
  show: boolean;
  onHide: () => void;
  applicantId?: string;
}

interface ApplicantDetails {
  name: {
    firstName: string;
    middleName?: string;
    lastName: string;
  };
  phone: {
    phoneNumber: string;
    whatsappNumber: string;
  };
  email: string;
  gender: string;
  dateOfBirth: string;
  maritalStatus: string;
  comment: string;
  currentAddress: string;
  currentCity: string;
  currentPincode: number;
  currentLocation: string;
  state: string;
  country: string;
  preferredLocations: string;
  homeTownCity: string;
  homePincode: number;
  qualification: string;
  degree: string;
  passingYear: number;
  specialization: string;
  appliedSkills: string[];
  totalExperience: number;
  relevantSkillExperience: number;
  otherSkills: string;
  currentCompanyName: string;
  currentCompanyDesignation: string;
  currentPkg: string;
  expectedPkg: number;
  negotiation: string;
  noticePeriod: number;
  interviewStage: string;
  status: string;
  resumeUrl: string;
  portfolioUrl: string;
  practicalUrl: string;
  clientCvUrl: string;
  clientFeedback: string;
  linkedinUrl: string;
  feedback: string;
  practicalFeedback: string;
  communicationSkill: number;
  rating: number;
  referral: string;
  cgpa: number | null;
  collegeName: string;
  workPreference: string;
  lastFollowUpDate: string;
  anyHandOnOffers: boolean;
}

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
}: {
  label: string;
  value?: string | number | JSX.Element;
  icon?: JSX.Element;
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
    bordered={false}
    className="custom-card"
  >
    {children}
  </Card>
);

const ViewModal: React.FC<ViewModalProps> = ({ show, onHide, applicantId }) => {
  const [formData, setFormData] = useState<ApplicantDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!applicantId) return;

    setLoading(true);
    getApplicantDetails(applicantId)
      .then((res) => {
        if (res.success) {
          setFormData(res.data);
        }
      })
      .catch((error) => errorHandle(error))
      .finally(() => setLoading(false));
  }, [applicantId]);

  if (!show) return null;

  return (
    <Modal
      open={show}
      onCancel={onHide}
      footer={null}
      width={800}
      centered
      title={<span className="text-lg font-bold">Applicant Details</span>}
    >
      {loading ? (
        <Spin size="large" className="flex justify-center items-center" />
      ) : formData ? (
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
                    formData.phone.phoneNumber ? (
                      <Tag color="blue">{formData.phone.phoneNumber}</Tag>
                    ) : (
                      "-"
                    )
                  }
                />
                <DetailsRow
                  label="WhatsApp Number"
                  value={
                    formData.phone.whatsappNumber ? (
                      <Tag color="green">{formData.phone.whatsappNumber}</Tag>
                    ) : (
                      "-"
                    )
                  }
                />
                <DetailsRow
                  label="Email"
                  value={
                    formData.email ? (
                      <a href={`mailto:${formData.email}`}>{formData.email}</a>
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
                  label="Date of Birth"
                  value={
                    formData.dateOfBirth
                      ? new Date(formData.dateOfBirth).toLocaleDateString()
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
              </Col>
              <Col span={12}>
                <DetailsRow
                  label="Current Address"
                  value={
                    formData.currentAddress
                      ? capitalizeWords(formData.currentAddress)
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
                  value={formData.state ? capitalizeWords(formData.state) : "-"}
                />
                <DetailsRow
                  label="Country"
                  value={
                    formData.country ? capitalizeWords(formData.country) : "-"
                  }
                />
                <DetailsRow
                  label="Home Town"
                  value={
                    formData.homeTownCity
                      ? capitalizeWords(formData.homeTownCity)
                      : "-"
                  }
                />
                <DetailsRow
                  label="Home Pincode"
                  value={
                    formData.homePincode ? (
                      <Tag color="purple">
                        {formData.homePincode.toString()}
                      </Tag>
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
                  label="Degree"
                  value={
                    formData.degree ? (
                      <Tag color="blue">{capitalizeWords(formData.degree)}</Tag>
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
                      {formData.currentPkg ? `${formData.currentPkg} LPA` : "-"}
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
                      {formData.negotiation
                        ? `${formData.negotiation} LPA`
                        : "-"}
                    </Tag>
                  }
                />
                <DetailsRow
                  label="Notice Period"
                  value={`${formData.noticePeriod || "-"} days`}
                />
                <DetailsRow
                  label="Skills"
                  value={
                    formData.appliedSkills.length > 0 ? (
                      <>
                        {formData.appliedSkills.map((skill) => (
                          <Tag color="cyan" key={skill}>
                            {skill}
                          </Tag>
                        ))}
                      </>
                    ) : (
                      "-"
                    )
                  }
                />
                <DetailsRow
                  label="Other Skills"
                  value={formData.otherSkills || "-"}
                />
                <DetailsRow
                  label="Work Preference"
                  value={
                    <Tag color="magenta">
                      {capitalizeWords(formData.workPreference) || "-"}
                    </Tag>
                  }
                />
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
              </Col>

              <Col span={12}>
                <DetailsRow
                  label="LinkdIn"
                  value={
                    formData.linkedinUrl ? (
                      <a
                        href={formData.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                      >
                        View LinkdIn
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
                <DetailsRow label="Referral" value={formData.referral || "-"} />
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
                  label="Status"
                  value={
                    <Tag color={formData.status === "active" ? "green" : "red"}>
                      {capitalizeWords(formData.status)}
                    </Tag>
                  }
                />
                <DetailsRow
                  label="Last Follow-up"
                  value={new Date(
                    formData.lastFollowUpDate
                  ).toLocaleDateString()}
                />
                <DetailsRow
                  label="
                  Comment"
                  value={capitalizeWords(formData.comment)}
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
                  label="Client Feedback"
                  value={formData.clientFeedback || "-"}
                />
              </Col>
            </Row>
          </DetailsCard>
        </div>
      ) : null}
    </Modal>
  );
};

export default ViewModal;
