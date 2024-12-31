import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function LoginPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    showPassword: false,
  });

  const [error, setError] = useState({
    username: '',
    password: '',
    credentials: '',
  });

  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // Clear errors on input change
    setError({
      ...error,
      [e.target.name]: '',
      credentials: '',
    });
  };

  // Toggle password visibility
  const toggleShowPassword = () => {
    setFormData({
      ...formData,
      showPassword: !formData.showPassword,
    });
  };

  // Function to get the CSRF token
  const getCSRFToken = () => {
    let csrfToken = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, 10) === 'csrftoken=') {
          csrfToken = decodeURIComponent(cookie.substring(10));
          break;
        }
      }
    }
    return csrfToken;
  };

  // Handle form submission
  // Handle form submission
const handleSubmit = (e) => {
  e.preventDefault();

  // Client-side validation
  if (!formData.username || !formData.password) {
    setError({
      username: formData.username ? '' : 'This field is Required',
      password: formData.password ? '' : 'This field is Required',
      credentials: '',
    });
    return;
  }

  // Call backend API for login
  fetch('/api/login/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCSRFToken(),
    },
    body: JSON.stringify({
      username: formData.username,
      password: formData.password,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Login response:", data);
      if (data.success) {
        console.log("Username:", data.username);
        console.log("Role:", data.role);
        
        // Store username and role in localStorage
        localStorage.setItem('username', data.username);
        localStorage.setItem('role', data.role);

        // Navigate based on role
        if (data.role === "admin") {
          navigate('/user-management');
        } else if (data.role === "patient" || data.role === "doctor") {
          navigate(`/user-account/${data.username}`);
        } else {
          console.error("Unknown role. Defaulting to user management.");
          navigate('/user-management'); // Fallback for unknown roles
        }
      } else {
        setError((prev) => ({
          ...prev,
          credentials: 'Invalid Username or Password',
        }));
      }
    })
    .catch(() => {
      setError((prev) => ({
        ...prev,
        credentials: 'Something went wrong. Please try again.',
      }));
    });
  };

  return (
    <div style={styles.container}>
      <img src="../../static/images/logo.png" alt="Logo" style={styles.logo} />
      <form onSubmit={handleSubmit} style={styles.form} autocomplete="off">
        <h2 style={styles.heading}>Login</h2>

        {/* Credentials error message */}
        {error.credentials && (
          <p style={styles.credentialsError}>{error.credentials}</p>
        )}

        <div style={styles.formGroup}>
          <label htmlFor="username" style={styles.label}>Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            autocomplete='off'
            style={{
              ...styles.input,
              borderColor: error.username ? 'red' : '#ccc',
            }}
            placeholder="Enter your username"
          />
          {error.username && <p style={styles.errorText}>{error.username}</p>}
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="password" style={styles.label}>Password</label>
          <div style={styles.passwordWrapper}>
            <input
              type={formData.showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={{
                ...styles.input,
                borderColor: error.password ? 'red' : '#ccc',
              }}
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={toggleShowPassword}
              style={styles.eyeIcon}
            >
              👁️
            </button>
          </div>
          {error.password && <p style={styles.errorText}>{error.password}</p>}
        </div>

        <div style={styles.forgotPassword}>
          <Link to="/forgot-password" style={styles.link}>Forgot Password?</Link>
          {/* <a href="/forgot-password" style={styles.link}>Forgot Password?</a> */}
        </div>

        

        <button type="submit" style={styles.submitButton}>Login</button>
      </form>
    </div>
  );
}

// CSS styles
const styles = {
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f4f4f9',
  },
  logo: {
    marginBottom: '20px',
    height: '80px',
  },
  form: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px',
    boxSizing: 'border-box',
    textAlign: 'left',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '20px',
    fontSize: '24px',
    fontWeight: 'bold',
  },
  formGroup: {
    marginBottom: '15px',
    width: '100%',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    boxSizing: 'border-box',
  },
  passwordWrapper: {
    position: 'relative',
    width: '100%',
  },
  eyeIcon: {
    position: 'absolute',
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  },
  forgotPassword: {
    textAlign: 'right',
    marginBottom: '12px',
  },
  link: {
    color: '#007bff',
    textDecoration: 'none',
  },
  submitButton: {
    width: '100%',
    padding: '10px 0',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: '12px',
    marginTop: '5px',
    textAlign: 'left',
  },
  credentialsError: {
    color: 'red',
    textAlign: 'center',
    marginBottom: '15px',
  },
};

export default LoginPage;
