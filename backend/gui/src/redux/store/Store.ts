/**
 * Created by satishazad on 13/01/24
 * File Name: Store
 * Product Name: WebStorm
 * Project Name: owe_web_app
 * Path: src/redux/store
 */

import {configureStore} from "@reduxjs/toolkit";
import createStore from "react-auth-kit/createStore";
import rootReducer from "./RootReducer";


/**
 * Auth Store: created by Auth-Store-Kit
 * */
export const authStore = createStore<object>({
    authName: '_auth',
    authType: 'localstorage',
    cookieDomain: window.location.hostname,
    cookieSecure: window.location.protocol === 'https:'
});


/**
 * App Store: Global State Management
 * */
export const store = configureStore({
    reducer: rootReducer,
    // middleware: [thunk]
})

