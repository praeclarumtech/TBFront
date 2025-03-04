import * as Yup from "yup";

export type SelectedOption = { label: string; value: string };

export const EducationApplicantSchema = Yup.object({
  qualification: Yup.array()
    .required("Qualification is required")
    .min(1, "At least one skill must be selected"),
  degree: Yup.string().required("Degree Name is required"),
  passingYear: Yup.string().required("Passing Year is required"),
  appliedSkills: Yup.array()
    .required("Passing Skill is required")
    .min(1, "At least one skill must be selected"),
  otherSkills: Yup.string(),
  totalExperience: Yup.number()
    .positive("Total Experience must be a positive number")
    .required("Total Experience is required"),
  relevantSkillExperience: Yup.number()
    .min(0, "Relevant Skill Experience cannot be negative")
    .required("Relevant Skill Experience is required")
    .test(
      "is-less-than-or-equal-total",
      "Relevant Skill Experience must be less than or equal to Total Experience",
      function (value) {
        const totalExperience = this.parent.totalExperience;
        return value <= totalExperience;
      }
    ),
  referral: Yup.string(),
  portfolioUrl: Yup.string().url("Invalid URL"),
  resumeUrl: Yup.string()
    .url("Please enter a valid URL")
    .required("Resume URL is required"),
  rating: Yup.number()
    .required("Rating is required")
    .min(1, "Rating must be between 1 and 10")
    .max(10, "Rating must be between 1 and 10"),
});

export const jobApplicantSchema = Yup.object({
  currentPkg: Yup.string().matches(
    /^\d+$/,
    "Current package must be a valid number."
  ),
  expectedPkg: Yup.string().matches(
    /^\d+$/,
    "Expected package must be a valid number."
  ),
  negotiation: Yup.string().matches(
    /^\d+$/,
    "Negotiation amount must be a valid number."
  ),
  noticePeriod: Yup.string()
    .min(0, "Notice period cannot be negative.")
    .matches(/^\d+$/, "Notice period must be a valid number."),
  workPreference: Yup.string()
    .required("Work preference is required.")
    .oneOf(
      ["remote", "onsite", "hybrid"],
      "Work preference must be one of 'remote', 'onsite', or 'hybrid'."
    ),
  practicalUrl: Yup.string().url("Please enter a valid URL."),
  practicalFeedback: Yup.string().min(
    10,
    "Feedback must be at least 10 characters long."
  ),
  communicationSkill: Yup.number()
    .required("Rating is required")
    .min(1, "Rating must be between 1 and 10")
    .max(10, "Rating must be between 1 and 10"),
  aboutUs: Yup.string()
    .required("About Us is required.")
    .min(10, "About Us description must be at least 10 characters long."),
});

export const personalApplicantSchema = Yup.object({
  firstName: Yup.string().required("First Name is required").max(15).min(2),
  lastName: Yup.string().required("Last Name is required").max(15).min(2),
  middleName: Yup.string().max(15).min(2),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phoneNumber: Yup.string()
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
    .required("Phone number is required"),
  whatsappNumber: Yup.string()
    .matches(/^[0-9]{10}$/, "WhatsApp number must be 10 digits")
    .required("WhatsApp Number is required"),
  dateOfBirth: Yup.date().required("Date of birth is required"),
  city: Yup.string().required("City is required"),
  pincode: Yup.string()
    .matches(/^[0-9]{6}$/, "Pincode must be 6 digits")
    .required("Pincode is required"),
  fullAddress: Yup.string().required("Full Address is required"),
  gender: Yup.string().required("Gender is required"),
  country: Yup.string().required("Country is required"),
  state: Yup.string().required("State is required"),
});
