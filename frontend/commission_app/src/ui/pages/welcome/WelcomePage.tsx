/**
 * Created by satishazad on 13/01/24
 * File Name: WelcomePage
 * Product Name: WebStorm
 * Project Name: owe_web_app
 * Path: src/ui/pages/welcome
 */


import React  from "react";
import {useNavigate} from 'react-router-dom';


export const WelcomePage = () => {

    const navigate = useNavigate();

    return (
        <div>
            <h1>Welcome App Page</h1>
            <button onClick={() => {
                navigate('/login');
            }}>Click Me</button>
        </div>
    );
}

export default WelcomePage;
