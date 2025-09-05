/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
// import { Modal } from "react-bootstrap";
import { getEmailDetails } from "api/emailApi";
import { errorHandle } from "utils/commonFunctions";
import Skeleton from "react-loading-skeleton";
import { MailTwoTone } from "@ant-design/icons";
import { Modal, Badge, Card, Row, Col, Tag } from "antd";
import appConstants from "constants/constant";
import "react-quill/dist/quill.snow.css";
import { Popover } from "antd";
const { projectTitle, Modules } = appConstants;

const ViewModal = ({ show, onHide, applicantId }: any) => {
  document.title = Modules.Email + " | " + projectTitle;
  const [formData, setFormData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!applicantId) return;

    setLoading(true);

    getEmailDetails(applicantId)
      .then((res) => {
        if (res.success) {
          setFormData(res.data);
        }
      })
      .catch((error) => {
        errorHandle(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [applicantId]);

  const capitalizeWords = (str: string) => {
    if (typeof str !== "string") {
      return "";
    }
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  if (!show) return null;

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
  const nameStr = formData?.email?.applicantDetails?.name ? (
    `${capitalizeWords(formData.email.applicantDetails.name.firstName || "")} 
     ${capitalizeWords(formData.email.applicantDetails.name.middleName || "")} 
     ${capitalizeWords(
       formData.email.applicantDetails.name.lastName || ""
     )}`.trim()
  ) : (
    <Badge count={"N/A"} style={{ backgroundColor: "#f50" }} />
  );

  const emailBccData = formData?.email?.email_bcc;
  return (
    <Modal
      open={show}
      onCancel={onHide}
      footer={null}
      width={800}
      centered
      title={<span className="text-lg font-bold">Email Details</span>}
    >
      {loading ? (
        // <Spin size="large" className="flex items-center justify-center" />
        <Skeleton count={5} />
      ) : formData ? (
        <div className="space-y-4">
          {/* Personal Details */}
          <DetailsCard
            title="Email"
            icon={<MailTwoTone className="text-blue-500" />}
          >
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <DetailsRow
                  label="Full Name"
                  value={
                    nameStr ? (
                      nameStr
                    ) : (
                      <Badge
                        count={"N/A"}
                        style={{ backgroundColor: "#f50" }}
                      />
                    )
                  }
                />
                <DetailsRow
                  label="Skill"
                  value={
                    formData?.email?.applicantDetails?.appliedSkills?.length ? (
                      formData.email.applicantDetails.appliedSkills.map(
                        (skill: string) => (
                          <Tag color="cyan" key={skill}>
                            {skill}
                          </Tag>
                        )
                      )
                    ) : (
                      <Badge
                        count="N/A"
                        style={{ backgroundColor: "#52c41a" }}
                      />
                    )
                  }
                />

                <DetailsRow
                  label="Email"
                  value={
                    formData?.email?.email_to ? (
                      <Tag color="red">{formData?.email?.email_to}</Tag>
                    ) : (
                      <Badge
                        count={"N/A"}
                        style={{ backgroundColor: "#52c41a" }}
                      />
                    )
                  }
                />

                <DetailsRow
                  label="Email BCC"
                  value={
                    Array.isArray(emailBccData) && emailBccData.length > 0 ? (
                      <>
                        {/* Show first 4 emails */}
                        {emailBccData
                          .slice(0, 3)
                          .map((email: string, index: number) => (
                            <Tag
                              key={index}
                              color="magenta"
                              style={{ marginBottom: "4px" }}
                            >
                              {email}
                            </Tag>
                          ))}

                        {/* Show +more as a clickable popover */}
                        {emailBccData.length > 3 && (
                          <Popover
                            content={
                              <div
                                style={{
                                  maxHeight: "200px",
                                  overflowY: "auto",
                                  paddingRight: "10px",
                                  color: "#fff",
                                }}
                              >
                                {emailBccData
                                  .slice(3)
                                  .map((email: string, index: number) => (
                                    <div key={index}>{email},</div>
                                  ))}
                              </div>
                            }
                            title={
                              <span style={{ color: "#fff" }}>
                                More BCC Emails
                              </span>
                            }
                            trigger="click"
                            placement="bottomLeft"
                            overlayInnerStyle={{
                              backgroundColor: "#1f1f1f", // Dark background
                              color: "#fff",
                              borderRadius: "8px",
                              padding: "10px",
                              // textColor: "white",
                            }}
                          >
                            <Tag color="blue" style={{ cursor: "pointer" }}>
                              +{emailBccData.length - 3} more
                            </Tag>
                          </Popover>
                        )}
                      </>
                    ) : (
                      <Badge
                        count="N/A"
                        style={{ backgroundColor: "#faad14" }}
                      />
                    )
                  }
                />

                <DetailsRow
                  label="Subject"
                  value={
                    formData?.email?.subject ? (
                      <Tag color="purple">{formData?.email?.subject}</Tag>
                    ) : (
                      <Badge
                        count={"N/A"}
                        style={{ backgroundColor: "#52c41a" }}
                      />
                    )
                  }
                />

                <DetailsRow
                  label="Description"
                  value={
                    formData?.email?.description ? (
                      <div
                        className="ql-editor"
                        dangerouslySetInnerHTML={{
                          __html: formData.email.description,
                        }}
                      />
                    ) : (
                      "No description provided"
                    )
                  }
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
