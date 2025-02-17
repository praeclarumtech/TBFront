//import node module libraries
import { createBrowserRouter, RouterProvider } from "react-router-dom";

//import routes files
import AuthenticationLayout from "layouts/AuthenticationLayout";
import RootLayout from "layouts/RootLayout";
import SignIn from "./pages/auth/SignIn";
import ForgetPassword from "pages/auth/ForgetPassword";
import SignUp from "./pages/auth/SignUp";
import SignUpAdmin from "./pages/auth/SignUpAdmin";
import ChangePassword from "./pages/auth/ChangePassword";
import Dashboard from "pages/dashboard/Index";
// import Billing from "pages/dashboard/pages/Billing";
// import Pricing from "pages/dashboard/pages/Pricing";
import Settings from "pages/dashboard/pages/Settings";
// import AddForm from "pages/dashboard/pages/AddForm";
// import Profile from "pages/dashboard/pages/Profile";
import NotFound from "pages/dashboard/pages/NotFound";
import LayoutVertical from "pages/dashboard/LayoutVertical";
// import Documentation from "pages/dashboard/Documentation";
// import ChangeLog from "pages/dashboard/Changelog";
import ApiDemo from "./pages/dashboard/pages/ApiDemo";
import ApplicantsTables from "./pages/Tables/ApplicantsTables";
import Applicant from "./components/StepperForm/index"
import { ToastContainer } from 'react-toastify';  // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css';
// import EmailForm from "pages/Tables/EmailForm";


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
            //   path: "email",
            //   Component:EmailForm,
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
          // Component: AddForm,
          Component: Applicant,
        },
        {
          id: "applicants-table",
          path: "/applicants-table",
          Component: ApplicantsTables,
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
