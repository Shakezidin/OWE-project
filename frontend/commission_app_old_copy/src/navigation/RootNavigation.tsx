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
import {useAuthData} from "../redux/context/AuthWrapper";


export const RenderRoutes = () => {

    const { auth } = useAuthData();
    let isAuthenticated = auth?.accessToken && auth.accessToken.length > 0;
    console.log('AUTH Render Route');

    return (
        <Routes>
            {NavigationRoutes.map((route: NavigationRouteModel, index: number) => {
                if (route.isPrivate && isAuthenticated) {
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
