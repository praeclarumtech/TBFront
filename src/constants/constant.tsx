const appConstants = Object.freeze({
  ACCESS_TOKEN_ERROR_CODE: 401,
  REFRESH_TOKEN_ERROR_CODE: 401,
  ACCESS_TOKEN: "accessToken",
  ACTION_TYPES: {
    CREATE: "create",
    UPDATE: "update",
    DELETE: "delete",
    GET: "get",
    LIST: "list",
    LOGOUT: "logout",
  },
  noData: "-",
  dayEnums: {
    GoodMorning: "Good Morning",
    GoodAfternoon: "Good Afternoon",
    GoodEvening: "Good Evening",
  },
  handleScroll: {
    handleEditClick: () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },
  },
  handleResponse: {
    dataNotFound: "Sorry! No Result Found.",
    nullData: "---",
    somethingWrong: "Something went wrong.",
    tableButtons: {
      Previous: "Previous",
      Next: "Next",
    },
    roleEnums: {
      Admin: "Admin",
      Vendor: "Vendor",
      Manager: "Manager",
      SuperAdmin: "Super Admin",
      Employee: "Employee",
    },
    searchPlaceHolder: "Search...",
    validationMessages: {
      required: (fieldName: string) =>
        `${
          fieldName.charAt(0).toUpperCase() + fieldName.slice(1).toLowerCase()
        } is required.`,
      format: (fieldName: string) =>
        ` ${fieldName} should be in correct format.`,
      passwordLength: (fieldName: string, minLength: number) =>
        `${fieldName} must be at least ${minLength} characters.`,
      contactLength: (fieldName: string, minLength: number) =>
        `${fieldName} should be ${minLength} digit.`,
      passwordComplexity: (fieldName: string) =>
        `${fieldName} must be an uppercase lowercase number and special characters.`,
      passwordsMatch: (fieldName: string) => `${fieldName} must match.`,
      phoneNumber: (fieldName: string) =>
        `Invalid ${fieldName.toLowerCase()} format.`,
      notSameAsField: (fieldName: string, comparedField: string) =>
        `${fieldName} must be different from ${comparedField}.`,
      maxLength: (fieldName: string, maxLength: number | string) =>
        `${fieldName} must be at ${maxLength} characters.`,
      minLength: (fieldName: string, minLength: number | string) =>
        `${fieldName} must be at ${minLength} numbers.`,
      positiveNumber: (fieldName: string) => `${fieldName} must be positive`,
      greaterThan: (fieldName: string, parent: string) =>
        `${fieldName} must be greater than ${parent}`,
    },
    projectTitle: "Building Management",
    passwordRegex:
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]{2,3}(?![^.\s])/,
    numberRegex: /^\d{10}$/,
    zipcodeRegex: /^\d{6}$/,
    positiveNumberRegex:
      /^[+]?([1-9][0-9]*(?:[.][0-9]*)?|0*\.0*[1-9][0-9]*)(?:[eE][+-][0-9]+)?$/,
  },
});

export default appConstants;
