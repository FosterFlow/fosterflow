from django.db import models
from agent_app.models import Agent
from chat_app.models import Chat

class Message(models.Model):
    """
    Model representing a message.

    Attributes:
        chat_id (ForeignKey): The chat associated with the message.
        message_text (TextField): The text of the message.
        answer_text (TextField): The text of the answer (optional).
    """

    chat = models.ForeignKey(
        Chat,
        on_delete=models.CASCADE,
    )
    message_text = models.TextField()
    owner_agent = models.ForeignKey(
        Agent,
        on_delete=models.CASCADE,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    request = models.ForeignKey(
        'self',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='replies',
    )

    addressee_agent = models.ForeignKey(
        Agent,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='addressee',
    )

    def __str__(self):
        return f'{self.id} {self.owner_id}'
