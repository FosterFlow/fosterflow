from django.contrib.auth import get_user_model
from user_app.validators import is_safe_username, is_safe_name
from rest_framework import serializers
from agent_app.models import Agent

User = get_user_model()


class CustomUserSerializer(serializers.ModelSerializer):
    """
    Serializer class to serialize CustomUser model.
    """

    class Meta:
        model = User
        fields = ("id", "username",)

    def validate_username(self, data):
        if data.startswith('id'):
            raise serializers.ValidationError("Incorrect username")
        elif not is_safe_username(data):
            raise serializers.ValidationError("Not Valid")
        return data


class SelfUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'last_login', 'username', 'email', 'is_email_confirmed', 'created_at', 'updated_at']


class AgentSerializer(CustomUserSerializer):
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
        model = Agent
        fields = ('user_id', 'first_name', 'last_name', 'avatar')


class UserAvatarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Agent
        fields = ('avatar', )
