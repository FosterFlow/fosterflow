from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()

class SelfUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'last_login', 'username', 'email', 'is_email_confirmed', 'created_at', 'updated_at']