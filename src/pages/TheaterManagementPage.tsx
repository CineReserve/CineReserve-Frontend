import React, { useState } from "react";
import "../App.css";

export default function TheaterManagementPage() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", city: "", seats: "" });
  const [selectedCity, setSelectedCity] = useState("All");
  const [search, setSearch] = useState("");

  const [theaters, setTheaters] = useState([
    { id: 1, name: "Cinema Nova Oulu", city: "Oulu", seats: 275 },
    { id: 2, name: "Kino Baltic Turku", city: "Turku", seats: 400 },
     { id: 3, name: "Elokuvateatteri Helsinki Central", city: "Helsinki", seats: 290 },
  ]);

  
   const handleAdd = () => {
    setFormData({ name: "", city: "", seats: "" });
    setShowForm(true);
  };

  const handleSave = () => {
     if (!formData.name || !formData.city || !formData.seats) {
      alert("Please fill in all fields.");
      return;
    }
    setTheaters([...theaters, { id: theaters.length + 1, ...formData }]);
    setShowForm(false);
  };
  // Filter logic
  const cities = ["All", "Oulu", "Turku", "Helsinki"];
  const filteredTheaters = theaters.filter((t) => {
    const matchesCity = selectedCity === "All" || t.city === selectedCity;
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase());
    return matchesCity && matchesSearch;
  });


  return (
    <div className="theater-section">
      <h2>Theater Management</h2>

       {/* ===== Filters & Search ===== */}
      <div className="theater-controls">
        <div className="city-filters">
          {cities.map((city) => (
            <button
              key={city}
              className={`city-btn ${selectedCity === city ? "active" : ""}`}
              onClick={() => setSelectedCity(city)}
            >
              {city}
            </button>
          ))}
        </div>

        <div className="search-add">
          <input
            type="text"
            placeholder="Search theaters..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

      <button onClick={handleAdd} className="btn-add">+ Add Theater</button>
       </div>
      </div>

       <ul className="theater-list">
       {filteredTheaters.map((t) => (
          <li key={t.id} className="theater-card">
            <div>
            <strong>{t.name}</strong> – {t.city} ({t.seats} Seats)
            </div>
            <button className="btn-edit" onClick={() => alert("Edit coming soon")}>✏️</button>
          </li>
        ))}
      </ul>

      {showForm && (
        <div className="popup">
          <div className="popup-content">
            <h3>Add Theater</h3>
            <input
              placeholder="Theater Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <input
              placeholder="City"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            />
            <input
              placeholder="Seats"
              value={formData.seats}
              onChange={(e) => setFormData({ ...formData, seats: e.target.value })}
            />
            <div className="popup-actions">
              <button onClick={handleSave}>Save</button>
              <button onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
