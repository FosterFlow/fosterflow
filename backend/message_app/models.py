from django.db import models
from django.utils.timezone import now
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
        related_name='request_messages',
    )

    addressee_agent = models.ForeignKey(
        Agent,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='addresse_agent_messages',
    )

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)  # Save the message first
        self.chat.updated_at = now()   # Set the current time on the associated chat
        self.chat.save() 

    def __str__(self):
        return f'{self.id} {self.owner_agent}'
