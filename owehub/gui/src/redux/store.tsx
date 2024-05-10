import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import appStateSlice from "./apiSlice/configSlice/config_get_slice/appStateSlice";
import authReducer from "./apiSlice/authSlice/authSlice";
import commissionReducer from "./apiSlice/configSlice/config_get_slice/commissionSlice";
import dealerReducer from "./apiSlice/configSlice/config_get_slice/dealerSlice";
import marketingReducer from "./apiSlice/configSlice/config_get_slice/marketingSlice";
import adderVReducer from "./apiSlice/configSlice/config_get_slice/adderVSlice";
import salesReducer from "./apiSlice/configSlice/config_get_slice/salesSlice";
import tierLoanReducer from "./apiSlice/configSlice/config_get_slice/tearLoanSlice";
import dealerTierReducer from "./apiSlice/configSlice/config_get_slice/dealerTierSlice";
import payScheduleReducer from "./apiSlice/configSlice/config_get_slice/payScheduleSlice";
import timeLineSlaReducer from "./apiSlice/configSlice/config_get_slice/timeLineSlice";
import loanTypeReducer from "./apiSlice/configSlice/config_get_slice/loanTypeSlice";
import resetPasswordSlice from "./apiSlice/authSlice/resetPasswordSlice";
import createCommissionReducer from "./apiSlice/configSlice/config_post_slice/createCommissionSlice";
import createMarketingReduce from "./apiSlice/configSlice/config_post_slice/createMarketingSlice";
import createAdderV from "./apiSlice/configSlice/config_post_slice/createAdderVSlice";
import createdealerReducer from "./apiSlice/configSlice/config_post_slice/createDealerSlice";
import createsalesReducer from "./apiSlice/configSlice/config_post_slice/createSalesTypeSlice";
import createtierLoanReducer from "./apiSlice/configSlice/config_post_slice/createLoanTypeSlice";
import createdealerTierReducer from "./apiSlice/configSlice/config_post_slice/createDealerTierSlice";
import createpayScheduleReducer from "./apiSlice/configSlice/config_post_slice/createPayScheduleSlice";
import createtimeLineSlaReducer from "./apiSlice/configSlice/config_post_slice/createTimeLineSlaSlice";
import createloanTypeReducer from "./apiSlice/configSlice/config_post_slice/createLoanTypeSlice";
import paginationReducer from "./apiSlice/paginationslice/paginationSlice";
import createUserReducer from "./apiSlice/userManagementSlice/createUserSlice";
import userManagementSlice from "./apiSlice/userManagementSlice/userManagementSlice";
import arAdjusments from "./apiSlice/configSlice/config_get_slice/arAdjusments";
import repPaySettingsSlice from "./apiSlice/configSlice/config_get_slice/repPaySettingsSlice";
import ArSchedule from "./apiSlice/configSlice/config_get_slice/ArSchedule";
import installConstSlice from "./apiSlice/configSlice/config_get_slice/installConstSlice";
import ChangePasswordSlice from "./apiSlice/authSlice/ChangePasswordSlice";
import leaderOverride from "./apiSlice/configSlice/config_get_slice/leaderOverride";
import adderDataSlice from "./apiSlice/configSlice/config_get_slice/adderDataSlice";
import rateAdjustmentsSlice from "./apiSlice/configSlice/config_get_slice/rateAdjustmentsSlice";
import reconcileSlice from "./apiSlice/configSlice/config_get_slice/reconcileSlice";
import loanFeeSlice from "./apiSlice/configSlice/config_get_slice/loanFeeSlice";
import arSlice from "./apiSlice/configSlice/config_get_slice/arSlice";
import adderCreditSlice from "./apiSlice/configSlice/config_get_slice/adderCreditSlice";
import adderResponsbilitySlice from "./apiSlice/configSlice/config_get_slice/adderResponsbilitySlice";
import apptSetterSlice from "./apiSlice/configSlice/config_get_slice/apptSetterSlice";
import dlrOth from "./apiSlice/configSlice/config_get_slice/dlrOth";
import nonComm from "./apiSlice/configSlice/config_get_slice/nonComm";
import refralDataSlice from "./apiSlice/configSlice/config_get_slice/refralDataSlice";
import autoAdderSlice from "./apiSlice/configSlice/config_get_slice/autoAdderSlice";
import perfomanceSlice from "./apiSlice/perfomanceSlice";
import activeSlice from "./apiSlice/configSlice/config_get_slice/activeSlice";

export const store = configureStore({
  reducer: {
    appState: appStateSlice,
    auth: authReducer,
    active: activeSlice,
    resetPassword: resetPasswordSlice,
    changePassword: ChangePasswordSlice,
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
    repaySettings: repPaySettingsSlice,
    // post slice define
    createCommission: createCommissionReducer,
    createMarketing: createMarketingReduce,
    createAdderV: createAdderV,
    createdealer: createdealerReducer,
    createsalesType: createsalesReducer,
    createtierLoan: createtierLoanReducer,
    createdealerTier: createdealerTierReducer,
    createpaySchedule: createpayScheduleReducer,
    createtimelineSla: createtimeLineSlaReducer,
    createloanType: createloanTypeReducer,
    paginationType: paginationReducer,
    //user management
    userManagement: userManagementSlice,
    createOnboardUser: createUserReducer,
    arAdjusments,
    ArSchedule,
    installConstSlice,
    leaderOverride,
    adderDataSlice,
    rateAdjustment: rateAdjustmentsSlice,
    reconcile: reconcileSlice,
    loanFeeSlice,
    apptsetters: apptSetterSlice,
    addercredit: adderCreditSlice,
    adderresponsbility: adderResponsbilitySlice,
    ar: arSlice,
    dlrOth,
    nonComm,
    refralDataSlice,
    autoadder: autoAdderSlice,
    perfomanceSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
