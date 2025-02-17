// // redux/slices/personalDetailsSlice.ts
// import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// interface PersonalDetailsState {
//   firstName: string;
//   middleName: string;
//   lastName: string;
//   dateOfBirth: string;
//   email: string;
//   phoneNumber: string;
//   whatsappNumber: string;
//   gender: string;
//   country: string;
//   state: string;
//   city: string;
//   pincode: string;
//   fullAddress: string;
// }

// const initialState: PersonalDetailsState = {
//   firstName: '',
//   middleName: '',
//   lastName: '',
//   dateOfBirth: '',
//   email: '',
//   phoneNumber: '',
//   whatsappNumber: '',
//   gender: '',
//   country: '',
//   state: '',
//   city: '',
//   pincode: '',
//   fullAddress: ''
// };

// const personalDetailsSlice = createSlice({
//   name: 'personalDetails',
//   initialState,
//   reducers: {
//     setPersonalDetails: (state, action: PayloadAction<PersonalDetailsState>) => {
//       return { ...state, ...action.payload };
//     },
//   },
// });

// export const { setPersonalDetails } = personalDetailsSlice.actions;
// export default personalDetailsSlice.reducer;
// src/redux/slices/personalDetailsSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PersonalDetailsState {
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  phoneNumber: string;
  whatsappNumber: string;
  gender: string;
  country: string;
  state: string;
  city: string;
  pincode: string;
  fullAddress: string;
}

const initialState: PersonalDetailsState = {
  firstName: '',
  middleName: '',
  lastName: '',
  dateOfBirth: '',
  email: '',
  phoneNumber: '',
  whatsappNumber: '',
  gender: '',
  country: '',
  state: '',
  city: '',
  pincode: '',
  fullAddress: ''
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

