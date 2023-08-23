from django_filters import rest_framework as filters
from .models import Message


class MessageFilter(filters.FilterSet):
    """
    Filter class for the Message model.

    This class defines filters for the Message model based on the `chat_id` field.

    Meta:
        model (Message): The model to filter.
        fields (list): The fields to include as filters.
    """

    class Meta:
        model = Message
        fields = ['chat_id']
