/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { errorHandle } from "utils/commonFunctions";

import Skeleton from "react-loading-skeleton";
import { MailTwoTone } from "@ant-design/icons";
import { Modal, Badge, Card, Row, Col, Tag } from "antd";
import { viewRoleSkillById } from "api/roleApi";

const ViewRoleSkill = ({ show, onHide, applicantId }: any) => {
  const [formData, setFormData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!applicantId) return;

    setLoading(true);

    viewRoleSkillById(applicantId)
      .then((res) => {
        if (res.success) {
          setFormData(res);
        }
      })
      .catch((error) => {
        errorHandle(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [applicantId]);

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
      width={600}
      centered
      title={<span className="text-lg font-bold">Detailed Info</span>}
    >
      {loading ? (
        <Skeleton count={5} />
      ) : formData ? (
        <div className="space-y-4">
          {/* Personal Details */}
          <DetailsCard
            title="View Role And Skill"
            icon={<MailTwoTone className="text-blue-500" />}
          >
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <DetailsRow
                  label="Role"
                  value={
                    formData?.data?.appliedRole ? (
                      <Tag color="purple">{formData?.data?.appliedRole}</Tag>
                    ) : (
                      <Badge
                        count={"N/A"}
                        style={{ backgroundColor: "#52c41a" }}
                      />
                    )
                  }
                />

                <DetailsRow
                  label="Skills"
                  value={
                    formData?.data?.skill?.length > 0 ? (
                      <Tag color="cyan">{formData.data.skill.join(", ")}</Tag>
                    ) : (
                      <Badge
                        count={"N/A"}
                        style={{ backgroundColor: "#faad14" }}
                      />
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

export default ViewRoleSkill;
