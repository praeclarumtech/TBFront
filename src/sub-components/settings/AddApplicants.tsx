

// // import node module libraries
// import { Col, Row, Card } from "react-bootstrap";

// import * as React from 'react';
// import Box from '@mui/material/Box';
// import Stepper from '@mui/material/Stepper';
// import Step from '@mui/material/Step';
// import StepLabel from '@mui/material/StepLabel';
// import Button from '@mui/material/Button';
// import Typography from '@mui/material/Typography';
// import PersonalDetails from "pages/ApplicantForm/PersonalDetails";
// import EducationalDetails from "pages/ApplicantForm/EducationalDetails";
// import JobSkillsDetails from "pages/ApplicantForm/JobSkillsDetails";
// import FormSubmitted from "pages/ApplicantForm/FormSubmitted";


// const steps = ['Personal Details', 'Educational Details', 'Job Details'];

// const AddApplicants = () => {
//   const [activeStep, setActiveStep] = React.useState(0);
//   const [skipped, setSkipped] = React.useState(new Set<number>());

//   const isStepOptional = (step: number) => {
//     return step === 1;
//   };

//   const isStepSkipped = (step: number) => {
//     return skipped.has(step);
//   };

//   const handleNext = () => {
//     let newSkipped = skipped;
//     if (isStepSkipped(activeStep)) {
//       newSkipped = new Set(newSkipped.values());
//       newSkipped.delete(activeStep);
//     }

//     setActiveStep((prevActiveStep) => prevActiveStep + 1);
//     setSkipped(newSkipped);
//   };

//   const handleBack = () => {
//     setActiveStep((prevActiveStep) => prevActiveStep - 1);
//   };

//   const handleSkip = () => {
//     if (!isStepOptional(activeStep)) {
//       // You probably want to guard against something like this,
//       // it should never occur unless someone's actively trying to break something.
//       throw new Error("You can't skip a step that isn't optional.");
//     }

//     setActiveStep((prevActiveStep) => prevActiveStep + 1);
//     setSkipped((prevSkipped) => {
//       const newSkipped = new Set(prevSkipped.values());
//       newSkipped.add(activeStep);
//       return newSkipped;
//     });
//   };

//   const handleReset = () => {
//     setActiveStep(0);
//   };

//   return (
//     <Row className="mb-8">

//       <Col xl={12} lg={12} md={12} xs={12}>
//         <Card>
//           <h4 className="m-2 p-1 text-dark justify-center content-start text-2xl text-center font-bold">Applicants form</h4>
//           {/* card body */}
//           <Card.Body>
//             <Box sx={{ width: '100%' }}>
//               <Stepper activeStep={activeStep}>
//                 {steps.map((label, index) => {
//                   const stepProps: { completed?: boolean } = {};
//                   const labelProps: {
//                     optional?: React.ReactNode;
//                   } = {};
//                   if (isStepOptional(index)) {
//                     labelProps.optional = (
//                       <Typography variant="caption">Optional</Typography>
//                     );
//                   }
//                   if (isStepSkipped(index)) {
//                     stepProps.completed = false;
//                   }
//                   return (
//                     <Step key={label} {...stepProps}>
//                       <StepLabel {...labelProps}>{label}</StepLabel>
//                     </Step>
//                   );
//                 })}
//               </Stepper>
//               {activeStep === steps.length ? (
//                 <React.Fragment>
//                   <Typography sx={{ mt: 2, mb: 1 }}>
//                     All steps completed - you&apos;re finished
//                   </Typography>
//                   <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
//                     <Box sx={{ flex: '1 1 auto' }} />
//                     <Button onClick={handleReset}>Reset</Button>
//                   </Box>
//                 </React.Fragment>
//               ) : (
//                 <React.Fragment>
//                   <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography>
//                   <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
//                     <Button
//                       color="inherit"
//                       disabled={activeStep === 0}
//                       onClick={handleBack}
//                       sx={{ mr: 1 }}
//                     >
//                       Back
//                     </Button>
//                     <Box sx={{ flex: '1 1 auto' }} />
//                     {isStepOptional(activeStep) && (
//                       <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
//                         Skip
//                       </Button>
//                     )}
//                     <Button onClick={handleNext}>
//                       {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
//                     </Button>
//                   </Box>
//                 </React.Fragment>
//               )}
//             </Box>
//           </Card.Body>
//         </Card>
//       </Col>
//     </Row>
//   );
// };

