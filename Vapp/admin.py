from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Event, Task, Registration

# ✅ Custom User Admin
class CustomUserAdmin(UserAdmin):
    list_display = ("email", "name", "phone", "role", "is_active", "is_staff")
    search_fields = ("email", "name")
    ordering = ("email",)

    fieldsets = (
        ("Basic Info", {"fields": ("email", "password", "name", "phone", "role")}),
        ("Permissions", {"fields": ("is_active", "is_staff", "is_superuser")}),
    )

    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("email", "name", "phone", "password1", "password2", "role", "is_staff"),
        }),
    )

admin.site.register(User, CustomUserAdmin)

# ✅ Event Admin - Fix ManyToManyField Issue
from django.contrib import admin
from .models import Event

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ("E_Name", "E_Start_Date", "E_End_Date", "E_Status")
    list_filter = ("E_Status", "E_Start_Date", "E_End_Date")
    search_fields = ("E_Name", "E_Location")

    fieldsets = (
        ("Event Details", {"fields": ("E_Name", "E_Description", "E_Location", "E_Status")}),
        ("Schedule", {"fields": ("E_Start_Date", "E_End_Date")}),
        ("Media", {"fields": ("E_Photo",)}),
    )

    readonly_fields = ("E_Created_By",)  # ✅ Show but don't let users edit

    def save_model(self, request, obj, form, change):
        """Automatically assign E_Created_By to the logged-in admin."""
        if not obj.E_Created_By:
            obj.E_Created_By = request.user  # ✅ Assign logged-in admin
        obj.save()



    def get_required_volunteers(self, obj):
        """Display required volunteers count safely."""
        return obj.E_Required_Volunteers if hasattr(obj, "E_Required_Volunteers") else "N/A"
    get_required_volunteers.short_description = "Required Volunteers"

# ✅ Task Admin
@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ("T_Name", "T_Priority_Level", "T_Status", "T_Deadline")
    search_fields = ("T_Name",)
    list_filter = ("T_Priority_Level", "T_Status")

# ✅ Registration Admin (Volunteer-Event Link)
@admin.register(Registration)
class RegistrationAdmin(admin.ModelAdmin):
    list_display = ("volunteer", "event", "display_qr_code")  
    search_fields = ("volunteer__name", "event__E_Name")

    def display_qr_code(self, obj):
        """Show QR code in admin panel."""
        if obj.qr_code:
            return f'<img src="{obj.qr_code.url}" width="50" height="50" style="border-radius: 5px;" />'
        return "No QR Code"
    display_qr_code.allow_tags = True
    display_qr_code.short_description = "QR Code"
