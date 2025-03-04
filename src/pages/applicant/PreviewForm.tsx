/* eslint-disable @typescript-eslint/no-explicit-any */

import { Col, Row } from "react-bootstrap";

import BaseButton from "components/BaseComponents/BaseButton";
import { Typography } from "@mui/material";

const PreviewForm = ({ data, onEdit, onSubmit, loading }: any) => {
  const capitalizeWords = (str: string) => {
    if (typeof str !== "string") {
      return "";
    }
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  return (
    <>
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
          <i className="fa fa-user mr-1 "> </i>
          <span>Personal Details:</span>
        </Typography>

        <hr className="!text-blue-900 font-extrabold " />
        <div className="mx-2 p-3">
          <Row className="mx-2">
            <Col xs={12} md={6} className="mb-3">
              <Typography variant="body1" className="text-gray-600">
                <span className="font-extrabold text-base !text-black pt-3">
                  Name:
                </span>
                <span className="">
                  {" " + capitalizeWords(data.firstName)}{" "}
                  {" " + capitalizeWords(data.middleName)}
                  {" " + capitalizeWords(data.lastName)}
                </span>
              </Typography>
              <Typography>
                <span className="font-extrabold text-base !text-black pt-3">
                  Phone Number:
                </span>
                <span>{" " + data.phoneNumber}</span>
              </Typography>
              <Typography>
                <span className="font-extrabold text-base !text-black pt-3">
                  Date of Birth:
                </span>
                <span>{" " + data.dateOfBirth}</span>
              </Typography>
              <Typography>
                <span className="font-extrabold text-base !text-black pt-3">
                  Country:
                </span>
                <span>{" " + capitalizeWords(data.country)}</span>
              </Typography>
              <Typography>
                <span className="font-extrabold text-base !text-black pt-3">
                  Pincode:
                </span>
                <span>{" " + data.pincode}</span>
              </Typography>
            </Col>
            <div className="col-md-6">
              <Typography>
                <span className="font-extrabold text-base !text-black pt-3">
                  Email:
                </span>
                <span>{" " + data.email}</span>
              </Typography>
              <Typography>
                <span className="font-extrabold text-base !text-black pt-3">
                  WhatsApp Number:
                </span>
                <span>{" " + data.whatsappNumber}</span>
              </Typography>
              <Typography>
                <span className="font-extrabold text-base !text-black pt-3">
                  Gender :
                </span>
                <span>{" " + capitalizeWords(data.gender)}</span>
              </Typography>
              <Typography>
                <span className="font-extrabold text-base !text-black pt-3">
                  State :
                </span>
                <span>{" " + data.state}</span>
              </Typography>
              <Typography>
                <span className="font-extrabold text-base !text-black pt-3">
                  Full Address:
                </span>
                <span>{" " + capitalizeWords(data.fullAddress)}</span>
              </Typography>
            </div>
          </Row>
        </div>

        <Typography
          variant="h6"
          className="mx-5 font-bold text-2xl !text-blue-600"
        >
          <i className="fa fa-book  mr-1 "> </i>
          Educational Details:
        </Typography>
        <hr className="text-blue-900 font-extrabold " />
        <div className="mx-2 p-2">
          <Row className="mx-2">
            <Col xs={12} md={6} className="mb-3  ">
              <Typography variant="body1" className="text-gray-600">
                <span className="font-extrabold text-base !text-black pt-3">
                  Degree:
                </span>
                <span className="">{" " + capitalizeWords(data.degree)}</span>
              </Typography>
              <Typography>
                <span className="font-extrabold text-base !text-black pt-3">
                  Total Experience:
                </span>
                <span>{" " + data.totalExperience}</span>
              </Typography>
              <Typography>
                <span className="font-extrabold text-base !text-black pt-3">
                  Qualification :
                </span>
                <span>{" " + capitalizeWords(data.qualification)}</span>
              </Typography>
              <Typography>
                <span className="font-extrabold text-base !text-black pt-3">
                  Other Skills:
                </span>
                <span>{" " + capitalizeWords(data.otherSkills)}</span>
              </Typography>
              <Typography>
                <span className="font-extrabold text-base !text-black pt-3">
                  Javascript Rating:
                </span>
                <span>{" " + data.rating}</span>
              </Typography>
              <Typography>
                <span className="font-extrabold text-base !text-black pt-3">
                  Designation :
                </span>
                <span>{" " + data.designation}</span>
              </Typography>
            </Col>

            <Col xs={12} md={6}>
              <Typography>
                <span className="font-extrabold text-base !text-black pt-3">
                  Passing Year:
                </span>
                <span>{" " + data.passingYear}</span>
              </Typography>
              <Typography>
                <span className="font-extrabold text-base !text-black pt-3">
                  Relevant Skill Experience:
                </span>
                <span>{" " + data.relevantSkillExperience}</span>
              </Typography>
              <Typography>
                <span className="font-extrabold text-base !text-black pt-3">
                  Applied Skills :
                </span>
                <span>
                  {data.appliedSkills?.length > 0
                    ? capitalizeWords(data.appliedSkills.join(", "))
                    : "No skills listed"}
                </span>
              </Typography>
              <Typography>
                <span className="font-extrabold text-base !text-black pt-3">
                  Referral :
                </span>
                <span>{" " + capitalizeWords(data.referral)}</span>
              </Typography>
              <Typography>
                <span className="font-extrabold text-base !text-black pt-3">
                  Communication Skill Rating:
                </span>
                <span>{" " + data.communicationSkill}</span>
              </Typography>
            </Col>
          </Row>
        </div>

        <Typography
          variant="h6"
          className="mx-5 font-bold text-2xl !text-blue-600"
        >
          <i className="fa fa-suitcase  mr-1 "> </i>
          Job Details:
        </Typography>
        <hr className="text-blue-900 font-extrabold " />
        <div className="mx-2 p-3">
          <Row className="mx-2">
            <Col xs={12} md={6} className="mb-3">
              <Typography variant="body1" className="text-gray-600">
                <span className="font-extrabold text-base !text-black pt-3">
                  Expected Package::
                </span>
                <span className="">
                  {" " + capitalizeWords(data.expectedPkg)}
                </span>
              </Typography>

              <Typography>
                <span className="font-extrabold text-base !text-black pt-3">
                  Negotiation :
                </span>
                <span>{" " + data.negotiation}</span>
              </Typography>
              <Typography>
                <span className="font-extrabold text-base !text-black pt-3">
                  Notice Period:
                </span>
                <span>{" " + data.noticePeriod}</span>
              </Typography>

              <Typography>
                <span className="font-extrabold text-base !text-black pt-3">
                  About Us:
                </span>
                <span>{" " + capitalizeWords(data.aboutUs)}</span>
              </Typography>
            </Col>
            <Col xs={12} md={6}>
              <Typography>
                <span className="font-extrabold text-base !text-black pt-3">
                  Current Package:
                </span>
                <span>{" " + capitalizeWords(data.currentPkg)}</span>
              </Typography>
              <Typography>
                <span className="font-extrabold text-base !text-black pt-3">
                  Work Preference:
                </span>
                <span>{" " + capitalizeWords(data.readyForWork)}</span>
              </Typography>
              <Typography>
                <span className="font-extrabold text-base !text-black pt-3">
                  Ready for Work from office :
                </span>
                <span>{" " + capitalizeWords(data.workPreference)}</span>
              </Typography>

              <Typography>
                <span className="font-extrabold text-base !text-black pt-3">
                  Practical Feedback :
                </span>
                <span>{" " + capitalizeWords(data.practicalFeedback)}</span>
              </Typography>
            </Col>
            <Col xs={12}>
              <Typography className="mt-2">
                <span className="font-extrabold text-base text-black">
                  Resume URL:
                </span>
                <a
                  href={data.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 "
                >
                  {" " + data.resumeUrl}
                </a>
              </Typography>
              <Typography className="mt-2">
                <span className="font-extrabold text-base text-black">
                  Portfolio URL:
                </span>
                <a
                  href={data.portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 "
                >
                  {" " + data.portfolioUrl}
                </a>
              </Typography>
              <Typography className="mt-2">
                <span className="font-extrabold text-base text-black">
                  Practical URL:
                </span>
                <a
                  href={data.practicalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 "
                >
                  {" " + data.practicalUrl}
                </a>
              </Typography>
            </Col>
          </Row>
        </div>
      </div>
      <div className="d-flex justify-content-between m-3">
        <BaseButton variant="contained" onClick={() => onEdit(2)}>
          Back
        </BaseButton>
        <BaseButton variant="contained" color="primary" onClick={onSubmit}>
          {loading ? "Submitting..." : "Submit Application"}
        </BaseButton>
      </div>
    </>
  );
};

export default PreviewForm;
