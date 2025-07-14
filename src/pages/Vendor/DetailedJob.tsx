import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { viewJobById } from "api/apiJob";
// import { EyeFilled } from "@ant-design/icons";
import {
  Skeleton,
  Tag,
  // Badge,
  Row,
  Col,
  Card,
} from "antd";
import { errorHandle } from "utils/commonFunctions";
import BaseButton from "components/BaseComponents/BaseButton";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const DetailedJob = () => {
  const { id: _id } = useParams();
  const location = useLocation();
  const isFromAppliedJob = location.state?.from === "/appliedJobList";
  const [formData, setFormData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchJob = async () => {
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

  const token = localStorage.getItem("authUser");
  const isLoggedIn = !!token && token !== "undefined" && token.trim() !== "";

  const handleNavigate = () => {
    // navigate("/Vendor/applyNow");
    if (!isLoggedIn) {
      navigate("/login", { state: { from: location.pathname } }); // 👈 Or your specific login route
    } else {
      navigate("/Vendor/applyNow", { state: { jobId: formData._id } });
    }
  };

  const DetailsCard = ({
    title,
    icon,
    children,
    className = "",
    style = {},
  }: {
    title: string;
    icon: JSX.Element;
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
  }) => (
    <Card
      title={
        <div className="flex items-center">
          {icon}
          <span className="ml-2 text-blue-600">{title}</span>
        </div>
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
    <p className="mb-[0.8rem] whitespace-nowrap">
      {icon}
      <strong>{label}:</strong> {value || "-"}
    </p>
  );

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-200">
        <Skeleton active className="max-w-[800px]" />
      </div>
    );
  if (!formData) return null;

  return (
    <>
      <div className="items-center justify-center min-h-screen bg-gray-200 d-flex">
        <Card className="max-w-[800px]  d-flex justify-content-center ">
          <DetailsCard
            title="Job Details"
            style={{ border: "none", boxShadow: "none" }}
            icon={
              <span style={{ fontSize: "20px", marginBottom: "5px" }}>💼</span>
            }
          >
            <Row gutter={[16, 16]}>
              {/* <Col  xs={24} md={12}>
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
              </Col>*/}
              <Col xs={24} md={24}>
                <DetailsRow
                  label="Job Subject"
                  value={
                    <div style={{ maxWidth: "100%", wordBreak: "break-word" }}>
                      <div
                        // color="magenta"
                        style={{
                          display: "inline-block",
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
                      </div>
                    </div>
                  }
                />
              </Col>

              {/* </Col> */}

              <Col xs={24} md={12}>
                <DetailsRow
                  label="Time Zone"
                  value={<Tag color="red">{formData.time_zone}</Tag>}
                />
              </Col>
              <Col xs={24} md={12}>
                <DetailsRow
                  label="Contract Duration"
                  value={<Tag color="gold">{formData.contract_duration}</Tag>}
                />
              </Col>
              <Col xs={24} md={12}>
                <DetailsRow
                  label="Location"
                  value={<Tag color="cyan">{formData.job_location}</Tag>}
                />
              </Col>
              <Col xs={24} md={12}>
                <DetailsRow
                  label="Job Type"
                  value={<Tag color="geekblue">{formData.job_type}</Tag>}
                />
              </Col>
              <Col xs={24} md={12}>
                <DetailsRow
                  label="Start Time"
                  value={<Tag color="lime">{formData.start_time}</Tag>}
                />
              </Col>
              <Col xs={24} md={12}>
                <DetailsRow
                  label="End Time"
                  value={<Tag color="orange">{formData.end_time}</Tag>}
                />
              </Col>
              <Col xs={24} md={12}>
                <DetailsRow
                  label="Posting Date"
                  value={
                    <>
                      <Tag color="geekblue">
                        {formData.createdAt &&
                        !isNaN(new Date(formData.createdAt).getTime())
                          ? new Date(formData.createdAt)
                              .toISOString()
                              .slice(0, 10)
                          : "N/A"}
                      </Tag>
                    </>
                  }
                />
              </Col>
              <Col xs={24} md={12}>
                <DetailsRow
                  label="Deadline"
                  value={
                    <>
                      <Tag color="red">
                        {formData.application_deadline &&
                        !isNaN(
                          new Date(formData.application_deadline).getTime()
                        )
                          ? new Date(formData.application_deadline)
                              .toISOString()
                              .slice(0, 10)
                          : "N/A"}
                      </Tag>
                    </>
                  }
                />
              </Col>
              <Col xs={24} md={8}>
                <DetailsRow
                  label="Minimum Salary"
                  value={<Tag color="red">{formData.min_salary}</Tag>}
                />
              </Col>
              <Col xs={24} md={8}>
                <DetailsRow
                  label="Maximum Salary"
                  value={<Tag color="green">{formData.max_salary}</Tag>}
                />
              </Col>
              <Col xs={24} md={8}>
                <DetailsRow
                  label="Currency"
                  value={<Tag color="orange">{formData.salary_currency}</Tag>}
                />
              </Col>
              <Col xs={24} md={12}>
                <DetailsRow
                  label="Required Skills"
                  value={formData.required_skills?.map((skill: string) => (
                    <Tag key={skill} color="purple">
                      {skill}
                    </Tag>
                  ))}
                />
              </Col>
              <Col span={24}>
                <DetailsRow
                  label="Job Details"
                  value={
                    <div
                      className="ql-editor"
                      dangerouslySetInnerHTML={{ __html: formData.job_details }}
                    />
                  }
                />
              </Col>
            </Row>

            <div className="flex justify-center gap-4 mt-4">
              <BaseButton
                type="button"
                color="secondary"
                onClick={() => navigate(-1)} // go back one step in history
                // className="text-sm font-medium"
              >
                Back
              </BaseButton>
              <BaseButton
                color="primary"
                onClick={handleNavigate}
                disabled={isFromAppliedJob}
              >
                {isFromAppliedJob ? "Applied" : "Apply Now"}
              </BaseButton>
            </div>
          </DetailsCard>
        </Card>
      </div>
    </>
  );
};

export default DetailedJob;
