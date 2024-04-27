/**
 * Created by satishazad on 13/01/24
 * File Name: App.tsx
 * Product Name: WebStorm
 * Project Name: owe_web_app
 * Path: /
 */

import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import WelcomePage from "./ui/pages/welcome/WelcomePage";
import ResetPassword from "./ui/pages/resetPassword/ResetPassword";
import { LoginPage } from "./ui/pages/login/LoginPage";

import MainLayout from "./ui/components/layout/MainLayout";
import EnterOtpScreen from "./ui/pages/otp/EnterOtpScreen";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./redux/store";
import { initializeAuth } from "./redux/apiSlice/authSlice/authSlice";

import { DashboardPage } from "./ui/pages/dashboard/DashboardPage";
import { ROUTES } from "./routes/routes";
import CommissionRate from "./ui/pages/configure/commissionRate/CommissionRate";
import DealerOverRides from "./ui/pages/configure/dealerOverrides/DealerOverRides";
import MarketingFees from "./ui/pages/configure/marketingFees/MarketingFees";
import DealerTier from "./ui/pages/configure/dealerTier/DealerTier";
import LoanType from "./ui/pages/configure/loanType/LoanType";
import SaleType from "./ui/pages/configure/saleType/SaleType";
import AdderValidation from "./ui/pages/configure/adderValidation/AdderValidation";
import PaymentSchedule from "./ui/pages/configure/paymentValidation/PaymentSchedule";
import TierLoanFee from "./ui/pages/configure/tierLoanfee/TierLoanFee";
import TimeLine from "./ui/pages/configure/timeline/TimeLine";
import AutoAdder from "./ui/pages/configure/autoAdder/AutoAdder";
import DealerCredit from "./ui/pages/configure/dealerCredit/DealerCredit";
import RebateData from "./ui/pages/configure/reabateData/RebateData";
import ReferalData from "./ui/pages/configure/referalData/ReferalData";
import DlrOthPay from "./ui/pages/configure/dlrOthPay/DlrOthPay";
import NonCommDlrPay from "./ui/pages/configure/non_comm(dlrpay)/NonCommDlrPay";
import LoanFeeAddr from "./ui/pages/configure/loanFeeAddr/LoanFeeAddr";
import UserManagement from "./ui/pages/userManagement/UserManagement";
import AccountSettings from "./ui/pages/accountSettings/AccountSettings";
import Report from "./ui/pages/report/Report";
import Project from "./ui/pages/projectTracker/ProjectTracker";
import TechnicalSupport from "./ui/pages/technicalSupport/TechnicalSupport";
import DataTablle from "./ui/pages/databaseManager/dataTable/DataTable";
import UserActivity from "./ui/pages/databaseManager/userActivity/UserActivity";
import DbManagerDashboard from "./ui/pages/databaseManager/dbManagerDashboard/DbManagerDashboard";
import Webhook from "./ui/pages/databaseManager/webhookTable/Webhook";
import ConfigurePage from "./ui/pages/configure/ConfigurePage";
import { RepPayDashboardPage } from "./ui/pages/reppay/reppaydashboard/reppaydashboard";
import RepPaySettings from "./ui/pages/configure/repPaySettings/RepPaySettings";
import RateAdjustments from "./ui/pages/configure/rateAdjustments/RateAdjustments";
import ARSchedule from "./ui/pages/configure/ARSchedule/ARSchedule";
import AR from "./ui/pages/configure/AR/Ar";
import InstallCost from "./ui/pages/configure/installCost/installCost";
import LeaderOverride from "./ui/pages/configure/leaderOverride/LeaderOverride";
import AdderCredit from "./ui/pages/configure/adderCredit/AdderCredit";
import AdderResponsibility from "./ui/pages/configure/adderResponsibility/adderResponsibility";
import LoanFee from "./ui/pages/configure/loanFee/LoanFee";


