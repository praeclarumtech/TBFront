// import moment from "moment";
import * as Yup from "yup";

export type SelectedOption = { label: string; value: string };
export type SelectedOptionRole = { label: string; value: string };
export type SelectedOption1 = { label: string; value: string; id: number };
export const EducationApplicantSchema = Yup.object({
  // qualification: Yup.string(),

  // .required("Qualification is required!"),
  specialization: Yup.string()
    // .required("Specialization Name is required!")
    .matches(/^[A-Za-z\s]+$/, "Specialization can only contain letters."),
  passingYear: Yup.string(),
  // .required("Passing Year is required!"),
  cgpa: Yup.string()
    .min(1, "CGPA must be at least 1.")
    .max(10, "CGPA must not exceed 10.")

    .typeError("Please enter a valid number for CGPA."),
  collegeName: Yup.string().matches(
    /^[A-Za-z\s]+$/,
    "College name can only contain letters."
  ),
});

export const jobApplicantSchema = Yup.object({
  preferredLocations: Yup.string()
    // .required("Preferred location is required!")
    .min(2, "Please specify at least one location."),
  lastFollowUpDate: Yup.date(),
  maritalStatus: Yup.string(),
  // maritalStatus: Yup.string().required("Marital status is required."),
  currentCompanyDesignation: Yup.string().required(
    "Current Company Designation is required"
  ),
  appliedRole: Yup.string().required("Applied role is required!"),
  anyHandOnOffers: Yup.boolean(),
  currentCompanyName: Yup.string()
    .trim()
    .matches(/^[A-Za-z0-9\s&.-]+$/, "Please enter a valid company name."),
  currentPkg: Yup.string().matches(
    /^\d+(\.\d{1,2})?$/,
    "Please enter a valid current package."
  ),
  expectedPkg: Yup.string().matches(
    /^\d+(\.\d{1,2})?$/,
    "Please enter a valid expected package."
  ),
  negotiation: Yup.string(),
  // .matches(
  // /^\d+$/,
  // "Please enter a valid negotiation amount."
  // ),
  noticePeriod: Yup.string()
    // .matches(/^\d+$/, "Please enter a valid notice period in days.")
    .min(0, "Notice period cannot be negative."),
  workPreference: Yup.string()
    // .required("Work preference is required!")
    .oneOf(
      ["remote", "onsite", "hybrid"],
      "Please select a valid work preference."
    ),
  practicalUrl: Yup.string().url("Please enter a valid URL."),
  practicalFeedback: Yup.string()
    .min(10, "Please provide detailed feedback (minimum 10 characters.)")
    .max(150, " Please keep your practicalFeedback under 150 characters."),
  linkedinUrl: Yup.string().url("Please enter a valid URL."),
  clientCvUrl: Yup.string().url("Please enter a valid URL."),
  clientFeedback: Yup.string().max(
    150,
    " Please keep your clientFeedback under 150 characters."
  ),
  communicationSkill: Yup.number()
    // .required("Communication skill rating is required!")
    .min(1, "Rating must be between 1 and 10.")
    .max(10, "Rating must be between 1 and 10."),
  comment: Yup.string()
    .min(
      10,
      "Please provide a detailed comment about how you found us (minimum 10 characters)."
    )
    .max(500, " Please keep your comment under 500 characters."),
  appliedSkills: Yup.array().of(Yup.string()),
  // .required("Skills are required!")
  // .min(1, "Please select at least one skill."),
  otherSkills: Yup.string(),
  totalExperience: Yup.string(),
  tech: Yup.string(),
  relevantSkillExperience: Yup.string()
    .matches(
      /^\d+(\.\d{1,2})?$/,
      "Enter a valid number for relevant experience."
    )
    // .required("Relevant experience is required.")
    .test(
      "relevant-less-than-total",
      "Relevant experience cannot be more than total experience.",
      function (value) {
        const { totalExperience } = this.parent;
        const total = parseFloat(totalExperience);
        const relevant = parseFloat(value ?? "0");
        return isNaN(total) || isNaN(relevant) || relevant <= total;
      }
    ),
  referral: Yup.string(),
  portfolioUrl: Yup.string().url("Please enter a valid portfolio URL."),
  resumeUrl: Yup.string().url(),
  // .required("Resume URL is required!."),
  rating: Yup.number()
    // .required("Rating is required!")
    .min(1, "Rating must be between 1 and 10.")
    .max(10, "Rating must be between 1 and 10."),
});

