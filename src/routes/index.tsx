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
import AddDegree from "pages/master/Degree";
import ImportApplicantTables from "pages/applicant/importApplicants/Index";
import Profile from "pages/UserProfile/Profile";
import ChangePassword from "pages/auth/ChangePassword";
import UpdateSkill from "pages/master/RoleAndSkill";
import FindAndReplace from "pages/master/FindAndReplace";
import AddEmailTemplate from "pages/master/EmailTemplate";
import AddDesignation from "pages/master/Designation";
import PrivateRoute from "./PrivateRoute";
import Country from "pages/master/CityStateCountry";
import State from "pages/master/State";
import City from "pages/master/City";
import QrCodeStepperForm from "pages/applicant/qrCode/QrCodeStepper";
 
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
    CHANGE_PASSWORD,
    APPLICANT_ADD_QR_CODE,
    APPLICANT_EDIT_QR_CODE,
  } = routes;
 
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path={ROOT.path} errorElement={<RootBoundary />}>
        <Route index element={<SignIn />} />
        <Route path={SIGN_UP.path} element={<SignUp />} />
        <Route path={FORGET_PASSWORD.path} element={<ForgetPassword />} />
        <Route path={VERIFY_EMAIL.path} element={<EmailVerification />} />
        <Route path={UPDATE_PASSWORD.path} element={<UpdatePassword />} />
 
        <Route path={APPLICANT_ADD_QR_CODE.path} element={<QrCodeStepperForm />} />
        <Route path={APPLICANT_EDIT_QR_CODE.path} element={<QrCodeStepperForm />} />
 
        <Route element={<PrivateRoute component={() => <RootLayout />} />}>
          <Route
            path={DASHBOARD.path}
            element={
              // <RootLayout>{<Dashboard />}</RootLayout>
              <PrivateRoute
                component={() => (
                  // <RootLayout>
                  <Dashboard />
                  // </RootLayout>
                )}
              />
            }
          />
          <Route
            path={APPLICANTS.path}
            element={
              // <RootLayout>
              <Applicant />
              // </RootLayout>
            }
          />
          <Route
            path={"import-applicants"}
            element={
              // <RootLayout>
              <ImportApplicantTables />
              // </RootLayout>
            }
          />
          <Route
            path={"userProfile"}
            element={
              // <RootLayout>
              <Profile />
              // </RootLayout>
            }
          />
          <Route
            path={CHANGE_PASSWORD.path}
            element={
              // <RootLayout>
              <ChangePassword showModal={true} setShowModal={() => {}} />
              // </RootLayout>
            }
          />
          <Route path={APPLICANTS.path}>
            <Route
              path={"add-applicant"}
              element={
                // <RootLayout>
                <StepperForm />
                // </RootLayout>
              }
            />
            <Route
              path={"edit-applicant/:id"}
              element={
                // <RootLayout>
                <StepperForm />
                // </RootLayout>
              }
            />
          </Route>
          <Route path={EMAIL.path}>
            <Route
              index
              element={
                // <RootLayout>
                <EmailTable />
                // </RootLayout>
              }
            />
            <Route
              path="compose"
              element={
                // <RootLayout>
                <EmailForm />
                // </RootLayout>
              }
            />
          </Route>
          <Route path={REPORT.path}>
            <Route
              index
              element={
                // <RootLayout>
                <Report />
                // </RootLayout>
              }
            />
          </Route>
          <Route path={MASTER.path}>
            <Route
              path="passing-year"
              element={
                // <RootLayout>
                <PassingYear />
                // </RootLayout>
              }
            />
            <Route
              path="skills"
              element={
                // <RootLayout>
                <AddSkill />
                // </RootLayout>
              }
            />
            <Route
              path="degree"
              element={
                // <RootLayout>
                <AddDegree />
                // </RootLayout>
              }
            />
            <Route
              path="add-role-skill"
              element={
                // <RootLayout>
                <UpdateSkill />
                // </RootLayout>
              }
            />
            <Route
              path="Find-Fields"
              element={
                // <RootLayout>
                <FindAndReplace />
                // </RootLayout>
              }
            />
 
            <Route
              path="email-template"
              element={
                // <RootLayout>
                <AddEmailTemplate />
                // </RootLayout>
              }
            />
            <Route
              path="designation"
              element={
                // <RootLayout>
                <AddDesignation />
                // </RootLayout>
              }
            />
 
            <Route
              path="country"
              element={
                // <RootLayout>
                <Country />
                // </RootLayout>
              }
            />
            <Route
              path="state"
              element={
                // <RootLayout>
                <State />
                // </RootLayout>
              }
            />
              <Route
              path="city"
              element={
                // <RootLayout>
                <City />
                // </RootLayout>
              }
            />
          </Route>
        </Route>
      </Route>
    )
  );
 
  return <RouterProvider router={router} />;
};
 
export default RenderRouter;
 