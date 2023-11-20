import os
from django.db import models
from django.template.defaultfilters import slugify
from .validators import compress_image

def get_image_filename(instance, filename):
    name = instance.user_id.username
    slug = slugify(name)
    return f"avatars/{slug}-{filename}"


class AiAgentProfileModel(models.Model):
    ai_model = models.ForeignKey(AiModels, on_delete=models.CASCADE)
    price_per_token = models.DecimalField(decimal_places=5, max_digits=10)
    description = models.TextField(max_length=2000)
    avatar = models.ImageField(upload_to=get_image_filename, blank=True)

    @property
    def filename(self):
        return os.path.basename(self.image.name)

    def save(self, force_insert=False, force_update=False, using=None, *args, **kwargs):

        if self.avatar:
            image = self.avatar
            if image.size > 0.3 * 1024 * 1024:
                self.avatar = compress_image(image)
        super(AiAgentProfileModel, self).save(*args, **kwargs)

    def __str__(self):
        return f'{self.pk} {self.ai_model}'