from django.contrib.auth import get_user_model
from rest_framework.serializers import ModelSerializer
from .models import Chat
from rest_framework import serializers
from agent_app.models import Agent

User = get_user_model()


class ChatModelSerializer(ModelSerializer):
    
    owner_agent_id = serializers.PrimaryKeyRelatedField(
        queryset=Agent.objects.all(), source='owner_agent'
    )

    addressee_agent_id = serializers.PrimaryKeyRelatedField(
        queryset=Agent.objects.all(), source='addressee_agent'
    )

    class Meta:
        model = Chat
        fields = [
            'id',  # Assuming you want the message ID in the serialized output
            'name',
            'owner_agent_id',
            'addressee_agent_id',
            'created_at',  
            'updated_at',  
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']  # Make non-writable fields read-only