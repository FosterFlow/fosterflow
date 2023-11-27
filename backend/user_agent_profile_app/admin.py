from django.contrib import admin
from .models import UserAgentProfile

class UserAgentProfileAdmin(admin.ModelAdmin):
    readonly_fields = ('id', 'user_agent','updated_at','created_at')

admin.site.register(UserAgentProfile, UserAgentProfileAdmin)
