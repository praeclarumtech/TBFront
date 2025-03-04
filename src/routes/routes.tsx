import SignUp from "pages/auth/SignUp";
import Dashboard from "pages/dashboard/Index";
import LayoutVertical from "pages/dashboard/LayoutVertical";
import ApiDemo from "pages/dashboard/pages/ApiDemo";
import Settings from "pages/dashboard/pages/Settings";
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

const routes = {
  ROOT: {
    path: "/",
    title: "",
  },
  APP: {
    path: "/app",
    title: "",
  },
  RESET_PASSWORD: {
    path: "/reset-password",
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
    ],
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
    ],
  },
  LAYOUT_VERTICAL: {
    title: "Layout Vertical",
    path: "/layout_vertical",
    element: LayoutVertical,
  },
  PAGES: {
    title: "Pages",
    path: "/pages",
    children: [
      {
        path: "settings",
        element: Settings,
      },
      {
        path: "api-demo",
        element: ApiDemo,
      },
    ],
  },
};

Object.freeze(routes);

export default routes;
