import {
  BaseQueryApi,
  FetchArgs,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import appConstants from "../constants/constant";
import { ApiResponseError } from "../interfaces/global.interface";
import { store } from "../store/store";
import appEnv from "./appEnv";

const {
  ACCESS_TOKEN_ERROR_CODE,
  REFRESH_TOKEN_ERROR_CODE,
  ACCESS_TOKEN,
  ACTION_TYPES,
} = appConstants;

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

const reqHeaders = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers) => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN);
    if (accessToken) {
      headers.set("authorization", `Bearer ${accessToken}`);
    }
    return headers;
  },
});

export const baseQuery = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: any
) => {
  try {
    const response = (await reqHeaders(args, api, extraOptions)) as {
      data: any;
      error: ApiResponseError;
    };
    const errorCode = response?.error?.data?.statusCode;
    if (
      errorCode === ACCESS_TOKEN_ERROR_CODE ||
      errorCode === REFRESH_TOKEN_ERROR_CODE
    ) {
      store.dispatch({
        type: ACTION_TYPES.LOGOUT,
        payload: response?.error?.data?.message,
      });
    }

    return response;
  } catch (error) {
    console.log("baseQuery error", error);
    return { error };
  }
};

export default AppUrl;