function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to={ROUTES.COMMISSION_DASHBOARD} />
            ) : (
              <WelcomePage />
            )
          }
        />
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to={ROUTES.COMMISSION_DASHBOARD} />
            ) : (
              <LoginPage />
            )
          }
        />
        <Route path={ROUTES.RESETPASSWORD} element={<ResetPassword />} />
        <Route path={ROUTES.OTP} element={<EnterOtpScreen />} />
              <Route
              element={<MainLayout/>}
            >
           

                <Route  path={ROUTES.COMMISSION_DASHBOARD} element={<DashboardPage/>}/>
                <Route  path={ROUTES.REPPAY_DASHBOARD} element={<RepPayDashboardPage/>}/>
                <Route  path={ROUTES.CONFIG_COMMISSION_RATE} element={<CommissionRate/>}/>
                <Route  path={ROUTES.CONFIG_DEALER_OVER} element={<DealerOverRides/>}/>
                <Route  path={ROUTES.CONFIG_MARKETING} element={<MarketingFees/>}/>
                <Route  path={ROUTES.CONFIG_DEALER_TIER} element={<DealerTier/>}/>
                <Route  path={ROUTES.CONFIG_LOAN} element={<LoanType/>}/>
                <Route  path={ROUTES.CONFIG_SALE} element={<SaleType/>}/>
                <Route  path={ROUTES.CONFIG_ADDER} element={<AdderValidation/>}/>
                <Route  path={ROUTES.CONFIG_PAYMENT_SCHEDULE} element={<PaymentSchedule/>}/>
                <Route  path={ROUTES.CONFIG_TIER_LOAN_FEE} element={<TierLoanFee/>}/>
                <Route  path={ROUTES.CONFIG_TIMELINE} element={<TimeLine/>}/>
                <Route  path={ROUTES.CONFIG_AUTO_ADDER} element={<AutoAdder/>}/>
                <Route  path={ROUTES.CONFIG_DEALER_CREDIT} element={<DealerCredit/>}/>
                <Route  path={ROUTES.CONFIG_REBET_DATA} element={<RebateData/>}/>
                <Route  path={ROUTES.CONFIG_REFERAL_DATA} element={<ReferalData/>}/>
                <Route  path={ROUTES.CONFIG_DLE_OTH_PAY} element={<DlrOthPay/>}/>
                <Route  path={ROUTES.CONFIG_NON_COMM_DLR_PAY} element={<NonCommDlrPay/>}/>
                <Route  path={ROUTES.CONFIG_LOAN_FEE} element={<LoanFeeAddr/>}/>
                <Route  path={ROUTES.USER_MANAEMENT} element={<UserManagement/>}/>
                <Route  path={ROUTES.ACCOUNT_SETTING} element={<AccountSettings/>}/>
                <Route  path={ROUTES.REPORT} element={<Report/>}/>
                <Route  path={ROUTES.PROJECT} element={<Project/>}/>
                <Route  path={ROUTES.DB_MANAGER_DASHBOARD} element={<DbManagerDashboard/>}/>
                <Route  path={ROUTES.DB_MANAGER_DATA_TABLE} element={<DataTablle/>}/>
                <Route  path={ROUTES.DB_MANAGER_USER_ACTIVITY} element={<UserActivity/>}/>
                <Route  path={ROUTES.TECHNICAL_SUPPORT} element={<TechnicalSupport/>}/>
                <Route  path={ROUTES.DB_MANAGER_WEB_HOOKS} element={<Webhook/>}/>
                <Route  path={ROUTES.CONFIG_PAGE} element={<ConfigurePage/>}/>
                <Route  path={ROUTES.CONFIG_REP_PAY_SETTINGS} element={<RepPaySettings/>}/>
                <Route path={ROUTES.CONFIG_RATE_ADJUSTMENTS} element = {<RateAdjustments/>}/>
                <Route path={ROUTES.CONFIG_AR} element = {<AR/>}/>
                <Route path={ROUTES.CONFIG_AR_SCHEDULE} element = {<ARSchedule/>}/>
                <Route path={ROUTES.CONFIG_INSTALL_COST} element = {<InstallCost/>}/>
                <Route path={ROUTES.CONFIG_LEADER_OVERRIDE} element = {<LeaderOverride/>}/>
                <Route path={ROUTES.CONFIG_ADDER_CREDITS} element = {<AdderCredit/>}/>
                <Route path={ROUTES.CONFIG_ADDER_RESPONSIBILITY} element = {<AdderResponsibility/>}/>
                <Route path={ROUTES.CONFIG_LOAN_FEES} element = {<LoanFee/>}/>
            </Route>
       
      </Routes>
    </BrowserRouter>
  );
}

export default App;
