from django.contrib.auth import get_user_model
from rest_framework.serializers import ModelSerializer
from .models import Chat
from rest_framework import serializers

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
