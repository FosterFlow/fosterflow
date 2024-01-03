from rest_framework import serializers
from .models import Message, Agent, Chat

class MessageModelSerializer(serializers.ModelSerializer):
    chat_id = serializers.PrimaryKeyRelatedField(
        queryset=Chat.objects.all(), source='chat'
    )
    owner_agent_id = serializers.PrimaryKeyRelatedField(
        queryset=Agent.objects.all(), source='owner_agent'
    )
    addressee_agent_id = serializers.PrimaryKeyRelatedField(
        queryset=Agent.objects.all(), source='addressee_agent'
    )

    class Meta:
        model = Message
        fields = [
            'id',  # Assuming you want the message ID in the serialized output
            'chat_id',
            'message_text',
            'owner_agent_id',
            'addressee_agent_id',
            'created_at',  # If you want to include timestamps
            'updated_at',  # If you want to include timestamps
            # Any other fields you want to include
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']  # Make non-writable fields read-only