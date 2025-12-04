/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, Fragment, useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import BaseInput from "components/BaseComponents/BaseInput";
import BaseButton from "components/BaseComponents/BaseButton";
import { checkEmailForJob, applyJob, viewJobById } from "api/apiJob";
import { errorHandle } from "utils/commonFunctions";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import appConstants from "constants/constant";

const { projectTitle } = appConstants;

const EmailCheckApply = () => {
  document.title = "Apply for Job | " + projectTitle;

  const location = useLocation();
  const navigate = useNavigate();
  const jobId =
    location.state?.jobId || new URLSearchParams(location.search).get("jobId");

  const [email, setEmail] = useState("");
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [emailExists, setEmailExists] = useState<boolean | null>(null);
  const [applicantData, setApplicantData] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [applied, setApplied] = useState(false);
  const [wantsToUpdate, setWantsToUpdate] = useState<"yes" | "no">("no");
  const [jobDetails, setJobDetails] = useState<any>(null);
  const [loadingJobDetails, setLoadingJobDetails] = useState(false);

  // Fetch job details
  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!jobId) return;
      setLoadingJobDetails(true);
      try {
        const response = await viewJobById({ _id: jobId });
        if (response?.success && response?.data) {
          setJobDetails(response.data);
        }
      } catch (error: any) {
        errorHandle(error);
      } finally {
        setLoadingJobDetails(false);
      }
    };
    fetchJobDetails();
  }, [jobId]);

  useEffect(() => {
    const fromEmailCheck = location.state?.fromEmailCheck;
    const stateEmail = location.state?.email;
    const stateJobId = location.state?.jobId;
    const isApplied = location.state?.applied;

    if (isApplied) {
      setEmail(stateEmail || "");
      setApplied(true);
      return;
    }

    if (fromEmailCheck && stateEmail && stateJobId) {
      setEmail(stateEmail);
      const restoreEmailCheck = async () => {
        setCheckingEmail(true);
        try {
          const response = await checkEmailForJob(stateJobId, stateEmail);
          if (response?.success) {
            const emailFound = response?.data?.emailExists;
            if (emailFound) {
              setEmailExists(true);
              setApplicantData({
                applicantId: response?.data?.applicantId,
                applicantName: response?.data?.applicantName,
                alreadyApplied: response?.data?.alreadyApplied,
                formUrl: response?.data?.formUrl,
              });
              setWantsToUpdate("no");
            } else {
              setEmailExists(false);
            }
          }
        } catch (error: any) {
          errorHandle(error);
          setEmailExists(false);
        } finally {
          setCheckingEmail(false);
        }
      };
      restoreEmailCheck();
    }
  }, [location.state]);

  const handleEmailCheck = async () => {
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!jobId) {
      toast.error("Job ID is missing. Please try again.");
      return;
    }

    setCheckingEmail(true);
    setWantsToUpdate("no");
    try {
      const response = await checkEmailForJob(jobId, email);

      // Check if user has already applied (409 status code)
      if (
        response?.statusCode === 409 &&
        response?.data?.alreadyApplied === true
      ) {
        setApplied(true);
        setEmailExists(true);
        setApplicantData({
          applicantId: response?.data?.applicantId,
          applicantName: response?.data?.applicantName,
          alreadyApplied: true,
          applicationId: response?.data?.applicationId,
          formUrl: response?.data?.formUrl,
        });
        toast.warning(
          response?.message || "You have already applied for this job."
        );
        return;
      }

      if (response?.success) {
        const emailFound = response?.data?.emailExists;
        if (emailFound) {
          setEmailExists(true);
          setApplicantData({
            applicantId: response?.data?.applicantId,
            applicantName: response?.data?.applicantName,
            alreadyApplied: response?.data?.alreadyApplied,
            formUrl: response?.data?.formUrl,
          });
          toast.success(
            response?.message || "Email found. You can apply for this job."
          );
        } else {
          setEmailExists(false);
          toast.info(
            "Email not found. You can fill the form to create a new applicant."
          );
        }
      } else {
        setEmailExists(false);
        toast.info(
          "Email not found. You can fill the form to create a new applicant."
        );
      }
    } catch (error: any) {
      // Check if error is 409 - already applied
      if (
        error?.response?.status === 409 ||
        error?.response?.data?.statusCode === 409
      ) {
        const errorData = error?.response?.data;
        if (errorData?.data?.alreadyApplied === true) {
          setApplied(true);
          setEmailExists(true);
          setApplicantData({
            applicantId: errorData?.data?.applicantId,
            applicantName: errorData?.data?.applicantName,
            alreadyApplied: true,
            applicationId: errorData?.data?.applicationId,
            formUrl: errorData?.data?.formUrl,
          });
          toast.warning(
            errorData?.message || "You have already applied for this job."
          );
          return;
        }
      }
      errorHandle(error);
      setEmailExists(false);
    } finally {
      setCheckingEmail(false);
    }
  };

  const handleApply = async () => {
    if (!jobId) {
      toast.error("Job ID is missing. Please try again.");
      return;
    }

    if (!email) {
      toast.error("Email is missing. Please try again.");
      return;
    }

    setUploading(true);
    try {
      const response = await applyJob(jobId, email);
      if (response?.success) {
        setApplied(true);
        toast.success(
          response?.message || "Application submitted successfully!"
        );
      } else {
        throw new Error(response?.message || "Application failed");
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error.message ||
        "Failed to submit application";
      toast.error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleFillForm = () => {
    navigate("/applicants/applicant-add-qr-code", {
      state: { jobId, email, fromEmailCheck: true },
    });
  };

  const handleRadioChange = (value: string) => {
    if (value === "yes" || value === "no") {
      setWantsToUpdate(value);
    }
  };

  return (
    <Fragment>
      <Container fluid className="py-5">
        <Row className="justify-content-center">
          <Col xs={12} md={10} lg={8}>
            <Card className="shadow-lg border-0 overflow-hidden">
              {/* Header Section with Gradient */}
              <div
                className="p-4"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(99, 75, 255, 0.1) 0%, rgba(99, 75, 255, 0.05) 100%)",
                  borderBottom: "1px solid rgba(99, 75, 255, 0.1)",
                }}
              >
                <div className="d-flex align-items-center justify-content-center">
                  <h2
                    className="mb-0 text-center w-100"
                    style={{
                      color: "#624bff",
                      fontWeight: "700",
                      fontSize: "28px",
                    }}
                  >
                    Apply for Job
                  </h2>
                </div>
              </div>

              <Card.Body className="p-4">
                {/* Job Details */}
                {loadingJobDetails ? (
                  <div className="mb-4 p-4 text-center">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2 text-muted">Loading job details...</p>
                  </div>
                ) : (
                  jobDetails && (
                    <div
                      className="mb-4 p-4 rounded"
                      style={{
                        backgroundColor: "#f8f9fa",
                        border: "1px solid #e9ecef",
                      }}
                    >
                      <h5
                        className="mb-3"
                        style={{
                          color: "#624bff",
                          fontWeight: "600",
                          fontSize: "18px",
                        }}
                      >
                        {jobDetails.job_subject || "N/A"}
                      </h5>

                      <p className="mb-2">
                        <strong>Job Type:</strong>{" "}
                        {jobDetails.job_type || "N/A"}
                      </p>
                      <p className="mb-2">
                        <strong>Job Location:</strong>{" "}
                        {jobDetails.job_location || "N/A"}
                      </p>
                      {(jobDetails.sub_description ||
                        jobDetails.job_details) && (
                        <div className="mb-3">
                          <strong className="d-block mb-2">
                            Job Description:
                          </strong>
                          <div
                            className="ql-editor"
                            style={{
                              wordBreak: "break-word",
                              overflowWrap: "break-word",
                              whiteSpace: "pre-wrap",
                              fontSize: "14px",
                              color: "#495057",
                              lineHeight: "1.6",
                            }}
                            dangerouslySetInnerHTML={{
                              __html:
                                jobDetails.sub_description ||
                                jobDetails.job_details ||
                                "",
                            }}
                          />
                        </div>
                      )}

                      {jobDetails.required_skills &&
                        jobDetails.required_skills.length > 0 && (
                          <div className="mt-3">
                            <strong
                              className="d-block mb-2"
                              style={{ fontSize: "14px", color: "#495057" }}
                            >
                              Required Skills:
                            </strong>
                            <div className="d-flex flex-wrap gap-2">
                              {jobDetails.required_skills.map(
                                (skill: string, index: number) => (
                                  <span
                                    key={index}
                                    className="badge px-3 py-2"
                                    style={{
                                      backgroundColor: "#624bff",
                                      color: "#ffffff",
                                      fontSize: "13px",
                                      fontWeight: "500",
                                      borderRadius: "6px",
                                    }}
                                  >
                                    {skill}
                                  </span>
                                )
                              )}
                            </div>
                          </div>
                        )}
                    </div>
                  )
                )}

                {!emailExists && emailExists !== false && (
                  <div>
                    <div className="mb-3">
                      <BaseInput
                        label="Email Address"
                        name="email"
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        handleChange={(e) => setEmail(e.target.value)}
                        className="mb-3"
                      />
                    </div>
                    <div className="text-center">
                      <BaseButton
                        onClick={handleEmailCheck}
                        disabled={checkingEmail || !email}
                        className="px-4 py-2"
                      >
                        {checkingEmail ? "Checking..." : "Check Email"}
                      </BaseButton>
                    </div>
                  </div>
                )}

                {emailExists === false && (
                  <div>
                    <div className="alert alert-info mb-3">
                      <p className="mb-2">
                        Email <strong>{email}</strong> not found in our
                        database.
                      </p>
                      <p>
                        Would you like to fill out the form to create a new
                        applicant profile?
                      </p>
                    </div>
                    <div className="d-flex gap-2 justify-content-center">
                      <BaseButton
                        onClick={handleFillForm}
                        className="px-4 py-2 bg-primary"
                      >
                        Fill Form
                      </BaseButton>
                      <BaseButton
                        onClick={() => {
                          setEmailExists(null);
                          setEmail("");
                          setApplicantData(null);
                          setWantsToUpdate("no");
                        }}
                        variant="outline-secondary"
                        className="px-4 py-2"
                      >
                        Try Another Email
                      </BaseButton>
                    </div>
                  </div>
                )}

                {emailExists === true && !applied && (
                  <div>
                    <div className="alert alert-success mb-3">
                      <p className="mb-0">
                        Email <strong>{email}</strong> found in our database.
                      </p>
                      {applicantData?.applicantName && (
                        <p className="mb-0 mt-2">
                          Applicant: {applicantData.applicantName}
                        </p>
                      )}
                    </div>

                    <div className="mb-3">
                      <p className="mb-3">
                        Would you like to update your details before applying?
                      </p>
                      <div className="d-flex gap-4">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="updateDetails"
                            id="updateYes"
                            value="yes"
                            checked={wantsToUpdate === "yes"}
                            onChange={(e) => handleRadioChange(e.target.value)}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="updateYes"
                          >
                            Yes
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="updateDetails"
                            id="updateNo"
                            value="no"
                            checked={wantsToUpdate === "no"}
                            onChange={(e) => handleRadioChange(e.target.value)}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="updateNo"
                          >
                            No
                          </label>
                        </div>
                      </div>
                    </div>

                    {wantsToUpdate === "yes" &&
                      applicantData?.applicantId &&
                      !applicantData?.alreadyApplied && (
                        <div className="mb-3">
                          <BaseButton
                            onClick={() => {
                              navigate(
                                `/applicants/applicant-edit-qr-code/${applicantData.applicantId}`,
                                {
                                  state: { jobId, email, fromEmailCheck: true },
                                }
                              );
                            }}
                            className="px-4 py-2 bg-primary"
                          >
                            Update Details
                          </BaseButton>
                        </div>
                      )}

                    {/* {wantsToUpdate === "no" && (
                      <div className="mb-3">
                        <label className="form-label">
                          Upload Your Resume (PDF or DOCX)
                        </label>
                        <Dragger {...uploadProps}>
                          <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                          </p>
                          <p className="ant-upload-text">
                            Click or drag file to this area to upload
                          </p>
                          <p className="ant-upload-hint">
                            PDF, DOC, DOCX only. Max 5MB.
                          </p>
                        </Dragger>
                      </div>
                    )} */}

                    {wantsToUpdate === "no" && (
                      <div className="d-flex gap-2 justify-content-center mt-3">
                        <BaseButton
                          onClick={handleApply}
                          disabled={uploading}
                          className="px-4 py-2 bg-primary"
                        >
                          {uploading ? "Applying..." : "Apply"}
                        </BaseButton>
                        <BaseButton
                          onClick={() => {
                            setEmailExists(null);
                            setEmail("");
                            setApplicantData(null);
                            setWantsToUpdate("no");
                          }}
                          variant="outline-secondary"
                          className="px-4 py-2"
                        >
                          Cancel
                        </BaseButton>
                      </div>
                    )}
                  </div>
                )}

                {applied && (
                  <div className="text-center">
                    <div className="alert alert-success mb-3">
                      <h5>Application Submitted Successfully!</h5>
                      <p className="mb-0">
                        Your application has been submitted. We will review it
                        and get back to you soon.
                      </p>
                    </div>
                    <BaseButton
                      onClick={() => navigate("/")}
                      className="px-4 py-2 bg-primary"
                    >
                      View Applied Jobs
                    </BaseButton>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};

export default EmailCheckApply;
