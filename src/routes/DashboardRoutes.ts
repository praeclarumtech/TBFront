import { DashboardMenuProps } from "types";
import { v4 as uuid } from "uuid";

export const DashboardMenu: DashboardMenuProps[] = [
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
    icon: "pie-chart",
    link: "/report",
  },
  {
    id: uuid(),
    title: "Masters",
    grouptitle: true,
  },
  // {
  //   id: uuid(),
  //   title: "Add Passing Year",
  //   icon: "monitor",
  //   link: "/master/passing-year",
  // },
  {
    id: uuid(),
    title: "Add Skills",
    icon: "plus",
    link: "/master/skills",
  },
  {
    id: uuid(),
    title: "Add Degree",
    icon: "plus",
    link: "/master/degree",
  },
];
