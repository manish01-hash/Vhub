import os
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Vhub.settings')  # Replace with your project's name
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

# Define superuser credentials
SUPERUSER_NAME = "vcoders"
SUPERUSER_EMAIL = "vcoders04@gmail.com"
SUPERUSER_PASSWORD = "vcoders@123"

# Check if superuser exists, otherwise create one
if not User.objects.filter(email=SUPERUSER_EMAIL).exists():  # Change 'email' if needed
    user = User.objects.create_superuser(
        name=SUPERUSER_NAME,  # Change this if needed
        email=SUPERUSER_EMAIL,
        password=SUPERUSER_PASSWORD
    )
    print("Superuser created successfully.")
else:
    print("Superuser already exists.")