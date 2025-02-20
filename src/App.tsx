
import { createBrowserRouter, RouterProvider } from "react-router-dom";


import AuthenticationLayout from "layouts/AuthenticationLayout";
import RootLayout from "layouts/RootLayout";
import SignIn from "./pages/auth/SignIn";
import ForgetPassword from "pages/auth/ForgetPassword";
import SignUp from "./pages/auth/SignUp";
import SignUpAdmin from "./pages/auth/SignUpAdmin";
import ChangePassword from "./pages/auth/ChangePassword";
import Dashboard from "pages/dashboard/Index";

import Settings from "pages/dashboard/pages/Settings";

import NotFound from "pages/dashboard/pages/NotFound";
import LayoutVertical from "pages/dashboard/LayoutVertical";

import ApplicantsTables from "./pages/Tables/ApplicantsTables";
import Applicant from "./components/StepperForm/index"
import { ToastContainer } from 'react-toastify';  // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css';
import Report from './pages/dashboard/pages/report/Report'
import PassingYear from "pages/master/PassingYear";
// import Applicant from "components/StepperForm";
import AddSkill from "pages/master/Skills";
import EmailForm from "pages/Tables/EmailForm";


const App = () => {
  
  const router = createBrowserRouter([
    {
      id: "root",
      path: "/",
      Component: RootLayout,
      errorElement: <NotFound />,
      children: [
        {
          id: "dashboard",
          path: "/",
          Component: Dashboard,
        },
        {
          id: "pages",
          path: "/pages",
          children: [
            {
              path: "settings",
              Component: Settings,
            },
          ],
        },

        {
          id: "layout-vertical",
          path: "/layout-vertical",
          Component: LayoutVertical,
        },
        {
          id: "add_applicants",
          path: "/add_applicants",
          Component: Applicant,
        },
        {
          id: "applicants",
          path: "/applicants",
          Component: ApplicantsTables,
        },
        {
          id: "email",
          path: "/email",
          Component: EmailForm,
        },
        {
          id: "passingyear",
          path: "/passingYear",
          Component: PassingYear,
        },
        {
          id: "skils",
          path: "/skills",
          Component: AddSkill,
        },
        {
          id: "reports",
          path: "/reports",
          Component: Report,
        },
      ],
    },
    {
      id: "auth",
      path: "/auth",
      Component: AuthenticationLayout,
      children: [
        {
          id: "sign-in",
          path: "sign-in",
          Component: SignIn,
        },
        {
          id: "sign-up",
          path: "sign-up",
          Component: SignUp,
        },
        {
          id: "sign-up-admin",
          path: "sign-up-admin",
          Component: SignUpAdmin,
        },
        {
          id: "forget-password",
          path: "forget-password",
          Component: ForgetPassword,
        },
        {
          id: "change-password",
          path: "change-password",
          Component: ChangePassword,
        },
      ],
    },
  ]);
  // return <RouterProvider router={router} />;
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />  
      </>
  );
};

export default App;
