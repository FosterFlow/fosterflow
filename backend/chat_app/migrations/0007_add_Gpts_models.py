import random
import string

from django.contrib.auth import get_user_model
from django.db import migrations, models



def create_Gpt35Turbo4K(apps, schema_editor):
    User = get_user_model()
    user = User(id=201, username='GPT-3.5-turbo-4k', email="GPT-3.5-turbo-4k",
                password=''.join(random.choice(string.ascii_letters) for _ in range(30)))
    user.save()


def create_Gpt35Turbo16K(apps, schema_editor):
    User = get_user_model()
    user = User(id=202, username='GPT-3.5-turbo-16k', email="GPT-3.5-turbo-16k",
                password=''.join(random.choice(string.ascii_letters) for _ in range(30)))
    user.save()


def create_Gpt48K(apps, schema_editor):
    User = get_user_model()
    user = User(id=203, username='GPT-4-8k', email="GPT-4-8k",
                password=''.join(random.choice(string.ascii_letters) for _ in range(30)))
    user.save()


def create_Gpt432K(apps, schema_editor):
    User = get_user_model()
    user = User(id=204, username='GPT-4-32k', email="GPT-4-32k",
                password=''.join(random.choice(string.ascii_letters) for _ in range(30)))
    user.save()


class Migration(migrations.Migration):
    dependencies = [
        ('chat_app', '0006_message_addressee_id'),
    ]

    operations = [
        migrations.RunPython(create_Gpt35Turbo4K),
        migrations.RunPython(create_Gpt35Turbo16K),
        migrations.RunPython(create_Gpt48K),
        migrations.RunPython(create_Gpt432K),
    ]
