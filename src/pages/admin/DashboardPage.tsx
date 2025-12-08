import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import DashboardCard from "../../components/DashboardCard";
import "../../styles/global.css";
import "../../styles/dashboard.css";

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
const [stats, setStats] = useState({
  totalTheaters: 0,
  totalAuditoriums: 0,
  totalShows: 0,
  totalBookings: 0
});
useEffect(() => {
  async function loadStats() {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/dashboard/stats`
      );
      const data = await res.json();

      setStats({
        totalTheaters: data.totalTheaters,
        totalAuditoriums: data.totalAuditoriums,
        totalShows: data.totalShows,
        totalBookings: data.totalBookings,
      });
    } catch (err) {
      console.error("Dashboard stats load error:", err);
    }
  }

  loadStats();
}, []);


  return (
    <div className="dashboard-container">
      <Header onLogout={handleLogout} role="Owner"/>

      <div className="cards-row">
        <DashboardCard
  title="Total Theaters"
  value={stats.totalTheaters}
  subtitle="All Cities"
  color="#00b5e2"
/>

<DashboardCard
  title="Auditoriums"
  value={stats.totalAuditoriums}
  subtitle="Across all venues"
  color="#009c8c"
/>

<DashboardCard
  title="Active Shows"
  value={stats.totalShows}
  subtitle="Scheduled shows"
  color="#3b82f6"
/>

<DashboardCard
  title="Total Bookings"
  value={stats.totalBookings}
  subtitle="Completed bookings"
  color="#7e57c2"
/>

      </div>

     

      <div className="quick-actions-container">
  <h3 className="quick-actions-title">Quick Actions</h3>

  <div className="quick-actions-buttons">
    <button className="quick-btn" onClick={() => navigate("/theaters")}>Theaters</button>
    <button className="quick-btn" onClick={() => navigate("/movies")}>Movies</button>
    <button className="quick-btn" onClick={() => navigate("/schedule-management")}>Schedule Shows</button>
    <button className="quick-btn" onClick={() => navigate("/users")}>Manage Staff</button>
    <button className="quick-btn" onClick={() => navigate("/reports")}>View Reports</button>
   </div>
 </div>
</div> 
  );
}
