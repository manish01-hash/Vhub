from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from django.contrib.auth import authenticate, get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User, Event, Task, Attendance,Registration,SampleTask,EventAnnouncement
from .serializers import (
    UserSerializer, SignupSerializer, LoginSerializer,
    EventSerializer, TaskSerializer, AttendanceSerializer,RegistrationSerializer,EventAnnouncementSerializer
    ,SampleTaskSerializer
)
from django.contrib.auth.hashers import make_password


from django.http import FileResponse, Http404
import os
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.core.mail import send_mail


User = get_user_model()

### ------------------- AUTHENTICATION VIEWS ------------------- ###

# Signup View
@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    try:
        print("📩 Received Signup Data:", request.data)  # ✅ Debugging line
        serializer = SignupSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User registered successfully!"}, status=status.HTTP_201_CREATED)
        
        print("❌ Serializer Errors:", serializer.errors)  # ✅ Debugging line
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        print("❌ Signup Error:", str(e))
        return Response({"error": "Something went wrong on the server."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
# Login View
@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    email = request.data.get('email')
    password = request.data.get('password')
    
    user = authenticate(email=email, password=password)
    if user is not None:
        refresh = RefreshToken.for_user(user)
        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "role": user.role  # ✅ Return role so frontend can redirect
        }, status=status.HTTP_200_OK)
    
    return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)



# Logout View
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    return Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)

### ------------------- USER MANAGEMENT ------------------- ###

