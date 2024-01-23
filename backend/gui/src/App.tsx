/**
 * Created by satishazad on 13/01/24
 * File Name: App.tsx
 * Product Name: WebStorm
 * Project Name: owe_web_app
 * Path: /
 */

import { BrowserRouter } from 'react-router-dom';
import { Provider } from "react-redux";
import AuthProvider from "react-auth-kit";
import './App.css';
import {store, authStore} from "./redux/store/Store";
import {RenderRoutes} from "./navigation/RootNavigation";


function App() {

    return (
    <div className="App">
        <AuthProvider store={authStore}>
            <Provider store={store}>
              <BrowserRouter>
                  <RenderRoutes/>
              </BrowserRouter>
            </Provider>
        </AuthProvider>
    </div>
  );
}

export default App;
