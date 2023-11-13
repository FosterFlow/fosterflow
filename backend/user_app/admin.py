from django.contrib import admin
from .models import User

class UserAdmin(admin.ModelAdmin):
    readonly_fields = ('id','updated_at','created_at')

admin.site.register(User, UserAdmin)
