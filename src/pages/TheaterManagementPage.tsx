import React, { useEffect, useState } from "react";
import "../styles/global.css";
import "../styles/theater.css";
const API_URL = "https://app-cinereserve-backend-cabmcgejecgjgcdu.swedencentral-01.azurewebsites.net";


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

  // ===== Amila: State for API data ====
  const [theaters, setTheaters] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  // ===== Amila: fetch cities and theaters =====
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch cities
        const citiesResponse = await fetch(`${API_URL}/api/cities`);
        const citiesData = await citiesResponse.json();
        setCities(["All", ...citiesData.map(city => city.cityName)]);
        // Fetch theaters
        const theatersResponse = await fetch(`${API_URL}/theaters`);
        const theatersData = await theatersResponse.json();
       
        //map theaters data to match formData structure
        const formattedTheaters = theatersData.map(theater => ({
          id: theater.id,
          name: theater.name,
          city: theater.cityName,
          address: theater.address,
          phone: theater.phone,
          email: theater.email || "N/A",
          auditoriums: theater.totalAuditoriums || 0,
          seats: theater.seatCapacity || 0
        }));
        
        setTheaters(formattedTheaters);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
      }, []); // dependency array

// #####Achini#########
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
  
  ////###### Amila :save data

 const handleSave = async () => {
    if (!formData.name || !formData.city || !formData.address || !formData.phone) {
      alert("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      // Find city ID from city name
      const citiesResponse = await fetch(`${API_URL}/api/cities`);
      const citiesData = await citiesResponse.json();
      const city = citiesData.find(c => c.cityName === formData.city);
city.cityID
      
      if (!city) {
        alert("Selected city not found");
        return;
      }

      const requestData = {
        name: formData.name,
        address: formData.address,
        phone: formData.phone,
        cityId: city.id,
        email: formData.email || ""
      };

      let response, result;

      if (editingTheater) {
        // Update existing theater
        response = await fetch(`${API_URL}/theaters/${editingTheater.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestData)
        });
        result = await response.json();
      } else {
        // Create new theater
        response = await fetch(`${API_URL}/theaters`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestData)
        });
        result = await response.json();
      }

      if (result.success) {
        // Refresh theaters list
        const theatersResponse = await fetch(`${API_URL}/theaters`);
        const theatersData = await theatersResponse.json();
        
        const formattedTheaters = theatersData.map(theater => ({
          id: theater.id,
          name: theater.name,
          city: theater.cityName,
          address: theater.address,
          phone: theater.phone,
          email: theater.email || "N/A",
          auditoriums: theater.totalAuditoriums || 0,
          seats: theater.seatCapacity || 0
        }));
        
        setTheaters(formattedTheaters);
        alert(editingTheater ? "Theater updated successfully!" : "Theater created successfully!");
        setShowForm(false);
        setEditingTheater(null);
      } else {
        alert("Failed to save theater: " + (result.message || "Unknown error"));
      }

    } catch (error) {
      console.error("Save error:", error);
      alert("Network error - please try again");
    } finally {
      setLoading(false);
    }
  };

   // ===== Amila : Delete from backend =====
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this theater?")) {
      try {
        const response = await fetch(`${API_URL}/theaters/${id}`, {
          method: "DELETE"
        });
        
        const result = await response.json();
        
        if (result.success) {
          // Remove from local state
          setTheaters(theaters.filter((t) => t.id !== id));
          alert("Theater deleted successfully!");
        } else {
          alert("Failed to delete theater: " + (result.message || "Unknown error"));
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
