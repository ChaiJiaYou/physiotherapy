import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("/api/list-users/")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched Users:", data); 
        setUsers(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setLoading(false);
      });
  }, []);

  const handleCreateUser = () => {
    navigate("/create-user");
  };

  const filteredUsers =
    users?.filter((user) =>
      (user?.username?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (user?.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (user?.contact_number || "").includes(searchTerm) ||
      (user?.id || "").toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  if (loading) {
    return <p>Loading users...</p>;
  }

  const capitalizeRole = (role) => {
    if (!role) return "N/A";
    return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
  };

  const displayValue = (value) => (value ? value : "N/A");

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>User Account Management</h2>
        <div style={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search by Username, Email, or Contact No"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
          <button onClick={handleCreateUser} style={styles.createButton}>
            Create Account
          </button>
        </div>
      </div>

      <table style={styles.table}>
        <thead>
          <tr style={styles.tr}>
            <th style={styles.th}>User ID</th>
            <th style={styles.th}>Username</th>
            <th style={styles.th}>Role</th>
            <th style={styles.th}>Create Date</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Email</th>
            <th style={styles.th}>Contact No</th>
            <th style={{...styles.th, ...styles.actionTh}}>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <tr key={user.username} style={styles.tr}>
                <td style={styles.td}>{user.id}</td>
                <td style={styles.td}>{displayValue(user.username)}</td>
                <td style={styles.td}>{capitalizeRole(user.user_type) || "N/A"}</td>
                <td style={styles.td}>{displayValue(user.date_joined)}</td>
                <td style={styles.td}>{user.is_active ? "Active" : "Deactive"}</td>
                <td style={styles.td}>{displayValue(user.email)}</td>
                <td style={styles.td}>{displayValue(user.contact_number)}</td>
                <td style={{...styles.td, ...styles.actionTd}}>
                  <button
                    style={styles.viewButton}
                    onClick={() => navigate(`/user-account-management/${user.id}`)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} style={styles.noUsersMessage}>
                No users available...
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

// Styles for the component
const styles = {
  container: {
    padding: "20px",
    fontFamily: "'Arial', sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  searchContainer: {
    display: "flex",
    alignItems: "center",
  },
  searchInput: {
    padding: "10px",
    marginRight: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    width: "270px",
  },
  createButton: {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
  },
  th: {
    padding: "12px",
    backgroundColor: "#f4f4f4",
    textAlign: "left",
    borderBottom: "2px solid #ddd",
    fontWeight: "bold",
  },
  actionTh: {
    textAlign: "center",
  },
  td: {
    padding: "12px",
    borderBottom: "1px solid #ddd",
  },
  actionTd: {
    textAlign: "center",
  },
  tr: {
    borderBottom: "1px solid #ddd",
  },
  viewButton: {
    padding: "5px 10px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  noUsersMessage: {
    textAlign: "center",
    padding: "20px",
    fontSize: "16px",
    color: "#999",
  },
};

export default UserManagement;
