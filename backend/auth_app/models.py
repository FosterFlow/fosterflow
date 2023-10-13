import os
from django.db import models
from django.utils import timezone
from user_app.models import User


EMAIL_TOKEN_LIFETIME_HOURS = os.environ.get('EMAIL_TOKEN_LIFETIME_HOURS', 24)


class EmailConfirmationToken(models.Model):
    """
    Model to store email confirmation tokens.

    This model represents a token used for email confirmation.
    It stores the creation timestamp, the associated user, and a unique key.

    Fields:
        created_at (DateTimeField): The timestamp when the token was created.
        user (ForeignKey): The user associated with the token.
        key (CharField): The unique key representing the token.
    """

    class Meta:
        verbose_name = "Email Confirm Token"
        verbose_name_plural = "Email Confirm Tokens"

    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    key = models.CharField(
        max_length=64,
        db_index=True,
        unique=True
    )
