/**
 * Created by satishazad on 13/01/24
 * File Name: App.tsx
 * Product Name: WebStorm
 * Project Name: owe_web_app
 * Path: /
 */

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Provider } from "react-redux";
import AuthProvider from "react-auth-kit";
import './App.css';
import {store, authStore} from "./redux/store/Store";
import {RenderRoutes} from "./navigation/RootNavigation";
import WelcomePage from './ui/pages/welcome/WelcomePage';
import { LoginPage } from './ui/pages/login/LoginPage';
import ResetPassword from './ui/pages/resetPassword/ResetPassword';
import EnterOtpScreen from './ui/pages/otp/EnterOtpScreen';
import { DashboardPage } from './ui/pages/dashboard/DashboardPage';
import ProtectedRoute from './navigation/ProtectedRoute';
import CommissionRate from './ui/pages/configure/commissionRate/CommissionRate';
import DealerOverRides from './ui/pages/configure/dealerOverrides/DealerOverRides';
import CommonConfigure from './ui/pages/configure/commonConfigure/CommonConfigure';
import MarketingFees from './ui/pages/configure/marketingFees/MarketingFees';


function App() {

    return (
    <div className="App">
        <AuthProvider store={authStore}>
            <Provider store={store}>
              <BrowserRouter>
                 <Routes>
                  <Route  path='/' element={<WelcomePage/>}/>
                  <Route  path='/login' element={<LoginPage/>}/>
                  <Route  path='/resetPassword' element={<ResetPassword/>}/>
                  <Route  path='/otp' element={<EnterOtpScreen/>}/>
                  <Route  path='/dashboard' element={<ProtectedRoute Children={<DashboardPage/>}/>} />
                  <Route  path='/configure/commission_rate' element={<ProtectedRoute Children={<CommissionRate/>}/>} />
    <Route  path='/configure/dealer_override' element={<ProtectedRoute Children={<DealerOverRides/>}/>} />
    <Route  path='/configure/common_configure' element={<ProtectedRoute Children={<CommonConfigure/>}/>} />
    <Route  path='/configure/marketing_fees' element={<ProtectedRoute Children={<MarketingFees/>}/>} />
                 </Routes>
              </BrowserRouter>
            </Provider>
        </AuthProvider>
    </div>
  );
}

export default App;
