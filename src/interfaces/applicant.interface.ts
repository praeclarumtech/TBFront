import * as Yup from "yup";

export type SelectedOption = { label: string; value: string };

export const EducationApplicantSchema = Yup.object({
  currentCompanyDesignation:Yup.string(),
  qualification: Yup.array()
    .required("Qualification is required")
    .min(1, "At least one skill must be selected"),
  degree: Yup.string().required("Degree Name is required"),
  passingYear: Yup.string().required("Passing Year is required"),
  appliedSkills: Yup.array()
    .required("Passing Skill is required")
    .min(1, "At least one skill must be selected"),
  otherSkills: Yup.string(),
  totalExperience: Yup.string(),
  relevantSkillExperience: Yup.string(),
  referral: Yup.string(),
  portfolioUrl: Yup.string().url("Invalid URL"),
  resumeUrl: Yup.string()
    // .url("Please enter a valid URL")
    .required("Resume URL is required"),
  rating: Yup.number()
    .required("Rating is required")
    .min(1, "Rating must be between 1 and 10")
    .max(10, "Rating must be between 1 and 10"),
});

export const jobApplicantSchema = Yup.object({
  lastFollowUpDate:Yup.date(),
  maritalStatus: Yup.string(),
  appliedRole: Yup.string(),
  anyHandOnOffers: Yup.boolean(),
  currentCompanyName: Yup.string(),
  currentPkg: Yup.string(),
  expectedPkg: Yup.string(),
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
  currentCity: Yup.string().required("Current City is required"),
  currentPincode: Yup.string().matches(
    /^[0-9]{6}$/,
    "Pincode must be 6 digits"
  ),
  currentLocation: Yup.string(),
  homeTownCity: Yup.string(),
  homePincode: Yup.string().matches(/^[0-9]{6}$/, "Pincode must be 6 digits"),
  preferredLocations: Yup.string(),
  gender: Yup.string().required("Gender is required"),
  country: Yup.string().required("Country is required"),
  state: Yup.string().required("State is required"),
});
