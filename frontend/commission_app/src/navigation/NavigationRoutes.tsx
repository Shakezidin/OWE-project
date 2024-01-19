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
    name: "Home",
    path: "/home",
    isMenu: true,
    isPrivate: false,
    element: <HomePage />,
  },
  {
    name: "Reset Password",
    path: ROUTES.RESET_PASSWORD,
    isMenu: true,
    isPrivate: false,
    element: <ResetPassword />,
  },
];
