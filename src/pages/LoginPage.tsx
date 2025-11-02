import React, { useState } from "react";
import "../App.css"; // for shared styles
import logo from "../assets/north-star-logo.jpg";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login attempted:", email, password);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <img src={logo} alt="North Star Logo" className="logo" />
        <h1 className="title">NORTH STAR</h1>
        <p className="subtitle">Cinema Management</p>

        <h2 className="form-title">Secure Login</h2>
        <form onSubmit={handleSubmit}>
          <label>Email / Username</label>
          <input
            type="email"
            placeholder="owner@northstar.fi"
            value={email}
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

          <button type="submit" className="btn-primary">Sign In</button>
        </form>

        <div className="demo-buttons">
          <button className="btn-secondary">Login as Owner</button>
          <button className="btn-secondary">Login as Staff</button>
        </div>

        <p className="footer-text">
          🔒 Secure authentication with role-based access (Owner, Management, Staff)
        </p>
      </div>
    </div>
  );
}
