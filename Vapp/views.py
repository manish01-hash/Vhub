from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Volunteer
from rest_framework import status
from .serializers import VolunteerSerializer
import uuid

@api_view(['GET', 'POST'])
def create_volunteer(request):
    if request.method == 'GET':
        try:
            volunteers = Volunteer.objects.all()
            serializer = VolunteerSerializer(volunteers, many=True)
            return Response(serializer.data)
        except Exception as e:
            print("Error fetching volunteers:", e)  # Debugging
            return Response({"error": str(e)}, status=500)  # Send error response

    if request.method == 'POST':
        serializer = VolunteerSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Volunteer added successfully!"}, status=201)
        return Response(serializer.errors, status=400)



@api_view(['DELETE'])
def delete_volunteer_by_phone(request, phone_no):
    try:
        volunteer = Volunteer.objects.get(V_Phone_No=phone_no)
        volunteer.delete()
        return Response({"message": "Volunteer deleted successfully!"}, status=200)
    except Volunteer.DoesNotExist:
        return Response({"error": "Volunteer not found!"}, status=404)

@api_view(['PUT'])  # ✅ Must use PUT (not POST)
def update_volunteer(request, phone_no):
    try:
        volunteer = Volunteer.objects.get(V_Phone_No=phone_no)
    except Volunteer.DoesNotExist:
        return Response({"error": "Volunteer not found!"}, status=status.HTTP_404_NOT_FOUND)

    serializer = VolunteerSerializer(volunteer, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Volunteer updated successfully!"}, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(['POST'])
def get_volunteer_by_phone(request, phone_no):
    try:
        volunteer = Volunteer.objects.get(V_Phone_No=phone_no)
        serializer = VolunteerSerializer(volunteer)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Volunteer.DoesNotExist:
        return Response({"error": "Volunteer Not Found!"}, status=status.HTTP_404_NOT_FOUND)