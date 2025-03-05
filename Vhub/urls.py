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
    
]