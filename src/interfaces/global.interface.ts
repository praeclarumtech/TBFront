import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export type timeStamp = { timeStamp: number };
export type timeZone = { timeZone: string };
export type requestId = { requestId: string };
export type path = { path: string };
export type version = { version: string };
export type repoVersion = { repoVersion: string };
export type statusCode = { statusCode: number };
export type message = { message: string };

export interface Pagination {
  search: string;
  page: number;
  total: number;
  perPage: number;
  orderBy: string;
  totalPage: number;
}

export interface Metadata
  extends timeStamp,
    timeZone,
    requestId,
    path,
    version,
    repoVersion {
  languages: Array<string>;
  pagination?: Pagination;
  totalUnSeen?: number;
}

export interface ValidationErrors {
  property: string;
  message: string;
}

export interface GlobalApiResponse extends statusCode, message {
  _metadata: Metadata;
  errors?: ValidationErrors[];
}

export interface ApiResponseError extends Omit<FetchBaseQueryError, "data"> {
  data: GlobalApiResponse;
}
