//User module
export const LOGIN = "user/login";
export const REGISTER = "user/register";
export const UPDATEPROFILE = "user/updateProfile";
export const VIEWPROFILE = "user/viewProfile";
export const CHANGEPASSWORD = "user/changePassword";
export const VERIFY_OTP = "user/sendEmail/verifyOtp";
export const SEND_OTP = "user/sendEmail"
export const FORGOT_PASSWORD = "user/forgotPassword";

//Applicant module
export const LIST_APPLICANT = "applicants/viewAllApplicant";
export const CREATE_APPLICANT = "applicants/addApplicant";
export const UPDATE_APPLICANT = "applicants/updateApplicant";
export const VIEW_APPLICANT = "applicants/viewApplicant";
export const DELETE_APPLICANT = "applicants/deleteApplicant";
export const UPDATE_APPLICANT_STATUS = "applicants/update/status";
export const UPDATE_APPLICANT_STAGE = "applicants/update/status";
//Email module
export const SEND_EMAIL = "email/applicant/sendEmail";
export const VIEW_ALL_EMAIL = "email/applicant/getAllEmails";
export const DELETE_EMAIL = "email/applicant/deleteManyEmails";

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
