/**
 * Created by satishazad on 13/01/24
 * File Name: RootReducer
 * Product Name: WebStorm
 * Project Name: owe_web_app
 * Path: src/redux/store
 */
import {combineReducers} from "@reduxjs/toolkit";
import {RootReduxModel} from "../../core/models/state_models/RootReduxModel";
import welcomeReducer from "../../ui/pages/welcome/WelcomeReducer";


const appReducer = combineReducers<RootReduxModel>({
    welcome: welcomeReducer
});


const rootReducer = (state: any, action: any) => {
    if (action.type === 'USER_LOGOUT') {
        return appReducer(undefined, action as never);
    }
    return appReducer(state, action as never);
}


export default rootReducer;
