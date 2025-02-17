// src/redux/slices/educationalDetailsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface EducationalDetailsState {
  qualification: string;
  degree: string;
  passingYear: string;
  appliedSkills: string[];
  otherSkills: string;
  totalExperience: number;
  relevantSkillExperience: number;
  referral: string;
  url: string;
  rating: number;
}

const initialState: EducationalDetailsState = {
  qualification: '',
  degree: '',
  passingYear: '',
  appliedSkills: [],
  otherSkills: '',
  totalExperience: 0,
  relevantSkillExperience: 0,
  referral: '',
  url: '',
  rating: 0
};

const educationalDetailsSlice = createSlice({
  name: 'educationalDetails',
  initialState,
  reducers: {
    setEducationalDetails: (state, action: PayloadAction<Partial<EducationalDetailsState>>) => {
      return { ...state, ...action.payload };
    },
    resetEducationalDetails: () => initialState
  },
});

export const { setEducationalDetails, resetEducationalDetails } = educationalDetailsSlice.actions;
export default educationalDetailsSlice.reducer;