import { height, padding, width } from "@mui/system";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateUserAccount() {
  const [formData, setFormData] = useState({
    ic: "",
    name: "",
    contactNumber: "",
    emailAddress: "",
    homeAddress: "",
    role: "patient",
  });

  const [userCredentials, setUserCredentials] = useState(null); // Store user ID and password
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

    // Function to generate a random password
  const generateRandomPassword = () => {
      const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let password = "";
      for (let i = 0; i < 8; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return password;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const generatedPassword = generateRandomPassword();

    fetch("/api/create-user/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie("csrftoken"),
      },
      body: JSON.stringify({
        username: formData.name,
        ic: formData.ic,
        contact_number: formData.contactNumber,
        email: formData.emailAddress,
        home_address: formData.homeAddress,
        user_type: formData.role,
        password: generatedPassword,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        setUserCredentials({ id: data.id, password: generatedPassword }); // Store user credentials
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("There was an error creating the user.");
      });
  };

  const goBack = () => {
    navigate(-1);
  };

  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === name + "=") {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  return (
    <div style={styles.container}>
      {userCredentials && (
        <div style={styles.modal}>
          <h3>User Created Successfully!</h3>
          <p>
            <strong>User ID:</strong> {userCredentials.id}
          </p>
          <p>
            <strong>Password:</strong> {userCredentials.password}
          </p>
          <button
            onClick={() => navigate("/user-management")}
            style={styles.closeButton}
          >
            Close
          </button>
        </div>
      )}

      <button onClick={goBack} style={styles.backButton}>
        <span>&#8592;</span>
      </button>
      <h2 style={styles.heading}>Create User Account</h2>
      <form onSubmit={handleSubmit} style={styles.form} autoComplete="off">
        <div style={styles.formGroup}>
          <label style={styles.label}>IC (without '-' ):</label>
          <input
            type="text"
            name="ic"
            value={formData.ic}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, ""); // Allow only digits
              if (value.length <= 16) {
                setFormData({ ...formData, ic: value });
              }
            }}
            style={styles.input}
            required
            pattern="\d{16}" // HTML pattern to enforce exactly 16 digits
            title="IC must contain exactly 16 digits"
            autoComplete="off"
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            style={styles.input}
            required
            autoComplete="off"
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Contact Number:</label>
          <input
            type="text"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            style={styles.input}
            required
            autoComplete="new-password"
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Email Address:</label>
          <input
            type="email"
            name="emailAddress"
            value={formData.emailAddress}
            onChange={handleChange}
            style={styles.input}
            required
            autoComplete="new-password"
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Home Address:</label>
          <input
            type="text"
            name="homeAddress"
            value={formData.homeAddress}
            onChange={handleChange}
            style={styles.input}
            required
            autoComplete="new-password"
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Role:</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            style={styles.input}
            required
          >
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div style={styles.buttonGroup}>
          <button type="submit" style={styles.confirmButton}>
            Confirm
          </button>
        </div>
      </form>
    </div>
  );
}

const styles = {
  container: {
    width: "100%",
    height: "100%",
    margin: "auto",
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
    boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
    justifyContent: "flex-start",
    position: "relative",
    padding: "20px",
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
    textAlign: "left",
    marginBottom: "30px",
    fontSize: "24px",
    fontWeight: "bold",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    width: "500px",
  },
  formGroup: {
    display: "flex",
    justifyContent: "flex-start",
    marginBottom: "15px",
  },
  label: {
    width: "150px",
    textAlign: "left",
    paddingRight: "10px",
  },
  input: {
    width: "60%",
    padding: "8px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "20px",
  },
  confirmButton: {
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "16px",
  },
  modal: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.3)",
    zIndex: 1000,
  },
  closeButton: {
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "16px",
  },
};

export default CreateUserAccount;
