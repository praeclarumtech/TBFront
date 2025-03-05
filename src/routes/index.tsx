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
import SignUp from "pages/auth/SignUp";
import Dashboard from "pages/dashboard/Index";
import RootLayout from "layouts/RootLayout";
// import ApplicantTables from "pages/Tables/ApplicantsTables";
import Report from "pages/report/Report";
import StepperForm from "pages/applicant/Stepper";
import EmailTable from "pages/email/EmailTable";
import EmailForm from "pages/email/EmailForm";
import PassingYear from "pages/master/PassingYear";
import Applicant from "pages/applicant/Index";
import EmailVerification from "pages/auth/EmailVerify";
import UpdatePassword from "pages/auth/UpdatePassword";
import AddSkill from "pages/master/Skills";

const RenderRouter: React.FC = () => {
  const {
    ROOT,
    FORGET_PASSWORD,
    VERIFY_EMAIL,
    UPDATE_PASSWORD,
    SIGN_UP,
    DASHBOARD,
    APPLICANTS,
    EMAIL,
    REPORT,
    MASTER,
  } = routes;

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path={ROOT.path} errorElement={<RootBoundary />}>
        <Route index element={<SignIn />} />
        <Route path={SIGN_UP.path} element={<SignUp />} />
        <Route path={FORGET_PASSWORD.path} element={<ForgetPassword />} />
        <Route path={VERIFY_EMAIL.path} element={<EmailVerification />} />
        <Route path={UPDATE_PASSWORD.path} element={<UpdatePassword />} />
        <Route
          path={DASHBOARD.path}
          element={<RootLayout>{<Dashboard />}</RootLayout>}
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
        <Route path={EMAIL.path}>
          <Route
            index
            element={
              <RootLayout>
                <EmailTable />
              </RootLayout>
            }
          />
          <Route
            path="compose"
            element={
              <RootLayout>
                <EmailForm />
              </RootLayout>
            }
          />
        </Route>
        <Route path={REPORT.path}>
          <Route
            index
            element={
              <RootLayout>
                <Report />
              </RootLayout>
            }
          />
        </Route>
        <Route path={MASTER.path}>
          <Route
            path="passing-year"
            element={
              <RootLayout>
                <PassingYear />
              </RootLayout>
            }
          />
          <Route
            path="skills"
            element={
              <RootLayout>
                <AddSkill />
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
