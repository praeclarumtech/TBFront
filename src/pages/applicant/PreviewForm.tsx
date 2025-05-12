/* eslint-disable @typescript-eslint/no-explicit-any */
import { Col, Row } from "react-bootstrap";
import appConstants from "constants/constant";
import BaseButton from "components/BaseComponents/BaseButton";
import { Typography } from "@mui/material";
const { projectTitle, Modules } = appConstants;
const PreviewForm = ({ data, onEdit, onSubmit, loading }: any) => {
  document.title = Modules.PreviewApplicantsDetails + " | " + projectTitle;
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
          className="justify-center font-bold text-center "
        >
          Preview Your Details
        </Typography>

        <Typography
          variant="h6"
          className="mx-5 font-bold text-2xl !text-blue-600"
        >
          <i className="mr-1 fa fa-user "> </i>
          <span>Personal Details:</span>
        </Typography>

        <hr className="!text-blue-900 font-bold " />
        <div className="p-3 mx-2">
          <Row className="mx-2">
            <Col xs={12} md={6} className="mb-3">
              <Typography variant="body1" className="text-gray-600">
                <span className="  !text-black pt-3">Name:</span>
                <span className="">
                  {" " + capitalizeWords(data?.name?.firstName)}
                  {" " + capitalizeWords(data?.name?.middleName)}
                  {" " + capitalizeWords(data?.name?.lastName)}
                </span>
              </Typography>
              <Typography>
                <span className="  !text-black pt-3">Phone Number:</span>
                <span>{" " + data?.phone?.phoneNumber}</span>
              </Typography>
              <Typography>
                <span className="  !text-black pt-3">Date of Birth:</span>
                <span>
                  {" "}
                  {" " + new Date(data?.dateOfBirth).toLocaleDateString()}
                </span>
              </Typography>
              <Typography>
                <span className="  !text-black pt-3">Marital Status:</span>
                <span>{" " + capitalizeWords(data?.maritalStatus)}</span>
              </Typography>

              <Typography>
                <span className="text-base  !text-black pt-3">Country:</span>
                <span>{" " + capitalizeWords(data?.country)}</span>
              </Typography>
              {/* <Typography>
                <span className="text-base  !text-black pt-3">
                  Currrent Pincode:
                </span>
                <span>{" " + data.currentPincode}</span>
              </Typography> */}

              <Typography>
                <span className="text-base  !text-black pt-3">
                  Permanent Address:
                </span>
                <span>{" " + capitalizeWords(data?.permanentAddress)}</span>
              </Typography>
            </Col>
            <div className="col-md-6">
              <Typography>
                <span className="text-base  !text-black pt-3">Email:</span>
                <span>{" " + data?.email}</span>
              </Typography>
              <Typography>
                <span className="text-base  !text-black pt-3">
                  WhatsApp Number:
                </span>
                <span>{" " + data?.phone?.whatsappNumber}</span>
              </Typography>
              <Typography>
                <span className="text-base  !text-black pt-3">Gender :</span>
                <span>{" " + capitalizeWords(data?.gender)}</span>
              </Typography>
              <Typography>
                <span className="text-base  !text-black pt-3">City:</span>
                <span>{" " + capitalizeWords(data?.currentCity)}</span>
              </Typography>
              <Typography>
                <span className="text-base  !text-black pt-3">State :</span>
                <span>{" " + data?.state}</span>
              </Typography>
              <Typography>
                <span className="text-base  !text-black pt-3">
                  Current Address:
                </span>
                <span>{" " + capitalizeWords(data?.currentAddress)}</span>
              </Typography>
            </div>
          </Row>
        </div>

        <Typography variant="h6" className="mx-5  text-2xl !text-blue-600">
          <i className="mr-1 fa fa-book "> </i>
          Educational Details:
        </Typography>
        <hr className="text-blue-900 " />
        <div className="p-2 mx-2">
          <Row className="mx-2">
            <Col xs={12} md={6} className="mb-3 ">
              <Typography>
                <span className="  !text-black pt-3">Qualification:</span>
                <span>{" " + data?.qualification}</span>
              </Typography>
              <Typography variant="body1" className="text-gray-600">
                <span className="  !text-black pt-3">Specialization:</span>
                <span className="">
                  {" " + capitalizeWords(data?.specialization)}
                </span>
              </Typography>
              <Typography variant="body1" className="text-gray-600">
                <span className="  !text-black pt-3">CGPA:</span>
                <span className="">
                  {" " + parseFloat(data?.cgpa) + " Cgpa"}
                </span>
              </Typography>
            </Col>

            <Col xs={12} md={6} className="mb-3">
              <Typography>
                <span className="  !text-black pt-3">College Name:</span>
                <span>{" " + data?.collegeName}</span>
              </Typography>
              <Typography>
                <span className="  !text-black pt-3">Passing Year:</span>
                <span>{" " + data?.passingYear}</span>
              </Typography>
            </Col>
          </Row>
        </div>

        <Typography variant="h6" className="mx-5  text-2xl !text-blue-600">
          <i className="mr-1 fa fa-suitcase "> </i>
          Job Details:
        </Typography>
        <hr className="text-blue-900 " />
        <div className="p-3 mx-2">
          <Row className="mx-2">
            <Col xs={12} md={6} className="mb-3">
              <Typography>
                <span className="  !text-black pt-3">Applied Skills:</span>
                <span>
                  {" "}
                  {data.appliedSkills?.length > 0
                    ? capitalizeWords(data.appliedSkills.join(", "))
                    : "No skills listed"}
                </span>
              </Typography>
              <Typography>
                <span className="  !text-black pt-3">Total Experience:</span>
                <span>{" " + data?.totalExperience + " Years"}</span>
              </Typography>
              <Typography>
                <span className="  !text-black pt-3">
                  Javascript Rating(Out of 10):
                </span>
                <span>{" " + data?.rating}</span>
              </Typography>
              <Typography>
                <span className="  !text-black pt-3">
                  Current Company Name:
                </span>
                <span>{" " + capitalizeWords(data?.currentCompanyName)}</span>
              </Typography>
              <Typography>
                <span className="  !text-black pt-3">Current Package:</span>
                <span>{" " + capitalizeWords(data?.currentPkg) + " LPA"}</span>
              </Typography>
              <Typography>
                <span className="  !text-black pt-3">Negotiation(Rs) :</span>
                <span>{" " + data?.negotiation + " Rs."}</span>
              </Typography>
              <Typography>
                <span className="  !text-black pt-3">Work Preference :</span>
                <span>{" " + capitalizeWords(data?.workPreference)}</span>
              </Typography>
              <Typography>
                <span className="  !text-black pt-3">Applied Role:</span>
                <span>{" " + capitalizeWords(data?.appliedRole)}</span>
              </Typography>
              {data?.meta && (
                <>
                  <Typography>
                    <span className="  !text-black pt-3">
                      {capitalizeWords(data?.appliedRole)} Skills Experience:
                    </span>
                  </Typography>

                  {Object.entries(data.meta).map(([key, value]) => (
                    <Typography key={key} className="text-gray-700">
                      <span className="!text-black ">
                        {capitalizeWords(key)}:
                      </span>{" "}
                      <span>{String(value) + " Yrs"}</span>
                    </Typography>
                  ))}
                </>
              )}
            </Col>
            <Col xs={12} md={6}>
              <Typography>
                <span className="  !text-black pt-3">Other Skills:</span>
                <span>{" " + capitalizeWords(data?.otherSkills)}</span>
              </Typography>
              <Typography>
                <span className="  !text-black pt-3">
                  Relevant Skill Experience:
                </span>
                <span>{" " + data?.relevantSkillExperience + " Years"}</span>
              </Typography>
              <Typography>
                <span className="  !text-black pt-3">
                  Communication Skill Rating(Out of 10):
                </span>
                <span>{" " + data?.communicationSkill}</span>
              </Typography>
              <Typography>
                <span className="  !text-black pt-3">
                  Current Company Designation :
                </span>
                <span>{" " + data?.currentCompanyDesignation}</span>
              </Typography>

              <Typography variant="body1" className="text-gray-600">
                <span className="  !text-black pt-3">Expected Package:</span>
                <span className="">
                  {" " + capitalizeWords(data?.expectedPkg) + " LPA"}
                </span>
              </Typography>
              <Typography>
                <span className="  !text-black pt-3">Notice Period(Days):</span>
                <span>{" " + data?.noticePeriod + " days"}</span>
              </Typography>

              <Typography>
                <span className="  !text-black pt-3">Preferred Locations:</span>
                <span>{" " + capitalizeWords(data?.preferredLocations)}</span>
              </Typography>
              <Typography>
                <span className="  !text-black pt-3">Referral :</span>
                <span>{" " + capitalizeWords(data?.referral)}</span>
              </Typography>

              <Typography>
                <span className="  !text-black pt-3">Last Follow UpDate:</span>
                <span>
                  {" " + new Date(data?.lastFollowUpDate).toLocaleDateString()}
                </span>
              </Typography>
              <Typography>
                <span className="  !text-black pt-3">Any Hand On Offers?:</span>
                <span>{" " + (data?.anyHandOnOffers ? "Yes" : "No")}</span>
              </Typography>
              <Typography>
                <span className="  !text-black pt-3">Comment:</span>
                <span>{" " + capitalizeWords(data?.comment)}</span>
              </Typography>
              <Typography>
                <span className="  !text-black pt-3">Practical Feedback :</span>
                <span>{" " + capitalizeWords(data?.practicalFeedback)}</span>
              </Typography>
              <Typography>
                <span className="  !text-black pt-3">Client Feedback :</span>
                <span>{" " + capitalizeWords(data?.clientFeedback)}</span>
              </Typography>
            </Col>
            <Col xs={12}>
              <Typography className="mt-2">
                <span className="text-black ">Resume URL:</span>
                <a
                  href={data?.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 "
                >
                  {" " + data?.resumeUrl}
                </a>
              </Typography>
              <Typography className="mt-2">
                <span className="text-black ">Portfolio URL:</span>
                <a
                  href={data?.portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 "
                >
                  {" " + data.portfolioUrl}
                </a>
              </Typography>
              <Typography className="mt-2">
                <span className="text-black ">Linkedin URL:</span>
                <a
                  href={data?.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 "
                >
                  {" " + data?.linkedinUrl}
                </a>
              </Typography>
              <Typography className="mt-2">
                <span className="text-black ">Client Cv URL:</span>
                <a
                  href={data?.clientCvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600"
                >
                  {" " + data?.clientCvUrl}
                  {/* {formData.portfolioUrl} */}
                </a>
              </Typography>
              <Typography className="mt-2">
                <span className="text-black ">Practical URL:</span>
                <a
                  href={data?.practicalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 "
                >
                  {" " + data?.practicalUrl}
                </a>
              </Typography>
            </Col>
          </Row>
          <div className="gap-3 mx-2 mt-4 d-flex flex-column flex-md-row justify-content-end">
            <BaseButton
              variant=" order-1 w-full order-md-0"
              onClick={() => onEdit(-1)}
            >
              Back
            </BaseButton>
            <BaseButton
              variant="w-full order-0 order-md-1"
              color="primary"
              onClick={onSubmit}
            >
              {loading ? "Submitting..." : "Submit Application"}
            </BaseButton>
          </div>
        </div>
      </div>
    </>
  );
};

export default PreviewForm;
