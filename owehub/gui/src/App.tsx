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
import { ROUTES } from './routes/routes';
import DealerOverRides from './ui/oweHub/configure/dealerOverrides/DealerOverRides';
import DealerCredit from './ui/oweHub/configure/dealerCredit/DealerCredit';
import AccountSettings from './ui/oweHub/accountSettings/AccountSettings';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { TYPE_OF_USER } from './resources/static_data/Constant';
import Slack from './ui/pages/configure/slack/slack';
import BatteryBackup from './ui/batterBackupCalculator';
import BatteryAmp from './ui/batterBackupCalculator/components/BatteryAmp';
import SrImageUpload from './ui/batterBackupCalculator/SrImageUpload/SrImageUpload';
import NotFound from './ui/oweHub/noRecordFound/NotFound';
import Scheduler from './ui/scheduler';
import ScheduleDetail from './ui/scheduler/ScheduleDetail';
import CustomersList from './ui/scheduler/SalesRepScheduler/CustomersList';
import AddNew from './ui/scheduler/SalesRepScheduler/AddNew';
import SchedulerBar from './ui/scheduler/SalesRepScheduler/SchedulerBar/SchedulerBar';
import LeadManagementDashboard from './ui/leadmanagement/LeadManagementDashboard';
import LeadManagementNew from './ui/leadmanagement/LeadManagementNew';
import RoutesForRole from './utiles/RoutesForRole';
import LeradManagementHistory from './ui/leadmanagement/LeadManagementHistory';
import LibraryHomepage from './ui/Library/LibraryHomepage';
import LeadManamentSucessModel from './ui/leadmanagement/Modals/LeaderManamentSucessModel';
import MyMap from './ui/oweHub/projectTracker/addressMap/MyMap';
import SaleRepCustomerForm from './ui/scheduler/SaleRepCustomerForm/SaleRepCustomerForm';
import ArchivedPages from './ui/leadmanagement/ArchievedPages';
import DealerPayments from './ui/oweHub/configure/dealerPayments/DealerPayments';
import FinanceSchedule from './ui/oweHub/configure/financeSchedule/financeSchedule';
import SalesPartnerSchedule from './ui/oweHub/configure/salesPartnerPaySchedule/SalesPartnerSchedule';
import FolderDetail from './ui/Library/FolderDetail/FolderDetail';
import RecycleBin from './ui/Library/RecycleBin/RecycleBin';
import FinanceTypes from './ui/oweHub/configure/financeTypes/FinanceTypes';
import SsOnboarding from './ui/oweHub/configure/SS-Onboarding/SsOnboarding';
import LoanCalculator from './ui/oweHub/calculator/Calculator';
// import TotalCount from './ui/TotalCount/TotalCount';
import Production from './ui/reporting/Production/Production';
import Quality from './ui/reporting/Quality';
import SpeedOverall from './ui/reporting/SpeedOverall';
import SalesToInstall from './ui/reporting/SalesToInstall';
import ReasonOfIncomplete from './ui/reporting/ReasonOfIncomplete';
import QualityPerOffice from './ui/reporting/QualityPerOffice';
import ReportingLayout from './ui/reporting/ReportingLayout';
import CompletionsPerOffice from './ui/reporting/pvInstall/completionsPerOffice';
import CompletionsPerTeams from './ui/reporting/pvInstall/completionsPerTeam';
import NoPto from './ui/reporting/NoPto';
import Timelines from './ui/reporting/pvInstall/timelines';
import OverAll from './ui/reporting/Overall/OverAll';
import Dashboard from './ui/reporting/Dashboard';
// import InstalltoFin from './ui/reporting/InstallToFIN';
import Ahj from './ui/reporting/Ahj/Ahj';
import PermitRedLine from './ui/reporting/Permit_Redline/PermitRedLine';
import CompletedFirstTime from './ui/reporting/CompletedFirstTime';
// import DynDashboard from './ui/reporting/DynamicReports/DynDashboard';
import Summary_Dashboard from './ui/reporting/Summary-Dashboard/Summary_Dashboard';
import DatTool from './ui/DatTool/DatTool';
import DealerTablePipeline from './ui/oweHub/projectTracker/DealerTable';
import { useDBStatusMonitor } from './hooks/useDBStatusMonitor';

