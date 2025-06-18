/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, Container } from "react-bootstrap";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import PersonalDetailsForm from "./Personal";
import EducationalDetailsForm from "./Education";
import JobDetailsForm from "./Job";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import PreviewForm from "./PreviewForm";
import {
  createApplicant,
  getApplicantDetails,
  getImportedApplicantDetails,
  updateApplicant,
  updateImportedApplicant,
} from "api/applicantApi";
import { useParams } from "react-router-dom";
import appConstants from "constants/constant";
import { errorHandle } from "utils/commonFunctions";

const { projectTitle, Modules } = appConstants;

const StepperForm = () => {
  const { id } = useParams();
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const moduleName = queryParams.get("from");
  const isMobile = useMediaQuery("(max-width: 450px)");
  document.title = Modules.Login + " | " + projectTitle;

  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: {
      firstName: "",
      middleName: "",
      lastName: "",
    },
    phone: {
      whatsappNumber: "",
      phoneNumber: "",
    },
    email: "",
    gender: "",
    dateOfBirth: "",
    state: "",
    country: "",
    currentPincode: "",
    currentCity: "",
    qualification: [],
    specialization: "",
    passingYear: "",
    appliedSkills: [],
    totalExperience: "",
    relevantSkillExperience: "",
    otherSkills: "",
    referral: "",
    resumeUrl: "",
    rating: "",
    currentPkg: "",
    expectedPkg: "",
    negotiation: "",
    noticePeriod: "",
    workPreference: "",
    portfolioUrl: "",
    practicalUrl: "",
    practicalFeedback: "",
    collegeName: "",
    comment: "",
    communicationSkill: "",
    currentCompanyDesignation: "",
    cgpa: "",
    currentAddress: "",
    permanentAddress: "",
    preferredLocations: "",
    // homePincode: "",
    // homeTownCity: "",
    maritalStatus: "",
    currentCompanyName: "",
    appliedRole: "",
    anyHandOnOffers: "",
    lastFollowUpDate: "",
    linkedinUrl: "",
    clientCvUrl: "",
    gitHubUrl: "",
    clientFeedback: "",
    meta: {},
  });
  const steps = [
    "Personal Details",
    "Educational Details",
    "Job Details",
    "Preview",
  ];

  const handleNext = (data: any) => {
    setFormData((prev) => ({
      ...prev,
      ...data,
    }));

    if (activeStep === 0) {
      setActiveStep(1);
    } else if (activeStep === 1) {
      setActiveStep(2);
    } else if (activeStep === 2) {
      setActiveStep(3);
    }
  };

  const handleBack = (data: any) => {
    setFormData((prev) => ({
      ...prev,
      ...data,
    }));
    setActiveStep((prev) => Math.max(0, prev - 1));
  };

  const handleEdit = (stepIndex: number) => {
    setActiveStep(stepIndex);
  };

  const formatApiData = () => {
    return {
      name: {
        firstName: formData.name.firstName,
        middleName: formData.name.middleName,
        lastName: formData.name.lastName,
      },
      phone: {
        whatsappNumber: formData.phone.whatsappNumber,
        phoneNumber: formData.phone.phoneNumber,
      },
      email: formData.email,
      gender: formData.gender,
      dateOfBirth: formData.dateOfBirth,
      state: formData.state,
      country: formData.country,
      currentPincode: formData.currentPincode,
      currentCity: formData.currentCity,
      qualification: formData.qualification,
      specialization: formData.specialization,
      passingYear: formData.passingYear,
      appliedSkills: formData.appliedSkills,
      totalExperience: formData.totalExperience,
      relevantSkillExperience: formData.relevantSkillExperience,
      otherSkills: formData.otherSkills,
      referral: formData.referral,
      resumeUrl: formData.resumeUrl,
      rating: formData.rating,
      currentPkg: formData.currentPkg,
      expectedPkg: formData.expectedPkg,
      negotiation: formData.negotiation,
      noticePeriod: formData.noticePeriod,
      workPreference: formData.workPreference,
      portfolioUrl: formData.portfolioUrl,
      practicalUrl: formData.practicalUrl,
      feedback: formData.practicalFeedback,
      practicalFeedback: formData.practicalFeedback,
      comment: formData.comment,
      communicationSkill: formData.communicationSkill,
      currentCompanyDesignation: formData.currentCompanyDesignation,
      // homeTownCity: formData.homeTownCity,
      preferredLocations: formData.preferredLocations,
      // homePincode: formData.homePincode,
      maritalStatus: formData.maritalStatus,
      currentCompanyName: formData.currentCompanyName,
      appliedRole: formData.appliedRole,
      anyHandOnOffers: formData.anyHandOnOffers,
      lastFollowUpDate: formData.lastFollowUpDate,
      collegeName: formData.collegeName,
      cgpa: formData.cgpa,
      currentAddress: formData.currentAddress,
      permanentAddress: formData.permanentAddress,
      linkedinUrl: formData.linkedinUrl,
      clientCvUrl: formData.clientCvUrl,
      gitHubUrl: formData.gitHubUrl,
      clientFeedback: formData.clientFeedback,
      meta: formData.meta,
    };
  };

  const handleSubmit = async () => {
    setLoading(true);
    const apiData = formatApiData();
    // console.log("apiData", apiData);

    if (!id) {
      createApplicant(apiData)
        .then((res: any) => {
          if (res.success) {
            toast.success(res.message);
            setTimeout(() => {
              navigate("/applicants");
            }, 3000);
          }
        })
        .catch((error) => {
          // errorHandle(error);
          const errorMessages = error?.response?.data?.details;
          if (errorMessages && Array.isArray(errorMessages)) {
            errorMessages.forEach((errorMessage) => {
              toast.error(errorMessage);
            });
          } else {
            toast.error("An error occurred while updating the applicant.");
          }
        })

        .finally(() => {
          setLoading(false);
        });
    } else {
      if (moduleName === "import-applicant") {
        updateImportedApplicant(apiData, id)
          .then((res: any) => {
            if (res.success) {
              toast.success(res.message);

              setTimeout(() => {
                navigate("/import-applicants");
              }, 3000);
            }
          })
          .catch((error) => {
            const errorMessages = error?.response?.data?.details;
            if (errorMessages && Array.isArray(errorMessages)) {
              errorMessages.forEach((errorMessage) => {
                toast.error(errorMessage);
              });
            } else {
              toast.error("An error occurred while updating the applicant.");
            }
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        updateApplicant(apiData, id)
          .then((res: any) => {
            if (res.success) {
              toast.success(res.message);

              setTimeout(() => {
                navigate("/applicants");
              }, 1000);
            }
          })
          .catch((error) => {
            const errorMessages = error?.response?.data?.details;
            if (errorMessages && Array.isArray(errorMessages)) {
              errorMessages.forEach((errorMessage) => {
                toast.error(errorMessage);
              });
            } else {
              toast.error("An error occurred while updating the applicant.");
            }
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }
  };

  const getApplicant = (id: string | undefined | null) => {
    if (id !== undefined) {
      if (moduleName === "import-applicant") {
        getImportedApplicantDetails(id)
          .then((res: any) => {
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
      } else {
        getApplicantDetails(id)
          .then((res: any) => {
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
      }
    }
  };

  useEffect(() => {
    getApplicant(id);
  }, [id]);

  const isEditMode = Boolean(id);
  const titleForm = isEditMode ? "Update Applicant" : "Create Applicant";
  return (
    <Fragment>
      <div className="pt-3 page-content"></div>
      <Container fluid>
        <Card>
          <h5 className="content-start justify-center p-1 m-2 text-2xl font-bold text-center text-blue-900 text-dark">
            {titleForm}
          </h5>

          <Card.Body>
            <Box
              sx={{
                width: "100%",
                justifyContent: isMobile ? "center" : "flex-start",
                // display: "flex",
                display: isMobile ? "flex" : "",
                flexDirection: isMobile ? "column" : "row",
                alignItems: isMobile ? "center" : "unset",
              }}
            >
              <Stepper
                activeStep={activeStep}
                orientation={isMobile ? "vertical" : "horizontal"}
              >
                {steps.map((label, index) => (
                  <Step key={label}>
                    <StepLabel
                      onClick={
                        isEditMode ? () => setActiveStep(index) : undefined
                      }
                      style={isEditMode ? { cursor: "pointer" } : {}}
                    >
                      {label}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
              <Box sx={{ mt: 2 }}>
                {activeStep === steps.length ? (
                  <div>
                    <Typography sx={{ mt: 2, mb: 1 }}>
                      All steps completed - you&apos;re finished{" "}
                    </Typography>
                    <Button onClick={() => setActiveStep(0)}>Reset</Button>
                  </div>
                ) : (
                  <div>
                    {activeStep === 0 && (
                      <PersonalDetailsForm
                        onNext={handleNext}
                        initialValues={formData}
                        module={moduleName}
                      />
                    )}
                    {activeStep === 1 && (
                      <EducationalDetailsForm
                        onNext={handleNext}
                        onBack={handleBack}
                        initialValues={formData}
                      />
                    )}
                    {activeStep === 2 && (
                      <JobDetailsForm
                        onNext={handleNext}
                        onBack={handleBack}
                        initialValues={formData}
                      />
                    )}
                    {activeStep === 3 && (
                      <PreviewForm
                        data={formData}
                        onEdit={handleEdit}
                        onSubmit={handleSubmit}
                        loading={loading}
                      />
                    )}
                  </div>
                )}
              </Box>
            </Box>
          </Card.Body>
        </Card>
      </Container>
    </Fragment>
  );
};

export default StepperForm;
