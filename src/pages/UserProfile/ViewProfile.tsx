/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";

import Skeleton from "react-loading-skeleton";
import { CheckOutlined, CloseOutlined, EyeFilled } from "@ant-design/icons";
import { Modal, Badge, Card, Row, Col, Tag, Switch } from "antd";

import { viewProfile } from "api/usersApi";
import { toast } from "react-toastify";

const ViewProfile = ({ show, onHide, _id }: any) => {
  const [formData, setFormData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  console.log(_id);
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await viewProfile(_id);
        setFormData(response?.data);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "An error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
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
            title="View User Information"
            icon={<EyeFilled className="text-blue-500" />}
          >
            <Row gutter={[24, 24]}>
              <Col span={12}>
                <DetailsRow
                  label="Email"
                  value={
                    formData?.email ? (
                    //   <Tag color="purple">
                        <a
                          href={`mailto:${formData?.email}`}
                          className="hover:underline"
                        >
                          {formData?.email}
                        </a>
                    //   </Tag>
                    ) : (
                      <Badge
                        count={"N/A"}
                        style={{ backgroundColor: "#52c41a" }}
                      />
                    )
                  }
                />
              </Col>
            </Row>
            <Row gutter={[24, 24]}>
              <Col span={12}>
                <DetailsRow
                  label="User-Name"
                  value={
                    formData?.userName ? (
                      <Tag color="cyan">{formData?.userName}</Tag>
                    ) : (
                      <Badge
                        count={"N/A"}
                        style={{ backgroundColor: "#52c41a" }}
                      />
                    )
                  }
                />
              </Col>
              <Col span={12}>
                <DetailsRow
                  label="Role"
                  value={
                    formData?.role ? (
                      <Tag color="magenta">{formData?.role}</Tag>
                    ) : (
                      <Badge
                        count={"N/A"}
                        style={{ backgroundColor: "#52c41a" }}
                      />
                    )
                  }
                />
              </Col>
            </Row>
            <Col span={12}>
              <DetailsRow
                label="Designation"
                value={
                  formData?.designation ? (
                    <Tag color="geekblue">{formData?.designation}</Tag>
                  ) : (
                    <Badge
                      count={"N/A"}
                      style={{ backgroundColor: "#52c41a" }}
                    />
                  )
                }
              />
            </Col>
            <Col span={12}>
              <DetailsRow
                label="Birthday"
                value={
                  formData?.dateOfBirth ? (
                    <Tag color="geekblue">
                      {
                        new Date(formData.dateOfBirth)
                          .toISOString()
                          .split("T")[0]
                      }
                    </Tag>
                  ) : (
                    <Badge
                      count={"N/A"}
                      style={{ backgroundColor: "#52c41a" }}
                    />
                  )
                }
              />
            </Col>

            <Col span={12}>
              <DetailsRow
                label="User IsActive"
                value={
                  formData?.isActive ? (
                    <Switch
                      size="small"
                      checked={formData?.isActive}
                      //   onClick={() => handleUpdateUserStatusModal(id, isActive)} // ✅ Handler only runs on user interaction
                      checkedChildren={<CheckOutlined />}
                      unCheckedChildren={<CloseOutlined />}
                      disabled
                    />
                  ) : (
                    <Badge
                      count={"N/A"}
                      style={{ backgroundColor: "#52c41a" }}
                    />
                  )
                }
              />
            </Col>
          </DetailsCard>
        </div>
      ) : null}
    </Modal>
  );
};

export default ViewProfile;
