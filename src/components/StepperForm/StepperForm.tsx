// src/components/StepperForm/StepperForm.tsx
import React, { useState } from 'react';
import { Box, Stepper, Step, StepLabel, Button, Typography } from '@mui/material';
import PersonalDetailsForm from './PersonalDetailsForm';
import EducationalDetailsForm from './EducationSkillsForm';
import JobDetailsForm from './JobDetailsForm';
import PreviewForm from './PreviewForm';
import { Card } from 'react-bootstrap';

const steps = ['Personal Details', 'Educational Details', 'Job Details', 'Preview'];

const StepperForm: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    personal: {},
    education: {},
    job: {},
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

  const handleSubmit = () => {
    console.log("Final Submission Data:", formData);
    //  sending data to an API
  };

  return (
    <Card>
      <h4 className="m-2 p-1 text-dark justify-center content-start text-2xl text-center font-bold">Applicant Form</h4>
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