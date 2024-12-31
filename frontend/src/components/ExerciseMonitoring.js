import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";

const ExerciseMonitoring = () => {
  const [keypoints, setKeypoints] = useState([]); // Store keypoints from the backend
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const ws = useRef(null);

  // Establish WebSocket connection
  useEffect(() => {
    ws.current = new WebSocket("ws://127.0.0.1:8000/ws/pose-detection/");

    ws.current.onopen = () => {
      console.log("WebSocket connection established.");
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.keypoints) {
        console.log("Keypoints received:", data.keypoints);
        setKeypoints(data.keypoints); // Update keypoints
      } else if (data.error) {
        console.error("Error:", data.error);
      }
    };

    ws.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.current.onclose = () => {
      console.log("WebSocket connection closed.");
    };

    return () => ws.current.close();
  }, []);

  // Capture and send frames from the webcam
  const sendFrame = () => {
    if (webcamRef.current && ws.current.readyState === WebSocket.OPEN) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        ws.current.send(JSON.stringify({ image: imageSrc }));
      } else {
        console.error("Failed to capture webcam frame.");
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      sendFrame(); // Send a frame every 200ms
    }, 200);

    return () => clearInterval(interval);
  }, []);

  // Draw keypoints and skeleton
  const drawCanvas = (ctx, keypoints) => {
    if (!keypoints || keypoints.length === 0) return;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // Clear the canvas

    const skeletonPairs = [
      [5, 6], [5, 7], [7, 9], [6, 8], [8, 10], // Upper body
      [5, 11], [6, 12], [11, 12], [11, 13], [13, 15], // Lower body
      [12, 14], [14, 16],
    ];

    keypoints.forEach((pose) => {
      // Draw skeleton
      ctx.strokeStyle = "lime";
      ctx.lineWidth = 2;
      skeletonPairs.forEach(([startIdx, endIdx]) => {
        const start = pose[startIdx];
        const end = pose[endIdx];

        if (
          start && end &&
          start[2] > 0.5 && // Confidence threshold for start point
          end[2] > 0.5 // Confidence threshold for end point
        ) {
          ctx.beginPath();
          ctx.moveTo(start[0], start[1]);
          ctx.lineTo(end[0], end[1]);
          ctx.stroke();
        }
      });

      // Draw keypoints
      ctx.fillStyle = "red";
      pose.forEach(([x, y, confidence]) => {
        if (confidence > 0.5) {
          ctx.beginPath();
          ctx.arc(x, y, 5, 0, 2 * Math.PI); // Draw a circle for each keypoint
          ctx.fill();
        }
      });
    });
  };

  // Update canvas when keypoints change
  useEffect(() => {
    if (!canvasRef.current || !webcamRef.current) return;

    const canvas = canvasRef.current;
    const video = webcamRef.current.video;

    if (video) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");
      drawCanvas(ctx, keypoints); // Draw keypoints and skeleton
    }
  }, [keypoints]); // Redraw whenever keypoints change

  return (
    <div style={{ position: "relative", width: "fit-content" }}>
      <h2>Exercise Monitoring</h2>
      {/* Webcam feed */}
      <Webcam
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 0,
        }}
      />

      {/* Canvas overlay */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 1,
        }}
      />

      {/* Display keypoints JSON */}
      <div style={{ marginTop: "500px" }}>
        <h3>Keypoints:</h3>
        <pre>{JSON.stringify(keypoints, null, 2)}</pre>
      </div>
    </div>
  );
};

export default ExerciseMonitoring;
