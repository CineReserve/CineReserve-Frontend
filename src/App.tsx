import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import StaffDashboardPage from "./pages/StaffDashboardPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

   const handleLogout = () => {
    setToken(null);
    setRole(null);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Login */}
        <Route
          path="/"
          element={<LoginPage setToken={setToken} setRole={setRole} />}
        />
        <Route
          path="/login"
          element={<LoginPage setToken={setToken} setRole={setRole} />}
        />

        {/* Owner dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute
              token={token}
              role={role}
              allowedRoles={["owner"]}
              setToken={setToken}
              setRole={setRole}
            >
              <DashboardPage setToken={setToken} setRole={setRole} />
            </ProtectedRoute>
          }
        />

        {/* Staff dashboard */}
        <Route
          path="/staff-dashboard"
          element={
            <ProtectedRoute
              token={token}
              role={role}
              allowedRoles={["staff"]}
              setToken={setToken}
               setRole={setRole}
            >
              <StaffDashboardPage setToken={setToken} setRole={setRole}/>
            </ProtectedRoute>
          }
        />

        {/* Unauthorized */}
        <Route
          path="/unauthorized"
          element={
            <div style={{ padding: "2rem", textAlign: "center" }}>
              <h2>🚫 Unauthorized</h2>
              <p>You do not have permission to access this page.</p>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
