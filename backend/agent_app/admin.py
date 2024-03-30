from django.contrib import admin
from .models import Agent

class AgentAdmin(admin.ModelAdmin):
    readonly_fields = ('id','updated_at','created_at')

    # Using raw ID fields for foreign keys. Allows to optimize loading time in admin panel
    raw_id_fields = ['user', 'ai_model'] 

admin.site.register(Agent, AgentAdmin)
