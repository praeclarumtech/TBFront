const appConstants = Object.freeze({
  ACCESS_TOKEN_ERROR_CODE: 401,
  REFRESH_TOKEN_ERROR_CODE: 401,
  ACCESS_TOKEN: "accessToken",
  ACTION_TYPES: {
    CREATE: "create",
    UPDATE: "update",
    DELETE: "delete",
    GET: "get",
    LIST: "list",
    LOGOUT: "logout",
  },
  noData: "-",
  dayEnums: {
    GoodMorning: "Good Morning",
    GoodAfternoon: "Good Afternoon",
    GoodEvening: "Good Evening",
  },
  handleScroll: {
    handleEditClick: () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },
  },
  handleResponse: {
    dataNotFound: "Sorry! No Result Found.",
    nullData: "---",
    somethingWrong: "Something went wrong.",
  },
  tableButtons: {
    Previous: "Previous",
    Next: "Next",
  },
  roleEnums: {
    Admin: "Admin",
    Vendor: "Vendor",
    Manager: "Manager",
    SuperAdmin: "Super Admin",
    Employee: "Employee",
  },
  searchPlaceHolder: "Search...",
  validationMessages: {
    required: (fieldName: string) =>
      `${
        fieldName.charAt(0).toUpperCase() + fieldName.slice(1).toLowerCase()
      } is required.`,
    format: (fieldName: string) => ` ${fieldName} should be in correct format.`,
    passwordLength: (fieldName: string, minLength: number) =>
      `${fieldName} must be at least ${minLength} characters.`,
    contactLength: (fieldName: string, minLength: number) =>
      `${fieldName} should be ${minLength} digit.`,
    passwordComplexity: (fieldName: string) =>
      `${fieldName} must be an uppercase lowercase number and special characters.`,
    passwordsMatch: (fieldName: string) => `${fieldName} must match.`,
    phoneNumber: (fieldName: string) =>
      `Invalid ${fieldName.toLowerCase()} format.`,
    notSameAsField: (fieldName: string, comparedField: string) =>
      `${fieldName} must be different from ${comparedField}.`,
    maxLength: (fieldName: string, maxLength: number | string) =>
      `${fieldName} must be at ${maxLength} characters.`,
    minLength: (fieldName: string, minLength: number | string) =>
      `${fieldName} must be at ${minLength} numbers.`,
    positiveNumber: (fieldName: string) => `${fieldName} must be positive`,
    greaterThan: (fieldName: string, parent: string) =>
      `${fieldName} must be greater than ${parent}`,
  },
  projectTitle: "Talent Box",
  passwordRegex:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]+$/,
  emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]{2,3}(?![^.\s])/,
  numberRegex: /^\d{10}$/,
  zipcodeRegex: /^\d{6}$/,
  positiveNumberRegex:
    /^[+]?([1-9][0-9]*(?:[.][0-9]*)?|0*\.0*[1-9][0-9]*)(?:[eE][+-][0-9]+)?$/,

  SUCCESS: true,
  ERROR: "Error",

  //Status Code
  NOT_FOUND: 404,
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,

  ServiceEnums: {
    MasterService: "Master Item",
    UpdateService: "Update Master Item",
  },

  StockTypeEnums: {
    StockType: "Material Procurement",
    UpdateStock: "Update Material Procurement",
  },

  ButtonEnums: {
    Create: "Create Item",
    Submit: "Submit",
    Edit: "Edit",
    Updates: "Update",
    Cancel: "Cancel",
    ChangePassword: "Change Password",
  },

  ROLES: {
    ADMIN: {
      id: "ADMIN",
      name: "admin",
      title: "Admin",
    },
    HR: {
      id: "HR",
      name: "hr",
      title: "HR",
    },
    USER: {
      id: "USER",
      name: "user",
      title: "User",
    },
  },

  Modules: {
    Login: "Login",
    Register: "Register",
    Applicant: "Applicant",
    ImportApplicant: "Import Applicants",
    Forgot: "Forgot",
    SKill: "Skill",
    Profile: "Profile",
    Dashboard: "Dashboard",
    Email: "Email",
    Reports: "Reports",
    EmailVerification: "Email Verification",
    UpdatePassword: "Update Password",
    Degree: "Qualification",
    ChangePassword: "ChangePassword",
    FindAndReplace: "Find And Replace",
    RoleAndSkill: "Role And Skill",
    CreateApplicantForm: "Applicant Form",
    PreviewApplicantsDetails: "Preview Applicants Details",
    ComposeEmails: "Compose Email",
    EmailTemplate: "Email Template",
    Designation: "Designation",
    Country: "Country",
    State: "State",
    City: "City",
    Jobs: "Jobs",
    Vendor: "Vendor",
  },
  passingYearType: [
    { label: "2005", value: 2005 },
    { label: "2006", value: 2006 },
    { label: "2007", value: 2007 },
    { label: "2008", value: 2008 },
    { label: "2009", value: 2009 },
    { label: "2010", value: 2010 },
    { label: "2011", value: 2011 },
    { label: "2012", value: 2012 },
    { label: "2013", value: 2013 },
    { label: "2014", value: 2014 },
    { label: "2015", value: 2015 },
    { label: "2016", value: 2016 },
    { label: "2017", value: 2017 },
    { label: "2018", value: 2018 },
    { label: "2019", value: 2019 },
    { label: "2020", value: 2020 },
    { label: "2021", value: 2021 },
    { label: "2022", value: 2022 },
    { label: "2023", value: 2023 },
    { label: "2024", value: 2024 },
    { label: "2025", value: 2025 },
    { label: "2026", value: 2026 },
    { label: "2027", value: 2027 },
    { label: "2028", value: 2028 },
    { label: "2029", value: 2029 },
  ],
  CandidateTemplateOptions: [
    {
      label: "Application Received",
      value: "APPLICATION_RECEIVED",
    },
    {
      label: "Shortlisted for Interview",
      value: "SHORTLISTED_FOR_INTERVIEW",
    },
    {
      label: "Interview Invitation",
      value: "INTERVIEW_INVITATION",
    },
    {
      label: "Interview Reschedule",
      value: "INTERVIEW_RESCHEDULE",
    },
    {
      label: "Job Offer",
      value: "JOB_OFFER",
    },
    {
      label: "Offer Acceptance Confirmation",
      value: "OFFER_ACCEPTANCE_CONFIRMATION",
    },
    {
      label: "Rejection After Interview",
      value: "REJECTION_AFTER_INTERVIEW",
    },
    {
      label: "General Rejection",
      value: "GENERAL_REJECTION",
    },
    {
      label: "Onboarding Reminder",
      value: "ONBOARDING_REMINDER",
    },
    {
      label: "Thank You for Interview",
      value: "THANK_YOU_FOR_INTERVIEW",
    },
  ],

  exportableFieldOption: [
    // {
    //   label: "All",
    //   value:
    //     `["name.middleName ,name.middleName,phone.whatsappNumber,dateOfBirth,gender,qualification,totalExperience,relevantSkillExperience,communicationSkill,otherSkills,rating,currentPkg,expectedPkg,noticePeriod,negotiation,workPreference,comment,feedback,currentCompanyDesignation,appliedRole,appliedSkills,resumeUrl,linkedinUrl,portfolioUrl,practicalUrl,practicalFeedback,referral,preferredLocations,currentCompanyName,maritalStatus,lastFollowUpDate,permanentAddress,currentAddress,currentCity,state,country,currentPincode,collegeName,cgpa,passingYear,specialization,clientCvUrl,clientFeedback,anyHandOnOffers"]`
    // },
    { label: "Middle Name", value: "name.middleName" },
    { label: "Whatsapp Phone", value: "phone.whatsappNumber" },
    { label: "Date Of Birth", value: "dateOfBirth" },
    { label: "Qualification", value: "qualification" },
    { label: "Experience", value: "totalExperience" },
    { label: "Relevant Skill Experience", value: "relevantSkillExperience" },
    { label: "Communication Skill", value: "communicationSkill" },
    { label: "Other Skills", value: "otherSkills" },
    { label: "Rating", value: "rating" },
    { label: "Current Package", value: "currentPkg" },
    { label: "Expected Package", value: "expectedPkg" },
    { label: "Notice Period", value: "noticePeriod" },
    { label: "Negotiation", value: "negotiation" },
    { label: "Work Preference", value: "workPreference" },
    { label: "Comment", value: "comment" },
    { label: "Feedback", value: "feedback" },
    { label: "Status", value: "status" },
    { label: "Interview Stage", value: "interviewStage" },
    { label: "Designation", value: "currentCompanyDesignation" },
    { label: "Applied Role", value: "appliedRole" },
    { label: "Applied Skills", value: "appliedSkills" },
    { label: "Resume URL", value: "resumeUrl" },
    { label: "LinkedIn", value: "linkedinUrl" },
    { label: "Portfolio URL", value: "portfolioUrl" },
    { label: "Practical URL", value: "practicalUrl" },
    { label: "Practical Feedback", value: "practicalFeedback" },
    { label: "Referral", value: "referral" },
    { label: "Preferred Locations", value: "preferredLocations" },
    { label: "Current Company Name", value: "currentCompanyName" },
    { label: "Marital Status", value: "maritalStatus" },
    { label: "Last Follow Up Date", value: "lastFollowUpDate" },
    { label: "Permanent Address", value: "permanentAddress" },
    { label: "Current Address", value: "currentAddress" },
    { label: "Current City", value: "currentCity" },
    { label: "State", value: "state" },
    { label: "Country", value: "country" },
    { label: "Current Pincode", value: "currentPincode" },
    { label: "College Name", value: "collegeName" },
    { label: "CGPA", value: "cgpa" },
    { label: "Passing Year", value: "passingYear" },
    { label: "Specialization", value: "specialization" },
    { label: "Client CV URL", value: "clientCvUrl" },
    { label: "Client Feedback", value: "clientFeedback" },
    { label: "Any Hands-on Offers", value: "anyHandOnOffers" },
    { label: "Created By", value: "createdBy" },
    { label: "Updated By", value: "updatedBy" },
    { label: "Added By", value: "addedBy" },
  ],

  designationType: [
    {
      value: "Application Development Modernization",
      label: "Application Development Modernization",
    },
    { value: "Application developer", label: "Application developer" },
    { value: "Associate Process Manager", label: "Associate Process Manager" },
    {
      value: "Associate Software Engineer",
      label: "Associate Software Engineer",
    },
    { value: "Backend Developer", label: "Backend Developer" },
    { value: "Blockchain Developer", label: "Blockchain Developer" },
    { value: "Business Analyst", label: "Business Analyst" },
    {
      value: "Customer Support Specialist",
      label: "Customer Support Specialist",
    },
    { value: "Data Analyst", label: "Data Analyst" },
    { value: "Data Scientist", label: "Data Scientist" },
    { value: "DevOps Engineer", label: "DevOps Engineer" },
    { value: "DotNet Developer", label: "DotNet Developer" },
    // {
    //   value: "DotNet Full Stack Developer",
    //   label: "DotNET Full Stack Developer",
    // },
    { value: "Fresher", label: "Fresher" },
    { value: "Freelancer", label: "Freelancer" },
    { value: "Frontend Developer", label: "Frontend Developer" },
    { value: "Full Stack Developer", label: "Full Stack Developer" },
    { value: "Java Developer", label: "Java Developer" },
    { value: "Junior DotNet developer", label: "Junior DotNet developer" },
    {
      value: "Junior MERN Stack Developer",
      label: "Junior MERN Stack Developer",
    },
    { value: "Junior Software Engineer", label: "Junior Software Engineer" },
    { value: "MEAN Stack Developer", label: "MEAN Stack Developer" },
    { value: "MERN Stack Developer", label: "MERN Stack Developer" },
    { value: "Nodejs Developer", label: "Nodejs Developer" },

    { value: "PHP Developer", label: "Php Developer" },
    // { value: "PLACEMENT_EXECUTIVEPLACEMENT_EXECUTIVE", label: "Placement executive" },
    { value: "Product Manager", label: "Product Manager" },
    { value: "Programmer Analyst", label: "Programmer Analyst" },
    { value: "Project Engineer", label: "Project Engineer" },
    { value: "Python Developer", label: "Python Developer" },
    { value: "QA Engineer", label: "QA Engineer" },
    { value: "Quality Analyst", label: "Quality Analyst" },
    { value: "React Native Developer", label: "React Native Developer" },
    { value: "Reactjs Developer", label: "Reactjs Developer" },
    { value: "Senior Angular Developer", label: "Senior Angular Developer" },
    { value: "Senior DotNet developer", label: "Senior DotNet developer" },
    { value: "Senior Frontend Developer", label: "Senior Frontend Developer" },
    {
      value: "Senior JavaScript Developer",
      label: "Senior JavaScript Developer",
    },
    { value: "Senior Software Engineer", label: "Senior Software Engineer" },
    { value: "Senior System Engineer", label: "Senior System Engineer" },
    { value: "Senior UI Engineer", label: "Senior UI Engineer" },
    { value: "SharePoint Developer", label: "SharePoint Developer" },
    { value: "Software Engineer", label: "Software Engineer" },
    { value: "Specialist Programmer", label: "Specialist Programmer" },
    { value: "System Engineer", label: "System Engineer" },
    { value: "Team Leader", label: "Team Leader" },
    { value: "Technical Analyst", label: "Technical Analyst" },
    {
      value: "Technical Support Engineer",
      label: "Technical Support Engineer",
    },
    { value: "UI_UX Designer", label: "UI_UX Designer" },
    { value: "Web Designer", label: "Web Designer" },
    { value: "web Developer", label: "web Developer" },
    { value: "Wordpress Developer", label: "Wordpress Developer" },
    { value: "Other", label: "Other" },
  ],

  communicationOptions: [
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
    { value: "5", label: "5" },
    { value: "6", label: "6" },
    { value: "7", label: "7" },
    { value: "8", label: "8" },
    { value: "9", label: "9" },
    { value: "10", label: "10" },
  ],
  workPreferenceType: [
    { value: "remote", label: "Remote" },
    { value: "onsite", label: "Onsite" },
    { value: "hybrid", label: "Hybrid" },
  ],
  statusOptions: [
    { label: "Applied", value: "applied" },
    { label: "In Progress", value: "in progress" },
    { label: "Shortlisted", value: "shortlisted" },
    { label: "Rejected", value: "rejected" },
    { label: "Selected", value: "selected" },
    { label: "On Hold", value: "on hold" },
    { label: "Onboarded", value: "onboarded" },
    { label: "Leaved", value: "leaved" },
  ],

  interviewStageOptions: [
    { label: "First Interview Round", value: "first interview round" },
    { label: "Practical", value: "practical" },
    { label: "HR", value: "hr round" },
    { label: "Technical", value: "technical" },
    { label: "Client", value: "client" },
  ],
  experienceOptions: [
    { value: 0, label: "0 Years" },
    { value: 1, label: "1 Year" },
    { value: 2, label: "2 Years" },
    { value: 3, label: "3 Years" },
    { value: 4, label: "4 Years" },
    { value: 5, label: "5 Years" },
    { value: 6, label: "6 Years" },
    { value: 7, label: "7 Years" },
    { value: 8, label: "8 Years" },
    { value: 9, label: "9 Years" },
    { value: 10, label: "10 Years" },
    { value: 11, label: "11 Years" },
    { value: 12, label: "12 Years" },
  ],
  gendersType: [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    // { label: "Other", value: "other" },
  ],
  maritalStatusType: [
    { label: "Single", value: "Single" },
    { label: "Married", value: "Married" },
  ],
  anyHandOnOffers: [
    { label: "Yes", value: true },
    { label: "No", value: false },
  ],
  SalaryFrequency: [
    { label: "Monthly", value: "monthly" },
    { label: "Hourly", value: "hourly" },
    { label: "Yearly", value: "yearly" },
  ],
  noticePeriodOptions: [
    { value: "0", label: "Immediate" },
    { value: "1-10", label: "1-10 days" },
    { value: "9-20", label: "10 - 20 days" },
    { value: "19-30", label: "20 - 30 days" },
    { value: "29-40", label: "30 - 40 days" },
    { value: "39-100", label: "40+ days" },
  ],

  expectedPkgOptions: [
    { value: 0, label: "0" },
    { value: 0 - 1, label: "1 LPA" },
    { value: 1 - 2, label: "1-2 LPA" },
    { value: 2 - 3, label: "2 - 3 LPA" },
    { value: 3 - 4, label: "3 - 4 LPA" },
    { value: 4 - 5, label: "4 - 5 LPA" },
    { value: 5 - 7, label: "5 - 7  LPA" },
    { value: 7 - 10, label: "7 - 10 LPA" },
    { value: 10 - 15, label: "10 - 15 LPA" },
    { value: 15 - 20, label: "15 - 20 LPA" },
    { value: 20 - 30, label: "20 - 30 LPA" },
  ],
  findAndReplaceOptions: [
    { label: "Applied Skills", value: "appliedSkills" },
    { label: "Role", value: "appliedRole" },
    { label: "Qualification", value: "qualification" },
  ],
  addedByOptions: [
    { label: "Resume", value: "Resume" },
    { label: "Manual", value: "Manual" },
    { label: "CSV", value: "Csv" },
    { label: "Guest", value: "guest" },
  ],

  activeStatusOptions: [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ],

  jobTypeOpyions: [
    { label: "Internship", value: "internship" },
    { label: "Full-time", value: "full-time" },
    { label: "Part-time", value: "part-time" },
    { label: "Contract", value: "contract" },
    { label: "Freelance", value: "freelance" },
  ],

  timeZoneOptions: [
    { label: "IST", value: "IST" },
    { label: "UTC", value: "UTC" },
    { label: "EST", value: "EST" },
  ],
  companyType: [
    { label: "Product-based Company", value: "product" },
    { label: "Service-based Company", value: "service" },
    { label: "Product & Service", value: "both" },
  ],
  hireResourceOptions: [
    { label: "Corp-to-Corp (C2C)", value: "c2c" },
    { label: "Contract-to-Hire (C2H)", value: "c2h" },
    { label: "In-House", value: "in-house" },
    { label: "All", value: "all" },
  ],
  roleType: [
    { label: "HR", value: "hr" },
    { label: "Admin", value: "admin" },
    // { label: "User", value: "user" },
    { label: "Vendor", value: "vendor" },
    { label: "Guest", value: "guest" },
    { label: "Client", value: "client" },
  ],
});
export default appConstants;
