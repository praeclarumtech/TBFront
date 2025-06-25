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
import QrFrom from "pages/applicant/QrCode/QrFrom";
import SuccessPage from "pages/applicant/QrCode/Success";
import JobForm from "pages/master/JobForm";
import JobListing from "pages/applicant/Job/JobListing";
import OpenJob from "pages/master/OpenJob";
import ApplyNow from "pages/applicant/Job/ApplyNow";
import UserManagement from "pages/UserProfile/UserManagement";

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
    APPLICANT_SUCCESS,
    JOB_ADD_QR_CODE,
    JOB_EDIT_QR_CODE,
    JOB_OPEN,
  } = routes;

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path={ROOT.path} errorElement={<RootBoundary />}>
        <Route index element={<SignIn />} />
        <Route path={SIGN_UP.path} element={<SignUp />} />
        <Route path={FORGET_PASSWORD.path} element={<ForgetPassword />} />
        <Route path={VERIFY_EMAIL.path} element={<EmailVerification />} />
        <Route path={UPDATE_PASSWORD.path} element={<UpdatePassword />} />
        <Route path={JOB_OPEN.path} element={<OpenJob />} />
        <Route path={JOB_ADD_QR_CODE.path} element={<ApplyNow />} />
        <Route path={JOB_EDIT_QR_CODE.path} element={<ApplyNow />} />
        <Route path={APPLICANT_ADD_QR_CODE.path} element={<QrFrom />} />
        <Route path={APPLICANT_EDIT_QR_CODE.path} element={<QrFrom />} />
        <Route path={APPLICANT_SUCCESS.path} element={<SuccessPage />} />

        <Route element={<PrivateRoute component={() => <RootLayout />} />}>
          <Route
            path={DASHBOARD.path}
            element={<PrivateRoute component={() => <Dashboard />} />}
          />
          <Route path={APPLICANTS.path} element={<Applicant />} />
          <Route
            path={"import-applicants"}
            element={<ImportApplicantTables />}
          />
          <Route path={"job-listing"} element={<JobListing />} />
          <Route path={"userProfile"} element={<Profile />} />
          <Route path={"userManagement"} element={<UserManagement />} />
          <Route
            path={CHANGE_PASSWORD.path}
            element={
              <ChangePassword showModal={true} setShowModal={() => {}} />
            }
          />
          <Route path={APPLICANTS.path}>
            <Route path={"add-applicant"} element={<StepperForm />} />
            <Route path={"edit-applicant/:id"} element={<StepperForm />} />
          </Route>
          <Route path={EMAIL.path}>
            <Route index element={<EmailTable />} />
            <Route path="compose" element={<EmailForm />} />
          </Route>
          <Route path={REPORT.path}>
            <Route index element={<Report />} />
          </Route>
          <Route path={MASTER.path}>
            <Route path="passing-year" element={<PassingYear />} />
            <Route path="skills" element={<AddSkill />} />
            <Route path="degree" element={<AddDegree />} />
            <Route path="add-role-skill" element={<UpdateSkill />} />
            <Route path="Find-Fields" element={<FindAndReplace />} />

            <Route path="email-template" element={<AddEmailTemplate />} />
            <Route path="designation" element={<AddDesignation />} />

            <Route path="country" element={<Country />} />
            <Route path="state" element={<State />} />
            <Route path="city" element={<City />} />
            <Route path="job" element={<JobForm />} />
            <Route path="job3" element={<OpenJob />} />
            <Route path={"edit-job/:id"} element={<JobForm />} />
          </Route>
        </Route>
      </Route>
    )
  );

  return <RouterProvider router={router} />;
};

export default RenderRouter;
