import React from "react";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import routes from "./routes";
import RootBoundary from "pages/dashboard/pages/RootBoundary";
import SignIn from "pages/auth/SignIn";
import ForgetPassword from "pages/auth/ForgetPassword";
import ChangePassword from "pages/auth/ChangePassword";
import SignUp from "pages/auth/SignUp";
import Dashboard from "pages/dashboard/Index";
import RootLayout from "layouts/RootLayout";
import ApplicantTables from "pages/Tables/ApplicantsTables";
import Applicant from "components/StepperForm";
import EmailForm from "pages/dashboard/pages/email/EmailForm";
import Report from "pages/dashboard/pages/report/Report";

const RenderRouter: React.FC = () => {
  const {
    ROOT,
    FORGOT_PASSWORD,
    RESET_PASSWORD,
    SIGN_UP,
    DASHBOARD,
    APPLICANTS,
    ADD_APPLICANTS,
  } = routes;

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path={ROOT.path} errorElement={<RootBoundary />}>
        <Route index element={<SignIn />} />
        <Route path={SIGN_UP.path} element={<SignUp />} />
        <Route path={FORGOT_PASSWORD.path} element={<ForgetPassword />} />
        <Route path={RESET_PASSWORD.path} element={<ChangePassword />} />
        <Route
          path={DASHBOARD.path}
          element={
            <RootLayout>
              <Dashboard />
            </RootLayout>
          }
        />
        <Route
          path={APPLICANTS.path}
          element={
            <RootLayout>
              <ApplicantTables />
            </RootLayout>
          }
        />
        <Route
          path={ADD_APPLICANTS.path}
          element={
            <RootLayout>
              <Applicant />
            </RootLayout>
          }
        />
    
        <Route
          path={ADD_APPLICANTS.path}
          element={
            <RootLayout>
              <Applicant />
            </RootLayout>
          }
        />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
};

export default RenderRouter;
