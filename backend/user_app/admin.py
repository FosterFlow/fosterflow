from django.contrib import admin

from .models import User, Agent

admin.site.register(User)
admin.site.register(Agent)