# Get All Users
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_users(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_user_role(request, user_id):
    """
    Update a user's role (Admin-only access).
    """
    if request.user.role != "Admin":
        return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

    user = get_object_or_404(User, id=user_id)
    new_role = request.data.get("role")

    valid_roles = ["Volunteer", "Event Organizer", "Admin","Coordinator","Super Volunteer"]
    if new_role not in valid_roles:
        return Response({"error": "Invalid role"}, status=status.HTTP_400_BAD_REQUEST)

    user.role = new_role
    user.save()
    
    return Response({"message": f"User role updated to {new_role}"}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_volunteers(request):
    volunteers = User.objects.filter(role="Volunteer")  # ✅ Only fetch volunteers
    serializer = UserSerializer(volunteers, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


# Get User by ID
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_by_id(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({"error": "User not found!"}, status=status.HTTP_404_NOT_FOUND)





### ------------------- EVENT MANAGEMENT ------------------- ###

# Get All Events
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_events(request):
    events = Event.objects.all()
    
    # Ensure an empty list is returned instead of an object with a message
    if not events.exists():
        return Response([], status=status.HTTP_200_OK)

    serializer = EventSerializer(events, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)



# Register for an Event
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def register_for_event(request, E_ID):
    user = request.user  # ✅ Ensure user is authenticated
    event = get_object_or_404(Event, E_ID=E_ID)  # ✅ Ensure event exists

    # ✅ Check if user is already registered
    if Registration.objects.filter(event=event, volunteer=user).exists():
        return Response({"error": "Already registered"}, status=status.HTTP_400_BAD_REQUEST)

    # ✅ Register user
    registration = Registration.objects.create(event=event, volunteer=user)
    
    return Response(
        {"message": "Successfully registered", "qr_code": registration.qr_code.url},
        status=status.HTTP_201_CREATED
    )
    

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_all_registrations(request):
    """Fetch all registrations with event and volunteer details"""
    registrations = Registration.objects.all()
    
    if not registrations.exists():
        return Response({"message": "No registrations found"}, status=status.HTTP_200_OK)

    serializer = RegistrationSerializer(registrations, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


#Check Registration Status
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def check_registration_status(request, event_id):
    """Check if the user is registered for an event."""
    user = request.user
    event = get_object_or_404(Event, E_ID=event_id)  # ✅ Use the correct Event primary key field

    # ✅ Check if the user is registered in the Registration model
    is_registered = Registration.objects.filter(event=event, volunteer=user).exists()

    return Response({"registered": is_registered}, status=status.HTTP_200_OK)

# Leave Event
class LeaveEventView(APIView):
    def post(self, request, event_id):
        try:
            # Get the event
            event = get_object_or_404(Event, E_ID=event_id)
            user = request.user  # Get the logged-in user
            
            # Check if the user is registered for the event
            registration = Registration.objects.filter(event=event, volunteer=user).first()
            if registration:
                registration.delete()  # Remove registration
                return Response({"message": "Successfully left the event"}, status=status.HTTP_200_OK)
            else:
                return Response({"error": "User is not registered for this event"}, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Get Event by ID
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_event_by_id(request, E_ID):
    event = get_object_or_404(Event, E_ID=E_ID)
    serializer = EventSerializer(event, context={"request": request})
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_qr_code(request, event_id):
    registration = get_object_or_404(Registration, event__E_ID=event_id, volunteer=request.user)
    
    if not registration.qr_code:
        return Response({"error": "QR Code not found. Try registering again."}, status=status.HTTP_404_NOT_FOUND)

    return Response({"qr_code_url": request.build_absolute_uri(registration.qr_code.url)}, status=status.HTTP_200_OK)



# Create Event
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_event(request):
    serializer = EventSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(E_Created_By=request.user)
        return Response({"message": "Event created successfully!"}, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Update Event
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_event(request, E_ID):
    event = get_object_or_404(Event, E_ID=E_ID)

    if request.user != event.E_Created_By and request.user.role != "Admin":
        return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

    data = request.data.copy()

    # Handle Image Upload
    if 'E_Photo' in request.FILES:
        data['E_Photo'] = request.FILES['E_Photo']

    # Remove empty UUIDs to avoid validation errors
    for field in ['E_Coordinators', 'E_Super_Volunteers']:
        if field in data and not data[field]:
            del data[field]

    serializer = EventSerializer(event, data=data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Event updated successfully!"}, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Delete Event
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])  # Ensure only logged-in users can delete
def delete_event(request, E_ID):
    event = get_object_or_404(Event, E_ID=E_ID)

    # ✅ Debugging: Print user details
    print("User trying to delete:", request.user)
    print("Event created by:", event.E_Created_By)

    # ✅ Check if the user is either the event creator OR an Admin
    if request.user != event.E_Created_By and request.user.role != "Admin":
        return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

    event.delete()
    return Response({"message": "Event deleted successfully!"}, status=status.HTTP_200_OK)


# Assign Event Role
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def assign_event_role(request, E_ID):
    event = get_object_or_404(Event, E_ID=E_ID)

    if request.user != event.E_Created_By and request.user.role != "Admin":
        return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

    user_id = request.data.get("user_id")
    role = request.data.get("role")
    user = get_object_or_404(User, id=user_id)

    if role == "Coordinator":
        event.E_Coordinators.add(user)
    elif role == "Super Volunteer":
        event.E_Super_Volunteers.add(user)
    else:
        return Response({"error": "Invalid event role"}, status=status.HTTP_400_BAD_REQUEST)

    event.save()
    return Response({"message": f"{user.name} assigned as {role} successfully!"}, status=status.HTTP_200_OK)


# Serve Image (For Debugging)
def serve_image(request, path):
    file_path = os.path.abspath(path)
    if os.path.exists(file_path):
        return FileResponse(open(file_path, 'rb'))
    else:
        raise Http404("Image not found")
    
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def post_announcement(request, event_id):
    event = get_object_or_404(Event, E_ID=event_id)

    if request.user not in event.E_Coordinators.all() and request.user.role != "Admin":
        return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

    serializer = EventAnnouncementSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(event=event, posted_by=request.user)
        return Response({"message": "Announcement posted successfully!"}, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_announcements(request, E_ID):  # Make sure to accept E_ID
    event = get_object_or_404(Event, E_ID=E_ID)
    
    announcements = EventAnnouncement.objects.filter(event=event)
    if not announcements.exists():
        return Response({"message": "No announcements found"}, status=status.HTTP_200_OK)

    serializer = EventAnnouncementSerializer(announcements, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)







### ------------------- TASK MANAGEMENT ------------------- ###
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_sample_task(request, event_id):
    event = get_object_or_404(Event, E_ID=event_id)
    sample_task = SampleTask.objects.filter(event=event).first()

    if not sample_task:
        return Response({"message": "No sample task available."}, status=status.HTTP_200_OK)

    serializer = SampleTaskSerializer(sample_task)
    return Response(serializer.data, status=status.HTTP_200_OK)


# Get All Tasks
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_tasks(request, E_ID):
    event = get_object_or_404(Event, E_ID=E_ID)  # Ensure event exists
    
    if request.user.role != "Admin" and request.user not in event.E_Coordinators.all() and request.user != event.E_Created_By:
        return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

    tasks = Task.objects.filter(event=event)
    
    if not tasks.exists():
        return Response({"message": "No tasks found for this event"}, status=status.HTTP_200_OK)

    serializer = TaskSerializer(tasks, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)



# Get Task by ID
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_task_by_id(request, T_ID):
    try:
        task = Task.objects.get(T_ID=T_ID)
        serializer = TaskSerializer(task)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Task.DoesNotExist:
        return Response({"error": "Task not found!"}, status=status.HTTP_404_NOT_FOUND)

# Create Task
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_task(request, E_ID):  # ✅ Use E_ID instead of event_id
    event = get_object_or_404(Event, E_ID=E_ID)  # Ensure event exists

    serializer = TaskSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(event=event, created_by=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def assign_task(request, task_id):
    task = get_object_or_404(Task, T_ID=task_id)
    
    # ✅ Ensure only Admins, Coordinators, or the Event Organizer can assign tasks
    if request.user.role != "Admin" and request.user not in task.event.E_Coordinators.all() and request.user != task.event.E_Created_By:
        return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

    user_id = request.data.get("user_id")
    user = get_object_or_404(User, id=user_id)
    
    task.assigned_to.add(user)
    task.save()
    
    return Response({"message": "Task assigned successfully!"}, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def self_assign_task(request, task_id):
    task = get_object_or_404(Task, T_ID=task_id)

    if request.user.role != "Volunteer":
        return Response({"error": "Only volunteers can self-assign tasks"}, status=status.HTTP_403_FORBIDDEN)

    task.assigned_to.add(request.user)
    task.save()

    return Response({"message": "Task self-assigned successfully!"}, status=status.HTTP_200_OK)

@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def update_task_status(request, task_id):
    task = get_object_or_404(Task, T_ID=task_id)

    # ✅ Only Admins, Coordinators, Assigned Volunteers, or the Event Organizer can update task status
    if request.user.role != "Admin" and request.user not in task.event.E_Coordinators.all() and request.user not in task.assigned_to.all() and request.user != task.event.E_Created_By:
        return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

    new_status = request.data.get("status")
    if new_status not in ["Not Started", "In Progress", "Completed"]:
        return Response({"error": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST)

    task.status = new_status
    task.save()

    return Response({"message": f"Task status updated to {new_status}"}, status=status.HTTP_200_OK)

# Update Task
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_task(request, T_ID):
    try:
        task = Task.objects.get(T_ID=T_ID)
    except Task.DoesNotExist:
        return Response({"error": "Task not found!"}, status=status.HTTP_404_NOT_FOUND)

    serializer = TaskSerializer(task, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Task updated successfully!"}, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Delete Task
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_task(request, T_ID):
    try:
        task = Task.objects.get(T_ID=T_ID)
        task.delete()
        return Response({"message": "Task deleted successfully!"}, status=status.HTTP_200_OK)
    except Task.DoesNotExist:
        return Response({"error": "Task not found!"}, status=status.HTTP_404_NOT_FOUND)

### ------------------- ATTENDANCE TRACKING ------------------- ###

# Record Attendance (Scan QR Code)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def record_attendance(request):
    data = request.data
    if 'event_id' not in data:
        return Response({"error": "Event ID is required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        event = Event.objects.get(E_ID=data['event_id'])
        user = request.user  # Authenticated user who is scanning QR

        # Check if user has already attended
        if Attendance.objects.filter(event=event, volunteer=user).exists():
            return Response({"error": "Attendance already recorded!"}, status=status.HTTP_400_BAD_REQUEST)

        Attendance.objects.create(event=event, volunteer=user)
        return Response({"message": "Attendance recorded successfully!"}, status=status.HTTP_201_CREATED)

    except Event.DoesNotExist:
        return Response({"error": "Event not found!"}, status=status.HTTP_404_NOT_FOUND)

# Get Attendance for an Event
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_attendance(request, E_ID):
    try:
        event = Event.objects.get(E_ID=E_ID)
        attendance_records = Attendance.objects.filter(event=event)
        serializer = AttendanceSerializer(attendance_records, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Event.DoesNotExist:
        return Response({"error": "Event not found!"}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_attendance_rate(request):
    try:
        total_registered = Registration.objects.count()  # ✅ Count total event registrations
        total_attended = Attendance.objects.count()  # ✅ Count total marked attendances

        if total_registered == 0:
            attendance_rate = 0  # ✅ Avoid division by zero
        else:
            attendance_rate = round((total_attended / total_registered) * 100, 2)  # ✅ Round to 2 decimal places

        return Response({"attendance_rate": attendance_rate}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




@api_view(['POST'])
def contact_us(request):
    name = request.data.get('name')
    email = request.data.get('email')
    message = request.data.get('message')

    if not name or not email or not message:
        return Response({'error': 'All fields are required'}, status=400)

    send_mail(
        f"New Contact Us Message from {name}",
        message,
        email,
        [os.getenv('EMAIL_HOST_USER')],  # Sends to vcoders04@gmail.com
    )

    return Response({'success': 'Message sent successfully!'})


