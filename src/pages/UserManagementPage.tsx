import React, { useState } from "react";
import "../App.css";

export default function UserManagementPage() {
  const [showForm, setShowForm] = useState(false);
  const [users, setUsers] = useState([
    { id: 1, name: "Amila", role: "Manager", email: "amila@northstar.fi" },
    { id: 2, name: "Rasa", role: "Staff", email: "rasa@northstar.fi" },
  ]);

  const [formData, setFormData] = useState({ name: "", role: "", email: "" });

  const handleAdd = () => {
    setShowForm(true);
    setFormData({ name: "", role: "", email: "" });
  };

  const handleSave = () => {
    setUsers([...users, { id: users.length + 1, ...formData }]);
    setShowForm(false);
  };

  return (
    <div className="theater-section">
      <h2>User Management</h2>
      <button onClick={handleAdd} className="btn-add">+ Add User</button>

      <ul>
        {users.map((u) => (
          <li key={u.id} className="theater-card">
            <strong>{u.name}</strong> – {u.role} ({u.email})
            <button className="btn-edit" onClick={() => alert("Edit coming soon")}>✏️</button>
          </li>
        ))}
      </ul>

      {showForm && (
        <div className="popup">
          <div className="popup-content">
            <h3>Add User</h3>
            <input
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <input
              placeholder="Role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            />
            <input
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
