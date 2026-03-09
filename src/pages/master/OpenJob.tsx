import { useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { viewJobById } from "api/apiJob";
// import { EyeFilled } from "@ant-design/icons";
import { Skeleton, Tag, Badge, Row, Col, Card } from "antd";
import { errorHandle } from "utils/commonFunctions";
import BaseButton from "components/BaseComponents/BaseButton";
import { useNavigate } from "react-router-dom";
import { capitalizeWords } from "utils/commonFunctions";
import "react-quill/dist/quill.snow.css";
import { UserOutlined, TeamOutlined } from "@ant-design/icons";

const OpenJob = () => {
  const { id: _id } = useParams();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Check if user is logged in
  const token = localStorage.getItem("authUser");
  const isLoggedIn = !!token && token !== "undefined" && token.trim() !== "";

  const isFromEmail = searchParams.get("source") === "email";

  useEffect(() => {
    const fetchJob = async () => {
      console.log(_id);
      if (!_id) return;
      setLoading(true);
      try {
        const res = await viewJobById({ _id });
        if (res?.success) {
          setFormData(res.data);
        }
      } catch (err) {
        errorHandle(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [_id]);

  const handleApplyAsCandidate = () => {
    // Allow applying with or without login
    navigate("/applicants/applyNow", { state: { jobId: formData._id } });
  };

  const handleApplyAsVendor = () => {
    // Navigate to vendor QR form with job info
    navigate("/vendor/vendor-add-qr-code", {
      state: {
        jobId: formData._id,
        jobInfo: {
          job_id: formData.job_id,
          job_subject: formData.job_subject,
        },
      },
    });
  };

  const DetailsCard = ({
    title,
    icon,
    children,
    className = "",
    style = {},
    hideTitle = false,
  }: {
    title: string;
    icon: JSX.Element;
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    hideTitle?: boolean;
  }) => (
    <Card
      title={
        hideTitle ? null : (
          <div className="flex items-center">
            {icon}
            <span className="ml-2 text-blue-600">{title}</span>
          </div>
        )
      }
      className={`custom-card ${className}`}
      style={style}
    >
      {children}
    </Card>
  );

  const DetailsRow = ({
    label,
    value,
    icon,
  }: {
    label: string;
    value?: string | number | JSX.Element;
    icon?: JSX.Element;
  }) => (
    <div
      className="mb-[0.8rem] d-flex align-items-start flex-wrap"
      style={{ gap: "0.5rem", minWidth: 0 }}
    >
      <span className="flex-shrink-0">
        {icon}
        <strong>{label}:</strong>
      </span>
      <span style={{ wordBreak: "break-word", minWidth: 0 }}>
        {value || "-"}
      </span>
    </div>
  );

  if (loading)
    return (
      <div className="d-flex align-items-center justify-content-center min-h-screen bg-gray-200 p-3">
        <Skeleton active className="w-100" style={{ maxWidth: 800 }} />
      </div>
    );
  if (!formData) return null;

  return (
    <div
      className={`d-flex align-items-center justify-content-center bg-gray-200 p-3 p-md-4 p-lg-5 ${
        isFromEmail ? "" : "min-h-screen"
      }`}
    >
      <Card
        className="d-flex justify-content-center flex-wrap w-100"
        style={{ maxWidth: 800 }}
      >
        <DetailsCard
          title="Job Details"
          style={{ border: "none", boxShadow: "none" }}
          icon={
            <span style={{ fontSize: "20px", marginBottom: "5px" }}>💼</span>
          }
          className="w-100"
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={24} md={12}>
              <DetailsRow
                label="Job ID"
                value={
                  formData?.job_id ? (
                    <Tag color="purple">{formData.job_id}</Tag>
                  ) : (
                    <Badge count="N/A" />
                  )
                }
              />
            </Col>
            <Col xs={24} sm={24} md={12}>
              <DetailsRow
                label="Job Subject"
                value={
                  <div style={{ maxWidth: "100%", wordBreak: "break-word" }}>
                    <Tag
                      color="magenta"
                      style={{
                        whiteSpace: "normal",
                        wordBreak: "break-word",
                        overflowWrap: "break-word",
                        maxWidth: "100%",
                      }}
                    >
                      <span
                        dangerouslySetInnerHTML={{
                          __html: formData.job_subject,
                        }}
                      />
                    </Tag>
                  </div>
                }
              />
            </Col>
            <Col xs={24} sm={24} md={12}>
              <DetailsRow
                label="Job Type"
                value={
                  <Tag color="geekblue">
                    {capitalizeWords(formData.job_type)}
                  </Tag>
                }
              />
            </Col>
            {isLoggedIn ? (
              <>
                <Col xs={24} sm={24} md={12}>
                  <DetailsRow
                    label="Minimum Salary"
                    value={
                      formData?.min_salary != null && formData.min_salary !== "" ? (
                        <Tag color="red">{formData.min_salary}</Tag>
                      ) : (
                        "-"
                      )
                    }
                  />
                </Col>
                <Col xs={24} sm={24} md={12}>
                  <DetailsRow
                    label="Maximum Salary"
                    value={
                      formData?.max_salary != null && formData.max_salary !== "" ? (
                        <Tag color="green">{formData.max_salary}</Tag>
                      ) : (
                        "-"
                      )
                    }
                  />
                </Col>
              </>
            ) : (
              <></>
            )}
            <Col xs={24} sm={24} md={12}>
              <DetailsRow
                label="Time Zone"
                value={
                  formData?.time_zone != null && formData.time_zone !== "" ? (
                    <Tag color="red">{formData.time_zone}</Tag>
                  ) : (
                    "-"
                  )
                }
              />
            </Col>
            <Col xs={24} sm={24} md={12}>
              <DetailsRow
                label="Contract Duration"
                value={<Tag color="gold">{formData.contract_duration}</Tag>}
              />
            </Col>
            <Col xs={24} sm={24} md={12}>
              <DetailsRow
                label="Start Time"
                value={<Tag color="cyan">{formData.start_time}</Tag>}
              />
            </Col>
            <Col xs={24} sm={24} md={12}>
              <DetailsRow
                label="End Time"
                value={<Tag color="red">{formData.end_time}</Tag>}
              />
            </Col>
            <Col xs={24}>
              <DetailsRow
                label="Job Description"
                value={
                  <div
                    className="ql-editor"
                    style={{
                      wordBreak: "break-word",
                      overflowWrap: "break-word",
                      whiteSpace: "pre-wrap",
                      width: "100%",
                    }}
                    dangerouslySetInnerHTML={{
                      __html: formData.sub_description || "",
                    }}
                  />
                }
              />
            </Col>
            <Col xs={24}>
              <DetailsRow
                label="Job Details"
                value={
                  <div style={{ maxWidth: "100%", overflowX: "auto", width: "100%" }}>
                    <div
                      className="ql-editor prose prose-sm max-w-none"
                      style={{
                        padding: 0,
                        overflowWrap: "break-word",
                        wordWrap: "break-word",
                      }}
                      dangerouslySetInnerHTML={{
                        __html: formData.job_details || "",
                      }}
                    />
                  </div>
                }
              />
            </Col>
          </Row>
          {(!isLoggedIn || isFromEmail) && (
            <div
              className="p-3 mt-4 rounded d-flex align-items-center justify-content-center text-center"
              style={{
                backgroundColor: "#e7f3ff",
                border: "1px solid #b3d7ff",
                flexWrap: "wrap",
                wordBreak: "break-word",
              }}
            >
              <span style={{ color: "#495057" }}>
                📧 For queries, contact HR:{" "}
                <a
                  href={`mailto:${formData.hrEmail}?subject=Query about Job: ${
                    formData?.job_subject || formData?.job_id
                  }`}
                  style={{
                    color: "#0056b3",
                    fontWeight: "600",
                    textDecoration: "none",
                  }}
                >
                  {formData.hrEmail}
                </a>
              </span>
            </div>
          )}

          <div
            className="d-flex flex-column flex-sm-row justify-content-center align-items-stretch align-items-sm-center gap-2 gap-sm-3 mt-4"
            style={{ maxWidth: "100%" }}
          >
            {!isFromEmail && (
              <>
                <BaseButton
                  color="success"
                  onClick={handleApplyAsCandidate}
                  className="d-flex align-items-center justify-content-center gap-2"
                >
                  <UserOutlined /> Apply as Candidate
                </BaseButton>
                <BaseButton
                  color="primary"
                  onClick={handleApplyAsVendor}
                  className="d-flex align-items-center justify-content-center gap-2"
                >
                  <TeamOutlined /> Apply as Vendor
                </BaseButton>
              </>
            )}
          </div>
        </DetailsCard>
      </Card>
    </div>
  );
};

export default OpenJob;
