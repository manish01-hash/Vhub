from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from Vapp.views import signup, login_view, logout_view 

def home(request):
    return JsonResponse({"message": "Welcome to Vhub API! Use /api/volunteers/ to interact."})  # ✅ Corrected URL

urlpatterns = [
    path('', home),  # ✅ Add homepage route
    path('admin/', admin.site.urls),
    path('api/', include('Vapp.urls')),
    path("api/auth/signup/", signup, name="signup"),  # ✅ Signup Route
    path("api/auth/login/", login_view, name="login"),  # ✅ Login Route
    path("api/auth/logout/", logout_view, name="logout"),  # ✅ Logout Route
    path("api/", include("Vapp.urls")),  # ✅ Include app-specific routes
]
