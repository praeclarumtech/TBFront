// import { createApi } from "@reduxjs/toolkit/query/react";
// import {baseQuery} from "config/AppUrl";
// import AppUrl from "config/AppUrl";
// import { GetProfileResponse, GetProfilePayload, LoginPayload, RegisterPayload, RegisterResponse, UpdateProfilePayload, UpdateProfileResponse, ViewProfileResponse, ViewProfilePayload } from "./auth.interface";
// import { LoginResponse } from "./auth.interface";

// const tagName = ["Profile"];
// const { USERS_URL } = AppUrl;

// export const LOGIN = "user/login";
// export const REGISTER = "user/register";
// export const UPDATEPROFILE = "user/updateProfile";
// export const VIEWPROFILE = "user/viewProfileById";
// export const CHANGEPASSWORD = "user/changePassword";
// export const VERIFY_OTP = "user/sendEmail/verifyOtp";
// export const SEND_OTP = "user/sendEmail";
// export const FORGOT_PASSWORD = "user/forgotPassword";
// export const GET_PROFILE = "user/getProfileByToken";


// export const login = async (data: object) => {
//   const response = await authServices.post(`${LOGIN}`, data);
//   return response?.data;
// };

// export const getProfile = async (data: object) => {
//   const response = await authServices.get(`${GET_PROFILE}`, data);
//   return response?.data;
// };

// export const register = async (data: object) => {
//   const response = await authServices.post(`${REGISTER}`, data);
//   return response?.data;
// };

// export const updateProfile = async (id?: string, data?: object) => {
//   const response = await authServices.put(`${UPDATEPROFILE}/${id}`, data);
//   return response?.data;
// };

// export const viewProfile = async (id?: string, data?: object) => {
//   const response = await authServices.get(`${VIEWPROFILE}/${id}`, data);
//   return response?.data;
// };

// export const changePassword = async (
//   id: string,
//   data: { oldPassword: string; newPassword: string; confirmPassword: string }
// ) => {
//   const response = await authServices.post(`${CHANGEPASSWORD}/${id}`, data);
//   return response?.data;
// };

// export const sendOtp = async (data: object) => {
//   const response = await authServices.post(`${SEND_OTP}`, data);
//   return response?.data;
// };

// export const verifyOtp = async (data: object) => {
//   const response = await authServices.post(`${VERIFY_OTP}`, data);
//   return response?.data;
// };

// export const forgotPassword = async (data: object) => {
//   const response = await authServices.put(`${FORGOT_PASSWORD}`, data);
//   return response?.data;
// };

// export const authApi = createApi({
//   baseQuery,
//   reducerPath: "auth",
//   tagTypes: tagName,
//   endpoints: (builder) => ({
//     login: builder.mutation<LoginResponse, LoginPayload>({
//       query: (credentials) => ({
//         url: `${USERS_URL}/login`,
//         method: "POST",
//         body: credentials,
//       }),
//     }),
//     register: builder.mutation<RegisterResponse, RegisterPayload>({
//       query: (credentials) => ({
//         url: `${USERS_URL}/register`,
//         method: "POST",
//         body: credentials,
//       }),
//     }),
//     updateProfile: builder.mutation<
//       UpdateProfileResponse,
//       UpdateProfilePayload
//     >({
//       query: (credentials) => ({
//         url: `${USERS_URL}/updateProfile`,
//         method: "PUT",
//         body: credentials,
//       }),
//     }),
//     viewProfile: builder.mutation<ViewProfileResponse, ViewProfilePayload>({
//       query: (credentials) => ({
//         url: `${USERS_URL}/viewProfile/${credentials.userId}`,
//         method: "GET",
//       }),
//     }),
//     getProfile: builder.query<GetProfileResponse, GetProfilePayload>({
//       providesTags: tagName,
//       query: () => `${USERS_URL}/getProfile`,
//     }),
//   }),
// });
