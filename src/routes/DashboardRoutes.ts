

import { DashboardMenuProps } from "types";
import { v4 as uuid } from "uuid";


export const DashboardMenu: DashboardMenuProps[] = [
  {
    id: uuid(),
    title: "Dashboard",
    icon: "home",
    link: "/",
  },
  {
    id: uuid(),
    title: "Applicants",
    grouptitle: true,
  },
  {
    id: uuid(),
    title: "Applicants",
    icon: "layers",

    link: '/applicants'
  },

  {
    id: uuid(),
    title: "Add Applicant",
    icon: "layout",
    link: "/add_applicants",
  },
  {
    id: uuid(),
    title: "Analysis",
    grouptitle: true,
  },
  {
    id: uuid(),
    title: "Email",
    icon: "monitor",
    link: '/email',
  },

  {
    id: uuid(),
    title: "Reports",
    icon: "corner-left-down",

    link: '/reports',
  },
  {
    id: uuid(),
    title: "Masters",
    grouptitle: true,
  },
  {
    id: uuid(),
    title: "Master",
    icon: "clipboard",
    link: "/documentation",
    children: [
      { id: uuid(), link: "/pages/profile", name: "Add Passing Year" },
      { id: uuid(), link: "/pages/settings", name: "Add Skills" },
      { id: uuid(), link: "/pages/billing", name: "Billing" },
      { id: uuid(), link: "/pages/pricing", name: "Pricing" },
      { id: uuid(), link: "/not-found", name: "404 Error" },
    ],
  },

];