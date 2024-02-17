from .models import AiModel
from django.contrib import admin

class AiModelAdmin(admin.ModelAdmin):
    readonly_fields = ('id','updated_at','created_at')

admin.site.register(AiModel, AiModelAdmin)
