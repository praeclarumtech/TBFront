import StepperForm from "pages/applicant/Stepper";
import ChangePassword from "pages/auth/ChangePassword";
import EmailVerification from "pages/auth/EmailVerify";
import ForgetPassword from "pages/auth/ForgetPassword";
import SignUp from "pages/auth/SignUp";
import UpdatePassword from "pages/auth/UpdatePassword";
import Dashboard from "pages/dashboard/Index";
import LayoutVertical from "pages/dashboard/LayoutVertical";
import EmailForm from "pages/email/EmailForm";
import EmailTable from "pages/email/EmailTable";
import AddDegree from "pages/master/Degree";
import AddDesignation from "pages/master/Designation";
import AddEmailTemplate from "pages/master/EmailTemplate";
import FindAndReplace from "pages/master/FindAndReplace";
import PassingYear from "pages/master/PassingYear";
import UpdateSkill from "pages/master/RoleAndSkill";
import AddSkill from "pages/master/Skills";
import Profile from "pages/UserProfile/Profile";
import ApplicantTables from "pages/applicant/Index";
import ImportApplicantTables from "pages/applicant/importApplicants/Index";
import Report from "pages/report/Report";
import {
  FileOutlined,
  HomeFilled,
  MailOutlined,
  SettingOutlined,
  UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import JobForm from "pages/master/JobForm";
// import OpenJob from "pages/master/OpenJob";

const routess = {
  ROOT: {
    path: "/",
    title: "",
  },
  APP: {
    path: "/app",
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
  CHANGE_PASSWORD: {
    title: "Change Password",
    path: "/change-password",
    element: ChangePassword,
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
    navmenu: {
      label: "Dashboard",
      icon: <HomeFilled />,
    },
  },
  USERPROFILE: {
    title: "User Profile",
    path: "/userprofile",
    element: Profile,
  },
  APPLICANTS: {
    title: "Applicants",
    path: "/applicants",
    element: ApplicantTables,
    navmenu: {
      label: "Applicants",
      icon: <UserOutlined />,
    },
  },
  APPLICANT_ADD: {
    title: "Add Applicant",
    path: "/applicants/add-applicant",
    element: StepperForm,
  },
  APPLICANT_EDIT: {
    title: "Edit Applicant",
    path: "/applicants/edit-applicant/:id",
    element: StepperForm,
  },
  IMPORT_APPLICANTS: {
    title: "Import Applicants",
    path: "/import-applicants",
    element: ImportApplicantTables,
    navmenu: {
      label: "Import Applicants",
      icon: <UploadOutlined />,
    },
  },
  EMAIL: {
    title: "Email",
    path: "/email",
    element: EmailTable,
    navmenu: {
      label: "Email",
      icon: <MailOutlined />,
    },
  },
  EMAIL_FORM: {
    title: "Compose Email",
    path: "/email/compose",
    element: EmailForm,
  },
  REPORT: {
    title: "Report",
    path: "/report",
    element: Report,
    navmenu: {
      label: "Report",
      icon: <FileOutlined />,
    },
  },
  MASTER: {
    title: "Master",
    path: "/master",
    navmenu: {
      label: "Master",
      icon: <SettingOutlined />,
    },
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
      {
        title: "Degrees",
        path: "/master/degree",
        element: AddDegree,
      },
      {
        title: "Add Role And Skill",
        path: "/master/add-role-skill",
        element: UpdateSkill,
      },
      {
        title: "Find And Replace Fields",
        path: "/master/Find-Fields",
        element: FindAndReplace,
      },
      {
        title: "Email Template",
        path: "/master/email-template",
        element: AddEmailTemplate,
      },
      {
        title: "Designation",
        path: "/master/designation",
        element: AddDesignation,
      },
      {
        title: "Job Create",
        path: "/master/job",
        element: JobForm,
      },
      {
        id: "Job Create 2",
        path: "/master/edit-job/:id",
        Component: JobForm,
      },
      // {
      //   id: "Job 3",
      //   path: "/master/job3/:id",
      //   Component: OpenJob,
      // },
    ],
  },
  LAYOUT_VERTICAL: {
    title: "Layout Vertical",
    path: "/layout_vertical",
    element: LayoutVertical,
  },
};

export default routess;
