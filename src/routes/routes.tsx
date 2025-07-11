import SignUp from "pages/auth/SignUp";
import Dashboard from "pages/dashboard/Index";
import LayoutVertical from "pages/dashboard/LayoutVertical";
import ApplicantTables from "pages/applicant/Index";
import StepperForm from "pages/applicant/Stepper";
import EmailTable from "pages/email/EmailTable";
import EmailForm from "pages/email/EmailForm";
import PassingYear from "pages/master/PassingYear";
import AddSkill from "pages/master/Skills";
import Report from "pages/report/Report";
import ForgetPassword from "pages/auth/ForgetPassword";
import EmailVerification from "pages/auth/EmailVerify";
import UpdatePassword from "pages/auth/UpdatePassword";
import AddDegree from "pages/master/Degree";
import ImportApplicantTables from "pages/applicant/importApplicants/Index";
import Profile from "pages/UserProfile/Profile";
import ChangePassword from "pages/auth/ChangePassword";
import UpdateSkill from "pages/master/RoleAndSkill";
import FindAndReplace from "pages/master/FindAndReplace";
import AddEmailTemplate from "pages/master/EmailTemplate";
import AddDesignation from "pages/master/Designation";

import Country from "pages/master/CityStateCountry";
import State from "pages/master/State";
import City from "pages/master/City";
import QrFrom from "pages/applicant/QrCode/QrFrom";
import SuccessPage from "pages/applicant/QrCode/Success";
import JobForm from "pages/master/JobForm";
import JobListing from "pages/applicant/Job/JobListing";
import OpenJob from "pages/master/OpenJob";
import ApplyNow from "pages/applicant/Job/ApplyNow";
import Vendor from "pages/Vendor/Vendor";
import SearchJob from "pages/Vendor/SearchJob";
import DetailedJob from "pages/Vendor/DetailedJob";
import ApplyNowJob from "pages/Vendor/ApplyNowJob";
import UserManagement from "pages/UserProfile/UserManagement";
import UserProfileEdit from "pages/UserProfile/UserProfileEdit";
import AppliedJobList from "pages/Vendor/AppliedJobList";
import SignIn from "pages/auth/SignIn";
import VendorList from "pages/Vendor/VendorList";

