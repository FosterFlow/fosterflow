from django.db import migrations
from agent_app.models import Agent
from ai_model_app.models import AiModel

def create_Gpt35Turbo(apps, schema_editor):
    ai_model = AiModel.objects.create(title='GPT-3.5-turbo')
    ai_model.save()
    agent = Agent.objects.create(name='GPT 3.5 Turbo', ai_model=ai_model)
    agent.save()

def create_Gpt48K(apps, schema_editor):
    ai_model = AiModel.objects.create(title='gpt-4-turbo-preview')
    ai_model.save()
    agent = Agent.objects.create(name='GPT 4 Turbo', ai_model=ai_model)
    agent.save()


class Migration(migrations.Migration):
    dependencies = [
        ('agent_app', '0001_initial'),
        ('ai_model_app', '0001_initial'),
        ('chat_app', '0008_alter_chat_addressee_id_alter_chat_owner_id_and_more'),
    ]

    operations = [
        migrations.RunPython(create_Gpt35Turbo),
        migrations.RunPython(create_Gpt48K),
    ]
