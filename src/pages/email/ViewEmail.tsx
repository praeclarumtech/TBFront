/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
// import { Modal } from "react-bootstrap";
import { getEmailDetails } from "api/emailApi";
import { errorHandle } from "utils/commonFunctions";
// import { Typography, Box } from "@mui/material";
// import {
//   FaEnvelope,
//   FaListAlt,
//   FaUserAlt,
//   FaCode,
//   FaRegFileAlt,
// } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import { MailTwoTone } from "@ant-design/icons";
import { Modal, Badge, Card, Row, Col, Tag } from "antd";

const ViewModal = ({ show, onHide, applicantId }: any) => {
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
    <p className="mb-[0.8rem] whitespace-nowrap">
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

  console.log(
    "heloooooooooooooooooooooooooooooooooooooooooo",
    formData?.email?.email_bcc
  );

  const emailBccData = formData?.email?.email_bcc;

  console.log("email_bcc value:", emailBccData); // Debugging log

  const email_bcc =
    Array.isArray(emailBccData) && emailBccData.length > 0
      ? emailBccData.join(", ") // If it's an array, join into a string
      : typeof emailBccData === "string" && emailBccData.trim()
      ? emailBccData.trim() // If it's a valid non-empty string, use it
      : "N/A";

  console.log("email_bcc value:", email_bcc);
  return (
    // <Modal show={show} onHide={onHide} size="lg" centered>
    //   <Modal.Header closeButton>
    //     <Modal.Title>
    //       <Box className=" flex items-center">
    //         <FaEnvelope className="mr-2 text-primary" />
    //         <Typography variant="body1" className="text-gray-600">
    //           <span className=" !text-black">Email</span>
    //         </Typography>
    //       </Box>
    //     </Modal.Title>
    //   </Modal.Header>
    //   <Modal.Body>
    //     {loading ? (
    //       <>
    //       <p>Loading...</p>
    //       <Skeleton  count={5}/>
    //       </>
    //     ) : (
    //       formData && (
    //         <div className="mx-2 p-3">
    //           <Box className="mb-4 flex items-center">
    //             <FaUserAlt className="mr-2 text-primary" />
    //             <Typography variant="body1" className="text-gray-600">
    //               <span className="  !text-black">Name:</span>
    //               <span>
    //                 {" " +
    //                   capitalizeWords(
    //                     formData?.email?.applicantDetails?.name?.firstName || ""
    //                   )}{" "}
    //                 {capitalizeWords(
    //                   formData?.email?.applicantDetails?.name?.middleName || ""
    //                 )}{" "}
    //                 {capitalizeWords(
    //                   formData?.email?.applicantDetails?.name?.lastName || ""
    //                 )}
    //               </span>
    //             </Typography>
    //           </Box>

    //           <Box className="mb-4 flex items-center">
    //             <FaListAlt className="mr-2 text-primary" />
    //             <Typography variant="body1" className="text-gray-600">
    //               <span className=" !text-black">Applied Skills:</span>
    //               <span>
    //                 {formData?.email?.applicantDetails?.appliedSkills?.length >
    //                 0
    //                   ? capitalizeWords(
    //                       " " +
    //                         formData?.email?.applicantDetails?.appliedSkills.join(
    //                           ", "
    //                         )
    //                     )
    //                   : "No skills listed"}
    //               </span>
    //             </Typography>
    //           </Box>

    //           <Box className="mb-4 flex items-center">
    //             <FaEnvelope className="mr-2 text-primary" />
    //             <Typography variant="body1" className="text-gray-600">
    //               <span className=" !text-black">To Email:</span>
    //               <span>{" " + formData?.email?.email_to || "N/A"}</span>
    //             </Typography>
    //           </Box>

    //           <Box className="mb-4 flex items-center">
    //             <FaRegFileAlt className="mr-2 text-primary" />
    //             <Typography variant="body1" className="text-gray-600">
    //               <span className=" !text-black">Bcc Email:</span>
    //               <span>{" " + formData?.email?.email_bcc || "N/A"}</span>
    //             </Typography>
    //           </Box>

    //           <Box className="mb-4 flex items-center">
    //             <FaEnvelope className="mr-2 text-primary" />
    //             <Typography variant="body1" className="text-gray-600">
    //               <span className="  !text-black">Subject:</span>
    //               <span>{" " + formData?.email?.subject || "N/A"}</span>
    //             </Typography>
    //           </Box>

    //           <Box className="mb-4 flex items-center">
    //             <FaCode className="mr-2 text-primary" />
    //             <Typography variant="body1" className="text-gray-600">
    //               <span className=" !text-black">Description:</span>
    //               <span>
    //                 {" " + formData?.email?.description ||
    //                   "No description provided"}
    //               </span>
    //             </Typography>
    //           </Box>
    //         </div>
    //       )
    //     )}
    //   </Modal.Body>
    // </Modal>

    <Modal
      open={show}
      onCancel={onHide}
      footer={null}
      width={800}
      centered
      title={<span className="text-lg font-bold">Email Details</span>}
    >
      {loading ? (
        // <Spin size="large" className="flex justify-center items-center" />
        <Skeleton count={5} />
      ) : formData ? (
        <div className="space-y-4">
          {/* Personal Details */}
          <DetailsCard
            title="Email"
            icon={<MailTwoTone className="text-blue-500" />}
          >
            <Row gutter={[16, 16]}>
              <Col span={12}>
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
                    email_bcc ? (
                      <Tag color="yellow">{email_bcc}</Tag>
                    ) : (
                      <Badge
                        count={"N/A"}
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
                    formData?.email?.description
                      ? formData?.email?.description
                      : "No description provided"
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
