//User module
export const LOGIN = "user/login";
export const REGISTER = "user/register";
export const UPDATEPROFILE = "user/updateProfile";
export const VIEWPROFILE = "user/viewProfileById";
export const CHANGEPASSWORD = "user/changePassword";
export const VERIFY_OTP = "user/sendEmail/verifyOtp";
export const SEND_OTP = "user/sendEmail";
export const FORGOT_PASSWORD = "user/forgotPassword";
export const GET_PROFILE = "user/getProfileByToken";
export const GET_ALL_USERS = "user/listOfUsers";
export const UPDATE_USER_STATUS = "user/updateStatus";

//Applicant module
export const LIST_APPLICANT = "applicants/viewAllApplicant";
export const CREATE_APPLICANT = "applicants/addApplicant";
export const UPDATE_APPLICANT = "applicants/updateApplicant";
export const CREATE_APPLICANT_QR = "applicants/applicant-add-qr-code";
export const UPDATE_APPLICANT_QR = "applicants/applicant-edit-qr-code";
export const UPDATE_IMPORTED_APPLICANT = "applicants/updateImportedApplicant";
export const VIEW_APPLICANT = "applicants/viewApplicant";
export const VIEW_IMPORTED_APPLICANT = "applicants/viewImportedApplicantById";
export const DELETE_APPLICANT = "applicants/deleteApplicant";
export const DELETE_IMPORTED_APPLICANT =
  "/applicants/deleteManyImportedApplicants";
export const DELETE_IMPORTED_MULTIPLE_APPLICANT =
  "/applicants/deleteManyImportedApplicants";
export const UPDATE_APPLICANT_STATUS = "applicants/update/status";
export const UPDATE_APPLICANT_STAGE = "applicants/update/status";
export const FILTER_APPLICANT = "applicants/viewApplicant/?";
export const DUPLICATE_RECORDS = "applicants/duplicate-record";
export const DELETE_DUPLICATE_RECORDS = "applicants/delete/duplicate-record";
export const DOWNLOAD_APPLICANT = "applicants/export-duplicates";

export const COUNTRY = "country";
export const STATE = "state";
export const EXPORT_APPLICANT = "applicants/exportCsv/";
export const EXPORT_IMPORT_APPLICANT = "applicants/exportCsv/";
export const DELETE_MULTIPLE_APPLICANT = "applicants/deleteManyApplicants";
export const EXISTING_APPLICANT = "applicants/checkApplicant/?";
export const IMPORT_APPLICANT = "applicants/importCsv";
export const IMPORT_RESUME = "applicants/upload-resume";
export const IMPORT_APPLICANT_LIST = "applicants/viewResumeAndCsvApplicant";
export const UPDATE_APPLICANT_MANY = "applicants/updateManyApplicant";
export const UPDATE_IMPORTED_APPLICANTS_STATUS =
  "applicants/update/importApplicantstatus";

//Email module
export const SEND_EMAIL = "email/applicant/sendEmail";
export const VIEW_ALL_EMAIL = "email/applicant/getAllEmails";
export const DELETE_EMAIL = "email/applicant/deleteManyEmails";
export const VIEW_EMAIL = "email/applicant/viewEmailById";
export const DELETE_MULTIPLE_EMAIL = "email/applicant/deleteManyEmails";
export const EMAIL_COUNT = "email/applicant/count";

//Passing Year module
export const ADD_PASSING_YEAR = "year";
export const VIEW_PASSING_YEAR_BY_ID = "year/getYearById";
export const DELETE_PASSING_YEAR = "year/deleteYear";
export const EDIT_PASSING_YEAR = "year/updateYear";
export const VIEW_ALL_PASSING_YEAR = "year/listOfYears";

//Skill module
export const CREATE_SKILL = "skill/addSkills";
export const VIEW_SKILL = "skill/viewById";
export const VIEW_ALL_SKILL = "skill/viewSkills";
export const UPDATE_SKILL = "skill/update";
export const DELETE_SKILL = "skill/delete";
export const IMPORT_SKILLS = "skill/importCsv";

//Role module
export const ADD_ROLE_AND_SKILL = "/appliedRole/addAppliedRoleAndSkills";
export const VIEW_ROLE_AND_SKILL = "appliedRole/ViewAllSkillAndAppliedRole";
export const UPDATE_ROLE_AND_SKILL = "/appliedRole/updateAppliedRoleAndSkill";
export const DELETE_ROLE_AND_SKILL = "/appliedRole/deleteAppliedRoleAndSkill";
export const VIEW_ROLE_AND_SKILL_ID =
  "/appliedRole/viewskillAndAppliedRoleById";
