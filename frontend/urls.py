from django.urls import path
from .views import index

urlpatterns = [
    path('', index, name='home'),
    path('login/', index, name='login'),
    path('user-management/', index, name='user-management'),
    path('user-account-management/<str:user_id>/', index, name='user-account-management'),
    
    path('create-user/', index, name='create-user'),
    path('user-account/<str:username>/', index, name='user-account'),
    path('appointments/', index, name='appointments'),
    path('create-treatment/', index, name='create-treatment'),
    path('make-appointment/', index, name='make-appointment'),
    path('create-treatment/', index, name='create-treatment'),
    path('treatment-management/', index, name='treatments'),
    path('forgot-password/', index, name='forgot-password'),
    path('exercise-monitoring/', index, name='exercise-monitoring'),
]
