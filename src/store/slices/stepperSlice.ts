/* eslint-disable @typescript-eslint/no-explicit-any */
// src/redux/slices/stepperSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  createApplicant,
  updateApplicant,
  getApplicantDetails,
  getImportedApplicantDetails,
  updateImportedApplicant,
} from "api/applicantApi";
import { toast } from "react-toastify";
import { errorHandle } from "utils/commonFunctions";

interface StepperState {
  currentStep: number;
  formData: any;
  loading: boolean;
  error: string | null;
}

const initialState: StepperState = {
  currentStep: 0,
  formData: {},
  loading: false,
  error: null,
};

// Async thunks
export const fetchApplicantDetails = createAsyncThunk(
  "stepper/fetchApplicantDetails",
  async (
    { id, module }: { id: string; module: string },
    { rejectWithValue }
  ) => {
    try {
      const res =
        module === "import-applicant"
          ? await getImportedApplicantDetails(id)
          : await getApplicantDetails(id);
      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data || "Error fetching applicant"
      );
    }
  }
);

export const submitApplicant = createAsyncThunk(
  "stepper/submitApplicant",
  async (
    { id, module, formData }: { id?: string; module?: string; formData: any },
    { rejectWithValue }
  ) => {
    try {
      let response;
      if (!id) {
        response = await createApplicant(formData);
      } else if (module === "import-applicant") {
        response = await updateImportedApplicant(formData, id);
      } else {
        response = await updateApplicant(formData, id);
      }
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data || "Submission failed");
    }
  }
);

// Slice
const stepperSlice = createSlice({
  name: "stepper",
  initialState,
  reducers: {
    setStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    setFormData: (state, action: PayloadAction<any>) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    resetStepper: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchApplicantDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApplicantDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.formData = action.payload;
      })
      .addCase(fetchApplicantDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        errorHandle(action.payload);
      })
      .addCase(submitApplicant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitApplicant.fulfilled, (state, action) => {
        state.loading = false;
        toast.success(action.payload.message || "Success!");
      })
      .addCase(submitApplicant.rejected, (state, action) => {
        state.loading = false;
        const errorMessages = action.payload?.details;
        if (Array.isArray(errorMessages)) {
          errorMessages.forEach((msg) => toast.error(msg));
        } else {
          toast.error(action?.payload?.message || "Submission failed.");
          toast.error("An error occurred while submitting the applicant.");
        }
      });
  },
});

export const { setStep, setFormData, resetStepper } = stepperSlice.actions;
export default stepperSlice.reducer;
