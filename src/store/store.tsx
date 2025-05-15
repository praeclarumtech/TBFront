// // redux/store.ts
// import { configureStore } from '@reduxjs/toolkit';
// import personalDetailsReducer from '../store/slices/personalDetailsSlice';

// const store = configureStore({
//   reducer: {
//     personalDetails: personalDetailsReducer,

//   },
// });

// export default store;



// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import personalDetailsReducer from './slices/personalDetailsSlice';
import educationalDetailsReducer from './slices/educationalDetailsSlice';
import jobDetailsReducer from './slices/jobDetailsSlice';

export const store = configureStore({
  reducer: {
    personalDetails: personalDetailsReducer,
    educationalDetails: educationalDetailsReducer,
    jobDetails: jobDetailsReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;