import React, { useEffect, useState } from "react";
import "../../styles/global.css";
import "../../styles/user-management.css";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;


///££££Achini work ##########
export default function UserManagementPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
   const navigate = useNavigate();

  type User = {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: string;
  isActive: boolean;
};

const [users, setUsers] = useState<User[]>([]);


  //########### amila work ##########

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "staff",
    isActive: true,
  });
  //######### Fetch users from backend

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/users`);

        const json = await response.json();
        const users = json.data ?? json; // supports both formats array or { data: [...] }

        const formattedUsers = users.map((user: any) => ({
          id: user.userId, //Use actual userId from API-change use of index
          fullName: user.fullName,
          email: user.userName,
          phoneNumber: user.phoneNumber,
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
    // Reset form for new user
    setEditingUser(null);
    setFormData({
      fullName: "",
      email: "",
      phoneNumber: "",
      password: "",
      role: "staff",
      isActive: true,
    });
    setShowForm(true);
  };

  const handleEdit = (user: any) => {
    // Populate form with existing user data
    setEditingUser(user);
    setFormData({
      fullName: user.fullName,
      email: user.email, // From formated users state
      phoneNumber: user.phoneNumber || "",
      password: "", // Leave empty — editing shouldn’t show old password
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
        userName: formData.email,
        fullName: formData.fullName,
        userRole: formData.role,
        isActive: formData.isActive ? "active" : "inactive",
        phoneNumber: formData.phoneNumber || "",
        ...(formData.password ? { password: formData.password } : {}), //  Only include if not empty
      };

      console.log("SENDING DATA:", requestData);

      let apiUrl, method;

      if (editingUser) {
        apiUrl = `${API_URL}/users/${editingUser.id}`;
        method = "PUT";
        console.log("UPDATING user ID:", editingUser.id);
      } else {
        apiUrl = `${API_URL}/users`;
        method = "POST";
        console.log("CREATING new user");
      }

      console.log("API URL:", apiUrl);
      console.log("METHOD:", method);

      // Send to API
      const response = await fetch(apiUrl, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      console.log("RESPONSE STATUS:", response.status);
      console.log("RESPONSE OK:", response.ok);

      const result = await response.json();
      console.log("FULL API RESPONSE:", result);

      // Check if save worked
      if (
        result.result === true ||
        result.success === true ||
        Array.isArray(result)
      ) {
        console.log("Save successful, refreshing users...");

        // Refresh users list
        const usersResponse = await fetch(`${API_URL}/users`);
        const usersData = await usersResponse.json();
        console.log("Refreshed users:", usersData);

        // Format users for UI
        const formattedUsers = usersData.map((user: any) => ({

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
        console.log("Save failed, result:", result);
        alert("Failed: " + (result.message || "Unknown error"));
      }
    } catch (error) {
      console.error("CATCH BLOCK ERROR:", error);
     if (error instanceof Error) {
  console.error("Error name:", error.name);
  console.error("Error message:", error.message);
} else {
  console.error("Unknown error:", error);
}

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
          const formattedUsers = usersData.map((user: any) => ({

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
    <>
    <div className="user-management-container">

  <button className="back-btn" onClick={() => navigate("/dashboard")}>
    ← Back to Dashboard
  </button>

      <h2>User Management</h2>
      <p className="page-subtitle">
  Manage employee accounts and permissions
</p>


      <div className="user-filter-bar">
  <input
    type="text"
    className="user-search-input"
    placeholder="Search by name or email..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />
  <button className="btn-primary" onClick={handleAdd}>
    + Add User
  </button>
</div>

      {/* ===== Table Header ===== */}
      <div className="user-table-container">

  <div className="user-list-header">
    <span>Email</span>
    <span>Full Name</span>
    <span>Role</span>
    <span>Status</span>
    <span>Actions</span>
  </div>

  <div className="user-list-scroll">
    {filteredUsers.map((u: User) => (
      <div key={u.id} className="user-item">
        <span>{u.email}</span>
        <span>{u.fullName}</span>
        <span>{u.role}</span>
        <span>{u.isActive ? "Active" : "Inactive"}</span>

        <div className="user-actions">
          <button className="action-btn edit" onClick={() => handleEdit(u)}>✏️</button>
          <button className="action-btn delete" onClick={() => handleDelete(u.id)}>🗑️</button>
        </div>
      </div>
    ))}
  </div>

</div>


      {showForm && (
  <div className="modal-overlay">
    <div className="modal">

      <h3 className="modal-title">
        {editingUser ? "Edit User" : "Add New User"}
      </h3>

      <div className="form-grid">

        <div className="form-group">
          <label>Full Name *</label>
          <input
            value={formData.fullName}
            onChange={(e) =>
              setFormData({ ...formData, fullName: e.target.value })
            }
          />
        </div>

        <div className="form-group">
          <label>Email *</label>
          <input
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder={
              editingUser ? "Leave blank to keep password" : "Password *"
            }
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
        </div>

        <div className="form-group">
          <label>Phone Number</label>
          <input
            value={formData.phoneNumber}
            onChange={(e) =>
              setFormData({ ...formData, phoneNumber: e.target.value })
            }
          />
        </div>

        <div className="form-group">
          <label>Role</label>
          <select
            value={formData.role}
            onChange={(e) =>
              setFormData({ ...formData, role: e.target.value })
            }
          >
            <option value="owner">Owner</option>
            <option value="staff">Staff</option>
          </select>
        </div>

        <div className="form-group">
          <label>Status</label>
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
        </div>

      </div>

      <div className="modal-actions">
        <button className="btn-primary" onClick={handleSave}>
          {loading ? "Saving..." : "Save User"}
        </button>
        <button className="btn-cancel" onClick={() => setShowForm(false)}>
          Cancel
        </button>
      </div>

    </div>
  </div>
)}

    </div>
    </>
  );
}