//User module
export const LOGIN = "user/login";
export const REGISTER = "user/register";
export const UPDATEPROFILE = "user/updateProfile";
export const VIEWPROFILE = "user/viewProfile";
export const CHANGEPASSWORD = "user/changePassword";
export const VERIFY_OTP = "user/sendEmail/verifyOtp";
export const SEND_OTP = "user/sendEmail";
export const FORGOT_PASSWORD = "user/forgotPassword";
export const GET_PROFILE = "user/getProfileByToken";

//Applicant module
export const LIST_APPLICANT = "applicants/viewAllApplicant";
export const CREATE_APPLICANT = "applicants/addApplicant";
export const UPDATE_APPLICANT = "applicants/updateApplicant";
export const VIEW_APPLICANT = "applicants/viewApplicant";
export const DELETE_APPLICANT = "applicants/deleteApplicant";
export const UPDATE_APPLICANT_STATUS = "applicants/update/status";
export const UPDATE_APPLICANT_STAGE = "applicants/update/status";
export const FILTER_APPLICANT = "applicants/viewApplicant/?";
export const CITY = "city";
export const EXPORT_APPLICANT = "applicants/exportCsv/";
export const DELETE_MULTIPLE_APPLICANT = "applicants/deleteManyApplicants"
export const EXISTING_APPLICANT ="applicants/checkApplicant/?";
export const IMPORT_APPLICANT = "applicants/importCsv";
export const IMPORT_RESUME = "applicants/upload-resume";
export const IMPORT_APPLICANT_LIST = "applicants/viewResumeAndCsvApplicant";

//Email module
export const SEND_EMAIL = "email/applicant/sendEmail";
export const VIEW_ALL_EMAIL = "email/applicant/getAllEmails";
export const DELETE_EMAIL = "email/applicant/deleteManyEmails";
export const VIEW_EMAIL = "email/applicant/viewEmailById";
export const DELETE_MULTIPLE_EMAIL = "email/applicant/deleteManyEmails";

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

//Degree module
export const CREATE_DEGREE = "degree/addDegree";
export const VIEW_DEGREE = "degree/viewById";
export const VIEW_ALL_DEGREE = "degree/viewDegrees";
export const UPDATE_DEGREE = "degree/update";
export const DELETE_DEGREE = "degree/delete";


//Dashboard Module
export const TOTAL_APPLICANTS = "/dashboard/applicant/count"
export const RECENT_APPLICANTS = "/applicants/viewAllApplicant?appliedSkills="
export const APPLICANTS_DETAILS = "/reports/applicants/technologyStatistics"

//Report Module
export const SKILL_STATISTICS = "/reports/applicants/technologyStatistics"
export const APPLICATION_ON_PROCESS = "/reports/applicants/applicationOnProcessCount"
export const STATUS_OF_APPLICATION = "/reports/applicants/statusByPercentage"
export const APPLICATION = "/reports/applicants/getApplicationsByDate?calendarType="