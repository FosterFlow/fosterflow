from django.core.management.base import BaseCommand
from user_app.models import User

class Command(BaseCommand):
    help = 'Display a list of all users'

    def handle(self, *args, **kwargs):
        users = User.objects.all()
        for user in users:
            self.stdout.write(self.style.SUCCESS(user.username))
