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
import StepperForm from "pages/applicant/Stepper";
import Applicant from "pages/applicant/Index";


const RenderRouter: React.FC = () => {
  const {
    ROOT,
    FORGOT_PASSWORD,
    RESET_PASSWORD,
    SIGN_UP,
    DASHBOARD,
    APPLICANTS,
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
              <Applicant />
            </RootLayout>
          }
        />
        <Route path={APPLICANTS.path}>
          <Route
            path={"add-applicant"}
            element={
              <RootLayout>
                <StepperForm />
              </RootLayout>
            }
          />
          <Route
            path={"edit-applicant/:id"}
            element={
              <RootLayout>
                <StepperForm />
              </RootLayout>
            }
          />
         
      
        </Route>
      </Route>
    )
  );

  return <RouterProvider router={router} />;
};

export default RenderRouter;
