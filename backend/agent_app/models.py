from django.db import models
from user_app.models import User
from nlp_models_app.models import NlpModel


class Agent(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, related_name='users', null=True, blank=True)
    nlp_model = models.ForeignKey(NlpModel, on_delete=models.SET_NULL, related_name='nlp_models', null=True, blank=True)
    name = models.CharField(max_length=50, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        if self.user:
            return f"{self.pk} User: {self.user.email} "
        elif self.nlp_model:
            return f"{self.pk} Model: {self.nlp_model.title}"
        else:
            return f"{self.pk}"
