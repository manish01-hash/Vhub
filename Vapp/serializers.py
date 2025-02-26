from rest_framework import serializers
from .models import Volunteer,Event

class VolunteerSerializer(serializers.ModelSerializer):
    V_Image_Urls = serializers.URLField(required=False, allow_blank=True)
    class Meta:
        model = Volunteer
        fields = '__all__'
        read_only_fields = ['V_ID'] 
        

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = '__all__'
        #read_only_fields = ['E_ID']
