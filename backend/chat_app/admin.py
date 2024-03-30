from django.contrib import admin
from .models import Chat

class ChatAdmin(admin.ModelAdmin):
    readonly_fields = ('id','updated_at','created_at')

    # Using raw ID fields for foreign keys. Allows to optimize loading time in admin panel
    raw_id_fields = ['owner_agent', 'addressee_agent']  

admin.site.register(Chat, ChatAdmin)