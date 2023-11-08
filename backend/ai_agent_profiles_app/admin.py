from django.contrib import admin

# Register your models here.

class AgentProfilesAdmin(admin.ModelAdmin):
    readonly_fields = ('id','updated_at','created_at')
