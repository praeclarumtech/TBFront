/**
 * Common Message Constants
 * Centralized location for all application messages
 */

// Success Messages
export const SUCCESS_MESSAGES = {
  // Authentication
  LOGIN_SUCCESS: "Login successful!",
  LOGOUT_SUCCESS: "Logged out successfully!",
  REGISTRATION_SUCCESS: "Registration successful!",
  PASSWORD_CHANGE_SUCCESS: "Password changed successfully!",
  PASSWORD_RESET_SUCCESS: "Password reset successful!",
  EMAIL_VERIFICATION_SUCCESS: "Email verified successfully!",

  // Applicant Management
  APPLICANT_CREATED: "Applicant created successfully!",
  APPLICANT_UPDATED: "Applicant updated successfully!",
  APPLICANT_DELETED: "Applicant deleted successfully!",
  APPLICANT_IMPORTED: "Applicants imported successfully!",
  APPLICANT_EXPORTED: "Applicants exported successfully!",
  APPLICANT_STATUS_UPDATED: "Applicant status updated successfully!",

  // Email Management
  EMAIL_SENT: "Email sent successfully!",
  EMAIL_TEMPLATE_CREATED: "Email template created successfully!",
  EMAIL_TEMPLATE_UPDATED: "Email template updated successfully!",
  EMAIL_TEMPLATE_DELETED: "Email template deleted successfully!",

  // Master Data Management
  MASTER_DATA_CREATED: "Record created successfully!",
  MASTER_DATA_UPDATED: "Record updated successfully!",
  MASTER_DATA_DELETED: "Record deleted successfully!",
  SKILL_CREATED: "Skill created successfully!",
  SKILL_UPDATED: "Skill updated successfully!",
  SKILL_DELETED: "Skill deleted successfully!",
  ROLE_CREATED: "Role created successfully!",
  ROLE_UPDATED: "Role updated successfully!",
  ROLE_DELETED: "Role deleted successfully!",
  DESIGNATION_CREATED: "Designation created successfully!",
  DESIGNATION_UPDATED: "Designation updated successfully!",
  DESIGNATION_DELETED: "Designation deleted successfully!",

  // Vendor Management
  VENDOR_CREATED: "Vendor created successfully!",
  VENDOR_UPDATED: "Vendor updated successfully!",
  VENDOR_DELETED: "Vendor deleted successfully!",

  // Job Management
  JOB_CREATED: "Job created successfully!",
  JOB_UPDATED: "Job updated successfully!",
  JOB_DELETED: "Job deleted successfully!",
  JOB_APPLICATION_SUBMITTED: "Job application submitted successfully!",

  // Profile Management
  PROFILE_UPDATED: "Profile updated successfully!",
  AVATAR_UPDATED: "Profile picture updated successfully!",

  // File Operations
  FILE_UPLOADED: "File uploaded successfully!",
  FILE_DELETED: "File deleted successfully!",
  FILE_DOWNLOADED: "File downloaded successfully!",

  // General Operations
  DATA_SAVED: "Data saved successfully!",
  DATA_UPDATED: "Data updated successfully!",
  DATA_DELETED: "Data deleted successfully!",
  OPERATION_SUCCESSFUL: "Operation completed successfully!",
  SETTINGS_UPDATED: "Settings updated successfully!",
  FILTERS_SAVED: "Filters saved successfully!",

  FILE_DOWNLOADED_SUCCESSFULLY: "File downloaded successfully!",
  APPLICANT_INTERVIEW_STAGE_UPDATED:
    "Applicant interview stage updated successfully!",

  APPLICANT_ADDED_TO_FAVORITE_LIST: "Applicant added to favorite list!",
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  USE_USER_MUST_BE_USED_WITHIN_A_USER_PROVIDER:
    "useUser must be used within a UserProvider",
  // Authentication Errors
  INVALID_CREDENTIALS: "Invalid email or password!",
  ACCOUNT_LOCKED: "Your account has been locked. Please contact administrator.",
  SESSION_EXPIRED: "Your session has expired. Please log in again.",
  UNAUTHORIZED_ACCESS: "You are not authorized to access this resource.",
  TOKEN_EXPIRED: "Your token has expired. Please login again.",
  INVALID_TOKEN: "Invalid or expired token.",

  // Validation Errors
  REQUIRED_FIELD: (fieldName: string) => `${fieldName} is required.`,
  INVALID_EMAIL: "Please enter a valid email address.",
  INVALID_PHONE: "Please enter a valid phone number.",
  INVALID_FORMAT: (fieldName: string) =>
    `${fieldName} should be in the correct format.`,
  PASSWORD_TOO_SHORT: (minLength: number) =>
    `Password must be at least ${minLength} characters.`,
  PASSWORD_MISMATCH: "Password and confirm password do not match.",
  INVALID_FILE_TYPE: "Please upload a valid file type.",
  FILE_TOO_LARGE: (maxSize: string) =>
    `File size must be less than ${maxSize}.`,

  // Network Errors
  NETWORK_ERROR: "Network error. Please check your connection.",
  SERVER_ERROR: "Server error. Please try again later.",
  TIMEOUT_ERROR: "Request timeout. Please try again.",
  CONNECTION_LOST: "Connection lost. Please check your internet connection.",

  // Data Errors
  DATA_NOT_FOUND: "No data found.",
  DUPLICATE_DATA: "This record already exists.",
  INVALID_DATA: "Invalid data provided.",
  DATA_CORRUPTED: "Data is corrupted. Please refresh and try again.",

  // File Errors
  FILE_NOT_FOUND: "File not found.",
  FILE_UPLOAD_FAILED: "File upload failed. Please try again.",
  FILE_DELETE_FAILED: "Failed to delete file.",
  FILE_ACCESS_DENIED: "Access denied to this file.",

  // Permission Errors
  PERMISSION_DENIED: "You don't have permission to perform this action.",
  ROLE_RESTRICTED: "This action is restricted for your role.",

  // General Errors
  SOMETHING_WRONG: "Something went wrong. Please try again.",
  UNEXPECTED_ERROR: "An unexpected error occurred.",
  OPERATION_FAILED: "Operation failed. Please try again.",
  INVALID_REQUEST: "Invalid request. Please check your input.",
  MAINTENANCE_MODE: "System is under maintenance. Please try again later.",

  FAILED_TO_FETCH_APPLICANTS: "Failed to fetch applicants. Please try again.",
  FAILED_TO_FETCH_ROLES: "Failed to fetch roles. Please try again.",
  FAILED_TO_FETCH_SKILLS: "Failed to fetch skills. Please try again.",
  FAILED_TO_FETCH_CITIES: "Failed to fetch cities. Please try again.",
  FAILED_TO_FETCH_STATES: "Failed to fetch states. Please try again.",

  NO_RECORD_SELECTED: "No record selected",

  FAILED_TO_TOGGLE_STATUS: "Failed to toggle status. Please try again.",

  NO_DATA_AVAILABLE_TO_EXPORT: "No data available to export.",
  UNEXPECTED_JSON_RESPONSE_DURING_EXPORT:
    "Unexpected JSON response during export.",
  PLEASE_SELECT_APPLICANTS_BEFORE_CHOOSING_COLUMNS:
    "Please select applicants before choosing columns.",
  ACCESS_DENIED:
    "Access denied you do not have permission to access this resource.",

  INVALID_ACTION: "Invalid action. Please try again.",

  AN_ERROR_OCCURRED_WHILE_UPDATING_APPLICANT:
    "An error occurred while updating the applicant.",
} as const;

