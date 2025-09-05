/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { errorHandle } from "utils/commonFunctions";

import { EyeFilled } from "@ant-design/icons";
import { Modal, Badge, Card, Row, Col, Tag, Skeleton, Result } from "antd";

import { viewJobById } from "api/apiJob";
// import BaseButton from "components/BaseComponents/BaseButton";

interface JobDetails {
  job_id?: string;
  job_subject?: string;
  min_salary?: number;
  max_salary?: number;
  job_type?: string;
  contract_duration?: string;
  time_zone?: string;
  job_location?: string;
  start_time?: string;
  end_time?: string;
  required_skills?: string[];
  job_details?: string;
}

const ViewJd = ({ show, onHide, _id }: any) => {
  console.log("id in modal:-", _id);
  const [formData, setFormData] = useState<JobDetails>({});
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const loadDetails = async () => {
      if (!_id) return;
      setLoading(true);

      try {
        const res = await viewJobById({ _id });
        const roleData = res?.data;

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
  }, [_id]);

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
      width={800}
      centered
      title={<span className="text-lg font-bold">Detailed Info</span>}
    >
      {loading ? (
        <Skeleton active />
      ) : formData ? (
        <div className="space-y-4">
          {/* Personal Details */}
          <DetailsCard
            title="View Job Description"
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
          </DetailsCard>
        </div>
      ) : (
        <Result title="No Job Data Found" />
      )}
    </Modal>
  );
};

export default ViewJd;
