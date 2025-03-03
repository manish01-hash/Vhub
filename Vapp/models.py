from django.db import models
import uuid

# Role Model
class Role(models.Model):
    R_ID = models.UUIDField(default=uuid.uuid4, primary_key=True, editable=False)
    R_Name = models.CharField(max_length=255, unique=True)
    R_Permissions = models.JSONField(default=list)

# Volunteer Model
class Volunteer(models.Model):
    V_ID = models.UUIDField(default=uuid.uuid4, primary_key=True, editable=False)
    V_Name = models.CharField(max_length=255)
    V_Email = models.EmailField(unique=True)
    V_Phone_No = models.CharField(max_length=15)
    V_Address = models.TextField()
    V_Status = models.BooleanField(default=False)
    V_Skills = models.JSONField(default=list, blank=True, null=True)
    V_Availability = models.BooleanField(default=False)
    V_Gender = models.CharField(max_length=50)
    V_Age = models.IntegerField(null=True, blank=True)
    V_Image_Urls = models.URLField(blank=True, null=True, default="")
    R_ID = models.ForeignKey(Role, on_delete=models.SET_NULL, null=True, blank=True, db_column='R_ID')

# Event Model
class Event(models.Model):
    E_ID = models.UUIDField(default=uuid.uuid4, primary_key=True, editable=False)
    E_Name = models.CharField(max_length=255)
    E_Description = models.TextField()
    E_Start_Date = models.DateTimeField()
    E_End_Date = models.DateTimeField()
    E_Location = models.TextField()
    V_ID = models.ForeignKey(Volunteer, on_delete=models.SET_NULL, null=True, blank=True, db_column='V_ID')
    E_Volunteers = models.ManyToManyField(Volunteer, related_name='events', blank=True)
    E_Tasks = models.ManyToManyField('Task', related_name='events', blank=True)

# Task Model
class Task(models.Model):
    T_ID = models.UUIDField(default=uuid.uuid4, primary_key=True, editable=False)
    T_Name = models.CharField(max_length=255)
    T_Description = models.TextField()
    T_Priority_Level = models.CharField(max_length=50)
    T_Status = models.BooleanField(default=False)
    T_Deadline = models.DateTimeField()
    V_ID = models.ForeignKey(Volunteer, on_delete=models.CASCADE, db_column='V_ID', null=True, blank=True)

# Skill Model
class Skill(models.Model):
    S_ID = models.UUIDField(default=uuid.uuid4, primary_key=True, editable=False)
    S_Name = models.CharField(max_length=255)
    S_Level = models.CharField(max_length=50)
    V_ID = models.ForeignKey(Volunteer, on_delete=models.CASCADE, related_name='skills', null=True, blank=True, db_column='V_ID')

# Registration Model
class Registration(models.Model):
    R_ID = models.UUIDField(default=uuid.uuid4, primary_key=True, editable=False)
    E_ID = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='registrations', db_column='E_ID')
    V_ID = models.ForeignKey(Volunteer, on_delete=models.CASCADE, related_name='registrations', db_column='V_ID')
