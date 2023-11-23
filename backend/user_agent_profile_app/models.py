from django.db import models
from django.template.defaultfilters import slugify
from .validators import compress_image
from agent_app.models import Agent

# Create your models here.

def get_image_filename(instance, filename):
    name = instance.user_agent.name
    slug = slugify(name)
    return f"avatars/{slug}-{filename}"

class UserAgentProfile(models.Model):
    user_agent = models.OneToOneField(Agent, on_delete=models.CASCADE, primary_key=True)
    avatar = models.ImageField(upload_to=get_image_filename, blank=True)
    first_name = models.TextField(max_length=32)
    last_name = models.TextField(max_length=32)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.id} {self.user_agent.name}'

    @property
    def filename(self):
        return os.path.basename(self.image.name)

    def save(self, force_insert=False, force_update=False, using=None, *args, **kwargs):

        if self.avatar:
            image = self.avatar
            if image.size > 0.3 * 1024 * 1024:
                self.avatar = compress_image(image)
        super(UserAgentProfile, self).save(*args, **kwargs)