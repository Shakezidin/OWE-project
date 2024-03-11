/**
 * Created by satishazad on 13/01/24
 * File Name: NavigationRoutes
 * Product Name: WebStorm
 * Project Name: owe_web_app
 * Path: src/navigation
 */

import React from "react";
import { HomePage } from "../ui/pages/home/HomePage";
import { LoginPage } from "../ui/pages/login/LoginPage";
import { WelcomePage } from "../ui/pages/welcome/WelcomePage";
import { ROUTES } from "./Routes";
import ResetPassword from "../ui/pages/resetPassword/ResetPassword";
import EnterOtpScreen from "../ui/pages/otp/EnterOtpScreen";
import SideDrawerPage from "../ui/pages/drawer/SideDrawerPage";

export interface NavigationRouteModel {
  name: string;
  path: string;
  isMenu: boolean;
  isPrivate: boolean;
  element: React.ReactNode | null;
}

export const NavigationRoutes: NavigationRouteModel[] = [
  {
    name: "Welcome",
    path: "/",
    isMenu: true,
    isPrivate: false,
    element: <WelcomePage />,
  },
  {
    name: "Login",
    path: "/login",
    isMenu: true,
    isPrivate: false,
    element: <LoginPage />,
  },
 
  {
    name: "Reset Password",
    path: ROUTES.RESET_PASSWORD,
    isMenu: true,
    isPrivate: false,
    element: <ResetPassword />,
  },
  {
    name: "OTP Screen",
    path: ROUTES.ENTER_OTP,
    isMenu: true,
    isPrivate: false,
    element: <EnterOtpScreen />,
  },
];