// Information Messages
export const INFO_MESSAGES = {
  // Loading States
  LOADING: "Loading...",
  PROCESSING: "Processing...",
  SAVING: "Saving...",
  UPLOADING: "Uploading...",
  DOWNLOADING: "Downloading...",
  DELETING: "Deleting...",

  // Status Updates
  DATA_LOADED: "Data loaded successfully.",
  NO_DATA_AVAILABLE: "No data available.",
  SEARCHING: "Searching...",
  FILTERING: "Filtering...",

  // File Operations
  LARGE_FILE_WARNING: "Large file detected. This may take a few minutes.",
  FILE_PROCESSING: "Processing file...",
  IMPORT_IN_PROGRESS: "Import in progress...",
  EXPORT_IN_PROGRESS: "Export in progress...",

  // General Information
  SELECT_OPTION: "Please select an option.",
  CONFIRM_ACTION: "Are you sure you want to proceed?",
  UNSAVED_CHANGES: "You have unsaved changes. Do you want to save them?",
  AUTO_SAVE: "Changes saved automatically.",

  PREPARING_FILE_FOR_DOWNLOAD: "Preparing file for download...",
} as const;

// Warning Messages
export const WARNING_MESSAGES = {
  // Data Warnings
  DATA_LOSS_WARNING: "This action may result in data loss.",
  UNSAVED_CHANGES_WARNING: "You have unsaved changes that will be lost.",
  DUPLICATE_ENTRY_WARNING:
    "This entry already exists. Do you want to update it?",

  // File Warnings
  LARGE_FILE_WARNING: "This file is large and may take time to process.",
  UNSUPPORTED_FILE_WARNING: "This file type may not be fully supported.",

  // Permission Warnings
  LIMITED_ACCESS_WARNING: "You have limited access to this feature.",

  // General Warnings
  CONFIRM_DELETE: "Are you sure you want to delete this item?",
  CONFIRM_LOGOUT: "Are you sure you want to logout?",
  CONFIRM_RESET: "Are you sure you want to reset all changes?",
} as const;

