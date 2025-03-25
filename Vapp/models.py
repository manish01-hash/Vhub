from django.db import models
import uuid
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils import timezone
import qrcode
from io import BytesIO
from django.core.files.base import ContentFile
from django.utils.timezone import now
from django.conf import settings
import hashlib
import json
import base64
from datetime import datetime, timedelta
from django.utils.crypto import get_random_string
from django.http import JsonResponse
from django.shortcuts import render
from django.utils import timezone
from django.utils.timezone import make_aware, get_current_timezone
import cloudinary
import cloudinary.uploader
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from cloudinary.models import CloudinaryField
from django.utils.timezone import now, is_naive, make_aware

# Custom User Manager
class UserManager(BaseUserManager):
    def create_user(self, email, name, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        if password is None:
            raise ValueError("The Password field must be set")

        email = self.normalize_email(email)
        role = extra_fields.pop("role", "Volunteer")  # Default role if not provided
        user = self.model(email=email, name=name, role=role, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, name, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email, name, password, **extra_fields)

# User Model (Volunteer & Admin)
class User(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = (
    ("Volunteer", "Volunteer"),
    ("Event Organizer", "Event Organizer"),
    ("Admin", "Admin"),
    ("Coordinator", "Coordinator"),
    ("Super Volunteer", "Super Volunteer"),
)

    id = models.UUIDField(default=uuid.uuid4, primary_key=True, editable=False)
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=255)
    phone = models.CharField(max_length=15, blank=True, null=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    gender = models.CharField(max_length=10, blank=True, null=True)

    # College Information
    college_name = models.CharField(max_length=255, blank=True, null=True)
    faculty = models.CharField(max_length=255, blank=True, null=True)
    year_of_study = models.IntegerField(blank=True, null=True)

    # Profile Information
    profile_image = CloudinaryField('profile_images', blank=True, null=True)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["name", "role"]

    def __str__(self):
        return f"{self.name} ({self.role})"

User = get_user_model()  # ✅ Correct Placement

# ✅ OTP Verification Model (Moved Below User Model)
class OTPVerification(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="otp_verification")
    otp = models.CharField(max_length=6)  # ✅ Store 6-digit OTP
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"OTP for {self.user.email}"

# Event Modelfrom django.db import models
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.contrib.auth import get_user_model
import uuid
import cloudinary
import cloudinary.uploader
from cloudinary.models import CloudinaryField


User = get_user_model()


from django.db import models
import uuid
from django.utils.timezone import now, make_aware, is_naive
from cloudinary.models import CloudinaryField
from django.contrib.auth.models import User

class Event(models.Model):
    E_ID = models.UUIDField(default=uuid.uuid4, primary_key=True, editable=False)
    E_Name = models.CharField(max_length=255)
    E_Description = models.TextField()
    E_Start_Date = models.DateTimeField()
    E_End_Date = models.DateTimeField()
    E_Start_Time = models.TimeField(null=True, blank=True)
    E_End_Time = models.TimeField(null=True, blank=True)
    E_Location = models.TextField()
    E_Created_By = models.ForeignKey(User, on_delete=models.CASCADE, related_name="created_events", null=True, blank=True)
    E_Registered_Count = models.PositiveIntegerField(default=0)

    # Store event photo in Cloudinary
    E_Photo = CloudinaryField('event_photo', null=True, blank=True)

    # Volunteer & Role Assignments
    E_Required_Volunteers = models.PositiveIntegerField(default=10)
    E_Volunteers = models.ManyToManyField(User, through="Registration", related_name="volunteered_events", blank=True)
    E_Coordinators = models.ManyToManyField(User, related_name="coordinated_events", blank=True)
    E_Super_Volunteers = models.ManyToManyField(User, related_name="super_volunteer_events", blank=True)

    # ✅ Store status in the database instead of using @property
    E_Status = models.CharField(
        max_length=20,
        choices=[("Upcoming", "Upcoming"), ("Ongoing", "Ongoing"), ("Completed", "Completed")],
        default="Upcoming"
    )

    def save(self, *args, **kwargs):
        """Automatically update event status before saving."""
        current_time = now()

        if not self.E_Start_Date or not self.E_End_Date:
            self.E_Status = "Unknown"
        else:
            event_start = self.E_Start_Date
            event_end = self.E_End_Date

            if is_naive(event_start):
                event_start = make_aware(event_start)
            if is_naive(event_end):
                event_end = make_aware(event_end)

            if current_time < event_start:
                self.E_Status = "Upcoming"
            elif event_start <= current_time <= event_end:
                self.E_Status = "Ongoing"
            else:
                self.E_Status = "Completed"

        super().save(*args, **kwargs)

    def has_event_ended(self):
        """Check if the event has ended."""
        if self.E_End_Date:
            event_end = self.E_End_Date
            if self.E_End_Time:
                event_end = timezone.make_aware(timezone.datetime.combine(self.E_End_Date, self.E_End_Time))
            return timezone.now() >= event_end
        return False

    def __str__(self):
        return self.E_Name


class EventCertificate(models.Model):
    id = models.UUIDField(default=uuid.uuid4, primary_key=True, editable=False)
    event = models.ForeignKey("Event", on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    file = CloudinaryField('certificates', resource_type="raw")
    created_at = models.DateTimeField(auto_now_add=True) 
    
    class Meta:
        unique_together = ('event', 'user')  # Ensure one certificate per user per event
    
    def __str__(self):
        return f"Certificate for {self.user} - {self.event}"
    @classmethod
    def generate_certificate(cls, event, user):
        """
        Generates and uploads a certificate to Cloudinary
        Returns the certificate instance
        """
        # Check if certificate already exists
        existing_cert = cls.objects.filter(event=event, user=user).first()
        if existing_cert:
            return existing_cert

        # Generate certificate in memory (simplified example)
        from reportlab.pdfgen import canvas
        from io import BytesIO
        
        buffer = BytesIO()
        c = canvas.Canvas(buffer)
        
        # Draw certificate content
        c.drawString(100, 750, f"Certificate of Participation")
        c.drawString(100, 700, f"Event: {event.E_Name}")
        c.drawString(100, 650, f"Participant: {user.name}")
        c.drawString(100, 600, f"Date: {event.E_End_Date.strftime('%Y-%m-%d')}")
        c.showPage()
        c.save()
        
        buffer.seek(0)
        
        # Upload to Cloudinary
        upload_result = cloudinary.uploader.upload(
            buffer,
            folder="certificates/",
            public_id=f"cert_{event.E_ID}_{user.id}",
            resource_type="raw"
        )
        
        # Create and return certificate
        return cls.objects.create(
            event=event,
            user=user,
            file=upload_result['secure_url']
        )


class EventAnnouncement(models.Model):
    A_ID = models.UUIDField(default=uuid.uuid4, primary_key=True, editable=False)
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name="event_announcements")
    message = models.TextField()
    posted_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(default=now)

    def __str__(self):
        return f"Announcement for {self.event.E_Name}"

class Notification(models.Model):
    N_ID = models.UUIDField(default=uuid.uuid4, primary_key=True, editable=False)
    recipient = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="notifications")
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name="event_notifications")
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Notification for {self.recipient} - {self.event.E_Name}"
class SampleTask(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name="sample_tasks")
    task_name = models.CharField(max_length=255)
    task_description = models.TextField()

    def __str__(self):
        return f"{self.task_name} - {self.event.E_Name}"



