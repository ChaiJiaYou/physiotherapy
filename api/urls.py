from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static


from .views import (
    CreateUserView,
    ListUsersView,
    login_view,
    get_user_by_username,
    AppointmentListCreateView,
    AppointmentDetailView,
    ListPatientsView, 
    ListPhysiotherapistsView,
    MakeAppointmentView,
    TreatmentListCreateView, 
    PatientTreatmentsView,
    ListTreatmentsView,
    check_user_id,
    get_user_detail,
    delete_user,
    PoseDetectionView,

)


urlpatterns = [
    # Main Function Exercise Monitoring Model
    path("pose-detection/", PoseDetectionView.as_view(), name="pose-detection"),
    
    # User-related endpoints
    path('create-user/', CreateUserView.as_view(), name='create-user'),
    path('list-users/', ListUsersView.as_view(), name='list-users'),
    path('login/', login_view, name='login'),
    path("check-user-id/<str:user_id>/", check_user_id, name="check_user_id"),
    path('user/<str:username>/', get_user_by_username, name='get_user_by_username'),
    path('get-user/<str:user_id>/', get_user_detail, name='accountManagementUserPage'), #[Admin Site]View and Manage User Account Details
    path('delete-user/<str:user_id>/', delete_user, name='delete_user'),
    
    # Appointment-related endpoints
    path('appointments/', AppointmentListCreateView.as_view(), name='appointments'),  # List and create appointments
    path('appointments/<int:pk>/', AppointmentDetailView.as_view(), name='appointment-detail'),  # Retrieve, update, or delete a specific appointment
    path('make-appointment/', MakeAppointmentView.as_view(), name='make-appointment'),

    
    path('list-users/patients/', ListPatientsView.as_view(), name='list-patients'),
    path('list-users/physiotherapists/', ListPhysiotherapistsView.as_view(), name='list-physiotherapists'),

    path('treatments/', TreatmentListCreateView.as_view(), name='treatment-list-create'),
    path('list-patients/', ListPatientsView.as_view(), name='list-patients'),
    
    path('patients/', ListPatientsView.as_view(), name='list-patients'),
    path('treatments/', ListTreatmentsView.as_view(), name='list-treatments'),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)