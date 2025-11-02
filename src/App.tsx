import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";

function App() {
   return (
    <BrowserRouter>
      <Routes>
        {/* Default route → shows login */}
        <Route path="/" element={<LoginPage />} />

        {/* Dashboard route → shows admin dashboard */}
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  );
}


export default App;