function App() {
  // Add console log suppression at the start of App component
  if (
    process.env.NODE_ENV === 'production' ||
    process.env.NODE_ENV === 'development'
  ) {
    console.log = () => {};
    console.error = () => {};
    console.warn = () => {};
  }

  const dispatch = useAppDispatch();
  const { isAuthenticated, role_name } = useAppSelector(
    (state: RootState) => state.auth
  );
  const isStaging = process.env.REACT_APP_ENV;
  const { dbStatus } = useDBStatusMonitor();

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  /** Create route for config */
  const getConfigChildRoute = () => {
    return [
      { path: ROUTES.CONFIG_DEALER_OVER, element: <DealerOverRides /> },
      { path: ROUTES.CONFIG_DEALER_CREDIT, element: <DealerCredit /> },
      { path: ROUTES.CONFIG_SLACK, element: <Slack /> },
      { path: ROUTES.CONFIG_DEALERPAYMENTS, element: <DealerPayments /> },
      { path: ROUTES.CONFIG_FINANCE_SCHEDULE, element: <FinanceSchedule /> },
      {
        path: ROUTES.CONFIG_SALES_PARTNER_PAY,
        element: <SalesPartnerSchedule />,
      },
      { path: ROUTES.CONFIG_FINANCE_TYPES, element: <FinanceTypes /> },
      { path: ROUTES.SS_ONBOARDING, element: <SsOnboarding /> },
    ];
  };

  /** Create route with role based */
  const ManageRoutesWithRole = (role: string) => {
    const routes = RoutesForRole.filter(
      (route) =>
        route.available.includes(role) &&
        (route.stagingOnly ? isStaging === 'staging' : true)
    );
    const availableRoutes = routes.map((route) => (
      <Route key={route.route} path={route.route} element={<route.element />} />
    ));
    if (RoutesForRole.some((route) => route.route === ROUTES.CONFIG_PAGE)) {
      const childRoutes = getConfigChildRoute().map((route) => (
        <Route key={route.path} path={route.path} element={route.element} />
      ));
      availableRoutes.push(...childRoutes);
    }
    return availableRoutes;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to={ROUTES.PEINDING_QUEUE} />
            ) : (
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
              <LoginPage dbStatus={dbStatus} />
            )
          }
        />

        <Route path={ROUTES.RESETPASSWORD} element={<ResetPassword />} />
        <Route path={ROUTES.OTP} element={<EnterOtpScreen />} />
        <Route element={<MainLayout dbStatus={dbStatus} />}>
          <Route path={ROUTES.ACCOUNT_SETTING} element={<AccountSettings />} />
          <Route path={ROUTES.MAP_ADDRESS} element={<MyMap />} />
          <Route path={ROUTES.CALCULATOR} element={<LoanCalculator />} />

          {/* reporting */}
          {/* <Route path={ROUTES.REPORTING} element={<ReportingLayout />}>
            <Route path={''} element={<Dashboard />} />
            <Route
              path={ROUTES.REPORTING_PRODUCTION}
              element={<Production />}
            />
            <Route path={ROUTES.REPORTING_QUALITY} element={<Quality />} />
            <Route
              path={ROUTES.REPORTING_SPEED_OVERALL}
              element={<SpeedOverall />}
            />

            <Route
              path={ROUTES.REPORTING_SALES_TO_INSTALL}
              element={<SalesToInstall />}
            />
            <Route
              path={ROUTES.REPORTING_QUALITY_PER_OFFICE}
              element={<QualityPerOffice />}
            />
            <Route
              path={ROUTES.PERMIT_REDLINE}
              element={<PermitRedLine />}
            />
            <Route
              path={ROUTES.DYNAMIC_REPORT}
              element={<DynDashboard />}
            />
            <Route
              path={ROUTES.REPORTING_REASON_FOR_INCOMPLETE}
              element={<ReasonOfIncomplete />}
            />
            <Route
              path={ROUTES.COMPLETIONS_PER_OFFICE}
              element={<CompletionsPerOffice />}
            />
            <Route
              path={ROUTES.COMPLETIONS_PER_TEAM}
              element={<CompletionsPerTeams />}
            />
            <Route path={ROUTES.TOTAL_COUNT} element={<TotalCount />} />
            <Route path={ROUTES.NO_PTO} element={<NoPto />} />
            <Route path={ROUTES.TIMELINES} element={<Timelines />} />
 
            <Route path={ROUTES.SITE_COMPLETION} element={<Timelines />} />
            <Route path={ROUTES.SITE_OUTSIDE_SLA} element={<Timelines />} />
            <Route path={ROUTES.SITE_TIMELINES} element={<Timelines />} />
            <Route
              path={ROUTES.FIRST_TIME_COMPLETIONS}
              element={<CompletedFirstTime />}
            />
            <Route
              path={ROUTES.REPORTING_SPEED_OVERALL}
              element={<OverAll />}
            />
            <Route path={ROUTES.INSTALL_TO_FIN} element={<InstalltoFin />} />

            <Route path={ROUTES.AHJ} element={<Ahj />} />
          </Route> */}

          {ManageRoutesWithRole(role_name!)}

          <Route path={ROUTES.LIBRARY} element={<LibraryHomepage />} />
          <Route path={ROUTES.LIBRARY_RECYCLE_BIN} element={<RecycleBin />} />
          <Route path={ROUTES.FOLDER_DETAIL} element={<FolderDetail />} />

          <Route path={ROUTES.SCHEDULER} element={<Scheduler />} />
          <Route path={ROUTES.SCHEDULE_DETAIL} element={<ScheduleDetail />} />
          <Route
            path={ROUTES.SALES_REP_SCHEDULER}
            element={<CustomersList />}
          />
          <Route
            path={ROUTES.LEAD_MANAGEMENT}
            element={<LeadManagementDashboard />}
          />
          <Route
            path={ROUTES.LEAD_MANAGEMENT_ADD_NEW}
            element={<LeadManagementNew />}
          />
          <Route
            path={ROUTES.LEAD_MANAGEMENT_HISTORY}
            element={<LeradManagementHistory />}
          />
          <Route
            path={ROUTES.LEAD_MANAGEMENT_ARCHIVES}
            element={<ArchivedPages />}
          />
          <Route
            path={ROUTES.SCHEDULE_SALES_REP_SURVEY}
            element={<SchedulerBar />}
          />
          {/* <Route
            path={ROUTES.SUMMARY_DASBOARD}
            element={<Summary_Dashboard />}
          />
          <Route path={ROUTES.SUMMARY_DASBOARD} element={<Summary_Dashboard />} /> */}
          <Route path={ROUTES.DAT_TOOL} element={<DatTool />} />
          <Route
            path={ROUTES.DEALERDATA_PIPELINE}
            element={<DealerTablePipeline />}
          />

          <Route path={ROUTES.ADD_NEW_SALES} element={<AddNew />} />
        </Route>
        <Route path={ROUTES.BATTERY_BACK_UP} element={<BatteryBackup />} />
        <Route
          path={ROUTES.SALE_RP_CUSTOMER_FORM}
          element={<SaleRepCustomerForm />}
        />
        <Route path={ROUTES.BATTERY_UI_GENRATOR} element={<BatteryAmp />} />
        <Route path={ROUTES.SR_IMAGE_UPLOAD} element={<SrImageUpload />} />
        <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
