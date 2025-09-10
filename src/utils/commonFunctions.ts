/* eslint-disable @typescript-eslint/no-explicit-any */
import appConstants from "constants/constant";
// import { JWTDecodedUser } from "interfaces/global.interface";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

const { handleResponse, NOT_FOUND } = appConstants;

export const ACCESS_TOKEN = "authUser";
export const EXPIRES_AT = "expiresAt";

export const removeAppTokens = (): void => {
  localStorage.removeItem(ACCESS_TOKEN);
  sessionStorage.clear();
  localStorage.removeItem(EXPIRES_AT);
  localStorage.removeItem("access_token");
  localStorage.removeItem("id");
  localStorage.removeItem("role");
  localStorage.removeItem("accessModules");
};
const removeItem = (key: string) => {
  sessionStorage.removeItem(key);
  localStorage.removeItem(key);
  localStorage.removeItem("authUser");
  localStorage.removeItem("id");
  localStorage.removeItem("role");
  localStorage.removeItem("accessModules");
};

export const isAuthenticated = () => {
  const token = getItem(ACCESS_TOKEN);
  const expiresAt = getItem(EXPIRES_AT);
  return !!token && Date.now() < parseInt(expiresAt || 0);
};

export const setAuthData = (data: any) => {
  try {
    // Extract the token string from the data object
    const token = data?.token;
    const user = data?.user;

    // Validate token
    if (!token || typeof token !== "string") {
      console.error("setAuthData: Invalid token in data object", {
        data,
        token,
        tokenType: typeof token,
      });
      throw new Error(`Token must be a non-empty string. Got: ${typeof token}`);
    }

    const decoded: any = jwtDecode(token);

    const expireTime = Date.now() + 5 * 60 * 60 * 1000;

    // Store token data
    setItem(ACCESS_TOKEN, token);
    setItem(EXPIRES_AT, expireTime.toString());
    setItem("role", decoded.role);
    setItem("id", decoded.id);
    setItem("accessModules", user?.roleId?.accessModules);
  } catch (error: any) {
    console.error("setAuthData failed:", error);
    console.error("Error stack:", error.stack);
    throw error; // Re-throw to let the calling code handle it
  }
};

export const logout = () => {
  removeAppTokens();
  removeItem("access_token");
  removeItem(ACCESS_TOKEN);
  removeItem(EXPIRES_AT);
  removeItem("role");
  removeItem("id");
  removeItem("accessModules");
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
const getItem = (key: string) => {
  const val = localStorage.getItem(key);
  if (!val) return null;
  try {
    return JSON.parse(val);
  } catch (e: any) {
    console.error("getItem failed:", e);
    return val;
  }
};

// const getItem = (key: any) => {
//   return sessionStorage.getItem(key);
// };

// const setItem = (key: any, value: any) => {
//   return sessionStorage.setItem(key, value);
// };
const setItem = (key: string, value: any) => {
  localStorage.setItem(
    key,
    typeof value === "string" ? value : JSON.stringify(value)
  );
};
const clearSessionStorage = () => {
  sessionStorage.clear();
};
export { getItem, clearSessionStorage, setItem };

export const dynamicFind = (array: any, validation: any, flag = "all") => {
  //For city, state, contury
  if (flag === "location") {
    return array?.find((option: any) => option?.label === validation);
  }

  return array?.find((option: any) => option?.value === validation);
};

export const errorHandle = (error: any) => {
  if (error?.response?.data?.statusCode === NOT_FOUND) {
    toast.error(error?.response?.data?.message);
  } else {
    toast.error(handleResponse.somethingWrong);
  }
};
export const capitalizeWords = (str: any) => {
  if (typeof str !== "string") return "";
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export const getCurrentUser = () => {
  const token = localStorage.getItem(ACCESS_TOKEN);
  if (!token) return null;

  try {
    const decoded: any = jwtDecode(token);
    return decoded && typeof decoded === "object" ? decoded : null;
  } catch {
    return null;
  }
};

// utils/auth.ts

export const getCurrentUserRole = (): string | null => {
  try {
    const user = localStorage.getItem("role");
    if (!user) return null;

    return user;
  } catch (error) {
    console.error("Error parsing currentUser from localStorage:", error);
    return null;
  }
};
