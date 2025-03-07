from django.db import models
import uuid
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils import timezone
import qrcode
from io import BytesIO
from django.core.files.base import ContentFile
from django.utils.timezone import now

from django.conf import settings

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
)

    id = models.UUIDField(default=uuid.uuid4, primary_key=True, editable=False)
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=255)
    phone = models.CharField(max_length=15, blank=True, null=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)

    # College Information
    college_name = models.CharField(max_length=255, blank=True, null=True)
    faculty = models.CharField(max_length=255, blank=True, null=True)
    year_of_study = models.IntegerField(blank=True, null=True)

    # Profile Information
    profile_image = models.ImageField(upload_to="profile_images/", blank=True, null=True)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["name", "role"]

    def __str__(self):
        return f"{self.name} ({self.role})"

# Event Model
class Event(models.Model):
    E_ID = models.UUIDField(default=uuid.uuid4, primary_key=True, editable=False)
    E_Name = models.CharField(max_length=255)
    E_Description = models.TextField()
    E_Start_Date = models.DateTimeField()
    E_End_Date = models.DateTimeField()
    E_Location = models.TextField()
    E_Created_By = models.ForeignKey(User, on_delete=models.CASCADE, related_name="created_events", null=True, blank=True)
    E_Registered_Count = models.PositiveIntegerField(default=0)

    # ✅ Restore These Fields
    E_Photo = models.ImageField(upload_to="event_photos/", blank=True, null=True)
    E_Required_Volunteers = models.PositiveIntegerField(default=10)  # Volunteers Needed
    E_Volunteers = models.ManyToManyField("User", through="Registration", related_name="volunteered_events", blank=True)  

    E_Coordinators = models.ManyToManyField(User, related_name="coordinated_events", blank=True)
    E_Super_Volunteers = models.ManyToManyField(User, related_name="super_volunteer_events", blank=True)

    E_Status = models.CharField(
        max_length=20,
        choices=[("Upcoming", "Upcoming"), ("Ongoing", "Ongoing"), ("Completed", "Completed")],
        default="Upcoming"
    )
    
    def __str__(self):
        return self.E_Name
class EventAnnouncement(models.Model):
    A_ID = models.UUIDField(default=uuid.uuid4, primary_key=True, editable=False)
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name="announcements")
    posted_by = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.TextField()
    posted_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Announcement for {self.event.E_Name} by {self.posted_by.name}"

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

    def save(self, *args, **kwargs):
        if not self.qr_code:  # ✅ Prevent regenerating QR codes
            qr = qrcode.make(f"Event: {self.event.E_Name} | Volunteer: {self.volunteer.name}")
            buffer = BytesIO()
            qr.save(buffer, format="PNG")
            self.qr_code.save(f"qr_{self.R_ID}.png", ContentFile(buffer.getvalue()), save=False)

        super().save(*args, **kwargs)

        # ✅ Update event registered count
        self.event.E_Registered_Count = self.event.registrations.count()
        self.event.save()

    def __str__(self):
        return f"{self.volunteer.name} - {self.event.E_Name} - {self.event.E_ID}"





# Task Model
class Task(models.Model):
    T_ID = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name="tasks",blank=True, null=True)  # ✅ Ensure event is added
    title = models.CharField(max_length=255)
    description = models.TextField()
    assigned_to = models.ManyToManyField(User, related_name="tasks_assigned")  # ✅ Ensure assigned_to is present
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name="tasks_created")
    deadline = models.DateTimeField(default=now)
    priority = models.CharField(max_length=20, choices=[("Low", "Low"), ("Medium", "Medium"), ("High", "High")])
    status = models.CharField(max_length=20, choices=[("Not Started", "Not Started"), ("In Progress", "In Progress"), ("Completed", "Completed")], default="Not Started")

    def __str__(self):
        return self.title

    def __str__(self):
        return f"{self.title} - {self.status}"

    def __str__(self):
        return f"{self.title} - {self.event.E_Name}"


# Attendance Model
class Attendance(models.Model):
    A_ID = models.UUIDField(default=uuid.uuid4, primary_key=True, editable=False)
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name="attendances")
    volunteer = models.ForeignKey(User, on_delete=models.CASCADE, related_name="attendance_records")
    scanned_at = models.DateTimeField(default=timezone.now)  # Timestamp when QR is scanned

    class Meta:
        unique_together = ("event", "volunteer")  # Ensure QR is scanned only once

    def scan_qr(self):
        """ ✅ Mark attendance when QR is scanned """
        self.scanned_at = timezone.now()
        self.save()

    def __str__(self):
        return f"{self.volunteer.name} attended {self.event.E_Name}"
