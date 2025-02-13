from rest_framework import serializers
from .models import Volunteer

class VolunteerSerializer(serializers.ModelSerializer):
    V_Image_Urls = serializers.URLField(required=False, allow_blank=True)
    class Meta:
        model = Volunteer
        fields = '__all__'
        read_only_fields = ['V_ID'] 