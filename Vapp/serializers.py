from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, Event, Task, Attendance, Registration,EventAnnouncement,SampleTask,Notification
from django.utils import timezone 
from datetime import datetime, time
import logging
logger = logging.getLogger(__name__)

# ✅ User Serializerclass 
class UserSerializer(serializers.ModelSerializer):
    profile_image = serializers.SerializerMethodField()
    role = serializers.CharField(read_only=True)  # Make role read-only for security
    
    class Meta:
        model = User
        fields = [
            'id', 'email', 'name', 'phone', 'role',
            'gender', 'college_name', 'faculty', 'year_of_study', 
            'profile_image', 'is_active', 'created_at'
        ]
        read_only_fields = ['id', 'is_active', 'created_at']  # Auto fields
        extra_kwargs = {
            'email': {'validators': []}  # Disable default unique validator
        }

    def get_profile_image(self, obj):
        """Safe profile image URL generation with request context"""
        try:
            if obj.profile_image:
                request = self.context.get('request')
                if request:
                    # Return absolute URL with optimized image parameters
                    return request.build_absolute_uri(
                        f"{obj.profile_image.url}?w=200&h=200&c=fill"
                    )
                return obj.profile_image.url
            return None  # Explicit None instead of empty string
        except Exception as e:
            logger.error(f"Error getting profile image for user {obj.id}: {str(e)}")
            return None

    def validate_email(self, value):
        """Custom email validation"""
        if not value:
            raise serializers.ValidationError("Email is required")
        if not '@' in value:
            raise serializers.ValidationError("Enter a valid email address")
        return value.lower()  # Normalize to lowercase

    def validate_phone(self, value):
        """Basic phone number validation"""
        if value and len(value) < 8:
            raise serializers.ValidationError("Phone number too short")
        return value

    def to_representation(self, instance):
        """Final representation with additional calculated fields"""
        data = super().to_representation(instance)
        
        # Add calculated fields if needed
        if self.context.get('include_stats', False):
            data['events_attended'] = instance.attended_events.count()
            data['tasks_completed'] = instance.tasks.filter(status='Completed').count()
        
        # Remove null values if preferred
        data = {k: v for k, v in data.items() if v is not None}
        
        return data




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
    E_Volunteers = serializers.SerializerMethodField()
    E_Registered_Count = serializers.SerializerMethodField()
    E_Photo = serializers.SerializerMethodField()
    announcements = serializers.SerializerMethodField()
    sample_tasks = serializers.SerializerMethodField()
    E_Status = serializers.SerializerMethodField()
    is_registered = serializers.SerializerMethodField()
    user_role = serializers.SerializerMethodField()
    E_Created_By = UserSerializer(read_only=True)
    class Meta:
        model = Event
        fields = '__all__'
        read_only_fields = ['E_ID', 'E_Status']
        extra_kwargs = {
            'E_Photo': {'write_only': True}
        }

    def get_E_Volunteers(self, obj):
        """Optimized volunteer list through prefetched registrations"""
        try:
            if hasattr(obj, 'prefetched_registrations'):
                volunteers = [reg.volunteer for reg in obj.prefetched_registrations]
            else:
                volunteers = obj.E_Volunteers.all()[:20]  # Limit for safety
            
            return UserSerializer(
                volunteers,
                many=True,
                context=self.context
            ).data
        except Exception as e:
            logger.error(f"Error getting volunteers for event {obj.E_ID}: {str(e)}")
            return []

    def get_E_Registered_Count(self, obj):
        """Efficient count of registrations"""
        try:
            if hasattr(obj, 'registration_count'):
                return obj.registration_count
            return obj.registrations.count()
        except Exception as e:
            logger.error(f"Error counting registrations: {str(e)}")
            return 0

    def get_E_Status(self, obj):
        """Robust status calculation with timezone handling"""
        try:                
            current_time = timezone.localtime(timezone.now())
            
            if None in [obj.E_Start_Date, obj.E_Start_Time, obj.E_End_Date, obj.E_End_Time]:
                return "Unknown"

            start_datetime = timezone.make_aware(datetime.combine(
                obj.E_Start_Date, 
                obj.E_Start_Time
            ))
            end_datetime = timezone.make_aware(datetime.combine(
                obj.E_End_Date, 
                obj.E_End_Time
            ))

            if current_time < start_datetime:
                return "Upcoming"
            elif start_datetime <= current_time <= end_datetime:
                return "Ongoing"
            return "Completed"
            
        except Exception as e:
            logger.error(f"Status calculation error for event {obj.E_ID}: {str(e)}")
            return "Error"

    def get_E_Photo(self, obj):
        """Safe handling of image URLs"""
        try:
            if obj.E_Photo:
                request = self.context.get('request')
                if request and hasattr(obj.E_Photo, 'url'):
                    return request.build_absolute_uri(obj.E_Photo.url)
                return str(obj.E_Photo)
        except Exception as e:
            logger.error(f"Photo URL error for event {obj.E_ID}: {str(e)}")
        return None

    def get_announcements(self, obj):
        """Get recent announcements with limit"""
        try:
            announcements = obj.event_announcements.order_by('-created_at')[:3]
            return EventAnnouncementSerializer(
                announcements, 
                many=True,
                context=self.context
            ).data
        except Exception as e:
            logger.error(f"Error getting announcements: {str(e)}")
            return []

    def get_sample_tasks(self, obj):
        """Get sample tasks with optimization"""
        try:
            if hasattr(obj, 'prefetched_sample_tasks'):
                tasks = obj.prefetched_sample_tasks
            else:
                tasks = obj.sample_tasks.all()[:5]
            return SampleTaskSerializer(tasks, many=True).data
        except Exception as e:
            logger.error(f"Error getting sample tasks: {str(e)}")
            return []

    def get_is_registered(self, obj):
        """Check if current user is registered"""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            try:
                if hasattr(obj, 'prefetched_user_registration'):
                    return bool(obj.prefetched_user_registration)
                return obj.registrations.filter(volunteer=request.user).exists()
            except Exception as e:
                logger.error(f"Registration check error: {str(e)}")
        return False

    def get_user_role(self, obj):
        """Determine current user's role in event"""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            user = request.user
            if user in obj.E_Coordinators.all():
                return "Coordinator"
            if user in obj.E_Super_Volunteers.all():
                return "Super Volunteer"
            if user in obj.E_Volunteers.all():
                return "Volunteer"
        return None

    def to_representation(self, instance):
        """Final representation with calculated fields"""
        data = super().to_representation(instance)
        
        # Add calculated fields
        data['days_remaining'] = self._calculate_days_remaining(instance)
        data['progress_percentage'] = self._calculate_progress(instance)
        
        return data

    def _calculate_days_remaining(self, event):
        """Helper for days remaining calculation"""
        try:
            if event.E_Status == "Upcoming" and event.E_Start_Date:
                delta = event.E_Start_Date - timezone.now().date()
                return max(0, delta.days)
        except Exception as e:
            logger.error(f"Days remaining calculation error: {str(e)}")
        return None

    def _calculate_progress(self, event):
        """Calculate event progress percentage"""
        try:
            if event.E_Status == "Ongoing":
                total_duration = (event.E_End_Date - event.E_Start_Date).days
                elapsed_days = (timezone.now().date() - event.E_Start_Date).days
                return min(100, max(0, int((elapsed_days / total_duration) * 100)))
        except Exception as e:
            logger.error(f"Progress calculation error: {str(e)}")
        return None



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
