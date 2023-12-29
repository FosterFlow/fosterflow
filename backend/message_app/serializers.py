from rest_framework import serializers
from .models import Message, Agent, Chat

class MessageModelSerializer(serializers.ModelSerializer):
    chat_id = serializers.PrimaryKeyRelatedField(
        queryset=Chat.objects.all(), source='chat', write_only=True
    )
    owner_agent_id = serializers.PrimaryKeyRelatedField(
        queryset=Agent.objects.all(), source='owner_agent', write_only=True
    )
    addressee_agent_id = serializers.PrimaryKeyRelatedField(
        queryset=Agent.objects.all(), source='addressee_agent', write_only=True, required=False, allow_null=True
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

    def create(self, validated_data):
        # Since we're using `source` in the extra fields, `validated_data` will have the correct structure
        message = Message.objects.create(**validated_data)
        return message