from .models import NlpModel, ProfileModel
from django.contrib import admin

class NlpModelAdmin(admin.ModelAdmin):
    readonly_fields = ('id','updated_at','created_at')

admin.site.register(NlpModel, NlpModelAdmin)

class ProfileModelAdmin(admin.ModelAdmin):
    readonly_fields = ('id','updated_at','created_at')

admin.site.register(ProfileModel)
