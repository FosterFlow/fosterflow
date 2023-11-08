from django.db import models
from django.contrib import admin

# Create your models here.

class UserAgentProfilesAdmin(admin.ModelAdmin):
    readonly_fields = ('id','updated_at','created_at')