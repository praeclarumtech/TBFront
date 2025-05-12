
// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';

import personalReducer from "./slices/personalDetailsSlice";
import educationReducer from "./slices/educationalDetailsSlice";
import jobReducer from "./slices/jobDetailsSlice";
import stepperReducer from "./slices/stepperSlice";
import listingReducer from "./slices/listing";

export const store = configureStore({

  devTools: true,
   reducer: {
    personal: personalReducer,
    education: educationReducer,
    job: jobReducer,
    stepper: stepperReducer,
    listing: listingReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;