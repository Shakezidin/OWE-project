/**
 * Created by satishazad on 13/01/24
 * File Name: Store
 * Product Name: WebStorm
 * Project Name: owe_web_app
 * Path: src/redux/store
 */

import {configureStore} from "@reduxjs/toolkit";
import rootReducer from "./RootReducer";


const store = configureStore({
    reducer: rootReducer,
    // middleware: [thunk]
})

export default store;
