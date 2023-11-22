from .models import AiAgentProfile
from django.contrib import admin

# Register your models here.

class AiAgentProfileAdmin(admin.ModelAdmin):
    readonly_fields = ('ai_agent_id','updated_at','created_at')

admin.site.register(AiAgentProfile, AiAgentProfileAdmin)