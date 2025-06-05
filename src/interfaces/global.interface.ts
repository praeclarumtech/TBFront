/* eslint-disable @typescript-eslint/no-explicit-any */
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
export type FormData = {
  password: string;
  confirmPassword: string;
};
export interface JWTDecodedUser {
  exp: number;
}

type InputType =
  | "number"
  | "text"
  | "password"
  | "email"
  | "tel"
  | "url"
  | "date";
export interface BaseInputProps {
  label?: string | JSX.Element;
  name: string;
  type: InputType;
  className?: string;
  placeholder?: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  value: any;
  touched?: boolean;
  error?: string;
  maxLength?: number;
  disabled?: boolean;
  passwordToggle?: boolean;
  title?: string;
  onclick?: () => void;
  max?: string;
  min?: string;
  isRequired?: boolean;
}

export interface BaseButtonProps {
  color?: string;
  disabled?: boolean;
  loader?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  id?: string;
  children?: React.ReactNode;
  variant?: string;
  sx?: any;
  hoverOptions?: string[];
  onOptionClick?: (option: string) => void;
}

export interface BaseModalProps {
  show?: boolean;
  onSubmitClick?: () => void;
  onCloseClick?: () => void;
  loader?: boolean;
  children?: React.ReactNode;
  modalTitle?: string | React.ReactNode;
  closeButtonText?: string;
  submitButtonText?: string;
  setShowBaseModal: React.Dispatch<React.SetStateAction<boolean>>;
  size?: "sm" | "lg" | "xl";
}
export interface MultiSelectProps {
  label?: string;
  value: any;
  isMulti?: boolean;
  onChange: (selectedOption: any) => void;
  options: any[];
  styles?: any;
  touched?: boolean;
  error?: string;
  name: string;
  handleBlur?: (event: React.FocusEvent<HTMLElement>) => void;
  className?: string;
  isDisabled?: boolean;
  placeholder?: string;
  handleChange?: (selectedOption: any) => void;
  isRequired?: boolean;
}
export interface MultiSelectCheckBoxProps {
  label?: string;
  value: any;
  isMulti?: boolean;
  onChange: (selectedOption: any) => void;
  options: any[];
  styles?: any;
  touched?: boolean;
  error?: string;
  name: string;
  handleBlur?: (event: React.FocusEvent<HTMLElement>) => void;
  className?: string;
  isDisabled?: boolean;
  placeholder?: string;
  handleChange?: (selectedOption: any) => void;
  showSelectAll?: boolean;
  isRequired?: boolean;
}

export interface BaseSelectProps {
  label?: string;
  name: string;
  className?: string;
  options: any[];
  placeholder?: string;
  handleChange: (selectedOption: any) => void;
  handleBlur?: (event: React.FocusEvent<HTMLElement>) => void;
  value: any;
  touched?: boolean;
  error?: string;
  isDisabled?: boolean;
  styles?: any;
  isRequired?: boolean;
  menuPortalTarget?: HTMLElement | null;
  menuPosition?: "absolute" | "fixed";
}

export interface BaseTextareaProps {
  label?: string;
  name: string;
  className?: string;
  placeholder?: string;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
  value: string;
  touched?: boolean;
  error?: string;
  maxLength?: number;
  disabled?: boolean;
  rows?: number;
  cols?: number;
  passwordToggle?: boolean;
  multiline?: boolean;
  isRequired?: boolean;
}

export interface BreadCrumbProps {
  title: string;
  pageTitle: string;
}

export interface DeleteModalProps {
  show?: boolean;
  onDeleteClick?: () => void;
  onCloseClick?: () => void;
  recordId?: string;
  loader?: boolean;
}
export interface ActiveModalProps {
  show?: boolean;
  onYesClick?: () => void;
  onCloseClick?: () => void;
  recordId?: string;
  loader?: boolean;
  flag?: boolean | undefined;
}

export interface MultiDeleteModalProps {
  show?: boolean;
  onDeleteClick?: () => void;
  onCloseClick?: () => void;
  recordId?: string;
  loader?: boolean;
  deleteItems: string[] | null;
}

export interface TableContainerProps {
  columns?: any;
  isPagination?: boolean;
  data?: any;
  isGlobalFilter?: any;
  isProductsFilter?: any;
  isCustomerFilter?: any;
  isOrderFilter?: any;
  isContactsFilter?: any;
  isCompaniesFilter?: any;
  isLeadsFilter?: any;
  isCryptoOrdersFilter?: any;
  isInvoiceListFilter?: any;
  isTicketsListFilter?: any;
  isNFTRankingFilter?: any;
  isTaskListFilter?: any;
  handleTaskClick?: any;
  customPageSize?: any;
  tableClass?: any;
  theadClass?: any;
  trClass?: any;
  thClass?: any;
  divClass?: any;
  SearchPlaceholder?: any;
  handleLeadClick?: any;
  handleCompanyClick?: any;
  handleContactClick?: any;
  handleTicketClick?: any;
  isHeaderTitle?: any;
  totalRecords?: any;
  pagination?: any;
  setPagination?: any;
  loader?: any;
  rowHeight?: any;
  tableMarginTop?: any;
  searchBoxMarginTop?: any;
  titleMarginTop?: any;
  customPadding?: any;
}

export interface BaseSliderProps {
  label?: string | any;
  name?: string | any;
  className?: string;
  value?: string | any;
  handleChange?: any;
  min?: number;
  max?: number;
  step?: any;
  disabled?: boolean;
  error?: string;
  touched?: boolean;
  valueLabelDisplay?: any;
  valueLabelFormat?: any;
}

export interface BasePopUpModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  title: string;
  message?: string;
  items?: string[]; // Optional array of items to display in the modal
  confirmAction: () => void;
  cancelAction: () => void;
  confirmText?: string;
  cancelText?: string;
  disabled?: boolean;
}
