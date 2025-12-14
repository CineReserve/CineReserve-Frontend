import React, { useEffect, useState } from "react";
import "../../styles/global.css";
import "../../styles/theater.css";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

type Theater = {
  id: number;
  theaterName: string;
  cityName: string;
  theaterAddress: string;
  theaterPhoneNumber: string;
  theaterEmail: string;
  totalAuditoriums: number;
  seatCapacity: number;
};

type City = string;

export default function TheaterManagementPage({
  role,
}: {
  role: string | null;
}) {
  const [showForm, setShowForm] = useState(false);
  const [editingTheater, setEditingTheater] = useState<Theater | null>(null);
  const [formData, setFormData] = useState({
    theaterName: "",
    cityName: "Oulu",
    theaterAddress: "",
    theaterPhoneNumber: "",
    theaterEmail: "",
    totalAuditoriums: 0,
    seatCapacity: 0,
  });

  const [selectedCity, setSelectedCity] = useState<City>("All");
  const [search, setSearch] = useState("");

  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ===== Fetch cities and theaters =====
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch cities
        const citiesResponse = await fetch(`${API_URL}/api/cities`);
        const citiesData = await citiesResponse.json();

        setCities(["All", ...citiesData.map((c: any) => c.cityName)]);

        // Fetch theaters
        const theatersResponse = await fetch(`${API_URL}/api/theaters`);
        const theatersData = await theatersResponse.json();

        const formattedTheaters = theatersData.map((theater: any) => ({
          id: theater.theaterID,
          theaterName: theater.theaterName,
          cityName: theater.cityName,
          theaterAddress: theater.theaterAddress,
          theaterPhoneNumber: theater.theaterPhoneNumber,
          theaterEmail: theater.theaterEmail || "N/A",
          totalAuditoriums: theater.totalAuditoriums || 0,
          seatCapacity: theater.seatCapacity || 0,
        }));

        setTheaters(formattedTheaters);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter theaters
  const filteredTheaters = theaters.filter((t: Theater) => {
    const matchCity = selectedCity === "All" || t.cityName === selectedCity;
    const matchSearch =
      t.theaterName.toLowerCase().includes(search.toLowerCase()) ||
      t.theaterAddress.toLowerCase().includes(search.toLowerCase());
    return matchCity && matchSearch;
  });

  // Handle Add
  const handleAdd = () => {
    setEditingTheater(null);
    setFormData({
      theaterName: "",
      cityName: "Oulu",
      theaterAddress: "",
      theaterPhoneNumber: "",
      theaterEmail: "",
      totalAuditoriums: 0,
      seatCapacity: 0,
    });
    setShowForm(true);
  };

  const handleEdit = (theater: Theater) => {
    setEditingTheater(theater);
    setFormData({
      theaterName: theater.theaterName,
      cityName: theater.cityName,
      theaterAddress: theater.theaterAddress,
      theaterPhoneNumber: theater.theaterPhoneNumber,
      theaterEmail: theater.theaterEmail,
      totalAuditoriums: theater.totalAuditoriums,
      seatCapacity: theater.seatCapacity,
    });
    setShowForm(true);
  };

  const handleView = (theaterId: number) => {
    navigate(`/auditoriums/${theaterId}`);
  };

  // Save Theater
  const handleSave = async () => {
    if (
      !formData.theaterName ||
      !formData.cityName ||
      !formData.theaterAddress ||
      !formData.theaterPhoneNumber
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const citiesResponse = await fetch(`${API_URL}/api/cities`);
      const citiesData = await citiesResponse.json();

      const city = citiesData.find(
        (c: any) => c.cityName === formData.cityName
      );

      if (!city) {
        alert("Selected city not found");
        return;
      }

      const requestData = {
        theaterName: formData.theaterName,
        theaterAddress: formData.theaterAddress,
        theaterPhoneNumber: formData.theaterPhoneNumber,
        cityID: city.cityID,
        theaterEmail: formData.theaterEmail || "",
      };

      let url = "";
      let method = "";

      if (editingTheater) {
        url = `${API_URL}/api/theaters/${editingTheater.id}`;
        method = "PUT";
      } else {
        url = `${API_URL}/api/theaters`;
        method = "POST";
      }

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();

      if (result.result) {
        const theatersResponse = await fetch(`${API_URL}/api/theaters`);
        const theatersData = await theatersResponse.json();

        const updatedList = theatersData.map((theater: any) => ({
          id: theater.theaterID,
          theaterName: theater.theaterName,
          cityName: theater.cityName,
          theaterAddress: theater.theaterAddress,
          theaterPhoneNumber: theater.theaterPhoneNumber,
          theaterEmail: theater.theaterEmail || "N/A",
          totalAuditoriums: theater.totalAuditoriums || 0,
          seatCapacity: theater.seatCapacity || 0,
        }));

        setTheaters(updatedList);

        alert(editingTheater ? "Theater updated!" : "Theater created!");
        setShowForm(false);
        setEditingTheater(null);
      } else {
        alert("Failed to save theater: " + (result.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("Network error");
    } finally {
      setLoading(false);
    }
  };

  // Delete theater
  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this theater?")) {
      try {
        const response = await fetch(`${API_URL}/api/theaters/${id}`, {
          method: "DELETE",
        });

        const result = await response.json();

        if (result.result) {
          setTheaters(theaters.filter((t) => t.id !== id));
          alert("Theater deleted successfully!");
          // Optionally, refresh the list from server
        } else {
          alert("Failed to delete theater");
        }
      } catch (error) {
        console.error("Delete error:", error);
        alert("Error deleting theater");
      }
    }
  
  };

  return (
    <div className="theater-management-container">
      <section className="theater-section">
        <button
          className="back-btn"
          onClick={() =>
            navigate(role === "owner" ? "/dashboard" : "/staff-dashboard")
          }
        >
          ← Back to Dashboard
        </button>

        <h2 className="page-title">Theater Management</h2>
        <p className="page-subtitle">
          Manage theater locations and venue information
        </p>

        {/* Search + City Filter */}
        <div className="filter-bar">
          <input
            type="text"
            placeholder="Search by name or address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />

          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="theater-dropdown"
          >
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>

          <button className="btn-primary" onClick={handleAdd}>
            ➕ Add Theater
          </button>
        </div>

        {/* Table Header */}
        <div className="theater-list-header">
          <span>Name</span>
          <span>City</span>
          <span>Address</span>
          <span>Contact</span>
          <span>Auditoriums</span>
          <span>Total Seats</span>
          <span>Email</span>
          <span>Actions</span>
        </div>

        {/* Theater List */}
        <div className="theater-list scrollable-list">
          {filteredTheaters.map((theater) => (
            <div key={theater.id} className="theater-row">
              <span>{theater.theaterName}</span>
              <span>{theater.cityName}</span>
              <span>{theater.theaterAddress}</span>
              <span>{theater.theaterPhoneNumber}</span>
              <span>{theater.totalAuditoriums}</span>
              <span>{theater.seatCapacity}</span>
              <span>{theater.theaterEmail}</span>

              <div className="user-actions">
                <button
                  className="btn-view"
                  onClick={() => handleView(theater.id)}
                >
                  👁️
                </button>

                <button
                  className="btn-edit"
                  onClick={() => handleEdit(theater)}
                >
                  ✏️
                </button>

                <button
                  className="btn-delete"
                  onClick={() => handleDelete(theater.id)}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Form */}
        {showForm && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>{editingTheater ? "Edit Theater" : "Add New Theater"}</h3>

              <div className="form-group">
                <label>Theater Name *</label>
                <input
                  value={formData.theaterName}
                  onChange={(e) =>
                    setFormData({ ...formData, theaterName: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>City *</label>
                <select
                  value={formData.cityName}
                  onChange={(e) =>
                    setFormData({ ...formData, cityName: e.target.value })
                  }
                >
                  {cities
                    .filter((c) => c !== "All")
                    .map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                </select>
              </div>

              <div className="form-group">
                <label>Address *</label>
                <input
                  value={formData.theaterAddress}
                  onChange={(e) =>
                    setFormData({ ...formData, theaterAddress: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  placeholder="+358 XX XXX XXXX"
                  value={formData.theaterPhoneNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      theaterPhoneNumber: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  placeholder="example@domain.com"
                  value={formData.theaterEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, theaterEmail: e.target.value })
                  }
                />
              </div>

              <div className="modal-actions">
                <button className="btn-primary" onClick={handleSave}>
                  Save
                </button>
                <button
                  className="btn-cancel"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
