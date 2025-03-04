/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Col, Modal, Row } from "react-bootstrap";
import { getApplicantDetails } from "api/applicantApi";
import { Typography } from "@mui/material";
import { errorHandle } from "utils/commonFunctions";

const ViewModal = ({ show, onHide, applicantId }: any) => {
  const [formData, setFormData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!applicantId) return;

    setLoading(true);

    getApplicantDetails(applicantId)
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
  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Applicant Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <p>Loading...</p>
        ) : (
          formData && (
            <div className="mx-2 p-3">
              <Typography
                variant="h6"
                className="font-bold text-2xl text-blue-600"
              >
                <i className="fa fa-user m-2" />
                Personal Details:
              </Typography>
              <hr className="text-blue-900 font-extrabold mb-4" />
              <Row>
                <Col xs={12} md={6} className="mb-3">
                  <Typography variant="body1" className="text-gray-700">
                    <span className="font-extrabold text-base text-black">
                      Name:
                    </span>
                    <span>
                      {" " + capitalizeWords(formData.name?.firstName + " ")}
                      {capitalizeWords(formData.name?.middleName + " ")}{" "}
                      {capitalizeWords(formData.name?.lastName)}
                    </span>
                  </Typography>
                  <Typography className="mt-2">
                    <span className="font-extrabold text-base text-black">
                      Phone Number:
                    </span>
                    <span> {formData.phone.phoneNumber}</span>
                  </Typography>
                  <Typography className="mt-2">
                    <span className="font-extrabold text-base text-black">
                      WhatsApp Number:
                    </span>
                    <span> {formData.phone.whatsappNumber}</span>
                  </Typography>
                  <Typography className="mt-2">
                    <span className="font-extrabold text-base text-black">
                      Date of Birth:
                    </span>
                    <span>
                      {new Date(formData.dateOfBirth).toLocaleDateString()}
                    </span>
                  </Typography>
                  <Typography className="mt-2">
                    <span className="font-extrabold text-base text-black">
                      Gender:
                    </span>
                    <span> {capitalizeWords(formData.gender)}</span>
                  </Typography>
                  <Typography className="mt-2">
                    <span className="font-extrabold text-base text-black">
                      Full Address:
                    </span>
                    <span> {capitalizeWords(formData.fullAddress)}</span>
                  </Typography>
                </Col>

                <Col xs={12} md={6} className="mb-3">
                  <Typography className="mt-2">
                    <span className="font-extrabold text-base text-black">
                      Email:
                    </span>
                    <span> {formData.email}</span>
                  </Typography>

                  <Typography className="mt-2">
                    <span className="font-extrabold text-base text-black">
                      State:
                    </span>
                    <span> {capitalizeWords(formData.state)}</span>
                  </Typography>
                  <Typography className="mt-2">
                    <span className="font-extrabold text-base text-black">
                      Country:
                    </span>
                    <span> {capitalizeWords(formData.country)}</span>
                  </Typography>
                  <Typography className="mt-2">
                    <span className="font-extrabold text-base text-black">
                      City:
                    </span>
                    <span> {capitalizeWords(formData.city)}</span>
                  </Typography>
                  <Typography className="mt-2">
                    <span className="font-extrabold text-base text-black">
                      Pincode:
                    </span>
                    <span> {formData.pincode}</span>
                  </Typography>
                </Col>
              </Row>

              {/* Educational Details */}
              <Typography
                variant="h6"
                className="font-bold text-2xl text-blue-600"
              >
                <i className="fa fa-graduation-cap m-2" />
                Educational Details:
              </Typography>
              <hr className="text-blue-900 font-extrabold" />
              <Row>
                <Col xs={12} md={6} className="mb-3">
                  <Typography className="mt-2">
                    <span className="font-extrabold text-base text-black">
                      Qualification:
                    </span>
                    <span> {capitalizeWords(formData.qualification)}</span>
                  </Typography>
                  <Typography className="mt-2">
                    <span className="font-extrabold text-base text-black">
                      Degree:
                    </span>
                    <span> {capitalizeWords(formData.degree)}</span>
                  </Typography>
                  <Typography className="mt-2">
                    <span className="font-extrabold text-base text-black">
                      Passing Year:
                    </span>
                    <span> {formData.passingYear}</span>
                  </Typography>

                  <Typography className="mt-2">
                    <span className="font-extrabold text-base text-black">
                      Applied Skills:
                    </span>
                    <span>
                      {formData.appliedSkills?.length > 0
                        ? capitalizeWords(formData.appliedSkills.join(", "))
                        : "No skills listed"}
                    </span>
                  </Typography>
                </Col>

                <Col xs={12} md={6} className="mb-3">
                  <Typography className="mt-2">
                    <span className="font-extrabold text-base text-black">
                      Total Experience (in months):
                    </span>
                    <span> {formData.totalExperience}</span>
                  </Typography>
                  <Typography className="mt-2">
                    <span className="font-extrabold text-base text-black">
                      Relevant Skill Experience:
                    </span>
                    <span> {formData.relevantSkillExperience}</span>
                  </Typography>
                  <Typography className="mt-2">
                    <span className="font-extrabold text-base text-black">
                      Other Skills:
                    </span>
                    <span> {capitalizeWords(formData.otherSkills)}</span>
                  </Typography>
                </Col>
              </Row>

              {/* Job Details */}
              <Typography
                variant="h6"
                className="font-bold text-2xl text-blue-600"
              >
                <i className="fa fa-briefcase m-2" />
                Job Details:
              </Typography>
              <hr className="text-blue-900 font-extrabold" />
              <Row>
                <Col xs={12} md={6} className="mb-3">
                  <Typography className="mt-2">
                    <span className="font-extrabold text-base text-black">
                      Current Package:
                    </span>
                    <span> {formData.currentPkg}</span>
                  </Typography>
                  <Typography className="mt-2">
                    <span className="font-extrabold text-base text-black">
                      Expected Package:
                    </span>
                    <span> {formData.expectedPkg}</span>
                  </Typography>
                  <Typography className="mt-2">
                    <span className="font-extrabold text-base text-black">
                      Notice Period:
                    </span>
                    <span> {formData.noticePeriod}</span>
                  </Typography>
                  <Typography className="mt-2">
                    <span className="font-extrabold text-base text-black">
                      Negotiation:
                    </span>
                    <span> {formData.negotiation}</span>
                  </Typography>
                  <Typography className="mt-2">
                    <span className="font-extrabold text-base text-black">
                      Ready for Work (WFO):
                    </span>
                    <span> {capitalizeWords(formData.readyForWork)}</span>
                  </Typography>
                </Col>

                <Col xs={12} md={6} className="mb-3">
                  <Typography className="mt-2">
                    <span className="font-extrabold text-base text-black">
                      Work Preference:
                    </span>
                    <span> {capitalizeWords(formData.workPreference)}</span>
                  </Typography>
                  <Typography className="mt-2">
                    <span className="font-extrabold text-base text-black">
                      Referral:
                    </span>
                    <span> {capitalizeWords(formData.referral)}</span>
                  </Typography>
                  <Typography className="mt-2">
                    <span className="font-extrabold text-base text-black">
                      Interview Stage:
                    </span>
                    <span className="font-bold text-primary ">
                      {" " + capitalizeWords(formData.interviewStage)}
                    </span>
                  </Typography>
                  <Typography className="mt-2">
                    <span className="font-extrabold text-base text-black">
                      Status:
                    </span>
                    <span className="font-bold text-primary ">
                      {" " + capitalizeWords(formData.status)}
                    </span>
                  </Typography>
                </Col>
                <Col xs={12} md={12} sm={12} lg={12}>
                  <Typography className="mt-2">
                    <span className="font-extrabold text-base text-black">
                      About Us:
                    </span>
                    <span> {capitalizeWords(formData.aboutUs)}</span>
                  </Typography>
                  <Typography className="mt-2">
                    <span className="font-extrabold text-base text-black">
                      Resume URL:
                    </span>
                    <a
                      href={formData.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 "
                    >
                      {formData.resumeUrl}
                    </a>
                  </Typography>
                  <Typography className="mt-2">
                    <span className="font-extrabold text-base text-black">
                      Portfolio URL:
                    </span>
                    <a 
                      href={formData.portfolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600"
                    >
                      {formData.portfolioUrl}
                    </a>
                  </Typography>
                  <Typography className="mt-2">
                    <span className="font-extrabold text-base text-black">
                      Practical URL:
                    </span>
                    <a
                      href={formData.practicalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 "
                    >
                      {formData.practicalUrl}
                    </a>
                  </Typography>
                </Col>
              </Row>
            </div>
          )
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ViewModal;
