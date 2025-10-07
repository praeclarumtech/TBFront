// Navigation and Permission Constants
// This file contains the centralized navigation structure and permission keys

// Permission keys matching backend structure
export const PermissionKey = {
  // Dashboard
  DASHBOARD: "dashboard",

  // Applicants
  APPLICANTS: "applicants",
  APPLICANTS_IMPORT: "applicants_import",

  // Clients
  CLIENTS: "clients",
  CLIENT_LIST: "client_list",
  CLIENT_JOB_LISTING: "client_job_listing",
  CLIENT_JOB_APPLICANTS: "client_job_applicants",

  // Vendors
  VENDORS: "vendors",
  VENDOR_LIST: "vendor_list",
  VENDOR_JOB_LISTING: "vendor_job_listing",
  VENDOR_JOB_APPLICANTS: "vendor_job_applicants",

  // Analysis
  EMAIL: "email",
  REPORTS: "reports",

  // Masters
  MASTER: "master",
  MASTER_SKILLS: "master_skills",
  MASTER_DEGREE: "master_degree",
  MASTER_ROLE_SKILL: "master_role_skill",
  MASTER_FIND_FIELDS: "master_find_fields",
  MASTER_EMAIL_TEMPLATE: "master_email_template",
  MASTER_DESIGNATION: "master_designation",
  MASTER_COUNTRY: "master_country",
  MASTER_STATE: "master_state",
  MASTER_CITY: "master_city",
};

// Navigation menu structure for permission assignment
export const navItems = [
  {
    accessorKey: "dashboard",
    name: "Dashboard",
    subItems: [{ accessorKey: PermissionKey.DASHBOARD, name: "Dashboard" }],
  },
  {
    accessorKey: "applicants",
    name: "Applicants",
    subItems: [
      { accessorKey: PermissionKey.APPLICANTS, name: "Applicants" },
      {
        accessorKey: PermissionKey.APPLICANTS_IMPORT,
        name: "Import Applicants",
      },
    ],
  },
  {
    accessorKey: "vendors",
    name: "Vendors",
    subItems: [
      { accessorKey: PermissionKey.VENDORS, name: "Vendors" },
      { accessorKey: PermissionKey.VENDOR_LIST, name: "Vendor List" },
      { accessorKey: PermissionKey.VENDOR_JOB_LISTING, name: "Job Listing" },
      {
        accessorKey: PermissionKey.VENDOR_JOB_APPLICANTS,
        name: "Jobs Applicants",
      },
    ],
  },
  {
    accessorKey: "client",
    name: "Client",
    subItems: [
      { accessorKey: PermissionKey.CLIENT_LIST, name: "Clients" },
      {
        accessorKey: PermissionKey.CLIENT_JOB_LISTING,
        name: "Client Job Listing",
      },
      {
        accessorKey: PermissionKey.CLIENT_JOB_APPLICANTS,
        name: "Jobs Applicants",
      },
    ],
  },
  {
    accessorKey: "analysis",
    name: "Analysis",
    subItems: [
      { accessorKey: PermissionKey.EMAIL, name: "Email" },
      { accessorKey: PermissionKey.REPORTS, name: "Reports" },
    ],
  },
  {
    accessorKey: "masters",
    name: "Masters",
    subItems: [
      { accessorKey: PermissionKey.MASTER, name: "Masters" },
      { accessorKey: PermissionKey.MASTER_SKILLS, name: "Add Skills" },
      { accessorKey: PermissionKey.MASTER_DEGREE, name: "Add Qualification" },
      {
        accessorKey: PermissionKey.MASTER_ROLE_SKILL,
        name: "Add Role And Skill",
      },
      {
        accessorKey: PermissionKey.MASTER_FIND_FIELDS,
        name: "Find And Replace Fields",
      },
      {
        accessorKey: PermissionKey.MASTER_EMAIL_TEMPLATE,
        name: "Add Email Template",
      },
      {
        accessorKey: PermissionKey.MASTER_DESIGNATION,
        name: "Add Designation",
      },
      { accessorKey: PermissionKey.MASTER_COUNTRY, name: "Add Country" },
      { accessorKey: PermissionKey.MASTER_STATE, name: "Add State" },
      { accessorKey: PermissionKey.MASTER_CITY, name: "Add City" },
    ],
  },
];

// Master routes mapping for sidebar
export const masterRoutes = [
  {
    key: "/master/skills",
    label: "Add Skills",
    permission: PermissionKey.MASTER_SKILLS,
  },
  {
    key: "/master/degree",
    label: "Add Qualification",
    permission: PermissionKey.MASTER_DEGREE,
  },
  {
    key: "/master/add-role-skill",
    label: "Add Role And Skill",
    permission: PermissionKey.MASTER_ROLE_SKILL,
  },
  {
    key: "/master/Find-Fields",
    label: "Find And Replace Fields",
    permission: PermissionKey.MASTER_FIND_FIELDS,
  },
  {
    key: "/master/email-template",
    label: "Add Email Template",
    permission: PermissionKey.MASTER_EMAIL_TEMPLATE,
  },
  {
    key: "/master/designation",
    label: "Add Designation",
    permission: PermissionKey.MASTER_DESIGNATION,
  },
  {
    key: "/master/country",
    label: "Add Country",
    permission: PermissionKey.MASTER_COUNTRY,
  },
  {
    key: "/master/state",
    label: "Add State",
    permission: PermissionKey.MASTER_STATE,
  },
  {
    key: "/master/city",
    label: "Add City",
    permission: PermissionKey.MASTER_CITY,
  },
];

export const navigationGroups = {
  APPLICANTS: {
    title: "APPLICANTS",
    items: [
      {
        key: "/applicants",
        label: "Applicants",
        permission: PermissionKey.APPLICANTS,
      },
      {
        key: "/import-applicants",
        label: "Import Applicants",
        permission: PermissionKey.APPLICANTS_IMPORT,
      },
    ],
  },
  VENDORS: {
    title: "VENDORS",
    items: [
      {
        key: "/vendorList",
        label: "Vendors",
        permission: PermissionKey.VENDOR_LIST,
      },
      {
        key: "/job-listing",
        label: "Job Listing",
        permission: PermissionKey.VENDOR_JOB_LISTING,
      },
      {
        key: "/appliedJobApplicants",
        label: "Jobs Applicants",
        permission: PermissionKey.VENDOR_JOB_APPLICANTS,
      },
    ],
  },
  CLIENT: {
    title: "CLIENT",
    items: [
      {
        key: "/client",
        label: "Clients",
        permission: PermissionKey.CLIENT_LIST, // Only Admin/HR can see client list
      },
      {
        key: "/job-listingClient",
        label: "Client Job Listing",
        permission: PermissionKey.CLIENT_JOB_LISTING,
      },
      {
        key: "/appliedJobApplicantsClient",
        label: "Jobs Applicants",
        permission: PermissionKey.CLIENT_JOB_APPLICANTS,
      },
    ],
  },
  EMAIL: {
    title: "EMAIL",
    items: [{ key: "/email", label: "Email", permission: PermissionKey.EMAIL }],
  },
  REPORTS: {
    title: "REPORTS",
    items: [
      { key: "/report", label: "Reports", permission: PermissionKey.REPORTS },
    ],
  },
  MASTERS: {
    title: "MASTERS",
    items: masterRoutes,
  },
};
