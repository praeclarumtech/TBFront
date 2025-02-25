/* eslint-disable @typescript-eslint/no-explicit-any */

import { handleResponse } from "components/constants/common";
import { toast } from "react-toastify";
import { NOT_FOUND } from "components/constants/enum";

//For select
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
