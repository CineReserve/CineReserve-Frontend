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

  //########### amila work ##########

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
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/users`);
        const users = await response.json();

        const formattedUsers = users.map((user) => ({
          id: user.userId, //Use actual userId from API-change use of index
          fullName: user.fullName,
          email: user.userName,
          role: user.userRole,
          isActive: user.status === "active",
        }));

        setUsers(formattedUsers);
      } catch (error) {
        console.error("Error:", error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

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

  const handleEdit = (user: any) => {
    setEditingUser(user);
    setFormData({
      fullName: user.fullName,
      email: user.userName, // ✅ Use userName from API, not email
      password: "",
      phone: user.phone || "",
      role: user.role,
      isActive: user.isActive,
    });
    setShowForm(true);
  };

  // ===== INTEGRATION DEVELOPER: Fetch single user from backend =====
  const handleSave = async () => {
       if (!formData.fullName || !formData.email) {
      alert("Please fill in name and email");
      return;
    }

       if (!editingUser && !formData.password) {
      alert("Please enter a password for new user");
      return;
    }

    setLoading(true);

    try {
      // Prepare data for API
      const requestData = {
        email: formData.email,
        fullName: formData.fullName,
        role: formData.role,
        isActive: formData.isActive,
        password: formData.password,
        phoneNumber: formData.phone || "",
      };

      console.log("📤 SENDING DATA:", requestData);

      let apiUrl, method;

      if (editingUser) {
        apiUrl = `${API_URL}/users/${editingUser.id}`;
        method = "PUT";
        console.log("🔄 UPDATING user ID:", editingUser.id);
      } else {
        apiUrl = `${API_URL}/users`;
        method = "POST";
        console.log("➕ CREATING new user");
      }

      console.log("🌐 API URL:", apiUrl);
      console.log("🔧 METHOD:", method);

      // Send to API
      const response = await fetch(apiUrl, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      console.log("📥 RESPONSE STATUS:", response.status);
      console.log("📥 RESPONSE OK:", response.ok);

      const result = await response.json();
      console.log("📄 FULL API RESPONSE:", result);

      // Check if save worked
      if (
        result.result === true ||
        result.success === true ||
        Array.isArray(result)
      ) {
        console.log("✅ Save successful, refreshing users...");

        // Refresh users list
        const usersResponse = await fetch(`${API_URL}/users`);
        const usersData = await usersResponse.json();
        console.log("🔄 Refreshed users:", usersData);

        // Format users for UI
        const formattedUsers = usersData.map((user) => ({
          id: user.userId,
          fullName: user.fullName,
          email: user.userName,
          role: user.userRole,
          isActive: user.status === "active",
        }));

        setUsers(formattedUsers);
        alert(editingUser ? "User updated!" : "User created!");
        setShowForm(false);
      } else {
        console.log("❌ Save failed, result:", result);
        alert("Failed: " + (result.message || "Unknown error"));
      }
    } catch (error) {
      console.error("💥 CATCH BLOCK ERROR:", error);
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      alert("Network error - check console for details");
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

        const result = await response.json();

        // Check if delete was successful
        if (result.result === true || result.success === true) {
          // Refresh the users list
          const usersResponse = await fetch(`${API_URL}/users`);
          const usersData = await usersResponse.json();

          // Format users for UI
          const formattedUsers = usersData.map((user) => ({
            id: user.userId,
            fullName: user.fullName,
            email: user.userName,
            role: user.userRole,
            isActive: user.status === "active",
          }));

          setUsers(formattedUsers);
          alert("User deleted successfully!");
        } else {
          alert(
            "Failed to delete user: " + (result.message || "Unknown error")
          );
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
              <button className="btn-edit" onClick={() => handleEdit(u)}>
                ✏️
              </button>
              <button className="btn-delete" onClick={() => handleDelete(u.id)}>
                🗑️
              </button>
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
