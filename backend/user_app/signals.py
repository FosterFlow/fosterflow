from django.contrib.auth import get_user_model
from django.db.models.signals import post_save
from django.dispatch import receiver

from agent_app.models import Agent

User = get_user_model()

@receiver(post_save, sender=User)
def create_agent(sender, instance, created, **kwargs):
    if created:
        Agent.objects.create(user_id=instance.id)
