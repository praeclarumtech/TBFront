import appConstants from "constants/constant";
import { JWTDecodedUser } from "interfaces/global.interface";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

const { ACCESS_TOKEN, handleResponse, NOT_FOUND } = appConstants;

export const removeAppTokens = (): void => {
  localStorage.removeItem(ACCESS_TOKEN);
  sessionStorage.clear();
};

export const isAuthenticated = (): boolean => {
  if (typeof window == "undefined") return false;

  try {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      const user: JWTDecodedUser = jwtDecode(token);
      const dateNow = new Date();

      if (user?.exp > dateNow.getTime() / 1000) {
        return true;
      }
      removeAppTokens();
    }
  } catch (error) {
    removeAppTokens();
  }

  return false;
};

export const InputPlaceHolder = (fieldName: string) => {
  return `Enter ${fieldName}`;
};

export const handleEditClick = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

export const getSerialNumber = (cell: any) => cell.row.index + 1;

export const RequiredField = (field: string) => {
  return `${field} is required.`;
};

export const PlaceHolderFormat = (fieldName: string) => {
  return `Enter ${fieldName.toLowerCase()}`;
};

export const IsInvalid = (validation: any, fieldName: string | number) => {
  return validation.touched[fieldName] && validation.errors[fieldName];
};
const getItem = (key: any) => {
  return sessionStorage.getItem(key);
};
const setItem = (key: any, value: any) => {
  return sessionStorage.setItem(key, value);
};
const clearSessionStorage = () => {
  sessionStorage.clear();
};
export { getItem, clearSessionStorage, setItem };

export const dynamicFind = (array: any, validation: any) => {
  return array?.find((option: any) => option?.value === validation);
};

export const errorHandle = (error: any) => {
  if (error?.response?.data?.statusCode === NOT_FOUND) {
    toast.error(error?.response?.data?.message);
  } else {
    toast.error(handleResponse.somethingWrong);
  }
};
