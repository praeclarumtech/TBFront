/* eslint-disable @typescript-eslint/no-explicit-any */

//API Response
export const SUCCESS = true;
export const ERROR = "Error";

//Status Code
export const NOT_FOUND = 404;
export const OK = 200;
export const CREATED = 201;
export const ACCEPTED = 202;

export const ServiceEnums = {
  MasterService: "Master Item",
  UpdateService: "Update Master Item",
};

export const StockTypeEnums = {
  StockType: "Material Procurement",
  UpdateStock: "Update Material Procurement",
};

export const ButtonEnums = {
  Create: "Create Item",
  Submit: "Submit",
  Edit: "Edit",
  Updates: "Update",
  Cancel: 'Cancel',
  ChangePassword : 'Change Password',
};

export const Modules = {
  Login: "Login",
  Register: "Register",
  Applicant: "Applicant",
};

const getItem = (key:any) => {
  return sessionStorage.getItem(key);
};
const setItem = (key:any, value: any) => {
  return sessionStorage.setItem(key, value);
};
const clearSessionStorage = () => {
  sessionStorage.clear();
};
export {getItem, clearSessionStorage, setItem};