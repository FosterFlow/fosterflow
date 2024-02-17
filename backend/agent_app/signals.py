from django.db.models.signals import post_save
from django.dispatch import receiver
from agent_app.models import Agent
from user_agent_profile_app.models import UserAgentProfile
from ai_agent_profile_app.models import AiAgentProfile

@receiver(post_save, sender=Agent)
def create_user_agent_profile(sender, instance, created, **kwargs):
    if created and instance.user_id is not None:
        UserAgentProfile.objects.create(user_agent=instance)

@receiver(post_save, sender=Agent)
def create_ai_agent_profile(sender, instance, created, **kwargs):
    if created and instance.ai_model is not None:
        AiAgentProfile.objects.create(ai_agent=instance)


@receiver(post_save, sender=Agent)
def set_default_agent_name(sender, instance, created, **kwargs):
    # Check if the instance is newly created and has no name set
    if created and not instance.name:
        instance.name = f"agent_{instance.id}"
        instance.save()