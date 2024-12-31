import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [userId, setUserId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
  
    try {
      const response = await fetch(`/api/check-user-id/${userId}/`, {
        method: "GET",
      });
  
      if (response.status === 403) {
        setError("Too many attempts. Please try again later.");
      } else if (response.status === 404) {
        setError("User ID does not exist. Please try again.");
      } else if (response.ok) {
        navigate(`/forgot-password-email/${userId}`); // Pass userId as a URL parameter
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div style={styles.container}>
      <img src="../../static/images/logo.png" alt="Logo" style={styles.logo} />
      <form onSubmit={handleSubmit} style={styles.form} autoComplete="off">
        <h2 style={styles.heading}>Forgot Password</h2>
        <input
          type="text"
          placeholder="Enter your User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          {loading ? "Processing..." : "Next"}
        </button>
          
        {/* Display Error Message */}
        {error && <p style={styles.error}>{error}</p>}
        
        {/* Back to Sign In Button */}
        <div style={styles.backButtonContainer}>
          <button onClick={() => navigate("/login")} style={styles.backButton}>
            Back to Sign in
          </button>
        </div>
      </form>

    </div>
  );
};

const styles = {
  container: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    backgroundColor: "#f4f4f9",
  },
  logo: {
    marginBottom: "20px",
    height: "80px",
  },
  form: {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "8px",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "400px",
    boxSizing: "border-box",
    position: "relative",
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "24px",
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    boxSizing: "border-box",
    marginBottom: "15px",
  },
  button: {
    width: "100%",
    padding: "10px 0",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
  },
  backButtonContainer: {
    textAlign: "center",
    marginTop: "10px",
  },
  backButton: {
    border: "none",
    backgroundColor: "white",
    color: "blue",
    cursor: "pointer",
    fontSize: "14px",
  },
  error: {
    color: "red",
    marginTop: "10px",
    textAlign: "center",
  },
};

export default ForgotPassword;
