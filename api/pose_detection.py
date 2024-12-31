from ultralytics import YOLO
import numpy as np

class ExerciseCounter:
    def __init__(self):
        self.counter = 0
        self.position = None  # 用于跟踪动作状态
        self.threshold = 0.7  # 动作判定阈值

    def count_squat(self, keypoints):
        # 获取关键点坐标
        hip = keypoints[11]  # 髋关节
        knee = keypoints[13] # 膝关节
        ankle = keypoints[15] # 踝关节

        # 计算角度
        angle = self.calculate_angle(hip, knee, ankle)

        # 判断动作状态和计数
        if angle < 90 and self.position == 'up':
            self.position = 'down'
        elif angle > 160 and self.position == 'down':
            self.position = 'up'
            self.counter += 1

    def calculate_angle(self, p1, p2, p3):
        # 计算三点间角度的函数
        a = np.array(p1)
        b = np.array(p2)
        c = np.array(p3)
        
        ba = a - b
        bc = c - b
        
        cosine_angle = np.dot(ba, bc) / (np.linalg.norm(ba) * np.linalg.norm(bc))
        angle = np.arccos(cosine_angle)
        
        return np.degrees(angle)

# 使用示例
model = YOLO('../models/yolov8n-pose.pt')
counter = ExerciseCounter()

def process_frame(frame):
    results = model(frame)
    
    for result in results:
        keypoints = result.keypoints.data[0]  # 获取关键点
        
        # 根据动作类型调用相应的计数函数
        counter.count_squat(keypoints)
        
    return counter.counter
