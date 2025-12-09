import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import DashboardCard from "../../components/DashboardCard";
import "../../styles/dashboard.css";


type Props = {
  setToken: (t: string | null) => void;
  setRole: (r: string | null) => void;
};


export default function StaffDashboardPage({ setToken, setRole }: Props) {
    const navigate = useNavigate();

  const handleLogout = () => {
    setToken(null);
    setRole(null);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      <Header onLogout={handleLogout}role="Staff"/>

      <div className="cards-row">
        <DashboardCard
          title="Total Theaters"
          value="3"
          subtitle="3 Cities"
          color="#00b5e2"
        />
        <DashboardCard
          title="Auditoriums"
          value="9"
          subtitle="Across all venues"
          color="#009c8c"
        />
        <DashboardCard
          title="Total Seats"
          value="1154"
          subtitle="Available capacity"
          color="#3b82f6"
        />
        <DashboardCard
          title="Active Shows"
          value="24"
          subtitle="This week"
          color="#7e57c2"
        />
      </div>

     <div className="quick-actions-container">
  <h3 className="quick-actions-title">Quick Actions</h3>

  <div className="quick-actions-buttons">
    <button className="quick-btn" onClick={() => navigate("/theaters")}>Theaters</button>
    <button className="quick-btn" onClick={() => navigate("/movies")}>Movies</button>
    <button className="quick-btn" onClick={() => navigate("/schedule-management")}>Schedule Shows</button>
        </div>
     
    </div>
    </div>
  );
}