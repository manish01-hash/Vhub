from django.urls import path
from .views import create_volunteer,delete_volunteer_by_phone,update_volunteer,get_volunteer_by_phone

urlpatterns = [
    path('volunteers/', create_volunteer, name="create_volunteer"),  # ✅ Correct plural form
    path('volunteers/delete/by-phone/<str:phone_no>/', delete_volunteer_by_phone, name="delete_volunteer_by_phone"),
    path('api/volunteers/get/by-phone/<str:phone_no>/', get_volunteer_by_phone, name='get_volunteer_by_phone'),
    path('api/volunteers/update/<str:phone_no>/', update_volunteer, name='update_volunteer'),

]
