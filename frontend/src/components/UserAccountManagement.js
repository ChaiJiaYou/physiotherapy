import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const UserAccountManagement = () => {
  const { userId } = useParams(); // Retrieve userId from URL
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user details based on userId
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`/api/get-user/${userId}/`);
        const data = await response.json();

        if (response.ok) {
          setUser(data);
        } else {
          setError("Failed to fetch user details.");
        }
      } catch (error) {
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId]);

  if (loading) return <p>Loading user details...</p>;
  if (error) return <p>{error}</p>;

  const handleDeleteAccount = async () => {
    try {
        const response = await fetch(`/api/delete-user/${userId}/`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCookie("csrftoken"), // Include CSRF token in headers
            },
        });

        if (response.ok) {
            alert("Account deleted successfully.");
            navigate("/user-management"); // Redirect on success
        } else {
            const data = await response.json();
            console.error(data);
            alert(data.error || "Failed to delete account.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Failed to delete account");
    }
};



  const handleDeactivateAccount = () => {
    // Logic to deactivate account
    ////////////////////////////////
    console.log("Account deactivated");
  };

  const goBack = () => {
    navigate(-1);
  };

  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
        const cookies = document.cookie.split("; ");
        for (let cookie of cookies) {
            const [cookieName, cookieVal] = cookie.split("=");
            if (cookieName === name) {
                cookieValue = decodeURIComponent(cookieVal);
                break;
            }
        }
    }
    return cookieValue;
  }

  return (
    <div style={styles.container}>
      <button onClick={goBack} style={styles.backButton}>
        <span>&#8592;</span>
      </button>

      <h2 style={styles.heading}>User Account</h2>

      <div style={styles.profileWrapper}>
        <div style={styles.leftSectionWrapper}>
          <div style={styles.leftSection}>
            <img
              src="../../static/images/defaultAvatar.png"
              alt="Profile"
              style={styles.profileImage}
            />
          </div>
            <div style={styles.buttonGroup}>
              <button style={styles.deleteButton} onClick={handleDeleteAccount}>
                Delete Account
              </button>
          </div>
        </div>

        <view style={styles.verticleLine} />

        <div style={styles.rightSection}>
          <div style={styles.infoGroup}>
            {renderField("UID", user.id, true)}
            {renderField("IC", user.ic, true)}
            {renderField("Name", user.username)}
            {renderField("Contact Number", user.contact_number)}
            {renderField("Email Address", user.email)}
            {renderField("Home Address", user.home_address)}
            {renderField(
              "Account Status",
              user.is_active ? "Active" : "Inactive",
              false,
              user.is_active ? styles.activeStatus : styles.inactiveStatus
            )}
          </div>

          <div style={styles.buttonGroup}>
            <button style={styles.updateButton}>Update Profile</button>
            <button style={styles.deactivateButton} onClick={handleDeactivateAccount}>Deactivate Account</button>
          </div>
        
        </div>
      </div>
    </div>
  );
};

const renderField = (label, value, greyBackground = false, customStyle = {}) => (
  <div style={styles.fieldWrapper}>
    <label style={styles.label}>{label}:</label>
    <p
      style={{
        ...styles.value,
        backgroundColor: greyBackground ? '#f1f1f1' : 'white',
        border: label === 'Account Status' ? 'none' : '1px solid #ccc',
        ...customStyle,
      }}
    >
      {value || 'N/A'}
    </p>
  </div>
);

// Styles for the component
const styles = {
  container: {
    height: '100%',
    padding: '20px 50px',
    fontFamily: 'Arial, sans-serif',
    margin: '0 auto',
    border: '1px solid #ccc',
    borderRadius: '8px',
  },
  backButton: {
    top: "10px",
    left: "10px",
    fontSize: "24px",
    cursor: "pointer",
    border: "none",
    background: "none",
    color: "#333",
  },
  heading: {
    marginTop: '8px',
    fontSize: '32px',
    fontWeight: 'bold',
    marginBottom: '10px',
    textAlign: 'left',
  },
  profileWrapper: {
    display: 'flex',
    gap: '0',
  },
  leftSectionWrapper: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    textAlign: 'center',
    paddingRight: '10px',
  },
  leftSection: {
    height: "100%",
    width: "100%",
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  verticleLine: {
    position: 'relative',
    top : '22px',
    width: '2px',
    backgroundColor: '#A0A0A0',
  },
  rightSection: {
    flex: '2',
    paddingLeft: '25px',
  },
  profileImage: {
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    marginBottom: '15px',
  },
  infoGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  fieldWrapper: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  label: {
    fontWeight: '600',
    width: '150px',
  },
  value: {
    flex: 1,
    marginLeft: '10px',
    backgroundColor: 'white',
    padding: '8px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    color: '#A9A9A9',
    fontFamily :'sans-serif',
    maxWidth: '300px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  activeStatus: {
    color: 'green',
    fontWeight: 'bold',
  },
  inactiveStatus: {
    color: 'red',
    fontWeight: 'bold',
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    marginTop: '20px',
  },
  deleteButton: {
    padding: '10px 20px',
    backgroundColor: 'red',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  updateButton: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  deactivateButton: {
    padding: '10px 20px',
    backgroundColor: '#6c757d',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default UserAccountManagement;
