// src/routes/DashboardMenu.ts

import { DashboardMenuItem } from "types";
import { v4 as uuid } from "uuid";

export const DashboardMenu: DashboardMenuItem[] = [
  {
    id: uuid(),
    title: "Dashboard",
    icon: "home",
    link: "/dashboard",
  },
  {
    id: uuid(),
    title: "Applicants",
    grouptitle: true,
  },
  {
    id: uuid(),
    title: "Applicants",
    icon: "users",
    link: "/applicants",
  },
  {
    id: uuid(),
    title: "Import Applicants",
    icon: "download",
    link: "/import-applicants",
  },
  {
    id: uuid(),
    title: "Vendors",
    grouptitle: true,
  },
  {
    id: uuid(),
    title: "Vendor",
    icon: "inbox",
    children: [
      {
        id: uuid(),
        title: "Vendors",
        link: "/vendorList",
      },
      {
        id: uuid(),
        title: "Job Listing",
        link: "/job-listing",
      },
      {
        id: uuid(),
        title: "Jobs Applicants",
        link: "/appliedJobApplicants",
      },
    ],
  },
  {
    id: uuid(),
    title: "Analysis",
    grouptitle: true,
  },
  {
    id: uuid(),
    title: "Email",
    icon: "mail",
    link: "/email",
  },
  {
    id: uuid(),
    title: "Reports",
    icon: "pie",
    link: "/report",
  },
  {
    id: uuid(),
    title: "Masters",
    grouptitle: true,
  },
  {
    id: uuid(),
    title: "Add Skills",
    icon: "plus",
    link: "/master/skills",
  },
  {
    id: uuid(),
    title: "Add Qualification",
    icon: "plus",
    link: "/master/degree",
  },
  {
    id: uuid(),
    title: "Add Role And Skill",
    icon: "plus",
    link: "/master/add-role-skill",
  },
  {
    id: uuid(),
    title: "Find And Replace Fields",
    icon: "plus",
    link: "/master/Find-Fields",
  },
  {
    id: uuid(),
    title: "Add Email Template",
    icon: "plus",
    link: "/master/email-template",
  },
  {
    id: uuid(),
    title: "Add Designation",
    icon: "plus",
    link: "/master/designation",
  },
  {
    id: uuid(),
    title: "Add Country",
    icon: "plus",
    link: "/master/country",
  },
  {
    id: uuid(),
    title: "Add State",
    icon: "plus",
    link: "/master/state",
  },
  {
    id: uuid(),
    title: "Add City",
    icon: "plus",
    link: "/master/city",
  },
];
