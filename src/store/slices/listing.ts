// src/redux/slices/listingSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch applicant listing with filters
export const fetchApplicantListing = createAsyncThunk(
  "listing/fetchApplicantListing",
  async (filters) => {
    const response = await axios.get("/api/applicants", { params: filters });
    return response.data;
  }
);

const listingSlice = createSlice({
  name: "listing",
  initialState: {
    applicants: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchApplicantListing.fulfilled, (state, action) => {
        state.applicants = action.payload;
        state.loading = false;
      })
      .addCase(fetchApplicantListing.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchApplicantListing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default listingSlice.reducer;
