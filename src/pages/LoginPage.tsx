import React, { useState } from "react";
import { useNavigate } from "react-router";
import "../styles/global.css";
import "../styles/login.css";
import logo from "../assets/north-star-logo.jpg";
const API_URL =
  "https://app-cinereserve-backend-cabmcgejecgjgcdu.swedencentral-01.azurewebsites.net";

type Props = {
  setToken: (t: string | null) => void;
  setRole: (r: string | null) => void;
};

export default function LoginPage({ setToken, setRole }: Props) {
  const [userEmail, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    const email = userEmail.trim();
    const pwd = password.trim();

    if (!email || !pwd) {
      setError("Please enter both email and password");
      setIsLoading(false);
      return;
    }
    //bring these down to check error msg
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: pwd }),
      });

      const data = await response.json();

      if (response.ok) {
        const result = data.result;
        //const role = data.role; //change the code to get role from user object
        const message = data.message;

        if (result) {
          const userRole = data.userRole; // Get role from user object
          setToken(data.token);
          setRole(userRole); //set role in App.tsx untill we implement seperate API for protectedRoute.tsx
          // Save both token & role to localStorage
          //localStorage.setItem("token", data.token);
          //localStorage.setItem("role", data.role);
          //console.log("Login successful. Role:", role);
          // Redirect based on role
          if (userRole === "owner") navigate("/dashboard");
          else if (userRole === "staff") navigate("/staff-dashboard");
          else navigate("/unauthorized");
        } else {
          setError(message || "Login failed. Please try again.");
        }
      } else {
        if (response.status === 401) {
          setError(data.message || "Invalid password. Please try again.");
        } else if (response.status === 404) {
          setError(data.message || "User not found. Please register first.");
        } else {
          setError(data.message || "Login failed. Please try again.");
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Network error. Please check your connection and try again.");
      //console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <img src={logo} alt="North Star Logo" className="logo" />
        <h1 className="title">NORTH STAR</h1>
        <p className="subtitle">Cinema Management</p>
        <h2 className="form-title">Secure Login</h2>

        {/* added by Amila to display error message*/}
        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit}>
          <label>Email</label>
          {/* change by Amila inside <input> below line--type=email to type="text"*/}
          <input
            type="text"
            placeholder="owner@northstar.fi"
            value={userEmail}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />

          <div className="remember-row">
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <a href="#" className="forgot-link">
              Forgot password?
            </a>
          </div>

          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>
        {/*<div className="demo-buttons">
          <button className="btn-secondary">Login as Owner</button>
          <button className="btn-secondary">Login as Staff</button>
        </div>*/}
        <p className="footer-text">
          🔒 Secure authentication with role-based access (Owner, Management,
          Staff)
        </p>
      </div>
    </div>
  );
}
