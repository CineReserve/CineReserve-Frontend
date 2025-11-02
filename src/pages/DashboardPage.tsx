import Header from "../components/Header";
import DashboardCard from "../components/DashboardCard";

export default function DashboardPage() {
  return (
    <div className="dashboard-container">
      <Header />

      <div className="cards-row">
        <DashboardCard title="Total Theaters" value="3" subtitle="3 Cities" color="#00b5e2" />
        <DashboardCard title="Auditoriums" value="9" subtitle="Across all venues" color="#009c8c" />
        <DashboardCard title="Total Seats" value="1154" subtitle="Available capacity" color="#3b82f6" />
        <DashboardCard title="Active Shows" value="24" subtitle="This week" color="#7e57c2" />
      </div>

      <section className="theater-section">
        <h2>Theater Management</h2>
        <div className="theater-controls">
          <input type="text" placeholder="Search theaters..." />
          <button className="btn-add">+ Add Theater</button>
        </div>
      </section>

      <section className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="quick-grid">
          <button>Add Movie</button>
          <button>Schedule Shows</button>
          <button>Manage Staff</button>
          <button>View Reports</button>
        </div>
      </section>
    </div>
  );
}
