from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from .models import Appointment, Treatment
import base64

User = get_user_model()
DEFAULT_AVATAR_PATH = '../frontend/static/images/defaultAvatar.png'


#Use to handle user creation
class CreateUserSerializer(serializers.ModelSerializer):
    avatar = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'ic', 'contact_number', 'email', 
            'home_address', 'user_type', 'password', 'avatar'
        ]
        extra_kwargs = {
            'password': {'write_only': True},
        }

    # Override the validate method for username to allow spaces
    def validate_username(self, value):
        value = value.strip()
        if not all(char.isalnum() or char.isspace() for char in value):
            raise ValidationError("Username can only contain letters, numbers, and spaces.")
        return value

    def create(self, validated_data):
        avatar_data = validated_data.pop('avatar', None)
        user = User.objects.create(
            username=validated_data['username'],
            ic=validated_data['ic'],
            contact_number=validated_data['contact_number'],
            email=validated_data['email'],
            home_address=validated_data['home_address'],
            user_type=validated_data['user_type'],
        )
        user.set_password(validated_data['password'])

        if avatar_data:
            user.avatar = bytes(avatar_data, 'utf-8')  # Convert base64 string to binary
        user.save()
        return user
    
class UserSerializer(serializers.ModelSerializer):
    avatar = serializers.SerializerMethodField()
    date_joined = serializers.DateTimeField(format="%d/%m/%Y", read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'ic', 'contact_number', 
                  'email', 'home_address', 'user_type', 
                  'is_active', 'date_joined', 'avatar']

    def get_avatar(self, obj):
        if obj.avatar:
            return base64.b64encode(obj.avatar).decode('utf-8')
        return None
        
        
class AppointmentSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.username', read_only=True)
    physiotherapist_name = serializers.CharField(source='physiotherapist.username', read_only=True)
    patient = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), write_only=True)
    physiotherapist = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), write_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'username', 'ic', 'contact_number', 'email', 
            'home_address', 'user_type', 'is_active', 'date_joined', 'avatar'
        ]

    def get_avatar(self, obj):
        if obj.avatar:
            return obj.avatar.decode('utf-8')  # Convert binary back to base64 string
        return None
        
        
    def create(self, validated_data):
        # Extract foreign key data
        patient = validated_data.pop('patient')
        physiotherapist = validated_data.pop('physiotherapist')

        # Create the appointment
        appointment = Appointment.objects.create(
            patient=patient,
            physiotherapist=physiotherapist,
            **validated_data
        )
        return appointment
    
class TreatmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Treatment
        fields = ['id', 'name', 'date', 'duration', 'frequencyPerDay', 'status', 'exerciseNumber']
        
class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'profile_image']