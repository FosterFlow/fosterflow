from django.db import models
from django.conf import settings


class Chat(models.Model):
    """
    Model representing a dialog.

    Attributes:
        user_id (ForeignKey): The user associated with the dialog.
        name (TextField): The name of the dialog.
        created_at (DateTimeField): The date and time of dialog creation.
        updated_at (DateTimeField): The date and time of dialog update.
    """

    user_id = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
    )
    name = models.TextField(max_length=32)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.id} {self.user_id}'


class Message(models.Model):
    """
    Model representing a message.

    Attributes:
        dialog_id (ForeignKey): The dialog associated with the message.
        message_text (TextField): The text of the message.
        answer_text (TextField): The text of the answer (optional).
    """

    dialog_id = models.ForeignKey(
        Chat,
        on_delete=models.CASCADE,
    )
    message_text = models.TextField()
    answer_text = models.TextField(blank=True)

    def __str__(self):
        return f'{self.id} {self.dialog_id.user_id}'
