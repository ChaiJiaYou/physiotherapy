import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const UserAccountPage = () => {
  const { username } = useParams(); // Ensure username is correctly captured
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch user details based on the username
  useEffect(() => {
    if (username) {  // Only proceed if username is defined
      fetch(`/api/user/${username}/`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          setUser(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching user details:", error);
        });
    } else {
      console.error("Username is undefined");
    }
  }, [username]);

  if (loading) return <p>Loading user details...</p>;
  if (error || !user) return <p>{error || 'User not found.'}</p>;
  
  return (
    <div style={styles.container}>

      <h2 style={styles.heading}>Profile</h2>

      <div style={styles.profileWrapper}>
        {/* Left Section: User Profile Picture and Change Image Button */}
        <div style={styles.leftSectionWrapper}>
          <h3 style={styles.subheading}>User Profile Picture</h3>
          <div style={styles.leftSection}>
            <img
              src="../../static/images/defaultAvatar.png"
              alt="Profile"
              style={styles.profileImage}
            />
            <button style={styles.changeImageButton}>Change Image</button>
          </div>
        </div>

        {/* Vertical Divider*/}
        <view style={styles.verticleLine} />

        {/* Right Section: User Details */}
        <div style={styles.rightSection}>
          <h3 style={styles.subheading}>Personal Information</h3>
          <div style={styles.infoGroup}>
            {renderField("UID", user.id, true)} {/* UID with grey background */}
            {renderField("IC", user.ic, true)} {/* IC with grey background */}
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
            <button style={styles.passwordButton}>Change Password</button>
            <button style={styles.actionButton}>Update Profile</button>
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
        border: label === 'Account Status' ? 'none' : '1px solid #ccc', // No border for Account Status
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
  subheading: {
    fontSize: '18px',
    margin: '0',
    marginBottom: '10px',
    textAlign: 'left',
    fontWeight: 'bold',
  },
  profileImage: {
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    marginBottom: '15px',
  },
  changeImageButton: {
    padding: '8px 16px',
    fontSize: '14px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
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
    maxWidth: '300px', // Adjust this value as needed
    overflow: 'hidden', // Hide overflowed content
    textOverflow: 'ellipsis', // Show ellipsis when content overflows
    whiteSpace: 'nowrap', // Prevent text from wrapping
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
  passwordButton: {
    padding: '10px 20px',
    backgroundColor: '#6c757d',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  actionButton: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default UserAccountPage;
