from django.contrib import admin
from .models import EmailConfirmationToken

class EmailConfirmationTokenAdmin(admin.ModelAdmin):
    readonly_fields = ('id','expires_at','created_at')

    # Using raw ID fields for foreign keys. Allows to optimize loading time in admin panel
    raw_id_fields = ['user']

admin.site.register(EmailConfirmationToken, EmailConfirmationTokenAdmin)
