import React, { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import "../../styles/reporting.css";
import { useNavigate } from "react-router-dom";


const metricData = {
  revenue: 125450.5,
  revenueChange: 12.5,
  bookings: 1234,
  bookingsChange: -3.2,
  tickets: 2856,
  ticketsChange: 8.7,
  occupancy: 68.5,
  occupancyChange: 5.3,
};

const ticketPieData = [
  { name: "Adult", value: 1999, color: "#b26bfb" },
  { name: "Child", value: 857, color: "#00b4d8" },
];

const theaterCards = [
  {
    theater: "Cinema Nova Oulu",
    revenue: "€45,200",
    bookings: 1052,
    occupancy: "78%",
    trend: "up",
  },
  {
    theater: "Bio Rex Helsinki",
    revenue: "€38,500",
    bookings: 892,
    occupancy: "72%",
    trend: "up",
  },
  {
    theater: "Finnkino Tampere",
    revenue: "€28,400",
    bookings: 654,
    occupancy: "45%",
    trend: "down",
  },
];

// CSV Export function
const exportCSV = () => {
  const rows = [
    ["Metric", "Value"],
    ["Total Revenue", `€${metricData.revenue.toLocaleString()}`],
    ["Total Bookings", metricData.bookings],
    ["Total Tickets", metricData.tickets],
    ["Occupancy Rate", `${metricData.occupancy}%`],
  ];

  const csvContent = rows.map((e) => e.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "report.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

// Add a proper MetricCard component
function MetricCard({ title, value, change, color }: any) {
  return (
    <div className="metric-card" style={{ borderLeft: `6px solid ${color}` }}>
      <p className="metric-title">{title}</p>
      <h2 className="metric-value">{value}</h2>
      <p className={change >= 0 ? "trend-up" : "trend-down"}>
        {change >= 0 ? `↑ ${change}%` : `↓ ${Math.abs(change)}%`}
      </p>
    </div>
  );
}

export default function ReportingDashboard() {
  const [dateRange, setDateRange] = useState("week");
  const [theater, setTheater] = useState("Oulu");
  const [movie, setMovie] = useState("all");

   const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const navigate = useNavigate();

  return (
    <div className="report-page">
       <div className="back-button" onClick={() => navigate("/dashboard")}>
    ← Back to Dashboard
  </div>

      <h1 className="report-title">Reports & Analytics</h1>
      <p className="report-subtitle">Financial and operational insights</p>

      {/* FILTER BAR */}
      <div className="filter-bar">
       <div className="filter-group">
  <label>Date Range</label>
  <select
    value={dateRange}
    onChange={(e) => setDateRange(e.target.value)}
  >
    <option value="today">Today</option>
    <option value="week">This Week</option>
    <option value="month">This Month</option>
    <option value="year">This Year</option>
    <option value="custom">Custom Range</option> {/*  add this */}
  </select>

  {/*  Custom date range UI  */}
  {dateRange === "custom" && (
    <div className="custom-date-range">
      <div className="filter-group">
        <label>From</label>
        <input
          type="date"
          value={customFrom}
          onChange={(e) => setCustomFrom(e.target.value)}
        />
      </div>

      <div className="filter-group">
        <label>To</label>
        <input
          type="date"
          value={customTo}
          onChange={(e) => setCustomTo(e.target.value)}
        />
      </div>

      <button className="csv-btn">Apply</button>
    </div>
  )}
</div>


        <div className="filter-group">
          <label>Theater</label>
          <select value={theater} onChange={(e) => setTheater(e.target.value)}>
            <option value="Oulu">Cinema Nova Oulu</option>
            <option value="Helsinki">Bio Rex Helsinki</option>
            <option value="Tampere">Finnkino Tampere</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Movie</label>
          <select value={movie} onChange={(e) => setMovie(e.target.value)}>
            <option value="all">All Movies</option>
            <option value="joker">Joker 2</option>
            <option value="deadpool">Deadpool & Wolverine</option>
          </select>
        </div>

        <button className="csv-btn" onClick={exportCSV}>
          ⬇ Export CSV
        </button>
      </div>

      {/* METRIC CARDS */}
      <div className="metric-grid">
        <MetricCard
          title="Total Revenue"
          value={`€${metricData.revenue.toLocaleString()}`}
          change={metricData.revenueChange}
          color="#0FA958"
        />
        <MetricCard
          title="Total Bookings"
          value={metricData.bookings.toLocaleString()}
          change={metricData.bookingsChange}
          color="#0077ff"
        />
        <MetricCard
          title="Total Tickets"
          value={metricData.tickets.toLocaleString()}
          change={metricData.ticketsChange}
          color="#b26bfb"
        />
        <MetricCard
          title="Occupancy Rate"
          value={`${metricData.occupancy}%`}
          change={metricData.occupancyChange}
          color="#ff5e00"
        />
      </div>

      {/* TICKET DISTRIBUTION (PIE CHART) */}
      <div className="report-card">
        <h3 className="section-title">Ticket Distribution</h3>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={ticketPieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {ticketPieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* THEATER PERFORMANCE */}
      <div className="report-card">
        <h3 className="section-title">Theater Performance</h3>
        <div className="theater-grid">
          {theaterCards.map((t, i) => (
            <div className="theater-card" key={i}>
              <h4>{t.theater}</h4>
              <p>
                Revenue: <b>{t.revenue}</b>
              </p>
              <p>
                Bookings: <b>{t.bookings.toLocaleString()}</b>
              </p>
              <p>
                Occupancy: <b>{t.occupancy}</b>
              </p>
              <p className={t.trend === "up" ? "trend-up" : "trend-down"}>
                {t.trend === "up" ? "Trending Up ↑" : "Needs Attention ↓"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