export const personalApplicantSchema = Yup.object({
  dateOfBirth: Yup.date()
    // .required("Date of birth is required!")
    .nullable()
    .typeError("Please enter a valid date.")
    .min(
      new Date(1960, 0, 1),
      "Year must be between 1960 and the current year."
    )
    .max(new Date(), "Date of birth cannot be in the future."),
  firstName: Yup.string()
    .required("First name is required")
    .max(15, "First name cannot exceed 15 characters.")
    .min(2, "First name must be at least 2 characters.")
    .matches(/^[A-Za-z\s]+$/, "First name can only contain letters.")
    .trim(),
  lastName: Yup.string()
    .required("Last name is required")
    .max(15, "Last name cannot exceed 15 characters.")
    .min(2, "Last name must be at least 2 characters.")
    .matches(/^[A-Za-z\s]+$/, "Last name can only contain letters.")
    .trim(),
  middleName: Yup.string()
    .max(15, "Middle name cannot exceed 15 characters.")
    .min(2, "Middle name must be at least 2 characters.")
    .matches(/^[A-Za-z\s]+$/, "Middle name can only contain letters.")
    .nullable(),
  email: Yup.string()
    .email("Please enter a valid email address.")
    .required("Email is required")
    .test(
      "valid-multiple-emails",
      "Emails must not exceed 100 characters.",
      (value) => {
        if (!value) return false;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const emails = value.split(",").map((e) => e.trim());

        return emails.every(
          (email) => emailRegex.test(email) && email.length <= 100
        );
      }
    ),
  phoneNumber: Yup.string()
    .matches(/^[0-9]{10}$/, "Please enter a valid 10-digit phone number.")
    .required("Phone number is required"),
  whatsappNumber: Yup.string()
    .matches(/^[0-9]{10}$/, "Please enter a valid 10-digit WhatsApp number.")
    .required("WhatsApp number is required!"),
  currentCity: Yup.string(),
  currentAddress: Yup.string()
    .min(5, "Please provide a detailed location.")
    .max(150, " Please keep your currentAddress under 150 characters."),
  permanentAddress: Yup.string()
    .min(5, "Please provide a detailed location.")
    .max(150, " Please keep your permanentAddress under 150 characters."),
  gender: Yup.string(),
  country: Yup.string(),
  state: Yup.string(),
});

export interface Qualification {
  label: string;
  value: string;
}

export interface City {
  label: string;
  value: string;
}
export interface appliedSkills {
  label: string;
  value: string;
}
export type Role = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Data Analyst",
  "Data Scientist",
  "Product Manager",
  "UX/UI Designer",
  "QA Engineer",
  "DevOps Engineer",
  "Business Analyst",
  "Technical Support Engineer",
  "Software Engineer",
  "MERN Stack Developer",
  "MEAN Stack Developer",
  "DotNet Full Stack Developer",
  "Java Developer",
  "Python Developer",
  "PHP Developer",
  "Other",
  "Na"
];

export const QrApplicants = Yup.object({
  firstName: Yup.string()
    .required("First name is required")
    .max(15, "First name cannot exceed 15 characters.")
    .min(2, "First name must be at least 2 characters.")
    .matches(/^[A-Za-z\s]+$/, "First name can only contain letters.")
    .trim(),
  lastName: Yup.string()
    .required("Last name is required")
    .max(15, "Last name cannot exceed 15 characters.")
    .min(2, "Last name must be at least 2 characters.")
    .matches(/^[A-Za-z\s]+$/, "Last name can only contain letters.")
    .trim(),
  email: Yup.string()
    .email("Please enter a valid email address.")
    .required("Email is required")
    .test(
      "valid-multiple-emails",
      "Emails must not exceed 100 characters.",
      (value) => {
        if (!value) return false;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const emails = value.split(",").map((e) => e.trim());

        return emails.every(
          (email) => emailRegex.test(email) && email.length <= 100
        );
      }
    ),
  phoneNumber: Yup.string()
    .matches(/^[0-9]{10}$/, "Please enter a valid 10-digit phone number.")
    .required("Phone number is required"),
  preferredLocations: Yup.string()
    // .required("Preferred location is required!")
    .min(2, "Please specify at least one location."),
  lastFollowUpDate: Yup.date(),
  maritalStatus: Yup.string(),
  // maritalStatus: Yup.string().required("Marital status is required."),
  currentCompanyDesignation: Yup.string().required(
    "Current Company Designation is required"
  ),
  anyHandOnOffers: Yup.boolean(),
  currentCompanyName: Yup.string()
    .trim()
    .matches(/^[A-Za-z0-9\s&.-]+$/, "Please enter a valid company name."),
  currentPkg: Yup.string().matches(
    /^\d+(\.\d{1,2})?$/,
    "Please enter a valid current package."
  ),
  expectedPkg: Yup.string().matches(
    /^\d+(\.\d{1,2})?$/,
    "Please enter a valid expected package."
  ),
  negotiation: Yup.string(),
  noticePeriod: Yup.string().min(0, "Notice period cannot be negative."),
  workPreference: Yup.string().oneOf(
    ["remote", "onsite", "hybrid"],
    "Please select a valid work preference."
  ),
  linkedinUrl: Yup.string().url("Please enter a valid URL."),
  otherSkills: Yup.string(),
  appliedRole: Yup.string().required("Applied role is required"),
  state: Yup.string().required("State is requied"),
  totalExperience: Yup.string().required("Total Experience Required"),
  appliedSkills: Yup.array()
    .of(Yup.string().required("Skill is required"))
    .min(1, "At least one skill is required"),
  relevantSkillExperience: Yup.string()
    .matches(
      /^\d+(\.\d{1,2})?$/,
      "Enter a valid number for relevant experience."
    )
    // .required("Relevant experience is required.")
    .test(
      "relevant-less-than-total",
      "Relevant experience cannot be more than total experience.",
      function (value) {
        const { totalExperience } = this.parent;
        const total = parseFloat(totalExperience);
        const relevant = parseFloat(value ?? "0");
        return isNaN(total) || isNaN(relevant) || relevant <= total;
      }
    ),
  communicationSkill: Yup.number()
    .required("Communication rating is required!")
    .min(1, "Rating must be between 1 and 10.")
    .max(10, "Rating must be between 1 and 10."),
});
