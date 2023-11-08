from django.contrib import admin
from .models import Chat

class ChatAdmin(admin.ModelAdmin):
    readonly_fields = ('id','updated_at','created_at')

admin.site.register(Chat, ChatAdmin)