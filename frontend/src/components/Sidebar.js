import React from "react";
import { List, ListItem, ListItemText, Avatar, Button } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";

const Sidebar = () => {
  const username = localStorage.getItem("username"); // Get username from localStorage
  const userRole = localStorage.getItem("role");     // Get role from localStorage
  const navigate = useNavigate();
  const profileImage = "/../images/defaultAvatar.png"; // Path to default profile image

  // Logout function
  const handleLogout = () => {
    // Clear the local storage
    localStorage.removeItem("username");
    localStorage.removeItem("role");

    // Redirect to the login page
    navigate("/login");
  };

  const renderMenuItems = () => {
    if (userRole === "admin") {
      return (
        <>
          <ListItem button style={styles.listItem}>
            <Link to={`/user-account/${username}`} style={styles.link}><ListItemText primary="Profile" /></Link>
          </ListItem>
          <ListItem button style={styles.listItem}>
            <Link to="/user-management" style={styles.link}><ListItemText primary="User Account Management" /></Link>
          </ListItem>
          <ListItem button style={styles.listItem}>
            <Link to="/patient-assign" style={styles.link}><ListItemText primary="Patient Assign" /></Link>
          </ListItem>
        </>
      );
    } else if (userRole === "doctor") {
      return (
        <>
          <ListItem button style={styles.listItem}>
            <Link to={`/user-account/${username}`} style={styles.link}><ListItemText primary="Profile" /></Link>
          </ListItem>
          <ListItem button style={styles.listItem}>
            <Link to="/exercise-monitoring" style={styles.link}><ListItemText primary="Exercise Monitoring" /></Link>
          </ListItem>
          <ListItem button style={styles.listItem}>
            <Link to="/treatment-management" style={styles.link}><ListItemText primary="Treatment" /></Link>
          </ListItem>
          <ListItem button style={styles.listItem}>
            <Link to="/appointments" style={styles.link}><ListItemText primary="Appointment" /></Link>
          </ListItem>
          <ListItem button style={styles.listItem}>
            <Link to="/chat" style={styles.link}><ListItemText primary="Chat" /></Link>
          </ListItem>
        </>
      );
    } else if (userRole === "patient") {
      return (
        <>
          <ListItem button style={styles.listItem}>
            <Link to={`/user-account/${username}`} style={styles.link}><ListItemText primary="Profile" /></Link>
          </ListItem>
          <ListItem button style={styles.listItem}>
            <Link to="/exercise-monitoring" style={styles.link}><ListItemText primary="Exercise" /></Link>
          </ListItem>
          <ListItem button style={styles.listItem}>
            <Link to="/treatment-management" style={styles.link}><ListItemText primary="Treatment" /></Link>
          </ListItem>
          <ListItem button style={styles.listItem}>
            <Link to="/appointments" style={styles.link}><ListItemText primary="Appointment" /></Link>
          </ListItem>
          <ListItem button style={styles.listItem}>
            <Link to="/chat" style={styles.link}><ListItemText primary="Chat" /></Link>
          </ListItem>
        </>
      );
    } else {
      return (
        <ListItem button style={styles.listItem}>
          <ListItemText primary="No menu available" />
        </ListItem>
      );
    }
  };

  return (
    <div style={styles.sidebar}>
      <div style={styles.profileSection}>
        <Avatar src={profileImage} alt="Profile Picture" style={styles.avatar} />
        <div>
          <p style={styles.username}>{username || "Guest"}</p>
          <p style={styles.role}>{userRole || "No Role"}</p>
        </div>
      </div>
      <List style={styles.list}>
        {renderMenuItems()}

        {/* Add the Logout button as the last ListItem */}
        <ListItem button onClick={handleLogout} style={styles.logoutListItem}>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </div>
  );
};

const styles = {
  sidebar: {
    width: "250px",
    backgroundColor: "#f4f4f4",
    padding: "20px",
    borderRight: "1px solid #ddd",
    height: "100vh", // Fill the height of the viewport
    display: "flex",
    flexDirection: "column",
  },
  profileSection: {
    display: "flex",
    alignItems: "center",
    marginBottom: "20px",
  },
  avatar: {
    width: "60px",
    height: "60px",
    marginRight: "15px",
  },
  username: {
    fontSize: "16px",
    fontWeight: "bold",
    margin: 0,
  },
  role: {
    fontSize: "14px",
    color: "#666",
    margin: 0,
  },
  list: {
    flexGrow: 1, // This makes sure that the ListItem components take available space, pushing the logout button to the bottom
  },
  listItem: {
    padding: "8px 16px 8px 0",
    cursor: "pointer", // Set the cursor to pointer when hovering over list items
  },
  link: {
    textDecoration: "none",
    color: "inherit",
    padding: "0 0 0 16px"
  },
  logoutListItem: {
    marginTop: "auto", // Ensures the logout button stays at the bottom
    color: "red",
    position: "absolute",
    bottom: "30px", // Make the logout button distinct
    cursor: "pointer",
  },
};

export default Sidebar;
