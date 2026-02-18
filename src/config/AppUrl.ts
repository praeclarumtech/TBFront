import {
  BaseQueryApi,
  FetchArgs,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { ApiResponseError } from "../interfaces/global.interface";
import appEnv from "./appEnv";
import { handleSessionExpiration } from "../api/apiServices";
import { setAuthData, ACCESS_TOKEN } from "../utils/commonFunctions";

const API_BASE_URL = `${appEnv.API_ENDPOINT}/${appEnv.API_SUFFIX}`;

const AppUrl = {
  DASHBOARD_URL: "/dashboard/applicants",
  APPLICANT_URL: "/applicants",
  SKILL_URL: "/skill",
  USERS_URL: "/user",
  YEAR_URL: "/year",
  REPORTS_URL: "/reports/applicnts",
};

Object.freeze(AppUrl);

// Backend sends renewed token in header (X-New-Token) and/or body (response.data.accessToken). Check every response.
const fetchWithTokenUpdate: typeof fetch = async (input, init) => {
  const res = await fetch(input, init);
  const accessToken = res.headers.get("X-New-Token") ?? res.headers.get("x-new-token");
  if (accessToken) {
    setAuthData(accessToken);
  }
  return res;
};

const reqHeaders = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers) => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN);
    if (accessToken) {
      headers.set("authorization", `Bearer ${accessToken}`);
    }
    return headers;
  },
  fetchFn: fetchWithTokenUpdate,
});

export const baseQuery = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: any
) => {
  try {
    let response = (await reqHeaders(args, api, extraOptions)) as {
      data: any;
      error: ApiResponseError;
    };

    // Update stored token when backend sends renewal in body (response.data.accessToken)
    const accessTokenFromBody =
      (response?.data as any)?.accessToken ??
      (response?.error?.data as any)?.accessToken;
    if (accessTokenFromBody) {
      setAuthData(accessTokenFromBody);
    }

    // Check for session expired response: { sessionExpired: true, code: "SESSION_EXPIRED", statusCode: 401 }
    const errorData = (response?.error?.data ?? response?.data) as any;
    const isSessionExpired =
      errorData?.sessionExpired === true ||
      errorData?.code === "SESSION_EXPIRED" ||
      (errorData?.statusCode === 401 &&
        errorData?.message?.toLowerCase().includes("session expired"));

    if (isSessionExpired) {
      handleSessionExpiration();
    }

    return response;
  } catch (error) {
    console.log("baseQuery error", error);
    return { error };
  }
};

export default AppUrl;
