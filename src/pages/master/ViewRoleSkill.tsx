/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { errorHandle } from "utils/commonFunctions";

import Skeleton from "react-loading-skeleton";
import { EyeFilled } from "@ant-design/icons";
import { Modal, Badge, Card, Row, Col, Tag } from "antd";
import { viewRoleSkillById } from "api/roleApi";
import { ViewAppliedSkills } from "api/skillsApi";

const ViewRoleSkill = ({ show, onHide, applicantId }: any) => {
  const [formData, setFormData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const loadDetails = async () => {
      if (!applicantId) return;
      setLoading(true);

      try {
        // 1. Fetch all skills
        const skillsRes = await ViewAppliedSkills({
          page: 1,
          pageSize: 50,
          limit: 500,
        });
        const allSkills = skillsRes?.data?.data || [];

        // 2. Fetch role and skill IDs
        const roleSkillRes = await viewRoleSkillById(applicantId);
        const roleData = roleSkillRes?.data;
        if (roleSkillRes?.success && roleData) {
          // ✅ Map skill IDs to names
          const mappedSkills = roleData.skill?.map((skillId: string) => {
            const match = allSkills.find((skill: any) => skill._id === skillId);
            return match ? match.skills : "Unknown Skill";
          });

          const fullData = {
            ...roleData,
            skill: mappedSkills,
          };

          setFormData(fullData);
        }
      } catch (error) {
        errorHandle(error);
      } finally {
        setLoading(false);
      }
    };

    loadDetails();
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
            icon={<EyeFilled className="text-blue-500" />}
          >
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <DetailsRow
                  label="Role"
                  value={
                    formData?.appliedRole ? (
                      <Tag color="purple">{formData?.appliedRole}</Tag>
                    ) : (
                      <Badge
                        count={"N/A"}
                        style={{ backgroundColor: "#52c41a" }}
                      />
                    )
                  }
                />
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <DetailsRow
                      label="Skills"
                      value={
                        formData?.skill?.length > 0 ? (
                          <div className="flex flex-wrap py-1">
                            {formData.skill.map((skills: string) => (
                              <Tag color="cyan">{skills}</Tag>
                            ))}
                          </div>
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
              </Col>
            </Row>
          </DetailsCard>
        </div>
      ) : null}
    </Modal>
  );
};

export default ViewRoleSkill;
