import random, string
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework import status
from rest_framework import generics
from rest_framework.generics import ListAPIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser
from .serializers import CreateUserSerializer, AppointmentSerializer
from .serializers import UserSerializer, TreatmentSerializer, PatientSerializer
from django.contrib.auth import get_user_model, authenticate, login
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404, render
from django.core.cache import cache
from django.utils import timezone
from .models import User, Appointment, Treatment
import cv2
import numpy as np
import base64
from ultralytics import YOLO

class PoseDetectionView(APIView):
    parser_classes = [MultiPartParser]
    model = YOLO("yolov8n-pose.pt")  # Load YOLO model

    def post(self, request, *args, **kwargs):
        file = request.FILES.get("image")
        if not file:
            return Response({"error": "No image provided"}, status=400)

        # Convert uploaded file to OpenCV image
        npimg = np.frombuffer(file.read(), np.uint8)
        frame = cv2.imdecode(npimg, cv2.IMREAD_COLOR)

        # Run pose detection
        results = self.model(frame)
        keypoints = results[0].keypoints.cpu().numpy().tolist()  # Extract keypoints

        return Response({"keypoints": keypoints})



User = get_user_model()

# User Account Management CRUD
# Create a new user account
class CreateUserView(APIView):
    permission_classes = [AllowAny]  # Allow anyone to access this view

    @csrf_exempt  # Disable CSRF protection for this view (only if necessary)
    def post(self, request, format=None):
        serializer = CreateUserSerializer(data=request.data)
        if serializer.is_valid():
            # Retrieve the password from validated_data
            password = serializer.validated_data.get("password")
            if not password:
                return Response({"error": "Password is required."}, status=status.HTTP_400_BAD_REQUEST)

            # Create the user instance and set the password
            user = serializer.save()
            user.set_password(password)  # Hash the password and set it
            user.save()

            return Response({
                "id": user.id,
                "password": password  # Send back the plain password for verification
            }, status=status.HTTP_201_CREATED)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Read - View to retrieve a list of users for User Management
class ListUsersView(ListAPIView):
    queryset = User.objects.all()  # Fetch all user objects
    serializer_class = UserSerializer  # Use the same serializer for user data

# Update

# Delete - Delete user by passing user id
@csrf_exempt
@api_view(['DELETE'])
def delete_user(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        user.delete()
        return Response({"message": "User deleted successfully"}, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

# /////////
# Used to handle login request
@csrf_exempt
@api_view(['POST'])
def login_view(request):
    data = request.data  
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return JsonResponse({'success': False, 'message': 'Both username and password are required'}, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(request, username=username, password=password)

    if user is not None:
        login(request, user)
        return JsonResponse({
                'success': True,
                'message': 'Login successful',
                'username': user.username,  # Include username in response
                'role': user.user_type       # Include user role in response
            })
    else:
        return JsonResponse({'success': False, 'message': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)

# Constants for rate limiting
MAX_ATTEMPTS = 5
LOCKOUT_TIME = 300  # in seconds (5 minutes)

@api_view(['GET'])
def check_user_id(request, user_id):
    cache_key = f"user_id_attempts_{user_id}"
    attempts = cache.get(cache_key, 0)

    if attempts >= MAX_ATTEMPTS:
        return JsonResponse({"error": "Too many attempts. Please try again later."}, status=403)

    user_exists = User.objects.filter(id=user_id).exists()  # Adjust field as needed

    if not user_exists:
        attempts += 1
        cache.set(cache_key, attempts, LOCKOUT_TIME)
        return JsonResponse({"error": "User ID does not exist. Please try again."}, status=404)

    cache.delete(cache_key)
    return JsonResponse({"message": "User ID exists. Proceed to enter email."}, status=200)
    
@api_view(['GET'])
def get_user_detail(request, user_id):
    user = get_object_or_404(User, id=user_id)
    serializer = UserSerializer(user)
    return JsonResponse(serializer.data, safe=False)


def get_user_by_username(request, username):
    try:
        user = User.objects.get(username=username)
        user_data = {
            "id": user.id,
            "username": user.username,
            "ic": user.ic,
            "contact_number": user.contact_number,
            "email": user.email,
            "home_address": user.home_address,
            "is_active": user.is_active,
        }
        return JsonResponse(user_data, safe=False)
    except User.DoesNotExist:
        return JsonResponse({"error": "User not found"}, status=404)
    
    
class AppointmentListCreateView(generics.ListCreateAPIView):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer

    def perform_create(self, serializer):
        serializer.save(patient=self.request.user)  # Save the patient as the current user

class MakeAppointmentView(generics.CreateAPIView):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer

class AppointmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    
class ListPatientsView(generics.ListAPIView):
    queryset = User.objects.filter(user_type='patient')  # Adjust the filter based on your role field
    serializer_class = UserSerializer

class ListPhysiotherapistsView(generics.ListAPIView):
    queryset = User.objects.filter(user_type='doctor')  # Adjust the filter based on your role field
    serializer_class = UserSerializer
    
    
    
    
class TreatmentListCreateView(generics.ListCreateAPIView):
    queryset = Treatment.objects.all()
    serializer_class = TreatmentSerializer

    def perform_create(self, serializer):
        serializer.save()

class PatientTreatmentsView(generics.ListAPIView):
    serializer_class = TreatmentSerializer

    def get_queryset(self):
        patient_id = self.kwargs['patient_id']
        return Treatment.objects.filter(patient_id=patient_id)
    
class ListTreatmentsView(generics.ListAPIView):
    serializer_class = TreatmentSerializer

    def get_queryset(self):
        # Get the patient id from the query parameters
        patient_id = self.request.query_params.get('patient')
        if patient_id:
            return Treatment.objects.filter(patient__id=patient_id)
        return Treatment.objects.none()

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)