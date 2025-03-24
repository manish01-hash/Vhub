import os
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'your_project.settings')  # Replace with your project's name
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

# Define superuser credentials
SUPERUSER_USERNAME = "vcoders"
SUPERUSER_EMAIL = "vcoders04@gmail.com"
SUPERUSER_PASSWORD = "vcoders@123"

# Check if superuser exists, otherwise create one
if not User.objects.filter(username=SUPERUSER_USERNAME).exists():
    User.objects.create_superuser(SUPERUSER_USERNAME, SUPERUSER_EMAIL, SUPERUSER_PASSWORD)
    print("Superuser created successfully.")
else:
    print("Superuser already exists.")
