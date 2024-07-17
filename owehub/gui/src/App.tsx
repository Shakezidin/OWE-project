/**
 * Created by satishazad on 13/01/24
 * File Name: App.tsx
 * Product Name: WebStorm
 * Project Name: owe_web_app
 * Path: /
 */

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import WelcomePage from './ui/pages/welcome/WelcomePage';
import ResetPassword from './ui/pages/resetPassword/ResetPassword';
import { LoginPage } from './ui/pages/login/LoginPage';

import MainLayout from './ui/components/layout/MainLayout';
import EnterOtpScreen from './ui/pages/otp/EnterOtpScreen';
import { useEffect } from 'react';
import { RootState } from './redux/store';
import { initializeAuth } from './redux/apiSlice/authSlice/authSlice';
import { DashboardPage } from './ui/pages/dashboard/DashboardPage';
import { ROUTES } from './routes/routes';
import CommissionRate from './ui/pages/configure/commissionRate/CommissionRate';
import DealerOverRides from './ui/pages/configure/dealerOverrides/DealerOverRides';
import MarketingFees from './ui/pages/configure/marketingFees/MarketingFees';
import DealerTier from './ui/pages/configure/dealerTier/DealerTier';
import LoanType from './ui/pages/configure/loanType/LoanType';
import SaleType from './ui/pages/configure/saleType/SaleType';
import AdderValidation from './ui/pages/configure/adderValidation/AdderValidation';
import PaymentSchedule from './ui/pages/configure/paymentValidation/PaymentSchedule';
import TierLoanFee from './ui/pages/configure/tierLoanfee/TierLoanFee';
import TimeLine from './ui/pages/configure/timeline/TimeLine';
import AutoAdder from './ui/pages/configure/autoAdder/AutoAdder';
import DealerCredit from './ui/pages/configure/dealerCredit/DealerCredit';
import RebateData from './ui/pages/configure/reabateData/RebateData';
import ReferalData from './ui/pages/configure/referalData/ReferalData';
import DlrOthPay from './ui/pages/configure/dlrOthPay/DlrOthPay';
import NonCommDlrPay from './ui/pages/configure/non_comm(dlrpay)/NonCommDlrPay';
import LoanFeeAddr from './ui/pages/configure/loanFeeAddr/LoanFeeAddr';
import UserManagement from './ui/pages/userManagement/UserManagement';
import AccountSettings from './ui/pages/accountSettings/AccountSettings';
import Report from './ui/pages/report/Report';
import TechnicalSupport from './ui/pages/technicalSupport/TechnicalSupport';
import DataTablle from './ui/pages/databaseManager/dataTable/DataTable';
import UserActivity from './ui/pages/databaseManager/userActivity/UserActivity';
import DbManagerDashboard from './ui/pages/databaseManager/dbManagerDashboard/DbManagerDashboard';
import Webhook from './ui/pages/databaseManager/webhookTable/Webhook';
import ConfigurePage from './ui/pages/configure/ConfigurePage';
import { RepPayDashboardPage } from './ui/pages/reppay/reppaydashboard/reppaydashboard';
import RepPaySettings from './ui/pages/configure/repPaySettings/RepPaySettings';
import RateAdjustments from './ui/pages/configure/rateAdjustments/RateAdjustments';
import ARSchedule from './ui/pages/configure/ARSchedule/ARSchedule';
import AR from './ui/pages/configure/AR/Ar';
import InstallCost from './ui/pages/configure/installCost/installCost';
import LeaderOverride from './ui/pages/configure/leaderOverride/LeaderOverride';
import AdderCredit from './ui/pages/configure/adderCredit/AdderCredit';
import AdderResponsibility from './ui/pages/configure/adderResponsibility/adderResponsibility';
import LoanFee from './ui/pages/configure/loanFee/LoanFee';
import ProjectPerformence from './ui/pages/projectTracker/ProjectPerformence';
import ProjectStatus from './ui/pages/projectTracker/ProjectStatus';
import ArImport from './ui/pages/configure/arImport/ArImport';
import Adjustments from './ui/pages/configure/Adjustments/Adjustments';
import Reconcile from './ui/pages/configure/Reconcile/Reconcile';
import ApptSetters from './ui/pages/configure/apptSetters/ApptSetters';
import { ARDashboardPage } from './ui/pages/ar/ardashboard/ardashboard';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { TYPE_OF_USER } from './resources/static_data/Constant';
import AdderData from './ui/pages/configure/adderData/AdderData';
import ApRep from './ui/pages/configure/apRep/ApRep';
import BatteryBackup from './ui/pages/batterBackupCalculator';
import BatteryAmp from './ui/pages/batterBackupCalculator/components/BatteryAmp';
import SrImageUpload from './ui/pages/SrImageUpload/SrImageUpload';
import Dba from './ui/pages/configure/dba/dba';
import RepCredit from './ui/pages/configure/REP CREDIT/repcredit';
import RepStatus from './ui/pages/configure/repstatus/repstatus';
import NotFound from './ui/pages/NotFound/NotFound';
import RepIncent from './ui/pages/configure/repIncent/RepIncent';
import ApAdv from './ui/pages/configure/apAdv/ApAdv';
import ApDed from './ui/pages/configure/apDed/ApDed';
import ApOth from './ui/pages/configure/apOth/ApOth';
import ApPda from './ui/pages/configure/apPda/ApPda';
import TeamManagement from './ui/pages/teammanagement/dashboard';
import TeamTable from './ui/pages/teammanagement/teamtable';
import Leaderboard from './ui/pages/leaderboard';

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);
  const { isAuthenticated, role_name } = useAppSelector(
    (state: RootState) => state.auth
  );

  /**config and user manangement routes*/
  const configAndUserManagementRoutes = () => {
    return (
      <Route>
        <Route
          path={ROUTES.CONFIG_COMMISSION_RATE}
          element={<CommissionRate />}
        />
        <Route path={ROUTES.CONFIG_DEALER_OVER} element={<DealerOverRides />} />
        <Route path={ROUTES.CONFIG_MARKETING} element={<MarketingFees />} />
        <Route path={ROUTES.CONFIG_DEALER_TIER} element={<DealerTier />} />
        <Route path={ROUTES.CONFIG_LOAN} element={<LoanType />} />
        <Route path={ROUTES.CONFIG_SALE} element={<SaleType />} />
        <Route path={ROUTES.CONFIG_ADDER} element={<AdderValidation />} />
        <Route
          path={ROUTES.CONFIG_PAYMENT_SCHEDULE}
          element={<PaymentSchedule />}
        />
        <Route path={ROUTES.CONFIG_TIER_LOAN_FEE} element={<TierLoanFee />} />
        <Route path={ROUTES.CONFIG_TIMELINE} element={<TimeLine />} />
        <Route path={ROUTES.CONFIG_AUTO_ADDER} element={<AutoAdder />} />
        <Route path={ROUTES.CONFIG_DEALER_CREDIT} element={<DealerCredit />} />
        <Route path={ROUTES.CONFIG_REBET_DATA} element={<RebateData />} />
        <Route path={ROUTES.CONFIG_REFERAL_DATA} element={<ReferalData />} />
        <Route path={ROUTES.CONFIG_DLE_OTH_PAY} element={<DlrOthPay />} />
        <Route
          path={ROUTES.CONFIG_NON_COMM_DLR_PAY}
          element={<NonCommDlrPay />}
        />
        <Route path={ROUTES.CONFIG_LOAN_FEE} element={<LoanFeeAddr />} />
        <Route path={ROUTES.CONFIG_PAGE} element={<ConfigurePage />} />
        <Route
          path={ROUTES.CONFIG_REP_PAY_SETTINGS}
          element={<RepPaySettings />}
        />
        <Route
          path={ROUTES.CONFIG_RATE_ADJUSTMENTS}
          element={<RateAdjustments />}
        />
        <Route path={ROUTES.CONFIG_AR} element={<AR />} />
        <Route path={ROUTES.CONFIG_AR_SCHEDULE} element={<ARSchedule />} />
        <Route path={ROUTES.CONFIG_INSTALL_COST} element={<InstallCost />} />
        <Route
          path={ROUTES.CONFIG_LEADER_OVERRIDE}
          element={<LeaderOverride />}
        />
        <Route path={ROUTES.CONFIG_ADDER_CREDITS} element={<AdderCredit />} />
        <Route
          path={ROUTES.CONFIG_ADDER_RESPONSIBILITY}
          element={<AdderResponsibility />}
        />
        <Route path={ROUTES.CONFIG_LOAN_FEES} element={<LoanFee />} />
        <Route path={ROUTES.CONFIG_AR_IMPORT} element={<ArImport />} />
        <Route path={ROUTES.CONFIG_ADJUSTMENTS} element={<Adjustments />} />
        <Route path={ROUTES.CONFIG_RECONCILE} element={<Reconcile />} />
        <Route path={ROUTES.CONFIG_APPSETTERS} element={<ApptSetters />} />
        <Route path={ROUTES.CONFIG_ADDERDATA} element={<AdderData />} />

        <Route path={ROUTES.USER_MANAEMENT} element={<UserManagement />} />
        <Route path={ROUTES.CONFIG_APREP} element={<ApRep />} />
        <Route path={ROUTES.CONFIG_DBA} element={<Dba />} />
        <Route path={ROUTES.CONFIG_REPCREDIT} element={<RepCredit />} />
        <Route path={ROUTES.CONFIG_REPSTATUS} element={<RepStatus />} />
        <Route path={ROUTES.CONFIG_REPINCENT} element={<RepIncent />} />
        <Route path={ROUTES.CONFIG_APADV} element={<ApAdv />} />
        <Route path={ROUTES.CONFIG_APDED} element={<ApDed />} />
        <Route path={ROUTES.CONFIG_APOTH} element={<ApOth />} />
        <Route path={ROUTES.CONFIG_APPDA} element={<ApPda />} />
      </Route>
    );
  };

  /** other routes */
  const otherRoutes = () => {
    return (
      <Route>
        <Route path={ROUTES.COMMISSION_DASHBOARD} element={<DashboardPage />} />
        <Route path={ROUTES.AR_DASHBOARD} element={<ARDashboardPage />} />
        <Route path={ROUTES.ACCOUNT_SETTING} element={<AccountSettings />} />
        <Route path={ROUTES.REPORT} element={<Report />} />
        <Route
          path={ROUTES.DB_MANAGER_DASHBOARD}
          element={<DbManagerDashboard />}
        />
        <Route path={ROUTES.DB_MANAGER_DATA_TABLE} element={<DataTablle />} />
        <Route
          path={ROUTES.DB_MANAGER_USER_ACTIVITY}
          element={<UserActivity />}
        />
        <Route path={ROUTES.DB_MANAGER_WEB_HOOKS} element={<Webhook />} />

        <Route
          path={ROUTES.REPPAY_DASHBOARD}
          element={<RepPayDashboardPage />}
        />
        <Route
          path={ROUTES.PROJECT_PERFORMANCE}
          element={<ProjectPerformence />}
        />
        <Route path={ROUTES.PROJECT_STATUS} element={<ProjectStatus />} />
      </Route>
    );
  };

  const managerRoutes = () => {
    return (
      <Route>
        <Route
          path={ROUTES.PROJECT_PERFORMANCE}
          element={<ProjectPerformence />}
        />
        <Route path={ROUTES.PROJECT_STATUS} element={<ProjectStatus />} />
        <Route
          path={ROUTES.REPPAY_DASHBOARD}
          element={<RepPayDashboardPage />}
        />
      </Route>
    );
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate
                to={
                  role_name === TYPE_OF_USER.DB_USER
                    ? ROUTES.DB_MANAGER_DASHBOARD
                    : ROUTES.PROJECT_PERFORMANCE
                }
              />
            ) : (
              <WelcomePage />
            )
          }
        />
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to={ROUTES.PROJECT_PERFORMANCE} />
            ) : (
              <LoginPage />
            )
          }
        />
        <Route path={ROUTES.RESETPASSWORD} element={<ResetPassword />} />
        <Route path={ROUTES.OTP} element={<EnterOtpScreen />} />
        <Route element={<MainLayout />}>
          {role_name === TYPE_OF_USER.ADMIN && configAndUserManagementRoutes()}

          {(role_name === TYPE_OF_USER.ADMIN ||
            role_name === TYPE_OF_USER.DEALER_OWNER ||
            role_name === TYPE_OF_USER.FINANCE_ADMIN ||
            role_name === TYPE_OF_USER.SUB_DEALER_OWNER ||
            role_name === TYPE_OF_USER.APPOINTMENT_SETTER ||
            role_name === TYPE_OF_USER.PARTNER) &&
            otherRoutes()}

          {(role_name === TYPE_OF_USER.SALES_REPRESENTATIVE ||
            role_name === TYPE_OF_USER.SALE_MANAGER ||
            role_name === TYPE_OF_USER.REGIONAL_MANGER) &&
            managerRoutes()}

          {role_name === TYPE_OF_USER.DB_USER && (
            <Route>
              <Route
                path={ROUTES.DB_MANAGER_DASHBOARD}
                element={<DbManagerDashboard />}
              />
              <Route
                path={ROUTES.DB_MANAGER_DATA_TABLE}
                element={<DataTablle />}
              />
              <Route
                path={ROUTES.DB_MANAGER_USER_ACTIVITY}
                element={<UserActivity />}
              />
              <Route path={ROUTES.DB_MANAGER_WEB_HOOKS} element={<Webhook />} />
            </Route>
          )}

          <Route
            path={ROUTES.TECHNICAL_SUPPORT}
            element={<TechnicalSupport />}
          />
          <Route
            path={ROUTES.TEAM_MANAGEMENT_DASHBOARD}
            element={<TeamManagement />}
          />
          <Route path={ROUTES.TEAM_MANAGEMENT_TABLE} element={<TeamTable />} />
          <Route path={ROUTES.LEADERBOARD} element={<Leaderboard />} />
        </Route>
        <Route path={ROUTES.BATTERY_BACK_UP} element={<BatteryBackup />} />
        <Route path={ROUTES.BATTERY_UI_GENRATOR} element={<BatteryAmp />} />
        <Route path={ROUTES.SR_IMAGE_UPLOAD} element={<SrImageUpload />} />
        <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
