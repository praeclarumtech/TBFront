/* eslint-disable @typescript-eslint/no-explicit-any */
export interface NotificationProps {
  id: string;
  sender: string;
  message: string;
}

export interface ChildrenItemProps {
  id: string;
  title?: string;
  name?: string;
  link?: string | null;
  children?: ChildrenItemProps[];
  icon?: string;
  badge?: string;
  badgecolor?: string;
}

export interface DashboardMenuProps {
  id: string;
  title: string;
  link?: string;
  grouptitle?: boolean;
  children?: ChildrenItemProps[];
  icon?: string;
  badge?: string;
  badgecolor?: string;
  name?: string;
}

export interface CustomToggleProps {
  children: React.ReactNode;
  onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export interface TeamsDataProps {
  id: number;
  name: string;
  email: string;
  role: string;
  lastActivity: string;
  image: string;
}

export interface ActiveProjectsDataProps {
  id: number;
  projectName: string;
  priority: string;
  priorityBadgeBg: string;
  hours: number;
  progress: number;
  brandLogo: string;
  brandLogoBg: string;
  members: {
    image: string;
  }[];
}

export interface ProjectsStatsProps {
  id: number;
  title: string;
  value: number | string;
  icon: React.ReactNode;
  statInfo: string;
}

export interface ProjectContriProps {
  id: number;
  projectName: string;
  description: string;
  brandLogo: string;
  brandLogoBg: string;
  members: {
    image: string;
  }[];
}

export interface StandardProps {
  plantitle: string;
  description: string;
  monthly: number;
  buttonText: string;
  buttonClass: string;
  featureHeading: string;
  features: {
    feature: string;
  }[];
}

export interface FAQsProps {
  id: number;
  question: string;
  answer: string;
}

export interface FeaturesDataProps {
  id: number;
  icon: string;
  title: string;
  description: string;
}

export interface Applicant {
  data: any;
  currentPkg: string;
  expectedPkg: string;
  otherSkills: string;
  referral: string;
  _id: string;
  application_No: number;
  name: {
    firstName: string;
    middleName: string;
    lastName: string;
  };
  phone: {
    whatsappNumber: string;
    phoneNumber: string;
  };
  email: string;
  gender: string;
  dateOfBirth: Date;
  qualification: string;
  degree: string;
  passing_Year: number;
  current_Location: string;
  state: string;
  country: string;
  pincode: number;
  fullAddress: string;
  city: string;
  appliedSkills: [string];
  resume: string;
  totalExperience: number;
  relevantSkillExperience: number;
  rating: number;
  resumeUrl: string;
  current_Pkg: string;
  expectedpkg: string;
  noticePeriod: string;
  negotiation: string;
  ready_Wfo: string;
  work_Preference: string;
  about_Us: string;
  feedback: string;
  status: string;
  interview_Stage: string;
  referal: string;
  created_At: Date;
  modified_At: Date;
  applicantsName: string;
  technology: string;
  priority: string;
  priorityBadgeBg: string;
  experience: number;
  dateApplied: string;
  operation: {
    edit: string;
    view: string;
    delete: string;
  };
  readyForWork: string;
  workPreference: string;
  applicationNo: number;
  passingYear: number;
  aboutUs: string;
  interviewStage: string;
}
