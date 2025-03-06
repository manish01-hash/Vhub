from django.urls import path
from .views import (
    signup, login_view, logout_view, get_users, get_volunteers, get_user_by_id,
    get_events, create_event, update_event, delete_event, get_event_by_id,
    get_tasks, create_task, update_task, delete_task, get_task_by_id,
    record_attendance, get_attendance, register_for_event, assign_event_role, get_attendance_rate, serve_image,
    check_registration_status, LeaveEventView
)
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # Authentication URLs
    path('auth/signup/', signup, name='signup'),
    path('auth/login/', login_view, name='login'),
    path('auth/logout/', logout_view, name='logout'),

    # User Management URLs
    path('users/', get_users, name='get_users'),
    path('users/<uuid:user_id>/', get_user_by_id, name='get_user_by_id'),
    path('volunteers/', get_volunteers, name='get_volunteers'),

    # Event Management URLs
    path('events/', get_events, name='get_events'),
    path('events/create/', create_event, name='create_event'),
    path('events/update/<uuid:E_ID>/', update_event, name='update_event'),
    path('events/<uuid:E_ID>/', get_event_by_id, name='get_event_by_id'),
    path('events/delete/<uuid:E_ID>/', delete_event, name='delete_event'),
    path('events/<uuid:event_id>/register/', register_for_event, name='register_for_event'),
    path('events/<uuid:E_ID>/assign-role/', assign_event_role, name='assign_event_role'),
    path('events/<uuid:event_id>/registration-status/', check_registration_status, name='event_registration_status'),
    path('events/<uuid:event_id>/leave/', LeaveEventView.as_view(), name='leave_event'),

    # Serve Images
    path('serve-image/<path:path>/', serve_image, name='serve_image'),

    # Task Management URLs
    path('tasks/', get_tasks, name='get_tasks'),
    path('tasks/create/', create_task, name='create_task'),
    path('tasks/update/<uuid:T_ID>/', update_task, name='update_task'),
    path('tasks/<uuid:T_ID>/', get_task_by_id, name='get_task_by_id'),
    path('tasks/delete/<uuid:T_ID>/', delete_task, name='delete_task'),

    # Attendance Management URLs
    path('attendance/record/', record_attendance, name='record_attendance'),
    path('attendance/<uuid:E_ID>/', get_attendance, name='get_attendance'),
    path('attendance/rate/', get_attendance_rate, name='get_attendance_rate'),
]

# Serving Media & Static Files
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
