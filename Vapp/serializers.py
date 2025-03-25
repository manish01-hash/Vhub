from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, Event, Task, Attendance, Registration,EventAnnouncement,SampleTask,Notification


# ✅ User Serializerclass UserSerializer(serializers.ModelSerializer):
class UserSerializer(serializers.ModelSerializer):
    profile_image = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id', 'email', 'name', 'phone', 'role',
            'gender', 'college_name', 'faculty', 'year_of_study', 
            'profile_image', 'is_active', 'created_at'
        ]
    
    def get_profile_image(self, obj):
        return obj.profile_image.url if obj.profile_image else ""




# ✅ Signup Serializer
class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ['email', 'name', 'phone', 'role', 'college_name', 'faculty', 'year_of_study', 'password']

    def create(self, validated_data):
        return User.objects.create_user(
            email=validated_data['email'],
            name=validated_data['name'],
            phone=validated_data.get('phone', ''),  # ✅ Default to empty string if not provided
            role=validated_data.get('role', 'Volunteer'),  # ✅ Default role as "Volunteer"
            gender=validated_data.get('gender', ''),
            college_name=validated_data.get('college_name', ''),  # ✅ Default to empty
            faculty=validated_data.get('faculty', ''),
            year_of_study=validated_data.get('year_of_study', None),  # ✅ Allow null
            password=validated_data['password']
        )

# ✅ Login Serializer
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(username=data['email'], password=data['password'])
        if not user:
            raise serializers.ValidationError('Invalid email or password.')
        if not user.is_active:
            raise serializers.ValidationError('User account is inactive.')
        return {'user': user}

# ✅ Registration Serializer (Handles event sign-ups & QR codes)



class EventAnnouncementSerializer(serializers.ModelSerializer):
    posted_by = UserSerializer(read_only=True)

    class Meta:
        model = EventAnnouncement
        fields = "__all__"

class SampleTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = SampleTask
        fields = "__all__"


# Update EventSerializer to handle Cloudinary URLs
class EventSerializer(serializers.ModelSerializer):
    E_Created_By = UserSerializer(read_only=True)
    E_Volunteers = UserSerializer(many=True, read_only=True)
    E_Registered_Count = serializers.IntegerField(read_only=True)
    E_Photo = serializers.IMAGEFIELD()
    announcements = EventAnnouncementSerializer(many=True, read_only=True)
    sample_tasks = SampleTaskSerializer(many=True, read_only=True)
    E_Status = serializers.SerializerMethodField() 

    class Meta:
        model = Event
        fields = '__all__'
        read_only_fields = ['E_ID', 'E_Status']  # ✅ Ensure E_Status is read-only

    def get_E_Status(self, obj):
        return obj.E_Status  # ✅ This ensures the frontend receives E_Status dynamically

    def get_E_Photo(self, obj):
        if obj.E_Photo:
            try:
                return obj.E_Photo.url  # ✅ Safe way to access Cloudinary image URL
            except AttributeError:
                return None  # ✅ Avoids errors if `.url` does not exist
        return None  # ✅ Ensures None is returned safely



class EventAnnouncementSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventAnnouncement
        fields = "__all__"
        read_only_fields = ["A_ID", "event", "posted_by", "created_at"]


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = "__all__"
        read_only_fields = ["N_ID", "recipient", "event", "created_at"]




# ✅ Task Serializer (Shows assigned user & related event)
class TaskSerializer(serializers.ModelSerializer):
    assigned_to = UserSerializer(many=True, read_only=True)
    created_by = UserSerializer(read_only=True)

    class Meta:
        model = Task
        fields = "__all__"


# ✅ Attendance Serializer (Handles QR Code Scanning)
class AttendanceSerializer(serializers.ModelSerializer):
    event = EventSerializer(read_only=True)
    volunteer = UserSerializer(read_only=True)

    class Meta:
        model = Attendance
        fields = '__all__'
        read_only_fields = ['A_ID', 'scanned_at']
        

# Update RegistrationSerializer to handle Cloudinary URLs
class RegistrationSerializer(serializers.ModelSerializer):
    volunteer = UserSerializer(read_only=True)
    event = EventSerializer(read_only=True)
    qr_code = serializers.SerializerMethodField()

    class Meta:
        model = Registration
        fields = ['R_ID', 'event', 'volunteer', 'qr_code']
        read_only_fields = ['R_ID', 'qr_code']

    def get_qr_code(self, obj):
        if obj.qr_code:
            return obj.qr_code.url
        return None
