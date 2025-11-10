import React, { useEffect, useState } from "react";
import "../styles/global.css";
import "../styles/user-management.css";
const API_URL =
  "https://app-cinereserve-backend-cabmcgejecgjgcdu.swedencentral-01.azurewebsites.net";

///££££Achini work##########
export default function UserManagementPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

 /* const [users, setUsers] = useState([
    { id: 1, name: "Amila", role: "Owner", email: "amila@northstar.fi", status: "Active", phone: "0451234567" },
    { id: 2, name: "Rasa", role: "Staff", email: "rasa@northstar.fi", status: "Inactive", phone: "0459876543" },
  ]);*/

  //########### amila work ##########

  //const [users, setUsers] = useState([]);//empty array initially

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    role: "Staff",
    isActive: true,
  });
  //######### Fetch users from backend

  useEffect(() => {
  async function fetchUsers() {
    try {
      const response = await fetch(`${API_URL}/users`);
      const data = await response.json();
      console.log("Fetched raw response:", data);

      if (Array.isArray(data.data)) {
        // Transform backend format → frontend format
        const formattedUsers = data.data.map((u, index) => ({
          id: u.id || index + 1,
          name: u.fullName || "N/A",
          role: u.userRole || "Unknown",
          email: u.userName || "N/A",
          status:
            u.status === true || u.status === "Active"
              ? "Active"
              : "Inactive",
          phone: u.phone || "N/A",
        }));

        console.log("Formatted users:", formattedUsers);
        setUsers(formattedUsers);
      } else {
        console.warn("Unexpected API format or no data found:", data);
        setUsers([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }

  fetchUsers();
}, []);


  //######### End of fetching users from backend

  //Achini work##########
  // ===== UI DEVELOPER RESPONSIBILITY: Search functionality =====
  const filteredUsers = users.filter((u) => {
    if (!u || !u.fullName) return false;
    return (
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    );
  });

  // ===== UI DEVELOPER RESPONSIBILITY: Form state management =====
  const handleAdd = () => {
    setEditingUser(null);
    setFormData({
      fullName: "",
      email: "",
      password: "",
      phone: "",
      role: "staff",
      isActive: true,
    });
    setShowForm(true);
  };

  // ===== INTEGRATION DEVELOPER: Fetch single user from backend =====
  const handleEdit = async (user: any) => {
    try {
      const response = await fetch(`${API_URL}/users/${user.id}`);
      const data = await response.json();

      if (data.success) {
        const freshUser = data.data;
        setEditingUser(freshUser);
        setFormData({
          fullName: freshUser.fullName,
          email: freshUser.email,
          password: "",
          phone: freshUser.phone || "",
          role: freshUser.role,
          isActive: freshUser.isActive,
        });
        setShowForm(true);
      } else {
        alert("User not found: " + data.message);
      }
    } catch (err) {
      console.error("Failed to fetch user:", err);
      alert("Error loading user data");
    }
  };

  // ===== INTEGRATION DEVELOPER: Save data to backend =====
  const handleSave = async () => {
    if (!formData.fullName || !formData.email) {
      alert("Please fill in required fields.");
      return;
    }

    setLoading(true);
    try {
      if (editingUser) {
        // INTEGRATION: Update existing user via PUT /users/:id
        const response = await fetch(`${API_URL}/users/${editingUser.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullName: formData.fullName,
            email: formData.email,
            role: formData.role,
            isActive: formData.isActive,
          }),
        });

        const data = await response.json();
        if (data.success) {
          // INTEGRATION: Refresh users list after update
          const usersResponse = await fetch(`${API_URL}/users`);
          const usersData = await usersResponse.json();
          if (usersData.success) setUsers(usersData.data || []);
        } else {
          alert("Failed to update user: " + data.message);
        }
      } else {
        // INTEGRATION: Create new user via POST /users
        const response = await fetch(`${API_URL}/users`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullName: formData.fullName,
            email: formData.email,
            role: formData.role,
            isActive: formData.isActive,
          }),
        });

        const data = await response.json();
        if (data.success) {
          // INTEGRATION: Refresh users list after create
          const usersResponse = await fetch(`${API_URL}/users`);
          const usersData = await usersResponse.json();
          if (usersData.success) setUsers(usersData.data || []);
        } else {
          alert("Failed to create user: " + data.message);
        }
      }
      setShowForm(false);
    } catch (err) {
      console.error("Save error:", err);
      alert("Error saving user");
    } finally {
      setLoading(false);
    }
  };

  // ===== INTEGRATION DEVELOPER: Delete from backend =====
  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await fetch(`${API_URL}/users/${id}`, {
          method: "DELETE",
        });

        const data = await response.json();
        if (data.success) {
          // INTEGRATION: Refresh users list after delete
          const usersResponse = await fetch(`${API_URL}/users`);
          const usersData = await usersResponse.json();
          if (usersData.success) setUsers(usersData.data || []);
        } else {
          alert("Failed to delete user: " + data.message);
        }
      } catch (err) {
        console.error("Delete error:", err);
        alert("Error deleting user");
      }
    }
  };

  // ===== UI DEVELOPER RESPONSIBILITY: JSX rendering and styling =====
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
        <button onClick={handleAdd} className="btn-add">
          + Add User
        </button>
      </div>
      {/* ===== Table Header ===== */}
<div className="user-list-header">
  <span>Email</span>
  <span>Full Name</span>
  <span>Role</span>
  <span>Status</span>
  <span>Actions</span>
</div>


      <ul className="theater-list">
  {filteredUsers.map((u) => (
    <li key={u.id} className="theater-card user-item">
      <span>{u.email}</span>
      <span>{u.fullName}</span>
      <span>{u.role}</span>
      <span>{u.isActive ? "Active" : "Inactive"}</span>

      <div className="user-actions">
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

            {/* UI: Form inputs */}
            <input
              placeholder="Full Name *"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
            />

            <input
              placeholder="Email Address *"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />

            <input
              type="password"
              placeholder={
                editingUser
                  ? "Leave blank to keep current password"
                  : "Enter password"
              }
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />

            <input
              placeholder="Phone Number"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />

            {/* INTEGRATION: Lowercase roles to match backend */}
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
            >
              <option value="owner">Owner</option>
              <option value="management">Management</option>
              <option value="staff">Staff</option>
            </select>

            {/* INTEGRATION: isActive instead of status */}
            <select
              value={formData.isActive ? "Active" : "Inactive"}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  isActive: e.target.value === "Active",
                })
              }
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>

            <div className="popup-actions">
              <button onClick={handleSave} disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </button>
              <button onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
