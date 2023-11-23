from django.db import models
from user_app.models import User
from ai_model_app.models import AiModel


class Agent(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, related_name='agents', null=True, blank=True)
    ai_model = models.ForeignKey(AiModel, on_delete=models.SET_NULL, related_name='agents', null=True, blank=True)
    name = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    # TODO: add an avatar image ???

    def __str__(self):
        if self.user:
            return f"{self.pk} User: {self.user.email} "
        elif self.ai_model:
            return f"{self.pk} Model: {self.ai_model.title}"
        else:
            return f"{self.pk}"