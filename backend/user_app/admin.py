from django.contrib import admin

from .models import User, ProfileUser

admin.site.register(User)
admin.site.register(ProfileUser)
