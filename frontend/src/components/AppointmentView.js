import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/appointments/")
      .then((response) => response.json())
      .then((data) => {
        setAppointments(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching appointments:", error);
        setLoading(false);
      });
  }, []);

  const handleMakeAppointment = () => {
    navigate("/make-appointment");
  };

  if (loading) {
    return <p>Loading appointments...</p>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>Appointments</h2>
        <button onClick={handleMakeAppointment} style={styles.makeAppointmentButton}>
          Make Appointment
        </button>
      </div>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Patient Name</th>
            <th style={styles.th}>Created Date</th>
            <th style={styles.th}>Appointment Date/Time</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Action</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment) => (
            <tr key={appointment.id} style={styles.tr}>
              <td style={styles.td}>{appointment.patient_name}</td>
              <td style={styles.td}>
                {new Date(appointment.created_at).toLocaleDateString()}
              </td>
              <td style={styles.td}>
                {appointment.appointment_date} {appointment.appointment_time}
              </td>
              <td style={styles.td}>{appointment.status}</td>
              <td style={styles.td}>
                <button style={styles.viewButton}>View</button>
                <button style={styles.cancelButton}>Cancel</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

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
  makeAppointmentButton: {
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
  td: {
    padding: "12px",
    borderBottom: "1px solid #ddd",
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
  cancelButton: {
    padding: "5px 10px",
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginLeft: "10px",
  },
};

export default Appointments;
