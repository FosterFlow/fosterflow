from django.db.models.signals import post_save
from django.dispatch import receiver
from agent_app.models import Agent
from user_agent_profile_app.models import UserAgentProfile

@receiver(post_save, sender=Agent)
def create_user_agent_profile(sender, instance, created, **kwargs):
    if created:
        UserAgentProfile.objects.create(user_agent=instance)

@receiver(post_save, sender=Agent)
def set_default_agent_name(sender, instance, created, **kwargs):
    # Check if the instance is newly created and has no name set
    if created and not instance.name:
        instance.name = f"agent_{instance.id}"
        instance.save()