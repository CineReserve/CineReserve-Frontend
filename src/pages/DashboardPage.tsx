import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import DashboardCard from "../components/DashboardCard";
import "../styles/global.css";
import "../styles/dashboard.css";

type Props = {
  setToken: (t: string | null) => void;
  setRole: (r: string | null) => void;
};


export default function DashboardPage({ setToken, setRole }: Props) {
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
      <Header onLogout={handleLogout} role="Owner"/>

      <div className="cards-row">
        <DashboardCard title="Total Theaters" value="3" subtitle="3 Cities" color="#00b5e2" />
        <DashboardCard title="Auditoriums" value="9" subtitle="Across all venues" color="#009c8c" />
        <DashboardCard title="Total Seats" value="1154" subtitle="Available capacity" color="#3b82f6" />
        <DashboardCard title="Active Shows" value="24" subtitle="This week" color="#7e57c2" />
      </div>

     

      <section className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="quick-grid">
           <button onClick={() => navigate("/theaters")}> Theaters</button>
          <button onClick={() => navigate("/movies")}> Movies</button>
          <button>Schedule Shows</button>
          <button onClick={() => navigate("/users")}>Manage Staff</button>
          <button>View Reports</button>
        </div>
      </section>
    </div>
  );
}
