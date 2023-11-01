from rest_framework.serializers import ModelSerializer
from .models import Message

class MessageModelSerializer(ModelSerializer):
    """
    Serializer class for the Message model.

    This serializer is used to serialize and deserialize Message objects.

    Methods:
        create(self, validated_data): Creates a new message instance.
    """

    class Meta:
        model = Message
        fields = '__all__'

    def create(self, validated_data):
        """
        Creates a new message instance.

        This method creates a new Message instance with the provided data.
        It generates an answer text using the `take_answer` utility function.

        Args:
            validated_data (dict): The validated data containing message_text and chat_id.

        Returns:
            Message: The created message instance.
        """

        message = Message.objects.create(**validated_data)
        return message
