import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Admin pages
import LoginPage from "./pages/admin/LoginPage";
import DashboardPage from "./pages/admin/DashboardPage";
import TheaterManagementPage from "./pages/admin/TheaterManagementPage";
import UserManagementPage from "./pages/admin/UserManagementPage";
import StaffDashboardPage from "./pages/admin/StaffDashboardPage";
import AuditoriumManagementPage from "./pages/admin/AuditoriumManagementPage";
import MovieManagementPage from "./pages/admin/MovieManagementPage";
import ScheduleManagementPage from "./pages/admin/ScheduleManagementPage";

// Customer pages
import HomePage from "./pages/customer/HomePage";
import BookingPage from "./pages/customer/BookingPage";
//import PaymentMethodPage from "./pages/customer/PaymentMethodPage";

// OLD PaymentPage becomes FINAL ticket page:
import FinalPaymentSummaryPage from "./pages/customer/FinalPaymentSummaryPage";

// New Stripe pages
import CheckoutPage from "./pages/customer/CheckoutPage";
import PaymentSuccessPage from "./pages/customer/PaymentSuccessPage"; //test

// Other components
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  // ===== Auth bridge for Cypress =====
  if (typeof window !== "undefined") {
    (window as any).__appSetToken = (t: string) => {
      setToken(t);
      (window as any).__authReady = true;
    };

    (window as any).__appSetRole = (r: string) => {
      setRole(r);
      (window as any).__authReady = true;
    };

    (window as any).__authReady = false;
  }

  React.useEffect(() => {
    (window as any).__setAuth = (t: string, r: string) => {
      setToken(t);
      setRole(r);
    };
  }, []);

  const handleLogout = () => {
    setToken(null);
    setRole(null);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* ⭐ PUBLIC CUSTOMER ROUTES */}
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />

        <Route path="/booking" element={<BookingPage />} />

        {/* ⭐ STRIPE PAYMENT ROUTES */}
        <Route path="/checkout" element={<CheckoutPage/>} />
        <Route path="/paymentSuccess" element={<PaymentSuccessPage />} />
        
        
        <Route
          path="/final-payment-summary"
          element={<FinalPaymentSummaryPage />}
        />

        {/* ⭐ AUTH ROUTES */}
        <Route
          path="/login"
          element={<LoginPage setToken={setToken} setRole={setRole} />}
        />

        {/* ⭐ OWNER ROUTES */}
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

        {/* ⭐ STAFF ROUTES */}
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
              <StaffDashboardPage setToken={setToken} setRole={setRole} />
            </ProtectedRoute>
          }
        />

        {/* ⭐ ADMIN CRUD ROUTES */}
        <Route
          path="/theaters"
          element={
            <ProtectedRoute
              token={token}
              role={role}
              allowedRoles={["owner", "staff"]}
              setToken={setToken}
              setRole={setRole}
            >
              <TheaterManagementPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/users"
          element={
            <ProtectedRoute
              token={token}
              role={role}
              allowedRoles={["owner"]}
              setToken={setToken}
              setRole={setRole}
            >
              <UserManagementPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/auditoriums/:theaterId"
          element={
            <ProtectedRoute
              token={token}
              role={role}
              allowedRoles={["owner", "staff"]}
              setToken={setToken}
              setRole={setRole}
            >
              <AuditoriumManagementPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/movies"
          element={
            <ProtectedRoute
              token={token}
              role={role}
              allowedRoles={["owner", "staff"]}
              setToken={setToken}
              setRole={setRole}
            >
              <MovieManagementPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/schedule-management"
          element={
            <ProtectedRoute
              token={token}
              role={role}
              allowedRoles={["owner", "staff"]}
              setToken={setToken}
              setRole={setRole}
            >
              <ScheduleManagementPage />
            </ProtectedRoute>
          }
        />

        {/* ⭐ UNAUTHORIZED */}
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
