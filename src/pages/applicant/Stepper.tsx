/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, Container } from "react-bootstrap";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
} from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import PersonalDetailsForm from "./Personal";
import EducationalDetailsForm from "./Education";
import JobDetailsForm from "./Job";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import PreviewForm from "./PreviewForm";
import {
  createApplicant,
  getApplicantDetails,
  updateApplicant,
} from "api/applicantApi";
import { useParams } from "react-router-dom";
import appConstants from "constants/constant";
import { errorHandle } from "utils/commonFunctions";

const { projectTitle, Modules } = appConstants;

const StepperForm = () => {
  const { id } = useParams();

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
    fullAddress: "",
    state: "",
    country: "",
    pincode: "",
    city: "",
    qualification: "",
    degree: "",
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
    aboutUs: "",
    communicationSkill: "",
    CurrentCompanyDesignation: "",
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
      fullAddress: formData.fullAddress,
      state: formData.state,
      country: formData.country,
      pincode: formData.pincode,
      city: formData.city,
      qualification: formData.qualification,
      degree: formData.degree,
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
      aboutUs: formData.aboutUs,
      communicationSkill: formData.communicationSkill,
      CurrentCompanyDesignation: formData.CurrentCompanyDesignation,
    };
  };

  const handleSubmit = async () => {
    setLoading(true);
    const apiData = formatApiData();

    if (!id) {
      createApplicant(apiData)
        .then((res: any) => {
          if (res.success) {
            toast.success(res.message);
            navigate("/applicants");
          }
        })
        .catch((error) => {
          errorHandle(error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      updateApplicant(apiData, id)
        .then((res: any) => {
          if (res.success) {
            toast.success(res.message);
            navigate("/applicants");
          }
        })
        .catch((error) => {
          errorHandle(error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const getApplicant = (id: string | undefined | null) => {
    if (id !== undefined) {
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
  };

  useEffect(() => {
    getApplicant(id);
  }, [id]);

  return (
    <Fragment>
      <div className="pt-3 page-content"></div>
      <Container fluid>
        <Card>
          <h4 className="m-2 p-1 text-dark justify-center content-start text-2xl text-center font-bold text-blue-900">
            Applicant Form
          </h4>
          <Card.Body>
            <Box sx={{ width: "100%" }}>
              <Stepper activeStep={activeStep}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
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
