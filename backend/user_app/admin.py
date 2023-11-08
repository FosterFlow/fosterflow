from django.contrib import admin
from .models import User, ProfileUser

class UserAdmin(admin.ModelAdmin):
    readonly_fields = ('id','updated_at','created_at')

admin.site.register(User, UserAdmin)

class ProfileUserAdmin(admin.ModelAdmin):
    readonly_fields = ('id','updated_at','created_at')

admin.site.register(ProfileUser, ProfileUserAdmin)
