/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { errorHandle } from "utils/commonFunctions";

import { EyeFilled } from "@ant-design/icons";
import { Modal, Badge, Card, Row, Col, Tag, Skeleton } from "antd";

import { viewJobById } from "api/apiJob";
// import BaseButton from "components/BaseComponents/BaseButton";

const ViewJob = ({ show, onHide, jobId }: any) => {
  const [formData, setFormData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const loadDetails = async () => {
      if (!jobId) return;
      setLoading(true);

      try {
        const res = await viewJobById(jobId);
        const roleData = res?.data;
        console.log(roleData);
        console.log(res);
        if (res?.success && roleData) {
          setFormData(roleData);
        }
      } catch (error) {
        errorHandle(error);
      } finally {
        setLoading(false);
      }
    };

    loadDetails();
  }, [jobId]);

  console.log(formData);

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
    <p className="mb-[0.8rem] whitespace-nowrap">
      {icon}
      <strong>{label}:</strong> {value || "-"}
    </p>
  );

  return (
    <Modal
      open={show}
      onCancel={onHide}
      footer={null}
      width={900}
      centered
      title={<span className="text-lg font-bold">Detailed Info</span>}
    >
      {loading ? (
        <Skeleton active />
      ) : formData ? (
        <div className="space-y-4">
          {/* Personal Details */}
          <DetailsCard
            title="View Job"
            icon={<EyeFilled className="text-blue-500" />}
          >
            <Row gutter={[24, 24]}>
              <Col span={24}>
                <DetailsRow
                  label="Job ID"
                  value={
                    formData?.job_id ? (
                      <Tag color="purple">{formData?.job_id}</Tag>
                    ) : (
                      <Badge
                        count={"N/A"}
                        style={{ backgroundColor: "#52c41a" }}
                      />
                    )
                  }
                />
                <Row gutter={[16, 16]}>
                  <Col span={16}>
                    <DetailsRow
                      label="Job Subject"
                      value={
                        formData?.job_subject ? (
                          // <div className="flex flex-wrap py-1">
                          <Tag color="geekblue">{formData?.job_subject}</Tag>
                        ) : (
                          // </div>
                          <Badge
                            count={"N/A"}
                            style={{ backgroundColor: "#faad14" }}
                          />
                        )
                      }
                    />
                  </Col>
                </Row>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <DetailsRow
                      label="Minmum Salary"
                      value={
                        formData?.min_salary ? (
                          // <div className="flex flex-wrap py-1">
                          <Tag color="red">{formData?.min_salary}</Tag>
                        ) : (
                          // </div>
                          <Badge
                            count={"N/A"}
                            style={{ backgroundColor: "#faad14" }}
                          />
                        )
                      }
                    />
                  </Col>
                  <Col span={12}>
                    <DetailsRow
                      label="Maximum Salary"
                      value={
                        formData?.max_salary ? (
                          // <div className="flex flex-wrap py-1">
                          <Tag color="green">{formData?.max_salary}</Tag>
                        ) : (
                          // </div>
                          <Badge
                            count={"N/A"}
                            style={{ backgroundColor: "#faad14" }}
                          />
                        )
                      }
                    />
                  </Col>
                </Row>
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <DetailsRow
                      label="Job Type"
                      value={
                        formData?.job_type ? (
                          // <div className="flex flex-wrap py-1">
                          <Tag color="magenta">{formData?.job_type}</Tag>
                        ) : (
                          // </div>
                          <Badge
                            count={"N/A"}
                            style={{ backgroundColor: "#faad14" }}
                          />
                        )
                      }
                    />
                  </Col>
                </Row>
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <DetailsRow
                      label="Contract"
                      value={
                        formData?.contract_duration ? (
                          // <div className="flex flex-wrap py-1">
                          <Tag color="red">{formData?.contract_duration}</Tag>
                        ) : (
                          // </div>
                          <Badge
                            count={"N/A"}
                            style={{ backgroundColor: "#faad14" }}
                          />
                        )
                      }
                    />
                  </Col>
                </Row>
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <DetailsRow
                      label="Time Zone"
                      value={
                        formData?.time_zone ? (
                          // <div className="flex flex-wrap py-1">
                          <Tag color="gold">{formData?.time_zone}</Tag>
                        ) : (
                          // </div>
                          <Badge
                            count={"N/A"}
                            style={{ backgroundColor: "#faad14" }}
                          />
                        )
                      }
                    />
                  </Col>
                </Row>
                <Row gutter={[24, 24]}>
                  <Col span={12}>
                    <DetailsRow
                      label="Start Time"
                      value={
                        formData?.start_time ? (
                          // <div className="flex flex-wrap py-1">
                          <Tag color="cyan">{formData?.start_time}</Tag>
                        ) : (
                          // </div>
                          <Badge
                            count={"N/A"}
                            style={{ backgroundColor: "#faad14" }}
                          />
                        )
                      }
                    />
                  </Col>
                  <Col span={12}>
                    <DetailsRow
                      label="End Time"
                      value={
                        formData?.end_time ? (
                          // <div className="flex flex-wrap py-1">
                          <Tag color="red">{formData?.end_time}</Tag>
                        ) : (
                          // </div>
                          <Badge
                            count={"N/A"}
                            style={{ backgroundColor: "#faad14" }}
                          />
                        )
                      }
                    />
                  </Col>
                </Row>
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <DetailsRow
                      label="Job Details"
                      value={
                        formData?.job_details ? (
                          // <div className="flex flex-wrap py-1">
                          <div
                            className="ql-editor"
                            dangerouslySetInnerHTML={{
                              __html: formData.job_details,
                            }}
                          />
                        ) : (
                          // </div>
                          <Badge
                            count={"N/A"}
                            style={{ backgroundColor: "#faad14" }}
                          />
                        )
                      }
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
            {/* <div className="gap-3 mt-4 d-flex flex-column flex-md-row justify-content-center">
              <BaseButton
                color="primary"
                className="order-0 order-md-1"
                type="submit"
                // onClick={handleSubmit}
              >
                Apply Now
              </BaseButton>
            </div> */}
          </DetailsCard>
        </div>
      ) : null}
    </Modal>
  );
};

export default ViewJob;
