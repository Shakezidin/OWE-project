import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingScreen from "./screens/LandingScreen/LandingScreen";

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route exact path="/" element={<PublicRoute component={LandingScreen} />} />
      {/* <Route exact path="/dashboard" element={<ProtectedRoute component={DashboardScreen} />} /> */}
    </Routes>
  </BrowserRouter>
  );
}

export default App;
