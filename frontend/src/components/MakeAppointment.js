import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const MakeAppointment = () => {
  const [patient, setPatient] = useState('');
  const [physiotherapist, setPhysiotherapist] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [patientsList, setPatientsList] = useState([]);
  const [physiotherapistsList, setPhysiotherapistsList] = useState([]);
  const navigate = useNavigate();

  // Fetch patients and physiotherapists
  useEffect(() => {
    // Fetch patients
    fetch('/api/list-users/patients/')
        .then(response => response.json())
        .then(data => {
        setPatientsList(data.filter(patient => patient.user_type === 'patient')); // Adjusted filter
        })
        .catch(error => {
        console.error('Error fetching patients:', error);
        });

    // Fetch physiotherapists
    fetch('/api/list-users/physiotherapists/')
      .then(response => response.json())
      .then(data => {
        setPhysiotherapistsList(data.filter(doctor => doctor.user_type === 'doctor'));
      })
      .catch(error => {
        console.error('Error fetching physiotherapists:', error);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const appointmentData = {
      patient: patient,
      physiotherapist: physiotherapist,
      appointment_date: appointmentDate,
      appointment_time: appointmentTime,
      status: 'Pending', // Default status
    };

    fetch('/api/appointments/', {  // Make sure this is the correct endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken')  // Assuming you're using CSRF token
        },
        body: JSON.stringify(appointmentData),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          console.log('Appointment created:', data);
          navigate('/appointments');  // Redirect after successful creation
        })
        .catch(error => {
          console.error('Error creating appointment:', error);
        });
  };

  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }
  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Make Appointment</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Patient:</label>
          <select 
            value={patient} 
            onChange={(e) => setPatient(e.target.value)} 
            required 
            style={styles.input}
          >
            <option value="">Select a patient</option>
            {patientsList.map((p) => (
              <option key={p.id} value={p.id}>
                {p.username} {/* Assuming `username` contains the patient's name */}
              </option>
            ))}
          </select>
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Physiotherapist:</label>
          <select 
            value={physiotherapist} 
            onChange={(e) => setPhysiotherapist(e.target.value)} 
            required 
            style={styles.input}
          >
            <option value="">Select a physiotherapist</option>
            {physiotherapistsList.map((pt) => (
              <option key={pt.id} value={pt.id}>
                {pt.username} {/* Assuming `username` contains the physiotherapist's name */}
              </option>
            ))}
          </select>
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Appointment Date:</label>
          <input 
            type="date" 
            value={appointmentDate} 
            onChange={(e) => setAppointmentDate(e.target.value)} 
            required 
            style={styles.input} 
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Appointment Time:</label>
          <input 
            type="time" 
            value={appointmentTime} 
            onChange={(e) => setAppointmentTime(e.target.value)} 
            required 
            style={styles.input} 
          />
        </div>
        <button type="submit" style={styles.submitButton}>Continue</button>
      </form>
      <button onClick={() => navigate('/appointments')} style={styles.cancelButton}>Cancel</button>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
  },
  heading: {
    fontSize: '24px',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: '16px',
    marginBottom: '5px',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  submitButton: {
    padding: '10px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  cancelButton: {
    marginTop: '10px',
    padding: '10px',
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default MakeAppointment;