const routes = {
  ROOT: {
    path: "/",
    title: "",
  },
  APP: {
    path: "/app",
    title: "",
  },
  LOGIN: {
    path: "/login",
    title: "Login",
    element: SignIn,
  },
  FORGET_PASSWORD: {
    title: "Forgot Password",
    path: "/forgot-password",
    element: ForgetPassword,
  },
  VERIFY_EMAIL: {
    title: "Email Verification",
    path: "/email-verify",
    element: EmailVerification,
  },
  UPDATE_PASSWORD: {
    title: "Update Password",
    path: "/update-password",
    element: UpdatePassword,
  },
  CHANGE_PASSWORD: {
    title: "Change Password",
    path: "/change-password",
    element: ChangePassword,
  },
  SIGN_UP: {
    title: "Sign Up",
    path: "/sign-up",
    element: SignUp,
  },
  DASHBOARD: {
    title: "Dashboard",
    path: "/dashboard",
    element: Dashboard,
  },
  USERPROFILE: {
    title: "User Profile",
    path: "/userprofile/:_id",
    element: Profile,
  },
  USERPROFILE_EDIT: {
    title: "User Profile Edit",
    path: "/userprofileEdit/:_id",
    element: UserProfileEdit,
  },
  USERPROFILE_ADD: {
    title: "User Profile Add",
    path: "/userprofileAdd",
    element: UserProfileEdit,
  },
  USERMANAGEMENT: {
    title: "User Management",
    path: "/userManagement",
    element: UserManagement,
  },
  APPLICANTS: {
    title: "Applicants",
    path: "/applicants",
    element: ApplicantTables,
    children: [
      {
        id: "applicant2",
        path: "/applicants/add-applicant",
        Component: StepperForm,
      },
      {
        id: "applicant3",
        path: "/applicants/edit-applicant/:id",
        Component: StepperForm,
      },
      {
        id: "applicant4",
        path: "/import-applicants",
        Component: ImportApplicantTables,
      },
      {
        id: "applicant5",
        path: "/job-listing",
        Component: JobListing,
      },
    ],
  },

  APPLICANT_ADD_QR_CODE: {
    title: "Applicant Add QR Code",
    path: "/applicants/applicant-add-qr-code",
    element: QrFrom,
  },

  JOB_ADD_QR_CODE: {
    title: "Job Add apply-now",
    path: "/applicants/applyNow",
    element: ApplyNow,
  },
  JOB_EDIT_QR_CODE: {
    title: "Job Edit apply-now",
    path: "/applicants/applyNow-edit/:id",
    element: ApplyNow,
  },
  APPLICANT_EDIT_QR_CODE: {
    title: "Applicant Edit QR Code",
    path: "/applicants/applicant-edit-qr-code/:id",
    element: QrFrom,
  },

  APPLICANT_SUCCESS: {
    title: "Success",
    path: "/applicants/qr-code-success",
    element: SuccessPage,
  },
  EMAIL_SEND: {
    title: "Success",
    path: "/email/email-sent",
    element: SuccessPage,
  },
  JOB_OPEN: {
    title: "Job Submit",
    path: "master/job3/:id",
    element: OpenJob,
  },
  VENDOR: {
    title: "Vendor",
    path: "/",
    element: Vendor,
  },
  VENDOR_LIST: {
    title: "vendor-List",
    path: "/vendorList",
    element: VendorList,
  },
  // VENDOR: {
  //   title: "Vendor",
  //   path: "/Vendor",
  //   element: Vendor,
  // },
  JOB_SEARCH: {
    title: "Job-search",
    path: "/Vendor/job-search",
    element: SearchJob,
  },
  DETAILED_JOB: {
    title: "Detailed-job",
    path: "/Vendor/detailed-job/:id",
    element: DetailedJob,
  },
  APPLY_NOW_JOB: {
    title: "apply job vendor",
    path: "/Vendor/applyNow",
    element: ApplyNowJob,
  },
  APPLY_JOB_LIST: {
    title: "apply job list",
    path: "/Vendor/appliedJobList",
    element: AppliedJobList,
  },
  EMAIL: {
    title: "Email",
    path: "/email",
    children: [
      {
        title: "Email List",
        path: "/email",
        element: EmailTable,
      },
      {
        title: "Compose Email",
        path: "/email/compose",
        element: EmailForm,
      },
    ],
  },
  REPORT: {
    title: "Report",
    path: "/report",
    children: [
      {
        title: "report",
        path: "/report",
        element: Report,
      },
    ],
  },
  MASTER: {
    title: "Master",
    path: "/master",
    children: [
      {
        title: "Passing Year",
        path: "/master/passing-year",
        element: PassingYear,
      },
      {
        title: "Skills",
        path: "/master/skills",
        element: AddSkill,
      },
      {
        title: "Degrees",
        path: "/master/degree",
        element: AddDegree,
      },
      {
        title: "Add Role And Skill",
        path: "/master/add-role-skill",
        element: UpdateSkill,
      },
      {
        title: "Find And Replace Fields",
        path: "/master/Find-Fields",
        element: FindAndReplace,
      },
      {
        title: "Email Template",
        path: "/master/email-template",
        element: AddEmailTemplate,
      },
      {
        title: "Designation",
        path: "/master/designation",
        element: AddDesignation,
      },
      {
        title: "Country",
        path: "/master/country",
        element: Country,
      },
      {
        title: "State",
        path: "/master/state",
        element: State,
      },
      {
        title: "City",
        path: "/master/city",
        element: City,
      },
      {
        title: "Job Create",
        path: "/master/job",
        element: JobForm,
      },
      {
        id: "Job Create 2",
        path: "/master/edit-job/:id",
        Component: JobForm,
      },
      {
        id: "Job 3",
        path: "/master/job3/:id",
        Component: OpenJob,
      },
    ],
  },
  LAYOUT_VERTICAL: {
    title: "Layout Vertical",
    path: "/layout_vertical",
    element: LayoutVertical,
  },
};

Object.freeze(routes);

export default routes;
