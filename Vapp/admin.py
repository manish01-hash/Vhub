from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.html import format_html
from .models import Event, Task, Registration, Notification
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _

User = get_user_model()  # ✅ Get custom user model

# ✅ Custom User Admin
@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ("email", "name", "phone", "role", "gender", "college_name", "faculty", "year_of_study", "is_active", "is_staff", "profile_image_tag")
    search_fields = ("email", "name", "phone", "college_name", "faculty")
    ordering = ("email",)

    fieldsets = (
        ("Basic Info", {"fields": ("email", "password", "name", "profile_image", "phone", "role", "gender", "college_name", "faculty", "year_of_study")}),
        ("Permissions", {"fields": ("is_active", "is_staff", "is_superuser")}),
        ("Important Dates", {"fields": ("last_login", "created_at")}),
    )

    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("email", "name", "phone", "password1", "password2", "role", 
            "gender", "college_name", "profile_image", "faculty", "year_of_study", "is_staff"),
        }),
    )

    def profile_image_tag(self, obj):
        if obj.profile_image:
            return format_html('<img src="{}" width="50" height="50" style="border-radius: 5px;" />', obj.profile_image.url)
        return "No Image"
    profile_image_tag.short_description = "Profile Image"


# ✅ Event Admin (Now Includes Attendance & Volunteers Info)

class EventStatusFilter(admin.SimpleListFilter):
    title = _('Event Status')
    parameter_name = 'e_status'

    def lookups(self, request, model_admin):
        return [
            ('Upcoming', _('Upcoming')),
            ('Ongoing', _('Ongoing')),
            ('Completed', _('Completed')),
        ]

    def queryset(self, request, queryset):
        status = self.value()
        if status:
            filtered_ids = [event.id for event in queryset if event.E_Status == status]
            return queryset.filter(id__in=filtered_ids)
        return queryset


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ("E_ID", "E_Name", "E_Start_Date", "E_End_Date", "display_E_Status", 
                    "total_volunteers", "checked_in_volunteers", "pending_volunteers")
    list_filter = (EventStatusFilter, "E_Start_Date", "E_End_Date")
    search_fields = ("E_Name", "E_Location")
    filter_horizontal = ("E_Coordinators", "E_Super_Volunteers")  # Removed E_Volunteers

    fieldsets = (
        ("Basic Info", {
            "fields": (
                "E_ID",
                "E_Name", 
                "E_Description",
                "E_Location",
                "E_Required_Volunteers",
                "E_Photo"
            )
        }),
        ("Schedule", {
            "fields": (
                "E_Start_Date",
                "E_End_Date",
                "E_Start_Time",
                "E_End_Time"
            )
        }),
        ("Personnel", {
            "fields": (
                
                # Removed E_Volunteers from here
                "E_Coordinators",
                "E_Super_Volunteers"
            )
        }),
    )

    readonly_fields = ("E_ID", "display_event_photo")

    def display_E_Status(self, obj):
        return obj.E_Status
    display_E_Status.short_description = "Event Status"

    def display_event_photo(self, obj):
        if obj.E_Photo:
            return format_html(
                '<img src="{}" width="100" height="100" style="border-radius: 5px;" />', 
                obj.E_Photo.url
            )
        return "No Image"
    display_event_photo.short_description = "Event Photo"

    

    def total_volunteers(self, obj):
        return obj.registrations.count()
    total_volunteers.short_description = "Total Volunteers"

    def checked_in_volunteers(self, obj):
        return obj.attendances.count()
    checked_in_volunteers.short_description = "Checked In"

    def pending_volunteers(self, obj):
        return obj.registrations.count() - obj.attendances.count()
    pending_volunteers.short_description = "Pending Check-in"
# ✅ Task Admin
@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ("title", "priority", "status", "deadline", "event")
    list_filter = ("priority", "status")
    search_fields = ("title", "description")

    def event(self, obj):
        """Display related event name."""
        return obj.event.E_Name if obj.event else "No Event Assigned"
    event.short_description = "Event"


# ✅ Registration (Volunteer Attendance & QR Code)
@admin.register(Registration)
class RegistrationAdmin(admin.ModelAdmin):
    list_display = ("volunteer", "event", "event_id", "role", "attendance_status", "display_qr_code")  
    search_fields = ("volunteer__name", "event__E_Name")

    def event_id(self, obj):
        """Display Event ID."""
        return obj.event.E_ID
    event_id.short_description = "Event ID"

    def attendance_status(self, obj):
        """Show attendance status based on QR code scan."""
        return "Checked-in" if obj.qr_code else "Not Checked-in"
    attendance_status.short_description = "Attendance"

    def display_qr_code(self, obj):
        """Show QR code in admin panel."""
        if obj.qr_code:
            return format_html('<img src="{}" width="50" height="50" style="border-radius: 5px;" />', obj.qr_code.url)
        return "No QR Code"

    display_qr_code.allow_tags = True
    display_qr_code.short_description = "QR Code"


# ✅ Notification Admin
@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ("recipient", "event", "message", "created_at", "is_read")  
    list_filter = ("is_read", "created_at")  
    search_fields = ("recipient__name", "event__E_Name", "message")


