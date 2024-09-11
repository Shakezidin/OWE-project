/**
 * Created by Ankit Chuahan on 13/01/24
 * File Name: App.tsx
 * Product Name: WebStorm
 * Project Name: owe_web_app
 * Path: /
 */

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import ResetPassword from './ui/oweHub/resetPassword/ResetPassword';
import { LoginPage } from './ui/oweHub/login/LoginPage';
import MainLayout from './ui/components/layout/MainLayout';
import EnterOtpScreen from './ui/oweHub/otp/EnterOtpScreen';
import { useEffect } from 'react';
import { RootState } from './redux/store';
import { initializeAuth } from './redux/apiSlice/authSlice/authSlice';
import { DashboardPage } from './ui/oweHub/dashboard/DashboardPage';
import { ROUTES } from './routes/routes';
import CommissionRate from './ui/oweHub/configure/commissionRate/CommissionRate';
import DealerOverRides from './ui/oweHub/configure/dealerOverrides/DealerOverRides';
import MarketingFees from './ui/oweHub/configure/marketingFees/MarketingFees';
import DealerTier from './ui/oweHub/configure/dealerTier/DealerTier';
import LoanType from './ui/oweHub/configure/loanType/LoanType';
import SaleType from './ui/oweHub/configure/saleType/SaleType';
import AdderValidation from './ui/oweHub/configure/adderValidation/AdderValidation';
import PaymentSchedule from './ui/oweHub/configure/paymentValidation/PaymentSchedule';
import TierLoanFee from './ui/oweHub/configure/tierLoanfee/TierLoanFee';
import TimeLine from './ui/oweHub/configure/timeline/TimeLine';
import AutoAdder from './ui/oweHub/configure/autoAdder/AutoAdder';
import DealerCredit from './ui/oweHub/configure/dealerCredit/DealerCredit';
import RebateData from './ui/oweHub/configure/reabateData/RebateData';
import ReferalData from './ui/oweHub/configure/referalData/ReferalData';
import DlrOthPay from './ui/oweHub/configure/dlrOthPay/DlrOthPay';
import NonCommDlrPay from './ui/oweHub/configure/non_comm(dlrpay)/NonCommDlrPay';
import LoanFeeAddr from './ui/oweHub/configure/loanFeeAddr/LoanFeeAddr';
import UserManagement from './ui/oweHub/userManagement/UserManagement';
import AccountSettings from './ui/oweHub/accountSettings/AccountSettings';
import Report from './ui/oweHub/report/Report';
import TechnicalSupport from './ui/oweHub/technicalSupport/TechnicalSupport';
import DataTablle from './ui/oweHub/databaseManager/dataTable/DataTable';
import UserActivity from './ui/oweHub/databaseManager/userActivity/UserActivity';
import DbManagerDashboard from './ui/oweHub/databaseManager/dbManagerDashboard/DbManagerDashboard';
import Webhook from './ui/oweHub/databaseManager/webhookTable/Webhook';
import ConfigurePage from './ui/oweHub/configure/ConfigurePage';
import { RepPayDashboardPage } from './ui/oweHub/reppay/reppaydashboard/reppaydashboard';
import RepPaySettings from './ui/oweHub/configure/repPaySettings/RepPaySettings';
import RateAdjustments from './ui/oweHub/configure/rateAdjustments/RateAdjustments';
import ARSchedule from './ui/oweHub/configure/ARSchedule/ARSchedule';
import AR from './ui/oweHub/configure/AR/Ar';
import InstallCost from './ui/oweHub/configure/installCost/installCost';
import LeaderOverride from './ui/oweHub/configure/leaderOverride/LeaderOverride';
import AdderCredit from './ui/oweHub/configure/adderCredit/AdderCredit';
import AdderResponsibility from './ui/oweHub/configure/adderResponsibility/adderResponsibility';
import LoanFee from './ui/oweHub/configure/loanFee/LoanFee';
import ProjectPerformence from './ui/oweHub/projectTracker/ProjectPerformence';
import ProjectStatus from './ui/oweHub/projectTracker/ProjectStatus';
import ArImport from './ui/oweHub/configure/arImport/ArImport';
import Adjustments from './ui/oweHub/configure/Adjustments/Adjustments';
import Reconcile from './ui/oweHub/configure/Reconcile/Reconcile';
import ApptSetters from './ui/oweHub/configure/apptSetters/ApptSetters';
import { ARDashboardPage } from './ui/oweHub/ar/ardashboard/ardashboard';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { TYPE_OF_USER } from './resources/static_data/Constant';
import Slack from './ui/pages/configure/slack/slack';
import AdderData from './ui/oweHub/configure/adderData/AdderData';
import ApRep from './ui/oweHub/configure/apRep/ApRep';
import BatteryBackup from './ui/batterBackupCalculator';
import BatteryAmp from './ui/batterBackupCalculator/components/BatteryAmp';
import SrImageUpload from './ui/batterBackupCalculator/SrImageUpload/SrImageUpload';
import Dba from './ui/oweHub/configure/dba/dba';
import RepCredit from './ui/oweHub/configure/REP CREDIT/repcredit';
import RepStatus from './ui/oweHub/configure/repstatus/repstatus';
import NotFound from './ui/oweHub/noRecordFound/NotFound';
import RepIncent from './ui/oweHub/configure/repIncent/RepIncent';
import ApAdv from './ui/oweHub/configure/apAdv/ApAdv';
import ApDed from './ui/oweHub/configure/apDed/ApDed';
import ApOth from './ui/oweHub/configure/apOth/ApOth';
import ApPda from './ui/oweHub/configure/apPda/ApPda';
import TeamManagement from './ui/oweHub/teammanagement/dashboard';
import TeamTable from './ui/oweHub/teammanagement/teamtable';
import Leaderboard from './ui/leaderboard';
import Scheduler from './ui/scheduler';
import ScheduleDetail from './ui/scheduler/ScheduleDetail';
import CustomersList from './ui/scheduler/SalesRepScheduler/CustomersList';
import AddNew from './ui/scheduler/SalesRepScheduler/AddNew';
import SchedulerBar from './ui/scheduler/SalesRepScheduler/SchedulerBar/SchedulerBar';
import Calendar from './ui/Calendar/PerformanceCalendar';
import PendingQueue from './ui/oweHub/pendingQueue';

