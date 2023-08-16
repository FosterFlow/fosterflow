from django.db import models
from user_app.models import Agent


class Chat(models.Model):
    """
    Model representing a chat.

    Attributes:
        user_id (ForeignKey): The user associated with the chat.
        name (TextField): The name of the chat.
        created_at (DateTimeField): The date and time of chat creation.
        updated_at (DateTimeField): The date and time of chat update.
    """

    owner_id = models.ForeignKey(
        Agent,
        on_delete=models.CASCADE,
        related_name='owner_id',
    )
    addressee_id = models.ForeignKey(
        Agent,
        on_delete=models.CASCADE,
        related_name='addressee',
    )
    name = models.TextField(max_length=32)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.id} {self.owner_id}'


class Message(models.Model):
    """
    Model representing a message.

    Attributes:
        chat_id (ForeignKey): The chat associated with the message.
        message_text (TextField): The text of the message.
        answer_text (TextField): The text of the answer (optional).
    """

    chat_id = models.ForeignKey(
        Chat,
        on_delete=models.CASCADE,
    )
    message_text = models.TextField()
    owner_id = models.ForeignKey(
        Agent,
        on_delete=models.CASCADE,
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.id} {self.owner_id}'
