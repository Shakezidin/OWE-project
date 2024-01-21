/**
 * Created by satishazad on 13/01/24
 * File Name: AuthWrapper
 * Product Name: VSCode
 * Project Name: owe_web_app
 * Path: src/auth/AuthWrapper
 */

import {createContext, useContext, useState} from "react";
import {AuthContextDataModel, AuthModel} from "../../core/models/api_models/AuthModel";
import {loginAPI} from "../../infrastructure/web_api/services/AuthService";
import {RenderRoutes} from "../../navigation/RootNavigation";


const AuthContext = createContext<AuthContextDataModel>({auth: null, login: undefined, logout: undefined});
export const useAuthData = () => useContext<AuthContextDataModel>(AuthContext);


export const AuthWrapper = () => {

    const [auth, setAuth] = useState<AuthModel | null>(null);

    //Login
    const login = async (username: string, password: string) => {

        // Make a call to the authentication API to check the username
        let auth = await loginAPI({ username, password });
        setAuth(auth);
        //ToDo:- Set Data in cookies
    }


    //Logout
    const logout = async () => {
        setAuth(null);
        //ToDo:- Clear from cookies
    }


    return (
        <AuthContext.Provider value={{ auth, login, logout }}>
            <>
                <RenderRoutes/>
            </>
        </AuthContext.Provider>
    )
}

