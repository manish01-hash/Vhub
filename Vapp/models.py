from django.db import models
import uuid
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils import timezone
import qrcode
from io import BytesIO
from django.core.files.base import ContentFile

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
        ("Admin", "Admin"),
        ("Coordinator", "Coordinator"),
        ("Moderator", "Moderator"),
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


    # ✅ Restore These Fields
    E_Photo = models.ImageField(upload_to="event_photos/", blank=True, null=True)  # Event Image
    E_Required_Volunteers = models.PositiveIntegerField(default=10)  # Volunteers Needed
    E_Volunteers = models.ManyToManyField("User", through="Registration", related_name="volunteered_events", blank=True)  

    E_Status = models.CharField(
        max_length=20,
        choices=[("Upcoming", "Upcoming"), ("Ongoing", "Ongoing"), ("Completed", "Completed")],
        default="Upcoming"
    )

    def __str__(self):
        return self.E_Name


# ✅ Store Registration Data (User-Event Link + QR Code)
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
        return f"{self.volunteer.name} - {self.event.E_Name}"

# Task Model
class Task(models.Model):
    T_ID = models.UUIDField(default=uuid.uuid4, primary_key=True, editable=False)
    T_Name = models.CharField(max_length=255)
    T_Description = models.TextField()
    T_Priority_Level = models.CharField(max_length=50, choices=[
        ("Low", "Low"),
        ("Medium", "Medium"),
        ("High", "High")
    ])
    T_Status = models.BooleanField(default=False)  # True: Completed, False: Pending
    T_Deadline = models.DateTimeField()
    Assigned_To = models.ForeignKey(User, on_delete=models.CASCADE, related_name="tasks", null=True, blank=True)
    Related_Event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name="event_tasks", null=True, blank=True)

    def __str__(self):
        return f"{self.T_Name} (Priority: {self.T_Priority_Level})"

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