export const VIEW_SKILLS_BY_APPLIED_ROLE =
  "/appliedRole/viewSkillsByAppliedRole";

//Degree module
export const CREATE_DEGREE = "degree/addDegree";
export const VIEW_DEGREE = "degree/viewById";
export const VIEW_ALL_DEGREE = "degree/viewDegrees";
export const UPDATE_DEGREE = "degree/update";
// export const DELETE_DEGREE = "degree/delete";
export const DELETE_MANY_DEGREE = "degree/delete/deleteManyDegree";

//Dashboard Module
export const TOTAL_APPLICANTS = "/dashboard/applicant/count";
export const RECENT_APPLICANTS = "/applicants/viewAllApplicant?appliedSkills=";
export const SKILL_EXPORT = "applicants/exportCsv";
// export const APPLICANTS_DETAILS = "/reports/applicants/categoryWiseSkillCount?category="
export const APPLICANTS_DETAILS =
  "/reports/applicants/technologyStatistics?category=";
export const REPORT_ON_SKILL = "reports/applicants/applicantSkillStatistics";

//Report Module
// export const SKILL_STATISTICS = "/reports/applicants/categoryWiseSkillCount?category="
export const SKILL_STATISTICS =
  "/reports/applicants/technologyStatistics?category=";
export const CITY_STATE =
  "/reports/applicants/applicantCountByCityAndState?type=";
export const APPLICATION_ON_PROCESS =
  "/reports/applicants/applicationOnProcessCount";
export const STATUS_OF_APPLICATION = "/reports/applicants/statusByPercentage";
export const APPLICATION =
  "/reports/applicants/getApplicationsByDate?calendarType=";
export const ADDEDBY_REPORT = "/reports/applicants/applicantCountByAddedBy";

//Find And Replace

export const FIND_AND_REPLACE_ALL = "appliedRole/skillOrAppliedRoleReplaceAll";
export const FIND = "/appliedRole/findSkillOrAppliedRole";

//Email Template module
export const CREATE_EMAIL_TEMPLATE = "createEmailTemplate";
export const UPDATE_EMAIL_TEMPLATE = "updateEmailTemplate";
export const DELETE_EMAIL_TEMPLATE = "deleteEmailTemplate";
export const VIEW_EMAIL_TEMPLATE = "getAllEmailTemplates";
export const GET_EMAIL_TEMPLATE_BY_ID = "getEmailTemplateById";
export const GET_EMAIL_TEMPLATE_BY_TYPE = "templateByType";

//Designation module
export const CREATE_DESIGNATION = "designation/adddesignations";
export const VIEW_DESIGNATION = "designation/getDesignationsById";
export const VIEW_ALL_DESIGNATION = "designation/viewDesignation";
export const UPDATE_DESIGNATION = "designation/update";
export const DELETE_DESIGNATION = "designation/deleteDesignation";
export const DELETE_MULTIPLE_DESIGNATION = "designation/deleteManyDesignation";

//Country module
export const VIEW_ALL_COUNTRY = "/country";
export const CREATE_COUNTRY = "/addCountry";
export const UPDATE_COUNTRY = "/updateCountry";
export const DELETE_COUNTRY = "/deleteCountry";
export const DELETE_MULTIPLE_COUNTRY = "/deleteManyCountry";

//State module
export const VIEW_ALL_STATE = "/state";
export const CREATE_STATE = "/addState";
export const UPDATE_STATE = "/updateState";
export const DELETE_STATE = "/deleteState";
export const DELETE_MULTIPLE_STATE = "/deleteManyState";

//City module
export const CREATE_CITY = "/addCity";
export const VIEW_CITY = "/city";
export const UPDATE_CITY = "updateCityById";
export const DELETE_CITY = "/deleteCityById";
export const VIEW_BY_ID_CITY = "/viewCityById";

//Active InActive
export const ACTIVE = "/applicants/activateApplicant";
export const IN_ACTIVE = "/applicants/inactivateApplicant";

//Job

export const VIEW_ALL_JOB = "/job/viewJobs";
export const CREATE_JOB = "/job";
export const DELETE_JOB = "/job/delete";
export const VIEW_JOB_ID = "/job";
export const UPDATE_JOB = "/job";
