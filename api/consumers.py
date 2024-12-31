import base64
import cv2
import numpy as np
import json
import logging
from channels.generic.websocket import AsyncWebsocketConsumer
from ultralytics import YOLO

logging.basicConfig(level=logging.INFO)

class PoseDetectionConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        
        self.model = YOLO("../models/yolov8n-pose.pt")
        # self.model = YOLO("yolov8n-pose.pt")  # Load YOLO model
        dummy_frame = np.zeros((480, 640, 3), dtype=np.uint8)  # Warm-up model
        self.model(dummy_frame)

    async def connect(self):
        await self.accept()
        await self.send(text_data=json.dumps({"message": "WebSocket connection established"}))
        logging.info("WebSocket connection established.")

    async def receive(self, text_data):
        try:
            logging.info("Received data from client.")
            data = json.loads(text_data)

            if "image" not in data or not data["image"]:
                await self.send(text_data=json.dumps({"error": "No image data provided"}))
                return

            # Decode base64 image data
            image_data = base64.b64decode(data["image"].split(",")[1])
            np_image = np.frombuffer(image_data, np.uint8)
            frame = cv2.imdecode(np_image, cv2.IMREAD_COLOR)

            if frame is None:
                await self.send(text_data=json.dumps({"error": "Invalid image data"}))
                return

            # Run YOLO pose detection
            results = self.model(frame)

            if results and results[0].keypoints is not None:
                keypoints_data = results[0].keypoints.data.cpu().numpy()
                await self.send(text_data=json.dumps({"keypoints": keypoints_data.tolist()}))
                logging.info("Sent keypoints to client.")
            else:
                await self.send(text_data=json.dumps({"error": "No keypoints detected"}))
                logging.warning("No keypoints detected.")
        except json.JSONDecodeError:
            await self.send(text_data=json.dumps({"error": "Invalid JSON format"}))
            logging.error("Invalid JSON format.")
        except Exception as e:
            await self.send(text_data=json.dumps({"error": str(e)}))
            logging.error(f"Unexpected error: {str(e)}")

    async def disconnect(self, close_code):
        logging.info("WebSocket disconnected.")
