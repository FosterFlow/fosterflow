from django.db import migrations

def set_addressee_agent_for_chats(apps, schema_editor):
    Chat = apps.get_model('chat_app', 'Chat')
    Agent = apps.get_model('agent_app', 'Agent')
    Message = apps.get_model('message_app', 'Message')
    
    # Attempt to fetch the Agent with name='GPT 3.5 Turbo'
    addressee_agent_gpt_35_turbo = Agent.objects.filter(name='GPT 3.5 Turbo').first()
    
    if addressee_agent_gpt_35_turbo:
        chats = Chat.objects.all()
        # If the Agent exists, update all Chat instances
        chats.update(addressee_agent=addressee_agent_gpt_35_turbo)

        for chat in chats:
            # Update messages related to this chat where 'owner_agent' is 'addressee_agent_gpt_35_turbo'
            Message.objects.filter(chat=chat, owner_agent=addressee_agent_gpt_35_turbo).update(addressee_agent=chat.owner_agent)

    else:
        # If the Agent does not exist, log a warning or take other actions
        print("Agent with name='GPT 3.5 Turbo' does not exist. No updates made to Chat instances.")

class Migration(migrations.Migration):

    dependencies = [
        ('chat_app', '0005_alter_chat_addressee_agent_alter_chat_owner_agent'),  # Adjust this to the correct dependency
        ('ai_model_app', '0002_add_gpt_models'),  # Ensure this migration runs after all Agent migrations
         ('message_app', '0002_updating_addresse_agent_to_gpt35'), 
    ]

    operations = [
        migrations.RunPython(set_addressee_agent_for_chats),
    ]