// export default AddApplicants;



// import { Col, Row, Card } from "react-bootstrap";
// import * as React from 'react';
// import Box from '@mui/material/Box';
// import Stepper from '@mui/material/Stepper';
// import Step from '@mui/material/Step';
// import StepLabel from '@mui/material/StepLabel';
// import Button from '@mui/material/Button';
// import Typography from '@mui/material/Typography';
// import PersonalDetails from "pages/ApplicantForm/PersonalDetails";
// import EducationalDetails from "pages/ApplicantForm/EducationalDetails";
// import JobSkillsDetails from "pages/ApplicantForm/JobSkillsDetails";
// import FormSubmitted from "pages/ApplicantForm/FormSubmitted";

// const steps = ['Personal Details', 'Educational Details', 'Job Details'];

// const AddApplicants = () => {
//   const [activeStep, setActiveStep] = React.useState(0);
//   const [skipped, setSkipped] = React.useState(new Set<number>());

//   const [formData, setFormData] = React.useState({
//     personalDetails: {},
//     educationalDetails: {},
//     jobSkillsDetails: {},
//   });

//   const isStepOptional = (step: number) => step === 1;
//   const isStepSkipped = (step: number) => skipped.has(step);

//   // const handleNext = () => {
//   //   let newSkipped = skipped;
//   //   if (isStepSkipped(activeStep)) {
//   //     newSkipped = new Set(newSkipped.values());
//   //     newSkipped.delete(activeStep);
//   //   }

//   //   setActiveStep((prevActiveStep) => prevActiveStep + 1);
//   //   setSkipped(newSkipped);
//   // };
//   const handleNext = (data) => {
//     if (activeStep === 0) {
//       setFormData((prev) => ({ ...prev, personalDetails: data }));
//     } else if (activeStep === 1) {
//       setFormData((prev) => ({ ...prev, educationalDetails: data }));
//     } else if (activeStep === 2) {
//       setFormData((prev) => ({ ...prev, jobSkillsDetails: data }));
//       console.log('Final Data:', { ...formData, jobSkillsDetails: data });
//       // Here you can handle the final submission, e.g., send to an API
//     }

//     setActiveStep((prevActiveStep) => prevActiveStep + 1);
//   };


//   const handleBack = () => {
//     setActiveStep((prevActiveStep) => prevActiveStep - 1);
//   };

//   const handleSkip = () => {
//     if (!isStepOptional(activeStep)) {
//       throw new Error("You can't skip a step that isn't optional.");
//     }

//     setActiveStep((prevActiveStep) => prevActiveStep + 1);
//     setSkipped((prevSkipped) => {
//       const newSkipped = new Set(prevSkipped.values());
//       newSkipped.add(activeStep);
//       return newSkipped;
//     });
//   };

//   const handleReset = () => {
//     setActiveStep(0);
//   };

//   return (
//     <Row className="mb-8">
//       <Col xl={12} lg={12} md={12} xs={12}>
//         <Card>
//           <h4 className="m-2 p-1 text-dark justify-center content-start text-2xl text-center font-bold">Applicants form</h4>
//           <Card.Body>
//             <Box sx={{ width: '100%' }}>
//               {/* <Stepper activeStep={activeStep}>
//                 {steps.map((label, index) => {
//                   const stepProps: { completed?: boolean } = {};
//                   const labelProps: { optional?: React.ReactNode } = {};
//                   if (isStepOptional(index)) {
//                     labelProps.optional = <Typography variant="caption">Optional</Typography>;
//                   }
//                   if (isStepSkipped(index)) {
//                     stepProps.completed = false;
//                   }
//                   return (
//                     <Step key={label} {...stepProps}>
//                       <StepLabel {...labelProps}>{label}</StepLabel>
//                     </Step>
//                   );
//                 })}
//               </Stepper> */}
//               <Stepper activeStep={activeStep}>
//                 {steps.map((label) => (
//                   <Step key={label}>
//                     <StepLabel>{label}</StepLabel>
//                   </Step>
//                 ))}
//               </Stepper>

//               {activeStep === steps.length ? (
//                 <React.Fragment>
//                   <Typography sx={{ mt: 2, mb: 1 }}>
//                     All steps completed - you're finished
//                   </Typography>
//                   <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
//                     <Box sx={{ flex: '1 1 auto' }} />
//                     <Button onClick={handleReset}>Reset</Button>
//                   </Box>
//                 </React.Fragment>
//               ) : (
//                 <React.Fragment>
//                   <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography>

