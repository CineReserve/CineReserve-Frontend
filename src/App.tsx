import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import TheaterManagementPage from "./pages/TheaterManagementPage";
import UserManagementPage from "./pages/UserManagementPage";

function App() {
   return (
    <BrowserRouter>
      <Routes>
        {/* Default route → shows login */}
        <Route path="/" element={<LoginPage />} />

        {/* Dashboard route → shows admin dashboard */}
        <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/theaters" element={<TheaterManagementPage />} />
        <Route path="/users" element={<UserManagementPage />} />
      </Routes>
    </BrowserRouter>
  );
}


export default App;
