import React, { useState } from "react";
import "../styles/global.css";
import "../styles/theater.css";

export default function TheaterManagementPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingTheater, setEditingTheater] = useState(null);
  const [formData, setFormData] = useState({
     name: "",
    city: "",
    address: "",
    phone: "",
    email: "",
    auditoriums: 1,
    seats: 0,
  });
  const [selectedCity, setSelectedCity] = useState("All");
  const [search, setSearch] = useState("");

  const [theaters, setTheaters] = useState([
    {
      id: 1,
      name: "Cinema Nova Oulu",
      city: "Oulu",
      address: "Kauppurienkatu 45, 90100 Oulu, Finland",
      phone: "+358 8 5542 3890",
      auditoriums: 3,
      seats: 395,
    },
    {
      id: 2,
      name: "Kino Baltic Turku",
      city: "Turku",
      address: "Linnankatu 28, 20100 Turku, Finland",
      phone: "+358 2 2641 7520",
    },
  ]);

// Filter options
  const cities = ["All", "Oulu", "Turku", "Helsinki"];
  const filteredTheaters = theaters.filter((t) => {
    const matchCity = selectedCity === "All" || t.city === selectedCity;
    const matchSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.address.toLowerCase().includes(search.toLowerCase());
    return matchCity && matchSearch;
  });
  
   const handleAdd = () => {
     setEditingTheater(null);
    setFormData({
      name: "",
      city: "Oulu",
      address: "",
      phone: "",
      email: "",
      auditoriums: 0,
      seats: 0,
    });
     setShowForm(true);
  };

  const handleEdit = (theater) => {
    setEditingTheater(theater);
    setFormData({ ...theater });
    setShowForm(true);
  };
  

  const handleSave = () => {
      if (!formData.name || !formData.city || !formData.address || !formData.phone) {
      alert("Please fill in all fields.");
      return;
    }
    if (editingTheater) {
      setTheaters(
        theaters.map((t) =>
          t.id === editingTheater.id ? { ...formData, id: t.id } : t
        )
      );
    } else {
      setTheaters([
        ...theaters,
        { ...formData, id: theaters.length + 1 },
      ]);
    }

    setShowForm(false);
    setEditingTheater(null);
  };
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this theater?")) {
      setTheaters(theaters.filter((t) => t.id !== id));
    }
  };


    return (
     <div className="theater-management-container">
    <section className="theater-section">
      <h2 className="page-title">Theater Management</h2>
      <p className="page-subtitle">
        Manage theater locations and venue information
      </p>

      {/* Search and City Filter */}
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
          className="city-dropdown"
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

{/* Theater List Header */}
<div className="theater-list-header">
  <span>Name</span>
  <span>City</span>
  <span>Address</span>
  <span>Contact Number</span>
  <span>Auditorium</span>
  <span>Total Seats</span>
  <span>Email</span>
  <span>Actions</span>
</div>

{/* Theater List */}
<div className="theater-list">
  {filteredTheaters.map((theater) => (
    <div key={theater.id} className="theater-row">
      <span>{theater.name}</span>
      <span>{theater.city}</span>
      <span>{theater.address}</span>
      <span>{theater.phone}</span>
      <span>{theater.auditoriums}</span>
      <span>{theater.seats}</span>
      <span>{theater.email || "N/A"}</span>
      <div className="user-actions">
        <button className="btn-edit" onClick={() => handleEdit(theater)}>
          ✏️
        </button>
        <button className="btn-delete" onClick={() => handleDelete(theater.id)}>
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
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>City *</label>
              <select
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              >
                {cities.filter((c) => c !== "All").map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Address *</label>
              <input
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Phone Number *</label>
              <input
                placeholder="+358 XX XXX XXXX"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="form-group">
               <label>Email *</label>
               <input
                type="email"
                placeholder="example@domain.com"
                value={formData.email || ""}
                onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
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
