from django.db.models.signals import post_save
from django.dispatch import receiver
from agent_app.models import Agent
from user_agent_profiles_app.models import UserAgentProfiles

@receiver(post_save, sender=Agent)
def create_user_agent_profile(sender, instance, created, **kwargs):
    if created:
        UserAgentProfiles.objects.create(agent=instance)

@receiver(post_save, sender=Agent)
def save_user_agent_profile(sender, instance, **kwargs):
    instance.useragentprofiles.save()