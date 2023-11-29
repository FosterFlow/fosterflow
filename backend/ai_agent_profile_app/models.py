import os
from django.db import models
from django.template.defaultfilters import slugify
from .validators import compress_image
from agent_app.models import Agent

def get_image_filename(instance, filename):
    name = instance.user_id.username
    slug = slugify(name)
    return f"avatars/{slug}-{filename}"


class AiAgentProfile(models.Model):
    ai_agent = models.OneToOneField(Agent, on_delete=models.CASCADE)
    description = models.TextField(max_length=2000)
    avatar = models.ImageField(upload_to=get_image_filename, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def filename(self):
        return os.path.basename(self.image.name)

    def save(self, force_insert=False, force_update=False, using=None, *args, **kwargs):

        if self.avatar:
            image = self.avatar
            if image.size > 0.3 * 1024 * 1024:
                self.avatar = compress_image(image)
        super(AiAgentProfile, self).save(*args, **kwargs)

    def __str__(self):
        return f'{self.id} {self.ai_agent.name}'