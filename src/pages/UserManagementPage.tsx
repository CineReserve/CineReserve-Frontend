import React, { useState } from "react";
import "../App.css";

export default function UserManagementPage() {
  const [showForm, setShowForm] = useState(false);
const [editingUser, setEditingUser] = useState<any>(null);
  const [search, setSearch] = useState("");

  const [users, setUsers] = useState([
    { id: 1, name: "Amila", role: "Owner", email: "amila@northstar.fi", status: "Active", phone: "0451234567" },
    { id: 2, name: "Rasa", role: "Staff", email: "rasa@northstar.fi", status: "Inactive", phone: "0459876543" },
  ]);
   

  const [formData, setFormData] = useState({ 
     name: "",
    email: "",
    password: "",
    phone: "",
    role: "Staff",
    status: "Active",
  });


  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );


  const handleAdd = () => {
    setEditingUser(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      phone: "",
      role: "Staff",
      status: "Active",
    });
    setShowForm(true);
  };

  const handleEdit = (user: any) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      phone: user.phone || "",
      role: user.role,
      status: user.status,
    });
    setShowForm(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.email) {
      alert("Please fill in required fields.");
      return;
    }

    if (editingUser) {
      setUsers(users.map((u) => (u.id === editingUser.id ? { ...u, ...formData } : u)));
    } else {
      setUsers([...users, { id: users.length + 1, ...formData }]);
    }
  
setShowForm(false);
  };

  //  Delete user
  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter((u) => u.id !== id));
    }
  };
  return (
     <div className="theater-section">
      <h2>User Management</h2>
      <p style={{ marginBottom: "15px", color: "#ccc" }}>
        Manage employee accounts and permissions
      </p>

      <div className="theater-controls">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={handleAdd} className="btn-add">+ Add User</button>
      </div>

      <ul className="theater-list">
        {filteredUsers.map((u) => (
          <li key={u.id} className="theater-card">
            <div>
              <strong>{u.name}</strong> — {u.role} ({u.email})
              <br />
              <span style={{ fontSize: "13px", color: "#9ee0ff" }}>
                📞 {u.phone || "N/A"} | {u.status}
              </span>
            </div>
            <div>
              <button className="btn-edit" onClick={() => handleEdit(u)}>✏️</button>
              <button className="btn-delete" onClick={() => handleDelete(u.id)}>🗑️</button>
            </div>
          </li>
        ))}
      </ul>

      {showForm && (
        <div className="popup">
          <div className="popup-content">
           <h3>{editingUser ? "Edit User" : "Add New User"}</h3>
            <input
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
             <input
              placeholder="Full Name *"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <input
              placeholder="Email Address *"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <input
              type="password"
              placeholder={editingUser ? "Leave blank to keep current password" : "Enter password"}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <input
              placeholder="Phone Number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />

            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <option value="Owner">Owner</option>
              <option value="Management">Management</option>
              <option value="Staff">Staff</option>
            </select>

            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>

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