//                   {/* Render the form based on the active step */}
//                   <div>
//                     {activeStep === 0 && <PersonalDetails />}
//                     {activeStep === 1 && <EducationalDetails />}
//                     {activeStep === 2 && <JobSkillsDetails />}
//                   </div>

//                   <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
//                     <Button color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
//                       Back
//                     </Button>
//                     <Box sx={{ flex: '1 1 auto' }} />
//                     {isStepOptional(activeStep) && (
//                       <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
//                         Skip
//                       </Button>
//                     )}
//                     <Button onClick={handleNext}>
//                       {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
//                     </Button>
//                   </Box>
//                 </React.Fragment>
//               )}
//             </Box>
//           </Card.Body>
//         </Card>
//       </Col>
//     </Row>
//   );
// };

// export default AddApplicants;


import { Col, Row, Card } from "react-bootstrap";
import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import PersonalDetails from "pages/ApplicantForm/PersonalDetails";
import EducationalDetails from "pages/ApplicantForm/EducationalDetails";
import JobSkillsDetails from "pages/ApplicantForm/JobSkillsDetails";
import FormSubmitted from "pages/ApplicantForm/FormSubmitted";

const steps = ['Personal Details', 'Educational Details', 'Job Details'];

const AddApplicants = () => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set<number>());
  const [formData, setFormData] = React.useState({
    personalDetails: {},
    educationalDetails: {},
    jobSkillsDetails: {},
  });

  const isStepOptional = (step: number) => step === 1;
  const isStepSkipped = (step: number) => skipped.has(step);

  const handleNext = (data) => {
    if (activeStep === 0) {
      setFormData((prev) => ({ ...prev, personalDetails: data }));
    } else if (activeStep === 1) {
      setFormData((prev) => ({ ...prev, educationalDetails: data }));
    } else if (activeStep === 2) {
      setFormData((prev) => ({ ...prev, jobSkillsDetails: data }));
      console.log('Final Data:', { ...formData, jobSkillsDetails: data });
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleSubmit = () => {
    // Simulate submitting the form data (e.g., sending to an API)
    console.log("Submitting Form Data:", formData);
    // Show success message
    alert("Form submitted successfully!");
    setActiveStep(0); // Reset stepper after submission
  };

  const renderPreview = () => (
    <div>
      <h4 className="text-center mb-4">Preview Form Data</h4>
      <div className="preview-section">
        <h5>Personal Details</h5>
        <pre>{JSON.stringify(formData.personalDetails, null, 2)}</pre>
        <h5>Educational Details</h5>
        <pre>{JSON.stringify(formData.educationalDetails, null, 2)}</pre>
        <h5>Job Skills Details</h5>
        <pre>{JSON.stringify(formData.jobSkillsDetails, null, 2)}</pre>
      </div>
      <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
        <Button onClick={handleReset}>Edit</Button>
        <Box sx={{ flex: '1 1 auto' }} />
        <Button onClick={handleSubmit}>Submit</Button>
      </Box>
    </div>
  );

  return (
    <Row className="mb-8">
      <Col xl={12} lg={12} md={12} xs={12}>
        <Card>
          <h4 className="m-2 p-1 text-dark justify-center content-start text-2xl text-center font-bold">Applicants form</h4>
          <Card.Body>
            <Box sx={{ width: '100%' }}>
              <Stepper activeStep={activeStep}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>

              {activeStep === steps.length ? (
                <React.Fragment>
                  {renderPreview()}
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography>
                  {/* Render the form based on the active step */}
                  <div>
                    {activeStep === 0 && <PersonalDetails onSubmit={handleNext} />}
                    {activeStep === 1 && <EducationalDetails onSubmit={handleNext} />}
                    {activeStep === 2 && <JobSkillsDetails onSubmit={handleNext} />}
                  </div>

                  <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                    <Button color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
                      Back
                    </Button>
                    <Box sx={{ flex: '1 1 auto' }} />
                    {isStepOptional(activeStep) && (
                      <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                        Skip
                      </Button>
                    )}
                    <Button onClick={() => handleNext(formData[steps[activeStep].toLowerCase()])}>
                      {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                    </Button>
                  </Box>
                </React.Fragment>
              )}
            </Box>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default AddApplicants;
