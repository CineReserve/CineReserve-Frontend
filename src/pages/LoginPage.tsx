import React, { useState } from "react";
import { useNavigate } from "react-router";
import "../App.css"; // for shared styles
import logo from "../assets/north-star-logo.jpg";
const API_URL = "http://localhost:3000";

export default function LoginPage() {
  const [userEmail, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!userEmail || !password) {
      //do i need to trim??
      setError("Please enter both email and password");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, password }),
      });

      const data = await response.json();

      if (response.ok) {
        //setToken(data.token), which is done below after checking result
        const result = data.result;
        const role = data.role;
        const message = data.message;

        if (result) {
          setToken(data.token);
          if (role === "Owner") navigate("/dashboard");
          else if (role === "Staff") navigate("/staff-dashboard");
        } else {
          setError(message);
        }
      } else if (response.status === 404) {
        setError("User not found. Please register first.");
      } else if (response.status === 401) {
        setError("Invalid password. Please try again.");
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (err) {
      setError("Network error. Make sure the backend is running on port 3000.");
      console.error(err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <img src={logo} alt="North Star Logo" className="logo" />
        <h1 className="title">NORTH STAR</h1>
        <p className="subtitle">Cinema Management</p>

        <h2 className="form-title">Secure Login</h2>
        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="email"
            placeholder="owner@northstar.fi"
            value={userEmail}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="remember-row">
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <a href="#" className="forgot-link">
              Forgot password?
            </a>
          </div>

          <button type="submit" className="btn-primary">
            Sign In
          </button>
        </form>

        <div className="demo-buttons">
          <button className="btn-secondary">Login as Owner</button>
          <button className="btn-secondary">Login as Staff</button>
        </div>

        <p className="footer-text">
          🔒 Secure authentication with role-based access (Owner, Management,
          Staff)
        </p>
      </div>
    </div>
  );
}
