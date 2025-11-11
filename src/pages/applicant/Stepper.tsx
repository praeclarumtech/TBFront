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
import { Fragment, useEffect, useState, useCallback, useRef } from "react";
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
import BasePopUpModal from "components/BaseComponents/BasePopUpModal";

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
  const [initialFormData, setInitialFormData] = useState<any>(null);
  const [showSaveConfirmModal, setShowSaveConfirmModal] = useState(false);
  const [pendingStepData, setPendingStepData] = useState<any>(null);
  const [savingChanges, setSavingChanges] = useState(false);
  const getCurrentStepValuesRef = useRef<(() => any) | null>(null);
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
    interviewMode: "",
  });
  const steps = [
    "Personal Details",
    "Educational Details",
    "Job Details",
    "Preview",
  ];

  const normalizeValue = (value: any): any => {
    try {
      if (value === null || value === undefined || value === "") {
        return "";
      }

      if (Array.isArray(value)) {
        const filtered = value.filter(
          (item) => item !== null && item !== undefined && item !== ""
        );
        if (filtered.length === 0) return [];

        if (
          filtered.every(
            (item) => typeof item === "string" || typeof item === "number"
          )
        ) {
          return [...filtered].sort().map((item) => normalizeValue(item));
        }
        return filtered.map((item) => normalizeValue(item));
      }

      if (typeof value === "object" && value !== null) {
        if (value instanceof Date) {
          return value.toISOString();
        }
        if (value.constructor && value.constructor.name !== "Object") {
          return value;
        }

        const normalized: any = {};
        Object.keys(value)
          .sort()
          .forEach((key) => {
            try {
              normalized[key] = normalizeValue(value[key]);
            } catch (err) {
              normalized[key] = value[key];
            }
          });
        return normalized;
      }

      return value;
    } catch (error) {
      console.warn("Normalization error:", error, value);
      return value;
    }
  };

  const hasChanges = (currentData: any, initialData: any) => {
    if (!initialData || !currentData) return false;

    try {
      const normalizedCurrent = normalizeValue(currentData);
      const normalizedInitial = normalizeValue(initialData);

      const seen1 = new WeakSet();
      const currentDataStr = JSON.stringify(
        normalizedCurrent,
        (_key, value) => {
          if (typeof value === "object" && value !== null) {
            if (seen1.has(value)) {
              return "[Circular]";
            }
            seen1.add(value);
          }
          return value;
        }
      );

      const seen2 = new WeakSet();
      const initialDataStr = JSON.stringify(
        normalizedInitial,
        (_key, value) => {
          if (typeof value === "object" && value !== null) {
            if (seen2.has(value)) {
              return "[Circular]";
            }
            seen2.add(value);
          }
          return value;
        }
      );

      return currentDataStr !== initialDataStr;
    } catch (error) {
      console.error("Error comparing form data:", error);
      return false;
    }
  };

  const handleNext = (data: any) => {
    const updatedFormData = {
      ...formData,
      ...data,
    };

    setFormData(updatedFormData);

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

  const handleEdit = async (stepIndex: number) => {
    if (stepIndex === 3 && Boolean(id) && initialFormData) {
      let currentFormData = formData;

      if (getCurrentStepValuesRef.current) {
        try {
          const currentStepValues = getCurrentStepValuesRef.current();
          if (currentStepValues) {
            // Merge current step values with existing formData for comparison only
            currentFormData = {
              ...formData,
              ...currentStepValues,
            };
            // Don't update formData here - only use for comparison
          }
        } catch (error) {
          console.error("Error getting current step values:", error);
        }
      }

      const hasChangesResult = hasChanges(currentFormData, initialFormData);

      if (hasChangesResult) {
        setPendingStepData(currentFormData);
        setShowSaveConfirmModal(true);

        return;
      }
    }
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
      interviewMode: formData.interviewMode,
    };
  };

  const saveChangesWithoutNavigation = async (dataToSave: any) => {
    setSavingChanges(true);
    const apiData = {
      name: {
        firstName: dataToSave.name.firstName,
        middleName: dataToSave.name.middleName,
        lastName: dataToSave.name.lastName,
      },
      phone: {
        whatsappNumber: dataToSave.phone.whatsappNumber,
        phoneNumber: dataToSave.phone.phoneNumber,
      },
      email: dataToSave.email,
      gender: dataToSave.gender,
      dateOfBirth: dataToSave.dateOfBirth,
      state: dataToSave.state,
      country: dataToSave.country,
      currentPincode: dataToSave.currentPincode,
      currentCity: dataToSave.currentCity,
      qualification: dataToSave.qualification,
      specialization: dataToSave.specialization,
      passingYear: dataToSave.passingYear,
      appliedSkills: dataToSave.appliedSkills,
      totalExperience: dataToSave.totalExperience,
      relevantSkillExperience: dataToSave.relevantSkillExperience,
      otherSkills: dataToSave.otherSkills,
      referral: dataToSave.referral,
      resumeUrl: dataToSave.resumeUrl,
      rating: dataToSave.rating,
      currentPkg: dataToSave.currentPkg,
      expectedPkg: dataToSave.expectedPkg,
      negotiation: dataToSave.negotiation,
      noticePeriod: dataToSave.noticePeriod,
      workPreference: dataToSave.workPreference,
      portfolioUrl: dataToSave.portfolioUrl,
      practicalUrl: dataToSave.practicalUrl,
      feedback: dataToSave.practicalFeedback,
      practicalFeedback: dataToSave.practicalFeedback,
      comment: dataToSave.comment,
      communicationSkill: dataToSave.communicationSkill,
      currentCompanyDesignation: dataToSave.currentCompanyDesignation,
      preferredLocations: dataToSave.preferredLocations,
      maritalStatus: dataToSave.maritalStatus,
      currentCompanyName: dataToSave.currentCompanyName,
      appliedRole: dataToSave.appliedRole,
      anyHandOnOffers: dataToSave.anyHandOnOffers,
      lastFollowUpDate: dataToSave.lastFollowUpDate,
      collegeName: dataToSave.collegeName,
      cgpa: dataToSave.cgpa,
      currentAddress: dataToSave.currentAddress,
      permanentAddress: dataToSave.permanentAddress,
      linkedinUrl: dataToSave.linkedinUrl,
      clientCvUrl: dataToSave.clientCvUrl,
      gitHubUrl: dataToSave.gitHubUrl,
      clientFeedback: dataToSave.clientFeedback,
      meta: dataToSave.meta,
      interviewMode: dataToSave.interviewMode,
    };

    try {
      if (moduleName === "import-applicant") {
        const res = await updateImportedApplicant(apiData, id);
        if (res.success) {
          const updatedRes = await getImportedApplicantDetails(id);
          if (updatedRes.success) {
            setFormData(updatedRes.data);
            setInitialFormData(JSON.parse(JSON.stringify(updatedRes.data)));
            toast.success("Changes saved successfully!");
            return true;
          }
        }
      } else {
        const res = await updateApplicant(apiData, id);
        if (res.success) {
          const updatedRes = await getApplicantDetails(id);
          if (updatedRes.success) {
            setFormData(updatedRes.data);
            setInitialFormData(JSON.parse(JSON.stringify(updatedRes.data)));
            toast.success("Changes saved successfully!");
            return true;
          }
        }
      }
      return false;
    } catch (error: any) {
      const errorMessages = error?.response?.data?.details;
      if (errorMessages && Array.isArray(errorMessages)) {
        errorMessages.forEach((errorMessage: string) => {
          toast.error(errorMessage);
        });
      } else {
        toast.error("An error occurred while saving changes.");
      }
      return false;
    } finally {
      setSavingChanges(false);
    }
  };

  const handleConfirmSave = async () => {
    if (pendingStepData) {
      const success = await saveChangesWithoutNavigation(pendingStepData);
      if (success) {
        setShowSaveConfirmModal(false);
        setPendingStepData(null);
        setActiveStep(3);
      }
    }
  };

  const handleCancelSave = () => {
    setShowSaveConfirmModal(false);
    setPendingStepData(null);
    setActiveStep(3);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const apiData = formatApiData();

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
              setInitialFormData(JSON.parse(JSON.stringify(res.data)));
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
              setInitialFormData(JSON.parse(JSON.stringify(res.data)));
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

  useEffect(() => {
    getCurrentStepValuesRef.current = null;
  }, [activeStep]);



  const setCurrentStepValuesGetter = useCallback((getValues: () => any) => {
    getCurrentStepValuesRef.current = getValues;
  }, []);

  const isEditMode = Boolean(id);
  const titleForm = isEditMode ? "Update Applicant" : "Create Applicant";
  return (
    <Fragment>
      <BasePopUpModal
        isOpen={showSaveConfirmModal}
        onRequestClose={() => setShowSaveConfirmModal(false)}
        title="Unsaved Changes"
        message="You have unsaved changes. Do you want to save these changes before proceeding to preview?"
        confirmAction={handleConfirmSave}
        cancelAction={handleCancelSave}
        confirmText={savingChanges ? "Saving..." : "Save & Continue"}
        cancelText="Continue Without Saving"
        disabled={savingChanges}
      />
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
                      onClick={isEditMode ? () => handleEdit(index) : undefined}
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
                        onGetCurrentValues={setCurrentStepValuesGetter}
                      />
                    )}
                    {activeStep === 1 && (
                      <EducationalDetailsForm
                        onNext={handleNext}
                        onBack={handleBack}
                        initialValues={formData}
                        onGetCurrentValues={setCurrentStepValuesGetter}
                      />
                    )}
                    {activeStep === 2 && (
                      <JobDetailsForm
                        onNext={handleNext}
                        onBack={handleBack}
                        initialValues={formData}
                        onGetCurrentValues={setCurrentStepValuesGetter}
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
