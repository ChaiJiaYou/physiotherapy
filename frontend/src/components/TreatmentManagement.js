import React, { useState, useEffect } from 'react';
import { Avatar, Button, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';

const TreatmentManagement = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [treatments, setTreatments] = useState([]);

  useEffect(() => {
    // Fetch patients and set state
    fetch('/api/patients/')
      .then((response) => response.json())
      .then((data) => setPatients(data))
      .catch((error) => console.error('Error fetching patients:', error));

    // Fetch treatments for the selected patient
    if (selectedPatient) {
      fetch(`/api/treatments/?patient=${selectedPatient}`)
        .then((response) => response.json())
        .then((data) => setTreatments(data))
        .catch((error) => console.error('Error fetching treatments:', error));
    }
  }, [selectedPatient]);

  const handlePatientClick = (patient) => {
    setSelectedPatient(patient.id);
  };

  return (
    <div style={styles.container}>
      {/* Patient section */}
      <div style={styles.patientSection}>
        <h3 style={styles.patientTitle}>Patient</h3>
        <div style={styles.avatarContainer}>
          {patients.map((patient) => (
            <div key={patient.id} style={styles.patientItem} onClick={() => handlePatientClick(patient)}>
              <Avatar src="../../static/images/defaultAvatar.png" style={styles.avatar} />
              <p style={styles.patientName}>{patient.username}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Treatment section */}
      <div style={styles.treatmentSection}>
        <div style={styles.treatmentHeader}>
          <h3 style={styles.treatmentTitle}>Treatment Management</h3>
          <Button variant="contained" color="primary" style={styles.createButton}>
            Create Treatment
          </Button>
        </div>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Treatment Name</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Frequency per Day</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Exercise No.</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {treatments.map((treatment) => (
              <TableRow key={treatment.id}>
                <TableCell>{treatment.name}</TableCell>
                <TableCell>{treatment.date}</TableCell>
                <TableCell>{treatment.duration}</TableCell>
                <TableCell>{treatment.frequencyPerDay}</TableCell>
                <TableCell>{treatment.status}</TableCell>
                <TableCell>{treatment.exerciseNo}</TableCell>
                <TableCell>
                  <Button variant="contained" color="success">View</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    padding: '20px',
    gap: '20px',
  },
  patientSection: {
    textAlign: 'left',
    marginBottom: '20px',
  },
  avatarContainer: {
    display: 'flex',
    justifyContent: 'flex-start', // Align the avatars to the left
    gap: '20px',
  },
  patientItem: {
    cursor: 'pointer',
    textAlign: 'center',
  },
  avatar: {
    width: '80px',
    height: '80px',
  },
  patientName: {
    marginTop: '10px',
    fontWeight: 'bold',
  },
  treatmentSection: {
    width: '100%',
  },
  treatmentHeader: {
    display: 'flex',
    justifyContent: 'space-between', // Align title to the left and button to the right
    alignItems: 'center',
  },
  createButton: {
    marginBottom: '20px',
  },
};

export default TreatmentManagement;
