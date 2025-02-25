// src/redux/slices/educationalDetailsSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface EducationalDetails {
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

const initialState: EducationalDetails = {
  qualification: "",
  degree: "",
  passingYear: "",
  appliedSkills: [],
  otherSkills: "",
  totalExperience: 0,
  relevantSkillExperience: 0,
  referral: "",
  url: "",
  rating: 0,
};

const educationalDetailsSlice = createSlice({
  name: "educationalDetails",
  initialState,
  reducers: {
    setEducationalDetails: (
      state,
      action: PayloadAction<Partial<EducationalDetails>>
    ) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { setEducationalDetails } = educationalDetailsSlice.actions;
export default educationalDetailsSlice.reducer;
