/**
 * Created by satishazad on 13/01/24
 * File Name: LoginPage
 * Product Name: WebStorm
 * Project Name: owe_web_app
 * Path: src/ui/pages
 */

import React  from "react";
import {useNavigate} from "react-router-dom";


export const LoginPage = () => {
    const navigate = useNavigate();

    return (
        <div>
            <h1>Welcome to Login Page</h1>
            <button onClick={() => navigate('/home')}>Login</button>
        </div>
    );
}

