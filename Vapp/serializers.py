from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, Event, Task, Attendance, Registration

# ✅ User Serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'email', 'name', 'phone', 'role',
            'college_name', 'faculty', 'year_of_study', 
            'profile_image', 'is_active', 'created_at'
        ]

# ✅ Signup Serializer
class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ['email', 'name', 'phone', 'role', 'college_name', 'faculty', 'year_of_study', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            name=validated_data['name'],
            phone=validated_data.get('phone', ''),
            role=validated_data['role'],
            college_name=validated_data.get('college_name', ''),
            faculty=validated_data.get('faculty', ''),
            year_of_study=validated_data.get('year_of_study', None),
            password=validated_data['password']
        )
        return user

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
class RegistrationSerializer(serializers.ModelSerializer):
    volunteer = UserSerializer(read_only=True)
    event = serializers.PrimaryKeyRelatedField(queryset=Event.objects.all())

    class Meta:
        model = Registration
        fields = ['R_ID', 'event', 'volunteer', 'qr_code']
        read_only_fields = ['R_ID', 'qr_code']

# ✅ Event Serializer (Includes Volunteers & Registration Count)
class EventSerializer(serializers.ModelSerializer):
    E_Created_By = UserSerializer(read_only=True)  # Show event creator details
    E_Volunteers = UserSerializer(many=True, read_only=True)  # Show registered volunteers
    E_Registered_Count = serializers.IntegerField(read_only=True)  # Track number of registered volunteers

    class Meta:
        model = Event
        fields = '__all__'
        read_only_fields = ['E_ID']

# ✅ Task Serializer (Shows assigned user & related event)
class TaskSerializer(serializers.ModelSerializer):
    Assigned_To = UserSerializer(read_only=True)  # Show user details
    Related_Event = EventSerializer(read_only=True)  # Show event details

    class Meta:
        model = Task
        fields = '__all__'
        read_only_fields = ['T_ID']

# ✅ Attendance Serializer (Handles QR Code Scanning)
class AttendanceSerializer(serializers.ModelSerializer):
    event = EventSerializer(read_only=True)
    volunteer = UserSerializer(read_only=True)

    class Meta:
        model = Attendance
        fields = '__all__'
        read_only_fields = ['A_ID', 'scanned_at']
