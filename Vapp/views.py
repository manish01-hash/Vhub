from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from django.contrib.auth import authenticate, get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User, Event, Task, Attendance,Registration
from .serializers import (
    UserSerializer, SignupSerializer, LoginSerializer,
    EventSerializer, TaskSerializer, AttendanceSerializer,RegistrationSerializer
)
from django.contrib.auth.hashers import make_password

User = get_user_model()

### ------------------- AUTHENTICATION VIEWS ------------------- ###

# Signup View
@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    try:
        print("Received Data:", request.data)  # 🔍 Debugging: Print incoming request data
        serializer = SignupSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User registered successfully!"}, status=status.HTTP_201_CREATED)
        
        print("Serializer Errors:", serializer.errors)  # 🔍 Debugging: Print validation errors
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        print("Signup Error:", str(e))  # 🔍 Debugging: Print any other errors
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
@permission_classes([IsAuthenticated])  # Only authenticated users can access
def get_events(request):
    events = Event.objects.all()

    if not events.exists():
        return Response({"message": "No events available"}, status=status.HTTP_200_OK)  # ✅ Return message instead of 404

    serializer = EventSerializer(events, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(["POST"])
def register_for_event(request, event_id):
    user = request.user  # Get logged-in user
    try:
        event = Event.objects.get(E_ID=event_id)
        # ✅ Check if the user is already registered
        if Registration.objects.filter(event=event, volunteer=user).exists():
            return Response({"message": "Already registered!"}, status=status.HTTP_400_BAD_REQUEST)

        # ✅ Register user for event
        registration = Registration.objects.create(event=event, volunteer=user)
        return Response(
            {"message": "Registered successfully!", "qr_code": registration.qr_code.url}, 
            status=status.HTTP_201_CREATED
        )

    except Event.DoesNotExist:
        return Response({"error": "Event not found"}, status=status.HTTP_404_NOT_FOUND)
# Get Event by ID
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_event_by_id(request, E_ID):
    try:
        event = Event.objects.get(E_ID=E_ID)
        serializer = EventSerializer(event)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Event.DoesNotExist:
        return Response({"error": "Event not found!"}, status=status.HTTP_404_NOT_FOUND)

# Create Event
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_event(request):
    serializer = EventSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(E_Created_By=request.user)  # Set event creator
        return Response({"message": "Event created successfully!"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Update Event
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_event(request, E_ID):
    try:
        event = Event.objects.get(E_ID=E_ID)
    except Event.DoesNotExist:
        return Response({"error": "Event not found!"}, status=status.HTTP_404_NOT_FOUND)

    serializer = EventSerializer(event, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Event updated successfully!"}, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Delete Event
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_event(request, E_ID):
    try:
        event = Event.objects.get(E_ID=E_ID)
        event.delete()
        return Response({"message": "Event deleted successfully!"}, status=status.HTTP_200_OK)
    except Event.DoesNotExist:
        return Response({"error": "Event not found!"}, status=status.HTTP_404_NOT_FOUND)

### ------------------- TASK MANAGEMENT ------------------- ###

# Get All Tasks
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_tasks(request):
    tasks = Task.objects.all()
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
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_task(request):
    serializer = TaskSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Task created successfully!"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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
