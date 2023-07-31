from django.contrib import admin
from .models import Chat, Message
from django.contrib import admin


class MessageModelAdmin(admin.ModelAdmin):
    list_filter = [
        "chat_id",
    ]


admin.site.register(Chat)
admin.site.register(Message, MessageModelAdmin)
