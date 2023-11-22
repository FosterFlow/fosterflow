from django.contrib import admin
from .models import Message

class MessageModelAdmin(admin.ModelAdmin):
    readonly_fields = ('id','updated_at','created_at')
    list_filter = [
        "chat_id",
    ]


admin.site.register(Message, MessageModelAdmin)