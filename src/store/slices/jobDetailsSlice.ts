// src/redux/slices/jobDetailsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface JobDetailsState {
  expectedPkg: string;
  currentPkg: string;
  negotiation: string;
  noticePeriod: string;
  readyForWork: string;
  workPreference: string;
  aboutUs: string;
}

const initialState: JobDetailsState = {
  expectedPkg: '',
  currentPkg: '',
  negotiation: '',
  noticePeriod: '',
  readyForWork: '',
  workPreference: '',
  aboutUs: ''
};

const jobDetailsSlice = createSlice({
  name: 'jobDetails',
  initialState,
  reducers: {
    setJobDetails: (state, action: PayloadAction<Partial<JobDetailsState>>) => {
      return { ...state, ...action.payload };
    },
    resetJobDetails: () => initialState
  },
});

export const { setJobDetails, resetJobDetails } = jobDetailsSlice.actions;
export default jobDetailsSlice.reducer;