import { configureStore } from "@reduxjs/toolkit";
import appStateSlice from "./apiSlice/configSlice/appStateSlice";
import authReducer from "./apiSlice/authSlice/authSlice";
import commissionReducer from "./apiSlice/configSlice/commissionSlice";
import dealerReducer from "./apiSlice/configSlice/dealerSlice";
import marketingReducer from "./apiSlice/configSlice/marketingSlice";
import adderVReducer from "./apiSlice/configSlice/adderVSlice";
import salesReducer from "./apiSlice/configSlice/salesSlice";
import tierLoanReducer from "./apiSlice/configSlice/tearLoanSlice";
import dealerTierReducer from "./apiSlice/configSlice/dealerTierSlice";
import payScheduleReducer from "./apiSlice/configSlice/payScheduleSlice";
import timeLineSlaReducer from "./apiSlice/configSlice/timeLineSlice";
import loanTypeReducer from "./apiSlice/configSlice/loanTypeSlice";
import resetPasswordSlice from "./apiSlice/authSlice/resetPasswordSlice";
export const store = configureStore({
  reducer: {
    appState: appStateSlice,
    auth: authReducer,
    resetPassword: resetPasswordSlice,
    comm: commissionReducer,
    dealer: dealerReducer,
    marketing: marketingReducer,
    adderV: adderVReducer,
    salesType: salesReducer,
    tierLoan: tierLoanReducer,
    dealerTier: dealerTierReducer,
    paySchedule: payScheduleReducer,
    timelineSla: timeLineSlaReducer,
    loanType: loanTypeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
