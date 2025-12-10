import React, { useState, useEffect } from "react";
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

const API_URL = import.meta.env.VITE_API_URL;

// Metric Card Component
function MetricCard({ title, value, change, color }: any) {
  return (
    <div className="metric-card" style={{ borderLeft: `6px solid ${color}` }}>
      <p className="metric-title">{title}</p>
      <h2 className="metric-value">{value}</h2>

      {/* Change indicator */}
      {change !== null && (
        <p className={change >= 0 ? "trend-up" : "trend-down"}>
          {change >= 0 ? `↑ ${change}%` : `↓ ${Math.abs(change)}%`}
        </p>
      )}
    </div>
  );
}

export default function ReportingDashboard() {
  const navigate = useNavigate();

  // Filters
  const [dateRange, setDateRange] = useState("week");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

  // Data from APIs
  const [metrics, setMetrics] = useState<any>(null);
  const [ticketDistribution, setTicketDistribution] = useState<any[]>([]);
  const [theaterPerformance, setTheaterPerformance] = useState<any[]>([]);

  // Helper: Build payload for all API calls
  const buildPayload = () => {
    if (dateRange === "custom") {
      return {
        dateRange: "custom",
        from: customFrom,
        to: customTo,
        theaterID: null,
        movieID: "all",
      };
    }

    // For today/week/month/year → backend expects expanded dates
    const today = new Date();
    let from = "";
    let to = "";

    if (dateRange === "today") {
      from = to = today.toISOString().split("T")[0];
    }

    if (dateRange === "week") {
      const first = new Date(today);
      first.setDate(today.getDate() - today.getDay());
      const last = new Date(first);
      last.setDate(first.getDate() + 6);

      from = first.toISOString().split("T")[0];
      to = last.toISOString().split("T")[0];
    }

    if (dateRange === "month") {
      const first = new Date(today.getFullYear(), today.getMonth(), 1);
      const last = new Date(today.getFullYear(), today.getMonth() + 1, 0);

      from = first.toISOString().split("T")[0];
      to = last.toISOString().split("T")[0];
    }

    if (dateRange === "year") {
      const first = new Date(today.getFullYear(), 0, 1);
      const last = new Date(today.getFullYear(), 11, 31);

      from = first.toISOString().split("T")[0];
      to = last.toISOString().split("T")[0];
    }

    return {
      dateRange,
      from,
      to,
      theaterID: null,
      movieID: "all",
    };
  };

  // Fetch METRICS
  const fetchMetrics = async () => {
    try {
      const res = await fetch(`${API_URL}/api/reports/metrics`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload()),
      });
      const data = await res.json();
      setMetrics(data);
    } catch (err) {
      console.error("Metrics fetch error:", err);
    }
  };

  // Fetch Ticket Distribution
  const fetchTicketDistribution = async () => {
    try {
      const res = await fetch(`${API_URL}/api/reports/ticket-distribution`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload()),
      });
      const data = await res.json();
      setTicketDistribution(data);
    } catch (err) {
      console.error("Ticket distribution fetch error:", err);
    }
  };

  // Fetch Theater Performance
  const fetchTheaterPerformance = async () => {
    try {
      const res = await fetch(`${API_URL}/api/reports/theaters/performance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload()),
      });
      const data = await res.json();

      if (data.result) setTheaterPerformance(data.theaters);
    } catch (err) {
      console.error("Theater performance fetch error:", err);
    }
  };

  // Load data when filters change
  useEffect(() => {
    fetchMetrics();
    fetchTicketDistribution();
    fetchTheaterPerformance();
  }, [dateRange, customFrom, customTo]);

  const exportCSV = async () => {
    try {
      const res = await fetch(`${API_URL}/api/reports/export`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload()),
      });

      if (!res.ok) {
        throw new Error("Failed to export CSV");
      }

      // CSV arrives as plain text
      const csvText = await res.text();

      const blob = new Blob([csvText], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "report.csv";
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export failed:", err);
      alert("CSV export failed. Check console for details.");
    }
  };

  return (
    <div className="report-page">
      <div className="back-button" onClick={() => navigate("/dashboard")}>
        ← Back to Dashboard
      </div>

      <h1 className="report-title">Reports & Analytics</h1>
      <p className="report-subtitle">Financial and operational insights</p>

      {/* FILTER BAR */}
      <div className="filter-bar">
        {/* Date Range */}
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
            <option value="custom">Custom Range</option>
          </select>

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
            </div>
          )}
        </div>

        {/* Export CSV */}
        <button className="csv-btn" onClick={exportCSV}>
          ⬇ Export CSV
        </button>
      </div>

      {/* METRIC CARDS */}
      {metrics && (
        <div className="metric-grid">
          <MetricCard
            title="Total Revenue"
            value={`€${metrics.revenue}`}
            change={metrics.revenueChange ?? null}
            color="#0FA958"
          />
          <MetricCard
            title="Total Bookings"
            value={metrics.bookings}
            change={metrics.bookingsChange ?? null}
            color="#0077ff"
          />
          <MetricCard
            title="Total Tickets"
            value={metrics.tickets}
            change={metrics.ticketsChange ?? null}
            color="#b26bfb"
          />
          <MetricCard
            title="Occupancy Rate"
            value={`${metrics.occupancy.toFixed(2)}%`}
            change={metrics.occupancyChange ?? null}
            color="#ff5e00"
          />
        </div>
      )}

      {/* TICKET DISTRIBUTION */}
      <div className="report-card">
        <h3 className="section-title">Ticket Distribution</h3>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={ticketDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.value}`}
                outerRadius={80}
                dataKey="value"
              >
                {ticketDistribution.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index === 0 ? "#b26bfb" : "#00b4d8"}
                  />
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
          {theaterPerformance.map((t, i) => {
            const revenueFormatted = `€${t.revenue.toFixed(2)}`;
            const occupancyPercent = `${t.occupancy.toFixed(2)}%`;

            return (
              <div className="theater-card" key={i}>
                <h4>{t.theaterName}</h4>
                <p>
                  Revenue: <b>{revenueFormatted}</b>
                </p>
                <p>
                  Bookings: <b>{t.bookings}</b>
                </p>
                <p>
                  Occupancy: <b>{occupancyPercent}</b>
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
