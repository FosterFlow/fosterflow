from django.contrib.auth import get_user_model
from rest_framework.serializers import ModelSerializer
from .models import Chat, Message
from rest_framework import serializers
from .request_to_agent import take_answer

User = get_user_model()


class ChatModelSerializer(ModelSerializer):
    """
    Serializer class for the Chats model.

    This serializer is used to serialize and deserialize Chats objects.

    Fields:
        latest_message (SerializerMethodField): The latest message associated with the chat.
    """

    latest_message = serializers.SerializerMethodField()

    class Meta:
        model = Chat
        fields = '__all__'

    def get_latest_message(self, obj):
        """
        Get the latest message associated with the chat.

        This method retrieves the latest message associated with the chat
        by filtering the messages based on the chat ID and ordering them
        by descending ID. It returns the answer text of the latest message
        or None if no messages are found.

        Args:
            obj (Chat): The Chats object.

        Returns:
            str or None: The answer text of the latest message or None.
        """
        try:
            customer_account_query = Message.objects.filter(
                chat_id=obj.id
            ).latest('id')

            return customer_account_query.message_text
        except Exception as e:
            return None


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
            validated_data (dict): The validated data containing message_text and dialog_id.

        Returns:
            Message: The created message instance.
        """

        answer_text = "take_answer(validated_data['message_text'], validated_data['chat_id'])"
        message = Message.objects.create(**validated_data)
        return message
