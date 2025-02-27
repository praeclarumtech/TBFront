/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { Col, Modal, Row } from "react-bootstrap";
import { getApplicantDetails } from "api/applicantApi";
import { errorHandle } from "components/helpers/service";
import { Typography } from "@mui/material";

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
              {/* Personal Details */}
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
                      {formData.name?.firstName} {formData.name?.middleName}{" "}
                      {formData.name?.lastName}
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
                    <span> {formData.gender}</span>
                  </Typography>
                  <Typography className="mt-2">
                    <span className="font-extrabold text-base text-black">
                      Full Address:
                    </span>
                    <span> {formData.fullAddress}</span>
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
                    <span> {formData.state}</span>
                  </Typography>
                  <Typography className="mt-2">
                    <span className="font-extrabold text-base text-black">
                      Country:
                    </span>
                    <span> {formData.country}</span>
                  </Typography>
                  <Typography className="mt-2">
                    <span className="font-extrabold text-base text-black">
                      City:
                    </span>
                    <span> {formData.city}</span>
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
                    <span> {formData.qualification}</span>
                  </Typography>
                  <Typography className="mt-2">
                    <span className="font-extrabold text-base text-black">
                      Degree:
                    </span>
                    <span> {formData.degree}</span>
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
                        ? formData.appliedSkills.join(", ")
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
                    <span> {formData.otherSkills}</span>
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
                    <span> {formData.readyForWork}</span>
                  </Typography>
                </Col>

                <Col xs={12} md={6} className="mb-3">
                  <Typography className="mt-2">
                    <span className="font-extrabold text-base text-black">
                      Work Preference:
                    </span>
                    <span> {formData.workPreference}</span>
                  </Typography>
                  <Typography className="mt-2">
                    <span className="font-extrabold text-base text-black">
                      Referral:
                    </span>
                    <span> {formData.referral}</span>
                  </Typography>
                  <Typography className="mt-2">
                    <span className="font-extrabold text-base text-black">
                      Interview Stage:
                    </span>
                    <span> {formData.interviewStage}</span>
                  </Typography>
                  <Typography className="mt-2">
                    <span className="font-extrabold text-base text-black">
                      Status:
                    </span>
                    <span> {formData.status}</span>
                  </Typography>
                  <Typography className="mt-2">
                    <span className="font-extrabold text-base text-black">
                      About Us:
                    </span>
                    <span> {formData.aboutUs}</span>
                  </Typography>
                </Col>
              </Row>

              {/* Portfolio URL */}
              <Typography className="mt-2">
                <span className="font-extrabold text-base text-black">
                  Portfolio URL:
                </span>
                <a
                  href={formData.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  {formData.url}
                </a>
              </Typography>
            </div>
          )
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ViewModal;
