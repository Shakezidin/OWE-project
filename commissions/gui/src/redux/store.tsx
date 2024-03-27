import { configureStore} from "@reduxjs/toolkit";
import appStateSlice from "./apiSlice/appStateSlice";
import authReducer from './apiSlice/authSlice'
import commissionReducer from './apiSlice/commissionSlice'
import dealerReducer from "./apiSlice/dealerSlice";
import marketingReducer from "./apiSlice/marketingSlice";
import adderVReducer from "./apiSlice/adderVSlice";
import salesReducer from './apiSlice/salesSlice'
import tierLoanReducer from './apiSlice/tearLoanSlice'
import dealerTierReducer from './apiSlice/dealerTierSlice'
import payScheduleReducer from './apiSlice/payScheduleSlice'
import timeLineSlaReducer from './apiSlice/timeLineSlice'
import loanTypeReducer from './apiSlice/loanTypeSlice'
export const store = configureStore({
  reducer: {
    appState: appStateSlice,
    auth:authReducer,
    comm:commissionReducer,
    dealer:dealerReducer,
    marketing:marketingReducer,
    adderV:adderVReducer,
    salesType:salesReducer,
    tierLoan:tierLoanReducer,
    dealerTier:dealerTierReducer,
    paySchedule:payScheduleReducer,
    timelineSla:timeLineSlaReducer,
    loanType:loanTypeReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
