import { configureStore } from "@reduxjs/toolkit";
import appStateSlice from "./features/appStateSlice";
import apiReducer from './features/apiSlice';
export const store = configureStore({
  reducer: {
    appState: appStateSlice,
    api: apiReducer,
  }
});

export type RootState = ReturnType<typeof store.getState>;