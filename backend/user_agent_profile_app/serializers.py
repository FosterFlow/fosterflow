from django.contrib.auth import get_user_model
from user_app.validators import is_safe_name
from rest_framework import serializers
from .models import UserAgentProfile

User = get_user_model()


class UserAgentProfileSerializer(serializers.ModelSerializer):
    """
    Serializer class to serialize the user Profile model
    """

    def validate_first_name(self, data):
        if not is_safe_name(data):
            raise serializers.ValidationError("Not Valid")
        return data

    def validate_last_name(self, data):
        if not is_safe_name(data):
            raise serializers.ValidationError("Not Valid")
        return data

    class Meta:
        model = UserAgentProfile
        fields = ('user_agent_id', 'first_name', 'last_name', 'avatar', 'id')


class UserAgentProfileAvatarSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAgentProfile
        fields = ('avatar', )