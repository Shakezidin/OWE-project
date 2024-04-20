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
import { routes } from "./routes/routes";
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
           
                <Route  path={routes.commissiondash} element={<DashboardPage/>}/>
                <Route  path={routes.commissionrate} element={<CommissionRate/>}/>
                <Route  path={routes.dealerOverRoutes} element={<DealerOverRides/>}/>
                <Route  path={routes.marketingRoutes} element={<MarketingFees/>}/>
                <Route  path={routes.dealerTierRoutes} element={<DealerTier/>}/>
                <Route  path={routes.loanRoutes} element={<LoanType/>}/>
                <Route  path={routes.saleRoutes} element={<SaleType/>}/>
                <Route  path={routes.adderRoutes} element={<AdderValidation/>}/>
                <Route  path={routes.paymentSchRoutes} element={<PaymentSchedule/>}/>
                <Route  path={routes.tierLoanFeeRoutes} element={<TierLoanFee/>}/>
                <Route  path={routes.timelineRoutes} element={<TimeLine/>}/>
                <Route  path={routes.autoadderRoutes} element={<AutoAdder/>}/>
                <Route  path={routes.dealerCreditRoutes} element={<DealerCredit/>}/>
                <Route  path={routes.rebetDataRoutes} element={<RebateData/>}/>
                <Route  path={routes.referalDataRoutes} element={<ReferalData/>}/>
                <Route  path={routes.dlrOthRoutes} element={<DlrOthPay/>}/>
                <Route  path={routes.nonCommRoutes} element={<NonCommDlrPay/>}/>
                <Route  path={routes.loanFeeRoutes} element={<LoanFeeAddr/>}/>
                <Route  path={routes.usermgtRoutes} element={<UserManagement/>}/>
                <Route  path={routes.accountSettingRoutes} element={<AccountSettings/>}/>
                <Route  path={routes.reportRoutes} element={<Report/>}/>
                <Route  path={routes.projectRoutes} element={<Project/>}/>
                <Route  path={routes.dbDashRoutes} element={<DbManagerDashboard/>}/>
                <Route  path={routes.dataTableRoutes} element={<DataTablle/>}/>
                <Route  path={routes.userActivityRoutes} element={<UserActivity/>}/>
                <Route  path={routes.technicalSupportRoutes} element={<TechnicalSupport/>}/>
                <Route  path={routes.webhookRoutes} element={<Webhook/>}/>
            </Route>
      
       
      </Routes>
    </BrowserRouter>
  );
}

export default App;