# ✅ Store Registration Data (User-Event Link + QR Code)class Registration(models.Model):
class Registration(models.Model):
    R_ID = models.UUIDField(default=uuid.uuid4, primary_key=True, editable=False)
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name="registrations")
    volunteer = models.ForeignKey(User, on_delete=models.CASCADE, related_name="registrations")
    qr_code = models.ImageField(upload_to="qr_codes/", blank=True, null=True)  # ✅ Unique QR Code
    role = models.CharField(  # ✅ New field for event-specific roles
        max_length=50,
        choices=[
            ("Volunteer", "Volunteer"),
            ("Coordinator", "Coordinator"),
            ("Super Volunteer", "Super Volunteer"),
            ("Event Organizer", "Event Organizer")
        ],
        default="Volunteer"
    )

    def save(self, *args, **kwargs):
        if not self.qr_code:
            # Generate QR code in memory
            qr = qrcode.make(f"Event: {self.event.E_Name} | Volunteer: {self.volunteer.name}")
            buffer = BytesIO()
            qr.save(buffer, format="PNG")
            
            # Upload to Cloudinary
            upload_result = cloudinary.uploader.upload(
                buffer.getvalue(),
                folder="qr_codes/",
                public_id=f"qr_{self.R_ID}",
                resource_type="image"
            )
            
            # Store Cloudinary URL
            self.qr_code = upload_result['secure_url']

        super().save(*args, **kwargs)
        
        # Update event registered count
        self.event.E_Registered_Count = self.event.registrations.count()
        self.event.save()

    def __str__(self):
        return f"{self.volunteer.name} - {self.event.E_Name} - {self.event.E_ID} - {self.role}"
    
    



# Model to store QR Code details
class QRCode(models.Model):
    volunteer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="qr_codes")
    event = models.ForeignKey('Event', on_delete=models.CASCADE, related_name="qr_codes")
    qr_data = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    used = models.BooleanField(default=False)
    expires_at = models.DateTimeField()

    def is_expired(self):
        return timezone.now() > self.expires_at

