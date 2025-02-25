import appConstants from "constants/constant";
import { jwtDecode } from "jwt-decode";

interface JWTDecodedUser {
  exp: number;
  // add other properties if needed
}

const { ACCESS_TOKEN } = appConstants;

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
    // showNotification("error", "Invalid Token");
    removeAppTokens();
  }

  return false;
};
