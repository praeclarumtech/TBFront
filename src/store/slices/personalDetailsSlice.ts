import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PersonalDetailsState {
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: Date;
  email: string;
  phoneNumber: string;
  whatsappNumber: string;
  gender: string;
  country: string;
  state: string;
  // city: string;
  // pincode: string;
  // fullAddress: string;
  currentPincode: string;
  currentCity: string;
  homeTownCity: string;
  homePincode: string;
  preferredLocations: string;
  currentLocation: string;
}

const initialState: PersonalDetailsState = {
  firstName: '',
  middleName: '',
  lastName: '',
  dateOfBirth: new Date(),
  email: '',
  phoneNumber: '',
  whatsappNumber: '',
  gender: '',
  country: '',
  state: '',
  // city: '',
  // pincode: '',
  // fullAddress: ''
  currentPincode: '',
  currentCity: '',
  homeTownCity: '',
  homePincode: '',
  preferredLocations: '',
  currentLocation: '',


};

const personalDetailsSlice = createSlice({
  name: 'personalDetails',
  initialState,
  reducers: {
    setPersonalDetails: (state, action: PayloadAction<Partial<PersonalDetailsState>>) => {
      return { ...state, ...action.payload };
    },
    resetPersonalDetails: () => initialState
  },
});

export const { setPersonalDetails, resetPersonalDetails } = personalDetailsSlice.actions;
export default personalDetailsSlice.reducer;

