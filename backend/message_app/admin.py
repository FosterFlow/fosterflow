from django.contrib import admin
from .models import Message

class MessageModelAdmin(admin.ModelAdmin):
    readonly_fields = ('id','updated_at','created_at')
    list_filter = [
        "chat_id",
    ]

    # Using raw ID fields for foreign keys. Allows to optimize loading time in admin panel
    raw_id_fields = ['chat', 'owner_agent', 'addressee_agent', 'request']  

admin.site.register(Message, MessageModelAdmin)