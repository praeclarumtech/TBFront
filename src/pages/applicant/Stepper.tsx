/* eslint-disable @typescript-eslint/no-explicit-any */

import { Row, Col, Card, Container, CardBody } from "react-bootstrap";
import {
    Box,
    Stepper,
    Step,
    StepLabel,
    Button,
    Typography,
  } from "@mui/material";
import * as Yup from "yup";
//import custom hook
import {
  handleResponse,
  InputPlaceHolder,
  projectTitle,
} from "components/constants/common";
import { Modules } from "components/constants/enum";
import { useFormik } from "formik";
import { Fragment,  useState } from "react";
import PersonalDetailsForm from "./Personal";
import EducationalDetailsForm from "./Education";
import JobDetailsForm from "./Job";

type SelectedOption = { label: string; value: string };

const StepperForm = () => {
  document.title = Modules.Login + " | " + projectTitle;

  // const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    "Personal Details",
    "Educational Details",
    "Job Details",
    "Preview",
  ];

  const [formData, setFormData] = useState<any>({
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
      practicalUrl: "",
      practicalFeedback: "",
    },
  });
   
  const handleNext = (data: any) => {
    if (activeStep === 0) {
      setFormData((prev: any) => ({ ...prev, personal: data }));
    } else if (activeStep === 1) {
      setFormData((prev: any) => ({ ...prev, education: data }));
    } else if (activeStep === 2) {
      setFormData((prev: any) => ({ ...prev, job: data }));
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

//   const validation: any = useFormik({
//     enableReinitialize: true,
//     initialValues: {
//       appliedSkills: "",
//       totalExperience: "",
//     },
//     validationSchema: Yup.object({
//       appliedSkills: Yup.string(),
//       // .required(validationMessages.required("Email"))
//       // .email(validationMessages.format("Email"))
//       // .matches(emailRegex, validationMessages.format("Email")),
//       totalExperience: Yup.string(),
//     }),
//     onSubmit: () => {
//       // const payload = {
//       //   email: String(value.email),
//       //   password: value.password,
//       // };
//       // setLoader(true);
//       // login(payload)
//       //   .then((res) => {
//       //     if (res?.statusCode === OK && res?.success === SUCCESS) {
//       //       setItem("authUser", res?.data?.token);
//       //       const decode = jwtDecode<any>(res?.data);
//       //       const role = decode.role;
//       //       const id = decode.id;
//       //       setItem("role", role);
//       //       setItem("id", id);
//       //       navigate("/");
//       //       toast.success(res?.message);
//       //     } else {
//       //       toast.error(res?.message);
//       //     }
//       //   })
//       //   .catch((error) => {
//       //     errorHandle(error);
//       //     setLoader(false);
//       //   })
//       //   .finally(() => setLoader(false));
//     },
//   });

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
                  />
                )}
                {activeStep === 1 && (
                  <EducationalDetailsForm
                    onNext={handleNext}
                    onBack={handleBack}
                    // initialValues={formData.education}
                  />
                )}
                {activeStep === 2 && (
                  <JobDetailsForm
                    onNext={handleNext}
                    onBack={handleBack}
                    // initialValues={formData.job}
                  />
                )}
                {/* {activeStep === 3 && (
                  <PreviewForm
                    data={formData}
                    onEdit={handleEdit}
                    onSubmit={handleSubmit}
                  />
                )} */}
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
