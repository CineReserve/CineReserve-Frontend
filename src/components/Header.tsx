import logo from "../assets/north-star-logo.jpg";
import React from "react";

type Props = {
  onLogout?: () => void;
  role?: string;
};

export default function Header({ onLogout, role = "User" }: Props) {
  return (
    <header className="dashboard-header">
      <div className="header-left">
        <img src={logo} alt="North Star Logo" className="header-logo" />
        <div>
          <h2>North Star</h2>
          <p>Cinema Management</p>
        </div>
      </div>
      <div className="header-right">
        <span>{role} Access</span>
        <button className="logout-btn" onClick={onLogout}>Logout</button>
      </div>
    </header>
  );
}
