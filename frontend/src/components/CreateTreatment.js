import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CreateTreatment = () => {
  const [treatmentName, setTreatmentName] = useState("");
  const [date, setDate] = useState("");
  const [duration, setDuration] = useState("");
  const [frequencyPerDay, setFrequencyPerDay] = useState(1);
  const [patientsList, setPatientsList] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all patients for the dropdown
    fetch("/api/list-patients/")
      .then((response) => response.json())
      .then((data) => {
        setPatientsList(data);
      })
      .catch((error) => {
        console.error("Error fetching patients:", error);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const treatmentData = {
      patient: selectedPatient, // use patient ID
      treatment_name: treatmentName,
      date: date,
      duration: duration,
      frequency_per_day: frequencyPerDay,
    };

    // Submit treatment data
    fetch("/api/treatments/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(treatmentData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Treatment created:", data);
        navigate("/treatments"); // Redirect back to the treatment list
      })
      .catch((error) => {
        console.error("Error creating treatment:", error);
      });
  };

  return (
    <div style={styles.container}>
      <h2>Create Treatment</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label>
          Patient:
          <select
            value={selectedPatient}
            onChange={(e) => setSelectedPatient(e.target.value)}
            style={styles.input}
            required
          >
            <option value="">Select a Patient</option>
            {patientsList.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.username}
              </option>
            ))}
          </select>
        </label>
        <label>
          Treatment Name:
          <input
            type="text"
            value={treatmentName}
            onChange={(e) => setTreatmentName(e.target.value)}
            style={styles.input}
            required
          />
        </label>
        <label>
          Date:
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={styles.input}
            required
          />
        </label>
        <label>
          Duration:
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            style={styles.input}
            required
            min="1"
          />
        </label>
        <label>
          Frequency per Day:
          <input
            type="number"
            value={frequencyPerDay}
            onChange={(e) => setFrequencyPerDay(e.target.value)}
            style={styles.input}
            required
            min="1"
          />
        </label>
        <div style={styles.buttonGroup}>
          <button
            type="button"
            onClick={() => navigate("/treatments")}
            style={styles.cancelButton}
          >
            Cancel
          </button>
          <button type="submit" style={styles.continueButton}>
            Continue
          </button>
        </div>
      </form>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    maxWidth: "600px",
    margin: "0 auto",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    marginBottom: "10px",
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "space-between",
  },
  cancelButton: {
    padding: "10px 20px",
    backgroundColor: "#6c757d",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  continueButton: {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default CreateTreatment;


