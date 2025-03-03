from django.urls import path
from .views import (
    get_volunteers, create_volunteer, delete_volunteer,
    get_events, create_event, delete_event,
    get_event_by_id, update_volunteer, update_event
)

urlpatterns = [
    # Volunteer URLs
    path('api/volunteers/', get_volunteers, name="get_volunteers"),
    path('api/volunteers/create/', create_volunteer, name="create_volunteer"),
    path('api/volunteers/update/<uuid:V_ID>/', update_volunteer, name="update_volunteer"),
    path('api/volunteers/delete/<uuid:V_ID>/', delete_volunteer, name="delete_volunteer"),
    
    # Event URLs
    path('api/events/', get_events, name="get_events"),
    path('api/events/create/', create_event, name="create_event"),
    path('api/events/update/<uuid:E_ID>/', update_event, name="update_event"),
    path('api/events/<uuid:E_ID>/', get_event_by_id, name="get_event_by_id"),
    path('api/events/delete/<uuid:E_ID>/', delete_event, name="delete_event"),
]