# Attendance Model
class Attendance(models.Model):
    A_ID = models.UUIDField(default=uuid.uuid4, primary_key=True, editable=False)
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name="attendances")
    volunteer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="attendance_records")
    scanned_at = models.DateTimeField(default=timezone.now)  # Timestamp when QR is scanned

    class Meta:
        unique_together = ("event", "volunteer")  # Ensure QR is scanned only once

    def scan_qr(self):
        self.scanned_at = timezone.now()
        self.save()

    def __str__(self):
        return f"{self.volunteer.name} attended {self.event.E_Name}"

# Function to generate secure QR code
def generate_qr_code(volunteer, event):
    expiration_time = datetime.now() + timedelta(minutes=15)  # QR expires in 15 min
    base_url = "http://127.0.0.1:8000/qr/scan-result/"  # ✅ Change this to your domain in production
    
    raw_data = {
        "volunteer_id": str(volunteer.id),
        "event_id": str(event.E_ID),
        "timestamp": expiration_time.strftime("%Y-%m-%d %H:%M:%S"),
        "nonce": get_random_string(16)  # Prevent duplicate attacks
    }
    
    encoded_data = base64.b64encode(json.dumps(raw_data).encode()).decode()
    
    # ✅ Create a URL that opens in a browser after scanning
    qr_url = f"{base_url}?qr_data={encoded_data}"

    # Generate QR Code Image
    qr = qrcode.make(qr_url)
    qr_image_path = f"media/qrcodes/{volunteer.id}_{event.E_ID}.png"
    qr.save(qr_image_path)
    
    return qr_image_path



# Function to scan and validate QR code
def scan_qr_code(encoded_data, coordinator):
    try:
        decoded_data = base64.b64decode(encoded_data).decode()
        qr_info = json.loads(decoded_data)
        
        volunteer_id = qr_info.get("volunteer_id")
        event_id = qr_info.get("event_id")
        
        if not volunteer_id or not event_id:
            return JsonResponse({"error": "Invalid QR Code Data."}, status=400)

        qr_entry = QRCode.objects.filter(volunteer__id=volunteer_id, event__E_ID=event_id).first()

        if not qr_entry:
            return JsonResponse({"error": "Invalid QR Code."}, status=400)

        if qr_entry.used:
            return JsonResponse({"error": "This QR Code has already been used."}, status=400)

        if qr_entry.is_expired():
            return JsonResponse({"error": "QR Code has expired."}, status=400)

        # Mark QR as used
        qr_entry.used = True
        qr_entry.save()

        volunteer = qr_entry.volunteer
        event = qr_entry.event

        volunteer_details = {
            "name": volunteer.name,
            "faculty": volunteer.faculty,
            "college": volunteer.college_name,
            "event_name": event.E_Name,
            "profile_picture": volunteer.profile_image.url if volunteer.profile_image else None
        }

        return JsonResponse({"success": True, "volunteer_details": volunteer_details})

    except Exception as e:
        return JsonResponse({"error": f"Invalid QR Code Format: {str(e)}"}, status=400)


def qr_scan_result(request):
    try:
        qr_data = request.GET.get("qr_data")
        if not qr_data:
            return JsonResponse({"error": "No QR Data Provided"}, status=400)

        # ✅ Decode QR Data
        decoded_data = base64.b64decode(qr_data).decode()
        qr_info = json.loads(decoded_data)

        volunteer_id = qr_info.get("volunteer_id")
        event_id = qr_info.get("event_id")

        # ✅ Fetch Volunteer & Event Details
        from .models import User, Event
        volunteer = User.objects.get(id=volunteer_id)
        event = Event.objects.get(E_ID=event_id)

        context = {
            "volunteer_name": volunteer.name,
            "event_name": event.E_Name,
            "faculty": volunteer.faculty,
            "college_name": volunteer.college_name,
            "profile_picture": volunteer.profile_image.url if volunteer.profile_image else None
        }

        return render(request, "qr_scan_result.html", context)  # ✅ Show UI instead of plain text

    except Exception as e:
        return JsonResponse({"error": f"Invalid QR Code: {str(e)}"}, status=400)




# Task Model
class Task(models.Model):
    T_ID = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    event = models.ForeignKey("Event", on_delete=models.CASCADE, related_name="tasks") 
    title = models.CharField(max_length=255)
    description = models.TextField()
    assigned_to = models.ManyToManyField("User", related_name="tasks_assigned", blank=True)  
    created_by = models.ForeignKey("User", on_delete=models.CASCADE, related_name="tasks_created")
    deadline = models.DateTimeField(default=now)
    priority = models.CharField(
        max_length=20, choices=[("Low", "Low"), ("Medium", "Medium"), ("High", "High")]
    )
    status = models.CharField(
        max_length=20, choices=[
            ("Not Started", "Not Started"), 
            ("In Progress", "In Progress"), 
            ("Completed", "Completed")
        ], 
        default="Not Started"
    )

    def __str__(self):
        event_name = self.event.E_Name if self.event else "No Event"
        return f"{self.title} ({event_name}) - {self.status}"




