import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { viewJobById } from "api/apiJob";
// import { EyeFilled } from "@ant-design/icons";
import { Skeleton, Tag, Badge, Row, Col, Card } from "antd";
import { errorHandle } from "utils/commonFunctions";
import BaseButton from "components/BaseComponents/BaseButton";
import { useNavigate } from "react-router-dom";
const OpenJob = () => {
  const { id: _id } = useParams();
  const [formData, setFormData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
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
  const handleNavigate = () => {
    // navigate("/applicants/applyNow");
    navigate("/applicants/applyNow", { state: { jobId: formData.job_id } });
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
        <Skeleton active className="w-[800px]" />
      </div>
    );
  if (!formData) return null;

  return (
    <div className="items-center justify-center min-h-screen p-6 bg-gray-200 d-flex">
      <Card className="w-[800px]  d-flex justify-content-center flex flex-wrap">
        <DetailsCard
          title="Job Details"
          style={{ border: "none", boxShadow: "none" }}
          icon={
            <span style={{ fontSize: "20px", marginBottom: "5px" }}>💼</span>
          }
          className="w-[800px] "
        >
          <Row gutter={[16, 16]}>
            <Col span={24}>
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
            <Col span={24}>
              <DetailsRow
                label="Job Subject"
                // value={<Tag color="magenta">{formData.job_subject}</Tag>}
                value={
                  <div style={{ maxWidth: "100%", wordBreak: "break-word" }}>
                    <Tag
                      color="magenta"
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
                    </Tag>
                  </div>
                }
              />
            </Col>
            <Col span={24}>
              <DetailsRow
                label="Job Type"
                value={<Tag color="geekblue">{formData.job_type}</Tag>}
              />
            </Col>
            <Col span={12}>
              <DetailsRow
                label="Minimum Salary"
                value={<Tag color="red">{formData.min_salary}</Tag>}
              />
            </Col>
            <Col span={12}>
              <DetailsRow
                label="Maximum Salary"
                value={<Tag color="green">{formData.max_salary}</Tag>}
              />
            </Col>
            <Col span={12}>
              <DetailsRow
                label="Time Zone"
                value={<Tag color="red">{formData.time_zone}</Tag>}
              />
            </Col>
            <Col span={12}>
              <DetailsRow
                label="Contract Duration"
                value={<Tag color="gold">{formData.contract_duration}</Tag>}
              />
            </Col>
            <Col span={12}>
              <DetailsRow
                label="Start Time"
                value={<Tag color="cyan">{formData.start_time}</Tag>}
              />
            </Col>
            <Col span={12}>
              <DetailsRow
                label="End Time"
                value={<Tag color="red">{formData.end_time}</Tag>}
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
          <div className="flex justify-center mt-4">
            <BaseButton color="primary" onClick={handleNavigate}>
              Apply Now
            </BaseButton>
          </div>
        </DetailsCard>
      </Card>
    </div>
  );
};

export default OpenJob;
