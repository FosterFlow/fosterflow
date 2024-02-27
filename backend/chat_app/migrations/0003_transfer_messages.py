# Generated by Django 4.2.1 on 2024-02-22 10:34

from django.db import migrations

def transfer_messages(apps, schema_editor):
    OldMessage = apps.get_model('chat_app', 'Message')
    NewMessage = apps.get_model('message_app', 'Message')
    
    for old_message in OldMessage.objects.all():
        NewMessage.objects.create(
            chat_id=old_message.chat_id_id,
            message_text=old_message.message_text,
            owner_agent_id=old_message.owner_id_id,
            created_at=old_message.created_at,
            #TODO: add addressee_agent field, we can fill this field once we will know GPT3.5 agent id
            # Map all necessary fields accordingly
        )
    

class Migration(migrations.Migration):

    dependencies = [
        ('message_app', '0001_initial'),
        ('chat_app', '0002_initial'),
        ('user_app', '0002_transfer_agent_data'),
    ]

    operations = [
        migrations.RunPython(transfer_messages),
    ]