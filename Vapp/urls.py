from django.urls import path
from .views import (
    signup, login_view, logout_view, get_users, get_user_by_id,
    get_events, create_event, update_event, delete_event, get_event_by_id,
    get_tasks, create_task, update_task, delete_task, get_task_by_id,
    record_attendance, get_attendance, register_for_event
)

urlpatterns = [
    # Authentication URLs
    path('auth/signup/', signup, name='signup'),
    path('auth/login/', login_view, name='login'),
    path('auth/logout/', logout_view, name='logout'),



    # User Management URLs
    path('users/', get_users, name='get_users'),
    path('users/<uuid:user_id>/', get_user_by_id, name='get_user_by_id'),

    # Event Management URLs
    path('events/', get_events, name='get_events'),
    path('events/create/', create_event, name='create_event'),
    path('events/update/<uuid:E_ID>/', update_event, name='update_event'),
    path('events/<uuid:E_ID>/', get_event_by_id, name='get_event_by_id'),
    path('events/delete/<uuid:E_ID>/', delete_event, name='delete_event'),
    path("events/<uuid:event_id>/register/", register_for_event, name="register_for_event"),

    # Task Management URLs
    path('tasks/', get_tasks, name='get_tasks'),
    path('tasks/create/', create_task, name='create_task'),
    path('tasks/update/<uuid:T_ID>/', update_task, name='update_task'),
    path('tasks/<uuid:T_ID>/', get_task_by_id, name='get_task_by_id'),
    path('tasks/delete/<uuid:T_ID>/', delete_task, name='delete_task'),

    # Attendance Management URLs
    path('attendance/record/', record_attendance, name='record_attendance'),
    path('attendance/<uuid:E_ID>/', get_attendance, name='get_attendance'),
]
