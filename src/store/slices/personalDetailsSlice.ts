/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { CITY, EXISTING_APPLICANT, STATE } from "api/apiRoutes";
import { authServices } from "api/apiServices";

interface City {
  label: string;
  value: string;
  country_id?: string;
}

interface PersonalDetailsState {
  personalData: {
    // name:string,
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
    permanentAddress: string;
    maritalStatus: string;
    currentAddress: string;
    currentCity: string;
  };
  cities: City[];
  states: City[];
  loading: boolean;
  error: string | null;
}

const initialState: PersonalDetailsState = {
  personalData: {
    firstName: "",
    middleName: "",
    lastName: "",
    dateOfBirth: new Date(),
    email: "",
    phoneNumber: "",
    whatsappNumber: "",
    gender: "",
    country: "",
    state: "",
    permanentAddress: "",
    maritalStatus: "",
    currentAddress: "",
    currentCity: "",
  },
  cities: [],
  states: [],
  loading: false,
  error: null,
};

export const fetchcity = createAsyncThunk("personal/fetchCity", async () => {
  const response = await authServices.get(CITY);
  return response.data;
});

export const fetchstate = createAsyncThunk("personal/fetchState", async () => {
  const response = await authServices.get(STATE);
  return response.data;
});

export const CheckExistingApplicant = createAsyncThunk(
  "personal/checkExisting",
  async (params: {
    email?: string;
    phoneNumber?: number;
    whatsappNumber?: number;
  }) => {
    const response = await authServices.get(EXISTING_APPLICANT, { params });
    return response.data;
  }
);

const personalSlice = createSlice({
  name: "personal",
  initialState,
  reducers: {
    setPersonalData: (
      state,
      action: PayloadAction<Partial<PersonalDetailsState["personalData"]>>
    ) => {
      state.personalData = { ...state.personalData, ...action.payload };
    },
    clearPersonalData: (state) => {
      state.personalData = initialState.personalData;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchcity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchcity.fulfilled, (state, action) => {
        state.loading = false;
        state.cities = action.payload.data.map((city: any) => ({
          label: city.city_name,
          value: city._id,
        }));
      })
      .addCase(fetchcity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch cities";
      })
      .addCase(fetchstate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchstate.fulfilled, (state, action) => {
        state.loading = false;
        state.states = action.payload.data.map((state: any) => ({
          label: state.state_name,
          value: state._id,
          country_id: state.country_id,
        }));
      })
      .addCase(fetchstate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch states";
      })
      .addCase(CheckExistingApplicant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(CheckExistingApplicant.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(CheckExistingApplicant.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to check existing applicant";
      });
  },
});

export const { setPersonalData, clearPersonalData } = personalSlice.actions;
export default personalSlice.reducer;
