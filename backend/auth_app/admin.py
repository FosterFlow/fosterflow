from django.contrib import admin
from .models import EmailConfirmationToken

class EmailConfirmationTokenAdmin(admin.ModelAdmin):
    readonly_fields = ('id','expires_at','created_at')

admin.site.register(EmailConfirmationToken, EmailConfirmationTokenAdmin)
