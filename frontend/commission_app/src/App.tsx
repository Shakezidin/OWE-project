/**
 * Created by satishazad on 13/01/24
 * File Name: App.tsx
 * Product Name: WebStorm
 * Project Name: owe_web_app
 * Path: /
 */

import { BrowserRouter } from 'react-router-dom';
import { Provider } from "react-redux";
import './App.css';
import {RenderRoutes} from "./navigation/RootNavigation";
import store from "./redux/store/Store";
import {AuthWrapper} from "./redux/context/AuthWrapper";


function App() {

    return (
    <div className="App">
      <Provider store={store}>
          <BrowserRouter>
              <AuthWrapper />
          </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;
