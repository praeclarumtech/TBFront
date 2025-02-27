

import SignUp from "pages/auth/SignUp";
import Dashboard from "pages/dashboard/Index";
import LayoutVertical from "pages/dashboard/LayoutVertical";
import ApiDemo from "pages/dashboard/pages/ApiDemo";
import email from "pages/dashboard/pages/email/EmailForm";
import Report from "pages/dashboard/pages/report/Report";
import Settings from "pages/dashboard/pages/Settings";
import ApplicantTables from "pages/applicant/Index";
import StepperForm from "pages/applicant/Stepper";


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
  FORGOT_PASSWORD: {
    path: "/forget-password",
    title: "",
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
      {
        title: "Email",
        path: "/email",
        element: email,
      },
      {
        title: "Report",
        path: "/report",
        element: Report,
      },
    ],
  },
};

Object.freeze(routes);

export default routes;
