//import node module libraries
import { createBrowserRouter, RouterProvider } from "react-router-dom";

//import routes files

import RootLayout from "layouts/RootLayout";
import Dashboard from "pages/dashboard/Index";
import NotFound from "pages/dashboard/pages/NotFound";
import SignIn from "pages/auth/SignIn";
import SignUp from "pages/auth/SignUp";
import ChangePassword from "pages/auth/ChangePassword";
import ForgetPassword from "pages/auth/ForgetPassword";
import { Settings } from "react-feather";
import ApiDemo from "pages/dashboard/pages/ApiDemo";
import LayoutVertical from "pages/dashboard/LayoutVertical";
import Applicant from "components/StepperForm";
import AuthenticationLayout from "layouts/AuthenticationLayout";
import ApplicantTables from "pages/Tables/ApplicantsTables";
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
            // {
            //   path: "profile",
            //   Component: Profile,
            // },
            {
              path: "settings",
              Component: Settings,
            },
            // {
            //   path: "billing",
            //   Component: Billing,
            // },
            // {
            //   path: "pricing",
            //   Component: Pricing,
            // },
            {
              path: "api-demo",
              Component: ApiDemo,
            },
            // {
            //   id: "email",
            //   path: "/email",
            //   Component: EmailForm,
            // },
          ],
        },
        // {
        //   id: "documentation",
        //   path: "/documentation",
        //   Component: Documentation,
        // },
        // {
        //   id: "changelog",
        //   path: "/changelog",
        //   Component: ChangeLog,
        // },
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
          Component: ApplicantTables,
        },
      ],
    },
    {
      id: "auth",
      path: "/",
      children: [
        {
          id: "login",
          path: "login",
          Component: SignIn,
        },
        {
          id: "sign-up",
          path: "sign-up",
          Component: SignUp,
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
  return <RouterProvider router={router} />;
};

export default App;
