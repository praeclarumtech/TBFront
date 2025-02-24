import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { FormProvider, useForm } from "react-hook-form";
import PersonalDetailsForm from "../../components/StepperForm/PersonalDetailsForm";
import { Button } from "@mui/material";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { setPersonalDetails } from "../../store/slices/personalDetailsSlice";
import { Applicant } from "../../types";
import axios from "axios";
import { Box, Stepper, Step, StepLabel } from "@mui/material";
import EducationalDetailsForm from "../../components/StepperForm/EducationSkillsForm";
import JobDetailsForm from "../../components/StepperForm/JobDetailsForm";
import PreviewForm from "../../components/StepperForm/PreviewForm";

interface UpdateModalProps {
  show: boolean;
  onHide: () => void;
  editingApplicant: Applicant | null;
  fetchApplicants: object | null | undefined | any;
}

const steps = [
  "Personal Details",
  "Educational Details",
  "Job Details",
  "Preview",
];

const UpdateModal: React.FC<UpdateModalProps> = ({
  show,
  onHide,
  editingApplicant,
  fetchApplicants,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<any>({
    personal: {},
    education: {},
    job: {},
  });
  const dispatch = useDispatch();

  useEffect(() => {
    if (editingApplicant) {
      const initialFormData = {
        personal: {
          firstName: editingApplicant.name?.firstName || "",
          middleName: editingApplicant.name?.middleName || "",
          lastName: editingApplicant.name?.lastName || "",
          phoneNumber: editingApplicant.phone?.phoneNumber || "",
          whatsappNumber: editingApplicant.phone?.whatsappNumber || "",
          email: editingApplicant.email || "",
          gender: editingApplicant.gender || "",
          dateOfBirth: editingApplicant.dateOfBirth || "",
          fullAddress: editingApplicant.fullAddress || "",
          state: editingApplicant.state || "",
          country: editingApplicant.country || "",
          pincode: editingApplicant.pincode || "",
          city: editingApplicant.city || "",
        },
        education: {
          qualification: editingApplicant.qualification || "",
          degree: editingApplicant.degree || "",
          passingYear: editingApplicant.passingYear || "",
          appliedSkills: editingApplicant.appliedSkills || [],
          totalExperience: editingApplicant.totalExperience || "",
          relevantSkillExperience:
            editingApplicant.relevantSkillExperience || "",
          otherSkills: editingApplicant.otherSkills || "",
          rating: editingApplicant.rating || "",
          referral: editingApplicant.referral || "",
          url: editingApplicant.url || "",
        },
        job: {
          currentPkg: editingApplicant.currentPkg || "",
          expectedPkg: editingApplicant.expectedPkg || "",
          noticePeriod: editingApplicant.noticePeriod || "",
          negotiation: editingApplicant.negotiation || "",
          readyForWork: editingApplicant.readyForWork || "",
          workPreference: editingApplicant.workPreference || "",
          aboutUs: editingApplicant.aboutUs || "",
        },
      };

      setFormData(initialFormData);
    }
  }, [editingApplicant]);

  const handleNext = (data: any) => {
    if (activeStep === 0) {
      setFormData((prev: any) => ({
        ...prev,
        personal: { ...prev.personal, ...data },
      }));
    } else if (activeStep === 1) {
      setFormData((prev: any) => ({
        ...prev,
        education: { ...prev.education, ...data },
      }));
    } else if (activeStep === 2) {
      setFormData((prev: any) => ({
        ...prev,
        job: { ...prev.job, ...data },
      }));
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleEdit = (step: number) => {
    setActiveStep(step);
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);

      const transformedData = {
        name: {
          firstName: formData.personal?.name?.firstName ?? "",
          middleName: formData.personal?.name?.middleName ?? "",
          lastName: formData.personal?.name?.lastName ?? "",
        },
        phone: {
          phoneNumber: formData.personal?.phoneNumber || "",
          whatsappNumber: formData.personal?.whatsappNumber || "",
        },
        email: formData.personal?.email,
        gender: formData.personal?.gender,
        dateOfBirth: formData.personal?.dateOfBirth,
        fullAddress: formData.personal?.fullAddress,
        state: formData.personal?.state,
        country: formData.personal?.country,
        pincode: formData.personal?.pincode,
        city: formData.personal?.city,
        qualification: formData.education.qualification,
        degree: formData.education.degree,
        passingYear: formData.education.passingYear,
        appliedSkills: formData.education.appliedSkills,
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

      if (editingApplicant?._id) {
        const response = await axios.put(
          `https://tbapi-jtu7.onrender.com/api/applicants/updateApplicant/${editingApplicant._id}`,
          transformedData
        );
        if (response.data) {
          if (typeof fetchApplicants === "function") {
            await fetchApplicants();
          }
          toast.success("Applicant updated successfully!");
          onHide();
          setActiveStep(0);
        }
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update applicant.");
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    if (!show) {
      setActiveStep(0);
    }
  }, [show]);

  return (
    <Modal show={show} onHide={onHide} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Edit Applicant</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Box sx={{ width: "100%" }}>
          <Stepper activeStep={activeStep}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <Box sx={{ mt: 2 }}>
            {activeStep === 0 && (
              <PersonalDetailsForm
                onNext={handleNext}
                onCancel={onHide}
                initialValues={formData.personal}
                showNext={true}
              />
            )}
            {activeStep === 1 && (
              <EducationalDetailsForm
                onNext={handleNext}
                onBack={handleBack}
                initialValues={formData.education}
                showNext={true}
              />
            )}
            {activeStep === 2 && (
              <JobDetailsForm
                onNext={handleNext}
                onBack={handleBack}
                initialValues={formData.job}
                showNext={true}
              />
            )}
            {activeStep === 3 && (
              <PreviewForm
                data={formData}
                onEdit={handleEdit}
                onSubmit={handleSave}
              />
            )}
          </Box>
        </Box>
      </Modal.Body>
    </Modal>
  );
};

export default UpdateModal;
