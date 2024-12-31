from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    USER_TYPE_CHOICES = (
        ('admin', 'Admin'),
        ('doctor', 'Doctor'),
        ('patient', 'Patient'),
    )
    id = models.CharField(max_length=10, primary_key=True, editable=False)
    username = models.CharField(max_length=150, unique=True)
    user_type = models.CharField(max_length=20, choices=USER_TYPE_CHOICES)
    ic = models.CharField(max_length=20, unique=True, null=True, blank=True)
    contact_number = models.CharField(max_length=15, null=True, blank=True)
    home_address = models.TextField(null=True, blank=True)
    avatar = models.BinaryField(null=True, blank=True)

    def save(self, *args, **kwargs):
        # Generate a custom ID if it doesn't exist
        if not self.id:
            prefix = {
                'admin': 'A',
                'doctor': 'D',
                'patient': 'P'
            }.get(self.user_type, 'U')  # Default to 'U' if user_type not found

            # Find the latest user with the same prefix and increment the ID
            last_user = User.objects.filter(id__startswith=prefix).order_by('-id').first()

            if last_user:
                # Extract the numeric part from the last ID and increment it
                new_id = int(last_user.id[1:]) + 1
            else:
                new_id = 1  # Start from 1 if no users with the prefix exist

            # Format the new ID as A0000001, D0000001, P0000001, etc.
            self.id = f'{prefix}{new_id:07d}'

        super().save(*args, **kwargs)

    def __str__(self):
        return self.username

# Admin model extending the User
class Admin(User):
    class Meta:
        verbose_name = 'Admin'
        verbose_name_plural = 'Admins'

# Doctor model extending the User
class Doctor(User):
    specialization = models.CharField(max_length=100, blank=True, null=True)
    patients = models.ManyToManyField('Patient', related_name='assigned_doctors')

    class Meta:
        verbose_name = 'Doctor'
        verbose_name_plural = 'Doctors'

    def __str__(self):
        return f"Dr. {self.username} - {self.specialization}"

# Patient model extending the User
class Patient(User):
    medical_history = models.TextField(null=True, blank=True)

    class Meta:
        verbose_name = 'Patient'
        verbose_name_plural = 'Patients'

    def __str__(self):
        return f"Patient: {self.username}"

class Appointment(models.Model):
    patient = models.ForeignKey(Patient, related_name='appointments', on_delete=models.CASCADE)
    physiotherapist = models.ForeignKey(Doctor, related_name='appointments', on_delete=models.CASCADE)
    appointment_date = models.DateField(null=True)  
    appointment_time = models.TimeField(null=True)
    status = models.CharField(max_length=50, default='Pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Appointment with Dr. {self.physiotherapist.username} for {self.patient.username}"

class Treatment(models.Model):
    patient = models.ForeignKey(Patient, related_name='treatments', on_delete=models.CASCADE)
    name = models.CharField(max_length=255)

    def __str__(self):
        return f"Treatment {self.name} for {self.patient.username}"
