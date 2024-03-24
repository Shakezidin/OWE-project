import { configureStore} from "@reduxjs/toolkit";
import appStateSlice from "./features/appStateSlice";
import authReducer from './features/authSlice'
export const store = configureStore({
  reducer: {
    appState: appStateSlice,
    auth:authReducer

  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