// Validation Messages
export const VALIDATION_MESSAGES = {
  // Required Fields
  REQUIRED: (fieldName: string) =>
    `${
      fieldName.charAt(0).toUpperCase() + fieldName.slice(1).toLowerCase()
    } is required.`,

  // Format Validation
  INVALID_FORMAT: (fieldName: string) =>
    `${fieldName} should be in the correct format.`,

  // Length Validation
  MIN_LENGTH: (fieldName: string, minLength: number) =>
    `${fieldName} must be at least ${minLength} characters.`,
  MAX_LENGTH: (fieldName: string, maxLength: number) =>
    `${fieldName} must not exceed ${maxLength} characters.`,

  // Password Validation
  PASSWORD_LENGTH: (fieldName: string, minLength: number) =>
    `${fieldName} must be at least ${minLength} characters.`,
  PASSWORD_COMPLEXITY: (fieldName: string) =>
    `${fieldName} must contain uppercase, lowercase, number and special character(s).`,
  PASSWORDS_MATCH: (fieldName: string) => `${fieldName} must match.`,

  // Contact Validation
  CONTACT_LENGTH: (fieldName: string, length: number) =>
    `${fieldName} should be ${length} digits.`,
  PHONE_NUMBER: (fieldName: string) =>
    `Invalid ${fieldName.toLowerCase()} format.`,

  // Number Validation
  POSITIVE_NUMBER: (fieldName: string) =>
    `${fieldName} must be a positive number.`,
  GREATER_THAN: (fieldName: string, comparedField: string) =>
    `${fieldName} must be greater than ${comparedField}.`,
  NOT_SAME_AS: (fieldName: string, comparedField: string) =>
    `${fieldName} must be different from ${comparedField}.`,

  // Email Validation
  EMAIL_FORMAT: "Please enter a valid email address.",
  EMAIL_REQUIRED: "Email is required.",

  // File Validation
  FILE_TYPE: (allowedTypes: string[]) =>
    `Please upload a file with one of these types: ${allowedTypes.join(", ")}.`,
  FILE_SIZE: (maxSize: string) => `File size must be less than ${maxSize}.`,
} as const;

// API Response Messages
export const API_MESSAGES = {
  // Success Responses
  SUCCESS: "Success",
  CREATED: "Created successfully",
  UPDATED: "Updated successfully",
  DELETED: "Deleted successfully",

  // Error Responses
  BAD_REQUEST: "Bad request",
  UNAUTHORIZED: "Unauthorized access",
  FORBIDDEN: "Access forbidden",
  NOT_FOUND: "Resource not found",
  CONFLICT: "Resource conflict",
  INTERNAL_ERROR: "Internal server error",
  SERVICE_UNAVAILABLE: "Service unavailable",

  // Validation Responses
  VALIDATION_ERROR: "Validation failed",
  INVALID_DATA: "Invalid data provided",
  MISSING_FIELDS: "Required fields are missing",
} as const;

// Toast Configuration Messages
export const TOAST_MESSAGES = {
  // Success Toast
  SUCCESS_TITLE: "Success",
  SUCCESS_DESCRIPTION: "Operation completed successfully",

  // Error Toast
  ERROR_TITLE: "Error",
  ERROR_DESCRIPTION: "An error occurred",

  // Warning Toast
  WARNING_TITLE: "Warning",
  WARNING_DESCRIPTION: "Please check your input",

  // Info Toast
  INFO_TITLE: "Information",
  INFO_DESCRIPTION: "Please note",
} as const;

// Form Messages
export const FORM_MESSAGES = {
  // Form States
  FORM_LOADING: "Loading form...",
  FORM_SAVING: "Saving form...",
  FORM_SUBMITTING: "Submitting form...",
  FORM_RESETTING: "Resetting form...",

  // Form Validation
  FORM_INVALID: "Please correct the errors in the form",
  FORM_VALID: "Form is valid",
  FORM_DIRTY: "Form has unsaved changes",
  FORM_PRISTINE: "Form is clean",

  // Form Actions
  FORM_SAVE_SUCCESS: "Form saved successfully",
  FORM_SAVE_ERROR: "Failed to save form",
  FORM_SUBMIT_SUCCESS: "Form submitted successfully",
  FORM_SUBMIT_ERROR: "Failed to submit form",
  FORM_RESET_SUCCESS: "Form reset successfully",
} as const;

// Table Messages
export const TABLE_MESSAGES = {
  // Data States
  NO_DATA: "No data available",
  LOADING_DATA: "Loading data...",
  DATA_LOADED: "Data loaded successfully",

  // Pagination
  SHOWING_RESULTS: (start: number, end: number, total: number) =>
    `Showing ${start} to ${end} of ${total} results`,
  PAGE_OF: (current: number, total: number) => `Page ${current} of ${total}`,

  // Actions
  SELECT_ALL: "Select all",
  DESELECT_ALL: "Deselect all",
  SELECTED_COUNT: (count: number) =>
    `${count} item${count !== 1 ? "s" : ""} selected`,

  // Sorting
  SORT_ASC: "Sort ascending",
  SORT_DESC: "Sort descending",
  SORT_NONE: "Remove sorting",
} as const;

// Export all message categories
export const MESSAGES = {
  SUCCESS: SUCCESS_MESSAGES,
  ERROR: ERROR_MESSAGES,
  INFO: INFO_MESSAGES,
  WARNING: WARNING_MESSAGES,
  VALIDATION: VALIDATION_MESSAGES,
  API: API_MESSAGES,
  TOAST: TOAST_MESSAGES,
  FORM: FORM_MESSAGES,
  TABLE: TABLE_MESSAGES,
} as const;

// Default export for easy importing
export default MESSAGES;
