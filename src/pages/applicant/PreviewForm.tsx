/* eslint-disable @typescript-eslint/no-explicit-any */
 
import { Card, Col, Row } from "react-bootstrap";
import { Button, Typography } from "@mui/material";
const PreviewForm = ({ data, onEdit, onSubmit, loading }: any) => {
  return (
    <Card>
      <div>
        <Typography
          variant="h6"
          className="justify-center text-center font-extrabold "
        >
          Preview Your Details
        </Typography>

        <Typography
          variant="h6"
          className="mx-5 font-bold text-2xl !text-blue-600"
        >
          Personal Details:
        </Typography>

        <hr className="!text-blue-900 font-extrabold " />
        <div className="mx-2 p-3">
          <Row>
            <Col xs={12} md={6} className="mb-3">
              <Typography variant="body1" className="text-gray-600">
                <span className="font-extrabold text-base !text-black pt-3">
                  Name:
                </span>
                <span className="">
                  {data.firstName} {data.middleName}
                  {data.lastName}
                </span>
              </Typography>
              <Typography>
                <span className="font-extrabold text-base !text-black pt-3">
                  Phone Number:
                </span>
                <span>{data.phoneNumber}</span>
              </Typography>
              <Typography>
                <span className="font-extrabold text-base !text-black pt-3">
                  Date of Birth:
                </span>
                <span>{data.dateOfBirth}</span>
              </Typography>
              <Typography>
                <span className="font-extrabold text-base !text-black pt-3">
                  Country:
                </span>
                <span>{data.country}</span>
              </Typography>
              <Typography>
                <span className="font-extrabold text-base !text-black pt-3">
                  Pincode:
                </span>
                <span>{data.pincode}</span>
              </Typography>
            </Col>
            <div className="col-md-6">
              <Typography>
                <span className="font-extrabold text-base !text-black pt-3">
                  Email:
                </span>
                <span>{data.email}</span>
              </Typography>
              <Typography>
                <span className="font-extrabold text-base !text-black pt-3">
                  WhatsApp Number:
                </span>
                <span>{data.whatsappNumber}</span>
              </Typography>
              <Typography>
                <span className="font-extrabold text-base !text-black pt-3">
                  Gender :
                </span>
                <span>{data.gender}</span>
              </Typography>
              <Typography>
                <span className="font-extrabold text-base !text-black pt-3">
                  State :
                </span>
                <span>{data.state}</span>
              </Typography>
              <Typography>
                <span className="font-extrabold text-base !text-black pt-3">
                  Full Address:
                </span>
                <span>{data.fullAddress}</span>
              </Typography>
            </div>
          </Row>
        </div>

        <Typography
          variant="h6"
          className="mx-5 font-bold text-2xl !text-blue-600"
        >
          Educational Details:
        </Typography>
        <hr className="text-blue-900 font-extrabold " />
        <div className="mx-2 p-2">
          <Row>
            <Col xs={12} md={6} className="mb-3">
              <Typography variant="body1" className="text-gray-600">
                <span className="font-extrabold text-base !text-black pt-3">
                  Degree:
                </span>
                <span className="">{data.degree}</span>
              </Typography>
              <Typography>
                <span className="font-extrabold text-base !text-black pt-3">
                  Total Experience:
                </span>
                <span>{data.totalExperience}</span>
              </Typography>
              <Typography>
                <span className="font-extrabold text-base !text-black pt-3">
                  Qualification :
                </span>
                <span>{data.qualification}</span>
              </Typography>
              <Typography>
                <span className="font-extrabold text-base !text-black pt-3">
                  Other Skills:
                </span>
                <span>{data.otherSkills}</span>
              </Typography>
              <Typography>
                <span className="font-extrabold text-base !text-black pt-3">
                  Url:
                </span>
                <span>{data.url}</span>
              </Typography>
            </Col>
            <Col xs={12} md={6}>
              <Typography>
                <span className="font-extrabold text-base !text-black pt-3">
                  Passing Year:
                </span>
                <span>{data.passingYear}</span>
              </Typography>
              <Typography>
                <span className="font-extrabold text-base !text-black pt-3">
                  Relevant Skill Experience:
                </span>
                <span>{data.relevantSkillExperience}</span>
              </Typography>
              <Typography>
                <span className="font-extrabold text-base !text-black pt-3">
                  Applied Skills :
                </span>
                <span>
                  {data.appliedSkills?.length > 0
                    ? data.appliedSkills.join(", ")
                    : "No skills listed"}
                </span>
              </Typography>
              <Typography>
                <span className="font-extrabold text-base !text-black pt-3">
                  Referral :
                </span>
                <span>{data.referral}</span>
              </Typography>
              <Typography>
                <span className="font-extrabold text-base !text-black pt-3">
                  Rating:
                </span>
                <span>{data.rating}</span>
              </Typography>
            </Col>
          </Row>
        </div>

        <Typography
          variant="h6"
          className="mx-5 font-bold text-2xl !text-blue-600"
        >
          Job Details:
        </Typography>
        <hr className="text-blue-900 font-extrabold " />
        <div className="mx-2 p-3">
          <Row>
            <Col xs={12} md={6} className="mb-3">
              <Typography variant="body1" className="text-gray-600">
                <span className="font-extrabold text-base !text-black pt-3">
                  Expected Package::
                </span>
                <span className="">{data.expectedPkg}</span>
              </Typography>

              <Typography>
                <span className="font-extrabold text-base !text-black pt-3">
                  Negotiation :
                </span>
                <span>{data.negotiation}</span>
              </Typography>

              <Typography>
                <span className="font-extrabold text-base !text-black pt-3">
                  About Us:
                </span>
                <span>{data.aboutUs}</span>
              </Typography>
              <Typography>
                <span className="font-extrabold text-base !text-black pt-3">
                  Practical Url :
                </span>
                <span>{data.practicalUrl}</span>
              </Typography>
              <Typography>
                <span className="font-extrabold text-base !text-black pt-3">
                  Current Package:
                </span>
                <span>{data.currentPkg}</span>
              </Typography>
            </Col>
            <Col xs={12} md={6}>
              <Typography>
                <span className="font-extrabold text-base !text-black pt-3">
                  Notice Period:
                </span>
                <span>{data.noticePeriod}</span>
              </Typography>
              <Typography>
                <span className="font-extrabold text-base !text-black pt-3">
                  Work Preference:
                </span>
                <span>{data.readyForWork}</span>
              </Typography>
              <Typography>
                <span className="font-extrabold text-base !text-black pt-3">
                  Ready for Work from office :
                </span>
                <span>{data.workPreference}</span>
              </Typography>

              <Typography>
                <span className="font-extrabold text-base !text-black pt-3">
                  Practical Feedback :
                </span>
                <span>{data.practicalFeedback}</span>
              </Typography>
            </Col>
          </Row>
        </div>
      </div>
      <div className="d-flex justify-content-between m-3">
        <Button variant="contained" onClick={() => onEdit(2)}>
          Back
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={onSubmit}
          // disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Application"}
        </Button>
      </div>
    </Card>
  );
};

export default PreviewForm;
