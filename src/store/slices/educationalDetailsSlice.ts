// src/redux/slices/educationalDetailsSlice.ts

import { VIEW_ALL_DEGREE } from "api/apiRoutes";
import { authServices } from "api/apiServices";
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { PayloadAction } from '@reduxjs/toolkit';

interface Qualification {
  label: string;
  value: string;
} 
interface EducationalDetails {
  educationalData: {
    passingYear: string;
    cgpa: string;
    collegeName: string;
    specialization: string;
  };
  qualification: Qualification[];
  loading: boolean;
  error: string | null;
}

const initialState: EducationalDetails = {
  educationalData: {
    passingYear: "",
    cgpa: "",
    collegeName: "",
    specialization: " ",
  },
  qualification: [],
  loading: false,
  error: null,
};

export const fetchQualifications = createAsyncThunk(
  "fetchQualifications",
  async (params: { page?: number; pageSize?: number; limit?: number } = {}) => {
    const response = await authServices.get(`${VIEW_ALL_DEGREE}`, { params });
    const degrees = response?.data?.data?.data;

    if (!Array.isArray(degrees)) throw new Error("Invalid qualification data");

    return degrees.map((item: { degree: string; _id: string }) => ({
      label: item.degree,
      value: item._id,
    }));
  }
);

const educationSlice = createSlice({
  name: "education",
  initialState,
  reducers: {
    setEducationalData: (
      state,
      action: PayloadAction<Partial<EducationalDetails["educationalData"]>>
    ) => {
  state.educationalData= { ...state.educationalData, ...action.payload };
      },
  clearEducationalData: (state) => {
    state.educationalData = initialState.educationalData;
  },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchQualifications.fulfilled, (state, action) => {
        state.qualification = action.payload;
        state.loading = false;
      })
      .addCase(fetchQualifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchQualifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch qualifications";
      });
  },
});

export const { setEducationalData, clearEducationalData } = educationSlice.actions;
export default educationSlice.reducer;