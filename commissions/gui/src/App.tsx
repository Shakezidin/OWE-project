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
import { routes } from "./routes";
import MainLayout from "./ui/components/layout/MainLayout";
import EnterOtpScreen from "./ui/pages/otp/EnterOtpScreen";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./redux/store";
import { initializeAuth } from "./redux/apiSlice/authSlice/authSlice";

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
            isAuthenticated ? <Navigate to={"/dashboard"} /> : <WelcomePage />
          }
        />
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to={"/dashboard"} /> : <LoginPage />
          }
        />
        <Route path="/resetPassword" element={<ResetPassword />} />
        <Route path="/otp" element={<EnterOtpScreen />} />
        <Route path="/dashboard" element={<MainLayout />}>
          {routes}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
