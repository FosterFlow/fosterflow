from django.contrib import admin
from .models import Agent

class AgentAdmin(admin.ModelAdmin):
    readonly_fields = ('id','updated_at','created_at')

admin.site.register(Agent, AgentAdmin)
