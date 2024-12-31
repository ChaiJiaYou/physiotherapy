import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ForgotPasswordEmail = () => {
  const { userId } = useParams(); // Retrieve userId from the URL
  const [email, setEmail] = useState("");
  const [maskedEmail, setMaskedEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch email based on userId
  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const response = await fetch(`/api/get-email/${userId}/`); // Ensure backend endpoint is set up
        const data = await response.json();

        if (response.ok && data.email) {
          setEmail(data.email);
          setMaskedEmail(maskEmail(data.email));
        } else {
          setError(data.error || "Failed to fetch email.");
        }
      } catch (error) {
        setError("Something went wrong. Please try again.");
      }
    };

    fetchEmail();
  }, [userId]);

  // Function to mask the email
  const maskEmail = (email) => {
    const [localPart, domain] = email.split("@");
    return `${localPart[0]}****${localPart.slice(-1)}@${domain}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/forgot-password/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, email }), // Send userId and email
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setError("");
      } else {
        setError(data.error || "Failed to verify email. Please try again.");
        setMessage("");
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
      setMessage("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <img src="../../static/images/logo.png" alt="Logo" style={styles.logo} />
      <form onSubmit={handleSubmit} style={styles.form} autoComplete="off">
        <h2 style={styles.heading}>Forgot Password</h2>
        <p style={styles.emailHint}>Email associated with User ID: {maskedEmail}</p>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          {loading ? "Processing..." : "Submit"}
        </button>

        <div style={styles.backButtonContainer}>
          <button onClick={() => navigate("/forgot-password")} style={styles.backButton}>
            Back to User ID
          </button>
        </div>
      </form>

      {message && <p style={styles.success}>{message}</p>}
      {error && <p style={styles.error}>{error}</p>}
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
  emailHint: {
    fontSize: "16px",
    color: "#555",
    marginBottom: "15px",
    textAlign: "center",
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
  success: {
    color: "green",
    marginTop: "10px",
  },
  error: {
    color: "red",
    marginTop: "10px",
    textAlign: "center",
  },
};

export default ForgotPasswordEmail;
