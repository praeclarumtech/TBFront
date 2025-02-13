
// src/components/StepperForm/StepperForm.tsx
import React, { useState } from 'react';
import { Box, Stepper, Step, StepLabel, Button, Typography } from '@mui/material';
import PersonalDetailsForm from './PersonalDetailsForm';
import EducationalDetailsForm from './EducationSkillsForm';
import JobDetailsForm from './JobDetailsForm';
import PreviewForm from './PreviewForm';
import { Card } from 'react-bootstrap';

const steps = ['Personal Details', 'Educational Details', 'Job Details', 'Preview'];

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
    resume: { name: string; url: string }[]; 
    totalExperience: number;
    relevantSkillExperience: number;
    otherSkills: string;
    rating: number;
  };
  job: {
    currentpkg: string;
    expectedpkg: string;
    noticePeriod: string;
    negotiation: string;
    readyForWork: string;
    workPreference: string;
    aboutus: string;
    referal?: string;
  };
}


const StepperForm: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    personal: {
      firstName: '',
      middleName: '',
      lastName: '',
      whatsappNumber: '',
      phoneNumber: '',
      email: '',
      gender: '',
      dateOfBirth: '',
      fullAddress: '',
      state: '',
      country: '',
      pincode: 0,
      city: '',
    },
    education: {
      qualification: '',
      degree: '',
      passingYear: 0,
      appliedSkills: [], 
      resume: [], 
      totalExperience: 0,
      relevantSkillExperience: 0,
      otherSkills: '',
      rating: 0,
    },
    job: {
      currentpkg: '',
      expectedpkg: '',
      noticePeriod: '',
      negotiation: '',
      readyForWork: '',
      workPreference: '',
      aboutus: '',
      referal: '',
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
      passing_Year: formData.education.passingYear,
      current_Location: formData.personal.fullAddress,
      state: formData.personal.state,
      country: formData.personal.country,
      pincode: formData.personal.pincode,
      city: formData.personal.city,
      applied_Skills: formData.education.appliedSkills || [], 
      resume: formData.education.resume.length > 0 ? formData.education.resume[0].url : '', 
      total_Exp: formData.education.totalExperience,
      relevant_Exp: formData.education.relevantSkillExperience,
      other_Skills: formData.education.otherSkills,
      javascript_Rate: formData.education.rating,
      current_Pkg: formData.job.currentpkg,
      expected_Pkg: formData.job.expectedpkg,
      notice_Period: formData.job.noticePeriod,
      negotiationable: formData.job.negotiation,
      ready_Wfo: formData.job.readyForWork,
      work_Preference: formData.job.workPreference,
      about_Us: formData.job.aboutus,
      referal: formData.job.referal || '', 
    };

    try {
      const response = await fetch('http://192.168.1.13:5000/api/applicant/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      });
  
      const result = await response.json();
      console.log('Success:', result);
      alert('Application submitted successfully!');
      
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to submit application.');
    }
  };

  return (
    <Card>
      <h4 className="m-2 p-1 text-dark justify-center content-start text-2xl text-center font-bold text-blue-900">Applicant Form</h4>
      <Card.Body>
        <Box sx={{ width: '100%' }}>
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
                <Typography sx={{ mt: 2, mb: 1 }}>All steps completed - you&apos;re finished </Typography>
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