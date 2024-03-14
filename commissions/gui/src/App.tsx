/**
 * Created by satishazad on 13/01/24
 * File Name: App.tsx
 * Product Name: WebStorm
 * Project Name: owe_web_app
 * Path: /
 */


import { BrowserRouter, Route, Routes } from "react-router-dom";

import WelcomePage from "./ui/pages/welcome/WelcomePage";
import ResetPassword from "./ui/pages/resetPassword/ResetPassword";
import { LoginPage } from "./ui/pages/login/LoginPage";
import { routes } from "./routes";
import MainLayout from "./ui/components/layout/MainLayout";
import EnterOtpScreen from "./ui/pages/otp/EnterOtpScreen";


function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path='/' element={<WelcomePage/>} />
<Route path='/login' element={<LoginPage />} />
<Route path='/resetPassword' element={<ResetPassword />} />
<Route path='/otp' element={<EnterOtpScreen/>} />
        <Route path="/dashboard" element={<MainLayout />}>
          {routes}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
