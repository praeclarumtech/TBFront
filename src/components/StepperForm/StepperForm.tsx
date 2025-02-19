// src/components/StepperForm/StepperForm.tsx
import React, { useState } from "react";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
} from "@mui/material";
import PersonalDetailsForm from "./PersonalDetailsForm";
import EducationalDetailsForm from "./EducationSkillsForm";
import JobDetailsForm from "./JobDetailsForm";
import PreviewForm from "./PreviewForm";
import { Card } from "react-bootstrap";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
// import Applicant from "../../components/StepperForm/index"
 

// const BASE_URL = "http://localhost:3000";
const BASE_URL = import.meta.env.VITE_API_URL;
const steps = [
  "Personal Details",
  "Educational Details",
  "Job Details",
  "Preview",
];
 
interface FormData {
  personal: {
    firstName: string;
    middleName: string;
    lastName: string;
    whatsappNumber: string;
    phoneNumber: string;
    email: string;
    gender: string;
    dateOfBirth: string;
    fullAddress: string;
    state: string;
    country: string;
    pincode: number;
    city: string;
  };
  education: {
    qualification: string;
    degree: string;
    passingYear: number;
    appliedSkills: string[];
    // resume: { name: string; url: string }[];
    totalExperience: number;
    relevantSkillExperience: number;
    otherSkills: string;
    rating: number;
    referral: string;
    url: string;
  };
  job: {
    currentPkg: string;
    expectedPkg: string;
    noticePeriod: string;
    negotiation: string;
    readyForWork: string;
    workPreference: string;
    aboutUs: string;
  };
}
 
const StepperForm: React.FC = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    personal: {
      firstName: "",
      middleName: "",
      lastName: "",
      whatsappNumber: "",
      phoneNumber: "",
      email: "",
      gender: "",
      dateOfBirth: "",
      fullAddress: "",
      state: "",
      country: "",
      pincode: 0,
      city: "",
    },
    education: {
      qualification: "",
      degree: "",
      passingYear: 0,
      appliedSkills: [],
      // resume: [],
      totalExperience: 0,
      relevantSkillExperience: 0,
      otherSkills: "",
      rating: 0,
      referral: "",
      url: "",
    },
    job: {
      currentPkg: "",
      expectedPkg: "",
      noticePeriod: "",
      negotiation: "",
      readyForWork: "",
      workPreference: "",
      aboutUs: "",
    },
  });
 
  const handleNext = (data: any) => {
    if (activeStep === 0) {
      setFormData((prev) => ({ ...prev, personal: data }));
    } else if (activeStep === 1) {
      setFormData((prev) => ({ ...prev, education: data }));
    } else if (activeStep === 2) {
      setFormData((prev) => ({ ...prev, job: data }));
    }
    setActiveStep((prev) => prev + 1);
  };
 
  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };
 
  const handleEdit = (step: number) => {
    setActiveStep(step);
  };
 
  const handleSubmit = async () => {
    const apiData = {
      name: {
        firstName: formData.personal.firstName,
        middleName: formData.personal.middleName,
        lastName: formData.personal.lastName,
      },
      phone: {
        whatsappNumber: formData.personal.whatsappNumber,
        phoneNumber: formData.personal.phoneNumber,
      },
      email: formData.personal.email,
      gender: formData.personal.gender,
      dateOfBirth: formData.personal.dateOfBirth,
      qualification: formData.education.qualification,
      degree: formData.education.degree,
      passingYear: formData.education.passingYear,
      fullAddress: formData.personal.fullAddress,
      state: formData.personal.state,
      country: formData.personal.country,
      pincode: formData.personal.pincode,
      city: formData.personal.city,
      appliedSkills: formData.education.appliedSkills || [],
      totalExperience: formData.education.totalExperience,
      relevantSkillExperience: formData.education.relevantSkillExperience,
      otherSkills: formData.education.otherSkills,
      rating: formData.education.rating,
      currentPkg: formData.job.currentPkg,
      expectedPkg: formData.job.expectedPkg,
      noticePeriod: formData.job.noticePeriod,
      negotiation: formData.job.negotiation,
      readyForWork: formData.job.readyForWork,
      workPreference: formData.job.workPreference,
      aboutUs: formData.job.aboutUs,
      referral: formData.education.referral || "",
      url: formData.education.url,
    };
 
    try {
      const response = await fetch(`${BASE_URL}/api/applicants/addApplicant`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiData),
      });
 
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
 
       await response.json();
 
      toast.success("Application submitted successfully!", {
        position: "top-right",
        autoClose: 5000,
      });
 
      navigate("/applicants");
    } catch (error) {
      console.error("Error:", error);
 
      toast.error("Application submission failed. Please try again.", {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };
 
  return (
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
                    onCancel={() => setActiveStep(0)}
                    initialValues={formData.personal}
                  />
                )}
                {activeStep === 1 && (
                  <EducationalDetailsForm
                    onNext={handleNext}
                    onBack={handleBack}
                    initialValues={formData.education}
                  />
                )}
                {activeStep === 2 && (
                  <JobDetailsForm
                    onNext={handleNext}
                    onBack={handleBack}
                    initialValues={formData.job}
                  />
                )}
                {activeStep === 3 && (
                  <PreviewForm
                    data={formData}
                    onEdit={handleEdit}
                    onSubmit={handleSubmit}
                  />
                )}
              </div>
            )}
          </Box>
        </Box>
      </Card.Body>
    </Card>
  );
};
 
export default StepperForm;