function App() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, role_name } = useAppSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

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
        <Route path={ROUTES.CONFIG_SLACK} element={<Slack />} />
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
                    ? ROUTES.PEINDING_QUEUE
                    : ROUTES.PEINDING_QUEUE
                }
              />
            ) : (
              // <WelcomePage />
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to={ROUTES.PEINDING_QUEUE} />
            ) : (
              <LoginPage />
            )
          }
        />

        <Route path={ROUTES.RESETPASSWORD} element={<ResetPassword />} />
        <Route path={ROUTES.OTP} element={<EnterOtpScreen />} />
        <Route element={<MainLayout />}>
          <Route path={ROUTES.LEADERBOARD} element={<Leaderboard />} />
          <Route path={ROUTES.ACCOUNT_SETTING} element={<AccountSettings />} />
          {(role_name === TYPE_OF_USER.ADMIN ||
            role_name === TYPE_OF_USER.DEALER_OWNER) &&
            configAndUserManagementRoutes()}

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
          <Route path={ROUTES.PEINDING_QUEUE} element={<PendingQueue />} />
          <Route path={ROUTES.CALENDAR} element={<Calendar />} />

          <Route
            path={ROUTES.TECHNICAL_SUPPORT}
            element={<TechnicalSupport />}
          />
          <Route path={ROUTES.SCHEDULER} element={<Scheduler />} />
          <Route path={ROUTES.SCHEDULE_DETAIL} element={<ScheduleDetail />} />
          <Route
            path={ROUTES.SALES_REP_SCHEDULER}
            element={<CustomersList />}
          />
          <Route
            path={ROUTES.SCHEDULE_SALES_REP_SURVEY}
            element={<SchedulerBar />}
          />
          <Route path={ROUTES.ADD_NEW_SALES} element={<AddNew />} />
          <Route
            path={ROUTES.TEAM_MANAGEMENT_DASHBOARD}
            element={<TeamManagement />}
          />
          <Route path={ROUTES.TEAM_MANAGEMENT_TABLE} element={<TeamTable />} />
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
