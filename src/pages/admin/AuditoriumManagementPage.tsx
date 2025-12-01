import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/global.css";
import "../../styles/auditorium.css";

interface Auditorium {
  id: number;
  name: string;
  rows: number;
  seatsPerRow: number;
  lastRowSeats: number;
  capacity: number;
  status: string;
  timeSlot?: string;
}
const API_URL = import.meta.env.VITE_API_URL;

export default function AuditoriumManagementPage() {
  const navigate = useNavigate();
  const { theaterId } = useParams();

  const [theaterName, setTheaterName] = useState("");
  const [auditoriums, setAuditoriums] = useState<Auditorium[]>([]); //<Auditorium[]> initialize as empty array
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingAuditorium, setEditingAuditorium] = useState<Auditorium | null>(
    null
  );

  const [formData, setFormData] = useState({
    auditoriumName: "",
    status: "Active",
    rows: 1,
    seatsPerRow: 1,
    lastRowSeats: 1,
    capacity: 1,
  });
  const [selectedAuditorium, setSelectedAuditorium] = useState<any>(null);
  const [showSeatLayout, setShowSeatLayout] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAuditoriums = async () => {
    if (!theaterId) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${API_URL}/api/theaters/${theaterId}/auditoriums`
      );

      if (!response.ok) {
        setError("Failed to load auditoriums");
        setLoading(false);
        return;
      }

      const data = await response.json();

      const mapped = data.map((item: any) => {
        const rows = item.noOfRows || 0;
        const seatsPerRow = item.noOfSeatsPerRow || 0;

        let capacity = item.seatingCapacity;
        if (!capacity) {
          capacity = rows * seatsPerRow;
        }

        return {
          id: item.auditoriumID,
          name: item.auditoriumName,
          rows: rows,
          seatsPerRow: seatsPerRow,
          lastRowSeats: seatsPerRow,
          capacity: capacity,
          status: "Active",
          // timeSlot: item.timeSlot,
        };
      });

      setAuditoriums(mapped);

      if (data.length > 0) {
        setTheaterName(data[0].theaterName);
      }

      setLoading(false);
    } catch (err) {
      setError("Error while loading auditoriums");
      setLoading(false);
    }
  };

  const handleViewSeats = (auditorium: any) => {
    setSelectedAuditorium(auditorium);
    setShowSeatLayout(true);
  };

  // Calculate total capacity automatically
  useEffect(() => {
    const { rows, seatsPerRow, lastRowSeats } = formData;
    const total = (rows - 1) * seatsPerRow + lastRowSeats;
    setFormData((prev) => ({ ...prev, capacity: total }));
  }, [formData.rows, formData.seatsPerRow, formData.lastRowSeats]);

  useEffect(() => {
    loadAuditoriums(); //Load auditoriums when page opens
  }, [theaterId]);

  const handleAdd = () => {
    setEditingAuditorium(null);
    setFormData({
      auditoriumName: "",
      status: "Active",
      rows: 1,
      seatsPerRow: 1,
      lastRowSeats: 1,
      capacity: 1,
    });
    setShowForm(true);
  };

  const handleEdit = (auditorium: Auditorium) => {
    setEditingAuditorium(auditorium);
    setFormData({
      auditoriumName: auditorium.name,
      status: auditorium.status,
      rows: auditorium.rows,
      seatsPerRow: auditorium.seatsPerRow,
      lastRowSeats: auditorium.lastRowSeats,
      capacity: auditorium.capacity,
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!formData.auditoriumName) {
      alert("Auditorium name is required");
      return;
    }
    const payload = {
      auditoriumName: formData.auditoriumName,
      seatingCapacity: formData.capacity,
      theaterID: Number(theaterId),
      noOfRows: formData.rows,
      noOfSeatsPerRow: formData.seatsPerRow,
      status: formData.status,
    };

    try {
      setLoading(true);
      setError(null);
      if (editingAuditorium) {
        const response = await fetch(
          `${API_URL}/api/auditoriums/${editingAuditorium.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...payload,
              auditoriumID: editingAuditorium!.id,
              // timeSlot: formData.timeSlot,
            }),
          }
        );

        if (!response.ok) {
          setError("Failed to update auditorium");
          setLoading(false);
          return;
        }

        alert("Auditorium updated successfully!");
      } else {
        const response = await fetch(`${API_URL}/api/auditoriums`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...payload,
            // timeSlot: formData.timeSlot,
          }),
        });

        if (!response.ok) {
          setError("Failed to create auditorium");
          setLoading(false);
          return;
        }

        alert("Auditorium created successfully!");
      }

      setShowForm(false);

      // Refresh data
      await loadAuditoriums();
      setLoading(false);
    } catch (err) {
      setError("Error saving auditorium");
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm("Delete this auditorium?");
    if (!confirmDelete) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/api/auditoriums/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        setError("Failed to delete auditorium");
        setLoading(false);
        return;
      }

      alert("Auditorium deleted successfully!");

      // Reload from backend so UI is in sync with DB
      await loadAuditoriums();

      setLoading(false);
    } catch (err) {
      setError("Error deleting auditorium");
      setLoading(false);
    }
  };
  const filteredAuditoriums = auditoriums.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="auditorium-container">
      {loading && <p>Loading auditoriums...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button className="back-btn" onClick={() => navigate("/theaters")}>
        ← Back to Theaters
      </button>

      <h2 className="auditorium-title">{theaterName}</h2>

      <div className="auditorium-header">
        <input
          type="text"
          placeholder="Search auditoriums..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="auditorium-search"
        />
        <button className="btn-primary" onClick={handleAdd}>
          ➕ Add Auditorium
        </button>
      </div>

      {/* Table */}
      <div className="auditorium-table">
        <div className="auditorium-table-header">
          <span>Auditorium</span>
          <span>Layout</span>
          <span>Capacity</span>
          <span>Status</span>
          <span>Actions</span>
        </div>

        {filteredAuditoriums.map((a) => (
          <div key={a.id} className="auditorium-row">
            <span>{a.name}</span>
            <span>
              {a.rows} rows × {a.seatsPerRow} seats
              <br />
              Last row: {a.lastRowSeats}
            </span>
            <span>{a.capacity}</span>
            <span className="status-active">{a.status}</span>
            <div className="auditorium-actions">
              <button
                className="btn-view"
                title="View Seat Layout"
                onClick={() => handleViewSeats(a)}
              >
                👁️
              </button>
              <button className="btn-edit" onClick={() => handleEdit(a)}>
                ✏️
              </button>
              <button className="btn-delete" onClick={() => handleDelete(a.id)}>
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>
              {editingAuditorium ? "Edit Auditorium" : "Add New Auditorium"}
            </h3>

            <div className="form-group">
              <label>Auditorium Name *</label>
              <input
                value={formData.auditoriumName}
                onChange={(e) =>
                  setFormData({ ...formData, auditoriumName: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Status *</label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <h4>Seat Layout Configuration</h4>
            <div className="layout-grid">
              <div>
                <label>Number of Rows *</label>
                <input
                  type="number"
                  value={formData.rows}
                  onChange={(e) =>
                    setFormData({ ...formData, rows: Number(e.target.value) })
                  }
                />
              </div>
              <div>
                <label>Seats per Row *</label>
                <input
                  type="number"
                  value={formData.seatsPerRow}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      seatsPerRow: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <label>Last Row Seats *</label>
                <input
                  type="number"
                  value={formData.lastRowSeats}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      lastRowSeats: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>

            <div className="capacity-box">
              <strong>Total Seat Capacity: {formData.capacity}</strong>
              <p>
                Calculation: ({formData.rows - 1} rows × {formData.seatsPerRow}{" "}
                seats) + {formData.lastRowSeats} last row seats
              </p>
            </div>

            <div className="modal-actions">
              <button className="btn-primary" onClick={handleSave}>
                Save Auditorium
              </button>
              <button className="btn-cancel" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {/* View Seat Layout Modal */}
      {showSeatLayout && selectedAuditorium && (
        <div className="modal-overlay">
          <div className="modal seat-layout-modal">
            <h3>{selectedAuditorium.name} - Seat Layout</h3>
            <p style={{ color: "#475569", marginBottom: "1rem" }}>
              {theaterName}
            </p>

            <div className="screen-box">SCREEN</div>

            <div className="seat-grid">
              {Array.from({ length: selectedAuditorium.rows }).map(
                (_, rowIndex) => (
                  <div key={rowIndex} className="seat-row">
                    <span className="row-label">
                      {String.fromCharCode(65 + rowIndex)}
                    </span>
                    {Array.from({
                      length:
                        rowIndex === selectedAuditorium.rows - 1
                          ? selectedAuditorium.lastRowSeats
                          : selectedAuditorium.seatsPerRow,
                    }).map((_, seatIndex) => (
                      <div key={seatIndex} className="seat available">
                        {seatIndex + 1}
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>

            <div className="legend">
              <div className="legend-item">
                <div className="seat available"></div>
                <span>Available</span>
              </div>
            </div>

            <div className="capacity-info">
              <strong>Total Capacity:</strong> {selectedAuditorium.capacity}{" "}
              seats
            </div>

            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={() => setShowSeatLayout(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
