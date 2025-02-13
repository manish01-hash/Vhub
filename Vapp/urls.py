from django.urls import path
from .views import create_volunteer,delete_volunteer_by_phone

urlpatterns = [
    path('volunteers/', create_volunteer, name="create_volunteer"),  # ✅ Correct plural form
    path('volunteers/delete/by-phone/<str:phone_no>/', delete_volunteer_by_phone, name="delete_volunteer_by_phone"),

]
