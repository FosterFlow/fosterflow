from .models import AiAgentProfiles
from django.contrib import admin

# Register your models here.

class AiAgentProfileAdmin(admin.ModelAdmin):
    readonly_fields = ('id','updated_at','created_at')

admin.site.register(AiAgentProfileAdmin)