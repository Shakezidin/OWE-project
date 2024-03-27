import { configureStore} from "@reduxjs/toolkit";
import appStateSlice from "./features/appStateSlice";
import authReducer from './features/authSlice'
import commissionReducer from './features/commissionSlice'
import dealerReducer from "./features/dealerSlice";
import marketingReducer from "./features/marketingSlice";
import adderVReducer from "./features/adderVSlice";
export const store = configureStore({
  reducer: {
    appState: appStateSlice,
    auth:authReducer,
    comm:commissionReducer,
    dealer:dealerReducer,
    marketing:marketingReducer,
    adderV:adderVReducer,
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
