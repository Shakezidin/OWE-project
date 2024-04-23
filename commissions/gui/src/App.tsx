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
              <Navigate to={"/commission/dashboard"} />
            ) : (
              <WelcomePage />
            )
          }
        />
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to={"/commission/dashboard"} />
            ) : (
              <LoginPage />
            )
          }
        />
        <Route path="/resetPassword" element={<ResetPassword />} />
        <Route path="/otp" element={<EnterOtpScreen />} />
              <Route
              element={<MainLayout/>}
            >
           
                <Route  path={ROUTES.commissiondash} element={<DashboardPage/>}/>
                <Route  path={ROUTES.commissionrate} element={<CommissionRate/>}/>
                <Route  path={ROUTES.dealerOverRoutes} element={<DealerOverRides/>}/>
                <Route  path={ROUTES.marketingRoutes} element={<MarketingFees/>}/>
                <Route  path={ROUTES.dealerTierRoutes} element={<DealerTier/>}/>
                <Route  path={ROUTES.loanRoutes} element={<LoanType/>}/>
                <Route  path={ROUTES.saleRoutes} element={<SaleType/>}/>
                <Route  path={ROUTES.adderRoutes} element={<AdderValidation/>}/>
                <Route  path={ROUTES.paymentSchRoutes} element={<PaymentSchedule/>}/>
                <Route  path={ROUTES.tierLoanFeeRoutes} element={<TierLoanFee/>}/>
                <Route  path={ROUTES.timelineRoutes} element={<TimeLine/>}/>
                <Route  path={ROUTES.autoadderRoutes} element={<AutoAdder/>}/>
                <Route  path={ROUTES.dealerCreditRoutes} element={<DealerCredit/>}/>
                <Route  path={ROUTES.rebetDataRoutes} element={<RebateData/>}/>
                <Route  path={ROUTES.referalDataRoutes} element={<ReferalData/>}/>
                <Route  path={ROUTES.dlrOthRoutes} element={<DlrOthPay/>}/>
                <Route  path={ROUTES.nonCommRoutes} element={<NonCommDlrPay/>}/>
                <Route  path={ROUTES.loanFeeRoutes} element={<LoanFeeAddr/>}/>
                <Route  path={ROUTES.usermgtRoutes} element={<UserManagement/>}/>
                <Route  path={ROUTES.accountSettingRoutes} element={<AccountSettings/>}/>
                <Route  path={ROUTES.reportRoutes} element={<Report/>}/>
                <Route  path={ROUTES.projectRoutes} element={<Project/>}/>
                <Route  path={ROUTES.dbDashRoutes} element={<DbManagerDashboard/>}/>
                <Route  path={ROUTES.dataTableRoutes} element={<DataTablle/>}/>
                <Route  path={ROUTES.userActivityRoutes} element={<UserActivity/>}/>
                <Route  path={ROUTES.technicalSupportRoutes} element={<TechnicalSupport/>}/>
                <Route  path={ROUTES.webhookRoutes} element={<Webhook/>}/>
            </Route>
      
       
      </Routes>
    </BrowserRouter>
  );
}

export default App;
