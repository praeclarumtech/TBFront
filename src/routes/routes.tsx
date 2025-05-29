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
import QrCodeStepperForm from "pages/applicant/QrCode/QrCodeStepper"
 
const routes = {
  ROOT: {
    path: "/",
    title: "",
  },
  APP: {
    path: "/app",
    title: "",
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
    path: "/userprofile",
    element: Profile,
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
    ],
  },
 
  APPLICANT_ADD_QR_CODE: {
    title: "Applicant Add QR Code",
    path: "api/applicants/applicant-add-qr-code",
    element: QrCodeStepperForm,
  },
 
  APPLICANT_EDIT_QR_CODE: {
    title: "Applicant Edit QR Code",
    path: "api/applicants/applicant-edit-qr-code/:id",
    element: QrCodeStepperForm,
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
 