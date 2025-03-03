# # # from rest_framework.decorators import api_view
# # # from rest_framework.response import Response
# # # from .models import Volunteer,Event
# # # from rest_framework import status
# # # from .serializers import VolunteerSerializer,EventSerializer
# # # import uuid

# # # @api_view(['GET', 'POST'])
# # # def create_volunteer(request):
# # #     if request.method == 'GET':
# # #         try:
# # #             volunteers = Volunteer.objects.all()
# # #             serializer = VolunteerSerializer(volunteers, many=True)
# # #             return Response(serializer.data)
# # #         except Exception as e:
# # #             print("Error fetching volunteers:", e)  # Debugging
# # #             return Response({"error": str(e)}, status=500)  # Send error response

# # #     if request.method == 'POST':
# # #         serializer = VolunteerSerializer(data=request.data)
# # #         if serializer.is_valid():
# # #             serializer.save()
# # #             return Response({"message": "Volunteer added successfully!"}, status=201)
# # #         return Response(serializer.errors, status=400)



# # # @api_view(['DELETE'])
# # # def delete_volunteer_by_phone(request, phone_no):
# # #     try:
# # #         volunteer = Volunteer.objects.get(V_Phone_No=phone_no)
# # #         volunteer.delete()
# # #         return Response({"message": "Volunteer deleted successfully!"}, status=200)
# # #     except Volunteer.DoesNotExist:
# # #         return Response({"error": "Volunteer not found!"}, status=404)

# # # @api_view(['PUT'])  # ✅ Must use PUT (not POST)
# # # def update_volunteer(request, phone_no):
# # #     try:
# # #         volunteer = Volunteer.objects.get(V_Phone_No=phone_no)
# # #     except Volunteer.DoesNotExist:
# # #         return Response({"error": "Volunteer not found!"}, status=status.HTTP_404_NOT_FOUND)

# # #     serializer = VolunteerSerializer(volunteer, data=request.data, partial=True)
# # #     if serializer.is_valid():
# # #         serializer.save()
# # #         return Response({"message": "Volunteer updated successfully!"}, status=status.HTTP_200_OK)
    
# # #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



# # # @api_view(['POST'])
# # # def get_volunteer_by_phone(request, phone_no):
# # #     try:
# # #         volunteer = Volunteer.objects.get(V_Phone_No=phone_no)
# # #         serializer = VolunteerSerializer(volunteer)
# # #         return Response(serializer.data, status=status.HTTP_200_OK)
# # #     except Volunteer.DoesNotExist:
# # #         return Response({"error": "Volunteer Not Found!"}, status=status.HTTP_404_NOT_FOUND)
    
# # # @api_view(['POST'])
# # # def create_event(request):
# # #     serializer = EventSerializer(data=request.data)
# # #     if serializer.is_valid():
# # #         serializer.save()
# # #         return Response({"message": "Event created successfully!"}, status=201)
# # #     print("Serializer Errors:", serializer.errors)  # Debugging Line
# # #     return Response(serializer.errors, status=400)




# # # @api_view(['DELETE'])
# # # def delete_event(request, event_id):
# # #     try:
# # #         event = Event.objects.get(id=event_id)
# # #         event.delete()
# # #         return Response({"message": "Event deleted successfully!"}, status=200)
# # #     except Event.DoesNotExist:
# # #         return Response({"error": "Event not found!"}, status=404)


# # # @api_view(['PUT'])
# # # def update_event(request, event_id):
# # #     try:
# # #         event = Event.objects.get(id=event_id)
# # #     except Event.DoesNotExist:
# # #         return Response({"error": "Event not found!"}, status=status.HTTP_404_NOT_FOUND)

# # #     serializer = EventSerializer(event, data=request.data, partial=True)
# # #     if serializer.is_valid():
# # #         serializer.save()
# # #         return Response({"message": "Event updated successfully!"}, status=status.HTTP_200_OK)

# # #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# # # @api_view(['GET'])
# # # def get_event_by_id(request, event_id):
# # #     try:
# # #         event = Event.objects.get(id=event_id)
# # #         serializer = EventSerializer(event)
# # #         return Response(serializer.data, status=status.HTTP_200_OK)
# # #     except Event.DoesNotExist:
# # #         return Response({"error": "Event Not Found!"}, status=status.HTTP_404_NOT_FOUND)
    
