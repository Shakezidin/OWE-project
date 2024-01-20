/**
 * Created by satishazad on 13/01/24
 * File Name: RootNavigation
 * Product Name: WebStorm
 * Project Name: owe_web_app
 * Path: src/navigation
 */

import { Link, Route, Routes } from 'react-router-dom';
import {NavigationRouteModel, NavigationRoutes} from "./NavigationRoutes";
import {LoginPage} from "../ui/pages/login/LoginPage";


export const RenderRoutes = () => {

    let user = { isAuthenticated: false };

    return (
        <Routes>
            {NavigationRoutes.map((route: NavigationRouteModel, index: number) => {
                if (route.isPrivate && user.isAuthenticated) {
                    return (<Route key={index} path={route.path} element={route.element} />)
                } else if (!route.isPrivate) {
                    return (<Route key={index} path={route.path} element={route.element} />)
                } else {
                    return false
                }
            })}
        </Routes>
    )
}
