from django.db.models.signals import post_save
from django.dispatch import receiver
from agent_app.models import Agent
from user_agent_profile_app.models import UserAgentProfile

@receiver(post_save, sender=Agent)
def create_user_agent_profile(sender, instance, created, **kwargs):
    if created:
        UserAgentProfile.objects.create(user_agent=instance)

@receiver(post_save, sender=Agent)
def save_user_agent_profile(sender, instance, **kwargs):
    instance.useragentprofiles.save()