# # # @api_view(['GET'])
# # # def get_all_events(request):
# # #     try:
# # #         events = Event.objects.all()  # Get all event records
# # #         serializer = EventSerializer(events, many=True)  # Serialize data
# # #         return Response(serializer.data, status=status.HTTP_200_OK)  # Return JSON response
# # #     except Exception as e:
# # #         return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# # from rest_framework.decorators import api_view, permission_classes
# # from rest_framework.response import Response
# # from rest_framework.permissions import IsAuthenticated
# # from .models import Volunteer, Event
# # from rest_framework import status
# # from .serializers import VolunteerSerializer, EventSerializer

# # @api_view(['GET'])
# # @permission_classes([IsAuthenticated])
# # def get_volunteers(request):
# #     try:
# #         volunteers = Volunteer.objects.all()
# #         serializer = VolunteerSerializer(volunteers, many=True)
# #         return Response(serializer.data, status=status.HTTP_200_OK)
# #     except Exception as e:
# #         return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# # @api_view(['POST'])
# # def create_volunteer(request):
# #     serializer = VolunteerSerializer(data=request.data)
# #     if serializer.is_valid():
# #         serializer.save()
# #         return Response({"message": "Volunteer created successfully!"}, status=status.HTTP_201_CREATED)
# #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# # @api_view(['DELETE'])
# # def delete_volunteer(request, volunteer_id):
# #     try:
# #         volunteer = Volunteer.objects.get(id=volunteer_id)
# #         volunteer.delete()
# #         return Response({"message": "Volunteer deleted successfully!"}, status=status.HTTP_200_OK)
# #     except Volunteer.DoesNotExist:
# #         return Response({"error": "Volunteer not found!"}, status=status.HTTP_404_NOT_FOUND)

# # @api_view(['GET'])
# # @permission_classes([IsAuthenticated])
# # def get_events(request):
# #     try:
# #         events = Event.objects.all()
# #         serializer = EventSerializer(events, many=True)
# #         return Response(serializer.data, status=status.HTTP_200_OK)
# #     except Exception as e:
# #         return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# # @api_view(['POST'])
# # def create_event(request):
# #     serializer = EventSerializer(data=request.data)
# #     if serializer.is_valid():
# #         serializer.save()
# #         return Response({"message": "Event created successfully!"}, status=status.HTTP_201_CREATED)
# #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# # @api_view(['DELETE'])
# # def delete_event(request, event_id):
# #     try:
# #         event = Event.objects.get(id=event_id)
# #         event.delete()
# #         return Response({"message": "Event deleted successfully!"}, status=status.HTTP_200_OK)
# #     except Event.DoesNotExist:
# #         return Response({"error": "Event not found!"}, status=status.HTTP_404_NOT_FOUND)

# # @api_view(['GET'])
# # def get_event_by_id(request, event_id):
# #     try:
# #         event = Event.objects.get(id=event_id)
# #         serializer = EventSerializer(event)
# #         return Response(serializer.data, status=status.HTTP_200_OK)
# #     except Event.DoesNotExist:
# #         return Response({"error": "Event Not Found!"}, status=status.HTTP_404_NOT_FOUND)

# from rest_framework.decorators import api_view, permission_classes
# from rest_framework.response import Response
# from rest_framework.permissions import IsAuthenticated
# from .models import Volunteer, Event, Task
# from rest_framework import status
# from .serializers import VolunteerSerializer, EventSerializer, TaskSerializer

# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def get_volunteers(request):
#     try:
#         volunteers = Volunteer.objects.all()
#         serializer = VolunteerSerializer(volunteers, many=True)
#         return Response(serializer.data, status=status.HTTP_200_OK)
#     except Exception as e:
#         return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# @api_view(['POST'])
# def create_volunteer(request):
#     serializer = VolunteerSerializer(data=request.data)
#     if serializer.is_valid():
#         serializer.save()
#         return Response({"message": "Volunteer created successfully!"}, status=status.HTTP_201_CREATED)
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# @api_view(['PUT'])
# def update_volunteer(request, V_ID):
#     try:
#         volunteer = Volunteer.objects.get(V_ID=V_ID)
#     except Volunteer.DoesNotExist:
#         return Response({"error": "Volunteer not found!"}, status=status.HTTP_404_NOT_FOUND)
    
#     serializer = VolunteerSerializer(volunteer, data=request.data, partial=True)
#     if serializer.is_valid():
#         serializer.save()
#         return Response({"message": "Volunteer updated successfully!"}, status=status.HTTP_200_OK)
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# @api_view(['DELETE'])
# def delete_volunteer(request, V_ID):
#     try:
#         volunteer = Volunteer.objects.get(V_ID=V_ID)
#         volunteer.delete()
#         return Response({"message": "Volunteer deleted successfully!"}, status=status.HTTP_200_OK)
#     except Volunteer.DoesNotExist:
#         return Response({"error": "Volunteer not found!"}, status=status.HTTP_404_NOT_FOUND)

# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def get_events(request):
#     try:
#         events = Event.objects.all()
#         serializer = EventSerializer(events, many=True)
#         return Response(serializer.data, status=status.HTTP_200_OK)
#     except Exception as e:
#         return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# @api_view(['GET'])
# def get_event_by_id(request, E_ID):
#     try:
#         event = Event.objects.get(E_ID=E_ID)
#         serializer = EventSerializer(event)
#         return Response(serializer.data, status=status.HTTP_200_OK)
#     except Event.DoesNotExist:
#         return Response({"error": "Event not found!"}, status=status.HTTP_404_NOT_FOUND)

# @api_view(['POST'])
# def create_event(request):
#     serializer = EventSerializer(data=request.data)
#     if serializer.is_valid():
#         serializer.save()
#         return Response({"message": "Event created successfully!"}, status=status.HTTP_201_CREATED)
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# @api_view(['PUT'])
# def update_event(request, E_ID):
#     try:
#         event = Event.objects.get(E_ID=E_ID)
#     except Event.DoesNotExist:
#         return Response({"error": "Event not found!"}, status=status.HTTP_404_NOT_FOUND)
    
#     serializer = EventSerializer(event, data=request.data, partial=True)
#     if serializer.is_valid():
#         serializer.save()
#         return Response({"message": "Event updated successfully!"}, status=status.HTTP_200_OK)
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# @api_view(['DELETE'])
# def delete_event(request, E_ID):
#     try:
#         event = Event.objects.get(E_ID=E_ID)
#         event.delete()
#         return Response({"message": "Event deleted successfully!"}, status=status.HTTP_200_OK)
#     except Event.DoesNotExist:
#         return Response({"error": "Event not found!"}, status=status.HTTP_404_NOT_FOUND)


from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Volunteer, Event, Task
from .serializers import VolunteerSerializer, EventSerializer, TaskSerializer

# Signup View
@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    data = request.data
    if User.objects.filter(username=data['email']).exists():
        return Response({"error": "User already exists"}, status=status.HTTP_400_BAD_REQUEST)
    
    user = User.objects.create_user(
        username=data['email'],
        email=data['email'],
        password=data['password']
    )
    return Response({"message": "User registered successfully!"}, status=status.HTTP_201_CREATED)

# Login View
@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    data = request.data
    user = authenticate(username=data['email'], password=data['password'])
    if user is not None:
        refresh = RefreshToken.for_user(user)
        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }, status=status.HTTP_200_OK)
    else:
        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

# Logout View
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    return Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)

# Volunteer Views
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_volunteers(request):
    try:
        volunteers = Volunteer.objects.all()
        serializer = VolunteerSerializer(volunteers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def create_volunteer(request):
    serializer = VolunteerSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Volunteer created successfully!"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
def update_volunteer(request, V_ID):
    try:
        volunteer = Volunteer.objects.get(V_ID=V_ID)
    except Volunteer.DoesNotExist:
        return Response({"error": "Volunteer not found!"}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = VolunteerSerializer(volunteer, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Volunteer updated successfully!"}, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def delete_volunteer(request, V_ID):
    try:
        volunteer = Volunteer.objects.get(V_ID=V_ID)
        volunteer.delete()
        return Response({"message": "Volunteer deleted successfully!"}, status=status.HTTP_200_OK)
    except Volunteer.DoesNotExist:
        return Response({"error": "Volunteer not found!"}, status=status.HTTP_404_NOT_FOUND)

# Event Views
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_events(request):
    try:
        events = Event.objects.all()
        serializer = EventSerializer(events, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_event_by_id(request, E_ID):
    try:
        event = Event.objects.get(E_ID=E_ID)
        serializer = EventSerializer(event)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Event.DoesNotExist:
        return Response({"error": "Event not found!"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def create_event(request):
    serializer = EventSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Event created successfully!"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
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

@api_view(['DELETE'])
def delete_event(request, E_ID):
    try:
        event = Event.objects.get(E_ID=E_ID)
        event.delete()
        return Response({"message": "Event deleted successfully!"}, status=status.HTTP_200_OK)
    except Event.DoesNotExist:
        return Response({"error": "Event not found!"}, status=status.HTTP_404_NOT_FOUND)