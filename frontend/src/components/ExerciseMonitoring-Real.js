import React, { useState, useRef } from "react";
import Webcam from "react-webcam";
import { Button, Tabs, Tab, Box } from "@mui/material";
import axios from "axios";

const ExerciseMonitoringReal = () => {
  const [tab, setTab] = useState(0);
  const [reps, setReps] = useState(1);
  const [sets, setSets] = useState(1);
  const [poseData, setPoseData] = useState(null);
  const webcamRef = useRef(null);

  // Function to handle tab change
  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  // Function to capture frame and send it to the backend
  const analyzePose = async () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      const blob = dataURItoBlob(imageSrc);

      const formData = new FormData();
      formData.append("image", blob, "frame.jpg");

      try {
        const response = await axios.post("http://127.0.0.1:8000/pose-detection/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setPoseData(response.data.keypoints); // Update pose data
        console.log("Pose Data:", response.data.keypoints); // Log for debugging
      } catch (error) {
        console.error("Error analyzing pose:", error);
      }
    }
  };

  // Helper function to convert base64 image to Blob
  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(",")[1]);
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  return (
    <div style={styles.container}>
      {/* Header Section */}
      <div style={styles.header}>
        <h2>Exercise</h2>
        <Tabs
          value={tab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          style={styles.tabs}
        >
          <Tab label="Progress" />
          <Tab label="History" />
        </Tabs>
        <Button variant="contained" color="primary" style={styles.startButton} onClick={analyzePose}>
          Analyze Pose
        </Button>
      </div>

      {/* Main Section */}
      <div style={styles.mainSection}>
        {/* Left Part: Webcam and Prescribed Exercises */}
        <div style={styles.leftContainer}>
          <div style={styles.webcamContainer}>
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              style={styles.webcam}
            />
          </div>
          <div style={styles.prescribedExercises}>
            <h4>Prescribed Exercises</h4>
            <div style={styles.exerciseList}>
              <Box style={styles.exerciseBox}>
                <p>Exercise 1: Knee Bends</p>
                <p>Perform 3 sets of 15 reps</p>
                <p style={styles.completedStatus}>Status: Completed</p>
              </Box>
              <Box style={styles.exerciseBox}>
                <p>Exercise 2: Arm Raises</p>
                <p>Perform 2 sets of 20 reps</p>
                <p style={styles.inProgressStatus}>Status: In Progress</p>
              </Box>
              {/* Add more exercises as needed */}
            </div>
          </div>
        </div>

        {/* Right Part: Exercise Data */}
        <div style={styles.exerciseData}>
          <h3>Reps: {reps}/30</h3>
          <h3>Sets: {sets}/2</h3>
          <img
            src="../static/images/unavailable-image.jpg"
            alt="Exercise Thumbnail"
            style={styles.exerciseThumbnail}
          />
          <p style={styles.exerciseName}>Arm Raises</p>
          {poseData && (
            <div>
              <h4>Pose Data:</h4>
              <pre>{JSON.stringify(poseData, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    overflow: "hidden",
    fontFamily: "Arial, sans-serif",
    width: "100%",
    boxSizing: "border-box",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 20px",
    borderBottom: "1px solid #ddd",
  },
  tabs: {
    marginLeft: "20px",
  },
  startButton: {
    backgroundColor: "#007bff",
    color: "white",
  },
  mainSection: {
    display: "flex",
    flex: 1,
    padding: "20px",
  },
  leftContainer: {
    flex: 3,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  webcamContainer: {
    width: "100%",
    maxWidth: "696px", // Limit the width for responsive design
    height: "100%",
    backgroundColor: "#f5f5f5",
    borderRadius: "8px",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "20px",
  },
  webcam: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  prescribedExercises: {
    width: "100%",
    maxWidth: '1120px',
    backgroundColor: "#f8f9fa",
    boxShadow: "0 -2px 8px rgba(0, 0, 0, 0.1)",
    borderTop: "1px solid #ddd",
    borderRadius: "8px",
    padding: "20px",
    
  },
  exerciseList: {
    display: "flex",
    flexDirection: "row",
    overflowX: "auto",
    padding: "10px 0",
  },
  exerciseBox: {
    minWidth: "200px", // Minimum width for each exercise box
    padding: "10px",
    marginRight: "10px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
    textAlign: "left",
    flexShrink: 0, // Prevent shrinking when scrolled horizontally
  },
  exerciseData: {
    flex: 1,
    textAlign: "center",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd",
  },
  exerciseThumbnail: {
    width: "100px",
    height: "100px",
    marginTop: "10px",
  },
  exerciseName: {
    fontSize: "16px",
    fontWeight: "bold",
    marginTop: "10px",
  },
  completedStatus: {
    color: "green",
    fontWeight: "bold",
  },
  inProgressStatus: {
    color: "orange",
    fontWeight: "bold",
  },
  notStartedStatus: {
    color: "red",
    fontWeight: "bold",
  },
};

export default ExerciseMonitoringReal;
