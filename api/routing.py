from django.urls import path
from .consumers import PoseDetectionConsumer

websocket_urlpatterns = [
    path("ws/pose-detection/", PoseDetectionConsumer.as_asgi()),
]
