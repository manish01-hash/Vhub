from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Volunteer
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
